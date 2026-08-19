/* =====================================
   綠光工程 × 季兒花藝
   cart.js
   購物車主程式
====================================== */

(function () {

    "use strict";

    /* =====================================
       購物車資料
    ====================================== */

    let cart = [];

    const STORAGE_KEY = "jilflower_cart";


    /* =====================================
       讀取購物車
    ====================================== */

    function loadCart() {

        try {

            const savedCart =
                localStorage.getItem(STORAGE_KEY);

            if (savedCart) {

                cart = JSON.parse(savedCart);

            }

        } catch (error) {

            console.error(
                "購物車資料讀取失敗",
                error
            );

            cart = [];

        }

    }


    /* =====================================
       儲存購物車
    ====================================== */

    function saveCart() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "購物車資料儲存失敗",
                error
            );

        }

    }


    /* =====================================
       商品總數量
    ====================================== */

    function getCartCount() {

        return cart.reduce(
            function (total, item) {

                return total + item.quantity;

            },
            0
        );

    }


    /* =====================================
       商品總金額
    ====================================== */

    function getCartTotal() {

        return cart.reduce(
            function (total, item) {

                return total +
                    (Number(item.price) *
                    Number(item.quantity));

            },
            0
        );

    }


    /* =====================================
       金額格式
    ====================================== */

    function formatPrice(price) {

        return "NT$ " +
            Number(price).toLocaleString("zh-TW");

    }


    /* =====================================
       更新購物車數量
    ====================================== */

    function updateCartCount() {

        const countElement =
            document.querySelector(".cart-count");

        if (!countElement) return;

        const count =
            getCartCount();

        countElement.textContent = count;

        if (count > 0) {

            countElement.style.display = "flex";

        } else {

            countElement.style.display = "none";

        }

    }


    /* =====================================
       顯示購物車內容
    ====================================== */

    function renderCart() {

        const container =
            document.getElementById("cart-items");

        const totalElement =
            document.getElementById("cart-total");

        if (!container) return;


        /* 空購物車 */

        if (cart.length === 0) {

            container.innerHTML = `

                <div class="cart-empty">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <p>
                        購物車目前是空的
                    </p>

                    <small>
                        選擇喜歡的花禮加入購物車吧！
                    </small>

                </div>

            `;

            if (totalElement) {

                totalElement.textContent =
                    "NT$ 0";

            }

            updateCartCount();

            return;

        }


        /* 商品列表 */

        container.innerHTML =
            cart.map(function (item, index) {

                const subtotal =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div class="cart-item">

                        <div class="cart-item-image">

                            ${
                                item.image
                                ?
                                `
                                <img
                                    src="${item.image}"
                                    alt="${escapeHTML(item.name)}">
                                `
                                :
                                `
                                <div class="cart-no-image">

                                    <i class="fa-solid fa-image"></i>

                                </div>
                                `
                            }

                        </div>


                        <div class="cart-item-info">

                            <h4>
                                ${escapeHTML(item.name)}
                            </h4>

                            <div class="cart-item-price">

                                ${formatPrice(item.price)}

                            </div>


                            <div class="cart-item-controls">

                                <button
                                    type="button"
                                    class="cart-minus"
                                    data-index="${index}">

                                    −

                                </button>


                                <span class="cart-quantity">

                                    ${item.quantity}

                                </span>


                                <button
                                    type="button"
                                    class="cart-plus"
                                    data-index="${index}">

                                    +

                                </button>

                            </div>

                        </div>


                        <div class="cart-item-right">

                            <div class="cart-subtotal">

                                ${formatPrice(subtotal)}

                            </div>


                            <button
                                type="button"
                                class="cart-remove"
                                data-index="${index}"
                                aria-label="刪除商品">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </div>

                `;

            }).join("");


        /* 總金額 */

        if (totalElement) {

            totalElement.textContent =
                formatPrice(getCartTotal());

        }


        updateCartCount();

        bindCartButtons();

    }


    /* =====================================
       綁定 + / - / 刪除
    ====================================== */

    function bindCartButtons() {


        /* 減少數量 */

        document
            .querySelectorAll(".cart-minus")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );

                        if (!cart[index]) return;


                        if (
                            cart[index].quantity > 1
                        ) {

                            cart[index].quantity--;

                        } else {

                            cart.splice(index, 1);

                        }


                        saveCart();

                        renderCart();

                    }
                );

            });


        /* 增加數量 */

        document
            .querySelectorAll(".cart-plus")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );

                        if (!cart[index]) return;


                        cart[index].quantity++;


                        saveCart();

                        renderCart();

                    }
                );

            });


        /* 刪除商品 */

        document
            .querySelectorAll(".cart-remove")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );

                        if (!cart[index]) return;


                        cart.splice(index, 1);


                        saveCart();

                        renderCart();

                    }
                );

            });

    }


    /* =====================================
       加入購物車
    ====================================== */

    function addToCart(product) {

        if (!product) return;


        if (
            !product.id ||
            !product.name
        ) {

            console.error(
                "商品缺少 id 或 name",
                product
            );

            return;

        }


        const price =
            Number(product.price);


        if (
            !Number.isFinite(price) ||
            price < 0
        ) {

            console.error(
                "商品價格錯誤",
                product
            );

            return;

        }


        /* 找看看購物車裡是否已經有 */

        const existingItem =
            cart.find(function (item) {

                return item.id === product.id;

            });


        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({

                id: String(product.id),

                name: String(product.name),

                price: price,

                image: product.image || "",

                quantity: 1

            });

        }


        saveCart();

        renderCart();

        showCartMessage(
            product.name + " 已加入購物車"
        );

    }


    /* =====================================
       移除商品
    ====================================== */

    function removeFromCart(id) {

        cart =
            cart.filter(function (item) {

                return item.id !== String(id);

            });


        saveCart();

        renderCart();

    }


    /* =====================================
       清空購物車
    ====================================== */

    function clearCart() {

        cart = [];

        saveCart();

        renderCart();

    }


    /* =====================================
       購物車提示
    ====================================== */

    function showCartMessage(message) {

        const messageElement =
            document.getElementById("cart-message");

        if (!messageElement) return;


        messageElement.textContent =
            message;


        messageElement.classList.add("show");


        setTimeout(function () {

            messageElement.classList.remove(
                "show"
            );

        }, 2000);

    }


    /* =====================================
       HTML 安全處理
    ====================================== */

    function escapeHTML(value) {

        return String(value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    /* =====================================
       對外公開
    ====================================== */

    window.JilFlowerCart = {

        addToCart: addToCart,

        removeFromCart: removeFromCart,

        clearCart: clearCart,

        getCart: function () {

            return cart;

        },

        getCartCount: getCartCount,

        getCartTotal: getCartTotal,

        renderCart: renderCart

    };


    /* =====================================
       初始化
    ====================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadCart();

            renderCart();

        }
    );

})();
