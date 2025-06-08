import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_USER_ID } from '../constants'; 
import { AuthContextType, UserData } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('s&f_currentUser');
      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log('Usuario cargado desde localStorage:', parsedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem('s&f_currentUser');
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
    
    try {
      console.log('Intento de login para:', username);
      
      // Usuarios de prueba predefinidos
      const testUsers = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          username: 'AdminSF',
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

      // Verificar usuarios de prueba
      const testUser = testUsers.find(u => 
        u.username.toLowerCase() === username.toLowerCase() || 
        u.email.toLowerCase() === username.toLowerCase()
      );
      
      console.log('Usuario encontrado en testUsers:', testUser);
      
      if (testUser && testUser.passwordHash === password) {
        if (testUser.isBanned) {
          setIsLoading(false);
          throw new Error('La cuenta de usuario está baneada.');
        }
        
        console.log('Login exitoso para usuario con rol:', testUser.role);
        setCurrentUser(testUser);
        setIsLoading(false);
        return testUser;
      }
      
      // Verificar admin usando constantes
      if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
        const adminUser: UserData = {
          id: ADMIN_USER_ID,
          username: ADMIN_USERNAME,
          email: 'admin@sunflower.ibiza',
          passwordHash: ADMIN_PASSWORD,
          name: 'Admin Sunflower',
          role: 'admin',
          isBanned: false,
          registrationDate: new Date().toISOString()
        };
        
        console.log('Login exitoso para admin con rol: admin');
        setCurrentUser(adminUser);
        setIsLoading(false);
        return adminUser;
      }
      
      // No se encontró usuario válido
      console.log('No se encontró usuario válido');
      setCurrentUser(null);
      setIsLoading(false);
      return null;
      
    } catch (error) {
      console.error('Error en login:', error);
      setCurrentUser(null);
      setIsLoading(false);
      throw error;
    }
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
      // Simular registro creando un nuevo usuario
      const newUser: UserData = {
        id: `user_${Date.now()}`,
        username,
        email,
        passwordHash: password,
        name: name || username,
        role: 'user',
        isBanned: false,
        registrationDate: new Date().toISOString(),
        country,
        preferredStyles,
        userProfileType
      };
      
      setCurrentUser(newUser);
      setIsLoading(false);
      return newUser;
      
    } catch (error: any) {
      console.error("Error en registro:", error);
      setIsLoading(false);
      throw error; 
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('s&f_currentUser');
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
