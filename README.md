# Spice Odyssey - Supply Chain Management System

A comprehensive supply chain management system for tracking suppliers, inventory, orders, and shipments.

## Features

- **Supplier Management**: Track and manage supplier information and relationships
- **Product Catalog**: Maintain detailed product information and specifications
- **Inventory Management**: Real-time inventory tracking across multiple warehouses
- **Order Processing**: End-to-end order management from creation to fulfillment
- **Shipment Tracking**: Track shipments and delivery status
- **Warehouse Management**: Manage multiple warehouse locations and stock levels
- **Analytics & Reporting**: Comprehensive dashboards and reports
- **User Authentication**: Secure role-based access control

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Frontend**: HTML/CSS/JavaScript (ready for React/Vue integration)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
  - **OR** MongoDB installed locally (v4.4 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration

5. Initialize the database:

   ```bash
   npm run init-db
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Suppliers

- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier
- `GET /api/suppliers/:id` - Get supplier by ID
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory

- `GET /api/inventory` - Get inventory levels
- `POST /api/inventory/adjust` - Adjust inventory levels
- `GET /api/inventory/low-stock` - Get low stock alerts

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Shipments

- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:id` - Get shipment by ID
- `PUT /api/shipments/:id` - Update shipment status

### Warehouses

- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create new warehouse
- `GET /api/warehouses/:id` - Get warehouse by ID
- `PUT /api/warehouses/:id` - Update warehouse

## Project Structure

```
spice-odyssey/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── scripts/         # Setup scripts
│   └── server.js        # Application entry point
├── public/              # Frontend files
│   ├── css/
│   ├── js/
│   └── index.html
├── tests/               # Test files
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## License

MIT License
