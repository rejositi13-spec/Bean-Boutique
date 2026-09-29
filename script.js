const menuToggle = document.getElementById('menu');
const navLinks = document.getElementById('navlinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
}

document.addEventListener("DOMC ontentLoaded", function() {
    updatecartcount();
    setupSearch();
    setupRegistrationForm();
    setuoAddToCartButtons();
    displayCart();
});
function setUpSearch() {
    const searchInput = document.getElementById("search Input");
    if (!searchInput) {
        return;
    }
    searchInput.addEventListener("input", function() {
        const searchText = searchInput.ariaValueMax.toLowerCase().trim();
        const products = document.querySelectorAll(".card");
        products.forEach(function (product){
            const productText = product.textContent.toLowerCase();
            if (productText.includes(searchText)){
                product.style.display ="";
            }else{
                product.style.display = "none"
            }
        });

    });
}
function
setupAddToCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            const productName = button.getAttribute("data-name");
            const productprice = parseFloat(button.getAttribute("data-price")
        );
        addTocart(productName,productprice);
        });
    });
}
function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(function(item) {
        return item.name === productName;
    });
    if (existingProduct) {
        existingProduct.quantity ++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showMessage(productName + " has been added to the cart.");
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = 0;
    cart.forEach(function(item) {
        totalItems += item.quantity;
    });
    const cartCountElement = document.getElementById("cartcount");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}
function dispalyCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    if (!cartItems || ! cartTotal) {
        return;
    }
    const cart = JSON.parse(localStorage.getItem("coffeecart"))
    || [];
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>your shopping cart is empty.<p>";
        cartTotal.textContent = "0.00";
        return;
    }
    let total = 0;
    cart.forEach(function(item,index) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const row = document.createElement("tr");
       
    });
    cartTotal.textContent = total.toFixed(2);
    }
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        displayCart();
        showMessage("product removed from the cart.");
    } 
}
function clearCart() {
    localStorage.removeItem(" coffee cart");
    updateCartCount();
    displayCart();
    showMessage("your shopping cart has been cleared.");
}
function setupRegistrationForm() {
    const registrationForm = document.getElementById("registrationForm");
    if (!registrationForm) {
        return;
    }
    registrationForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const selectedEvent = document.getElementById("selectedEvent")
        if (!firstName ===""|| !lastName  ===""|| !email  ===""|| !selectedEvent) {
            showMessage("please fill in all required fields.");
            return;
        }
    });
}
