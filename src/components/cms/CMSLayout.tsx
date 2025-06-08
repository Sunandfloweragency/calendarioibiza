import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  UserIcon as DjUserIcon, 
  UserGroupIcon, 
  BuildingStorefrontIcon, 
  ListBulletIcon, 
  UsersIcon as UsersManagementIcon 
} from '@heroicons/react/24/outline';

interface CMSLayoutProps {
  children: ReactNode;
  title: string;
}

const adminNavigationItems = [
  { name: "Panel de Control", path: "/admin/dashboard", icon: HomeIcon },
  { name: "Aprobaciones Pendientes", path: "/admin/pending-approvals", icon: ListBulletIcon },
  { name: "Gestionar Eventos", path: "/admin/events", icon: CalendarDaysIcon },
  { name: "Gestionar DJs", path: "/admin/djs", icon: DjUserIcon },
  { name: "Gestionar Promotoras", path: "/admin/promoters", icon: UserGroupIcon },
  { name: "Gestionar Clubs", path: "/admin/clubs", icon: BuildingStorefrontIcon },
  { name: "Gestionar Usuarios", path: "/admin/users", icon: UsersManagementIcon },
];

const CMSLayout: React.FC<CMSLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] bg-gray-50">
      <aside className="w-full md:w-72 bg-white p-5 md:p-6 md:sticky md:top-[calc(5rem+1px)] md:self-start md:h-[calc(100vh-5rem-150px)] md:overflow-y-auto rounded-xl shadow-xl mb-6 md:mb-0 md:mr-8 border border-gray-200">
        <h2 className="text-2xl font-headings font-bold text-gray-800 mb-8 hidden md:block tracking-tight border-b border-gray-200 pb-4">
          🎵 Panel Admin CMS
        </h2>
        
        <nav className="flex flex-row md:flex-col md:space-y-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {adminNavigationItems.map(item => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out whitespace-nowrap mr-2.5 md:mr-0 transform group
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105 border-l-4 border-orange-600' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:shadow-md hover:scale-102 border-l-4 border-transparent hover:border-blue-500'}`
                }
              >
                <IconComponent className="h-5 w-5 mr-3.5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      
      <main className="flex-1 bg-white p-5 sm:p-8 rounded-xl shadow-xl animate-elegant-fade-in-up border border-gray-200">
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-headings font-bold text-gray-800 tracking-tight flex items-center">
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          {title}
            </span>
        </h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default CMSLayout;