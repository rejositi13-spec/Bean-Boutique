const CART_STORAGE_KEY = "cart";
let messageTimeout;

function readCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
        return Array.isArray(cart) ? cart.filter(function (item) {
            return item && typeof item.name === "string" &&
                Number.isFinite(Number(item.price)) && Number(item.price) >= 0 &&
                Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0;
        }).map(function (item) {
            return {
                name: item.name,
                price: Number(item.price),
                quantity: Math.floor(Number(item.quantity))
            };
        }) : [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatMoney(amount) {
    return "MWK " + Number(amount).toLocaleString("en-US");
}

function showMessage(message) {
    let messageElement = document.getElementById("siteMessage");
    if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.id = "siteMessage";
        messageElement.className = "site-message";
        messageElement.setAttribute("role", "status");
        messageElement.setAttribute("aria-live", "polite");
        document.body.appendChild(messageElement);
    }
    messageElement.textContent = message;
    messageElement.classList.add("visible");
    window.clearTimeout(messageTimeout);
    messageTimeout = window.setTimeout(function () {
        messageElement.classList.remove("visible");
    }, 2500);
}

function updateCartCount() {
    const countElement = document.getElementById("cartcount");
    if (countElement) {
        countElement.textContent = readCart().reduce(function (count, item) {
            return count + item.quantity;
        }, 0);
    }
}

function addToCart(productName, productPrice) {
    const price = Number(productPrice);
    if (!productName || !Number.isFinite(price) || price < 0) {
        showMessage("This product does not have a valid price yet.");
        return;
    }

    const cart = readCart();
    const existingProduct = cart.find(function (item) {
        return item.name === productName;
    });
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
    showMessage(productName + " added to your cart.");
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    if (!cartItems || !cartTotal) {
        return;
    }

    const cart = readCart();
    cartItems.replaceChildren();
    if (cart.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 5;
        emptyCell.className = "empty-cart";
        emptyCell.textContent = "Your shopping cart is empty.";
        emptyRow.appendChild(emptyCell);
        cartItems.appendChild(emptyRow);
    }

    let total = 0;
    cart.forEach(function (item, index) {
        const lineTotal = item.price * item.quantity;
        total += lineTotal;

        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        const quantityCell = document.createElement("td");
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.step = "1";
        quantityInput.value = item.quantity;
        quantityInput.setAttribute("aria-label", "Quantity for " + item.name);
        quantityInput.addEventListener("change", function () {
            const quantity = Math.floor(Number(quantityInput.value));
            if (!Number.isFinite(quantity) || quantity < 1) {
                quantityInput.value = item.quantity;
                return;
            }
            cart[index].quantity = quantity;
            saveCart(cart);
            updateCartCount();
            renderCart();
        });
        quantityCell.appendChild(quantityInput);

        const priceCell = document.createElement("td");
        priceCell.textContent = formatMoney(item.price);
        const totalCell = document.createElement("td");
        totalCell.textContent = formatMoney(lineTotal);
        const removeCell = document.createElement("td");
        removeCell.className = "cart-remove-cell";
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "cart-remove";
        removeButton.textContent = "Remove";
        removeButton.setAttribute("aria-label", "Remove " + item.name + " from cart");
        removeButton.addEventListener("click", function () {
            cart.splice(index, 1);
            saveCart(cart);
            updateCartCount();
            renderCart();
            showMessage(item.name + " removed from your cart.");
        });
        removeCell.appendChild(removeButton);

        row.append(nameCell, quantityCell, priceCell, totalCell, removeCell);
        cartItems.appendChild(row);
    });

    cartTotal.textContent = formatMoney(total);
    updateCartCount();
}

function clearCart() {
    saveCart([]);
    renderCart();
    showMessage("Your shopping cart has been cleared.");
}

function setupAddToCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            addToCart(button.dataset.name, button.dataset.price);
        });
    });
}

function setupSearch() {
    document.querySelectorAll("#coffee, #search").forEach(function (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchText = searchInput.value.toLowerCase().trim();
            document.querySelectorAll("main .card").forEach(function (product) {
                product.hidden = !product.textContent.toLowerCase().includes(searchText);
            
function setupRegistrationForm() {
    const registrationForm = document.getElementById("registrationForm");
    if (!registrationForm) {
        return;
    }
    registrationForm.addEventListener("submit", function (event) {
        const requiredFields = registrationForm.querySelectorAll("[required]");
        const missingField = Array.from(requiredFields).some(function (field) {
            return !field.value.trim();
        });
        if (missingField) {
            event.preventDefault();
            showMessage("Please fill in all required fields.");
        }
    });
}

function initializeStore() {
    const menuToggle = document.getElementById("menu");
    const navLinks = document.getElementById("navlinks");
    if (menuToggle && navLinks) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    const clearButton = document.getElementById("cartClear");
    if (clearButton) {
        clearButton.addEventListener("click", clearCart);
    }

    setupSearch();
    setupRegistrationForm();
    setupAddToCartButtons();
    renderCart();
    updateCartCount();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeStore);
} else {
    initializeStore();
}
