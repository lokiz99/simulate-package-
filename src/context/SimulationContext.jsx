import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  INITIAL_WAREHOUSES,
  INITIAL_ORDERS,
  INITIAL_CONFIG,
  DESTINATION_CITIES,
  CUSTOMER_NAMES,
  SIGNERS,
  STATUS_MAP,
  PRIORITY_MAP
} from '../data/mockData';

const SimulationContext = createContext(null);

const STORAGE_KEYS = {
  ORDERS: 'logiflow_orders_zh_v1',
  WAREHOUSES: 'logiflow_warehouses_zh_v1',
  CONFIG: 'logiflow_config_zh_v1',
  HISTORY: 'logiflow_history_zh_v1',
  TICK: 'logiflow_tick_zh_v1',
  LOGS: 'logiflow_logs_zh_v1'
};

export const SimulationProvider = ({ children }) => {
  // Load from LocalStorage with fallback to initial mocks
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
      return INITIAL_ORDERS;
    }
  });

  const [warehouses, setWarehouses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WAREHOUSES);
      return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
    } catch (e) {
      console.error('Error loading warehouses from localStorage', e);
      return INITIAL_WAREHOUSES;
    }
  });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch (e) {
      console.error('Error loading config from localStorage', e);
      return INITIAL_CONFIG;
    }
  });

  const [currentTick, setCurrentTick] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICK);
      return saved ? Number(saved) : 10;
    } catch (e) {
      return 10;
    }
  });

  const [historyMetrics, setHistoryMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { tick: 1, label: '08:00', total: 6, processing: 2, inTransit: 2, delivered: 1, backlog: 1 },
      { tick: 3, label: '10:00', total: 8, processing: 3, inTransit: 3, delivered: 1, backlog: 1 },
      { tick: 5, label: '12:00', total: 10, processing: 3, inTransit: 3, delivered: 2, backlog: 2 },
      { tick: 7, label: '14:00', total: 11, processing: 4, inTransit: 3, delivered: 2, backlog: 2 },
      { tick: 10, label: '16:00', total: 12, processing: 3, inTransit: 3, delivered: 3, backlog: 3 },
    ];
  });

  const [eventLogs, setEventLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, time: '16:00:12', type: 'info', text: '物流分发仿真引擎已就绪，已激活 6 个区域分拨中心' },
      { id: 2, time: '16:01:45', type: 'success', text: '电子签收单 REC-2026-8941 验真完成，杭州终端交付成功' },
      { id: 3, time: '16:02:20', type: 'warning', text: '华中武汉多式联运中心待分拣队列负荷达到 65% 警戒阈值' }
    ];
  });

  const [isRunning, setIsRunning] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses));
    } catch (e) {}
  }, [warehouses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyMetrics));
    } catch (e) {}
  }, [historyMetrics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TICK, String(currentTick));
    } catch (e) {}
  }, [currentTick]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(eventLogs.slice(0, 50)));
    } catch (e) {}
  }, [eventLogs]);

  // Helper to add event log
  const addLog = (type, text) => {
    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    setEventLogs(prev => [
      { id: Date.now() + Math.random(), time: timeStr, type, text },
      ...prev.slice(0, 49)
    ]);
  };

  // TICK SIMULATION ENGINE STEP
  const processSimulationTick = () => {
    setCurrentTick(prevTick => {
      const newTick = prevTick + 1;
      const simClockHour = (8 + (newTick % 16)).toString().padStart(2, '0');
      const simClockMin = ((newTick * 7) % 60).toString().padStart(2, '0');
      const timeLabel = `${simClockHour}:${simClockMin}`;

      // 1. INTAKE NEW ORDERS
      let newlyCreatedOrders = [];
      const intakeChance = Math.min(0.9, (config.dailyOrderVolume / 50) * 0.85);

      if (config.autoIntake && Math.random() < intakeChance) {
        const orderCountToSpawn = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < orderCountToSpawn; i++) {
          const randCustomer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
          const randDest = DESTINATION_CITIES[Math.floor(Math.random() * DESTINATION_CITIES.length)];
          const activeWhs = warehouses.slice(0, Math.min(warehouses.length, config.activeWarehousesCount));
          const targetWh = activeWhs.find(w => w.id === randDest.hubId) || activeWhs[Math.floor(Math.random() * activeWhs.length)];
          
          const priorityRoll = Math.random();
          const priority = priorityRoll < 0.15 ? 'Urgent' : priorityRoll < 0.45 ? 'High' : priorityRoll < 0.85 ? 'Standard' : 'Economy';
          const orderNum = 8953 + newTick * 3 + i;
          const orderId = `ORD-${orderNum}`;

          const newOrder = {
            id: orderId,
            customer: randCustomer,
            destination: randDest.name,
            orderDate: new Date().toISOString(),
            status: 'Pending',
            priority,
            warehouseId: targetWh.id,
            weightKg: Number((Math.random() * 45 + 1.5).toFixed(1)),
            itemsCount: Math.floor(Math.random() * 8) + 1,
            estimatedDelivery: new Date(Date.now() + (config.avgTransitTime + 2) * 3600000).toISOString(),
            transitProgress: 0,
            deliveredAt: null,
            signedReceipt: null
          };
          newlyCreatedOrders.push(newOrder);
        }
      }

      // Update Orders & Warehouse states
      setOrders(currentOrders => {
        let combined = [...currentOrders, ...newlyCreatedOrders];
        let updatedOrders = [...combined];
        let updatedWarehouses = [...warehouses];

        const currentTransitCount = updatedOrders.filter(o => o.status === 'In Transit').length;
        let transitSlotsAvailable = Math.max(0, config.deliveryCapacity - currentTransitCount);

        // A. STEP TRANSIT ORDERS
        updatedOrders = updatedOrders.map(order => {
          if (order.status === 'In Transit') {
            const baseStep = 100 / Math.max(2, config.avgTransitTime);
            const stepVariance = (Math.random() * 10 - 5);
            const nextProgress = Math.min(100, Math.round(order.transitProgress + baseStep + stepVariance));

            if (nextProgress >= 100) {
              const signer = SIGNERS[Math.floor(Math.random() * SIGNERS.length)];
              const podHash = 'POD-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + order.id.replace('ORD-', '');
              const receiptNo = 'REC-' + new Date().getFullYear() + '-' + order.id.replace('ORD-', '');
              const deliverTime = new Date().toISOString();

              addLog('success', `电子签收单 ${receiptNo} 已生成：订单 ${order.id} 已送达 ${order.destination}（签收人：${signer}）`);

              return {
                ...order,
                status: 'Delivered',
                transitProgress: 100,
                deliveredAt: deliverTime,
                signedReceipt: {
                  receiptNumber: receiptNo,
                  signedBy: signer,
                  timestamp: deliverTime,
                  podCode: podHash,
                  condition: '验收合格 - 货品完好入库无异议',
                  deliveryDurationHours: Number((Math.random() * 12 + 10).toFixed(1))
                }
              };
            }

            return {
              ...order,
              transitProgress: nextProgress
            };
          }
          return order;
        });

        // B. WAREHOUSE PROCESSING & BACKLOG / TRANSIT DISPATCH
        const activeWhIds = new Set(warehouses.slice(0, config.activeWarehousesCount).map(w => w.id));

        updatedWarehouses = updatedWarehouses.map(wh => {
          if (!activeWhIds.has(wh.id)) {
            return wh;
          }

          const effCapacity = Math.round(wh.capacity * config.warehouseCapacityMultiplier);
          const whOrders = updatedOrders.filter(o => o.warehouseId === wh.id);
          const currentInWh = whOrders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Backlog');

          const isCapacityExceeded = currentInWh.length > effCapacity;

          let readyToDispatch = updatedOrders.filter(o => o.warehouseId === wh.id && o.status === 'Processing');
          
          let dispatchedThisTick = 0;
          readyToDispatch.forEach(ord => {
            if (transitSlotsAvailable > 0) {
              const idx = updatedOrders.findIndex(o => o.id === ord.id);
              if (idx !== -1) {
                updatedOrders[idx] = {
                  ...updatedOrders[idx],
                  status: 'In Transit',
                  transitProgress: Math.floor(Math.random() * 15) + 5
                };
                transitSlotsAvailable--;
                dispatchedThisTick++;
              }
            }
          });

          let pendingOrders = updatedOrders.filter(o => o.warehouseId === wh.id && (o.status === 'Pending' || o.status === 'Backlog'));
          const priorityWeight = { Urgent: 4, High: 3, Standard: 2, Economy: 1 };
          pendingOrders.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

          let processingSlots = Math.max(0, effCapacity - (currentInWh.length - pendingOrders.length));
          const allowedToProcess = Math.min(wh.processingRate, processingSlots);

          let processedCount = 0;
          pendingOrders.forEach((pOrd, index) => {
            const idx = updatedOrders.findIndex(o => o.id === pOrd.id);
            if (idx !== -1) {
              if (index < allowedToProcess && !isCapacityExceeded) {
                updatedOrders[idx] = {
                  ...updatedOrders[idx],
                  status: 'Processing'
                };
                processedCount++;
              } else {
                updatedOrders[idx] = {
                  ...updatedOrders[idx],
                  status: 'Backlog'
                };
              }
            }
          });

          const newQueue = updatedOrders.filter(o => o.warehouseId === wh.id && (o.status === 'Pending' || o.status === 'Backlog')).length;
          const newInProc = updatedOrders.filter(o => o.warehouseId === wh.id && o.status === 'Processing').length;
          const totalLoad = newQueue + newInProc;
          const utilPct = Math.min(100, Math.round((totalLoad / Math.max(1, effCapacity)) * 100));

          let whStatus = 'Optimal';
          if (utilPct > 90) {
            whStatus = 'Bottlenecked';
          } else if (utilPct > 70) {
            whStatus = 'Near Capacity';
          }

          return {
            ...wh,
            currentQueue: newQueue,
            inProcessing: newInProc,
            dispatchedCount: wh.dispatchedCount + dispatchedThisTick,
            utilization: utilPct,
            status: whStatus
          };
        });

        setWarehouses(updatedWarehouses);

        const curTotal = updatedOrders.length;
        const curProc = updatedOrders.filter(o => o.status === 'Processing').length;
        const curTrans = updatedOrders.filter(o => o.status === 'In Transit').length;
        const curDeliv = updatedOrders.filter(o => o.status === 'Delivered').length;
        const curBacklog = updatedOrders.filter(o => o.status === 'Backlog').length;

        setHistoryMetrics(prev => {
          const next = [
            ...prev,
            {
              tick: newTick,
              label: timeLabel,
              total: curTotal,
              processing: curProc,
              inTransit: curTrans,
              delivered: curDeliv,
              backlog: curBacklog,
            }
          ];
          return next.slice(-25);
        });

        return updatedOrders;
      });

      return newTick;
    });
  };

  const tickRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const intervalMs = Math.max(100, Math.round(1200 / (config.speedMultiplier || 1)));
      tickRef.current = setInterval(() => {
        processSimulationTick();
      }, intervalMs);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, config.speedMultiplier, config.dailyOrderVolume, config.warehouseCapacityMultiplier, config.deliveryCapacity, config.avgTransitTime, config.activeWarehousesCount]);

  // CONTROLS
  const startSimulation = () => {
    setIsRunning(true);
    addLog('info', '仿真已启动，动态分发引擎正在实时推进');
  };

  const pauseSimulation = () => {
    setIsRunning(false);
    addLog('warning', '仿真已暂停');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setOrders(INITIAL_ORDERS);
    setWarehouses(INITIAL_WAREHOUSES);
    setConfig(INITIAL_CONFIG);
    setCurrentTick(10);
    setHistoryMetrics([
      { tick: 1, label: '08:00', total: 6, processing: 2, inTransit: 2, delivered: 1, backlog: 1 },
      { tick: 3, label: '10:00', total: 8, processing: 3, inTransit: 3, delivered: 1, backlog: 1 },
      { tick: 5, label: '12:00', total: 10, processing: 3, inTransit: 3, delivered: 2, backlog: 2 },
      { tick: 7, label: '14:00', total: 11, processing: 4, inTransit: 3, delivered: 2, backlog: 2 },
      { tick: 10, label: '16:00', total: 12, processing: 3, inTransit: 3, delivered: 3, backlog: 3 },
    ]);
    addLog('info', '系统已恢复至标准基准状态');
  };

  const stepTick = () => {
    processSimulationTick();
    addLog('info', '单步时钟周期推进完成');
  };

  const setSpeed = (spd) => {
    setConfig(prev => ({ ...prev, speedMultiplier: spd }));
    addLog('info', `仿真时钟倍速已调整为 ${spd}x`);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addManualOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrd = {
      id: orderId,
      customer: orderData.customer || '急件直发客户',
      destination: orderData.destination || '杭州市',
      orderDate: new Date().toISOString(),
      status: 'Pending',
      priority: orderData.priority || 'Standard',
      warehouseId: orderData.warehouseId || warehouses[0].id,
      weightKg: Number(orderData.weightKg || 12.5),
      itemsCount: Number(orderData.itemsCount || 3),
      estimatedDelivery: new Date(Date.now() + (config.avgTransitTime + 2) * 3600000).toISOString(),
      transitProgress: 0,
      deliveredAt: null,
      signedReceipt: null
    };

    setOrders(prev => [newOrd, ...prev]);
    addLog('info', `已成功手动录入订单 ${orderId}，客户：${newOrd.customer}`);
  };

  const triggerChaosEvent = (type) => {
    if (type === 'surge') {
      const surgeOrders = Array.from({ length: 15 }).map((_, i) => ({
        id: `SURGE-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
        destination: DESTINATION_CITIES[i % DESTINATION_CITIES.length].name,
        orderDate: new Date().toISOString(),
        status: 'Backlog',
        priority: 'Urgent',
        warehouseId: warehouses[i % config.activeWarehousesCount].id,
        weightKg: Number((Math.random() * 30 + 5).toFixed(1)),
        itemsCount: Math.floor(Math.random() * 6) + 2,
        estimatedDelivery: new Date(Date.now() + 48 * 3600000).toISOString(),
        transitProgress: 0,
        deliveredAt: null,
        signedReceipt: null
      }));
      setOrders(prev => [...surgeOrders, ...prev]);
      addLog('danger', '压力测试：瞬时订单激增！已向分发网络注入 15 笔紧急待发订单');
    } else if (type === 'freeze') {
      setConfig(prev => ({ ...prev, warehouseCapacityMultiplier: 0.5 }));
      addLog('danger', '恶劣天气警报：突发大范围暴雪，各区域分拣中心吞吐效率骤降 50%');
    } else if (type === 'fleet_jam') {
      setConfig(prev => ({ ...prev, deliveryCapacity: 10 }));
      addLog('warning', '干线运力吃紧：在途干线车辆配额压减至 10 台');
    }
  };

  const clearBacklog = () => {
    setOrders(prev => prev.map(o => {
      if (o.status === 'Backlog') {
        return { ...o, status: 'Processing' };
      }
      return o;
    }));
    addLog('success', '紧急清库调度令已执行，所有积压包裹提升为优先分拣');
  };

  const exportOrdersCSV = () => {
    const headers = [
      '订单编号',
      '客户名称',
      '目的城市',
      '分拣枢纽编号',
      '下单时间',
      '订单状态',
      '优先级',
      '货物重量(kg)',
      '包裹件数',
      '预计送达时间',
      '实际送达时间',
      '电子签收单号',
      '签收验收人',
      '防伪验证哈希(POD)'
    ];

    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${o.customer.replace(/"/g, '""')}"`,
      `"${o.destination}"`,
      `"${o.warehouseId}"`,
      `"${o.orderDate}"`,
      `"${STATUS_MAP[o.status] || o.status}"`,
      `"${PRIORITY_MAP[o.priority] || o.priority}"`,
      o.weightKg,
      o.itemsCount,
      `"${o.estimatedDelivery || ''}"`,
      `"${o.deliveredAt || ''}"`,
      `"${o.signedReceipt ? o.signedReceipt.receiptNumber : ''}"`,
      `"${o.signedReceipt ? o.signedReceipt.signedBy.replace(/"/g, '""') : ''}"`,
      `"${o.signedReceipt ? o.signedReceipt.podCode : ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `物流分发订单数据导出_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog('info', '订单全量数据已成功导出为 CSV 表格');
  };

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const ordersProcessing = orders.filter(o => o.status === 'Processing').length;
    const inTransit = orders.filter(o => o.status === 'In Transit').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const backlog = orders.filter(o => o.status === 'Backlog' || o.status === 'Pending').length;

    const successRate = totalOrders === 0 ? 100 : Math.min(100, Math.round((delivered / Math.max(1, delivered + (backlog * 0.1))) * 100));
    const avgProcTime = 4.2;

    const deliveredWithReceipt = orders.filter(o => o.signedReceipt && o.signedReceipt.deliveryDurationHours);
    const avgTransitHrs = deliveredWithReceipt.length > 0
      ? (deliveredWithReceipt.reduce((acc, o) => acc + o.signedReceipt.deliveryDurationHours, 0) / deliveredWithReceipt.length).toFixed(1)
      : '22.4';

    const activeWhs = warehouses.slice(0, config.activeWarehousesCount);
    const avgUtilization = activeWhs.length > 0
      ? Math.round(activeWhs.reduce((acc, w) => acc + (w.utilization || Math.round(((w.currentQueue + w.inProcessing) / w.capacity) * 100)), 0) / activeWhs.length)
      : 0;

    return {
      totalOrders,
      ordersProcessing,
      inTransit,
      delivered,
      backlog,
      deliverySuccessRate: successRate,
      avgProcessingTime: `${avgProcTime}小时`,
      avgTransitHours: `${avgTransitHrs}小时`,
      avgUtilization: `${avgUtilization}%`
    };
  }, [orders, warehouses, config.activeWarehousesCount]);

  return (
    <SimulationContext.Provider
      value={{
        orders,
        warehouses,
        config,
        isRunning,
        currentTick,
        historyMetrics,
        eventLogs,
        metrics,
        selectedOrder,
        setSelectedOrder,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        stepTick,
        setSpeed,
        updateConfig,
        addManualOrder,
        triggerChaosEvent,
        clearBacklog,
        exportOrdersCSV,
        addLog
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
