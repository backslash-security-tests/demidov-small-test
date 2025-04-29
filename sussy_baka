// Vulnerable to DOM-based XSS through URL fragment injection
function displayWelcomeMessage() {
  const fragment = window.location.hash.substring(1);
  const message = decodeURIComponent(fragment.split('=')[1] || '');
  document.getElementById('welcome').innerHTML = message; // Unsafe DOM manipulation
}

// Vulnerable to JS Injection via eval()
function processUserInput() {
  const userData = document.getElementById('user-input').value;
  eval('var processed = ' + userData); // Dangerous eval usage
  console.log(processed);
}

// Vulnerable to JSON Injection
function sendToServer() {
  const userInput = document.getElementById('json-input').value;
  const data = `{"userControlled": "${userInput}"}`; // Unsafe string concatenation
  fetch('/api', {
    method: 'POST',
    body: data
  });
}

// Execute on page load
window.onload = function() {
  displayWelcomeMessage();
  document.getElementById('submit').addEventListener('click', processUserInput);
  document.getElementById('send').addEventListener('click', sendToServer);
};
