const catalog = document.querySelector("#catalog");
const cartItems = document.querySelector("#cartItems");
const totalPrice = document.querySelector("#totalPrice");
const checkoutButton = document.querySelector("#checkoutButton");

let cart = [];
let products = [];

// Загружаем товары
async function loadProducts() {
  const response = await fetch("http://localhost:3000/products");
  products = await response.json();
  renderCatalog();
}

// Отображаем товары
function renderCatalog() {
  catalog.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.price} ₽</p>
      <button onclick="addToCart(${product.id})">Добавить в корзину</button>
    `;
    catalog.appendChild(div);
  });
}

// Добавление в корзину
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  cart.push(product);
  renderCart();
}

// Отображение корзины
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} ₽`;
    cartItems.appendChild(li);
    total += item.price;
  });
  totalPrice.textContent = `Итог: ${total} ₽`;
}

// Оформление заказа
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  fetch("http://localhost:3000/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: cart }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Заказ успешно оформлен!");
      cart = [];
      renderCart();
    })
    .catch((err) => console.error(err));
});

loadProducts();
