document.querySelector('#login form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#login .input-field[type="text"]').value;
    const password = document.querySelector('#login .input-field[type="password"]').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Logged in, token:', data.token);
    } else {
        console.error('Login failed');
    }
});

document.querySelector('#register form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.querySelector('#register .input-field[placeholder="User ID"]').value;
    const email = document.querySelector('#register .input-field[placeholder="Email ID"]').value;
    const password = document.querySelector('#register .input-field[placeholder="Enter password"]').value;
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, password })
    });
    if (response.ok) {
        console.log('Registered successfully');
    } else {
        console.error('Registration failed');
    }
});

function handleCredentialResponse(response) {
    fetch('/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    }).then(response => response.json())
      .then(data => {
          console.log('Logged in with Google, token:', data.token);
      })
      .catch(error => console.error('Google login failed', error));
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
}
