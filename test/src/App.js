import React, { useState } from 'react';
import './App.css'; // Make sure this is the correct path to your CSS file
import logoImage from './logo1.png'; // Update this path to your actual logo image

function MultiLineTextInput() {
    const [textInput, setTextInput] = useState('');
    const [serverResponse, setServerResponse] = useState('');
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);

    const handleSubmit = async () => {
        if (!textInput.trim() || !activeChatId) return;

        // Update the chat with the user's message
        const newMessage = { sender: 'user', text: textInput };
        const updatedChats = chats.map(chat =>
            chat.id === activeChatId
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        );
        setChats(updatedChats);

        try {
            const response = await fetch('http://13.239.121.247:8080/upload_text', { // Replace with your actual server URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textInput }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const serverMessage = { sender: 'server', text: data.gpt_response };
            const updatedChatsWithResponse = chats.map(chat =>
                chat.id === activeChatId
                    ? { ...chat, messages: [...chat.messages, serverMessage] }
                    : chat
            );
            
            setChats(updatedChatsWithResponse);
            setServerResponse(data.gpt_response);
        } catch (error) {
            console.error('Error submitting text:', error);
            // You can add error handling here
        }

        setTextInput(''); // Clear the text input after sending
    };

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleNewChat = () => {
        const newChatId = Date.now(); // Using timestamp as unique ID for simplicity
        setActiveChatId(newChatId);
        setChats([...chats, { id: newChatId, messages: [] }]);
    };

    const handleChatClick = (chatId) => {
        setActiveChatId(chatId);
        const activeChat = chats.find(chat => chat.id === chatId);
        if (activeChat && activeChat.messages.length > 0) {
            setTextInput(activeChat.messages[activeChat.messages.length - 1].text);
        } else {
            setTextInput('');
        }
    };

    return (
        <div className="appContainer">
            <div className="sidebar">
                <button className="sidebarButton" onClick={handleNewChat}>New Chat</button>
                <button className="sidebarButton">User Login</button>
                {chats.map((chat, index) => (
                    <div key={chat.id}
                         className={`chatPreview ${chat.id === activeChatId ? 'active' : ''}`}
                         onClick={() => handleChatClick(chat.id)}>
                        Chat {index + 1}
                    </div>
                ))}
            </div>
            <div className="mainContent">
                <div className="logoArea">
                    <img src={logoImage} alt="Logo" className="logo"/>
                </div>
                <div className="container">
                    {activeChatId && chats.find(chat => chat.id === activeChatId)?.messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === 'user' ? 'user' : 'server'}`}>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="inputArea">
                    <textarea
                        className="textInput"
                        placeholder="Type your message here..."
                        value={textInput}
                        onChange={handleInputChange}
                    />
                    <button className="submitBtn" onClick={handleSubmit}>&#9654;</button> {/* Play icon used as send icon */}
                </div>
                {serverResponse && (
                    <div className="serverResponse">
                        <p>{serverResponse}</p>
                    </div>
                )}
                <p className="disclaimer"></p>
            </div>
        </div>
    );
}

export default MultiLineTextInput;
