import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User_Registration from './components/User_Registration';
import User_Login from './components/User_Login';
import CreatePost from './components/CreatePost';
import ChatRoom from './components/ChatRoom';
import { UserProvider } from './components/UserContext';
import ChatRoomContainer from './components/ChatRoomContainer';
import Home_Page from './components/Home_Page';
import SearchUser from './components/SearchUser';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Uncomment if needed */}
                    <Route path="/User_Registration" element={<User_Registration />} /> 
                    <Route path="/User_Login" element={<User_Login />} />
                    <Route path="/CreatePost" element={<CreatePost />} />
                    <Route path="/ChatRoom" element={<ChatRoom />} />
                    <Route path='/Home_Page' element={<Home_Page />} />
                    <Route path="/SearchUser" element={<SearchUser />} />
                    <Route path="/chat/:room_name" element={<ChatRoomContainer />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;

