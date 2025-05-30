# ZAPPAY
ZAPPAY - Cannabis Marketplace Platform

ZAPPAY is a web-based platform connecting licensed cannabis farmers with consumers in legal U.S. states, facilitating transactions with a 5.2% commission fee. Consumers can reserve products online for physical pickup at licensed dispensaries, while the platform's in-house payment processor handles secure, compliant transactions and integrates with state-mandated systems like Metrc.

## Project Structure

```
zappay/
├── backend/               # Node.js backend API
│   ├── src/               # Source code
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
├── frontend/              # React.js frontend
│   └── client/            # React application
│       ├── public/        # Static files
│       └── src/           # React components and logic
├── payment_processor/     # In-house payment processor
├── database/              # Database schema and migrations
├── docs/                  # Documentation
├── tests/                 # Test scripts
└── landing_pages/         # Marketing landing pages
```

## Features

- **Web-Based Marketplace**: Connect farmers, dispensaries, and consumers
- **In-House Payment Processor**: 5.2% commission structure
- **Metrc Integration**: Ensure compliance with state regulations
- **Multiple Revenue Streams**: Transaction fees, subscriptions, advertising
- **Secure Transactions**: Compliant with cannabis industry regulations

## Revenue Streams

1. **Transaction Commission (5.2%)**: Fee on each transaction (product price + taxes)
2. **Subscription Fees for Farmers**: Tiered plans ($50/month basic, $200/month premium)
3. **Advertising Fees**: Sponsored listings and banner ads ($500/month)
4. **SaaS Fees for Dispensaries**: Premium tools ($100/month per dispensary)

## Technical Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT, role-based access control
- **Compliance**: Metrc API integration
- **Payment Processing**: Custom in-house solution

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/zappay.git
cd zappay
```

2. Install backend dependencies:
```
cd backend
npm install
```

3. Install frontend dependencies:
```
cd ../frontend/client
npm install
```

4. Set up environment variables:
```
cp backend/.env.example backend/.env
```
Edit the `.env` file with your database credentials and API keys.

5. Set up the database:
```
psql -U postgres -f database/schema.sql
```

6. Start the development servers:
```
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/client
npm start
```

## Documentation

Detailed documentation is available in the `docs` directory:

- [Requirements and Scope](docs/requirements_and_scope.md)
- [Project Plan and Timeline](docs/project_plan_and_timeline.md)
- [Technical Architecture](docs/technical_specs/platform_architecture.md)
- [Testing Plan](docs/testing_plan.md)
- [Compliance Framework](docs/compliance_and_security_framework.md)

## Testing

Run backend tests:
```
cd backend
npm test
```

Run payment processor tests:
```
node tests/test_payment_processor.js
```

Run compliance tests:
```
node tests/test_compliance_features.js
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For questions or support, please contact [support@zappay.example.com](mailto:support@zappay.example.com).
