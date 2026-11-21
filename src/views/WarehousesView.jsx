import React from 'react';
import {
  Warehouse,
  MapPin,
  Users
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const WarehousesView = () => {
  const { warehouses, config } = useSimulation();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Bottlenecked':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Near Capacity':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Optimal':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Bottlenecked':
        return '严重超载';
      case 'Near Capacity':
        return '负荷偏高';
      case 'Optimal':
      default:
        return '运行良好';
    }
  };

  const getUtilColor = (util) => {
    if (util > 90) return 'bg-rose-500';
    if (util > 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">区域分拨中心与仓储枢纽</h2>
          <p className="text-xs text-slate-400 mt-1">
            实时掌握各大区核心仓储枢纽：库容负荷、分拣效率、排队积压以及在岗人员调度。
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">当前活跃运行枢纽：</span>
          <span className="font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            {Math.min(warehouses.length, config.activeWarehousesCount)} / {warehouses.length} 个
          </span>
        </div>
      </div>

      {/* WAREHOUSE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {warehouses.map((wh, idx) => {
          const isActive = idx < config.activeWarehousesCount;
          const effCapacity = Math.round(wh.capacity * config.warehouseCapacityMultiplier);
          const totalLoad = wh.currentQueue + wh.inProcessing;
          const utilPct = Math.min(100, Math.round((totalLoad / Math.max(1, effCapacity)) * 100));

          return (
            <div
              key={wh.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden shadow-sm ${
                isActive
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-50'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                      style={{ backgroundColor: wh.color || '#38bdf8' }}
                    >
                      <Warehouse className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-100 text-sm">{wh.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400 text-xs mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span>{wh.city}</span>
                        <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300 ml-1">
                          {wh.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] tracking-wider font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(wh.status)}`}>
                    {isActive ? getStatusText(wh.status) : '未启用'}
                  </span>
                </div>

                {/* Utilization Gauge */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">当前库容利用率</span>
                    <span className="font-mono font-bold text-slate-200">{utilPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getUtilColor(utilPct)}`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                    <span>当前负荷: {totalLoad} 单</span>
                    <span>额定上限: {effCapacity} 单</span>
                  </div>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">待分拣排队</span>
                    <span className="text-sm font-bold font-mono text-amber-400">{wh.currentQueue} 单</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">额定处理速率</span>
                    <span className="text-sm font-bold font-mono text-brand-400">{wh.processingRate} 单/周期</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">正在分拣打包</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{wh.inProcessing} 单</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">累计完成发运</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">{wh.dispatchedCount} 单</span>
                  </div>
                </div>
              </div>

              {/* Staffing info */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>当前在岗班组：</span>
                </div>
                <span className="font-mono text-slate-200 font-semibold">{wh.staffOnShift} 名物流工程师</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* REGIONAL WAREHOUSE SUMMARY TABLE */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">全国分拨中心综合运营指标矩阵</h3>
          <p className="text-xs text-slate-400">对比分析各大区核心物流节点的吞吐速率与运转健康度</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">枢纽代号</th>
                <th className="py-2.5 px-3">仓储枢纽名称</th>
                <th className="py-2.5 px-3">所在省市</th>
                <th className="py-2.5 px-3">额定库容</th>
                <th className="py-2.5 px-3">待分拣排队</th>
                <th className="py-2.5 px-3">正在作业</th>
                <th className="py-2.5 px-3">处理流速</th>
                <th className="py-2.5 px-3">库容负荷</th>
                <th className="py-2.5 px-3 text-right">运转状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {warehouses.map((wh, idx) => {
                const isActive = idx < config.activeWarehousesCount;
                const effCapacity = Math.round(wh.capacity * config.warehouseCapacityMultiplier);
                const totalLoad = wh.currentQueue + wh.inProcessing;
                const utilPct = Math.min(100, Math.round((totalLoad / Math.max(1, effCapacity)) * 100));

                return (
                  <tr key={wh.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-400">{wh.code}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-medium">{wh.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{wh.city}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{effCapacity} 单</td>
                    <td className="py-2.5 px-3 font-mono text-amber-400">{wh.currentQueue} 单</td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">{wh.inProcessing} 单</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{wh.processingRate} 单/周期</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getUtilColor(utilPct)}`} style={{ width: `${utilPct}%` }} />
                        </div>
                        <span className="font-mono text-[11px] text-slate-300">{utilPct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] border ${getStatusBadge(wh.status)}`}>
                        {isActive ? getStatusText(wh.status) : '未启用'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarehousesView;
