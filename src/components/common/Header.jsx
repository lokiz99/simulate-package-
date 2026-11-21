import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Plus,
  Layers
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const Header = ({ onOpenNewOrder }) => {
  const {
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    stepTick,
    currentTick,
    config,
    setSpeed
  } = useSimulation();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Brand & Status Indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">LogiFlow</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 px-1.5 py-0.5 rounded">
                物流仿真 v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans hidden sm:block">现代物流分发与供应链仿真调度系统</p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1 text-xs">
          <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="font-medium text-slate-300">
            {isRunning ? '仿真引擎运行中' : '仿真已暂停'}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">时钟周期 #{currentTick}</span>
        </div>
      </div>

      {/* Simulator Quick Controls */}
      <div className="flex items-center space-x-3">
        {/* Speed Selector */}
        <div className="hidden md:flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 text-xs">
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeed(spd)}
              className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                config.speedMultiplier === spd
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {spd}x倍速
            </button>
          ))}
        </div>

        {/* Step Button */}
        <button
          onClick={stepTick}
          disabled={isRunning}
          title="执行单步仿真周期"
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center space-x-1"
        >
          <FastForward className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-sans">单步推进</span>
        </button>

        {/* Play / Pause Toggle */}
        {isRunning ? (
          <button
            onClick={pauseSimulation}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all shadow-sm shadow-amber-900/20"
          >
            <Pause className="h-3.5 w-3.5 fill-amber-300" />
            <span>暂停仿真</span>
          </button>
        ) : (
          <button
            onClick={startSimulation}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 border border-emerald-500/40 text-white hover:bg-emerald-500 text-xs font-semibold transition-all shadow-lg shadow-emerald-950/40"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>启动仿真</span>
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={resetSimulation}
          title="重置仿真系统至初始状态"
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* New Order Modal Button */}
        <button
          onClick={onOpenNewOrder}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-all shadow-md shadow-brand-900/30"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">录入订单</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
