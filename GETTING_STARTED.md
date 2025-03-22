# Getting Started with Spice Odyssey

## Quick Start Guide

Follow these steps to get your Spice Odyssey supply chain management system up and running.

### Step 1: Install Dependencies

```powershell
npm install
```

### Step 2: Set Up Environment Variables

Copy the `.env.example` file to create your `.env` file:

```powershell
Copy-Item .env.example .env
```

Update the `.env` file with your configuration. By default, it's configured to work with a local MongoDB instance.

### Step 3: Start MongoDB

Make sure MongoDB is running on your system. If you have MongoDB installed locally:

```powershell
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or if you installed it manually
mongod --dbpath C:\data\db
```

Alternatively, you can use MongoDB Atlas (cloud):

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### Step 4: Initialize the Database

Run the initialization script to create sample data:

```powershell
npm run init-db
```

This will create:

- An admin user (email: admin@spiceroute.com, password: admin123)
- 2 warehouses
- 2 suppliers
- 5 products with sample data

### Step 5: Start the Development Server

```powershell
npm run dev
```

The server will start on http://localhost:3000

### Step 6: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

Log in with the default credentials:

- **Email**: admin@spiceroute.com
- **Password**: admin123

## System Architecture

### Backend (Node.js + Express)

- RESTful API with JWT authentication
- MongoDB database with Mongoose ODM
- Role-based access control (Admin, Manager, Staff, Viewer)

### Models

1. **User** - System users with role-based permissions
2. **Supplier** - Supplier information and contacts
3. **Product** - Product catalog with specifications
4. **Warehouse** - Warehouse locations and details
5. **Inventory** - Real-time inventory tracking
6. **Order** - Purchase and sales orders
7. **Shipment** - Shipment tracking information

### Key Features

#### 1. Dashboard

- Real-time statistics
- Low stock alerts
- Pending orders overview
- Quick access to all modules

#### 2. Supplier Management

- Track supplier information
- Rate supplier performance
- Manage contact details
- Category-based organization

#### 3. Product Catalog

- Detailed product specifications
- SKU-based tracking
- Supplier relationships
- Reorder level management

#### 4. Inventory Management

- Multi-warehouse support
- Real-time stock levels
- Reserved quantity tracking
- Low stock alerts
- Inventory adjustments

#### 5. Order Processing

- Purchase orders
- Sales orders
- Transfer orders
- Order status tracking
- Automated inventory updates

#### 6. Shipment Tracking

- Multiple carriers support
- Real-time status updates
- Tracking history
- Delivery confirmations

## API Testing

You can test the API using tools like Postman or curl:

### 1. Login to get token

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@spiceroute.com","password":"admin123"}'
```

### 2. Get all products (requires token)

```powershell
curl -X GET http://localhost:3000/api/products `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create a new supplier

```powershell
curl -X POST http://localhost:3000/api/suppliers `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{
    "name": "New Supplier",
    "code": "SUP-003",
    "email": "supplier@example.com",
    "phone": "+1234567890",
    "category": "raw-materials",
    "address": {
      "street": "123 Street",
      "city": "City",
      "state": "State",
      "country": "Country",
      "zipCode": "12345"
    }
  }'
```

## User Roles & Permissions

### Admin

- Full access to all features
- Can create, update, and delete all resources
- User management
- System configuration

### Manager

- Can create and update most resources
- Cannot delete critical data
- View all reports

### Staff

- Can create orders and adjust inventory
- View products and suppliers
- Limited modification rights

### Viewer

- Read-only access
- Can view all data
- Cannot create or modify

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify network connectivity (for MongoDB Atlas)

### Port Already in Use

- Change the PORT in `.env` file
- Or stop the process using port 3000

### Authentication Issues

- Clear browser localStorage
- Re-run the database initialization
- Check JWT_SECRET in `.env`

## Next Steps

1. **Customize the data models** - Modify models in `src/models/` to fit your needs
2. **Add more features** - Implement additional business logic
3. **Deploy to production** - Use services like Heroku, AWS, or Azure
4. **Add tests** - Implement unit and integration tests
5. **Enhance UI** - Integrate React or Vue.js for a richer interface

## Support & Documentation

For more information:

- Read the full API documentation in README.md
- Check the code comments for implementation details
- Review the models for data structure

## License

MIT License - Feel free to use this for your projects!
