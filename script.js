let inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function goHome() {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById("mainMenu").style.display = "flex";
  updateSelect();
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById(id).style.display = "block";
  if (id === "inventory") updateInventory();
  if (id === "transactions") updateTransactions();
  if (id === "alerts") updateAlerts();
  if (id === "customerMode") updateSelect();
}

function addItem() {
  let name = document.getElementById("itemName").value;
  let qty = parseFloat(document.getElementById("itemQty").value);
  let price = parseFloat(document.getElementById("itemPrice").value);

  if (!name || isNaN(qty) || isNaN(price)) return alert("Enter valid details.");

  let existing = inventory.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
    existing.price = price;
  } else {
    inventory.push({ name, qty, price });
  }

  saveData();
  document.getElementById("itemName").value = "";
  document.getElementById("itemQty").value = "";
  document.getElementById("itemPrice").value = "";
}

function updateSelect() {
  let select = document.getElementById("purchaseItem");
  select.innerHTML = "";
  inventory.forEach(item => {
    let opt = document.createElement("option");
    opt.value = item.name;
    opt.textContent = `${item.name} (${item.qty.toFixed(1)} kg @ ₹${item.price}/kg)`;
    select.appendChild(opt);
  });
}

function purchase() {
  let name = document.getElementById("purchaseItem").value;
  let qty = parseFloat(document.getElementById("purchaseQty").value);
  if (!name || isNaN(qty)) return alert("Enter valid quantity.");
  let item = inventory.find(i => i.name === name);
  if (!item || item.qty < qty) return alert("Not enough stock.");
  item.qty -= qty;
  let cost = qty * item.price;
  transactions.push({ name, qty, price: item.price, total: cost, time: new Date().toLocaleString() });
  saveData();
  document.getElementById("purchaseQty").value = "";
}

function updateInventory() {
  let table = document.getElementById("inventoryTable");
  table.innerHTML = "<tr><th>Item</th><th>Qty (kg)</th><th>Price</th><th>Stock</th><th>Action</th></tr>";
  inventory.forEach((item, i) => {
    let row = table.insertRow();
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty.toFixed(1)}</td>
      <td>₹${item.price}</td>
      <td>${item.qty < 5 ? "Low Stock" : "In Stock"}</td>
      <td><button onclick="editItem(${i})">Edit</button></td>
    `;
  });
}

function editItem(index) {
  let newQty = prompt("Enter new quantity (kg):", inventory[index].qty);
  let newPrice = prompt("Enter new price (₹):", inventory[index].price);
  if (newQty !== null && newPrice !== null) {
    inventory[index].qty = parseFloat(newQty);
    inventory[index].price = parseFloat(newPrice);
    saveData();
    updateInventory();
  }
}

function updateTransactions() {
  let table = document.getElementById("transactionTable");
  table.innerHTML = "<tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th>Time</th></tr>";
  transactions.slice().reverse().forEach(tx => {
    let row = table.insertRow();
    row.innerHTML = `
      <td>${tx.name}</td>
      <td>${tx.qty}</td>
      <td>₹${tx.price}</td>
      <td>₹${tx.total.toFixed(2)}</td>
      <td>${tx.time}</td>
    `;
  });
}

function updateAlerts() {
  let ul = document.getElementById("alertList");
  ul.innerHTML = "";
  inventory.forEach(item => {
    if (item.qty < 5) {
      let li = document.createElement("li");
      li.textContent = `${item.name} - only ${item.qty.toFixed(1)} kg left`;
      ul.appendChild(li);
    }
  });
}

goHome(); // Load main menu on start
