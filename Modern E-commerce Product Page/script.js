const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});

// ======================
// STORAGE
// ======================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let fav = JSON.parse(localStorage.getItem("fav")) || [];

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("fav", JSON.stringify(fav));
}

// ======================
// ELEMENTS
// ======================

const cartBtn = document.querySelector(".cart-btn");
const favBtn = document.querySelector(".fav-btn");

const overlay = document.getElementById("overlay");
const cartModal = document.getElementById("cartModal");
const favModal = document.getElementById("favModal");

const cartItemsBox = document.getElementById("cartItems");
const favItemsBox = document.getElementById("favItems");

const closeCart = document.getElementById("closeCart");
const closeFav = document.getElementById("closeFav");

// ======================
// UI UPDATE
// ======================

function updateUI() {
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  cartBtn.innerText = `🛒 Cart (${cartCount})`;
  favBtn.innerText = `❤️ Favorites (${fav.length})`;
}

// ======================
// GET DATA FROM CARD
// ======================

function getPrice(card) {
  return parseFloat(card.querySelector(".price").innerText.replace("$", ""));
}

function getImg(card) {
  return card.querySelector("img").src;
}

// ======================
// CART SYSTEM
// ======================

function addToCart(name, price, img) {
  let item = cart.find(p => p.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      name,
      price,
      img,
      qty: 1
    });
  }

  save();
  updateUI();
}

// ======================
// FAVORITES SYSTEM
// ======================

function toggleFav(name) {
  if (fav.includes(name)) {
    fav = fav.filter(f => f !== name);
  } else {
    fav.push(name);
  }

  save();
  updateUI();
}

// ======================
// PRODUCT EVENTS
// ======================

document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");

    const name = card.querySelector("h3").innerText;
    const price = getPrice(card);
    const img = getImg(card);

    addToCart(name, price, img);
  });
});

document.querySelectorAll(".add-fav").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const name = e.target.closest(".product-card").querySelector("h3").innerText;
    toggleFav(name);
  });
});

// ======================
// CART RENDER
// ======================

function renderCart() {
  cartItemsBox.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsBox.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.style.marginBottom = "10px";

    div.innerHTML = `
      <img src="${item.img}" width="40" height="40" style="border-radius:6px;">

      <div style="flex:1">
        <b>${item.name}</b><br>
        $${item.price} × ${item.qty} = <b>$${itemTotal.toFixed(2)}</b>
      </div>

      <button onclick="changeQty(${index}, -1)">-</button>
      <button onclick="changeQty(${index}, 1)">+</button>
      <button onclick="removeItem(${index})">❌</button>
    `;

    cartItemsBox.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.style.marginTop = "15px";
  totalDiv.style.fontWeight = "bold";
  totalDiv.innerText = "TOTAL: $" + total.toFixed(2);

  cartItemsBox.appendChild(totalDiv);
}

// ======================
// CART ACTIONS
// ======================

window.changeQty = function(index, value) {
  cart[index].qty += value;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  save();
  updateUI();
  renderCart();
};

window.removeItem = function(index) {
  cart.splice(index, 1);
  save();
  updateUI();
  renderCart();
};

// ======================
// FAVORITES RENDER (WITH IMAGE)
// ======================

function renderFav() {
  favItemsBox.innerHTML = "";

  if (fav.length === 0) {
    favItemsBox.innerHTML = "<p>No favorites yet</p>";
    return;
  }

  fav.forEach(name => {

    const card = [...document.querySelectorAll(".product-card")]
      .find(c => c.querySelector("h3").innerText === name);

    if (!card) return;

    const img = card.querySelector("img").src;
    const price = card.querySelector(".price").innerText;

    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.style.marginBottom = "10px";

    div.innerHTML = `
      <img src="${img}" width="40" height="40" style="border-radius:6px;">

      <div style="flex:1">
        <b>${name}</b><br>
        <span>${price}</span>
      </div>

      <button onclick="removeFav('${name}')">❌</button>
    `;

    favItemsBox.appendChild(div);
  });
}

// ======================
// REMOVE FAVORITE
// ======================

window.removeFav = function(name) {
  fav = fav.filter(f => f !== name);
  save();
  updateUI();
  renderFav();
};

// ======================
// OPEN MODALS
// ======================

cartBtn.addEventListener("click", () => {
  renderCart();
  overlay.style.display = "block";
  cartModal.style.display = "block";
});

favBtn.addEventListener("click", () => {
  renderFav();
  overlay.style.display = "block";
  favModal.style.display = "block";
});

// ======================
// CLOSE MODALS
// ======================

function closeAll() {
  overlay.style.display = "none";
  cartModal.style.display = "none";
  favModal.style.display = "none";
}

overlay.addEventListener("click", closeAll);
closeCart.addEventListener("click", closeAll);
closeFav.addEventListener("click", closeAll);

// ======================
// INIT
// ======================

updateUI();

