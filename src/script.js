const form = document.getElementById("customerForm");

// Submit Customer
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const customer = {
        customerName: document.getElementById("customerName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        address: document.getElementById("address").value
    };

    try {

        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        });

        const data = await response.json();

        if (response.ok) {

            document.getElementById("message").innerText =
                "Customer added successfully!";

            addCustomer(data.customer);

            form.reset();

        } else {

            document.getElementById("message").innerText =
                data.message;
        }

    } catch (error) {

        console.log(error);

        document.getElementById("message").innerText =
            "Server connection error";
    }
});


// Add Customer to Table
function addCustomer(customer) {

    const table = document.getElementById("customerBody");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${customer.customerName}</td>
        <td>${customer.phone}</td>
        <td>${customer.email}</td>
        <td>${customer.username}</td>
        <td>${customer.address}</td>
    `;

    table.appendChild(row);
}


// Load Customers
async function loadCustomers() {

    try {

        const response = await fetch("/customers");

        const customers = await response.json();

        const table = document.getElementById("customerBody");

        table.innerHTML = "";

        customers.forEach(customer => {
            addCustomer(customer);
        });

    } catch (error) {
        console.log("Unable to load customers");
    }
}


// Get Order
async function getOrder() {

    const orderId = document.getElementById("orderId").value;

    if (!orderId) {
        alert("Enter Order ID");
        return;
    }

    const response = await fetch("/orders/" + orderId);

    const data = await response.json();

    if (response.ok) {

        document.getElementById("orderResult").innerHTML = `
            <p>Order ID: ${data.orderId}</p>
            <p>Customer: ${data.customerName}</p>
            <p>Product: ${data.product}</p>
            <p>Amount: ₹${data.amount}</p>
            <p>Status: ${data.status}</p>
        `;

    } else {

        document.getElementById("orderResult").innerText =
            data.message;
    }
}


// Get All Orders
async function getOrders() {

    const response = await fetch("/orders");

    const orders = await response.json();

    let output = "";

    orders.forEach(order => {

        output += `
            <p>Order ID: ${order.orderId}</p>
            <p>Customer: ${order.customerName}</p>
            <p>Product: ${order.product}</p>
            <p>Amount: ₹${order.amount}</p>
            <p>Status: ${order.status}</p>
            <hr>
        `;
    });

    document.getElementById("orders").innerHTML = output;
}


// Load existing customers
loadCustomers();