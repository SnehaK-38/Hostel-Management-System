export const loginUser = async (email, password) => {
  console.log("loginUser() called — backend disabled");
  // You can fake a successful login here
  if (email === "admin@test.com" && password === "1234") {
    return { status: "success", message: "Login successful!" };
  } else {
    return { status: "error", message: "Invalid credentials (frontend only)" };
  }
};

export const verifyUser = () => console.log("verifyUser disabled (frontend only).");
