/* =========================================================
   ClassChain Homepage
   index.js
========================================================= */

"use strict";


/* =========================================================
   DOM
========================================================= */

const siteHeader = document.getElementById("siteHeader");

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const languageToggle = document.getElementById("languageToggle");
const languageMenu = document.getElementById("languageMenu");
const currentLanguage = document.getElementById("currentLanguage");

const currentYear = document.getElementById("currentYear");


/* =========================================================
   Header Scroll
========================================================= */

function handleHeaderScroll() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 20) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
);

handleHeaderScroll();


/* =========================================================
   Mobile Menu
========================================================= */

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    /*
     * Close mobile menu after selecting
     * a navigation link.
     */

    mainNav
        .querySelectorAll(
            'a[href^="#"], a[href$=".html"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


    /*
     * Close menu when clicking outside.
     */

    document.addEventListener(
        "click",
        event => {

            const clickedInsideMenu =
                mainNav.contains(event.target);

            const clickedToggle =
                menuToggle.contains(event.target);

            if (
                !clickedInsideMenu &&
                !clickedToggle
            ) {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );
}


/* =========================================================
   Language Menu
========================================================= */

if (languageToggle && languageMenu) {

    languageToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const isOpen =
                languageMenu.classList.toggle("open");

            languageToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !languageMenu.contains(event.target) &&
                !languageToggle.contains(event.target)
            ) {

                languageMenu.classList.remove("open");

                languageToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    languageMenu
        .querySelectorAll("[data-lang]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const language =
                        button.dataset.lang;

                    changeLanguage(language);

                }
            );

        });
}


/* =========================================================
   Language
========================================================= */

/*
 * فعلاً این بخش فقط انتخاب زبان را مدیریت می‌کند.
 *
 * در مرحله بعد باید محتوای واقعی:
 *
 * FA
 * EN
 * AR
 *
 * برای تمام عناصر سایت تعریف شود.
 *
 * بهتر است ترجمه‌ها در فایل‌های جداگانه
 * نگهداری شوند و متن‌ها داخل JS هاردکد نشوند.
 */

function changeLanguage(language) {

    const supportedLanguages = [
        "fa",
        "en",
        "ar"
    ];

    if (
        !supportedLanguages.includes(language)
    ) {
        return;
    }

    /*
     * زبان انتخاب‌شده را ذخیره می‌کنیم
     * تا در مراجعه بعدی حفظ شود.
     */

    localStorage.setItem(
        "classchain-language",
        language
    );

    /*
     * وضعیت ظاهری فعلی.
     */

    if (currentLanguage) {

        currentLanguage.textContent =
            language.toUpperCase();

    }

    /*
     * جهت صفحه
     */

    if (language === "fa") {

        document.documentElement.lang = "fa";

        document.documentElement.dir = "rtl";

    } else if (language === "ar") {

        document.documentElement.lang = "ar";

        document.documentElement.dir = "rtl";

    } else {

        document.documentElement.lang = "en";

        document.documentElement.dir = "ltr";

    }

    /*
     * در این نسخه پایه هنوز ترجمه محتوا
     * به صورت کامل وارد نشده است.
     *
     * این بخش را در مرحله بعد به سیستم
     * i18n واقعی متصل می‌کنیم.
     */

    languageMenu.classList.remove("open");

    languageToggle.setAttribute(
        "aria-expanded",
        "false"
    );
}


/* =========================================================
   Restore Language
========================================================= */

function restoreLanguage() {

    const savedLanguage =
        localStorage.getItem(
            "classchain-language"
        );

    if (
        savedLanguage &&
        ["fa", "en", "ar"].includes(savedLanguage)
    ) {

        changeLanguage(savedLanguage);

    }

}

restoreLanguage();


/* =========================================================
   Current Year
========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   Smooth Scroll
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const headerHeight =
                    siteHeader
                        ? siteHeader.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top
                    +
                    window.scrollY
                    -
                    headerHeight
                    -
                    15;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }
        );

    });


/* =========================================================
   Escape Key
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        if (mainNav) {

            mainNav.classList.remove("open");

        }

        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        if (languageMenu) {

            languageMenu.classList.remove("open");

        }

        if (languageToggle) {

            languageToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);
