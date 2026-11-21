export const STATUS_MAP = {
  Pending: '待处理',
  Processing: '处理中',
  'In Transit': '运输中',
  Delivered: '已送达',
  Backlog: '已积压'
};

export const PRIORITY_MAP = {
  Urgent: '紧急',
  High: '高',
  Standard: '标准',
  Economy: '经济'
};

export const INITIAL_WAREHOUSES = [
  {
    id: 'wh-1',
    code: 'E-SHA',
    name: '华东上海超级枢纽',
    city: '上海市',
    region: '华东',
    x: 820,
    y: 260,
    capacity: 140,
    processingRate: 16,
    currentQueue: 18,
    inProcessing: 14,
    dispatchedCount: 168,
    status: 'Optimal',
    staffOnShift: 28,
    color: '#38bdf8'
  },
  {
    id: 'wh-2',
    code: 'N-PEK',
    name: '华北北京智慧物流港',
    city: '北京市',
    region: '华北',
    x: 640,
    y: 140,
    capacity: 150,
    processingRate: 18,
    currentQueue: 24,
    inProcessing: 16,
    dispatchedCount: 204,
    status: 'Optimal',
    staffOnShift: 32,
    color: '#34d399'
  },
  {
    id: 'wh-3',
    code: 'S-CAN',
    name: '华南广州国际分发港',
    city: '广州市',
    region: '华南',
    x: 680,
    y: 470,
    capacity: 130,
    processingRate: 15,
    currentQueue: 16,
    inProcessing: 12,
    dispatchedCount: 145,
    status: 'Optimal',
    staffOnShift: 24,
    color: '#fbbf24'
  },
  {
    id: 'wh-4',
    code: 'C-WUH',
    name: '华中武汉多式联运中心',
    city: '武汉市',
    region: '华中',
    x: 600,
    y: 320,
    capacity: 160,
    processingRate: 20,
    currentQueue: 26,
    inProcessing: 18,
    dispatchedCount: 232,
    status: 'Optimal',
    staffOnShift: 36,
    color: '#a78bfa'
  },
  {
    id: 'wh-5',
    code: 'SW-CTU',
    name: '西南成都陆港枢纽',
    city: '成都市',
    region: '西南',
    x: 360,
    y: 330,
    capacity: 110,
    processingRate: 12,
    currentQueue: 10,
    inProcessing: 8,
    dispatchedCount: 96,
    status: 'Optimal',
    staffOnShift: 18,
    color: '#f472b6'
  },
  {
    id: 'wh-6',
    code: 'NW-SIA',
    name: '西北西安丝路集散中心',
    city: '西安市',
    region: '西北',
    x: 480,
    y: 240,
    capacity: 100,
    processingRate: 11,
    currentQueue: 12,
    inProcessing: 9,
    dispatchedCount: 88,
    status: 'Optimal',
    staffOnShift: 16,
    color: '#fb923c'
  }
];

export const DESTINATION_CITIES = [
  { id: 'dest-1', name: '杭州市', x: 840, y: 300, state: '浙江', hubId: 'wh-1' },
  { id: 'dest-2', name: '南京市', x: 770, y: 250, state: '江苏', hubId: 'wh-1' },
  { id: 'dest-3', name: '天津市', x: 670, y: 150, state: '天津', hubId: 'wh-2' },
  { id: 'dest-4', name: '青岛市', x: 790, y: 190, state: '山东', hubId: 'wh-2' },
  { id: 'dest-5', name: '深圳市', x: 710, y: 490, state: '广东', hubId: 'wh-3' },
  { id: 'dest-6', name: '厦门市', x: 810, y: 440, state: '福建', hubId: 'wh-3' },
  { id: 'dest-7', name: '长沙市', x: 590, y: 390, state: '湖南', hubId: 'wh-4' },
  { id: 'dest-8', name: '郑州市', x: 570, y: 230, state: '河南', hubId: 'wh-4' },
  { id: 'dest-9', name: '重庆市', x: 420, y: 360, state: '重庆', hubId: 'wh-5' },
  { id: 'dest-10', name: '昆明市', x: 320, y: 490, state: '云南', hubId: 'wh-5' },
  { id: 'dest-11', name: '兰州市', x: 380, y: 210, state: '甘肃', hubId: 'wh-6' },
  { id: 'dest-12', name: '银川市', x: 440, y: 160, state: '宁夏', hubId: 'wh-6' }
];

export const CUSTOMER_NAMES = [
  '华为技术供应链',
  '比亚迪智能工业',
  '宁德时代新能源',
  '京东自营全球购',
  '顺丰冷链医药',
  '阿里巴巴数字贸易',
  '药明康德生物制剂',
  '中联重科工程机械',
  '联想集团供应链',
  '中国中车装备制造',
  '海尔智家互联仓储',
  '小米科技生态链',
  '中远海运集运部',
  '国药控股医药配送',
  '美团优选大区中心'
];

export const SIGNERS = [
  '陈志强 (仓库收货主管)',
  '李玉婷 (质量检验组长)',
  '王振华 (物流调度专员)',
  '张伟明 (运营保障经理)',
  '刘晓丽 (供应链质控员)',
  '赵启明 (站区接收负责人)',
  '黄国庆 (装卸转运主管)',
  '周建平 (园区验收专员)'
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-8941',
    customer: '华为技术供应链',
    destination: '杭州市',
    orderDate: '2026-11-20T10:15:00Z',
    status: 'Delivered',
    priority: 'Urgent',
    warehouseId: 'wh-1',
    weightKg: 8.4,
    itemsCount: 4,
    estimatedDelivery: '2026-11-21T08:00:00Z',
    transitProgress: 100,
    deliveredAt: '2026-11-21T07:45:10Z',
    signedReceipt: {
      receiptNumber: 'REC-2026-8941',
      signedBy: '陈志强 (仓库收货主管)',
      timestamp: '2026-11-21T07:45:10Z',
      podCode: 'POD-8941-A90C',
      condition: '完好签收 - 电子铅封无损无异常',
      deliveryDurationHours: 21.5
    }
  },
  {
    id: 'ORD-8942',
    customer: '顺丰冷链医药',
    destination: '青岛市',
    orderDate: '2026-11-20T11:30:00Z',
    status: 'Delivered',
    priority: 'High',
    warehouseId: 'wh-2',
    weightKg: 14.2,
    itemsCount: 6,
    estimatedDelivery: '2026-11-21T12:00:00Z',
    transitProgress: 100,
    deliveredAt: '2026-11-21T11:10:00Z',
    signedReceipt: {
      receiptNumber: 'REC-2026-8942',
      signedBy: '王振华 (物流调度专员)',
      timestamp: '2026-11-21T11:10:00Z',
      podCode: 'POD-8942-F22B',
      condition: '温控全程达标 - 冷链签收检验合格',
      deliveryDurationHours: 23.6
    }
  },
  {
    id: 'ORD-8943',
    customer: '比亚迪智能工业',
    destination: '深圳市',
    orderDate: '2026-11-20T14:00:00Z',
    status: 'Delivered',
    priority: 'Standard',
    warehouseId: 'wh-3',
    weightKg: 42.0,
    itemsCount: 15,
    estimatedDelivery: '2026-11-21T15:00:00Z',
    transitProgress: 100,
    deliveredAt: '2026-11-21T14:40:00Z',
    signedReceipt: {
      receiptNumber: 'REC-2026-8943',
      signedBy: '李玉婷 (质量检验组长)',
      timestamp: '2026-11-21T14:40:00Z',
      podCode: 'POD-8943-C119',
      condition: '整托盘入库验收完毕 - 数量无误',
      deliveryDurationHours: 24.6
    }
  },
  {
    id: 'ORD-8944',
    customer: '宁德时代新能源',
    destination: '重庆市',
    orderDate: '2026-11-21T08:20:00Z',
    status: 'In Transit',
    priority: 'Urgent',
    warehouseId: 'wh-5',
    weightKg: 5.8,
    itemsCount: 2,
    estimatedDelivery: '2026-11-21T22:00:00Z',
    transitProgress: 68,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8945',
    customer: '京东自营全球购',
    destination: '厦门市',
    orderDate: '2026-11-21T09:00:00Z',
    status: 'In Transit',
    priority: 'High',
    warehouseId: 'wh-3',
    weightKg: 38.5,
    itemsCount: 8,
    estimatedDelivery: '2026-11-22T04:00:00Z',
    transitProgress: 42,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8946',
    customer: '药明康德生物制剂',
    destination: '南京市',
    orderDate: '2026-11-21T10:10:00Z',
    status: 'In Transit',
    priority: 'Urgent',
    warehouseId: 'wh-1',
    weightKg: 3.2,
    itemsCount: 1,
    estimatedDelivery: '2026-11-21T18:00:00Z',
    transitProgress: 85,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8947',
    customer: '海尔智家互联仓储',
    destination: '天津市',
    orderDate: '2026-11-21T11:45:00Z',
    status: 'Processing',
    priority: 'Standard',
    warehouseId: 'wh-2',
    weightKg: 19.0,
    itemsCount: 5,
    estimatedDelivery: '2026-11-22T10:00:00Z',
    transitProgress: 0,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8948',
    customer: '小米科技生态链',
    destination: '长沙市',
    orderDate: '2026-11-21T12:00:00Z',
    status: 'Processing',
    priority: 'High',
    warehouseId: 'wh-4',
    weightKg: 64.0,
    itemsCount: 12,
    estimatedDelivery: '2026-11-22T14:00:00Z',
    transitProgress: 0,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8949',
    customer: '中联重科工程机械',
    destination: '兰州市',
    orderDate: '2026-11-21T13:15:00Z',
    status: 'Processing',
    priority: 'Urgent',
    warehouseId: 'wh-6',
    weightKg: 11.2,
    itemsCount: 3,
    estimatedDelivery: '2026-11-22T08:00:00Z',
    transitProgress: 0,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8950',
    customer: '联想集团供应链',
    destination: '昆明市',
    orderDate: '2026-11-21T14:00:00Z',
    status: 'Backlog',
    priority: 'Standard',
    warehouseId: 'wh-5',
    weightKg: 18.0,
    itemsCount: 4,
    estimatedDelivery: '2026-11-23T12:00:00Z',
    transitProgress: 0,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8951',
    customer: '中国中车装备制造',
    destination: '郑州市',
    orderDate: '2026-11-21T14:30:00Z',
    status: 'Backlog',
    priority: 'Economy',
    warehouseId: 'wh-4',
    weightKg: 28.5,
    itemsCount: 7,
    estimatedDelivery: '2026-11-23T16:00:00Z',
    transitProgress: 0,
    deliveredAt: null,
    signedReceipt: null
  },
  {
    id: 'ORD-8952',
    customer: '国药控股医药配送',
    destination: '银川市',
    orderDate: '2026-11-21T15:00:00Z',
    status: 'Backlog',
    priority: 'Economy',
    warehouseId: 'wh-6',
    weightKg: 52.0,
    itemsCount: 10,
    estimatedDelivery: '2026-11-23T18:00:00Z',
    transitProgress: 0,
    deliveredAt: null,
    signedReceipt: null
  }
];

export const INITIAL_CONFIG = {
  dailyOrderVolume: 24, // 模拟每日订单生成频率因子 (5 - 50)
  warehouseCapacityMultiplier: 1.0, // 仓库库容调节系数
  deliveryCapacity: 35, // 运输车队并发运力上限
  avgTransitTime: 4, // 平均运输耗费刻度数 (2 - 8)
  activeWarehousesCount: 6, // 活跃仓库数 (2 - 6)
  speedMultiplier: 1, // 0.5, 1, 2, 5, 10
  autoIntake: true,
  failureRate: 0.02
};
