import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header = ({ user = { name: 'John Doe', email: 'john@example.com' }, onMenuClick, isMobileMenuOpen }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Nueva venta completada', message: 'Venta #1234 por $1,250.00', time: 'Hace 5 min', unread: true },
    { id: 2, title: 'Bono aplicado', message: 'Se aplicó un bono de $125.00', time: 'Hace 15 min', unread: true },
    { id: 3, title: 'Nuevo afiliado', message: 'María García se unió como afiliado', time: 'Hace 1 hora', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and search */}
          <div className="flex items-center flex-1">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="hidden md:block ml-4 flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ventas, clientes, afiliados..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-4">
            {/* Search button for mobile */}
            <button className="p-2 rounded-md text-gray-400 md:hidden hover:text-gray-500 hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      Mi Perfil
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      Configuración
                    </a>
                    <hr className="my-1" />
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                      Cerrar Sesión
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );



}

export default Header