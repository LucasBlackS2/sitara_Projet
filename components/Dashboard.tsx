import { AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { billsData } from '../data/billsData';

interface DashboardProps {
  availableBalance: number;
  setActiveTab: (tab: 'dashboard' | 'bills' | 'payment' | 'investment') => void;
}

export function Dashboard({ availableBalance, setActiveTab }: DashboardProps) {
  const pendingBills = billsData.filter(bill => !bill.paid);
  const totalPending = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const overdueBills = pendingBills.filter(bill => new Date(bill.dueDate) < new Date());
  const upcomingBills = pendingBills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const remainingBalance = availableBalance - totalPending;

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Saldo Disponível</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-600">R$ {availableBalance.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Contas Pendentes</span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-orange-600">R$ {totalPending.toFixed(2)}</p>
          <span className="text-sm text-gray-500">{pendingBills.length} conta(s)</span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Contas Vencidas</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-red-600">{overdueBills.length}</p>
          <span className="text-sm text-gray-500">Requer atenção</span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Saldo Após Contas</span>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className={remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}>
            R$ {remainingBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {overdueBills.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-900">Atenção: {overdueBills.length} conta(s) vencida(s)</h3>
              <p className="text-red-700 text-sm mt-1">
                Você tem contas vencidas que precisam ser pagas urgentemente.
              </p>
            </div>
          </div>
        </div>
      )}

      {upcomingBills.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-yellow-900">{upcomingBills.length} conta(s) vencendo esta semana</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Não se esqueça de pagar suas contas nos próximos dias.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prioridades de Pagamento */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2>Ordem de Prioridade de Pagamento</h2>
          <p className="text-gray-600 text-sm mt-1">
            Baseado nas datas de vencimento e importância das contas
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {pendingBills.slice(0, 5).map((bill, index) => {
              const isOverdue = new Date(bill.dueDate) < new Date();
              const daysUntilDue = Math.ceil(
                (new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div
                  key={bill.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-red-100 text-red-600' :
                    index === 1 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p>{bill.name}</p>
                      {isOverdue && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                          Vencida
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                      {!isOverdue && ` (${daysUntilDue} dias)`}
                    </p>
                  </div>
                  
                  <p className={isOverdue ? 'text-red-600' : ''}>
                    R$ {bill.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={() => setActiveTab('payment')}
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pagar Contas Automaticamente
          </button>
        </div>
      </div>
    </div>
  );
}
