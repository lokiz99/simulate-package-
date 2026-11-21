import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Package,
  ShieldCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { STATUS_MAP, PRIORITY_MAP } from '../data/mockData';

const OrdersView = ({ onOpenNewOrder }) => {
  const { orders, warehouses, setSelectedOrder, exportOrdersCSV } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.signedReceipt && o.signedReceipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || o.priority === priorityFilter;
      const matchesWarehouse = warehouseFilter === 'ALL' || o.warehouseId === warehouseFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesWarehouse;
    }).sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      if (sortField === 'orderDate') {
        fieldA = new Date(fieldA).getTime();
        fieldB = new Date(fieldB).getTime();
      }

      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, searchTerm, statusFilter, priorityFilter, warehouseFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">订单综合管理与审计</h2>
          <p className="text-xs text-slate-400 mt-1">
            检索、筛选与审计全链路物流包裹、排队状态及防伪电子签收单。
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportOrdersCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>导出 CSV 表格</span>
          </button>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-900/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>录入仿真订单</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索订单编号、货主企业、目的城市或签收单号..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">全部订单状态 ({orders.length} 单)</option>
              <option value="Pending">待处理 (Pending)</option>
              <option value="Processing">仓库分拣中 (Processing)</option>
              <option value="In Transit">干线在途 (In Transit)</option>
              <option value="Delivered">妥投送达 (Delivered)</option>
              <option value="Backlog">队列积压 (Backlog)</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">全部优先级</option>
              <option value="Urgent">紧急特快 (Urgent)</option>
              <option value="High">高优先级 (High)</option>
              <option value="Standard">标准配送 (Standard)</option>
              <option value="Economy">经济普运 (Economy)</option>
            </select>
          </div>
        </div>

        {/* Warehouse Filter Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[11px] font-medium shrink-0 flex items-center space-x-1">
            <Filter className="h-3 w-3" />
            <span>所属枢纽：</span>
          </span>
          <button
            onClick={() => { setWarehouseFilter('ALL'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              warehouseFilter === 'ALL'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            全部仓储枢纽
          </button>
          {warehouses.map((wh) => (
            <button
              key={wh.id}
              onClick={() => { setWarehouseFilter(wh.id); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                warehouseFilter === wh.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {wh.code} - {wh.city}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS DATA TABLE */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 select-none">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>订单编号</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customer')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>货主企业 / 客户</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">目的城市</th>
                <th
                  onClick={() => handleSort('orderDate')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>下单时间</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">当前状态</th>
                <th className="py-3 px-4">优先级</th>
                <th className="py-3 px-4">始发分拨港</th>
                <th className="py-3 px-4">预计送达</th>
                <th className="py-3 px-4 text-right">回单核验 / 操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((ord) => {
                  const wh = warehouses.find(w => w.id === ord.warehouseId);
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-200 group-hover:text-brand-400">
                        {ord.id}
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-medium">
                        {ord.customer}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {ord.destination}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {new Date(ord.orderDate).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${getStatusBadge(ord.status)}`}>
                          {STATUS_MAP[ord.status] || ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${getPriorityBadge(ord.priority)}`}>
                          {PRIORITY_MAP[ord.priority] || ord.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                          {wh ? wh.code : ord.warehouseId}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {ord.estimatedDelivery ? new Date(ord.estimatedDelivery).toLocaleDateString('zh-CN') : '计算中'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {ord.signedReceipt ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 font-medium">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>已电子签收</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 inline-flex items-center space-x-1 group-hover:text-slate-300 text-[11px]">
                            <Eye className="h-3.5 w-3.5" />
                            <span>查看流水</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-slate-400">未检索到符合当前筛选条件的订单</p>
                    <p className="text-xs text-slate-600 mt-1">请尝试放宽筛选条件或手动录入一笔新的仿真订单。</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            显示第 <span className="font-semibold text-slate-200">{filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> 至{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{' '}
            笔，共 <span className="font-semibold text-slate-200">{filteredOrders.length}</span> 笔订单
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-sans">
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;
