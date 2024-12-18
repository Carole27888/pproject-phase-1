const BASE_URL = "http://localhost:4000"; // JSON Server URL
let selectedRole = null; // Track selected role (admin/user)

// Splash Screen Logic
document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById("splashScreen");
    const mainContent = document.getElementById("mainContent");

    setTimeout(() => {
        splashScreen.style.display = "none";
        mainContent.style.display = "block";
    }, 5000);
});

// Role Selection
function selectRole(role) {
    selectedRole = role; // Set the selected role
    document.getElementById("roleSelection").style.display = "none";
    document.getElementById("loginForm").style.display = "block";

    // Update login form heading based on role
    document.getElementById("loginRole").textContent = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`;
}

// Login Functionality
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Fetch user credentials from db.json
        const response = await fetch(`${BASE_URL}/users?email=${email}&password=${password}&role=${selectedRole}`);
        const users = await response.json();

        if (users.length > 0) {
            alert(`Welcome, ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}!`);

            // Redirect to appropriate dashboard
            if (selectedRole === "admin") {
                window.location.href = "admin.html"; // Redirect to admin dashboard
            } else if (selectedRole === "user") {
                window.location.href = "user.html"; // Redirect to user dashboard
            }
        } else {
            alert("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Something went wrong. Please try again.");
    }
}
