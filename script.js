// Application State
let availableBalance = 5000;
let bills = [...billsData];
let currentBillsFilter = 'all';
let selectedBills = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeDashboard();
    initializeBillsList();
    initializePayment();
    initializeInvestments();
});

// Navigation
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Refresh content based on tab
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'bills') {
        updateBillsList();
    } else if (tabName === 'payment') {
        updatePaymentForms();
    } else if (tabName === 'investment') {
        updateInvestments();
    }
}

// Dashboard Functions
function initializeDashboard() {
    updateDashboard();
}

function updateDashboard() {
    const pendingBills = bills.filter(bill => !bill.paid);
    const totalPending = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);
    const overdueBills = pendingBills.filter(bill => new Date(bill.dueDate) < new Date());
    const remainingBalance = availableBalance - totalPending;

    // Update summary cards
    document.getElementById('available-balance').textContent = `R$ ${availableBalance.toFixed(2)}`;
    document.getElementById('pending-total').textContent = `R$ ${totalPending.toFixed(2)}`;
    document.getElementById('pending-count').textContent = `${pendingBills.length} conta(s)`;
    document.getElementById('overdue-count').textContent = overdueBills.length;
    
    const remainingEl = document.getElementById('remaining-balance');
    remainingEl.textContent = `R$ ${remainingBalance.toFixed(2)}`;
    remainingEl.className = `summary-value ${remainingBalance >= 0 ? 'blue' : 'red'}`;

    // Update alerts
    updateAlerts(overdueBills, pendingBills);

    // Update priority list
    updatePriorityList(pendingBills);
}

function updateAlerts(overdueBills, pendingBills) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';

    // Overdue alert
    if (overdueBills.length > 0) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
                <p><strong>Atenção: ${overdueBills.length} conta(s) vencida(s)</strong></p>
                <p class="alert-subtitle">Você tem contas vencidas que precisam ser pagas urgentemente.</p>
            </div>
        `;
        alertsContainer.appendChild(alert);
    }

    // Upcoming bills alert
    const upcomingBills = pendingBills.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    });

    if (upcomingBills.length > 0) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-warning';
        alert.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div>
                <p><strong>${upcomingBills.length} conta(s) vencendo esta semana</strong></p>
                <p class="alert-subtitle">Não se esqueça de pagar suas contas nos próximos dias.</p>
            </div>
        `;
        alertsContainer.appendChild(alert);
    }
}

function updatePriorityList(pendingBills) {
    const priorityList = document.getElementById('priority-list');
    const sortedBills = [...pendingBills].slice(0, 5);

    priorityList.innerHTML = sortedBills.map((bill, index) => {
        const isOverdue = new Date(bill.dueDate) < new Date();
        const daysUntilDue = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        const rankClass = index === 0 ? 'rank-0' : index === 1 ? 'rank-1' : 'rank-default';

        return `
            <div class="priority-item">
                <div class="priority-badge ${rankClass}">${index + 1}</div>
                <div class="priority-info">
                    <div class="priority-status">
                        <p>${bill.name}</p>
                        ${isOverdue ? '<span class="status-badge overdue">Vencida</span>' : ''}
                    </div>
                    <p class="priority-date">
                        Vencimento: ${formatDate(bill.dueDate)}
                        ${!isOverdue ? `(${daysUntilDue} dias)` : ''}
                    </p>
                </div>
                <p class="priority-amount ${isOverdue ? 'overdue' : ''}">R$ ${bill.amount.toFixed(2)}</p>
            </div>
        `;
    }).join('');
}

// Bills List Functions
function initializeBillsList() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBillsFilter = btn.getAttribute('data-filter');
            updateBillsList();
        });
    });
    updateBillsList();
}

function updateBillsList() {
    const filteredBills = bills.filter(bill => {
        if (currentBillsFilter === 'pending') return !bill.paid;
        if (currentBillsFilter === 'paid') return bill.paid;
        return true;
    });

    // Update filter counts
    document.getElementById('filter-all-count').textContent = bills.length;
    document.getElementById('filter-pending-count').textContent = bills.filter(b => !b.paid).length;
    document.getElementById('filter-paid-count').textContent = bills.filter(b => b.paid).length;

    const billsList = document.getElementById('bills-list');
    billsList.innerHTML = filteredBills.map(bill => {
        const status = getBillStatus(bill);
        return `
            <div class="bill-item">
                <div class="bill-icon status-${status.type}">
                    ${status.icon}
                </div>
                <div class="bill-info">
                    <div class="bill-title">
                        <p>${bill.name}</p>
                        <span class="status-badge ${status.type}">${status.label}</span>
                    </div>
                    <p class="bill-meta">${bill.category} • Vencimento: ${formatDate(bill.dueDate)}</p>
                    ${bill.description ? `<p class="bill-description">${bill.description}</p>` : ''}
                </div>
                <div class="bill-amount-section">
                    <p class="bill-amount ${status.color}">R$ ${bill.amount.toFixed(2)}</p>
                    <p class="bill-priority">Prioridade: ${getPriorityLabel(bill.priority)}</p>
                </div>
            </div>
        `;
    }).join('');
}

function getBillStatus(bill) {
    if (bill.paid) {
        return {
            type: 'paid',
            label: 'Paga',
            color: 'green',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`
        };
    }

    const dueDate = new Date(bill.dueDate);
    const today = new Date();

    if (dueDate < today) {
        return {
            type: 'overdue',
            label: 'Vencida',
            color: 'red',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>`
        };
    }

    return {
        type: 'pending',
        label: 'Pendente',
        color: 'orange',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>`
    };
}

// Payment Functions
function initializePayment() {
    // Auto Payment
    document.getElementById('auto-pay-btn').addEventListener('click', handleAutoPayment);

    // Manual Payment
    updatePaymentForms();
    document.getElementById('manual-pay-btn').addEventListener('click', handleManualPayment);
}

function updatePaymentForms() {
    const pendingBills = bills.filter(bill => !bill.paid);
    const manualList = document.getElementById('manual-payment-list');

    manualList.innerHTML = pendingBills.map(bill => {
        const isOverdue = new Date(bill.dueDate) < new Date();
        const isSelected = selectedBills.includes(bill.id);

        return `
            <label class="bill-checkbox-item ${isSelected ? 'selected' : ''}">
                <input type="checkbox" ${isSelected ? 'checked' : ''} data-bill-id="${bill.id}">
                <div class="checkbox-info">
                    <div class="checkbox-title">
                        <span>${bill.name}</span>
                        ${isOverdue ? '<span class="status-badge overdue">Vencida</span>' : ''}
                    </div>
                    <p class="checkbox-date">${formatDate(bill.dueDate)}</p>
                </div>
                <p class="checkbox-amount">R$ ${bill.amount.toFixed(2)}</p>
            </label>
        `;
    }).join('');

    // Add event listeners to checkboxes
    manualList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const billId = parseInt(e.target.getAttribute('data-bill-id'));
            if (e.target.checked) {
                selectedBills.push(billId);
            } else {
                selectedBills = selectedBills.filter(id => id !== billId);
            }
            updateManualPaymentSummary();
        });
    });

    updateManualPaymentSummary();
}

function updateManualPaymentSummary() {
    const pendingBills = bills.filter(bill => !bill.paid);
    const totalSelected = pendingBills
        .filter(bill => selectedBills.includes(bill.id))
        .reduce((sum, bill) => sum + bill.amount, 0);

    const summary = document.getElementById('manual-payment-summary');
    const btn = document.getElementById('manual-pay-btn');

    if (selectedBills.length > 0) {
        summary.style.display = 'block';
        btn.disabled = false;

        document.getElementById('manual-total').textContent = `R$ ${totalSelected.toFixed(2)}`;
        
        const remaining = availableBalance - totalSelected;
        const remainingEl = document.getElementById('manual-remaining');
        remainingEl.textContent = `R$ ${remaining.toFixed(2)}`;
        remainingEl.className = remaining >= 0 ? 'green' : 'red';
    } else {
        summary.style.display = 'none';
        btn.disabled = true;
    }
}

function handleAutoPayment() {
    const amountInput = document.getElementById('auto-payment-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira um valor válido');
        return;
    }

    const btn = document.getElementById('auto-pay-btn');
    btn.disabled = true;
    btn.innerHTML = `
        <div class="spinner"></div>
        Processando...
    `;

    setTimeout(() => {
        let remainingAmount = amount;
        const paidBills = [];
        const pendingBills = bills.filter(bill => !bill.paid);

        for (const bill of pendingBills) {
            if (remainingAmount >= bill.amount) {
                bill.paid = true;
                paidBills.push(bill);
                remainingAmount -= bill.amount;
            } else {
                break;
            }
        }

        availableBalance = remainingAmount;

        // Show success message
        const successEl = document.getElementById('auto-payment-success');
        document.getElementById('auto-payment-count').textContent = `${paidBills.length} conta(s) paga(s)`;
        successEl.style.display = 'flex';

        setTimeout(() => {
            successEl.style.display = 'none';
            amountInput.value = '';
        }, 3000);

        btn.disabled = false;
        btn.innerHTML = `
            Pagar Automaticamente
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        `;

        updateDashboard();
        updateBillsList();
        updatePaymentForms();
    }, 2000);
}

function handleManualPayment() {
    if (selectedBills.length === 0) {
        alert('Selecione pelo menos uma conta para pagar');
        return;
    }

    const btn = document.getElementById('manual-pay-btn');
    btn.disabled = true;
    btn.innerHTML = `
        <div class="spinner"></div>
        Processando...
    `;

    setTimeout(() => {
        const pendingBills = bills.filter(bill => !bill.paid);
        const totalSelected = pendingBills
            .filter(bill => selectedBills.includes(bill.id))
            .reduce((sum, bill) => sum + bill.amount, 0);

        bills.forEach(bill => {
            if (selectedBills.includes(bill.id)) {
                bill.paid = true;
            }
        });

        availableBalance -= totalSelected;
        selectedBills = [];

        btn.disabled = false;
        btn.innerHTML = `
            Pagar Contas Selecionadas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        `;

        alert('Pagamento realizado com sucesso!');

        updateDashboard();
        updateBillsList();
        updatePaymentForms();
    }, 2000);
}

// Investment Functions
function initializeInvestments() {
    updateInvestments();
}

function updateInvestments() {
    const investments = [
        {
            id: 1,
            title: 'Reserva de Emergência',
            description: 'Comece guardando 3-6 meses de despesas em investimentos de alta liquidez',
            icon: '🛡️',
            color: 'blue',
            risk: 'Baixo',
            return: '100% do CDI',
            minAmount: 100,
            recommended: availableBalance >= 100 && availableBalance < 1000
        },
        {
            id: 2,
            title: 'Tesouro Selic',
            description: 'Ideal para curto prazo, alta liquidez e segurança garantida pelo governo',
            icon: '🏦',
            color: 'green',
            risk: 'Muito Baixo',
            return: '100% da Selic',
            minAmount: 30,
            recommended: availableBalance >= 30 && availableBalance < 500
        },
        {
            id: 3,
            title: 'CDB com Liquidez Diária',
            description: 'Rendimento superior à poupança com proteção do FGC',
            icon: '💰',
            color: 'purple',
            risk: 'Baixo',
            return: '110% do CDI',
            minAmount: 500,
            recommended: availableBalance >= 500 && availableBalance < 2000
        },
        {
            id: 4,
            title: 'Fundos de Renda Fixa',
            description: 'Diversificação automática em títulos de renda fixa',
            icon: '📈',
            color: 'blue',
            risk: 'Baixo a Médio',
            return: '8-12% ao ano',
            minAmount: 1000,
            recommended: availableBalance >= 1000 && availableBalance < 5000
        },
        {
            id: 5,
            title: 'ETFs de Índices',
            description: 'Invista em ações com diversificação automática e baixo custo',
            icon: '⚡',
            color: 'orange',
            risk: 'Médio',
            return: '10-15% ao ano',
            minAmount: 500,
            recommended: availableBalance >= 2000
        },
        {
            id: 6,
            title: 'Educação Financeira',
            description: 'Invista em conhecimento para tomar melhores decisões financeiras',
            icon: '📚',
            color: 'orange',
            risk: 'Nenhum',
            return: 'Invaluável',
            minAmount: 0,
            recommended: true
        }
    ];

    // Update recommendation banner
    updateRecommendationBanner();

    // Update investments list
    const investmentsList = document.getElementById('investments-list');
    const recommendedInvestments = investments.filter(inv => inv.recommended);

    investmentsList.innerHTML = recommendedInvestments.map(investment => {
        const canInvest = availableBalance >= investment.minAmount;

        return `
            <div class="investment-card ${canInvest ? 'available' : 'unavailable'}">
                <div class="investment-header">
                    <div class="investment-icon" style="font-size: 2rem;">${investment.icon}</div>
                    <div class="investment-title-section">
                        <div class="investment-title-row">
                            <h3>${investment.title}</h3>
                            ${canInvest ? '<span class="status-badge" style="background: #dcfce7; color: #166534;">Disponível</span>' : ''}
                        </div>
                    </div>
                </div>
                <p class="investment-description">${investment.description}</p>
                <div class="investment-details">
                    <div class="investment-detail-row">
                        <span>Risco:</span>
                        <span>${investment.risk}</span>
                    </div>
                    <div class="investment-detail-row">
                        <span>Retorno estimado:</span>
                        <span class="return-value">${investment.return}</span>
                    </div>
                    <div class="investment-detail-row">
                        <span>Mínimo:</span>
                        <span>${investment.minAmount === 0 ? 'Grátis' : `R$ ${investment.minAmount.toFixed(2)}`}</span>
                    </div>
                </div>
                ${canInvest && investment.minAmount > 0 ? '<button class="btn btn-primary">Começar a investir</button>' : ''}
            </div>
        `;
    }).join('');
}

function updateRecommendationBanner() {
    let recommendation;

    if (availableBalance < 30) {
        recommendation = {
            title: 'Continue economizando!',
            message: 'Quando você tiver pelo menos R$ 30,00 disponíveis, poderá começar a investir no Tesouro Selic.',
            color: 'background: #fef3c7; border-color: #fde68a; color: #78350f;'
        };
    } else if (availableBalance < 500) {
        recommendation = {
            title: 'Ótimo começo!',
            message: 'Você já pode começar a investir. Priorize construir uma reserva de emergência.',
            color: 'background: #dcfce7; border-color: #bbf7d0; color: #166534;'
        };
    } else if (availableBalance < 2000) {
        recommendation = {
            title: 'Excelente progresso!',
            message: 'Com esse valor, você pode diversificar entre diferentes investimentos de baixo risco.',
            color: 'background: #dbeafe; border-color: #bfdbfe; color: #1e40af;'
        };
    } else {
        recommendation = {
            title: 'Patrimônio saudável!',
            message: 'Considere diversificar em diferentes classes de ativos para potencializar seus ganhos.',
            color: 'background: #f3e8ff; border-color: #e9d5ff; color: #6b21a8;'
        };
    }

    const banner = document.getElementById('investment-recommendation');
    banner.style.cssText = recommendation.color;
    banner.innerHTML = `
        <h2>${recommendation.title}</h2>
        <p>${recommendation.message}</p>
        <div class="balance-display">
            <span style="color: #6b7280;">Seu saldo disponível:</span>
            <strong style="color: #059669; font-size: 1.125rem;">R$ ${availableBalance.toFixed(2)}</strong>
        </div>
    `;
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getPriorityLabel(priority) {
    const labels = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    };
    return labels[priority] || priority;
}
