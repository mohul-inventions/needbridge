import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubmitDemandPage } from './pages/SubmitDemandPage';
import { DemandAnalysisPage } from './pages/DemandAnalysisPage';
import { DiscoveryExplorerPage } from './pages/DiscoveryExplorerPage';
import { DemandClustersPage } from './pages/DemandClustersPage';
import { ProcurementCampaignsPage } from './pages/ProcurementCampaignsPage';
import { CampaignDetailsPage } from './pages/CampaignDetailsPage';
import { SupplierMarketplacePage } from './pages/SupplierMarketplacePage';
import { SupplierDashboardPage } from './pages/SupplierDashboardPage';
import { AgentActivityPage } from './pages/AgentActivityPage';
import { LiquidityAnalyticsPage } from './pages/LiquidityAnalyticsPage';
import { PredictiveDemandPage } from './pages/PredictiveDemandPage';
import { FinancialDashboardPage } from './pages/FinancialDashboardPage';
import { TransactionLedgerPage } from './pages/TransactionLedgerPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { OrganizationPage } from './pages/OrganizationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const renderPage = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setCurrentTab('dashboard')}
            onExploreDemo={() => setCurrentTab('campaigns')}
          />
        );
      case 'auth':
        return <AuthPage onSuccess={() => setCurrentTab('dashboard')} />;
      case 'role_selection':
        return <RoleSelectionPage onRoleSelected={() => setCurrentTab('dashboard')} />;
      case 'dashboard':
        return <DashboardPage setTab={setCurrentTab} setSelectedCampaignId={setSelectedCampaignId} />;
      case 'submit_demand':
        return <SubmitDemandPage setTab={setCurrentTab} />;
      case 'demand_analysis':
        return <DemandAnalysisPage setTab={setCurrentTab} />;
      case 'discovery_explorer':
        return <DiscoveryExplorerPage setTab={setCurrentTab} />;
      case 'demand_clusters':
        return <DemandClustersPage setTab={setCurrentTab} setSelectedCampaignId={setSelectedCampaignId} />;
      case 'campaigns':
        return <ProcurementCampaignsPage setTab={setCurrentTab} setSelectedCampaignId={setSelectedCampaignId} />;
      case 'campaign_details':
        return <CampaignDetailsPage campaignId={selectedCampaignId} setTab={setCurrentTab} />;
      case 'suppliers':
        return <SupplierMarketplacePage setTab={setCurrentTab} />;
      case 'supplier_dashboard':
        return <SupplierDashboardPage />;
      case 'agent_activity':
        return <AgentActivityPage />;
      case 'liquidity_analytics':
        return <LiquidityAnalyticsPage />;
      case 'predictive_demand':
        return <PredictiveDemandPage />;
      case 'financial_dashboard':
        return <FinancialDashboardPage setTab={setCurrentTab} />;
      case 'ledger':
        return <TransactionLedgerPage />;
      case 'order_tracking':
        return <OrderTrackingPage />;
      case 'notifications':
        return <NotificationsPage setTab={setCurrentTab} />;
      case 'profile':
        return <UserProfilePage />;
      case 'organization':
        return <OrganizationPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage setTab={setCurrentTab} setSelectedCampaignId={setSelectedCampaignId} />;
    }
  };

  const isStandalonePage = currentTab === 'landing' || currentTab === 'auth';

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F8FAFC] flex flex-col font-sans">
      <DemoBanner />
      {!isStandalonePage && <Navbar currentTab={currentTab} setTab={setCurrentTab} />}

      <div className="flex-1 flex">
        {!isStandalonePage && <Sidebar currentTab={currentTab} setTab={setCurrentTab} />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${isStandalonePage ? 'p-0' : ''}`}>
          {renderPage()}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
