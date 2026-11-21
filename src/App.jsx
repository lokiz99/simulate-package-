import React, { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import OrderDetailModal from './components/orders/OrderDetailModal';
import NewOrderModal from './components/orders/NewOrderModal';

import DashboardView from './views/DashboardView';
import SimulationView from './views/SimulationView';
import OrdersView from './views/OrdersView';
import WarehousesView from './views/WarehousesView';
import NetworkView from './views/NetworkView';
import ReportsView from './views/ReportsView';

const MainLayout = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header onOpenNewOrder={() => setIsNewOrderOpen(true)} />

      {/* Main Workspace with Sidebar and Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateToOrders={() => setCurrentTab('orders')}
              onNavigateToSimulation={() => setCurrentTab('simulation')}
            />
          )}

          {currentTab === 'simulation' && (
            <SimulationView />
          )}

          {currentTab === 'orders' && (
            <OrdersView onOpenNewOrder={() => setIsNewOrderOpen(true)} />
          )}

          {currentTab === 'warehouses' && (
            <WarehousesView />
          )}

          {currentTab === 'network' && (
            <NetworkView />
          )}

          {currentTab === 'reports' && (
            <ReportsView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <OrderDetailModal />
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
}

export default App;
