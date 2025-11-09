import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { BillsList } from './components/BillsList';
import { PaymentForm } from './components/PaymentForm';
import { InvestmentTips } from './components/InvestmentTips';
import { Header } from './components/Header';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bills' | 'payment' | 'investment'>('dashboard');
  const [availableBalance, setAvailableBalance] = useState(5000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {activeTab === 'dashboard' && (
          <Dashboard 
            availableBalance={availableBalance}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'bills' && (
          <BillsList />
        )}
        
        {activeTab === 'payment' && (
          <PaymentForm 
            availableBalance={availableBalance}
            setAvailableBalance={setAvailableBalance}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'investment' && (
          <InvestmentTips availableBalance={availableBalance} />
        )}
      </main>
    </div>
  );
}
