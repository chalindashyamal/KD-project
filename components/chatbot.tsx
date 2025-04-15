const Chatbot = () => {
  return (
    <div className="chatbot">
      {/* Chatbot UI elements will go here */}
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default Chatbot

// Add the following CSS to fix the typing indicator animation in the chatbot:

// \`\`\`css
// .typing-indicator {
//   display: flex;
//   align-items: center;
// }

// .typing-indicator span {
//   height: 8px;
//   width: 8px;
//   margin: 0 2px;
//   background-color: #888;
//   border-radius: 50%;
//   display: inline-block;
//   opacity: 0.4;
// }

// .typing-indicator span:nth-child(1) {
//   animation: pulse 1s infinite;
// }

// .typing-indicator span:nth-child(2) {
//   animation: pulse 1s infinite 0.2s;
// }

// .typing-indicator span:nth-child(3) {
//   animation: pulse 1s infinite 0.4s;
// }

// @keyframes pulse {
//   0% {
//     opacity: 0.4;
//     transform: scale(1);
//   }
//   50% {
//     opacity: 0.9;
//     transform: scale(1.2);
//   }
//   100% {
//     opacity: 0.4;
//     transform: scale(1);
//   }
// }
// \`\`\`

// Since this is a React component, the CSS should be added to a separate CSS file or styled-components.
// For simplicity, I will add it as a style tag in the head.  A better approach would be to use a CSS file or styled components.

const style = `
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #888;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.4;
}

.typing-indicator span:nth-child(1) {
  animation: pulse 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation: pulse 1s infinite 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation: pulse 1s infinite 0.4s;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}
`

const ChatbotWithStyle = () => {
  return (
    <>
      <style>{style}</style>
      <Chatbot />
    </>
  )
}

export default ChatbotWithStyle;

