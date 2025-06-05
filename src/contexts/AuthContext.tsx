import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_USER_ID } from '../constants'; 
import { AuthContextType, UserData } from '../types';
import cmsService from '../services/cmsService'; 

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserFromStorage = useCallback(() => {
    const storedUser = localStorage.getItem('s&f_currentUser');
    if (storedUser) {
      const parsedUser: UserData = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('s&f_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('s&f_currentUser');
    }
  }, [currentUser]);

  const login = async (username: string, password: string): Promise<UserData | null> => { 
    setIsLoading(true);
    
    // Usuarios de prueba predefinidos
    const testUsers = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        username: 'admin@sunflower.com',
        email: 'admin@sunflower.com',
        passwordHash: 'admin123',
        name: 'Admin Sun & Flower',
        role: 'admin' as const,
        isBanned: false,
        registrationDate: new Date().toISOString()
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        username: 'usuario@test.com',
        email: 'usuario@test.com',
        passwordHash: '12345678',
        name: 'Usuario de Prueba',
        role: 'user' as const,
        isBanned: false,
        registrationDate: new Date().toISOString()
      }
    ];

    // Verificar usuarios de prueba primero
    const testUser = testUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() || 
      u.email.toLowerCase() === username.toLowerCase()
    );
    
    if (testUser && testUser.passwordHash === password) {
      if (testUser.isBanned) {
        setIsLoading(false);
        throw new Error('User account is banned.');
      }
      
      // Asegurar que el usuario existe en el CMS
      let userToLogin = await cmsService.getUserByUsername(testUser.username);
      if (!userToLogin) {
        userToLogin = await cmsService.addUser({
          username: testUser.username,
          email: testUser.email,
          password: testUser.passwordHash,
          name: testUser.name,
          role: testUser.role
        });
      }
      
      setCurrentUser(userToLogin);
      setIsLoading(false);
      return userToLogin;
    }
    
    // Mantener lógica original para otros usuarios
    let userToLogin = await cmsService.getUserByUsername(username);

    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
        if (!userToLogin) { // Admin might not exist yet if storage was cleared
            userToLogin = await cmsService.addUser({
                username: ADMIN_USERNAME,
                email: "admin@sunflower.ibiza", // Placeholder, matches constant if needed
                password: ADMIN_PASSWORD,
                name: "Admin Sunflower",
                role: 'admin'
            });
        }
        // Verify password for admin
        if (userToLogin && userToLogin.passwordHash === ADMIN_PASSWORD) {
            setCurrentUser(userToLogin);
            setIsLoading(false);
            return userToLogin;
        }
    } else {
        // For regular users, check if user exists and password matches
        if (userToLogin && userToLogin.passwordHash === password) {
            if (userToLogin.isBanned) {
                setIsLoading(false);
                throw new Error('User account is banned.');
            }
            setCurrentUser(userToLogin);
            setIsLoading(false);
            return userToLogin;
        }
    }
    
    setCurrentUser(null);
    setIsLoading(false);
    return null;
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    name?: string,
    country?: string,
    preferredStyles?: string[],
    userProfileType?: UserData['userProfileType']
  ): Promise<UserData | null> => {
    setIsLoading(true);
    try {
      const existingUserByUsername = await cmsService.getUserByUsername(username);
      if (existingUserByUsername) {
        setIsLoading(false);
        throw new Error('Username already in use.'); 
      }
      const existingUserByEmail = await cmsService.getUserByEmail(email);
      if (existingUserByEmail) {
        setIsLoading(false);
        throw new Error('Email already in use.'); 
      }
      
      const newUser = await cmsService.addUser({ 
        username, 
        email, 
        password, 
        name, 
        role: 'user',
        country,
        preferredStyles,
        userProfileType
      });
      setCurrentUser(newUser); 
      setIsLoading(false);
      return newUser;
    } catch (error: any) {
      console.error("Registration failed:", error);
      setIsLoading(false);
      throw error; 
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return !!currentUser && currentUser.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
