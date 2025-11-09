export interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  paid: boolean;
  description?: string;
}

export const billsData: Bill[] = [
  {
    id: 1,
    name: 'Energia Elétrica',
    amount: 250.80,
    dueDate: '2025-11-01',
    category: 'Utilidades',
    priority: 'high',
    paid: false,
    description: 'CEMIG - Consumo residencial',
  },
  {
    id: 2,
    name: 'Aluguel',
    amount: 1200.00,
    dueDate: '2025-11-05',
    category: 'Moradia',
    priority: 'high',
    paid: false,
    description: 'Pagamento mensal de aluguel',
  },
  {
    id: 3,
    name: 'Internet',
    amount: 99.90,
    dueDate: '2025-11-08',
    category: 'Utilidades',
    priority: 'high',
    paid: false,
    description: 'NET - 500MB',
  },
  {
    id: 4,
    name: 'Água',
    amount: 85.50,
    dueDate: '2025-11-10',
    category: 'Utilidades',
    priority: 'high',
    paid: false,
    description: 'SABESP - Consumo residencial',
  },
  {
    id: 5,
    name: 'Cartão de Crédito',
    amount: 856.40,
    dueDate: '2025-11-12',
    category: 'Financeiro',
    priority: 'high',
    paid: false,
    description: 'Nubank - Fatura mensal',
  },
  {
    id: 6,
    name: 'Plano de Saúde',
    amount: 450.00,
    dueDate: '2025-11-15',
    category: 'Saúde',
    priority: 'high',
    paid: false,
    description: 'Unimed - Plano individual',
  },
  {
    id: 7,
    name: 'Seguro do Carro',
    amount: 180.00,
    dueDate: '2025-11-18',
    category: 'Transporte',
    priority: 'medium',
    paid: false,
    description: 'Porto Seguro - Parcela mensal',
  },
  {
    id: 8,
    name: 'Academia',
    amount: 89.90,
    dueDate: '2025-11-20',
    category: 'Saúde',
    priority: 'medium',
    paid: false,
    description: 'Smart Fit - Mensalidade',
  },
  {
    id: 9,
    name: 'Streaming (Netflix)',
    amount: 39.90,
    dueDate: '2025-11-22',
    category: 'Entretenimento',
    priority: 'low',
    paid: false,
    description: 'Plano Padrão',
  },
  {
    id: 10,
    name: 'Condomínio',
    amount: 350.00,
    dueDate: '2025-10-28',
    category: 'Moradia',
    priority: 'high',
    paid: false,
    description: 'Taxa condominial - VENCIDA',
  },
];
