

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', function() {
    // Select the button by its ID and add a click event listener
    document.getElementById('next-button').addEventListener('click', function() {
        // Call the nextStep function with the value 2 when the button is clicked
        nextStep(2);
    });

    // For onboarding-2 form
    document.getElementById('next-button-2').addEventListener('click', function() {
        nextStep(3);  // Call nextStep with value 3 for onboarding-2 form
    });
    document.getElementById('previous-button').addEventListener('click', function() {
        previousStep(1);  // Call previousStep with value 1 for onboarding-2 form
    });

    // For onboarding-3 form
    document.getElementById('submit-button').addEventListener('click', function() {
        submitForm();  // Call submitForm for onboarding-3 form
    });
    document.getElementById('previous-button-2').addEventListener('click', function() {
        previousStep(2);  // Call previousStep with value 2 for onboarding-3 form
    });
});


function saveToLocalStorage(step, data) {
    localStorage.setItem(`onboardingStep${step}`, JSON.stringify(data));
}

function getFromLocalStorage(step) {
    return JSON.parse(localStorage.getItem(`onboardingStep${step}`) || '{}');
}

function nextStep(step) {
    const currentStep = step - 1;
    const formElement = document.getElementById(`step${currentStep}`);
    const formData = new FormData(formElement);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    saveToLocalStorage(currentStep, data);
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    const nextStepElement = document.getElementById(`step${step}`);    
    nextStepElement.style.display = 'block';
}

function previousStep(step) {
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(`step${step}`).style.display = 'block';
}

function submitForm() {
    // gather data from all steps and send to the server
    const data = {};
    for (let i = 1; i <= 3; i++) {
        Object.assign(data, getFromLocalStorage(i));
    }
    // Make a POST request to your server here
    // For example, using fetch:
    fetch('/onboarding', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // Include other headers as needed, like CSRF tokens or authentication headers
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP erro
            r! Status: ${response.status}`);
        }
        return response.text(); // or response.json() if the response is in JSON format
    })
    .then(data => {
        // Handle the data from the response
    })
    .catch(error => {
        console.error('Fetch error:', error); // Log any error that occurs during the fetch
    });
}