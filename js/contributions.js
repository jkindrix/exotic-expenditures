/**
 * Contributions javascript for Exotic Expenditures
 * Handles ACH setup, management, and integration with Stripe and Plaid
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let bankAccountToken = null;
    let connectedAccount = null;
    let contributionAmount = 150;
    let contributionFrequency = 'monthly';
    let startDate = null;
    
    // DOM Elements - Main form elements
    const setupForm = document.getElementById('contribution-setup-form');
    const progressIndicator = document.getElementById('progressIndicator');
    
    // DOM elements - Step 1 (Bank Connection)
    const connectedAccountsSection = document.getElementById('connected-accounts');
    const connectAccountSection = document.getElementById('connect-account');
    const plaidLinkButton = document.getElementById('plaid-link-button');
    const changeAccountButton = document.getElementById('change-account');
    const accountName = document.querySelector('.account-name');
    const lastFour = document.getElementById('last-four');
    const nextToStep2Button = document.getElementById('next-to-step2');
    
    // DOM elements - Step 2 (Contribution Details)
    const amountInput = document.getElementById('contribution-amount');
    const frequencySelect = document.getElementById('contribution-frequency');
    const startDateInput = document.getElementById('start-date');
    const schedulePreview = document.getElementById('schedule-preview');
    
    // DOM elements - Step 3 (Review & Confirm)
    const bankSummary = document.getElementById('bank-summary');
    const summaryAmount = document.getElementById('summary-amount');
    const summaryFrequency = document.getElementById('summary-frequency');
    const summaryFirstDate = document.getElementById('summary-first-date');
    const termsAcceptance = document.getElementById('terms-acceptance');
    
    // DOM elements - Confirmation
    const setupConfirmation = document.getElementById('setup-confirmation');
    const confAmount = document.getElementById('conf-amount');
    const confFrequency = document.getElementById('conf-frequency');
    const confFirstDate = document.getElementById('conf-first-date');
    
    // Step navigation
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-button');
    const prevButtons = document.querySelectorAll('.prev-button');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    let currentStep = 0;
    
    // Set up default date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = formatDateForInput(tomorrow);
    if (startDateInput) {
        startDateInput.value = formattedTomorrow;
        startDateInput.min = formattedTomorrow;
        startDate = tomorrow;
    }
    
    // Format date for input field (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Format date for display (Month Day, Year)
    function formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Update the progress indicator
    function updateProgress(step) {
        const progress = ((step + 1) / formSteps.length) * 100;
        if (progressIndicator) {
            progressIndicator.style.width = `${progress}%`;
        }
    }
    
    // Navigate to a specific step
    function goToStep(step) {
        // Hide all steps
        formSteps.forEach((formStep, index) => {
            formStep.classList.remove('active');
            stepIndicators[index]?.classList.remove('active');
            stepIndicators[index]?.classList.remove('completed');
            
            // Mark previous steps as completed
            if (index < step) {
                stepIndicators[index]?.classList.add('completed');
            }
        });
        
        // Show current step
        formSteps[step].classList.add('active');
        stepIndicators[step]?.classList.add('active');
        
        // Update progress bar
        updateProgress(step);
        
        // Scroll to top of form
        if (setupForm) {
            setupForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        currentStep = step;
        
        // Special handling for step 3 (Review)
        if (step === 2) {
            updateReviewSummary();
        }
    }
    
    // Validate input on the current step
    function validateCurrentStep() {
        let isValid = true;
        
        // Step 1 validation
        if (currentStep === 0) {
            // Check if bank account is connected
            if (!bankAccountToken) {
                isValid = false;
                showError(plaidLinkButton, 'Please connect your bank account to continue');
            }
        }
        
        // Step 2 validation
        else if (currentStep === 1) {
            // Validate amount
            if (!amountInput.value || amountInput.value < 150) {
                isValid = false;
                showError(amountInput, 'Amount must be at least $150');
            } else {
                clearError(amountInput);
            }
            
            // Validate start date
            if (!startDateInput.value) {
                isValid = false;
                showError(startDateInput, 'Please select a start date');
            } else {
                clearError(startDateInput);
                // Save the date
                startDate = new Date(startDateInput.value);
            }
        }
        
        // Step 3 validation
        else if (currentStep === 2) {
            // Validate terms acceptance
            if (!termsAcceptance.checked) {
                isValid = false;
                showError(termsAcceptance, 'You must accept the terms to continue');
            } else {
                clearError(termsAcceptance);
            }
        }
        
        return isValid;
    }
    
    // Error handling functions
    function showError(element, message) {
        // If element is a button, find its container
        const container = element.closest('.form-group') || element.parentElement;
        
        // Add error class
        if (container.classList.contains('form-group')) {
            container.classList.add('error');
        }
        
        // Check if error message already exists
        let errorElement = container.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            
            // For checkbox, insert after the label
            if (element.type === 'checkbox') {
                container.appendChild(errorElement);
            } else {
                element.insertAdjacentElement('afterend', errorElement);
            }
        }
        
        errorElement.textContent = message;
    }
    
    function clearError(element) {
        // If element is a button, find its container
        const container = element.closest('.form-group') || element.parentElement;
        
        // Remove error class
        if (container.classList.contains('form-group')) {
            container.classList.remove('error');
        }
        
        // Remove error message
        const errorElement = container.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Generate contribution schedule preview
    function generateSchedulePreview() {
        if (!schedulePreview) return;
        
        // Clear existing content
        schedulePreview.innerHTML = '';
        
        // Get values
        contributionAmount = parseFloat(amountInput.value);
        contributionFrequency = frequencySelect.value;
        const previewStartDate = new Date(startDateInput.value);
        
        // Validate inputs
        if (isNaN(contributionAmount) || contributionAmount <= 0 || !previewStartDate) {
            schedulePreview.innerHTML = '<p>Please enter valid contribution details.</p>';
            return;
        }
        
        // Generate 6 payment dates
        const dates = [];
        let currentDate = new Date(previewStartDate);
        
        for (let i = 0; i < 6; i++) {
            dates.push(new Date(currentDate));
            
            // Calculate next date based on frequency
            if (contributionFrequency === 'biweekly') {
                currentDate.setDate(currentDate.getDate() + 14);
            } else {
                // Monthly - advance to same day next month
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
        
        // Create schedule items
        dates.forEach((date, index) => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            
            const scheduleDate = document.createElement('span');
            scheduleDate.className = 'schedule-date';
            scheduleDate.textContent = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const scheduleAmount = document.createElement('span');
            scheduleAmount.className = 'schedule-amount';
            scheduleAmount.textContent = `$${contributionAmount.toFixed(2)}`;
            
            scheduleItem.appendChild(scheduleDate);
            scheduleItem.appendChild(scheduleAmount);
            
            schedulePreview.appendChild(scheduleItem);
        });
    }
    
    // Update review summary
    function updateReviewSummary() {
        if (!bankSummary || !summaryAmount || !summaryFrequency || !summaryFirstDate) return;
        
        // Bank account summary
        if (connectedAccount) {
            bankSummary.innerHTML = `
                <p><strong>${connectedAccount.name}</strong></p>
                <p>Account ending in ${connectedAccount.last4}</p>
            `;
        } else {
            bankSummary.innerHTML = '<p>No bank account connected</p>';
        }
        
        // Contribution details
        summaryAmount.textContent = `$${contributionAmount.toFixed(2)}`;
        
        const frequencyText = contributionFrequency === 'biweekly' ? 'Every two weeks' : 'Monthly';
        summaryFrequency.textContent = frequencyText;
        
        const formattedDate = formatDateForDisplay(startDateInput.value);
        summaryFirstDate.textContent = formattedDate;
    }
    
    // Initialize Plaid Link with real API
    async function initPlaidLink() {
        // Show loading state
        if (plaidLinkButton) {
            plaidLinkButton.disabled = true;
            plaidLinkButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }

        try {
            // Get link token from server
            const userId = 'user_' + Date.now(); // In a real app, this would be the real user ID
            const response = await fetch('/api/plaid/create-link-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to get link token');
            }

            // Initialize Plaid Link
            const linkHandler = Plaid.create({
                token: data.linkToken,
                onSuccess: async (publicToken, metadata) => {
                    await handlePlaidSuccess(publicToken, metadata);
                },
                onExit: (err, metadata) => {
                    if (err) {
                        console.error('Plaid Link error:', err);
                        showError(plaidLinkButton, err.message || 'Error connecting to bank');
                    }
                },
                onEvent: (eventName, metadata) => {
                    console.log('Plaid event:', eventName);
                    // Additional tracking could be added here
                }
            });

            // Set up click handler
            plaidLinkButton.addEventListener('click', () => {
                linkHandler.open();
            });

            // Reset button state
            plaidLinkButton.disabled = false;
            plaidLinkButton.innerHTML = '<i class="fas fa-link"></i> Connect Bank Account';

        } catch (error) {
            console.error('Error initializing Plaid Link:', error);
            
            // Reset button and show error
            if (plaidLinkButton) {
                plaidLinkButton.disabled = false;
                plaidLinkButton.innerHTML = '<i class="fas fa-link"></i> Connect Bank Account';
                showError(plaidLinkButton, 'Unable to initialize bank connection. Please try again later.');
            }
            
            // In development, fall back to simulation
            if (process.env.NODE_ENV === 'development') {
                console.log('Falling back to simulation mode for development');
                setupPlaidSimulation();
            }
        }
    }
    
    // Handle successful Plaid Link connection
    async function handlePlaidSuccess(publicToken, metadata) {
        try {
            const userId = 'user_' + Date.now(); // In a real app, this would be the real user ID
            const accountId = metadata.account_id;
            
            // Show loading state on connect section
            connectAccountSection.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Processing bank information...</div>';
            
            // Exchange public token for access token and account info
            const response = await fetch('/api/plaid/exchange-public-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    publicToken,
                    accountId,
                    userId
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to process bank account');
            }
            
            // Store bank account info
            bankAccountToken = {
                id: accountId,
                bank_id: data.accountInfo.institution
            };
            
            connectedAccount = {
                id: data.accountInfo.id,
                name: data.accountInfo.name,
                last4: data.accountInfo.last4
            };
            
            // Update UI
            if (accountName) accountName.textContent = connectedAccount.name;
            if (lastFour) lastFour.textContent = connectedAccount.last4;
            
            connectedAccountsSection.classList.remove('hidden');
            connectAccountSection.classList.add('hidden');
            
            // Enable next button
            nextToStep2Button.disabled = false;
            
            // Clear any errors
            clearError(plaidLinkButton);
            
        } catch (error) {
            console.error('Error handling Plaid success:', error);
            
            // Reset connect section
            connectAccountSection.innerHTML = `
                <p>Connect your bank account securely using Plaid. Your login credentials are never stored.</p>
                <div class="connect-button-container">
                    <button type="button" id="plaid-link-button" class="plaid-button">
                        <i class="fas fa-link"></i> Connect Bank Account
                    </button>
                </div>
                <div class="security-note">
                    <i class="fas fa-shield-alt"></i>
                    <p>Your banking information is secure with industry-standard encryption and is never stored on our servers.</p>
                </div>
            `;
            
            // Re-initialize the button
            plaidLinkButton = document.getElementById('plaid-link-button');
            initPlaidLink();
            
            // Show error
            showError(plaidLinkButton, error.message || 'Failed to connect bank account');
        }
    }
    
    // For development: Set up simulation fallback
    function setupPlaidSimulation() {
        console.log('Setting up Plaid simulation for development');
        
        if (plaidLinkButton) {
            plaidLinkButton.addEventListener('click', function() {
                simulatePlaidLinkFlow();
            });
        }
    }
    
    // Simulation functions for development
    function simulatePlaidLinkFlow() {
        // Show a simple modal to simulate bank selection
        const modal = document.createElement('div');
        modal.className = 'plaid-simulation-modal';
        modal.innerHTML = `
            <div class="plaid-simulation-content">
                <h3>Select Your Bank (Simulation)</h3>
                <p>This is a simulated bank selection screen for development purposes.</p>
                <div class="bank-options">
                    <button class="bank-option" data-bank="chase">
                        <img src="https://logo.clearbit.com/chase.com" alt="Chase" onerror="this.src='../assets/bank-placeholder.png'">
                        <span>Chase</span>
                    </button>
                    <button class="bank-option" data-bank="bofa">
                        <img src="https://logo.clearbit.com/bankofamerica.com" alt="Bank of America" onerror="this.src='../assets/bank-placeholder.png'">
                        <span>Bank of America</span>
                    </button>
                    <button class="bank-option" data-bank="wells">
                        <img src="https://logo.clearbit.com/wellsfargo.com" alt="Wells Fargo" onerror="this.src='../assets/bank-placeholder.png'">
                        <span>Wells Fargo</span>
                    </button>
                </div>
                <button class="close-simulation">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add simulation styles
        const style = document.createElement('style');
        style.textContent = `
            .plaid-simulation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .plaid-simulation-content {
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
            }
            .plaid-simulation-content h3 {
                margin-top: 0;
                color: #333;
                font-size: 1.4rem;
            }
            .plaid-simulation-content p {
                margin-bottom: 20px;
                color: #666;
                font-size: 0.9rem;
            }
            .bank-options {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin: 20px 0;
            }
            .bank-option {
                flex: 1 1 140px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background: #f8f9fa;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .bank-option:hover {
                border-color: #FF3366;
                background: #fff;
            }
            .bank-option img {
                width: 40px;
                height: 40px;
                object-fit: contain;
            }
            .close-simulation {
                background: #eee;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
        
        // Handle bank selection
        const bankOptions = document.querySelectorAll('.bank-option');
        bankOptions.forEach(option => {
            option.addEventListener('click', function() {
                const bankId = this.getAttribute('data-bank');
                const bankName = this.querySelector('span').textContent;
                
                // Remove modal
                modal.remove();
                
                // Simulate successful connection
                simulateSuccessfulConnection(bankId, bankName);
            });
        });
        
        // Handle cancel
        const closeButton = document.querySelector('.close-simulation');
        closeButton.addEventListener('click', function() {
            modal.remove();
        });
    }
    
    // Simulation function for development
    function simulateSuccessfulConnection(bankId, bankName) {
        console.log('Simulating successful bank connection for development');
        
        // Generate fake token and account info
        bankAccountToken = {
            id: `tok_${bankId}_${Date.now()}`,
            bank_id: bankId
        };
        
        connectedAccount = {
            id: `acct_${bankId}_${Date.now()}`,
            name: bankName,
            last4: String(Math.floor(1000 + Math.random() * 9000)).substring(0, 4)
        };
        
        // Update UI
        if (accountName) accountName.textContent = connectedAccount.name;
        if (lastFour) lastFour.textContent = connectedAccount.last4;
        
        connectedAccountsSection.classList.remove('hidden');
        connectAccountSection.classList.add('hidden');
        
        // Enable next button
        nextToStep2Button.disabled = false;
        
        // Clear any errors
        clearError(plaidLinkButton);
    }
    
    // Handle form submission with real API integration
    async function handleFormSubmission(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Disable form and show loading
        const submitButton = document.getElementById('confirm-setup');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
        
        try {
            // First create a payment method with the bank account
            const userId = 'user_' + Date.now(); // In a real app, this would be the real user ID
            
            // Step 1: Create payment method
            const paymentMethodResponse = await fetch('/api/stripe/create-payment-method', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    accountId: connectedAccount.id
                })
            });
            
            const paymentMethodData = await paymentMethodResponse.json();
            
            if (!paymentMethodData.success) {
                throw new Error(paymentMethodData.message || 'Failed to create payment method');
            }
            
            // Step 2: Create subscription with the payment method
            const subscriptionResponse = await fetch('/api/stripe/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    paymentMethodId: paymentMethodData.paymentMethod.id,
                    amount: contributionAmount,
                    frequency: contributionFrequency,
                    startDate: startDateInput.value
                })
            });
            
            const subscriptionData = await subscriptionResponse.json();
            
            if (!subscriptionData.success) {
                throw new Error(subscriptionData.message || 'Failed to create subscription');
            }
            
            // Successful setup - show confirmation
            handleSuccessfulSetup(subscriptionData.subscription);
            
        } catch (error) {
            console.error('Error setting up contribution:', error);
            
            // Show error message
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Confirm Setup';
                
                // Create error message
                const errorContainer = document.createElement('div');
                errorContainer.className = 'form-error-message';
                errorContainer.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${error.message || 'An error occurred while setting up your contribution. Please try again.'}</p>
                `;
                
                // Insert after submit button
                submitButton.parentNode.insertBefore(errorContainer, submitButton.nextSibling);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    errorContainer.remove();
                }, 5000);
            }
            
            // Fall back to simulation in development mode
            if (process.env.NODE_ENV === 'development') {
                console.log('Falling back to simulation mode for development');
                simulateSuccessfulSetup();
            }
        }
    }
    
    // Handle successful setup completion
    function handleSuccessfulSetup(subscription) {
        // Hide form
        if (setupForm) {
            setupForm.style.display = 'none';
        }
        
        // Update confirmation details
        if (confAmount) confAmount.textContent = `$${subscription.amount.toFixed(2)}`;
        if (confFrequency) confFrequency.textContent = subscription.frequency === 'biweekly' ? 'Every two weeks' : 'Monthly';
        if (confFirstDate) confFirstDate.textContent = formatDateForDisplay(subscription.next_payment_date);
        
        // Show confirmation
        if (setupConfirmation) {
            setupConfirmation.style.display = 'block';
            
            // Scroll to confirmation
            setupConfirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Simulation function for development
    function simulateSuccessfulSetup() {
        console.log('Simulating successful contribution setup for development');
        
        // Hide form
        if (setupForm) {
            setupForm.style.display = 'none';
        }
        
        // Update confirmation details
        if (confAmount) confAmount.textContent = `$${contributionAmount.toFixed(2)}`;
        if (confFrequency) confFrequency.textContent = contributionFrequency === 'biweekly' ? 'Every two weeks' : 'Monthly';
        if (confFirstDate) confFirstDate.textContent = formatDateForDisplay(startDateInput.value);
        
        // Show confirmation
        if (setupConfirmation) {
            setupConfirmation.style.display = 'block';
            
            // Scroll to confirmation
            setupConfirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Initialize FAQ accordion
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Toggle active class
                item.classList.toggle('active');
                
                // Update icon
                const icon = question.querySelector('.toggle-icon i');
                if (item.classList.contains('active')) {
                    icon.className = 'fas fa-minus';
                } else {
                    icon.className = 'fas fa-plus';
                }
            });
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Step navigation
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (validateCurrentStep()) {
                    goToStep(currentStep + 1);
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                goToStep(currentStep - 1);
            });
        });
        
        // Step indicators click
        stepIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                // Only allow clicking on completed steps or the next step
                if (index <= currentStep + 1) {
                    // Validate current step if trying to go forward
                    if (index > currentStep && !validateCurrentStep()) {
                        return;
                    }
                    goToStep(index);
                }
            });
        });
        
        // Change account button
        if (changeAccountButton) {
            changeAccountButton.addEventListener('click', function() {
                connectedAccountsSection.classList.add('hidden');
                connectAccountSection.classList.remove('hidden');
                bankAccountToken = null;
                connectedAccount = null;
                nextToStep2Button.disabled = true;
            });
        }
        
        // Contribution amount changes
        if (amountInput) {
            amountInput.addEventListener('input', function() {
                contributionAmount = parseFloat(this.value) || 0;
                generateSchedulePreview();
            });
        }
        
        // Frequency changes
        if (frequencySelect) {
            frequencySelect.addEventListener('change', function() {
                contributionFrequency = this.value;
                generateSchedulePreview();
            });
        }
        
        // Start date changes
        if (startDateInput) {
            startDateInput.addEventListener('change', function() {
                startDate = new Date(this.value);
                generateSchedulePreview();
            });
        }
        
        // Form submission
        if (setupForm) {
            setupForm.addEventListener('submit', handleFormSubmission);
        }
    }
    
    // Initialize the page
    function init() {
        // Initialize component sub-functions
        initPlaidLink();
        initFaqAccordion();
        setupEventListeners();
        
        // Set default date and generate initial schedule
        if (startDateInput && amountInput && frequencySelect) {
            generateSchedulePreview();
        }
        
        // Generate initial schedule preview
        generateSchedulePreview();
    }
    
    // Run initialization
    init();
});