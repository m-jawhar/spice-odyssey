// API Configuration
const API_BASE_URL = "http://localhost:3000/api";
let authToken = localStorage.getItem("token");
let currentUser = null;

// Helper Functions
const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem("token", token);
};

const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem("token");
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
});

const apiCall = async (endpoint, method = "GET", body = null) => {
  try {
    const options = {
      method,
      headers: getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication
const login = async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await apiCall("/auth/login", "POST", { email, password });
    setAuthToken(data.token);
    currentUser = data.user;
    showDashboard();
  } catch (error) {
    showAlert("loginAlert", error.message, "error");
  }
};

const logout = () => {
  clearAuthToken();
  currentUser = null;
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("loginSection").style.display = "flex";
};

const showDashboard = () => {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
  document.getElementById("userName").textContent = currentUser.username;
  showSection("dashboard");
  loadDashboardStats();
};

// UI Functions
const showAlert = (elementId, message, type = "success") => {
  const alertDiv = document.getElementById(elementId);
  alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    alertDiv.innerHTML = "";
  }, 5000);
};

const showSection = (section) => {
  // Hide all content sections
  const sections = [
    "dashboard",
    "suppliers",
    "products",
    "inventory",
    "orders",
    "shipments",
  ];
  sections.forEach((s) => {
    document.getElementById(`${s}Content`).style.display = "none";
  });

  // Show selected section
  document.getElementById(`${section}Content`).style.display = "block";

  // Load data for the section
  switch (section) {
    case "dashboard":
      loadDashboardStats();
      break;
    case "suppliers":
      loadSuppliers();
      break;
    case "products":
      loadProducts();
      break;
    case "inventory":
      loadInventory();
      break;
    case "orders":
      loadOrders();
      break;
    case "shipments":
      loadShipments();
      break;
  }
};

// Dashboard Functions
const loadDashboardStats = async () => {
  try {
    const [products, suppliers, inventory, orders] = await Promise.all([
      apiCall("/products"),
      apiCall("/suppliers"),
      apiCall("/inventory/low-stock"),
      apiCall("/orders?status=pending"),
    ]);

    document.getElementById("totalProducts").textContent = products.count;
    document.getElementById("totalSuppliers").textContent = suppliers.count;
    document.getElementById("lowStockItems").textContent = inventory.count;
    document.getElementById("pendingOrders").textContent = orders.count;

    // Load low stock table
    const lowStockTable = document.getElementById("lowStockTable");
    if (inventory.count === 0) {
      lowStockTable.innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No low stock items</td></tr>';
    } else {
      lowStockTable.innerHTML = inventory.data
        .map(
          (item) => `
        <tr>
          <td>${item.product?.name || "N/A"}</td>
          <td>${item.product?.sku || "N/A"}</td>
          <td>${item.warehouse?.name || "N/A"}</td>
          <td>${item.quantity}</td>
          <td>${item.product?.reorderLevel || 0}</td>
          <td><span class="badge badge-warning">Low Stock</span></td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
};

const refreshDashboard = () => {
  loadDashboardStats();
};

// Suppliers Functions
const loadSuppliers = async () => {
  try {
    const data = await apiCall("/suppliers");
    const suppliersTable = document.getElementById("suppliersTable");

    if (data.count === 0) {
      suppliersTable.innerHTML =
        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No suppliers found</td></tr>';
    } else {
      suppliersTable.innerHTML = data.data
        .map(
          (supplier) => `
        <tr>
          <td>${supplier.code}</td>
          <td>${supplier.name}</td>
          <td>${supplier.email}</td>
          <td>${supplier.phone}</td>
          <td>${supplier.category}</td>
          <td>${"⭐".repeat(supplier.rating)}</td>
          <td><span class="badge badge-${
            supplier.isActive ? "success" : "danger"
          }">${supplier.isActive ? "Active" : "Inactive"}</span></td>
          <td>
            <button class="btn btn-small btn-primary" onclick="viewSupplier('${
              supplier._id
            }')">View</button>
          </td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading suppliers:", error);
  }
};

const searchSuppliers = () => {
  // Implement search functionality
  loadSuppliers();
};

const filterSuppliers = () => {
  // Implement filter functionality
  loadSuppliers();
};

const showAddSupplierModal = () => {
  alert("Add Supplier modal - To be implemented with form");
};

const viewSupplier = (id) => {
  alert(`View supplier ${id} - To be implemented`);
};

// Products Functions
const loadProducts = async () => {
  try {
    const data = await apiCall("/products");
    const productsTable = document.getElementById("productsTable");

    if (data.count === 0) {
      productsTable.innerHTML =
        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No products found</td></tr>';
    } else {
      productsTable.innerHTML = data.data
        .map(
          (product) => `
        <tr>
          <td>${product.sku}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.supplier?.name || "N/A"}</td>
          <td>${product.currency} ${product.unitPrice}</td>
          <td>${product.unit}</td>
          <td><span class="badge badge-${
            product.isActive ? "success" : "danger"
          }">${product.isActive ? "Active" : "Inactive"}</span></td>
          <td>
            <button class="btn btn-small btn-primary" onclick="viewProduct('${
              product._id
            }')">View</button>
          </td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

const searchProducts = () => {
  loadProducts();
};

const filterProducts = () => {
  loadProducts();
};

const showAddProductModal = () => {
  alert("Add Product modal - To be implemented with form");
};

const viewProduct = (id) => {
  alert(`View product ${id} - To be implemented`);
};

// Inventory Functions
const loadInventory = async () => {
  try {
    const data = await apiCall("/inventory");
    const inventoryTable = document.getElementById("inventoryTable");

    if (data.count === 0) {
      inventoryTable.innerHTML =
        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No inventory records found</td></tr>';
    } else {
      inventoryTable.innerHTML = data.data
        .map(
          (item) => `
        <tr>
          <td>${item.product?.name || "N/A"}</td>
          <td>${item.product?.sku || "N/A"}</td>
          <td>${item.warehouse?.name || "N/A"}</td>
          <td>${item.quantity}</td>
          <td>${item.reservedQuantity}</td>
          <td>${item.availableQuantity}</td>
          <td><span class="badge badge-${
            item.status === "in-stock"
              ? "success"
              : item.status === "low-stock"
              ? "warning"
              : "danger"
          }">${item.status}</span></td>
          <td>${new Date(item.lastUpdated).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading inventory:", error);
  }
};

const showAdjustInventoryModal = () => {
  alert("Adjust Inventory modal - To be implemented with form");
};

// Orders Functions
const loadOrders = async () => {
  try {
    const data = await apiCall("/orders");
    const ordersTable = document.getElementById("ordersTable");

    if (data.count === 0) {
      ordersTable.innerHTML =
        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No orders found</td></tr>';
    } else {
      ordersTable.innerHTML = data.data
        .map(
          (order) => `
        <tr>
          <td>${order.orderNumber}</td>
          <td><span class="badge badge-info">${order.type}</span></td>
          <td>${order.supplier?.name || "N/A"}</td>
          <td>${order.warehouse?.name || "N/A"}</td>
          <td>${order.currency} ${order.totalAmount}</td>
          <td><span class="badge badge-${getStatusColor(order.status)}">${
            order.status
          }</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-small btn-primary" onclick="viewOrder('${
              order._id
            }')">View</button>
          </td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading orders:", error);
  }
};

const showAddOrderModal = () => {
  alert("Create Order modal - To be implemented with form");
};

const viewOrder = (id) => {
  alert(`View order ${id} - To be implemented`);
};

// Shipments Functions
const loadShipments = async () => {
  try {
    const data = await apiCall("/shipments");
    const shipmentsTable = document.getElementById("shipmentsTable");

    if (data.count === 0) {
      shipmentsTable.innerHTML =
        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No shipments found</td></tr>';
    } else {
      shipmentsTable.innerHTML = data.data
        .map(
          (shipment) => `
        <tr>
          <td>${shipment.trackingNumber}</td>
          <td>${shipment.order?.orderNumber || "N/A"}</td>
          <td>${shipment.carrier?.name || "N/A"}</td>
          <td>${shipment.origin?.city || "N/A"}</td>
          <td>${shipment.destination?.city || "N/A"}</td>
          <td><span class="badge badge-${getStatusColor(shipment.status)}">${
            shipment.status
          }</span></td>
          <td>${new Date(shipment.estimatedDelivery).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-small btn-primary" onclick="viewShipment('${
              shipment._id
            }')">Track</button>
          </td>
        </tr>
      `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading shipments:", error);
  }
};

const showAddShipmentModal = () => {
  alert("Create Shipment modal - To be implemented with form");
};

const viewShipment = (id) => {
  alert(`Track shipment ${id} - To be implemented`);
};

// Utility Functions
const getStatusColor = (status) => {
  const statusMap = {
    draft: "info",
    pending: "warning",
    confirmed: "info",
    processing: "info",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
    preparing: "info",
    "picked-up": "info",
    "in-transit": "info",
    "out-for-delivery": "warning",
    delayed: "danger",
  };
  return statusMap[status] || "info";
};

// Event Listeners
document.getElementById("loginForm")?.addEventListener("submit", login);

// Check if user is already logged in
if (authToken) {
  apiCall("/auth/me")
    .then((data) => {
      currentUser = data.user;
      showDashboard();
    })
    .catch(() => {
      clearAuthToken();
    });
}
