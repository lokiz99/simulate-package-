import React from 'react';
import {
  X,
  Package,
  Calendar,
  MapPin,
  Warehouse,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Printer,
  Truck
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { STATUS_MAP, PRIORITY_MAP } from '../../data/mockData';

const OrderDetailModal = () => {
  const { selectedOrder, setSelectedOrder, warehouses } = useSimulation();

  if (!selectedOrder) return null;

  const assignedWh = warehouses.find(w => w.id === selectedOrder.warehouseId);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Standard':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Economy':
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'In Transit':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'Processing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Backlog':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Pending':
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-white font-mono">{selectedOrder.id}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(selectedOrder.status)}`}>
                  {STATUS_MAP[selectedOrder.status] || selectedOrder.status}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getPriorityBadge(selectedOrder.priority)}`}>
                  {PRIORITY_MAP[selectedOrder.priority] || selectedOrder.priority}优先级
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">客户名称：{selectedOrder.customer}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
                <MapPin className="h-3.5 w-3.5 text-brand-400" />
                <span>目的城市</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">{selectedOrder.destination}</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
                <Warehouse className="h-3.5 w-3.5 text-emerald-400" />
                <span>始发仓储枢纽</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">{assignedWh?.name || selectedOrder.warehouseId}</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
                <Package className="h-3.5 w-3.5 text-purple-400" />
                <span>货物规格</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">{selectedOrder.weightKg} kg ({selectedOrder.itemsCount} 件包裹)</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>下单时间</span>
              </div>
              <p className="text-sm font-semibold text-slate-100 font-mono">
                {new Date(selectedOrder.orderDate).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>

          {/* Lifecycle Tracking Bar */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">干线履约进度</span>
              <span className="font-mono text-brand-400 font-bold">{selectedOrder.transitProgress || 0}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${selectedOrder.transitProgress || (selectedOrder.status === 'Delivered' ? 100 : 15)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 text-center text-[11px] pt-1">
              <span className={`font-medium ${['Pending', 'Processing', 'In Transit', 'Delivered', 'Backlog'].includes(selectedOrder.status) ? 'text-brand-400' : 'text-slate-600'}`}>
                1. 订单录入
              </span>
              <span className={`font-medium ${['Processing', 'In Transit', 'Delivered'].includes(selectedOrder.status) ? 'text-brand-400' : 'text-slate-600'}`}>
                2. 仓库分拣
              </span>
              <span className={`font-medium ${['In Transit', 'Delivered'].includes(selectedOrder.status) ? 'text-brand-400' : 'text-slate-600'}`}>
                3. 干线运输
              </span>
              <span className={`font-medium ${selectedOrder.status === 'Delivered' ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                4. 签收送达
              </span>
            </div>
          </div>

          {/* DIGITAL SIGNED RECEIPT SECTION */}
          {selectedOrder.status === 'Delivered' && selectedOrder.signedReceipt ? (
            <div className="border-2 border-emerald-500/40 bg-emerald-950/20 rounded-2xl p-5 space-y-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
                <ShieldCheck className="h-40 w-40 text-emerald-400" />
              </div>

              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="font-bold text-sm tracking-wide text-emerald-300 uppercase">
                    官方交付电子签收凭证 (Proof of Delivery)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/40">
                  {selectedOrder.signedReceipt.receiptNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">授权验收签收人：</span>
                  <p className="font-semibold text-slate-100 text-sm">{selectedOrder.signedReceipt.signedBy}</p>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">防伪验真哈希码 (POD)：</span>
                  <p className="font-mono font-semibold text-emerald-400 text-sm">{selectedOrder.signedReceipt.podCode}</p>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">终端交付核验时间：</span>
                  <p className="font-mono text-slate-200">
                    {new Date(selectedOrder.signedReceipt.timestamp).toLocaleString('zh-CN')}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">货物签收完好状态：</span>
                  <p className="font-medium text-slate-200">{selectedOrder.signedReceipt.condition}</p>
                </div>
              </div>

              {/* Digital Signature Representation */}
              <div className="pt-2 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 px-4 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 block uppercase">电子签名签章 / E-SIGNATURE</span>
                  <span className="italic text-base text-emerald-300 font-serif">
                    【已电子签署】{selectedOrder.signedReceipt.signedBy}
                  </span>
                </div>

                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-medium transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>打印签收单</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-1">
              <Truck className="h-6 w-6 text-slate-500 animate-pulse" />
              <p className="font-medium text-slate-300">电子签收单将在订单最终送达时生成</p>
              <p className="text-slate-500 text-[11px]">
                货物抵达目的城市网点并经授权人员验收确认后，系统将自动核发防伪数字签收凭单。
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            关闭详情
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
