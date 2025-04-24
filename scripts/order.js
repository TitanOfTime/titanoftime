let cart = [];
const productList = document.getElementById("product-list");
const cartSection = document.getElementById("cart-section");
const productListSection = document.getElementById("product-list-section");
const cartItems = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");

// Load products from JSON
fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}"/>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: Rs. ${product.price}</p>
        <input type="number" min="1" value="1" class="quantity-input"/>
        <button class="add-to-cart">Add to Cart</button>
      `;

      productDiv.querySelector(".add-to-cart").addEventListener("click", () => {
        const quantity = parseInt(
          productDiv.querySelector(".quantity-input").value
        );
        
        // Validate quantity
        if (quantity <= 0) {
          alert("Quantity must be greater than 0.");
          return; // Exit the function if quantity is invalid
        }

        addToCart(product, quantity);
        alert("Product added to cart.");
      });

      productList.appendChild(productDiv);
    });
  });

function addToCart(product, quantity) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>Rs. ${item.price}</td>
      <td>Rs. ${itemTotal}</td>
      <td><button id="removebtn" onclick="removeItem(${index})">Remove</button></td>
    `;
    cartItems.appendChild(row);
  });
  totalPriceEl.textContent = `Total: Rs. ${total}`;
  localStorage.setItem("persistentCart", JSON.stringify(cart));
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

document.getElementById("view-cart-btn").addEventListener("click", () => {
  cartSection.style.display = "block";
  productListSection.style.display = "none";
});

document.getElementById("back-to-products").addEventListener("click", () => {
  cartSection.style.display = "none";
  productListSection.style.display = "block";
});

document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});

document.getElementById("add-to-favorites").addEventListener("click", () => {
  localStorage.setItem("favoriteCart", JSON.stringify(cart));
  alert("Order saved to favorites.");
});

document.getElementById("apply-favorites").addEventListener("click", () => {
  const fav = localStorage.getItem("favoriteCart");
  if (fav) {
    cart = JSON.parse(fav);
    updateCart();
  } else {
    alert("No favorite order found.");
  }
});

// Checkout validation: Do not allow checkout with an empty cart
document.getElementById("checkout-btn").addEventListener("click", () => {
  // Check if the cart is empty
  if (cart.length === 0) {
    // If the cart is empty, show an alert
    alert("Your cart is empty. Please add products to the cart before checking out.");
  } else {
    // If the cart is not empty, proceed to checkout
    localStorage.setItem("cartToCheckout", JSON.stringify(cart));
    window.location.href = "checkout.html?t=" + new Date().getTime();
  }
});

// Load cart from localStorage if available
const savedCart = localStorage.getItem("persistentCart");
if (savedCart) {
  cart = JSON.parse(savedCart);
  updateCart();
}

