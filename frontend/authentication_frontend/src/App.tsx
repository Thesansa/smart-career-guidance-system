import { useState } from 'react';
import './App.css';


function App() {
    const [currentPage, setCurrentPage] = useState('login');

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register state
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        role: { id: 1, name: 'STUDENT' }
    });
    const [roles, setRoles] = useState([]);

    // Login function
    const handleLogin = async () => {
        console.log('Trying to login:', { email, password });

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful! Token:', data.token);
                alert('Login successful! Token: ' + data.token);
            } else {
                const errorText = await response.text();
                console.log('Login failed. Response:', errorText);
                alert('Login failed! Status: ' + response.status + ' - ' + errorText);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed! Error: ' + error.message);
        }
    };

    // Register function
    const handleRegister = async () => {
        console.log('Trying to register:', registerData);

        try {
            const response = await fetch('http://localhost:8080/api/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Registration successful! Please login.');
                setCurrentPage('login');
            } else {
                const errorData = await response.json();
                alert('Registration failed: ' + errorData.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed! Check console.');
        }
    };

    // Load roles when register page opens
    const loadRoles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/roles/all');
            const rolesData = await response.json();
            setRoles(rolesData);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    // Show login form
    if (currentPage === 'login') {
        return (
                <div className="page">
                <div className="auth-card">
                <h1 className="hero">🔐 Career Guidance Login</h1>
                <div className="card-content">
                <div className="form-column"
                className="form-column"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',   /*left align everything*/
                    justifyContent: 'center',
                    paddingLeft: '40px'         /* space from left edge*/
                  }}
                >

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '250px',
                            padding: '8px',
                            margin: '8px 0',
                            fontSize: '14px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(255, 255, 255, 0.3)',
                            color: '#fff'

                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '250px',
                            padding: '8px',
                            margin: '8px 0',
                            fontSize: '14px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(255, 255, 255, 0.3)',
                            color: '#fff'
                        }}
                    />
                    <button
                       style={{
                           width: '250px',
                           padding: '8px',
                           margin: '10px',
                           fontSize: '14px',
                           borderRadius: '8px',
                           border: 'none',
                           background: '#0b66d6',   // <-- primary color
                           color: '#ffffff',
                           cursor: 'pointer'
                         }}
                         onClick={handleLogin}
                    >
                        Login
                    </button>
                    <button
                        style={{
                           width: '250px',
                           padding: '8px',
                           margin: '10px',
                           fontSize: '14px',
                           borderRadius: '8px',
                           border: '1px solid rgba(255, 255, 255, 0.4)',
                           background: 'rgba(255, 255, 255, 0.8)',   // <-- secondary gray
                           color: '#fffffffff',
                           cursor: 'pointer'
                         }}
                         onClick={() => { setCurrentPage('register'); loadRoles(); }}
                    >
                        Don't have account? Register
                    </button>
                      </div>
                      <div className="illustration-column" aria-hidden="true">
                      <img src="/illustration.png" alt="Illustration" className="illustration-img" />
                      </div>

                    </div>
                </div>
            </div>
        );
    }

    // Show register form
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>📝 Create Account</h1>
            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    style={{ width: '100%', padding: '10px', margin: '10px' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}

                />
                <input
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}

                />

                <select
                    value={registerData.role.id}
                    onChange={(e) => {
                        const selectedRole = roles.find(role => role.id === parseInt(e.target.value));
                        setRegisterData({...registerData, role: selectedRole});
                    }}
                    style={{ width: '100%', padding: '10px', margin: '10px' }}
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <button
                   style={{ width: '100%', padding: '10px', margin: '10px' }}
                   onClick={handleRegister}
                >
                    Register
                </button>
                <button
                    style={{ width: '100%', padding: '10px', margin: '10px', background: 'gray' }}
                    onClick={() => setCurrentPage('login')}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default App;