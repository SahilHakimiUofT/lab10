import { useRef } from "react";
import "./CreateMessageForm.css";

export function CreateMessageForm(props) {
  const { createMessage } = props;

  const postNameRef = useRef(null);
  const postContentRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const author = postNameRef.current.value;
    const content = postContentRef.current.value;

    createMessage(author, content);
  };

  return (
    <form id="CreateMessageForm" 
      onSubmit={handleSubmit}
    >
      <div id="CreateMessageForm__title">Post a message</div>
      <input 
        type="text"
        id="CreateMessageForm__post-name"
        className="CreateMessageForm__form-element"
        placeholder="Enter your name"
        name="user_name"
        required
        ref={postNameRef}
      />
      <textarea 
        rows="5"
        id="CreateMessageForm__post-content"
        className="CreateMessageForm__form-element"
        placeholder="Enter your message"
        name="user_message"
        required
        ref={postContentRef}
      ></textarea>
      <button type="submit" className="CreateMessageForm__button">
        Post your message
      </button>
    </form>
  )
}