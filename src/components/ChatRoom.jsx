import React, { useEffect, useState, useRef } from 'react';
import SearchUser from './SearchUser';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const socketRef = useRef(null);
    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');
    const currentUsername = localStorage.getItem('username');
    
    useEffect(() => {
        if (selectedUser) {
            const wsUrl = `ws://127.0.0.1:8001/ws/chat/${selectedUser.username}/`;
            socketRef.current = new WebSocket(wsUrl);

            socketRef.current.onopen = () => {
                console.log('WebSocket connection established');
            };

            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            };

            socketRef.current.onclose = (event) => {
                console.log('WebSocket connection closed', event);
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error', error);
            };

            return () => {
                if (socketRef.current) {
                    socketRef.current.close();
                }
            };
        }
    }, [selectedUser]);

    const sendMessage = async () => {
        if (socketRef.current) {
            const messageData = { message: input, sender: `${firstName} ${lastName}` };
            socketRef.current.send(JSON.stringify(messageData));
            setInput(''); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4 text-center">Chat Room</h1>

            {!selectedUser && (
                <SearchUser onSelectUser={setSelectedUser} />
            )}

            {selectedUser && (
                <div className="flex-grow overflow-y-auto bg-white p-4 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        Chatting with {selectedUser.first_name} {selectedUser.last_name}
                    </h2>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 p-2 rounded-lg ${
                                msg.sender.includes(currentUsername)
                                    ? 'bg-blue-500 text-white self-end'
                                    : 'bg-gray-300 text-black self-start'
                            }`}
                        >
                            <p>{msg.sender}</p>
                            <p>{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedUser && (
                <form onSubmit={handleSubmit} className="flex mt-4 space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 border border-gray-300 p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Send
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChatRoom;
