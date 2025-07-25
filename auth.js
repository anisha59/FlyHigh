document.addEventListener("DOMContentLoaded", () => {
  // Inject login modal
  fetch("login.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("loginContainer").innerHTML = html;
      requestAnimationFrame(attachAuthHandlers);
    });

  // Show user avatar if logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    const username = localStorage.getItem("username") || "U";
    const firstLetter = username.charAt(0).toUpperCase();

    const userIconContainer = document.getElementById("userIconContainer");
    if (userIconContainer) {
      userIconContainer.innerHTML = `
        <div id="openAuthModal" class="avatar-circle">${firstLetter}</div>
      `;
    }

    loadSidebar(); // Also load profile sidebar
  }

  // Toggle sidebar or open login modal
  document.addEventListener("click", (e) => {
    if (e.target.id === "openAuthModal") {
      if (localStorage.getItem("isLoggedIn") === "true") {
        const sidebar = document.getElementById("profileSidebar");
        if (sidebar) sidebar.classList.toggle("show");
      } else {
        document.getElementById("authModal")?.classList.add("show");
      }
    }
  });
});

// Save clicked URL and redirect after login
function bookIfLoggedIn(url) {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = url;
  } else {
    localStorage.setItem("pendingRedirect", url);
    document.getElementById("authModal")?.classList.add("show");
  }
}

function attachAuthHandlers() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();

    const userMap = JSON.parse(localStorage.getItem("userMap") || "{}");

    // ❌ Block login if user not registered (i.e., didn't sign up)
    if (!userMap[email]) {
      alert("You must sign up before logging in.");
      return;
    }

    const username = userMap[email];

    // ✅ Proceed with login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("userEmail", email);

    document.getElementById("authModal")?.classList.remove("show");
    showWelcome(username);
    loadSidebar();
    redirectIfPending();
  });
}

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const pass = document.getElementById("signupPassword").value;
      const confirm = document.getElementById("signupConfirm").value;

      if (!name) return alert("Please enter name.");
      if (pass !== confirm) return alert("Passwords do not match!");

      const email = `${name.toLowerCase()}@example.com`;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", name);
      localStorage.setItem("userEmail", email);
      updateUserIcon();

      const userMap = JSON.parse(localStorage.getItem("userMap") || "{}");
      userMap[email] = name;
      localStorage.setItem("userMap", JSON.stringify(userMap));

      document.getElementById("authModal")?.classList.remove("show");
      showWelcome(name);
      loadSidebar();
      redirectIfPending();
    });
  }
}

// Redirect user if they clicked before login
function redirectIfPending() {
  const url = localStorage.getItem("pendingRedirect");
  if (url) {
    localStorage.removeItem("pendingRedirect");
    window.location.href = url;
  }
}

// Switch Forms
function switchToSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("modalTitle").innerText = "Create Account";
  document.getElementById("modalSubtitle").innerText = "Join us and start your adventure";
  document.getElementById("modalIcon").className = "fas fa-user-plus";
}

function switchToLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("modalTitle").innerText = "Welcome Back";
  document.getElementById("modalSubtitle").innerText = "Please log in to continue";
  document.getElementById("modalIcon").className = "fas fa-user";
}

// Load Sidebar
function loadSidebar() {
  fetch("profileSidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebarContainer").innerHTML = html;

      const sidebarScript = document.createElement("script");
      sidebarScript.src = "profileSidebar.js";
      sidebarScript.onload = () => {
        if (typeof initializeProfileSidebar === "function") {
          initializeProfileSidebar(); // ✅ Ensures logic is attached
        }
      };
      document.body.appendChild(sidebarScript);
    });
}

// Welcome Message
function showWelcome(name) {
  const interval = setInterval(() => {
    const el = document.getElementById("welcomeMessage");
    if (el) {
      clearInterval(interval);
      el.innerText = `👋 Welcome, ${name}!`;
      el.style.display = "block";
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.top = "20px";
      }, 50);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.top = "10px";
      }, 3000);
    }
  }, 50);
}
function updateUserIcon() {
  const username = localStorage.getItem("username") || "U";
  const firstLetter = username.charAt(0).toUpperCase();

  const userIconContainer = document.getElementById("userIconContainer");
  if (userIconContainer) {
    userIconContainer.innerHTML = `
      <div id="openAuthModal" class="avatar-circle">${firstLetter}</div>
    `;
  }

  loadSidebar(); // Make sure profile sidebar also loads
}

