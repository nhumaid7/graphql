// Get the elements we need from the page
const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// Listen for the form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear any previous error message
    errorMessage.textContent = "";

    // Read the user's input
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Create the Basic Authentication string
    const authString = btoa(`${username}:${password}`);

    try {
        // Send the login request
        const response = await fetch(
            "https://learn.reboot01.com/api/auth/signin",
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${authString}`,
                },
            }
        );

        // Login failed
        if (!response.ok) {
            throw new Error("Invalid username/email or password.");
        }

        // Get the JWT returned by the server
        const token = await response.json();

        // Save the JWT
        localStorage.setItem("token", token);

        // Redirect to the profile page
        window.location.href = "profile.html";

    } catch (error) {
        console.error(error);
        errorMessage.textContent = error.message;
    }
});