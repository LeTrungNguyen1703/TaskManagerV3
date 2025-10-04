import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoiam9obl9kb2UiLCJpYXQiOjE3NTk1NjAxODcsImV4cCI6MTc1OTY0NjU4N30.25v664CI5wCzZGzMzi2GvjzQJ9oBzMQAqIZmWbFUah8", // nếu bạn đang dùng WsJwtGuard
  },
});

// Khi connect
socket.on("connect", () => {
  console.log("Connected:", socket.id);
  const taskIds = [1];

  // join vào room task:123 (server cần có code join room cho user)
  socket.emit("joinTask", taskIds);


});

// Lắng nghe sự kiện
socket.on("tasksStatusUpdated", (data) => {
  console.log("Task status updated:", data);
});

socket.on("userAssignedToTask", (data)=> {
  console.log("User assigned to task:", data);
})
