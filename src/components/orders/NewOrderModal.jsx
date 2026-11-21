import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { DESTINATION_CITIES, CUSTOMER_NAMES } from '../../data/mockData';

const NewOrderModal = ({ isOpen, onClose }) => {
  const { warehouses, addManualOrder } = useSimulation();

  const [customer, setCustomer] = useState(CUSTOMER_NAMES[0]);
  const [destination, setDestination] = useState(DESTINATION_CITIES[0].name);
  const [priority, setPriority] = useState('Standard');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh-1');
  const [weightKg, setWeightKg] = useState('14.5');
  const [itemsCount, setItemsCount] = useState('3');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addManualOrder({
      customer,
      destination,
      priority,
      warehouseId,
      weightKg: parseFloat(weightKg),
      itemsCount: parseInt(itemsCount, 10)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">录入仿真分发订单</h3>
              <p className="text-xs text-slate-400">向当前供应链分发管线实时注入模拟包裹</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">委托企业 / 货主名称</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {CUSTOMER_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">目的城市</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {DESTINATION_CITIES.map((d) => (
                  <option key={d.id} value={d.name}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">优先级层级</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Urgent">紧急特快 (Urgent)</option>
                <option value="High">高优先级 (High)</option>
                <option value="Standard">标准配送 (Standard)</option>
                <option value="Economy">经济普运 (Economy)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">指定始发仓储枢纽</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>{wh.code} - {wh.name} ({wh.city})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">货物总重量 (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="500"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">包裹件数</label>
              <input
                type="number"
                min="1"
                max="50"
                value={itemsCount}
                onChange={(e) => setItemsCount(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-900/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>提交至分发管线</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
