import React from 'react';
import { useState, useEffect } from 'react';

const User_Registration = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/auth/token/', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log('CSRF token fetched');
        })
        .catch(error => {
            console.error('Error fetching CSRF token:', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/user_registration/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();
            console.log('Response data:', responseData);  // Inspect the response data

            if (response.status === 201) {
                const auth_token = responseData.auth_token || responseData.access_token || responseData.token;
                
                if (auth_token) {
                    localStorage.setItem('access_token', auth_token);
                    console.log('Token stored:', auth_token);
                    navigate('/Home_Page');
                    // Optionally, navigate or show a success message
                } else {
                    console.error('Token not found in response');
                    setError('Registration successful, but token not received.');
                }
            } else {
                setError(responseData.error || 'Error during registration');
                console.error('Error during registration:', response.statusText);
            }

        } catch (error) {
            setError('Error during registration');
            console.error('Error during registration:', error); 
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First name"
                        className="p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
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
                <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="mt-2 p-1 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default User_Registration;
