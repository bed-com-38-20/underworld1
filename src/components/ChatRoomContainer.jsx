import React from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';

const ChatRoomContainer = () => {
    const { room_name } = useParams(); // Extract roomName from URL parameters

    if (!room_name) {
        return <div>Error: No room name provided.</div>; // Show error if roomName is not provided
    }

    return <ChatRoom room_name={room_name} />; // Pass roomName to ChatRoom component
};

export default ChatRoomContainer;
