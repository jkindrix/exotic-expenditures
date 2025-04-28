/**
 * Dashboard javascript for Exotic Expenditures
 * Handles contribution management dashboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Modal management
    const modals = {
        'change-amount-modal': document.getElementById('change-amount-modal'),
        'pause-contributions-modal': document.getElementById('pause-contributions-modal'),
        'cancel-contributions-modal': document.getElementById('cancel-contributions-modal'),
        'receipt-modal': document.getElementById('receipt-modal')
    };
    
    // Modal trigger buttons
    const modalTriggers = {
        'change-amount-btn': 'change-amount-modal',
        'pause-contributions-btn': 'pause-contributions-modal',
        'cancel-contributions-btn': 'cancel-contributions-modal'
    };
    
    // Form references
    const changeAmountForm = document.getElementById('change-amount-form');
    const pauseContributionsForm = document.getElementById('pause-contributions-form');
    const cancelContributionsForm = document.getElementById('cancel-contributions-form');
    
    // Notification elements
    const successNotification = document.getElementById('success-notification');
    const errorNotification = document.getElementById('error-notification');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Transaction table elements
    const transactionSearch = document.getElementById('transaction-search');
    const transactionRows = document.querySelectorAll('.transaction-table tbody tr');
    const receiptButtons = document.querySelectorAll('.table-action[data-receipt]');
    
    // Receipt modal elements
    const receiptTransactionId = document.getElementById('receipt-transaction-id');
    const receiptDate = document.getElementById('receipt-date');
    const receiptDescription = document.getElementById('receipt-description');
    const receiptPaymentMethod = document.getElementById('receipt-payment-method');
    const receiptStatus = document.getElementById('receipt-status');
    const receiptAmount = document.getElementById('receipt-amount');
    const downloadReceiptBtn = document.getElementById('download-receipt');
    const emailReceiptBtn = document.getElementById('email-receipt');
    
    // Open modal with specified ID
    function openModal(modalId) {
        if (modals[modalId]) {
            modals[modalId].classList.add('active');
            // Close other modals
            Object.keys(modals).forEach(id => {
                if (id !== modalId && modals[id]) {
                    modals[id].classList.remove('active');
                }
            });
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close the specified modal
    function closeModal(modalId) {
        if (modals[modalId]) {
            modals[modalId].classList.remove('active');
            // Restore scrolling
            document.body.style.overflow = '';
        }
    }
    
    // Close all open modals
    function closeAllModals() {
        Object.keys(modals).forEach(id => {
            if (modals[id]) {
                modals[id].classList.remove('active');
            }
        });
        document.body.style.overflow = '';
    }
    
    // Show notification
    function showNotification(type, message) {
        // Set notification message
        if (type === 'success' && successMessage) {
            successMessage.textContent = message;
            successNotification.classList.add('active');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                successNotification.classList.remove('active');
            }, 5000);
        } else if (type === 'error' && errorMessage) {
            errorMessage.textContent = message;
            errorNotification.classList.add('active');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                errorNotification.classList.remove('active');
            }, 5000);
        }
    }
    
    // Filter transactions based on search input
    function filterTransactions(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        
        transactionRows.forEach(row => {
            if (!searchTerm) {
                row.style.display = '';
                return;
            }
            
            const date = row.cells[0].textContent.toLowerCase();
            const id = row.cells[1].textContent.toLowerCase();
            const description = row.cells[2].textContent.toLowerCase();
            const amount = row.cells[3].textContent.toLowerCase();
            const status = row.cells[4].textContent.toLowerCase();
            
            if (date.includes(searchTerm) || 
                id.includes(searchTerm) || 
                description.includes(searchTerm) || 
                amount.includes(searchTerm) || 
                status.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Open Receipt modal with transaction details
    function openReceiptModal(transactionId) {
        // Find the transaction row with this ID
        const row = Array.from(transactionRows).find(row => {
            const rowId = row.querySelector('.transaction-id').textContent;
            return rowId === transactionId;
        });
        
        if (row) {
            const date = row.cells[0].textContent;
            const description = row.cells[2].textContent;
            const amount = row.cells[3].textContent;
            const status = row.querySelector('.status-badge').textContent;
            
            // Update receipt details
            if (receiptTransactionId) receiptTransactionId.textContent = transactionId;
            if (receiptDate) receiptDate.textContent = date;
            if (receiptDescription) receiptDescription.textContent = description;
            if (receiptPaymentMethod) receiptPaymentMethod.textContent = 'Bank Account (Chase) ending in 1234';
            if (receiptStatus) receiptStatus.textContent = status;
            if (receiptAmount) receiptAmount.textContent = amount;
            
            // Open the modal
            openModal('receipt-modal');
        }
    }
    
    // Initialize event listeners for modals and actions
    function initModalListeners() {
        // Modal open triggers
        Object.keys(modalTriggers).forEach(triggerId => {
            const trigger = document.getElementById(triggerId);
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(modalTriggers[triggerId]);
                });
            }
        });
        
        // Close buttons inside modals
        const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeAllModals();
            });
        });
        
        // Close modal when clicking outside content
        Object.values(modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeAllModals();
                    }
                });
            }
        });
        
        // Receipt buttons in transaction table
        receiptButtons.forEach(button => {
            button.addEventListener('click', () => {
                const receiptId = button.getAttribute('data-receipt');
                openReceiptModal(receiptId);
            });
        });
        
        // Close notification buttons
        const closeNotifications = document.querySelectorAll('.close-notification');
        closeNotifications.forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.notification').classList.remove('active');
            });
        });
        
        // Transaction search functionality
        if (transactionSearch) {
            transactionSearch.addEventListener('input', function() {
                filterTransactions(this.value);
            });
        }
    }
    
    // Handle change amount form submission
    function handleChangeAmount(e) {
        e.preventDefault();
        
        const newAmount = document.getElementById('new-amount').value;
        const reason = document.getElementById('amount-change-reason').value;
        
        // Validate input
        if (!newAmount || parseInt(newAmount) < 150) {
            showNotification('error', 'Amount must be at least $150');
            return;
        }
        
        // In a real implementation, this would send the data to your server
        console.log('Changing contribution amount:', {
            newAmount,
            reason
        });
        
        // Simulate success (in real app, this would be in the server response handler)
        setTimeout(() => {
            // Update card value
            document.querySelector('.card-subtext:contains("Amount")').textContent = `Amount: $${parseFloat(newAmount).toFixed(2)}`;
            
            // Update upcoming amount in schedule
            document.querySelector('.schedule-amount .amount').textContent = `$${parseFloat(newAmount).toFixed(2)}`;
            
            // Close modal
            closeAllModals();
            
            // Show success notification
            showNotification('success', 'Contribution amount updated successfully');
        }, 1000);
    }
    
    // Handle pause contributions form submission
    function handlePauseContributions(e) {
        e.preventDefault();
        
        const pauseUntil = document.getElementById('pause-until').value;
        const reason = document.getElementById('pause-reason').value;
        
        // Validate input
        if (!pauseUntil) {
            showNotification('error', 'Please select when to resume contributions');
            return;
        }
        
        // In a real implementation, this would send the data to your server
        console.log('Pausing contributions:', {
            pauseUntil,
            reason
        });
        
        // Simulate success (in real app, this would be in the server response handler)
        setTimeout(() => {
            // Update status
            const statusElement = document.querySelector('.card-value.status-active');
            if (statusElement) {
                statusElement.textContent = 'Paused';
                statusElement.classList.remove('status-active');
                statusElement.classList.add('status-paused');
            }
            
            // Close modal
            closeAllModals();
            
            // Show success notification
            showNotification('success', 'Contributions paused successfully');
        }, 1000);
    }
    
    // Handle cancel contributions form submission
    function handleCancelContributions(e) {
        e.preventDefault();
        
        const confirmation = document.getElementById('cancel-confirmation').checked;
        const reason = document.getElementById('cancel-reason').value;
        
        // Validate input
        if (!confirmation) {
            showNotification('error', 'Please confirm that you understand the cancellation');
            return;
        }
        
        // In a real implementation, this would send the data to your server
        console.log('Cancelling contributions:', {
            reason
        });
        
        // Simulate success (in real app, this would be in the server response handler)
        setTimeout(() => {
            // Update status
            const statusElement = document.querySelector('.card-value.status-active, .card-value.status-paused');
            if (statusElement) {
                statusElement.textContent = 'Cancelled';
                statusElement.classList.remove('status-active', 'status-paused');
                statusElement.classList.add('status-cancelled');
            }
            
            // Close modal
            closeAllModals();
            
            // Show success notification
            showNotification('success', 'Recurring contributions cancelled successfully');
        }, 1000);
    }
    
    // Handle receipt actions
    function initReceiptActions() {
        // Download receipt (simulated)
        if (downloadReceiptBtn) {
            downloadReceiptBtn.addEventListener('click', () => {
                const transactionId = receiptTransactionId.textContent;
                showNotification('success', `Receipt for ${transactionId} downloaded successfully`);
            });
        }
        
        // Email receipt (simulated)
        if (emailReceiptBtn) {
            emailReceiptBtn.addEventListener('click', () => {
                showNotification('success', 'Receipt sent to your email successfully');
                closeModal('receipt-modal');
            });
        }
    }
    
    // Handle refresh schedule button
    function initRefreshSchedule() {
        const refreshButton = document.getElementById('refresh-schedule-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                refreshButton.classList.add('rotating');
                
                // Simulate loading delay
                setTimeout(() => {
                    refreshButton.classList.remove('rotating');
                    showNotification('success', 'Schedule refreshed successfully');
                }, 1500);
            });
        }
    }
    
    // Handle export history button
    function initExportHistory() {
        const exportButton = document.getElementById('export-history-btn');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                showNotification('success', 'Transaction history exported successfully');
            });
        }
    }
    
    // Add a custom animation for refresh button
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .rotating {
                animation: rotate 1s linear infinite;
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize the dashboard
    function init() {
        initModalListeners();
        
        // Add form submit handlers
        if (changeAmountForm) {
            changeAmountForm.addEventListener('submit', handleChangeAmount);
        }
        
        if (pauseContributionsForm) {
            pauseContributionsForm.addEventListener('submit', handlePauseContributions);
        }
        
        if (cancelContributionsForm) {
            cancelContributionsForm.addEventListener('submit', handleCancelContributions);
        }
        
        // Initialize receipt actions
        initReceiptActions();
        
        // Initialize refresh schedule
        initRefreshSchedule();
        
        // Initialize export history
        initExportHistory();
        
        // Add custom styles
        addCustomStyles();
    }
    
    // Initialize the dashboard
    init();
});