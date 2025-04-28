# Exotic Expenditures, LLC

This repository contains the website for Exotic Expenditures, LLC, a social group pooled fund for shared experiences, including a custom payment system using Stripe and Plaid for recurring contributions.

## Overview

We coordinate recurring ACH contributions from known group members into a pooled fund used for shared event expenses like meals, decorations, and celebrations. No products or services are sold. This supports non-commercial fund stewardship and accountability through a registered LLC. This is a modern, responsive website with custom payment integration. The site provides information about Exotic Expenditures, showcases past adventures, helps visitors understand how our social fund works, and allows members to set up recurring contributions.

## Technology Stack

The website uses:
- **Frontend**:
  - HTML5
  - CSS3 (with modern features like CSS Grid, Flexbox, and CSS variables)
  - Vanilla JavaScript with progressive enhancement
  - Google Fonts (Montserrat and Nunito)
  - Font Awesome icons
  - Progressive Web App (PWA) features
  - Service worker for offline functionality

- **Payment System**:
  - Node.js/Express API server
  - Stripe for payment processing and recurring contributions
  - Plaid for secure bank account authentication
  - Custom integration with minimal dependencies

## Project Structure

```
exotic-expenditures/
├── assets/                 # Static assets
│   ├── favicons/           # Favicon files for various platforms
│   ├── images/             # Image files used throughout the site
├── css/                    # Stylesheet files
│   ├── bundle.min.css      # Combined and minified CSS
│   ├── styles.css          # Main stylesheet (source)
│   ├── contributions.css   # Styles for contribution system
├── js/                     # JavaScript files
│   ├── bundle.min.js       # Combined and minified JavaScript
│   ├── main.js             # Main JavaScript file (source)
│   ├── contributions.js    # Stripe/Plaid integration code
│   ├── visual-animations.js # Visual effects and animations
│   ├── gallery.js          # Gallery functionality
│   ├── fixes.js            # Cross-compatibility fixes
├── server/                 # Payment API server
│   ├── config/             # Server configuration
│   ├── middleware/         # Express middleware
│   ├── plaid/              # Plaid API controllers
│   ├── stripe/             # Stripe API controllers
│   ├── routes/             # API routes
│   ├── models/             # Data models
│   ├── utils/              # Utility functions
│   ├── app.js              # Main server application
├── contributions/          # Contribution setup pages
│   ├── setup.html          # Initial setup page
│   ├── manage.html         # Manage recurring contributions
├── index.html              # Main page
├── faq.html                # Frequently Asked Questions
├── membership.html         # Membership information
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── 404.html                # Custom 404 error page
├── service-worker.js       # Service worker for offline functionality
├── package.json            # Project dependencies and scripts
├── .env.example            # Example environment variables
├── WEBSITE-IMPROVEMENT-PLAN.md # Improvement roadmap
└── README.md               # This file
```

## Payment System Features

- **ACH Bank Transfers:** Secure direct bank transfers via ACH with low fees
- **Recurring Contributions:** Automated monthly or bi-weekly contributions
- **Bank Account Verification:** Secure bank account linking via Plaid
- **Subscription Management:** Ability to pause, resume, or cancel contributions
- **Transaction History:** View and download contribution receipts
- **Security:** Server-side API keys, tokenized bank account information, no storage of sensitive details

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Stripe account with ACH capabilities
- Plaid developer account

### Environment Configuration

1. Copy `.env.example` to `.env` in the server directory:
   ```
   cp server/.env.example server/.env
   ```

2. Fill in the required configuration values:
   - Stripe API keys
   - Plaid API credentials
   - JWT secret
   - Server configuration

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Build the frontend assets:
   ```
   npm run build
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```
npm run dev
```

This starts both the frontend server (on port 8000) and the API server (on port 3000).

### Production Mode

For production deployment:

1. Build the frontend assets:
   ```
   npm run build
   ```

2. Start the server:
   ```
   npm start
   ```

## API Endpoints

The payment system exposes the following API endpoints:

### Plaid Integration
- `POST /api/plaid/create-link-token` - Create a Plaid Link token
- `POST /api/plaid/exchange-public-token` - Exchange public token for access token
- `GET /api/plaid/accounts/:userId` - Get connected bank accounts

### Stripe Integration
- `POST /api/stripe/create-payment-method` - Create a payment method
- `POST /api/stripe/create-subscription` - Set up recurring contribution
- `PATCH /api/stripe/update-subscription/:subscriptionId` - Update contribution
- `POST /api/stripe/pause-subscription/:subscriptionId` - Pause contribution
- `DELETE /api/stripe/cancel-subscription/:subscriptionId` - Cancel contribution

### Transaction Management
- `GET /api/transactions/:userId` - Get transaction history
- `GET /api/transactions/detail/:transactionId` - Get transaction details
- `GET /api/transactions/download/:transactionId` - Download receipt

## Local Development

To run the static site only (without payment functionality):
1. Clone the repository
2. Open index.html in your browser or use a local development server:
   ```
   npx serve
   ```

## Deployment

The static site is configured to be deployed using GitHub Pages from the main branch.

The payment server requires a Node.js hosting environment with:
- HTTPS support
- Environment variable configuration
- Webhook support

## Domain

The site is configured to use the custom domain: exoticexpenditures.com