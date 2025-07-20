import { encrypt } from "./encrypt.js";
import { getFormattedTime } from "./utils.js";

/**
 * Sleep function to simulate a delay.
 * Returns a Promise that resolves after the specified milliseconds.
 * Used here to mimic waiting (for example, to show a loading spinner or for testing).
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for the HTML page (DOM) to be fully loaded before running the script
// This ensures all elements are available for selection and manipulation

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const time = getFormattedTime();
        const formData = new FormData(this);
        const password = formData.get('password');
        // 保留原有加密逻辑
        const encryptedPassword = encrypt(password, time);
        formData.set('password', encryptedPassword);
        formData.set('time', time);
        try {
            const response = await fetch('https://api.guitar-guide.org/phps/login.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorDiv.textContent = data.error;
                errorDiv.classList.add('show');
            }
        } catch (error) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.classList.add('show');
        }
    });
});