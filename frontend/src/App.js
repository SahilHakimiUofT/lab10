import { useState, useEffect } from "react";
import './App.css';
import { Header } from "./components/Header";
import { CreateMessageForm } from "./components/CreateMessageForm";
import { Messages } from "./components/Messages";

const MESSAGE_STORAGE_KEY = "messages";

const loadMessages = () => {
  const messageDataRaw = localStorage.getItem(MESSAGE_STORAGE_KEY);
  const messageData = messageDataRaw ? JSON.parse(messageDataRaw) : [];
  return messageData;
}

const saveMessages = (messages) => {
  localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
}

function App() {
  // Initialize messages with whatever is in local storage
  const [messages, setMessages] = useState(loadMessages());

  // Save to local storage every time the messages are changed
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const createMessage = (author, content) => {
    const newMessage = {
      messageId: `message-${messages.length}`,
      author,
      content,
      upvotes: 0,
      downvotes: 0,
    };
    setMessages(() => ([...messages, newMessage]));
  };

  const deleteMessage = (messageIdx) => {
    setMessages(() => {
      const newMessages = [...messages];
      newMessages.splice(messageIdx, 1);
      return newMessages;
    });
  };

  const incrementMessageVote = (messageIdx, attributeName) => {
    setMessages(() => {
      const newMessage = { ... messages[messageIdx] };
      newMessage[attributeName] += 1;

      const newMessages = [...messages];
      newMessages[messageIdx] = newMessage;
      
      return newMessages;
    });
  };

  const upvoteMessage = (messageIdx) => {
    incrementMessageVote(messageIdx, "upvotes");
  };

  const downvoteMessage = (messageIdx) => {
    incrementMessageVote(messageIdx, "downvotes");
  }

  return (
    <div className="App">
      <Header />

      <CreateMessageForm 
        createMessage={createMessage}
      />

      <Messages 
        messages={messages}
        deleteMessage={deleteMessage}
        upvoteMessage={upvoteMessage}
        downvoteMessage={downvoteMessage}
      />
    </div>
  );
}

export default App;
