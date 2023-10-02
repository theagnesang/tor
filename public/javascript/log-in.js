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
        redirect: 'follow' // Add this line to follow redirects
    }).then(response => {
        if(response.ok) { // Check if response status is 200-299
            if(response.url.endsWith('/feed')) {
                window.location.href = response.url;
            }
        } else {
            return response.text(); // Parse the plain text error message
        }
    }).then(message => {
        if (message) { // Ensure that there is a message before processing it
            if (message === "Invalid credentials") {
                const statusMessageBox = document.querySelectorAll('.status-message-box')[1];
                statusMessageBox.classList.add('status-message-box-unhide');
            } else if (message === "User not found") {
                const statusMessageBox = document.querySelectorAll('.status-message-box')[0];
                statusMessageBox.classList.add('status-message-box-unhide');
            } else {
                console.log("Unexpected message:", message);
                alert("Something else happened: " + message);
            }
        }
    })
    .catch(error => console.error('Fetch error: ', error));
});

function hideErrorMessages() {
    const statusMessageBoxes = document.querySelectorAll('.status-message-box-unhide');
    statusMessageBoxes.forEach(box => {
        box.classList.remove('status-message-box-unhide');
    });
}