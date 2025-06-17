import React from 'react';
import { Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/*
  Funciones sugeridas:
  - fetchDashboardStats(): Obtener estadísticas del dashboard
  - fetchRecentActivity(): Obtener actividad reciente
  - fetchTopProducts(): Obtener productos más vendidos
  - fetchMonthlyChartData(): Obtener datos para el gráfico
*/

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, iconBg }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs último mes</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen de tu actividad comercial</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ventas Totales"
          value="$45,230"
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Afiliados"
          value="23"
          change="+15.0%"
          trend="up"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Transacciones"
          value="156"
          change="-2.3%"
          trend="down"
          icon={<ShoppingCart className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>
    </div>
  );
}