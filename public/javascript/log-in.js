document.addEventListener('DOMContentLoaded', function() {
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

    emailInput.addEventListener('input', checkFields);
    passwordInput.addEventListener('input', checkFields);
});

document.querySelector('form[name="userLogIn"]').addEventListener('submit', function(e) {
    e.preventDefault();  // This stops the form from submitting the traditional way
    hideErrorMessages();
    const formData = new FormData(e.target); // This gathers the form data

    fetch('/user-login', {   // This sends the data to the server
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: new URLSearchParams(formData).toString(),
    }).then(response => response.text()).then(message => {
        if (message === "Invalid credentials") {
            const statusMessageBox = document.querySelectorAll('.status-message-box')[1];
            statusMessageBox.classList.add('status-message-box-unhide');
        } else if (message === "User not found") {
            const statusMessageBox = document.querySelectorAll('.status-message-box')[0];
            statusMessageBox.classList.add('status-message-box-unhide');
        } else {
            // Handle successful registration here
            alert("User signed in successfully!");
        }
    });
});

function hideErrorMessages() {
    const statusMessageBoxes = document.querySelectorAll('.status-message-box-unhide');
    statusMessageBoxes.forEach(box => {
        box.classList.remove('status-message-box-unhide');
    });
}