//load directly since log-in.ejs is a module
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('pwd');
const loginButton = document.getElementById('log-in-btn');

function checkFields() {
    if (emailInput.value.trim() && passwordInput.value.trim()) {
        loginButton.removeAttribute('disabled');
    } else {
        loginButton.setAttribute('disabled', true);
    }
}

if (emailInput && passwordInput) {
    emailInput.addEventListener('input', checkFields);
    passwordInput.addEventListener('input', checkFields);
}

document.querySelector('form[name="userLogIn"]').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(e.target);
    fetch('/user-login', {
        method: 'POST',
        body: new URLSearchParams(formData).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed.');
        }
        window.location.href = response.url; // Redirect based on the server's response
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



function hideErrorMessages() {
    const statusMessageBoxes = document.querySelectorAll('.status-message-box-unhide');
    statusMessageBoxes.forEach(box => {
        box.classList.remove('status-message-box-unhide');
    });
}