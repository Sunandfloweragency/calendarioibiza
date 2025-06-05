import React, { useState } from 'react';
import CMSLayout from '../components/cms/CMSLayout';
import { useData } from '../contexts/DataContext';
import { UserData, UserRole } from '../types';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { ADMIN_USER_ID } from '../constants';
import { 
  PencilIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';


const AdminUsersPage: React.FC = () => {
  const { users, toggleUserBan, changeUserRole, isLoading } = useData();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleToggleBan = async (userId: string) => {
    if (!currentUser || userId === ADMIN_USER_ID) return; 
    setIsSubmitting(true);
    try {
      await toggleUserBan(userId, currentUser.id);
    } catch (error) {
      console.error("Failed to toggle ban status:", error);
      alert("Error updating ban status.");
    }
    setIsSubmitting(false);
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    if (!currentUser || userId === ADMIN_USER_ID) return; 
     if (newRole === 'admin' && !window.confirm("Are you sure you want to promote this user to Admin?")) return;
    setIsSubmitting(true);
    try {
      await changeUserRole(userId, newRole, currentUser.id);
    } catch (error) {
      console.error("Failed to change role:", error);
      alert("Error changing user role.");
    }
    setIsSubmitting(false);
  };
  
  const sortedUsers = [...users].sort((a,b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());


  return (
    <CMSLayout title={t('admin.users.title')}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
      ) : users.length === 0 ? (
        <p className="text-brand-gray text-center py-8">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-brand-surface rounded-lg shadow-main-card custom-scrollbar">
          <table className="min-w-full divide-y divide-brand-surface-variant/50">
            <thead className="bg-brand-surface-variant/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-brand-purple uppercase tracking-wider">Name / Username / Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-brand-purple uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-brand-purple uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-brand-purple uppercase tracking-wider">Registered</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-brand-purple uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-surface-variant/50">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-brand-surface-variant/60 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand-light">{user.name || user.username}</div>
                    <div className="text-xs text-brand-gray">{user.email}</div>
                    {user.name && user.username !== user.name && <div className="text-xs text-brand-gray">(Username: {user.username})</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.id === ADMIN_USER_ID ? (
                        <span className="text-sm text-brand-orange font-semibold">{user.role}</span>
                    ) : (
                        <select 
                            value={user.role} 
                            onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                            className="text-sm bg-brand-surface-variant border border-brand-surface rounded-md text-brand-light focus:ring-1 focus:ring-brand-orange focus:border-brand-orange p-1.5 transition-colors"
                            disabled={isSubmitting}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                      user.isBanned ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.id !== ADMIN_USER_ID && (
                       <Button 
                          variant={user.isBanned ? 'secondary' : 'danger'} 
                          size="sm"
                          onClick={() => handleToggleBan(user.id)}
                          disabled={isSubmitting}
                          className="hover:shadow-lg"
                        >
                          {user.isBanned ? 'Unban' : 'Ban'} User
                        </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CMSLayout>
  );
};

export default AdminUsersPage;
