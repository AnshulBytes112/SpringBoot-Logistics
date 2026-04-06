import React, { useState } from 'react';
import './Auth.css';

const API_BASE = 'http://localhost:8081';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'ROLE_SHIPPER'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/authenticate' : '/api/auth/register';
    
    // For login, we only need email and password. Register might need firstname and lastname depending on User entity.
    const payload = isLogin ? {
      email: formData.email,
      password: formData.password
    } : {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(isLogin ? 'Invalid credentials' : 'Registration failed');
      }

      const data = await response.json();
      
      if (data.token) { // Assuming token comes back in data.token
        localStorage.setItem('jwtToken', data.token);
        onAuthSuccess(data.token);
      } else if (data.access_token) { // Typical Spring Security response format
        localStorage.setItem('jwtToken', data.access_token);
        onAuthSuccess(data.access_token);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center relative overflow-hidden bg-bgPrimary">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accentSolid rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

        <div className="auth-card relative z-10 w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(0,195,255,0.6)]">🚚</div>
                <h1 className="text-3xl font-bold text-gradient mb-2">LogistiX</h1>
                <p className="text-textSecondary text-sm">
                    {isLogin ? 'Welcome back to the Control Tower' : 'Join the Logistics Matrix'}
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center animate-shake">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {!isLogin && (
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 w-full relative group">
                            <input 
                                type="text"
                                name="firstname"
                                placeholder="First Name"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full relative group">
                            <input 
                                type="text"
                                name="lastname"
                                placeholder="Last Name"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full relative group">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            >
                                <option value="ROLE_SHIPPER">Shipper (Post Loads)</option>
                                <option value="ROLE_TRANSPORTER">Transporter (Bid on Loads)</option>
                                <option value="ROLE_ADMIN">Admin (Full Access)</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-1 relative group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </div>

                <div className="flex flex-col gap-1 relative group">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            )}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className={`auth-submit ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        isLogin ? 'Access Tower' : 'Initialize Account'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-textSecondary">
                {isLogin ? "Don't have clearance? " : "Already initialized? "}
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    className="text-accentSolid hover:text-white transition-colors duration-300 font-semibold underline-offset-4 hover:underline"
                    type="button"
                >
                    {isLogin ? 'Request Access' : 'Login Here'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Auth;
