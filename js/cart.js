/* =========================================
   季兒花藝｜購物車系統
   cart.js
   ========================================= */

(function () {
    "use strict";

    const CART_KEY = "jilflower_cart";

    // 取得購物車
    function getCart() {
        try {
            const cart = localStorage.getItem(CART_KEY);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error("讀取購物車失敗：", error);
            return [];
        }
    }

    // 儲存購物車
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartUI();
    }

    // 加入購物車
    function addToCart(product) {
        if (!product || !product.id) {
            console.error("商品資料不完整");
            return;
        }

        const cart = getCart();

        const existingProduct = cart.find(
            item => item.id === product.id
        );

        if (existingProduct) {
            existingProduct.quantity += product.quantity || 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name || "未命名商品",
                price: Number(product.price) || 0,
                image: product.image || "",
                quantity: product.quantity || 1
            });
        }

        saveCart(cart);

        showCartMessage(
            `${product.name || "商品"} 已加入購物車`
        );
    }

    // 修改數量
    function updateQuantity(productId, quantity) {
        const cart = getCart();

        const product = cart.find(
            item => item.id === productId
        );

        if (!product) return;

        quantity = Number(quantity);

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        product.quantity = quantity;

        saveCart(cart);
    }

    // 增加數量
    function increaseQuantity(productId) {
        const cart = getCart();

        const product = cart.find(
            item => item.id === productId
        );

        if (!product) return;

        product.quantity += 1;

        saveCart(cart);
    }

    // 減少數量
    function decreaseQuantity(productId) {
        const cart = getCart();

        const product = cart.find(
            item => item.id === productId
        );

        if (!product) return;

        if (product.quantity <= 1) {
            removeFromCart(productId);
            return;
        }

        product.quantity -= 1;

        saveCart(cart);
    }

    // 移除商品
    function removeFromCart(productId) {
        let cart = getCart();

        cart = cart.filter(
            item => item.id !== productId
        );

        saveCart(cart);
    }

    // 清空購物車
    function clearCart() {
        localStorage.removeItem(CART_KEY);
        updateCartUI();
    }

    // 計算商品數量
    function getCartCount() {
        const cart = getCart();

        return cart.reduce(
            (total, item) => total + item.quantity,
            0
        );
    }

    // 計算總金額
    function getCartTotal() {
        const cart = getCart();

        return cart.reduce(
            (total, item) =>
                total + (item.price * item.quantity),
            0
        );
    }

    // 金額格式
    function formatPrice(price) {
        return Number(price).toLocaleString("zh-TW");
    }

    // 更新購物車數量
    function updateCartUI() {

        const count = getCartCount();

        // 尋找所有購物車數量徽章
        const badges = document.querySelectorAll(
            ".cart-count"
        );

        badges.forEach(badge => {
            badge.textContent = count;

            if (count > 0) {
                badge.style.display = "inline-flex";
            } else {
                badge.style.display = "none";
            }
        });

        // 如果頁面有購物車內容
        renderCartItems();
    }

    // 顯示購物車商品
    function renderCartItems() {

        const container =
            document.querySelector("#cart-items");

        if (!container) return;

        const cart = getCart();

        if (cart.length === 0) {

            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>購物車目前是空的</p>
                </div>
            `;

            updateCartSummary();
            return;
        }

        container.innerHTML = cart.map(item => {

            const subtotal =
                item.price * item.quantity;

            return `
                <div class="cart-item"
                     data-product-id="${item.id}">

                    <div class="cart-item-image">

                        ${
                            item.image
                            ? `
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                >
                              `
                            : `
                                <div class="cart-no-image">
                                    <i class="fas fa-image"></i>
                                </div>
                              `
                        }

                    </div>

                    <div class="cart-item-info">

                        <h4>${item.name}</h4>

                        <div class="cart-item-price">
                            NT$ ${formatPrice(item.price)}
                        </div>

                        <div class="cart-item-controls">

                            <button
                                type="button"
                                class="cart-minus"
                                data-id="${item.id}"
                                aria-label="減少數量">
                                −
                            </button>

                            <span class="cart-quantity">
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="cart-plus"
                                data-id="${item.id}"
                                aria-label="增加數量">
                                ＋
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-right">

                        <div class="cart-subtotal">
                            NT$ ${formatPrice(subtotal)}
                        </div>

                        <button
                            type="button"
                            class="cart-remove"
                            data-id="${item.id}"
                            aria-label="刪除商品">
                            <i class="fas fa-trash-alt"></i>
                        </button>

                    </div>

                </div>
            `;

        }).join("");

        updateCartSummary();
    }

    // 更新購物車總計
    function updateCartSummary() {

        const totalElement =
            document.querySelector("#cart-total");

        if (!totalElement) return;

        totalElement.textContent =
            `NT$ ${formatPrice(getCartTotal())}`;
    }

    // 加入購物車提示
    function showCartMessage(message) {

        let messageBox =
            document.querySelector("#cart-message");

        if (!messageBox) {

            messageBox =
                document.createElement("div");

            messageBox.id = "cart-message";

            document.body.appendChild(messageBox);
        }

        messageBox.textContent = message;

        messageBox.classList.add("show");

        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 2200);
    }

    // 綁定加入購物車按鈕
    function bindAddToCartButtons() {

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".add-to-cart"
                    );

                if (!button) return;

                const product = {

                    id:
                        button.dataset.id,

                    name:
                        button.dataset.name,

                    price:
                        Number(button.dataset.price),

                    image:
                        button.dataset.image || "",

                    quantity:
                        1
                };

                addToCart(product);
            }
        );
    }

    // 綁定購物車操作
    function bindCartButtons() {

        document.addEventListener(
            "click",
            function (event) {

                const plusButton =
                    event.target.closest(
                        ".cart-plus"
                    );

                const minusButton =
                    event.target.closest(
                        ".cart-minus"
                    );

                const removeButton =
                    event.target.closest(
                        ".cart-remove"
                    );

                if (plusButton) {

                    increaseQuantity(
                        plusButton.dataset.id
                    );

                    return;
                }

                if (minusButton) {

                    decreaseQuantity(
                        minusButton.dataset.id
                    );

                    return;
                }

                if (removeButton) {

                    removeFromCart(
                        removeButton.dataset.id
                    );

                    return;
                }
            }
        );
    }

    // 初始化
    function initCart() {

        bindAddToCartButtons();

        bindCartButtons();

        updateCartUI();
    }

    // 對外公開
    window.JilFlowerCart = {

        getCart,
        addToCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
        formatPrice,
        updateCartUI
    };

    // DOM 完成後啟動
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initCart
        );

    } else {

        initCart();
    }

})();
