// // client/test.jsx
// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// const SocketTest = () => {
//   const [message, setMessage] = useState("");
//   const [allMessages, setAllMessages] = useState([]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit("send_message", message);
//       setAllMessages((prev) => [...prev, `You: ${message}`]);
//       setMessage("");
//     }
//   };

//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       setAllMessages((prev) => [...prev, `Other: ${data}`]);
//     });

//     return () => {
//       socket.disconnect("receive_message");
//     };
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">🧪 Socket.IO Test</h2>
//       <div className="space-y-2">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="border border-gray-400 px-3 py-1 rounded"
//           placeholder="Type your message"
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
//         >
//           Send
//         </button>
//       </div>

//       <div className="mt-4 border-t pt-2">
//         {allMessages.map((msg, idx) => (
//           <p key={idx} className="text-sm">{msg}</p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SocketTest;
