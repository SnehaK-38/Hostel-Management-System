// Dummy placeholder for frontend-only registration
export const handleRegistration = async (formData) => {
  console.log("handleRegistration() called — backend disabled, data:", formData);
  return { status: "success", message: "Fake registration successful!" };
};
