import React, { useState, useEffect } from 'react';
import { FaHome, FaBars, FaUsers, FaFacebookMessenger } from 'react-icons/fa';
import { useUser } from './UserContext';

const Home_Page = () => {
  const userProfileImage = 'https://via.placeholder.com/150'; // Replace this with the logged-in user's profile image URL
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [postData, setPostData] = useState({ text_content: '', image: null, video: null, post_type: '' });
  const [success, setSuccess] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [posts, setPosts] = useState([]);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/posts/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('access_token')}`,
        },
      });
      const data = await response.json();
      setPosts(data);  // Assuming your backend returns a list of posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  fetchPosts();
}, [success]);  // Refetch posts when a new post is created



const handleLike = async (postId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/posts/${postId}/like/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('access_token')}`,
      },
    });

    if (response.ok) {
      // Optionally refetch posts or update like count
    }
  } catch (error) {
    console.error('Error liking post:', error);
  }
};

const handleComment = (postId) => {
  // Logic for adding a comment (e.g., show a form to enter a comment)
};

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setPostData({
      ...postData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();

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
        }, 4000); // Hide notification after 4 seconds
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Error creating post');
      }
    } catch (error) {
      setError('Error creating post');
    }
  };

  useEffect(() => {
    if (query && query.length > 0) {
      fetch(`http://localhost:8000/search_user/?query=${query}`)
        .then((response) => {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          } else {
            return response.text().then((text) => {
              throw new Error(`Expected JSON but got ${contentType}: ${text}`);
            });
          }
        })
        .then((data) => {
          setSuggestions(data);
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setError('An error occurred while fetching user data.');
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [query]);

  const handleSelectUser = (user) => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-blue-900 p-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-3">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold dark:text-white">Underworld</span>
          </a>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="border border-gray-300 p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            {error && <p className="text-red-500">{error}</p>}
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

          <div className="flex space-x-12 text-white">
            <a href="#">
              <FaHome size={34} />
            </a>
            <a href="#">
              <FaUsers size={34} />
            </a>
            <a href="#">
              <FaBars size={34} />
            </a>
          </div>

          <div className="flex space-x-6 text-white">
            <a href="/ChatRoom">
              <FaFacebookMessenger size={24} />
            </a>
            <div className="flex items-center space-x-3">
              <img
                src={userProfileImage}
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>
      <div>
        {notification.show && (
          <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-2 text-center">
            {notification.message}
          </div>
        )}

        <div className="mt-24 p-4">
          <div className="border p-6 border-gray-300 rounded-lg max-w-lg mx-auto bg-white">
            <h1 className="text-3xl text-sky-600 flex font-bold mb-4">
              What's on your mind?
              </h1>
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
      <div className="mt-8">
  {posts.map((post) => (
    <div key={post.id} className="border p-4 rounded-lg mb-4 bg-white">
      <p className="font-semibold">{post.user_full_name}</p> {/* Display user's name */}
      {post.post_type === 'text' && <p>{post.text_content}</p>}
      {post.post_type === 'image' && (
        <img src={`http://127.0.0.1:8000${post.image}`} alt="User post" className="w-full h-auto" />
      )}
      {post.post_type === 'video' && (
        <video controls className="w-full h-auto">
          <source src={`http://127.0.0.1:8000${post.video}`} type="video/mp4" />
        </video>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <button onClick={() => handleLike(post.id)} className="text-blue-600">Like</button>
        <button onClick={() => handleComment(post.id)} className="text-blue-600">Comment</button>
      </div>

      <div className="mt-2">
        <p>{post.likes_count} likes</p>
        <p>{post.comments_count} comments</p>
      </div>
    </div>
  ))}
</div>


    </>
  );
}

export default Home_Page;
