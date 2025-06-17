import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Wallet, 
  Users, 
  ChevronDown,
  ChevronRight,
  FileText,
  DollarSign,
  PersonStanding,
  Users2
} from 'lucide-react';
import { useEffect } from 'react';

interface SidebarProps {
  onClose: () => void;
}

interface NavItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: NavItem[];
}

const Sidebar = ({onClose }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navItems: NavItem[] = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    { 
      path: '/sales', 
      name: 'Ventas', 
      icon: <ShoppingCart className="w-5 h-5" />,
      subItems: [
        { path: '/sales', name: 'Lista de Ventas', icon: <FileText className="w-4 h-4" /> },
        { path: '/sales/new', name: 'Nueva Venta', icon: <DollarSign className="w-4 h-4" /> },
      ]
    },
    { 
      path: '/wallet', 
      name: 'Billetera', 
      icon: <Wallet className="w-5 h-5 cursor-pointer" />
    },
    { 
      path: '/affiliates', 
      name: 'Afiliados', 
      icon: <Users className="w-5 h-5 cursor-pointer" />,
      subItems: [
        { path: '/affiliates', name: 'Lista de afiliados', icon: <Users2 className='w-4 h-4'/>},
        { path: '/affiliates/new', name: 'Nuevo afiliado', icon: <PersonStanding className='w-4 h-4' />}
      ]
    },
  ];

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  // Nueva función para determinar si un elemento está activo
  const isActive = (path: string, hasSubItems: boolean = false) => {
    if (hasSubItems) {
      // Para elementos padre: solo activo si no hay subrutas más específicas activas
      return location.pathname === path;
    } else {
      // Para elementos sin hijos: comparación exacta
      return location.pathname === path;
    }
  };

  // Función para auto-expandir elementos padre cuando un hijo está activo
    useEffect(() => {
    const currentPath = location.pathname;
    navItems.forEach(item => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(subItem => subItem.path === currentPath);
        if (hasActiveChild && !expandedItems.includes(item.path)) {
          setExpandedItems(prev => [...prev, item.path]);
        }
      }
    });
  }, [location.pathname]);

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const isItemActive = isActive(item.path, hasSubItems);

    // Clases CSS dinámicas para el estado activo
    const getActiveClasses = (isActive: boolean) => {
      return isActive 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
    };

    const getIconClasses = (isActive: boolean) => {
      return isActive
        ? 'text-white'
        : 'text-gray-400 group-hover:text-gray-600';
    };

    return (
      <div key={item.path}>
        {hasSubItems ? (
          <button
            onClick={() => toggleExpanded(item.path)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm 
              font-medium rounded-md transition-colors group ${getActiveClasses(isItemActive)} 
              ${level > 0 ? 'ml-6' : ''}`}
          >
            <div className="flex items-center">
              <span className={getIconClasses(isItemActive)}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
              {item.badge && (
                <span className="ml-auto mr-2 inline-flex items-center px-2 py-0.5 
                rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={getIconClasses(isItemActive)}>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          </button>
        ) : (
          <NavLink
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md 
              transition-colors group ${level > 0 ? 'ml-6' : ''} ${
                isActive 
                  ? 'bg-blue-500 text-white hover:bg-blue-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        )}
        
        {hasSubItems && isExpanded && (
          <div className="mt-1">
            {item.subItems!.map(subItem => renderNavItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`flex`}>
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">Ventas Pro</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(item => renderNavItem(item))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar