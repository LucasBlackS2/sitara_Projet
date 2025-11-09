import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { billsData } from '../data/billsData';

export function BillsList() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [bills] = useState(billsData);

  const filteredBills = bills.filter(bill => {
    if (filter === 'pending') return !bill.paid;
    if (filter === 'paid') return bill.paid;
    return true;
  });

  const getBillStatus = (bill: typeof bills[0]) => {
    if (bill.paid) return { label: 'Paga', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    
    if (dueDate < today) {
      return { label: 'Vencida', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle };
    }
    
    return { label: 'Pendente', color: 'text-orange-600', bg: 'bg-orange-100', icon: Clock };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2>Minhas Contas</h2>
            <p className="text-gray-600 text-sm mt-1">
              Todas as contas vinculadas ao seu CPF
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Adicionar Conta
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({bills.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes ({bills.filter(b => !b.paid).length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'paid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagas ({bills.filter(b => b.paid).length})
          </button>
        </div>

        <div className="space-y-3">
          {filteredBills.map((bill) => {
            const status = getBillStatus(bill);
            const StatusIcon = status.icon;
            
            return (
              <div
                key={bill.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className={`p-3 rounded-lg ${status.bg}`}>
                  <StatusIcon className={`w-6 h-6 ${status.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p>{bill.name}</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {bill.category} • Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                  {bill.description && (
                    <p className="text-sm text-gray-500 mt-1">{bill.description}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className={status.color}>R$ {bill.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Prioridade: {bill.priority === 'high' ? 'Alta' : bill.priority === 'medium' ? 'Média' : 'Baixa'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
