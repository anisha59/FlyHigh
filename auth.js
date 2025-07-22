document.addEventListener("DOMContentLoaded", () => {
  // Inject login modal
  fetch("login.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("loginContainer").innerHTML = html;
      setTimeout(attachAuthHandlers, 200);
    });

  // Load sidebar if already logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    loadSidebar();
  }

  // Handle user icon click
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

function attachAuthHandlers() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // ✅ LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();

      const userMap = JSON.parse(localStorage.getItem("userMap") || "{}");
      const username = userMap[email] || email.split("@")[0];  // ✅ Use saved name if available

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("userEmail", email);

      document.getElementById("authModal")?.classList.remove("show");
      showWelcome(username);
      loadSidebar();
    });
  }

  // ✅ SIGNUP
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

      // ✅ Save name in userMap
      const userMap = JSON.parse(localStorage.getItem("userMap") || "{}");
      userMap[email] = name;
      localStorage.setItem("userMap", JSON.stringify(userMap));

      document.getElementById("authModal")?.classList.remove("show");
      showWelcome(name);
      loadSidebar();
    });
  }
}

// ✅ Switch Functions
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

// ✅ Load Sidebar
function loadSidebar() {
  fetch("profileSidebar.html")
    .then(res => res.text())
    .then(html => {
      // Inject the sidebar HTML
      document.getElementById("sidebarContainer").innerHTML = html;

      // Remove previous sidebar script if it exists
      const existingScript = document.getElementById("sidebarScript");
      if (existingScript) existingScript.remove();

      // Dynamically load profileSidebar.js
      const script = document.createElement("script");
      script.id = "sidebarScript";
      script.src = "profileSidebar.js";
      script.onload = () => {
        if (typeof initializeProfileSidebar === "function") {
          initializeProfileSidebar(); // 🚀 RUN the sidebar logic
        }
      };
      document.body.appendChild(script);

      // Change user icon to profile icon
      const iconContainer = document.getElementById("userIconContainer");
      if (iconContainer) {
        iconContainer.innerHTML = `
          <i class="fas fa-circle-user" id="openAuthModal" title="${localStorage.getItem("username")}" style="font-size: 20px;"></i>
        `;
      }
    });
}

// ✅ Welcome Message
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
// ✅ Google Login
window.onload = function () {
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleLogin
      });

      google.accounts.id.prompt(); // Show the Google login prompt
    });
  }
};

window.onload = function () {
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleLogin
      });

      google.accounts.id.prompt(); // 🔄 Launches Google sign-in popup
    });
  }
};

function handleGoogleLogin(response) {
  const jwt = response.credential;
  const base64Url = jwt.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(decodeURIComponent(escape(atob(base64))));

  const name = payload.name || payload.given_name || "User";
  const email = payload.email || "";

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", name);
  localStorage.setItem("userEmail", email);

  const userMap = JSON.parse(localStorage.getItem("userMap") || "{}");
  userMap[email] = name;
  localStorage.setItem("userMap", JSON.stringify(userMap));

  document.getElementById("authModal")?.classList.remove("show");
  showWelcome(name);
  loadSidebar();
}
