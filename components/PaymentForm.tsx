import { useState } from 'react';
import { CreditCard, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import { billsData } from '../data/billsData';

interface PaymentFormProps {
  availableBalance: number;
  setAvailableBalance: (balance: number) => void;
  setActiveTab: (tab: 'dashboard' | 'bills' | 'payment' | 'investment') => void;
}

export function PaymentForm({ availableBalance, setAvailableBalance, setActiveTab }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedBills, setSelectedBills] = useState<number[]>([]);

  const pendingBills = billsData.filter(bill => !bill.paid);
  const totalSelected = pendingBills
    .filter(bill => selectedBills.includes(bill.id))
    .reduce((sum, bill) => sum + bill.amount, 0);

  const handleAutoPay = () => {
    const enteredAmount = parseFloat(amount);
    
    if (isNaN(enteredAmount) || enteredAmount <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      let remainingAmount = enteredAmount;
      const billsToPay: number[] = [];
      
      // Pagar contas por prioridade
      for (const bill of pendingBills) {
        if (remainingAmount >= bill.amount) {
          billsToPay.push(bill.id);
          remainingAmount -= bill.amount;
        } else {
          break;
        }
      }
      
      setSelectedBills(billsToPay);
      setAvailableBalance(remainingAmount);
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleManualPayment = () => {
    if (selectedBills.length === 0) {
      alert('Selecione pelo menos uma conta para pagar');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setAvailableBalance(availableBalance - totalSelected);
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedBills([]);
      }, 3000);
    }, 2000);
  };

  const toggleBill = (billId: number) => {
    setSelectedBills(prev =>
      prev.includes(billId)
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pagamento Automático */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2>Pagamento Automático</h2>
            <p className="text-gray-600 text-sm">
              Insira o valor e pagaremos as contas por prioridade
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Valor Disponível para Pagamento
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                step="0.01"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleAutoPay}
            disabled={isProcessing || !amount}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Pagar Automaticamente
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {showSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-900">Pagamento realizado com sucesso!</p>
                <p className="text-sm text-green-700 mt-1">
                  {selectedBills.length} conta(s) paga(s)
                </p>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Como funciona:</strong> Priorizamos as contas vencidas e com maior prioridade, 
              garantindo que você pague primeiro o que é mais importante.
            </p>
          </div>
        </div>
      </div>

      {/* Pagamento Manual */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2>Pagamento Manual</h2>
            <p className="text-gray-600 text-sm">
              Selecione as contas que deseja pagar
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-2">
            {pendingBills.map((bill) => {
              const isSelected = selectedBills.includes(bill.id);
              const isOverdue = new Date(bill.dueDate) < new Date();
              
              return (
                <label
                  key={bill.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleBill(bill.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{bill.name}</p>
                      {isOverdue && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                          Vencida
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-sm">{bill.amount.toFixed(2)}</p>
                </label>
              );
            })}
          </div>

          {selectedBills.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Selecionado:</span>
                <p>R$ {totalSelected.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Saldo Após Pagamento:</span>
                <p className={availableBalance - totalSelected >= 0 ? 'text-green-600' : 'text-red-600'}>
                  R$ {(availableBalance - totalSelected).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleManualPayment}
            disabled={isProcessing || selectedBills.length === 0}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Pagar Contas Selecionadas
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
