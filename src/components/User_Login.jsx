import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const User_Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();


    // Example of including token in headers for authenticated requests
const fetchUserData = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch('http://127.0.0.1:8000/user_login/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error('Failed to fetch data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Assuming you need to include a token in the headers (e.g., for authentication):
            const token = localStorage.getItem('access_token'); // Retrieve any existing token if needed
    
            const response = await fetch('http://127.0.0.1:8000/user_login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Uncomment the following line if a token is required in the headers
                     'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.auth_token);
                localStorage.setItem('first_name', data.first_name);
                localStorage.setItem('last_name', data.last_name);
                console.log('Login successful');
                navigate('/Home_Page');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Error during login');
        }
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="mt-2 p-1 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="mt-2 p-1 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default User_Login;
