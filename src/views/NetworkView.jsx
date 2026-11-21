import React, { useState } from 'react';
import {
  Warehouse,
  MapPin,
  Activity
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { DESTINATION_CITIES } from '../data/mockData';

const NetworkView = () => {
  const { warehouses, orders, config, setSelectedOrder } = useSimulation();

  const [selectedHub, setSelectedHub] = useState('ALL');
  const [showAnimations, setShowAnimations] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  const activeWarehouses = warehouses.slice(0, config.activeWarehousesCount);

  const displayedWarehouses = selectedHub === 'ALL'
    ? activeWarehouses
    : activeWarehouses.filter(w => w.id === selectedHub);

  const inTransitOrders = orders.filter(o => o.status === 'In Transit');

  const routes = [];
  displayedWarehouses.forEach(wh => {
    DESTINATION_CITIES.forEach(dest => {
      if (dest.hubId === wh.id || selectedHub === wh.id) {
        const activeShipments = inTransitOrders.filter(
          o => o.warehouseId === wh.id && o.destination === dest.name
        );

        routes.push({
          id: `${wh.id}-${dest.id}`,
          wh,
          dest,
          activeShipments
        });
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">全域物流拓扑与干线路由网络</h2>
            <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-medium">
              实况遥测地图
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            可视化展示全国仓储枢纽、终端城市节点及在途干线物流大动脉。
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Hub Filter */}
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">全部干线路由</option>
            {activeWarehouses.map(w => (
              <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
            ))}
          </select>

          {/* Animation Toggle */}
          <button
            onClick={() => setShowAnimations(!showAnimations)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              showAnimations
                ? 'bg-brand-600/20 text-brand-300 border-brand-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{showAnimations ? '动态车流动画开启' : '静态拓扑视图'}</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE NETWORK CANVAS */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl min-h-[560px] flex items-center justify-center">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* SVG Graphic Map */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full max-h-[580px] select-none"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          {/* 1. TRANSPORT ROUTE LINES */}
          {routes.map(r => {
            const hasActiveFreight = r.activeShipments.length > 0;
            const strokeColor = hasActiveFreight ? '#38bdf8' : '#334155';
            const strokeWidth = hasActiveFreight ? 2.5 : 1.2;
            const strokeDash = hasActiveFreight ? 'none' : '4 4';

            const midX = (r.wh.x + r.dest.x) / 2;
            const midY = (r.wh.y + r.dest.y) / 2 - 25;

            const pathD = `M ${r.wh.x} ${r.wh.y} Q ${midX} ${midY} ${r.dest.x} ${r.dest.y}`;

            return (
              <g key={r.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  opacity={hasActiveFreight ? 0.9 : 0.4}
                  className={hasActiveFreight && showAnimations ? 'glow-route' : ''}
                />

                {/* ANIMATED TRANSIT VEHICLES */}
                {showAnimations && hasActiveFreight && (
                  r.activeShipments.map((shipment, sIdx) => {
                    const progressRatio = Math.max(0.05, Math.min(0.95, (shipment.transitProgress || 50) / 100));
                    const t = progressRatio;
                    const posX = (1 - t) * (1 - t) * r.wh.x + 2 * (1 - t) * t * midX + t * t * r.dest.x;
                    const posY = (1 - t) * (1 - t) * r.wh.y + 2 * (1 - t) * t * midY + t * t * r.dest.y;

                    return (
                      <g
                        key={`${shipment.id}-${sIdx}`}
                        className="cursor-pointer group"
                        onClick={() => setSelectedOrder(shipment)}
                      >
                        <circle
                          cx={posX}
                          cy={posY}
                          r={6}
                          fill="#38bdf8"
                          className="animate-ping opacity-75"
                        />
                        <circle
                          cx={posX}
                          cy={posY}
                          r={5}
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                        <text
                          x={posX}
                          y={posY - 10}
                          fill="#38bdf8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {shipment.id}
                        </text>
                      </g>
                    );
                  })
                )}
              </g>
            );
          })}

          {/* 2. DESTINATION NODES */}
          {DESTINATION_CITIES.map(dest => {
            return (
              <g
                key={dest.id}
                transform={`translate(${dest.x}, ${dest.y})`}
                onMouseEnter={() => setHoveredNode({ ...dest, type: 'destination' })}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                <circle
                  r={5}
                  fill="#0f172a"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  className="group-hover:stroke-brand-400 group-hover:scale-125 transition-transform"
                />
                <circle r={2} fill="#94a3b8" />
                <text
                  x={8}
                  y={4}
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="500"
                  className="group-hover:fill-white select-none pointer-events-none"
                >
                  {dest.name}
                </text>
              </g>
            );
          })}

          {/* 3. WAREHOUSE HUB NODES */}
          {displayedWarehouses.map(wh => {
            const effCapacity = Math.round(wh.capacity * config.warehouseCapacityMultiplier);
            const totalLoad = wh.currentQueue + wh.inProcessing;
            const utilPct = Math.min(100, Math.round((totalLoad / Math.max(1, effCapacity)) * 100));

            const isBottlenecked = wh.status === 'Bottlenecked';
            const ringColor = isBottlenecked ? '#f43f5e' : wh.color || '#38bdf8';

            return (
              <g
                key={wh.id}
                transform={`translate(${wh.x}, ${wh.y})`}
                onMouseEnter={() => setHoveredNode({ ...wh, type: 'warehouse', utilPct, effCapacity, totalLoad })}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {showAnimations && (
                  <circle
                    r={24}
                    fill={ringColor}
                    opacity={0.15}
                    className="animate-ping"
                  />
                )}

                <circle
                  r={18}
                  fill="#0f172a"
                  stroke={ringColor}
                  strokeWidth={3}
                  className="group-hover:scale-110 transition-transform shadow-lg"
                />

                <circle r={7} fill={ringColor} />

                <text
                  x={0}
                  y={32}
                  fill="#f1f5f9"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none select-none drop-shadow-md"
                >
                  {wh.code}
                </text>
                <text
                  x={0}
                  y={45}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {wh.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* FLOATING HOVER CARD */}
        {hoveredNode && (
          <div className="absolute top-6 left-6 bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in duration-150 z-10 pointer-events-none">
            {hoveredNode.type === 'warehouse' ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
                    <Warehouse className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{hoveredNode.name}</h4>
                    <p className="text-xs text-slate-400">{hoveredNode.city}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px] block">库容负荷：</span>
                    <span className={`font-mono font-bold ${hoveredNode.utilPct > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {hoveredNode.utilPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">额定上限：</span>
                    <span className="font-mono text-slate-200">{hoveredNode.effCapacity} 单</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">待分拣排队：</span>
                    <span className="font-mono text-amber-400">{hoveredNode.currentQueue} 单</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">累计发货：</span>
                    <span className="font-mono text-sky-400">{hoveredNode.dispatchedCount} 单</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">{hoveredNode.name}</h4>
                </div>
                <p className="text-xs text-slate-400">城市配送末端网络 ({hoveredNode.state})</p>
                <div className="pt-2 text-xs text-brand-400 font-medium">
                  主要依托归属枢纽：{hoveredNode.hubId.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur text-xs flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-brand-400 border border-white" />
            <span className="text-slate-300">大区分拨枢纽</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="text-slate-300">目的城市节点</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-slate-300">在途干线物流车</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkView;
