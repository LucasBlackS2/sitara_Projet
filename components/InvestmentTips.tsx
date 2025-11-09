import { TrendingUp, PiggyBank, Shield, Zap, BookOpen, DollarSign } from 'lucide-react';

interface InvestmentTipsProps {
  availableBalance: number;
}

export function InvestmentTips({ availableBalance }: InvestmentTipsProps) {
  const investments = [
    {
      id: 1,
      title: 'Reserva de Emergência',
      description: 'Comece guardando 3-6 meses de despesas em investimentos de alta liquidez',
      icon: Shield,
      color: 'bg-blue-100 text-blue-600',
      risk: 'Baixo',
      return: '100% do CDI',
      minAmount: 100,
      recommended: availableBalance >= 100 && availableBalance < 1000,
    },
    {
      id: 2,
      title: 'Tesouro Selic',
      description: 'Ideal para curto prazo, alta liquidez e segurança garantida pelo governo',
      icon: PiggyBank,
      color: 'bg-green-100 text-green-600',
      risk: 'Muito Baixo',
      return: '100% da Selic',
      minAmount: 30,
      recommended: availableBalance >= 30 && availableBalance < 500,
    },
    {
      id: 3,
      title: 'CDB com Liquidez Diária',
      description: 'Rendimento superior à poupança com proteção do FGC',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
      risk: 'Baixo',
      return: '110% do CDI',
      minAmount: 500,
      recommended: availableBalance >= 500 && availableBalance < 2000,
    },
    {
      id: 4,
      title: 'Fundos de Renda Fixa',
      description: 'Diversificação automática em títulos de renda fixa',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600',
      risk: 'Baixo a Médio',
      return: '8-12% ao ano',
      minAmount: 1000,
      recommended: availableBalance >= 1000 && availableBalance < 5000,
    },
    {
      id: 5,
      title: 'ETFs de Índices',
      description: 'Invista em ações com diversificação automática e baixo custo',
      icon: Zap,
      color: 'bg-orange-100 text-orange-600',
      risk: 'Médio',
      return: '10-15% ao ano',
      minAmount: 500,
      recommended: availableBalance >= 2000,
    },
    {
      id: 6,
      title: 'Educação Financeira',
      description: 'Invista em conhecimento para tomar melhores decisões financeiras',
      icon: BookOpen,
      color: 'bg-yellow-100 text-yellow-600',
      risk: 'Nenhum',
      return: 'Invaluável',
      minAmount: 0,
      recommended: true,
    },
  ];

  const recommendedInvestments = investments.filter(inv => inv.recommended);

  const getRecommendationMessage = () => {
    if (availableBalance < 30) {
      return {
        title: 'Continue economizando!',
        message: 'Quando você tiver pelo menos R$ 30,00 disponíveis, poderá começar a investir no Tesouro Selic.',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      };
    } else if (availableBalance < 500) {
      return {
        title: 'Ótimo começo!',
        message: 'Você já pode começar a investir. Priorize construir uma reserva de emergência.',
        color: 'bg-green-50 border-green-200 text-green-900',
      };
    } else if (availableBalance < 2000) {
      return {
        title: 'Excelente progresso!',
        message: 'Com esse valor, você pode diversificar entre diferentes investimentos de baixo risco.',
        color: 'bg-blue-50 border-blue-200 text-blue-900',
      };
    } else {
      return {
        title: 'Patrimônio saudável!',
        message: 'Considere diversificar em diferentes classes de ativos para potencializar seus ganhos.',
        color: 'bg-purple-50 border-purple-200 text-purple-900',
      };
    }
  };

  const recommendation = getRecommendationMessage();

  return (
    <div className="space-y-6">
      {/* Resumo Personalizado */}
      <div className={`rounded-xl p-6 border ${recommendation.color}`}>
        <h2>{recommendation.title}</h2>
        <p className="mt-2">{recommendation.message}</p>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Seu saldo disponível:</span>
            <p className="text-green-600">R$ {availableBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Investimentos Recomendados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="mb-6">Investimentos Recomendados Para Você</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedInvestments.map((investment) => {
            const Icon = investment.icon;
            const canInvest = availableBalance >= investment.minAmount;
            
            return (
              <div
                key={investment.id}
                className={`p-5 border rounded-xl transition-all ${
                  canInvest
                    ? 'border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer'
                    : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${investment.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3>{investment.title}</h3>
                      {canInvest && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Disponível
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {investment.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risco:</span>
                        <span>{investment.risk}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Retorno estimado:</span>
                        <span className="text-green-600">{investment.return}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mínimo:</span>
                        <span>
                          {investment.minAmount === 0 ? 'Grátis' : `R$ ${investment.minAmount.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    
                    {canInvest && investment.minAmount > 0 && (
                      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Começar a investir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dicas Gerais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="mb-4">Dicas de Investimento</h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-blue-900 mb-1">📊 Diversifique seus investimentos</h3>
            <p className="text-sm text-blue-800">
              Não coloque todo o dinheiro em um único investimento. Distribua entre diferentes tipos de aplicações.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-green-900 mb-1">🎯 Tenha objetivos claros</h3>
            <p className="text-sm text-green-800">
              Defina se está investindo para curto, médio ou longo prazo. Isso ajuda a escolher o melhor investimento.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-purple-900 mb-1">💰 Comece pequeno</h3>
            <p className="text-sm text-purple-800">
              Não precisa ter muito dinheiro para começar. O importante é criar o hábito de investir regularmente.
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="text-orange-900 mb-1">⚠️ Cuidado com promessas milagrosas</h3>
            <p className="text-sm text-orange-800">
              Desconfie de investimentos que prometem retornos muito altos. Geralmente, maior retorno significa maior risco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
