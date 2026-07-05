document.addEventListener("DOMContentLoaded", () => {
    const savedProjectsKey = "vnck_added_projects";
    const adminSessionKey = "vnck_admin_logged_in";

    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const menuIcon = mobileBtn.querySelector("i");

    const adminLoginCard = document.getElementById("admin-login-card");
    const adminPanel = document.getElementById("admin-panel");
    const adminLoginForm = document.getElementById("admin-login-form");
    const projectForm = document.getElementById("project-form");
    const logoutBtn = document.getElementById("admin-logout-btn");
    const toastContainer = document.getElementById("toast-container");

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function loadAddedProjects() {
        try {
            return JSON.parse(localStorage.getItem(savedProjectsKey)) || [];
        } catch (error) {
            return [];
        }
    }

    function saveAddedProjects(projects) {
        localStorage.setItem(savedProjectsKey, JSON.stringify(projects));
    }

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type === "error" ? "toast-error-border" : ""}`;

        const iconClass = type === "success" ? "fa-circle-check toast-success" : "fa-circle-exclamation toast-error";

        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon"></i>
            <span class="toast-message">${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    function toggleMenu() {
        mobileMenu.classList.toggle("hidden");
        menuIcon.className = mobileMenu.classList.contains("hidden") ? "fa-solid fa-bars" : "fa-solid fa-xmark";
    }

    function setAdminState(isLoggedIn) {
        localStorage.setItem(adminSessionKey, isLoggedIn ? "true" : "false");
        adminLoginCard.classList.toggle("hidden", isLoggedIn);
        adminPanel.classList.toggle("hidden", !isLoggedIn);
    }

    mobileBtn.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (!mobileMenu.classList.contains("hidden")) {
                toggleMenu();
            }
        });
    });

    adminLoginForm.addEventListener("submit", event => {
        event.preventDefault();

        const username = document.getElementById("admin-username").value.trim();
        const password = document.getElementById("admin-password").value.trim();

        if (username === "admin" && password === "admin") {
            setAdminState(true);
            adminLoginForm.reset();
            showToast("Admin login successful.");
        } else {
            showToast("Invalid username or password.", "error");
        }
    });

    logoutBtn.addEventListener("click", () => {
        setAdminState(false);
        showToast("Admin logged out.");
    });

    projectForm.addEventListener("submit", event => {
        event.preventDefault();

        const addedProjects = loadAddedProjects();
        const techValue = document.getElementById("project-tech").value;
        const newProject = {
            id: Date.now(),
            title: document.getElementById("project-title").value.trim(),
            category: document.getElementById("project-category").value,
            image: document.getElementById("project-image").value.trim(),
            tech: techValue.split(",").map(item => item.trim()).filter(Boolean),
            desc: document.getElementById("project-desc").value.trim(),
            difficulty: document.getElementById("project-difficulty").value.trim(),
            duration: document.getElementById("project-duration").value.trim()
        };

        addedProjects.push(newProject);
        saveAddedProjects(addedProjects);
        projectForm.reset();
        showToast("Project added successfully. Open the website to view it.");
    });

    const nav = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            nav.style.boxShadow = "var(--shadow-md)";
            nav.style.background = "rgba(255, 255, 255, 0.96)";
        } else {
            nav.style.boxShadow = "none";
            nav.style.background = "rgba(255, 255, 255, 0.9)";
        }
    });

    setAdminState(localStorage.getItem(adminSessionKey) === "true");

});
