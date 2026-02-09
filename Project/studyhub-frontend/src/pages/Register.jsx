import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SCHOOLS_LIST = [
  "School of Arts and Social Sciences",
  "School of Education",
  "School of Biological and Physical Sciences",
  "School of Public Health and Community Development",
  "School of Environment and Earth Sciences",
  "School of Development and Strategic Studies",
  "School of Graduate Studies",
  "School of Nursing",
  "School of Business and Economics",
  "School of Medicine",
  "School of Agriculture and Food Security",
  "School of Mathematics, Statistics and Actuarial Science",
  "School of Computing and Informatics",
  "School of Law",
  "School of Planning and Architecture",
  "Institute of Gender Studies"
];

export default function Register() {
  // Default to the first school in the list to avoid empty selection issues
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    schoolName: SCHOOLS_LIST[0], 
    year: 1
  });
  
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        
        {/* Full Name */}
        <div className="input-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your full name"
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>

        {/* Email - UPDATED to personal placeholder */}
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email "
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Create a strong password"
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>

        {/* School Dropdown - Full List */}
        <div className="input-group">
          <label>School / Faculty</label>
          <select 
            value={formData.schoolName}
            onChange={e => setFormData({...formData, schoolName: e.target.value})}
            style={{ width: '100%', padding: '10px' }}
          >
            {SCHOOLS_LIST.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="input-group">
          <label>Current Year</label>
          <select 
            value={formData.year}
            onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
            style={{ width: '100%', padding: '10px' }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map(y => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="auth-btn register-btn">
          Create Account
        </button>
        
        <p style={{marginTop: '15px', textAlign: 'center'}}>
          Already have an account? <a href="/login" style={{color: 'var(--accent-blue)'}}>Login here</a>
        </p>
      </form>
    </div>
  );
}