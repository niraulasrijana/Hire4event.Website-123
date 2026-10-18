/*  HIRE4EVENT - SCRIPT.JS
   Mobile Menu, Search, Filters, Form,
   Testimonials, Footer Year*/

document.addEventListener("DOMContentLoaded", function () {

    // 1. MOBILE NAVIGATION MENU
    const menuToggle = document.querySelector(".menu-toggle");
    const primaryNav = document.querySelector(".primary-nav");

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && primaryNav) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", function () {
            const isOpen = primaryNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Close menu after clicking a navigation link
        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Close mobile menu when returning to desktop layout
        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }


    // 2. UPDATE FOOTER COPYRIGHT YEAR
    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // 3. SERVICE CATEGORY FILTERS
    const filterButtons = document.querySelectorAll(".filter-tab");
    const serviceCards = document.querySelectorAll(".service-card");

    function normalizeText(value) {
        return String(value || "")
            .toLowerCase()
            .trim();
    }

    function filterServices(category) {
        serviceCards.forEach(function (card) {
            const cardCategory = normalizeText(
                card.dataset.category ||
                card.querySelector("h3")?.textContent
            );

            const matches =
                category === "all" ||
                cardCategory.includes(category) ||
                normalizeText(card.textContent).includes(category);

            card.hidden = !matches;
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("is-active");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");

            const category = normalizeText(
                button.dataset.category ||
                button.textContent
            );

            if (
                category.includes("all") ||
                category.includes("all services")
            ) {
                filterServices("all");
            } else {
                filterServices(category);
            }
        });
    });


    // 4. SEARCH SERVICES AND ARTISTS
    const searchInput = document.querySelector(
        "#service-search, .search-controls input[type='search']"
    );

    const searchButton = document.querySelector(
        "#search-button, .search-controls button"
    );

    const searchableCards = document.querySelectorAll(
        ".service-card, .artist-card"
    );

    function runSearch() {
        if (!searchInput) return;

        const query = normalizeText(searchInput.value);

        searchableCards.forEach(function (card) {
            const content = normalizeText(card.textContent);
            const matches = content.includes(query);

            card.hidden = !matches;
        });

        // If the search is empty, show all cards
        if (query === "") {
            searchableCards.forEach(function (card) {
                card.hidden = false;
            });
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", runSearch);

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                runSearch();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", runSearch);
    }


    // 5. TESTIMONIAL SLIDER
    const testimonialCard = document.querySelector(".testimonial-card");
    const sliderButtons = document.querySelectorAll(".slider-controls button");

    const testimonials = [
        {
            quote: "The team made our event planning process much easier. Everything felt organised and smooth.",
            name: "Happy Customer",
            detail: "Event client"
        },
        {
            quote: "We found suitable event services in one place and saved time coordinating with different vendors.",
            name: "Event Organiser",
            detail: "Customer feedback example"
        },
        {
            quote: "The booking process was simple, and it was easy to explore different event options.",
            name: "Satisfied Client",
            detail: "Customer feedback example"
        }
    ];

    let testimonialIndex = 0;

    function showTestimonial(index) {
        if (!testimonialCard) return;

        testimonialIndex =
            (index + testimonials.length) % testimonials.length;

        const testimonial = testimonials[testimonialIndex];

        const quote = testimonialCard.querySelector("p");
        const name = testimonialCard.querySelector("h3");
        const detail = testimonialCard.querySelector("span");

        if (quote) quote.textContent = testimonial.quote;
        if (name) name.textContent = testimonial.name;
        if (detail) detail.textContent = testimonial.detail;
    }

    if (testimonialCard && sliderButtons.length >= 2) {
        sliderButtons[0].setAttribute(
            "aria-label",
            "Previous testimonial"
        );

        sliderButtons[1].setAttribute(
            "aria-label",
            "Next testimonial"
        );

        sliderButtons[0].addEventListener("click", function () {
            showTestimonial(testimonialIndex - 1);
        });

        sliderButtons[1].addEventListener("click", function () {
            showTestimonial(testimonialIndex + 1);
        });
    }


    // 6. ENQUIRY FORM VALIDATION
    const enquiryForm = document.querySelector(".enquiry-form");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = enquiryForm.querySelector(
                'input[name="name"], input[name="fullName"], input[autocomplete="name"]'
            );

            const emailInput = enquiryForm.querySelector(
                'input[type="email"]'
            );

            const phoneInput = enquiryForm.querySelector(
                'input[type="tel"]'
            );

            const requiredFields = enquiryForm.querySelectorAll(
                "[required]"
            );

            let isValid = true;

            // Remove old error messages
            enquiryForm.querySelectorAll(".field-error").forEach(
                function (error) {
                    error.remove();
                }
            );

            requiredFields.forEach(function (field) {
                field.removeAttribute("aria-invalid");

                if (!field.value.trim()) {
                    isValid = false;
                    field.setAttribute("aria-invalid", "true");

                    const error = document.createElement("span");
                    error.className = "field-error";
                    error.textContent = "Please fill in this field.";

                    field.insertAdjacentElement("afterend", error);
                }
            });

            if (
                emailInput &&
                emailInput.value.trim() &&
                !emailInput.validity.valid
            ) {
                isValid = false;
                emailInput.setAttribute("aria-invalid", "true");

                const error = document.createElement("span");
                error.className = "field-error";
                error.textContent = "Please enter a valid email address.";

                emailInput.insertAdjacentElement("afterend", error);
            }

            if (
                phoneInput &&
                phoneInput.value.trim() &&
                !/^[0-9+\-\s()]{7,20}$/.test(phoneInput.value.trim())
            ) {
                isValid = false;
                phoneInput.setAttribute("aria-invalid", "true");

                const error = document.createElement("span");
                error.className = "field-error";
                error.textContent = "Please enter a valid phone number.";

                phoneInput.insertAdjacentElement("afterend", error);
            }

            if (!isValid) {
                const firstInvalid = enquiryForm.querySelector(
                    '[aria-invalid="true"]'
                );

                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Demo message only; no data is sent to a server.
            let successMessage = enquiryForm.querySelector(
                ".form-success"
            );

            if (!successMessage) {
                successMessage = document.createElement("p");
                successMessage.className = "form-success";
                successMessage.setAttribute("role", "status");

                successMessage.style.marginTop = "15px";
                successMessage.style.color = "#167a3f";
                successMessage.style.fontWeight = "700";

                enquiryForm.appendChild(successMessage);
            }

            successMessage.textContent =
                "Form validation successful! To receive enquiries, connect this form to a backend or form service.";
        });
    }


    // 7. WHATSAPP LINK
    const whatsappLink = document.querySelector(".whatsapp-float");

    if (whatsappLink) {
        whatsappLink.setAttribute("target", "_blank");
        whatsappLink.setAttribute("rel", "noopener noreferrer");
    }


    // 8. IMAGE FALLBACK FOR BROKEN IMAGES
    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            image.style.backgroundColor = "#f1f1f1";
            image.style.color = "#555";
            image.alt = image.alt || "Image unavailable";
        });
    });

});
/*HIRE4EVENT - SERVICE.JS
   Services Page JavaScript*/

document.addEventListener("DOMContentLoaded", function () {

    // 1. MOBILE NAVIGATION MENU
    const menuToggle = document.querySelector(".menu-toggle");
    const primaryNav = document.querySelector(".primary-nav");

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && primaryNav) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", function () {
            const isOpen = primaryNav.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }


    // 2. AUTOMATIC FOOTER YEAR
    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 3. SERVICE CATEGORY FILTERS
    const filterButtons = document.querySelectorAll(".filter-tab");

    const serviceCards = document.querySelectorAll(
        ".service-grid .service-card[data-category]"
    );

    const searchInput = document.querySelector("#service-search");

    let selectedCategory = "all";
    let searchQuery = "";

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function updateServices() {
        serviceCards.forEach(function (card) {
            const category = normalize(card.dataset.category);
            const text = normalize(card.textContent);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesSearch =
                searchQuery === "" ||
                text.includes(searchQuery) ||
                category.includes(searchQuery);

            card.hidden = !(matchesCategory && matchesSearch);
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const category = normalize(button.dataset.category);

            selectedCategory = category || "all";

            filterButtons.forEach(function (item) {
                const isActive = item === button;

                item.classList.toggle("is-active", isActive);
                item.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            updateServices();
        });
    });


    // 4. SEARCH SERVICES
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            searchQuery = normalize(searchInput.value);
            updateServices();
        });

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                updateServices();
            }
        });
    }

    const searchButton = document.querySelector("#search-button");

    if (searchButton) {
        searchButton.addEventListener("click", function () {
            if (searchInput) {
                searchQuery = normalize(searchInput.value);
                updateServices();
            }
        });
    }


    // 5. WHATSAPP LINK SECURITY
    const whatsappLink = document.querySelector(".whatsapp-float");

    if (whatsappLink) {
        whatsappLink.setAttribute("target", "_blank");
        whatsappLink.setAttribute(
            "rel",
            "noopener noreferrer"
        );
    }


    // 6. IMAGE ERROR HANDLING
    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            image.style.backgroundColor = "#f2f2f2";
            image.alt = image.alt || "Image unavailable";
        });
    });


    // 7. ACCESSIBILITY: FILTER BUTTON DEFAULT STATE
    filterButtons.forEach(function (button) {
        if (!button.hasAttribute("aria-pressed")) {
            button.setAttribute(
                "aria-pressed",
                String(button.classList.contains("is-active"))
            );
        }
    });

});

/*  HIRE4EVENT - SOLUTIONS PAGE JAVASCRIPT
   File: solutions.js*/

document.addEventListener("DOMContentLoaded", function () {

  // 
  // 1. MOBILE NAVIGATION
  // 

  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");

  function openMenu() {
    if (!menuToggle || !primaryNav) return;

    primaryNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    menuToggle.textContent = "✕";
  }

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.textContent = "☰";
  }

  function toggleMenu() {
    if (!primaryNav) return;

    const isOpen = primaryNav.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && primaryNav) {

    menuToggle.addEventListener("click", toggleMenu);

    // Close menu after clicking a navigation link.
    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close menu with Escape key.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close menu when clicking outside navigation.
    document.addEventListener("click", function (event) {
      const clickedInsideNav = primaryNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMenu();
      }
    });

    // Reset menu when switching back to desktop layout.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }


  // 
  // 2. FOOTER CURRENT YEAR
  // 

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // 
  // 3. SMOOTH SCROLL FOR PAGE LINKS
  // 

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });

  });


  // 
  // 4. IMAGE FALLBACK
  // Hide an image if its URL fails to load.
  // 

  document.querySelectorAll("img").forEach(function (img) {

    img.addEventListener("error", function () {
      img.style.opacity = "0.35";
      img.style.backgroundColor = "#eeeeee";
      img.setAttribute("data-image-error", "true");
    });

  });


  // 
  // 5. ACTIVE NAVIGATION LINK
  // 

  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  primaryNav?.querySelectorAll("a").forEach(function (link) {

    const linkPage = link.getAttribute("href");

    if (
      linkPage &&
      linkPage.toLowerCase() === currentPage &&
      !link.classList.contains("nav-plan")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

  });


  // 
  // 6. CONSOLE MESSAGE
  //

  console.log("Hire4Event Solutions page loaded successfully.");

});

/* 
HIRE4EVENT MARKETPLACE JAVASCRIPT
   File: marketplace.js */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
// 
// 1. SELECT HTML ELEMENTS
// 

    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    const searchInput = document.getElementById("marketplaceSearch");
    const clearSearchBtn = document.getElementById("clearSearch");

    const filterTabs = document.querySelectorAll(".filter-tab");
    const marketplaceCards = document.querySelectorAll(".marketplace-card");

    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");
    const resetFiltersBtn = document.getElementById("resetFilters");

    const currentYear = document.getElementById("currentYear");
// 
// 2. FOOTER CURRENT YEAR
// 

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 
    // 3. MOBILE NAVIGATION
    // 

    function closeMobileMenu() {
        if (!menuToggle || !primaryNav) return;

        menuToggle.classList.remove("active");
        primaryNav.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function openMobileMenu() {
        if (!menuToggle || !primaryNav) return;

        menuToggle.classList.add("active");
        primaryNav.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    if (menuToggle && primaryNav) {
        // Set initial accessibility state
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-controls", "primaryNav");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        menuToggle.addEventListener("click", function () {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu after clicking a navigation link
        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                closeMobileMenu();
            });
        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });

        // Close menu when clicking outside it
        document.addEventListener("click", function (event) {
            const clickedInsideNav = primaryNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                closeMobileMenu();
            }
        });

        // Close mobile menu when switching to desktop width
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }

    // 
    // 4. MARKETPLACE FILTER VARIABLES
    // 

    let activeCategory = "all";

    // 
    // 5. FILTER AND SEARCH SERVICES
    // 

    function filterMarketplace() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        marketplaceCards.forEach(function (card) {
            const cardCategory = (
                card.getAttribute("data-category") || ""
            ).toLowerCase();

            const customSearchText = (
                card.getAttribute("data-search") || ""
            ).toLowerCase();

            const cardText = card.textContent.toLowerCase();

            // Check selected category
            const matchesCategory =
                activeCategory === "all" ||
                cardCategory === activeCategory;

            // Check search text
            const matchesSearch =
                searchTerm === "" ||
                customSearchText.includes(searchTerm) ||
                cardText.includes(searchTerm);

            // Show only matching cards
            const shouldShow = matchesCategory && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Update results count
        if (resultsCount) {
            if (visibleCount === 1) {
                resultsCount.textContent = "Showing 1 service";
            } else {
                resultsCount.textContent =
                    "Showing " + visibleCount + " services";
            }
        }

        // Show or hide no-results message
        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }

        // Update clear search button
        if (clearSearchBtn) {
            clearSearchBtn.hidden = searchTerm === "";
        }

        // Update reset button accessibility
        if (resetFiltersBtn) {
            const hasActiveFilters =
                activeCategory !== "all" || searchTerm !== "";

            resetFiltersBtn.setAttribute(
                "aria-disabled",
                String(!hasActiveFilters)
            );
        }
    }

    // 
    // 6. CATEGORY FILTER BUTTONS
    // 

    filterTabs.forEach(function (tab) {
        tab.setAttribute("aria-pressed", "false");

        tab.addEventListener("click", function () {
            activeCategory =
                (tab.getAttribute("data-category") || "all").toLowerCase();

            // Update active category button
            filterTabs.forEach(function (filterTab) {
                const isActive = filterTab === tab;

                filterTab.classList.toggle("is-active", isActive);
                filterTab.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterMarketplace();
        });
    });

    // 
    // 7. SEARCH INPUT
    // 

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterMarketplace();
        });

        // Press Escape to clear search
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                searchInput.value = "";
                filterMarketplace();
                searchInput.blur();
            }
        });
    }

    // 
    // 8. CLEAR SEARCH BUTTON
    // 

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }

            filterMarketplace();
        });
    }

    // 
    // 9. RESET ALL FILTERS
    // 

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", function () {
            activeCategory = "all";

            if (searchInput) {
                searchInput.value = "";
            }

            filterTabs.forEach(function (tab) {
                const isAllCategory =
                    (tab.getAttribute("data-category") || "").toLowerCase()
                    === "all";

                tab.classList.toggle("is-active", isAllCategory);
                tab.setAttribute(
                    "aria-pressed",
                    String(isAllCategory)
                );
            });

            filterMarketplace();
        });
    }

    // 
    // 10. INITIALIZE MARKETPLACE
    // 

    // Set All as the default active filter
    let allCategoryFound = false;

    filterTabs.forEach(function (tab) {
        const isAllCategory =
            (tab.getAttribute("data-category") || "").toLowerCase()
            === "all";

        if (isAllCategory && !allCategoryFound) {
            tab.classList.add("is-active");
            tab.setAttribute("aria-pressed", "true");
            allCategoryFound = true;
        } else {
            tab.classList.remove("is-active");
            tab.setAttribute("aria-pressed", "false");
        }
    });

    // Display all services on page load
    filterMarketplace();

});
// 
//  HIRE4EVENT RESOURCES PAGE JAVASCRIPT
   File: resources.js
// 

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
 // 
// 1. SELECT HTML ELEMENTS
// 

    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    const searchInput = document.getElementById("resourceSearch");
    const clearSearchBtn = document.getElementById("clearSearch");

    const filterButtons = document.querySelectorAll(".resource-filter");
    const resourceCards = document.querySelectorAll(".resource-card");

    const resourceCount = document.getElementById("resourceCount");
    const noResources = document.getElementById("noResources");
    const resetResourcesBtn = document.getElementById("resetResources");

    const currentYear = document.getElementById("currentYear");
// 
// 2. FOOTER CURRENT YEAR
// 

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
// 
//  3. MOBILE NAVIGATION
// 

    function closeMobileMenu() {
        if (!menuToggle || !primaryNav) return;

        menuToggle.classList.remove("active");
        primaryNav.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function openMobileMenu() {
        if (!menuToggle || !primaryNav) return;

        menuToggle.classList.add("active");
        primaryNav.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    }

    if (menuToggle && primaryNav) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-controls", "primaryNav");

        menuToggle.addEventListener("click", function () {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu after clicking a navigation link
        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

        // Close menu using Escape
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {
            const clickedToggle = menuToggle.contains(event.target);
            const clickedNav = primaryNav.contains(event.target);

            if (!clickedToggle && !clickedNav) {
                closeMobileMenu();
            }
        });

        // Close menu when returning to desktop layout
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
// 
//  4. RESOURCE FILTER STATE
// 

    let activeCategory = "all";
// 5. SEARCH AND FILTER RESOURCES

    function filterResources() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        resourceCards.forEach(function (card) {
            const category = (
                card.getAttribute("data-category") || ""
            ).toLowerCase();

            const searchKeywords = (
                card.getAttribute("data-search") || ""
            ).toLowerCase();

            const cardText = card.textContent.toLowerCase();

            // Match selected category
            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;

            // Match search text against keywords and visible content
            const matchesSearch =
                searchTerm === "" ||
                searchKeywords.includes(searchTerm) ||
                cardText.includes(searchTerm);

            const shouldShow = matchesCategory && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Update number of visible resources
        if (resourceCount) {
            resourceCount.textContent =
                "Showing " +
                visibleCount +
                (visibleCount === 1 ? " resource" : " resources");
        }

        // Show message when no resources match
        if (noResources) {
            noResources.hidden = visibleCount !== 0;
        }

        // Show Clear button only when search has text
        if (clearSearchBtn) {
            clearSearchBtn.hidden = searchTerm === "";
        }
    }
// 6. RESOURCE CATEGORY FILTER BUTTONS

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeCategory = (
                button.getAttribute("data-category") || "all"
            ).toLowerCase();

            // Update active button and accessibility state
            filterButtons.forEach(function (filterButton) {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterResources();
        });
    });
// 7. LIVE SEARCH

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterResources();
        });

        // Escape clears the search field
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                searchInput.value = "";
                filterResources();
                searchInput.blur();
            }
        });
    }
// 8. CLEAR SEARCH BUTTON

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }

            filterResources();
        });
    }
// 9. RESET SEARCH AND FILTERS

    function resetResourceFilters() {
        activeCategory = "all";

        if (searchInput) {
            searchInput.value = "";
        }

        filterButtons.forEach(function (button) {
            const isAll =
                (button.getAttribute("data-category") || "")
                    .toLowerCase() === "all";

            button.classList.toggle("active", isAll);

            button.setAttribute(
                "aria-pressed",
                String(isAll)
            );
        });

        filterResources();
    }

    if (resetResourcesBtn) {
        resetResourcesBtn.addEventListener(
            "click",
            resetResourceFilters
        );
    }

    // 
    // 10. EVENT CHECKLIST
    //

    const checklistItems = document.querySelectorAll(
        ".checklist-item input[type='checkbox']"
    );

    const checklistProgressText =
        document.getElementById("checklistProgressText");

    const checklistProgress =
        document.getElementById("checklistProgress");

    const progressFill =
        document.getElementById("progressFill");

    const clearChecklistBtn =
        document.getElementById("clearChecklist");

    function updateChecklistProgress() {
        const totalTasks = checklistItems.length;

        let completedTasks = 0;

        checklistItems.forEach(function (checkbox) {
            if (checkbox.checked) {
                completedTasks++;
            }
        });

        const percentage = totalTasks > 0
            ? (completedTasks / totalTasks) * 100
            : 0;

        // Update progress text
        if (checklistProgressText) {
            checklistProgressText.textContent =
                completedTasks +
                " of " +
                totalTasks +
                " tasks completed";
        }

        // Update progress bar
        if (progressFill) {
            progressFill.style.width = percentage + "%";
        }

        // Update accessible progress value
        if (checklistProgress) {
            checklistProgress.setAttribute(
                "aria-valuemax",
                String(totalTasks)
            );

            checklistProgress.setAttribute(
                "aria-valuenow",
                String(completedTasks)
            );
        }
    }

    // Listen for checkbox changes
    checklistItems.forEach(function (checkbox) {
        checkbox.addEventListener(
            "change",
            updateChecklistProgress
        );
    });

    // Clear all checklist selections
    if (clearChecklistBtn) {
        clearChecklistBtn.addEventListener("click", function () {
            checklistItems.forEach(function (checkbox) {
                checkbox.checked = false;
            });

            updateChecklistProgress();
        });
    }

    // 
    // 11. BACK TO TOP
    // 

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });
    }

    //
    // 12. INITIALIZE PAGE
    // 

    // Set default category to All Resources
    let allButtonFound = false;

    filterButtons.forEach(function (button) {
        const isAll =
            (button.getAttribute("data-category") || "")
                .toLowerCase() === "all";

        if (isAll && !allButtonFound) {
            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");
            allButtonFound = true;
        } else {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        }
    });

    // Initialize search results and checklist progress
    filterResources();
    updateChecklistProgress();

});
/*  COMPANY PAGE - HIRE4EVENT INSPIRED
   Complete JavaScript */

document.addEventListener("DOMContentLoaded", function () {

    // ---------- 1. SELECT ELEMENTS ----------

    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");
    const currentYear = document.getElementById("currentYear");
    const backToTop = document.getElementById("backToTop");


    // ---------- 2. FOOTER CURRENT YEAR ----------

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ---------- 3. MOBILE MENU ----------

    function openMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function toggleMenu() {
        if (!menuToggle || !primaryNav) return;

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle && primaryNav) {

        // Toggle menu on button click
        menuToggle.addEventListener("click", toggleMenu);

        // Close menu after clicking a navigation link
        const navLinks = primaryNav.querySelectorAll("a");

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu();
            });
        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Close menu when clicking outside the navbar
        document.addEventListener("click", function (event) {
            const clickedInsideNav = primaryNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                closeMenu();
            }
        });

        // Close menu when switching to desktop layout
        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });

    }


    // ---------- 4. BACK TO TOP ----------

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // ---------- 5. SMOOTH SCROLL FOR PAGE LINKS ----------

    const pageLinks = document.querySelectorAll(
        'a[href^="#"]:not(#backToTop)'
    );

    pageLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // ---------- 6. IMAGE FALLBACK ----------

    const images = document.querySelectorAll("img");

    images.forEach(function (img) {
        img.addEventListener("error", function () {

            // Prevent repeated error handling
            if (img.dataset.fallbackApplied === "true") {
                return;
            }

            img.dataset.fallbackApplied = "true";

            // Hide an image if its URL cannot load
            img.style.display = "none";
        });
    });


    // ---------- 7. ACTIVE NAVIGATION ----------

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const allNavLinks = document.querySelectorAll(
        "#primaryNav a[href]"
    );

    allNavLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        if (linkPage && linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });


    // ---------- 8. READY MESSAGE ----------

    console.log("Company page JavaScript loaded successfully.");

});
/* HIRE4EVENT - CONTACT PAGE JAVASCRIPT
   File: contact.js */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // 
    // 1. MOBILE NAVBAR TOGGLE
    // 

    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function openMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener("click", function () {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu after clicking a navigation link
        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Close menu using Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Close menu when clicking outside it
        document.addEventListener("click", function (event) {
            const clickedInsideNav = primaryNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                closeMenu();
            }
        });

        // Close mobile menu on desktop screen
        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }

    // 
    // 2. FOOTER CURRENT YEAR
    // 

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 
    // 3. BACK TO TOP BUTTON
    // 

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 
    // 4. SMOOTH SCROLL FOR PAGE LINKS
    //

    document
        .querySelectorAll('a[href^="#"]:not(#backToTop)')
        .forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    event.preventDefault();

                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });

    // 
    // 5. CONTACT FORM
    // 

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("contactFormStatus");

    /*
       IMPORTANT:
       Replace this placeholder with your real business email.
       Example: const businessEmail = "hello@yourwebsite.com";
    */

    const businessEmail = "YOUR_EMAIL@example.com";

    function showFormStatus(message, type) {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.classList.remove("success", "error");

        if (type) {
            formStatus.classList.add(type);
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Check required fields
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();

                showFormStatus(
                    "Please complete all required fields correctly.",
                    "error"
                );

                return;
            }

            // Read form values
            const name = document
                .getElementById("contactName").value.trim();

            const email = document
                .getElementById("contactEmail").value.trim();

            const phone = document
                .getElementById("contactPhone").value.trim();

            const subject = document
                .getElementById("contactSubject").value;

            const eventDate = document
                .getElementById("contactEventDate").value;

            const message = document
                .getElementById("contactMessage").value.trim();

            const consent = document
                .getElementById("contactConsent");

            // Extra validation
            if (!name || !email || !subject || !message) {
                showFormStatus(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }

            if (consent && !consent.checked) {
                showFormStatus(
                    "Please confirm your consent before continuing.",
                    "error"
                );

                return;
            }

            // Prevent placeholder email from being used
            if (
                !businessEmail ||
                businessEmail === "YOUR_EMAIL@example.com" ||
                !businessEmail.includes("@")
            ) {
                showFormStatus(
                    "Your form is ready, but the business email is not configured yet. Replace YOUR_EMAIL@example.com in contact.js with your real email address.",
                    "error"
                );

                return;
            }

            // Prepare email content
            const emailSubject =
                "Website Enquiry: " + subject;

            const emailBody = [
                "New enquiry from the Hire4Event website",
                "",
                "Name: " + name,
                "Email: " + email,
                "Phone: " + (phone || "Not provided"),
                "Enquiry Type: " + subject,
                "Event Date: " + (eventDate || "Not decided"),
                "",
                "Message:",
                message
            ].join("\n");

            // Open the visitor's default email application
            const mailtoUrl =
                "mailto:" + businessEmail +
                "?subject=" + encodeURIComponent(emailSubject) +
                "&body=" + encodeURIComponent(emailBody);

            showFormStatus(
                "Your email draft is being prepared. Send it from your email app to complete your enquiry.",
                "success"
            );

            window.location.href = mailtoUrl;
        });
    }

    // 
    // 6. CONTACT PHONE INPUT
    // 

    const phoneInput = document.getElementById("contactPhone");

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            // Allow numbers, spaces, +, -, and parentheses
            phoneInput.value = phoneInput.value.replace(
                /[^0-9+\-()\s]/g,
                ""
            );
        });
    }

    // 
    // 7. EVENT DATE MINIMUM
    // Prevent selecting a past event date
    // 

    const eventDateInput =
        document.getElementById("contactEventDate");

    if (eventDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        eventDateInput.min = year + "-" + month + "-" + day;
    }

    //
    // 8. ACTIVE NAVIGATION LINK
    //

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    // 
    // 9. IMAGE FALLBACK
    // Hide images that fail to load
    //

    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            image.style.display = "none";
        });
    });
// 
// CONTACT PAGE INITIALIZED
// 

    console.log("Hire4Event Contact Page loaded successfully.");

});
/* HIRE4EVENT - PLAN YOUR EVENT
   File: plan-your-event.js*/

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // 
    // 1. MOBILE NAVBAR
    // 

    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function openMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    }

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu after clicking a navigation link
        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Close menu using Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {
            const clickedToggle = menuToggle.contains(event.target);
            const clickedNav = primaryNav.contains(event.target);

            if (!clickedToggle && !clickedNav) {
                closeMenu();
            }
        });

        // Close mobile navigation on desktop
        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }

    // 
    // 2. CURRENT YEAR
    // 

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 
    // 3. BACK TO TOP
    // 

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 
    // 4. SMOOTH SCROLL FOR INTERNAL LINKS
    // 

    document
        .querySelectorAll('a[href^="#"]:not(#backToTop)')
        .forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                const target = document.querySelector(targetId);

                if (target) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });

    // 
    // 5. EVENT FORM ELEMENTS
    // 

    const eventForm =
        document.getElementById("eventPlannerForm");

    const eventFormStatus =
        document.getElementById("eventFormStatus");

    const eventType =
        document.getElementById("eventType");

    const eventDate =
        document.getElementById("eventDate");

    function showStatus(message, type) {
        if (!eventFormStatus) return;

        eventFormStatus.textContent = message;

        eventFormStatus.classList.remove(
            "success",
            "error"
        );

        if (type) {
            eventFormStatus.classList.add(type);
        }
    }

    //
    // 6. PREVENT PAST EVENT DATES
    //

    function getLocalDateString() {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    if (eventDate) {
        eventDate.min = getLocalDateString();
    }

    // 
    // 7. EVENT CATEGORY CARDS
    //

    const eventCategoryCards =
        document.querySelectorAll("[data-event-type]");

    eventCategoryCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const selectedType =
                card.getAttribute("data-event-type");

            if (eventType && selectedType) {
                eventType.value = selectedType;
            }
        });
    });

    //
    // 8. PHONE NUMBER INPUT
    // 

    const customerPhone =
        document.getElementById("customerPhone");

    if (customerPhone) {
        customerPhone.addEventListener("input", function () {
            customerPhone.value = customerPhone.value.replace(
                /[^0-9+\-()\s]/g,
                ""
            );
        });
    }

    //
    // 9. CONTACT EMAIL CONFIGURATION
    // 

    /*
       IMPORTANT:
       Replace this placeholder with your real business email.

       Example:
       const businessEmail = "hello@yourcompany.com";

       The email address here is the RECEIVER'S email.
       The visitor's email is collected separately in the form.
    */

    const businessEmail = "YOUR_EMAIL@example.com";

    // 
    // 10. FORM SUBMISSION
    // 

    if (eventForm) {
        eventForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Browser's required-field and email validation
            if (!eventForm.checkValidity()) {
                eventForm.reportValidity();

                showStatus(
                    "Please complete all required fields correctly.",
                    "error"
                );

                return;
            }

            // Read form values
            const formData = new FormData(eventForm);

            const eventName =
                (formData.get("eventName") || "").toString().trim();

            const selectedEventType =
                (formData.get("eventType") || "").toString().trim();

            const selectedEventDate =
                (formData.get("eventDate") || "").toString().trim();

            const city =
                (formData.get("eventCity") || "").toString().trim();

            const guestCount =
                (formData.get("guestCount") || "").toString().trim();

            const budget =
                (formData.get("eventBudget") || "").toString().trim();

            const venue =
                (formData.get("eventVenue") || "Not specified")
                    .toString().trim();

            const services =
                (formData.get("eventServices") || "Not specified")
                    .toString().trim();

            const details =
                (formData.get("eventDetails") || "None provided")
                    .toString().trim();

            const customerName =
                (formData.get("customerName") || "").toString().trim();

            const customerPhoneValue =
                (formData.get("customerPhone") || "").toString().trim();

            const customerEmail =
                (formData.get("customerEmail") || "").toString().trim();

            const consent =
                document.getElementById("eventConsent");

            // Check required information
            if (
                !selectedEventType ||
                !selectedEventDate ||
                !city ||
                !guestCount ||
                !budget ||
                !customerName ||
                !customerPhoneValue ||
                !customerEmail
            ) {
                showStatus(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }

            // Validate phone number length
            const digitsOnly =
                customerPhoneValue.replace(/\D/g, "");

            if (digitsOnly.length < 7 || digitsOnly.length > 15) {
                showStatus(
                    "Please enter a valid phone number.",
                    "error"
                );

                if (customerPhone) {
                    customerPhone.focus();
                }

                return;
            }

            // Validate event date
            if (selectedEventDate < getLocalDateString()) {
                showStatus(
                    "Please select today or a future date for your event.",
                    "error"
                );

                if (eventDate) {
                    eventDate.focus();
                }

                return;
            }

            // Validate consent
            if (!consent || !consent.checked) {
                showStatus(
                    "Please agree before preparing your event brief.",
                    "error"
                );

                return;
            }

            // Check business email configuration
            if (
                !businessEmail ||
                businessEmail === "YOUR_EMAIL@example.com" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)
            ) {
                showStatus(
                    "Your event details are filled in, but the business email is not configured. Replace YOUR_EMAIL@example.com in plan-your-event.js with your real email address.",
                    "error"
                );

                return;
            }

            // Prepare email subject
            const emailSubject =
                "New Event Enquiry - " +
                selectedEventType +
                (eventName ? " - " + eventName : "");

            // Prepare event brief
            const emailBody = [
                "HIRE4EVENT - NEW EVENT ENQUIRY",
                "---",
                "",
                "EVENT DETAILS",
                "--------------",
                "Event Type: " + selectedEventType,
                "Event Name: " + (eventName || "Not provided"),
                "Event Date: " + selectedEventDate,
                "Event City: " + city,
                "Expected Guests: " + guestCount,
                "Estimated Budget: " + budget,
                "Venue Preference: " + venue,
                "Services Required: " + services,
                "",
                "ADDITIONAL REQUIREMENTS",
                "-----------------------",
                details,
                "",
                "CONTACT DETAILS",
                "----------------",
                "Name: " + customerName,
                "Phone: " + customerPhoneValue,
                "Email: " + customerEmail,
                "",
                "This enquiry was prepared using the website form."
            ].join("\n");

            // Build email draft URL
            const mailtoUrl =
                "mailto:" + businessEmail +
                "?subject=" + encodeURIComponent(emailSubject) +
                "&body=" + encodeURIComponent(emailBody);

            showStatus(
                "Your event brief is ready. Your email app should open with the details. Please send the email from that app to complete your enquiry.",
                "success"
            );

            // Open the visitor's default email application
            window.location.href = mailtoUrl;
        });
    }

    // 
    // 11. ACTIVE NAVIGATION LINK
    // 

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    // 
    // 12. IMAGE ERROR HANDLING
    // 

    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("error", function () {
            img.style.display = "none";
        });
    });

    // 
    // 13. PAGE INITIALIZED
    // 

    console.log(
        "Hire4Event Plan Your Event page loaded successfully."
    );

});
//  HIRE4EVENT - ABOUT PAGE JAVASCRIPT
   File: about.js

document.addEventListener("DOMContentLoaded", function () {
// 1. MOBILE NAVBAR

    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    function openMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        menuToggle.textContent = "✕";
    }

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;

        primaryNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && primaryNav) {

        menuToggle.addEventListener("click", function () {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        /* Close menu after clicking a navigation link */
        primaryNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        /* Close menu with Escape key */
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        /* Close menu when clicking outside */
        document.addEventListener("click", function (event) {
            const clickedInsideNav = primaryNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                closeMenu();
            }
        });

        /* Close mobile menu when returning to desktop */
        window.addEventListener("resize", function () {
            if (window.innerWidth > 800) {
                closeMenu();
            }
        });

    }

// 2. FOOTER CURRENT YEAR

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

// 3. BACK TO TOP

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        backToTop.addEventListener("click", function (event) {
            const href = backToTop.getAttribute("href");

            if (href === "#top") {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth"
                });
            }
        });
    }

//  4. ACTIVE NAVIGATION LINK

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (primaryNav) {
        primaryNav.querySelectorAll("a").forEach(function (link) {
            const linkPage = new URL(
                link.href,
                window.location.href
            ).pathname.split("/").pop().toLowerCase();

            if (linkPage === currentPage && linkPage !== "") {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        });
    }
//  5. SMOOTH INTERNAL ANCHOR LINKS

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });


//    6. ABOUT PAGE IMAGE FALLBACK

    const aboutImages = document.querySelectorAll(".about-image img");

    aboutImages.forEach(function (img) {
        img.addEventListener("error", function () {
            img.style.display = "none";
        });
    });

// 7. INITIALIZATION MESSAGE

    console.log("Hire4Event About page initialized successfully.");

});