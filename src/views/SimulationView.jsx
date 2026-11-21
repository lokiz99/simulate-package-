import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sliders,
  Warehouse,
  Truck,
  Package,
  CheckCircle2,
  Zap,
  Flame,
  CloudSnow,
  Activity,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const SimulationView = () => {
  const {
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    stepTick,
    currentTick,
    config,
    updateConfig,
    setSpeed,
    eventLogs,
    metrics,
    triggerChaosEvent,
    clearBacklog
  } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Top Title & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">仿真调度控制中心</h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isRunning
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {isRunning ? '引擎运行中' : '引擎已暂停'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            动态调优供应链流转参数、模拟系统瓶颈、控制仿真时钟并执行压力测试。
          </p>
        </div>

        {/* Master Control Buttons */}
        <div className="flex items-center space-x-3">
          {isRunning ? (
            <button
              onClick={pauseSimulation}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all shadow-md shadow-amber-950/20"
            >
              <Pause className="h-4 w-4 fill-amber-300" />
              <span>暂停仿真</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/40"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>启动仿真</span>
            </button>
          )}

          <button
            onClick={stepTick}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            <FastForward className="h-4 w-4" />
            <span>单步推进</span>
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>重置系统</span>
          </button>
        </div>
      </div>

      {/* PIPELINE STAGES VISUALIZER */}
      <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
          <Activity className="h-4 w-4 text-brand-400" />
          <span>全链路物流流转管线状态图</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Stage 1: Order Intake & Backlog */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">1. 订单录入与排队</span>
              <Package className="h-4 w-4 text-brand-400" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-white">{metrics.backlog} 单</div>
              <div className="text-[11px] text-slate-400">等待分拣排队队列</div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
              <span>当前队列状态：</span>
              <span className={metrics.backlog > 5 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {metrics.backlog > 5 ? '排队积压' : '畅通无阻'}
              </span>
            </div>
          </div>

          {/* Stage 2: Warehouse Processing */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">2. 仓库分拣与打包</span>
              <Warehouse className="h-4 w-4 text-amber-400" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-amber-300">{metrics.ordersProcessing} 单</div>
              <div className="text-[11px] text-slate-400">正在打包与出库装车</div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
              <span>全网库容利用率：</span>
              <span className="text-amber-400 font-mono font-semibold">{metrics.avgUtilization}</span>
            </div>
          </div>

          {/* Stage 3: In Transit Fleet */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">3. 干线在途运输</span>
              <Truck className="h-4 w-4 text-sky-400" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-sky-300">{metrics.inTransit} 辆</div>
              <div className="text-[11px] text-slate-400">干线车辆在途配送中</div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
              <span>车队运力上限：</span>
              <span className="text-sky-400 font-mono font-semibold">{config.deliveryCapacity} 辆</span>
            </div>
          </div>

          {/* Stage 4: Delivered with Signed Receipt */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">4. 妥投送达与回单</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-emerald-300">{metrics.delivered} 单</div>
              <div className="text-[11px] text-slate-400">已核发电子签收凭证</div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
              <span>履约达成率：</span>
              <span className="text-emerald-400 font-mono font-semibold">{metrics.deliverySuccessRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* PARAMETERS CONFIGURATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Configuration Panel */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-brand-400" />
              <h3 className="text-sm font-bold text-white">动态仿真调度参数调优</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">实时动态生效</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speed Multiplier */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">仿真时钟推演倍速</span>
                <span className="font-mono text-brand-400">{config.speedMultiplier}x 倍速</span>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                {[0.5, 1, 2, 5, 10].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeed(spd)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      config.speedMultiplier === spd
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                控制仿真时钟脉冲推进的毫秒间隔频率。
              </p>
            </div>

            {/* Daily Order Volume */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">每日订单生成频率因子</span>
                <span className="font-mono text-brand-400">{config.dailyOrderVolume} 单/日</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={config.dailyOrderVolume}
                onChange={(e) => updateConfig('dailyOrderVolume', Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5 (淡季平峰)</span>
                <span>25 (正常负荷)</span>
                <span>50 (大促高峰)</span>
              </div>
            </div>

            {/* Warehouse Processing Capacity Multiplier */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">仓库综合分拣处理能力</span>
                <span className="font-mono text-amber-400">{Math.round(config.warehouseCapacityMultiplier * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.0"
                step="0.1"
                value={config.warehouseCapacityMultiplier}
                onChange={(e) => updateConfig('warehouseCapacityMultiplier', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>40% (库容受限)</span>
                <span>100% (标准作业)</span>
                <span>200% (增班超频)</span>
              </div>
            </div>

            {/* Delivery Capacity */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">干线车队并发运力规模</span>
                <span className="font-mono text-sky-400">{config.deliveryCapacity} 辆在途车辆</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={config.deliveryCapacity}
                onChange={(e) => updateConfig('deliveryCapacity', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 (严重吃紧)</span>
                <span>35 (均衡运力)</span>
                <span>80 (车队充裕)</span>
              </div>
            </div>

            {/* Average Transit Time */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">平均干线运输周期</span>
                <span className="font-mono text-purple-400">{config.avgTransitTime} 刻度 (约 {config.avgTransitTime * 6} 小时)</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={config.avgTransitTime}
                onChange={(e) => updateConfig('avgTransitTime', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2 刻度 (特快达)</span>
                <span>4 刻度 (标准干线)</span>
                <span>8 刻度 (长途跨省)</span>
              </div>
            </div>

            {/* Number of Active Warehouses */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">激活大区枢纽数量</span>
                <span className="font-mono text-emerald-400">{config.activeWarehousesCount} 个枢纽仓</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={config.activeWarehousesCount}
                onChange={(e) => updateConfig('activeWarehousesCount', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2 (骨干节点)</span>
                <span>4 (核心大区)</span>
                <span>6 (全网覆盖)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stress Testing & Chaos Tools */}
        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">压力测试与极端情况模拟</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              人为向网络施加压力冲击，检验全域供应链在面临拥堵、恶劣天气与突发流量时的容灾自愈能力。
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => triggerChaosEvent('surge')}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-rose-400" />
                  <span>瞬时订单激增 (+15 笔紧急高优单)</span>
                </div>
                <span className="text-[10px] font-mono bg-rose-500/20 px-1.5 py-0.5 rounded">流量洪峰</span>
              </button>

              <button
                onClick={() => triggerChaosEvent('freeze')}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-sky-500/30 hover:border-sky-500/60 text-sky-300 hover:bg-sky-500/10 text-xs font-semibold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <CloudSnow className="h-4 w-4 text-sky-400" />
                  <span>全国大雪延误 (分拣效率骤降 50%)</span>
                </div>
                <span className="text-[10px] font-mono bg-sky-500/20 px-1.5 py-0.5 rounded">恶劣天气</span>
              </button>

              <button
                onClick={() => triggerChaosEvent('fleet_jam')}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-amber-400" />
                  <span>干线运力断崖 (在途配额压减至 10 台)</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded">车队短缺</span>
              </button>

              <button
                onClick={clearBacklog}
                className="w-full p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center justify-between transition-colors text-left mt-3"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>执行紧急清库调度 (积压件优先排产)</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/30 px-1.5 py-0.5 rounded">排障恢复</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">系统仿真准则：</span> 全流程基于动态排队论与有限运力调度模型，非随机波动，所有指标均与底层流水一致。
          </div>
        </div>
      </div>

      {/* LIVE EVENT LOG FEED */}
      <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-brand-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              实时仿真事件流 ({eventLogs.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">动态遥测数据流回传中</span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 font-mono text-xs">
          {eventLogs.map((log) => {
            const colorClass =
              log.type === 'success'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : log.type === 'warning'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : log.type === 'danger'
                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                : 'text-slate-300 bg-slate-950/60 border-slate-800';

            return (
              <div
                key={log.id}
                className={`p-2 rounded-lg border flex items-start space-x-2.5 transition-all ${colorClass}`}
              >
                <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">[{log.time}]</span>
                <span className="flex-1 text-[11px] leading-relaxed font-sans">{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimulationView;
