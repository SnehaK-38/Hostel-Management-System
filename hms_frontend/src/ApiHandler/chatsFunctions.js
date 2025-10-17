// Dummy placeholders for frontend-only mode (no backend)
export const fetchChats = async () => {
  console.log("fetchChats() called — backend disabled, returning fake data");
  return [
    { id: 1, message: "Welcome to Hostel Management chat!", sender: "Admin" },
    { id: 2, message: "Hi! How do I apply for a room?", sender: "Student" },
  ];
};

export const handleChatSubmit = async (message) => {
  console.log("handleChatSubmit() called — backend disabled, message:", message);
  return { success: true, message };
};
