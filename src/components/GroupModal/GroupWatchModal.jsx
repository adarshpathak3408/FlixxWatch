import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoClose, IoShareSocial } from 'react-icons/io5';
import { BsFillPersonFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import './GroupWatchModal.css';

const GroupWatchModal = ({ movie, onClose, userId }) => {
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [playbackState, setPlaybackState] = useState({
    isPlaying: false,
    currentTime: 0
  });
  const [copied, setCopied] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:4000');

    // Set up event listeners
    socketRef.current.on('roomCreated', ({ roomId }) => {
      setRoomId(roomId);
      setIsHost(true);
      setIsInRoom(true);
    });

    socketRef.current.on('roomJoined', ({ roomId, movieId, host, playbackState }) => {
      setRoomId(roomId);
      setIsHost(userId === host);
      setIsInRoom(true);
      setPlaybackState(playbackState);
    });

    socketRef.current.on('userJoined', ({ userId, users }) => {
      setUsers(users);
      addMessage(`${userId} joined the room`);
    });

    socketRef.current.on('playbackStateUpdated', (state) => {
      if (!isHost) {
        setPlaybackState(state);
      }
    });

    socketRef.current.on('messageReceived', ({ userId, message }) => {
      addMessage(`${userId}: ${message}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text) => {
    setMessages(prev => [...prev, text]);
  };

  const createRoom = () => {
    socketRef.current.emit('createRoom', { 
      movieId: movie.id, 
      userId 
    });
  };

  const joinRoom = () => {
    socketRef.current.emit('joinRoom', { 
      roomId: joinRoomId, 
      userId 
    });
  };

  const handleSendMessage = () => {
    if (message.trim() === '0') return;
    socketRef.current.emit('sendMessage', { 
      roomId, 
      userId, 
      message 
    });
    addMessage(`You: ${message}`);
    setMessage('');
  };

  const updatePlaybackState = (state) => {
    if (!isHost) return;
    
    const newState = {
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      lastUpdated: Date.now()
    };
    
    setPlaybackState(newState);
    socketRef.current.emit('updatePlaybackState', { 
      roomId, 
      state: newState 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="group-watch-modal">
      <div className="modal-content">
        <IoClose className="close-btn" onClick={onClose} />
        
        {!isInRoom ? (
          <div className="room-creation">
            <h2>Group Watch for {movie.title}</h2>
            <div className="action-buttons">
              <button className="create-room-btn" onClick={createRoom}>
                Create Room
              </button>
              <div className="join-room">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                />
                <button className="join-room-btn" onClick={joinRoom}>
                  Join Room
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="room-container">
            <div className="video-container">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${movie.trailerKey}?enablejsapi=1`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              <div className="video-controls">
                {isHost && (
                  <>
                    <button 
                      onClick={() => updatePlaybackState({ 
                        ...playbackState, 
                        isPlaying: !playbackState.isPlaying 
                      })}
                    >
                      {playbackState.isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={playbackState.currentTime}
                      onChange={(e) => updatePlaybackState({
                        ...playbackState,
                        currentTime: parseFloat(e.target.value)
                      })}
                    />
                  </>
                )}
              </div>
            </div>
            
            <div className="chat-container">
              <div className="room-info">
                <h3>Room: {roomId}</h3>
                <CopyToClipboard 
                  text={`${window.location.origin}/player/${movie.id}?room=${roomId}`}
                  onCopy={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  <button className="share-btn">
                    <IoShareSocial /> {copied ? 'Copied!' : 'Share Invite'}
                  </button>
                </CopyToClipboard>
              </div>
              
              <div className="users-list">
                <h4>Participants ({users.length})</h4>
                <ul>
                  {users.map((user, index) => (
                    <li key={index}>
                      <BsFillPersonFill /> {user} {user === userId && '(You)'}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className="message">
                    {msg}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage}>Send</button>
                <button 
                  className="mute-btn" 
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <BsMicMuteFill /> : <BsMicFill />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupWatchModal;