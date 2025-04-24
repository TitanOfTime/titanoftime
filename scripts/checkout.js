document.addEventListener('DOMContentLoaded', function () {
    function getCartData() {
        const cartData = localStorage.getItem("cartToCheckout");
        return cartData ? JSON.parse(cartData) : [];
    }

    function updateOrderSummary() {
        const cartItems = getCartData();
        const cartSummaryList = document.getElementById("order-summary-list");
        const totalPriceElement = document.getElementById("total-price");

        let total = 0;
        cartSummaryList.innerHTML = "";

        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const li = document.createElement("li");
            li.textContent = `${item.name} - Rs. ${item.price} x ${item.quantity} = Rs. ${itemTotal}`;
            cartSummaryList.appendChild(li);
            total += itemTotal;
        });

        totalPriceElement.textContent = `Rs. ${total}`;
    }

    updateOrderSummary();

    document.querySelector('.checkout-form').addEventListener('submit', function (e) {
        e.preventDefault();
    
        const fullName = document.getElementById("full-name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const phone = document.getElementById("phone").value;
        const paymentMethod = document.getElementById("payment-method").value;
    
        alert(`Order placed!\nName: ${fullName}\nEmail: ${email}\nCity: ${city}\nPayment: ${paymentMethod}`);
    
        // Clear localStorage cart
        localStorage.removeItem("cartToCheckout");
    
        // Reset form
        this.reset();
    
        // Clear order summary display
        document.getElementById("order-summary-list").innerHTML = "";
        document.getElementById("total-price").textContent = "Rs. 0";
    });
    
});
