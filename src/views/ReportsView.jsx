import React, { useMemo } from 'react';
import {
  Download,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { PRIORITY_MAP } from '../data/mockData';

const PRIORITY_COLORS = {
  Urgent: '#f43f5e',
  High: '#f59e0b',
  Standard: '#38bdf8',
  Economy: '#94a3b8'
};

const ReportsView = () => {
  const { orders, warehouses, metrics, historyMetrics, exportOrdersCSV } = useSimulation();

  const priorityDistribution = useMemo(() => {
    const counts = { Urgent: 0, High: 0, Standard: 0, Economy: 0 };
    orders.forEach(o => {
      if (counts[o.priority] !== undefined) {
        counts[o.priority]++;
      } else {
        counts[o.priority] = 1;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: PRIORITY_MAP[name] ? `${PRIORITY_MAP[name]}优先级` : name,
      rawName: name,
      value,
      color: PRIORITY_COLORS[name] || '#94a3b8'
    }));
  }, [orders]);

  const warehousePerformance = useMemo(() => {
    return warehouses.map(w => {
      const whOrders = orders.filter(o => o.warehouseId === w.id);
      const deliveredCount = whOrders.filter(o => o.status === 'Delivered').length;
      const backloggedCount = whOrders.filter(o => o.status === 'Backlog').length;
      const total = whOrders.length;

      return {
        code: w.code,
        name: w.name,
        Total: total,
        Delivered: deliveredCount,
        Backlog: backloggedCount,
        Rate: total === 0 ? 100 : Math.round((deliveredCount / total) * 100)
      };
    });
  }, [warehouses, orders]);

  return (
    <div className="space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">物流数据分析与运营审计报表</h2>
          <p className="text-xs text-slate-400 mt-1">
            端到端履约时效指标、积压滞留诊断以及合规级订单审计导出。
          </p>
        </div>

        <button
          onClick={exportOrdersCSV}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-900/30 transition-all self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>导出全量订单数据 (CSV)</span>
        </button>
      </div>

      {/* KPI REPORT METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">全网订单流转总量</span>
          <div className="text-2xl font-bold font-mono text-white">{metrics.totalOrders} 单</div>
          <span className="text-[11px] text-slate-500 mt-1 block">流转管线累计总量</span>
        </div>

        {/* Delivery Performance */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">妥投送达完成数</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">{metrics.delivered} 单</div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">POD电子回单已查验</span>
        </div>

        {/* Backlog Statistics */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">排队积压滞留总量</span>
          <div className="text-2xl font-bold font-mono text-rose-400">{metrics.backlog} 单</div>
          <span className="text-[11px] text-rose-400/80 mt-1 block">库容受限滞留包裹</span>
        </div>

        {/* Average Processing Time */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">平均出库拣选时效</span>
          <div className="text-2xl font-bold font-mono text-amber-300">{metrics.avgProcessingTime}</div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">入库到干线发运耗时</span>
        </div>

        {/* Delivery Success Rate */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">妥投履约达成率</span>
          <div className="text-2xl font-bold font-mono text-teal-300">{metrics.deliverySuccessRate}%</div>
          <span className="text-[11px] text-teal-400/80 mt-1 block">全程时效达标考核</span>
        </div>
      </div>

      {/* HISTORICAL CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fulfillment Velocity */}
        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">仿真周期内的履约流速与积压走势</h3>
            <p className="text-xs text-slate-400">全网各时段履约送达、在途与积压事件趋势</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2.5} name="妥投送达" dot={false} />
                <Line type="monotone" dataKey="inTransit" stroke="#0ea5e9" strokeWidth={2} name="干线在途" dot={false} />
                <Line type="monotone" dataKey="backlog" stroke="#f43f5e" strokeWidth={2} name="队列积压" strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Distribution */}
        <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">订单优先级结构分布</h3>
            <p className="text-xs text-slate-400">紧急特快 vs 高优先级 vs 标准配送 vs 经济普运</p>
          </div>

          <div className="h-52 w-full my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
            {priorityDistribution.map((p) => (
              <div key={p.name} className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-slate-300 font-medium">{p.name}:</span>
                <span className="font-mono font-bold text-white">{p.value} 单</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HUB PERFORMANCE BREAKDOWN */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">区域分拨履约合规性对比</h3>
          <p className="text-xs text-slate-400">各分发枢纽妥投完成量及积压比率统计</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">枢纽代码</th>
                <th className="py-2.5 px-3">仓储枢纽名称</th>
                <th className="py-2.5 px-3">经办订单总量</th>
                <th className="py-2.5 px-3">妥投送达</th>
                <th className="py-2.5 px-3">滞留积压</th>
                <th className="py-2.5 px-3">履约达成率</th>
                <th className="py-2.5 px-3 text-right">审计结论</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {warehousePerformance.map((wp) => (
                <tr key={wp.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-brand-400">{wp.code}</td>
                  <td className="py-2.5 px-3 text-slate-200 font-medium">{wp.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{wp.Total} 单</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">{wp.Delivered} 单</td>
                  <td className="py-2.5 px-3 font-mono text-rose-400 font-semibold">{wp.Backlog} 单</td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">{wp.Rate}%</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" />
                      <span>达标合规</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
