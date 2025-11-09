import { Wallet, FileText, CreditCard, TrendingUp } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'bills' | 'payment' | 'investment';
  setActiveTab: (tab: 'dashboard' | 'bills' | 'payment' | 'investment') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Wallet },
    { id: 'bills' as const, label: 'Minhas Contas', icon: FileText },
    { id: 'payment' as const, label: 'Pagar Contas', icon: CreditCard },
    { id: 'investment' as const, label: 'Investimentos', icon: TrendingUp },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1>Assistente Financeiro</h1>
              <p className="text-gray-500 text-sm">Gerencie suas finanças com inteligência</p>
            </div>
          </div>
        </div>
        
        <nav className="flex gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
