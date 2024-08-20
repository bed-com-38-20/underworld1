import React, { useState } from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faHome, faUsers, faEnvelope, faBell, faCommentDots, faBars } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserContext';

const CreatePost = () => {
    const { user } = useUser();
    const [postData, setPostData] = useState({ text_content: '', image: null, video: null, post_type: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '' });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setPostData({
            ...postData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('post_type', postData.post_type);

        if (postData.post_type === 'text') {
            formData.append('text_content', postData.text_content);
        }

        if (postData.post_type === 'image' && postData.image) {
            formData.append('image', postData.image);
        }

        if (postData.post_type === 'video' && postData.video) {
            formData.append('video', postData.video);
        }

        try {
            const token = localStorage.getItem('access_token'); 
            const response = await fetch('http://127.0.0.1:8000/create_post/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                setSuccess('Post created successfully!');
                setNotification({ show: true, message: 'Post created successfully!' });

                setTimeout(() => {
                    setNotification({ show: false, message: '' });
                }, 4000); // Hide notification after 3 seconds
            } else {
                const responseData = await response.json();
                setError(responseData.error || 'Error creating post');
            }
        } catch (error) {
            setError('Error creating post');
        }
    };

    return (
        <div>
            {/* Notification Bar */}
            {notification.show && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-2 text-center">
                    {notification.message}
                </div>
            )}

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-200">
                {/* ...Your existing nav code... */}
            </nav>

            {/* Main Content */}
            <div className="mt-24 p-4">
                {/* ...Your existing main content code... */}

                {/* Post Creation Section */}
                <div className="border p-6 border-gray-300 rounded-lg max-w-lg mx-auto bg-white">
                    <h1 className="text-3xl text-sky-600 flex  font-bold mb-4">What on your mind</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select 
                            name="post_type" 
                            value={postData.post_type} 
                            onChange={handleChange} 
                            className="border rounded p-2 w-full"
                            required
                        >
                            <option value="">Select Post Type</option>
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                        {postData.post_type === 'text' && (
                            <textarea
                                name="text_content"
                                value={postData.text_content}
                                onChange={handleChange}
                                placeholder="Enter your text..."
                                rows="4"
                                className="border rounded p-2 w-full"
                                required
                            />
                        )}
                        {postData.post_type === 'image' && (
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        )}
                        {postData.post_type === 'video' && (
                            <input
                                type="file"
                                name="video"
                                accept="video/*"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        )}
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Create Post</button>
                    </form>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-green-600 mt-2">{success}</p>}
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
