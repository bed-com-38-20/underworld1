
import React, { useState, useEffect } from 'react';

const SearchUser = ({ onSelectUser }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null); // State to store error messages

    useEffect(() => {
        if (query && query.length > 0) {
            fetch(`http://localhost:8000/search_user/?query=${query}`)
                .then((response) => {
                    // Check if the response is JSON or HTML
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        return response.json(); // Parse response as JSON
                    } else {
                        return response.text().then((text) => {
                            throw new Error(`Expected JSON but got ${contentType}: ${text}`);
                        });
                    }
                })
                .then((data) => {
                    setSuggestions(data);
                    setError(null); // Clear any previous errors
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setError('An error occurred while fetching user data.');
                    setSuggestions([]); // Clear suggestions on error
                });
        } else {
            setSuggestions([]);
            setError(null); // Clear error if query is empty
        }
    }, [query]);

    const handleSelectUser = (user) => {
        onSelectUser(user);
        setQuery(''); // Clear query after selection
        setSuggestions([]); // Clear suggestions after selection
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
                className="border border-gray-300 p-2 rounded"
            />
            {error && (
                <p className="text-red-500">{error}</p> // Display error message
            )}
            {suggestions.length > 0 && (
                <ul className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                    {suggestions.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                            {user.first_name} {user.last_name} (@{user.username})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchUser;
