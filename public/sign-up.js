function togglePwBox() {
    let pwBox = document.querySelector(".create-pw-box") || document.querySelector(".create-pw-box-unhide");
    if (pwBox) {
        pwBox.classList.toggle("create-pw-box");
        pwBox.classList.toggle("create-pw-box-unhide");
    }
};

function toggleRePwBox() {
    let pwBox = document.querySelector(".re-pw-box") || document.querySelector(".re-pw-box-unhide");
    if (pwBox) {
        pwBox.classList.toggle("re-pw-box");
        pwBox.classList.toggle("re-pw-box-unhide");
    }
};

const passwordFieldInput = document.querySelector('input[id="pwd"]');
const rePasswordFieldInput = document.querySelector('input[id="pwd-reconfirm"]');

passwordFieldInput.addEventListener("focus", togglePwBox);
passwordFieldInput.addEventListener("blur", togglePwBox);

rePasswordFieldInput.addEventListener("focus", toggleRePwBox);
rePasswordFieldInput.addEventListener("blur", toggleRePwBox);

function hasUppercase(str) {
    return /[A-Z]/.test(str);
}

function hasLowercase(str) {
    return /[a-z]/.test(str);
}

function hasDigit(str) {
    return /\d/.test(str);
}

function hasSymbol(str) {
    const regex = /[!@#$%^&*(),.?":{}|<>]/;
    return regex.test(str);
}

function hasMinLength(str, length = 8) {
    return str.length >= length;
}

function updatePasswordCriteria(password) {
    const checks = document.querySelectorAll(".material-symbols-outlined");

    document.querySelector('.uppercase-check').classList.toggle('is-green', hasUppercase(password));
    document.querySelector('.lowercase-check').classList.toggle('is-green', hasLowercase(password));
    document.querySelector('.number-check').classList.toggle('is-green', hasDigit(password));
    document.querySelector('.symbol-check').classList.toggle('is-green', hasSymbol(password));
    document.querySelector('.character-check').classList.toggle('is-green', hasMinLength(password));
}

passwordFieldInput.addEventListener('input', function(event) {
    const password = event.target.value;
    updatePasswordCriteria(password);
    if(rePasswordFieldInput.value) { // Only check matching if the confirmation field is not empty
        updateMatchCheck(password, rePasswordFieldInput.value);
    }
});

rePasswordFieldInput.addEventListener('input', function() {
    updateMatchCheck(passwordFieldInput.value, rePasswordFieldInput.value);
});

function updateMatchCheck(password, confirmation) {
    const matchCheckIcon = document.querySelector('.match-check');
    matchCheckIcon.classList.toggle('is-green', password === confirmation);
}

function areAllChecksGreen() {
    const checkIcons = document.querySelectorAll('.material-symbols-outlined');
    return Array.from(checkIcons).every(icon => icon.classList.contains('is-green'));
}

const observer = new MutationObserver((mutationsList) => {
    for(let mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
            if (areAllChecksGreen()) {
                document.getElementById("sign-up-btn").disabled = false;
            } else {
                document.getElementById("sign-up-btn").disabled = true;
            }
        }
    }
});

const checkIcons = document.querySelectorAll('.material-symbols-outlined');
checkIcons.forEach(icon => observer.observe(icon, { attributes: true, attributeFilter: ['class'] }));

document.querySelector('form[name="createAccount"]').addEventListener('submit', function(e) {
    e.preventDefault();  // This stops the form from submitting the traditional way
    
    const formData = new FormData(e.target); // This gathers the form data

    fetch('/user-signup', {   // This sends the data to the server
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: new URLSearchParams(formData).toString(),
    })
    
    .then(response => response.text()) // Convert the response to text in any case
    .then(message => {
        if (message === "User created successfully") { // Check for success message from the server
            window.location.href = '/user-login'; // Redirect based on the success message
        } else if (message === "Email already exists") {
            const statusMessageBox = document.querySelector('.status-message-box');
            statusMessageBox.classList.add('status-message-box-unhide');
        }
    })
    .catch(error => console.error('Fetch error: ', error));
});