import "./Message.css";
import UserImage from "../media/user.png"

export function Message(props) {
  const { message, deleteMessage, upvoteMessage, downvoteMessage } = props;

  return (
    <div className="Message">
      <div className="Message__user">
        <img className="Message__picture" src={UserImage} />
        <div className="Message__username">{message.author}</div>
      </div>

      <div className="Message__content">{message.content}</div>
      <div 
        className="Message__upvote-icon Message__icon"
        onClick={upvoteMessage}
      >
        {message.upvotes}
      </div>
      <div 
        className="Message__downvote-icon Message__icon"
        onClick={downvoteMessage}
      >
        {message.downvotes}
      </div>
      <div 
        className="Message__delete-icon Message__icon"
        onClick={deleteMessage}
      ></div>
    </div>
  )
};