import "./Messages.css";
import { Message } from "./Message";

export function Messages(props) {
  const { messages, deleteMessage, upvoteMessage, downvoteMessage } = props;

  return (
    <div id="Messages">
      {messages.map((message, idx) => (
        <Message 
          key={`message-idx-${idx}`}
          message={message}
          deleteMessage={() => deleteMessage(idx)}
          upvoteMessage={() => upvoteMessage(idx)}
          downvoteMessage={() => downvoteMessage(idx)}
        />
      ))}
    </div>
  );
}