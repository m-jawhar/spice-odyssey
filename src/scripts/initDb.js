const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Supplier = require("../models/Supplier");
const Warehouse = require("../models/Warehouse");
const Product = require("../models/Product");

const initializeDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Supplier.deleteMany({});
    await Warehouse.deleteMany({});
    await Product.deleteMany({});

    console.log("Cleared existing data");

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@spiceroute.com",
      password: "admin123",
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
    });
    console.log("Created admin user");

    // Create warehouses
    const warehouses = await Warehouse.insertMany([
      {
        name: "Main Distribution Center",
        code: "WH-001",
        type: "main",
        address: {
          street: "123 Industrial Parkway",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          zipCode: "400001",
        },
        capacity: 10000,
        manager: {
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          email: "rajesh@spiceroute.com",
        },
        isActive: true,
      },
      {
        name: "Regional Warehouse - North",
        code: "WH-002",
        type: "regional",
        address: {
          street: "456 Logistics Avenue",
          city: "Delhi",
          state: "Delhi",
          country: "India",
          zipCode: "110001",
        },
        capacity: 5000,
        manager: {
          name: "Priya Sharma",
          phone: "+91-9876543211",
          email: "priya@spiceroute.com",
        },
        isActive: true,
      },
    ]);
    console.log("Created warehouses");

    // Create suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: "Kerala Spice Traders",
        code: "SUP-001",
        email: "contact@keralaspices.com",
        phone: "+91-9876543220",
        address: {
          street: "789 Spice Market Road",
          city: "Kochi",
          state: "Kerala",
          country: "India",
          zipCode: "682001",
        },
        contactPerson: {
          name: "Suresh Menon",
          phone: "+91-9876543221",
          email: "suresh@keralaspices.com",
          position: "Sales Manager",
        },
        category: "raw-materials",
        rating: 5,
        paymentTerms: "net-30",
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        name: "Global Herbs International",
        code: "SUP-002",
        email: "info@globalherbs.com",
        phone: "+91-9876543230",
        address: {
          street: "321 Export Zone",
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          zipCode: "560001",
        },
        contactPerson: {
          name: "Anil Reddy",
          phone: "+91-9876543231",
          email: "anil@globalherbs.com",
          position: "Business Development",
        },
        category: "raw-materials",
        rating: 4,
        paymentTerms: "net-30",
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log("Created suppliers");

    // Create products
    const products = await Product.insertMany([
      {
        name: "Black Pepper - Whole",
        sku: "SP-BP-001",
        description: "Premium quality whole black pepper from Kerala",
        category: "spices",
        supplier: suppliers[0]._id,
        unit: "kg",
        unitPrice: 450,
        currency: "INR",
        reorderLevel: 100,
        reorderQuantity: 500,
        leadTime: 5,
        specifications: {
          origin: "Kerala, India",
          color: "Black",
          grade: "Grade A",
          moisture: "12%",
          purity: "99%",
        },
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        name: "Turmeric Powder",
        sku: "SP-TU-001",
        description: "Pure turmeric powder with high curcumin content",
        category: "spices",
        supplier: suppliers[0]._id,
        unit: "kg",
        unitPrice: 280,
        currency: "INR",
        reorderLevel: 150,
        reorderQuantity: 600,
        leadTime: 3,
        specifications: {
          origin: "Tamil Nadu, India",
          color: "Golden Yellow",
          grade: "Premium",
          moisture: "10%",
          purity: "98%",
        },
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        name: "Cardamom - Green",
        sku: "SP-CD-001",
        description: "Organic green cardamom pods",
        category: "spices",
        supplier: suppliers[1]._id,
        unit: "kg",
        unitPrice: 1200,
        currency: "INR",
        reorderLevel: 50,
        reorderQuantity: 200,
        leadTime: 7,
        specifications: {
          origin: "Kerala, India",
          color: "Green",
          grade: "Premium",
          moisture: "8%",
          purity: "100%",
        },
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        name: "Cinnamon Sticks",
        sku: "SP-CN-001",
        description: "Ceylon cinnamon sticks - premium quality",
        category: "spices",
        supplier: suppliers[1]._id,
        unit: "kg",
        unitPrice: 650,
        currency: "INR",
        reorderLevel: 80,
        reorderQuantity: 300,
        leadTime: 5,
        specifications: {
          origin: "Sri Lanka",
          color: "Light Brown",
          grade: "Grade A",
          moisture: "10%",
          purity: "99%",
        },
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        name: "Cumin Seeds",
        sku: "SP-CM-001",
        description: "Whole cumin seeds with strong aroma",
        category: "spices",
        supplier: suppliers[0]._id,
        unit: "kg",
        unitPrice: 320,
        currency: "INR",
        reorderLevel: 120,
        reorderQuantity: 500,
        leadTime: 4,
        specifications: {
          origin: "Gujarat, India",
          color: "Brown",
          grade: "Standard",
          moisture: "9%",
          purity: "99%",
        },
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log("Created products");

    console.log("\n=================================");
    console.log("Database initialized successfully!");
    console.log("=================================");
    console.log("\nDefault Credentials:");
    console.log("Email: admin@spiceroute.com");
    console.log("Password: admin123");
    console.log("\nWarehouse Codes:", warehouses.map((w) => w.code).join(", "));
    console.log("Supplier Codes:", suppliers.map((s) => s.code).join(", "));
    console.log("Product SKUs:", products.map((p) => p.sku).join(", "));
    console.log("=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initializeDatabase();
