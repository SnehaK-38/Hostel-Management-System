import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 
// NOTE: The external CSS import for react-toastify is intentionally omitted 
// to prevent compilation errors in this environment.

function Complain() {
    // 1. STATE MANAGEMENT
    const initialData = { 
        firstname: "",
        lastname: "",
        email: "",
        subject: "",
        complaint: ""
    };

    const [complaintData, setComplaintData] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator

    // 2. HANDLERS
    const handleChange = (e) => {
        const { value, name } = e.target;
        setComplaintData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        setIsSubmitting(true);
        
        // --- MOCK API CALL LOGIC (Simulating Success) ---
        // This simulates a successful server response (1 second delay)
        // to properly test the front-end toast and form reset features.
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success toast
            toast.success("Complaint Submitted Successfully! Thank you.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
            // Reset the form to its initial state
            setComplaintData(initialData);

        } catch (error) {
            // Placeholder for real error handling
            toast.error(`Submission failed due to an unexpected error.`);
            console.error("Complaint submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. RENDER (Structure preserved)
    return (
        <complain>
            <ToastContainer /> {/* Added for notifications */}
            <div class="Complaint">
                <div class="contain">
                    <h1 class="title">Complaint Form</h1>
                    <form onSubmit={handleSubmit}> {/* Added onSubmit */}
                        <div class="inputBox">
                            <label>First Name</label>
                            <input 
                                type="text" 
                                id="compfname" 
                                name="firstname" 
                                placeholder="Enter first name" 
                                value={complaintData.firstname} // Added value binding
                                onChange={handleChange} // Added change handler
                            />
                        </div>

                        <div class="inputBox">
                            <label>Last Name</label>
                            <input 
                                type="text" 
                                id="complname" 
                                name="lastname" 
                                placeholder="Enter last name" 
                                value={complaintData.lastname} // Added value binding
                                onChange={handleChange} // Added change handler
                            />
                        </div>

                        <div class="inputBox">
                            <label>Email</label>
                            <input 
                                type="email" 
                                id="compemail" 
                                name="email" 
                                placeholder="Enter email" 
                                value={complaintData.email} // Added value binding
                                onChange={handleChange} // Added change handler
                                required 
                            />
                        </div>

                        <div class="inputBox">
                            <label>Subject</label>
                            <input 
                                type="text" 
                                id="compsubject" 
                                name="subject" 
                                placeholder="Subject of complaint"
                                value={complaintData.subject} // Added value binding
                                onChange={handleChange} // Added change handler
                                required 
                            />
                        </div>

                        <div class="inputBox">
                            <label>Complaint</label>
                            <textarea 
                                rows="8" 
                                id="complaint" 
                                name="complaint" 
                                placeholder="Enter your complaint ..."
                                value={complaintData.complaint} // Added value binding
                                onChange={handleChange} // Added change handler
                                required
                            ></textarea>
                        </div>
                        {/* <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_next" value="http://localhost:4500" /> */}
                        <button type="submit" disabled={isSubmitting}> {/* Added disabled and dynamic text */}
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </complain>
    )
}

export default Complain

