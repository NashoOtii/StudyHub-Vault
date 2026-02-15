import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        // 1. Prevent the default browser form submission (the refresh)
        e.preventDefault();
        
        // 2. Create the user object
        const userToSave = {
            name: email.split('@')[0], 
            schoolName: "School of Biological and Physical Sciences", 
            year: 3 
        };

        // 3. Save to localStorage
        localStorage.setItem('user', JSON.stringify(userToSave));
        
        // 4. Update the App's state if the prop exists
        if (setUser) {
            setUser(userToSave);
        }

        // 5. Use navigate instead of window.location to keep it a Single Page App (SPA)
        navigate('/dashboard'); 
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Student Login</h2>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" className="auth-btn">Login</button>
                <p style={{textAlign: 'center', marginTop: '10px'}}>
                    New? <a href="/register">Create Account</a>
                </p>
            </form>
        </div>
    );
}