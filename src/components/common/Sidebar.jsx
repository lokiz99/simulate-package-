import React from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  Package,
  Warehouse,
  Network,
  FileBarChart2,
  AlertTriangle,
  Truck
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'simulation', label: '仿真控制', icon: PlayCircle },
  { id: 'orders', label: '订单管理', icon: Package, badgeKey: 'activeOrders' },
  { id: 'warehouses', label: '仓库中心', icon: Warehouse, badgeKey: 'whAlerts' },
  { id: 'network', label: '配送网络', icon: Network },
  { id: 'reports', label: '数据报表', icon: FileBarChart2 }
];

const Sidebar = ({ currentTab, onSelectTab }) => {
  const { metrics, warehouses, config } = useSimulation();

  const activeOrdersCount = metrics.ordersProcessing + metrics.inTransit;
  const bottleneckedWarehouses = warehouses.filter(w => w.status === 'Bottlenecked').length;

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
          功能导航
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Badges */}
                {item.badgeKey === 'activeOrders' && activeOrdersCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {activeOrdersCount}
                  </span>
                )}
                {item.badgeKey === 'whAlerts' && bottleneckedWarehouses > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-0.5">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{bottleneckedWarehouses}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Network Health Summary Card */}
      <div className="p-4 m-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
            <Truck className="h-4 w-4 text-brand-400" />
            <span>干线运力占用</span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-200">
            {metrics.inTransit} / {config.deliveryCapacity} 辆
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              metrics.inTransit / config.deliveryCapacity > 0.85
                ? 'bg-rose-500'
                : metrics.inTransit / config.deliveryCapacity > 0.6
                ? 'bg-amber-400'
                : 'bg-brand-500'
            }`}
            style={{ width: `${Math.min(100, (metrics.inTransit / config.deliveryCapacity) * 100)}%` }}
          />
        </div>

        {metrics.backlog > 0 && (
          <div className="flex items-center space-x-1.5 text-[11px] text-amber-400/90 pt-1">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>当前有 {metrics.backlog} 笔订单处于排队积压</span>
          </div>
        )}

        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>综合交付率</span>
          <span className="font-mono text-emerald-400 font-semibold">{metrics.deliverySuccessRate}%</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
