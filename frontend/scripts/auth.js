// Authentication functions

// Login function
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            showNotification('Login successful!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Register function
async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            showNotification('Registration successful!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            if (data.errors) {
                data.errors.forEach(error => {
                    showNotification(error.msg, 'error');
                });
            } else {
                showNotification(data.message, 'error');
            }
        }
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Login form handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        login(email, password);
    });
}

// Register form handler
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters!', 'error');
            return;
        }
        
        register(name, email, password);
    });
}