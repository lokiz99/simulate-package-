import React from 'react';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertOctagon,
  Percent,
  ArrowUpRight,
  Eye,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { STATUS_MAP, PRIORITY_MAP } from '../data/mockData';

const STATUS_COLORS = {
  Delivered: '#10b981',
  'In Transit': '#0ea5e9',
  Processing: '#f59e0b',
  Backlog: '#f43f5e',
  Pending: '#8b5cf6',
};

const DashboardView = ({ onNavigateToOrders, onNavigateToSimulation }) => {
  const { metrics, orders, historyMetrics, setSelectedOrder, warehouses } = useSimulation();

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const statusDonutData = Object.entries(statusCounts).map(([statusKey, value]) => ({
    name: STATUS_MAP[statusKey] || statusKey,
    rawStatus: statusKey,
    value,
    color: STATUS_COLORS[statusKey] || '#94a3b8'
  }));

  const whBarData = warehouses.map(w => ({
    name: w.code,
    fullName: w.name,
    '排队待处理': w.currentQueue,
    '正在分拣': w.inProcessing,
    '额定库容': w.capacity
  }));

  const recentOrders = orders.slice(0, 7);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Standard':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Economy':
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'In Transit':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'Processing':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Backlog':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Pending':
      default:
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/40 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">全域物流分发与供应链监控驾驶舱</h2>
          <p className="text-xs text-slate-400 mt-1">
            实时管线全流程追踪：入库排队、枢纽分拣、在途干线追踪与电子防伪签收。
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToSimulation}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <span>进入仿真控制台</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">全网订单总量</span>
            <Package className="h-4 w-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.totalOrders}</div>
          <div className="text-[11px] text-slate-500 mt-1">覆盖全国分拨网络</div>
        </div>

        {/* Orders Processing */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">仓库处理中</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">{metrics.ordersProcessing}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">正在拣选与打包</div>
        </div>

        {/* In Transit */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">干线在途中</span>
            <Truck className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300 font-mono">{metrics.inTransit}</div>
          <div className="text-[11px] text-sky-400/80 mt-1">干线车辆在途配送</div>
        </div>

        {/* Delivered / Receipts */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">妥投送达 / 回单</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">{metrics.delivered}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">POD电子回单已核验</div>
        </div>

        {/* Backlog */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">排队积压</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">{metrics.backlog}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">库容或运力受限滞留</div>
        </div>

        {/* Delivery Success Rate */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">履约达成率</span>
            <Percent className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-300 font-mono">{metrics.deliverySuccessRate}%</div>
          <div className="text-[11px] text-teal-400/80 mt-1">全网准时妥投考核</div>
        </div>
      </div>

      {/* CHARTS ROW 1: Daily Order Flow & Delivery Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Order Pipeline Progression */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">每日订单流向与管线吞吐负荷</h3>
              <p className="text-xs text-slate-400">全网录入、在途车队与妥投完成时序推移趋势</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-brand-400" />
                <span>总入库</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>干线在途</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>已送达</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTransit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="总入库量" />
                <Area type="monotone" dataKey="inTransit" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTransit)" name="干线在途" />
                <Area type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDelivered)" name="妥投完成" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">订单实时流转状态分布</h3>
            <p className="text-xs text-slate-400">当前仿真网络中各生命周期订单占比</p>
          </div>

          <div className="h-52 w-full my-auto flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-white">{metrics.totalOrders}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">总订单</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            {statusDonutData.map((s) => (
              <div key={s.name} className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300 truncate">{s.name}:</span>
                <span className="font-mono font-semibold text-white ml-auto">{s.value} 单</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: Warehouse Processing Capacity & Recent Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Load vs Capacity */}
        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">各分拨中心排队与分拣负荷</h3>
            <p className="text-xs text-slate-400">待处理排队 vs 正在分拣负荷对比</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={whBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="排队待处理" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="正在分拣" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">全网最新流转订单</h3>
              <p className="text-xs text-slate-400">实时展示在物流网络各环节穿梭的订单流水</p>
            </div>
            <button
              onClick={onNavigateToOrders}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1"
            >
              <span>查看全部 ({orders.length})</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">订单编号</th>
                  <th className="py-2.5 px-3">客户名称</th>
                  <th className="py-2.5 px-3">目的城市</th>
                  <th className="py-2.5 px-3">订单状态</th>
                  <th className="py-2.5 px-3">优先级</th>
                  <th className="py-2.5 px-3 text-right">回单核验 / 操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {recentOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-200 group-hover:text-brand-400">
                      {ord.id}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium max-w-[140px] truncate">
                      {ord.customer}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {ord.destination}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${getStatusBadge(ord.status)}`}>
                        {STATUS_MAP[ord.status] || ord.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${getPriorityBadge(ord.priority)}`}>
                        {PRIORITY_MAP[ord.priority] || ord.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {ord.signedReceipt ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <ShieldCheck className="h-3 w-3" />
                          <span>已电子签收</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 inline-flex items-center space-x-1 group-hover:text-slate-300">
                          <Eye className="h-3.5 w-3.5" />
                          <span>查看详情</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
