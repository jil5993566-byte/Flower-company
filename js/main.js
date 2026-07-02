/*=====================================
綠光工程 × 季兒花藝
main.js
======================================*/

// 初始化 AOS
AOS.init({
    duration: 1000,
    once: true
});

// Hero Banner
const heroCarousel = document.querySelector("#carouselHero");

if (heroCarousel) {

    new bootstrap.Carousel(heroCarousel, {

        interval: 5000,

        pause: false,

        ride: "carousel",

        touch: true

    });

}

// Navbar Scroll

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {

    if (window.scrollY > 80) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});

// Smooth Scroll

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// 手機選單自動收合

const navLinks = document.querySelectorAll(".nav-link");

const menu = document.querySelector(".navbar-collapse");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (menu.classList.contains("show")) {

            new bootstrap.Collapse(menu).hide();

        }

    });

});

// 返回頂端按鈕

const topButton = document.createElement("button");

topButton.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';

topButton.id = "topBtn";

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.right = "20px";
topButton.style.bottom = "20px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#1B5E20";
topButton.style.color = "#fff";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "999";

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// Gallery Hover

const gallery = document.querySelectorAll(".gallery-img");

gallery.forEach(img => {

    img.addEventListener("mouseenter", () => {

        img.style.transform = "scale(1.05)";

    });

    img.addEventListener("mouseleave", () => {

        img.style.transform = "scale(1)";

    });

});

// Console

console.log("綠光工程 × 季兒花藝 官網 V1 已載入");
