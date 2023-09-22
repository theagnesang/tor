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

    checks[0].classList.toggle('green', hasUppercase(password));
    checks[1].classList.toggle('green', hasLowercase(password));
    checks[2].classList.toggle('green', hasDigit(password));
    checks[3].classList.toggle('green', hasSymbol(password));
    checks[4].classList.toggle('green', hasMinLength(password));
}

passwordFieldInput.addEventListener('input', function(event) {
    const password = event.target.value;
    updatePasswordCriteria(password);
});

rePasswordFieldInput.addEventListener('input', function() {
    if (passwordFieldInput.value === rePasswordFieldInput.value) {
        document.querySelectorAll(".material-symbols-outlined")[5].classList.toggle('green');
    }
});

const observer = new MutationObserver((mutationsList) => {
    for(let mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.classList.contains('material-symbols-outlined')) {
                if (areAllChecksGreen()) {
                    document.getElementById("sign-up-btn").disabled = false;
                } else {
                    document.getElementById("sign-up-btn").disabled = true;
                }
            }
        }
    }
});

function areAllChecksGreen() {
    const checkIcons = document.querySelectorAll('.material-symbols-outlined');

    for (let icon of checkIcons) {
        if (!icon.classList.contains('green')) {
            return false;
        }
    }
    return true;
};

const checkIcons = document.querySelectorAll('.material-symbols-outlined');
checkIcons.forEach(icon => {
    observer.observe(icon, { attributes: true, attributeFilter: ['class'] });
});

document.querySelector('form[name="createAccount"]').addEventListener('submit', function(e) {
    e.preventDefault();  // This stops the form from submitting the traditional way
    
    const formData = new FormData(e.target); // This gathers the form data

    fetch('/user-signup', {   // This sends the data to the server
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: new URLSearchParams(formData).toString(),
    }).then(response => response.text()).then(message => {
        if (message === "Email already exists") {
            const statusMessageBox = document.querySelector('.status-message-box');
            statusMessageBox.classList.add('status-message-box-unhide');
        } else {
            // Handle successful registration here
            alert("User registered successfully!");
        }
    });
});