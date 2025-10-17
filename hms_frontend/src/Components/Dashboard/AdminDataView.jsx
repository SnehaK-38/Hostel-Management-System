import React, { useState } from 'react';

// Hardcoded Placeholder Data for Front-End Visualization
const PLACEHOLDER_STUDENT_DATA = [
    // Ensure you use the same fields expected from the Register component (or your eventual API)
    { id: 101, name: 'Aditya Sharma', email: 'aditya.sharma@sakec.edu', enrollment: 'SAKEC12345', status: 'Pending', complaint: 'WiFi is slow on 3rd floor.' },
    { id: 102, name: 'Priya Singh', email: 'priya.singh@sakec.edu', enrollment: 'SAKEC67890', status: 'Approved', complaint: 'No complaint.' },
    { id: 103, name: 'Rohan Verma', email: 'rohan.verma@sakec.edu', enrollment: 'SAKEC11223', status: 'Pending', complaint: 'Needs to change room.' },
    { id: 104, name: 'Zoya Khan', email: 'zoya.khan@sakec.edu', enrollment: 'SAKEC44556', status: 'Approved', complaint: 'Payment query pending.' },
];

function AdminDataView() {
    // Initialize state directly with placeholder data
    const [studentData, setStudentData] = useState(PLACEHOLDER_STUDENT_DATA);

    // Function to simulate action (this will call an API later)
    const handleAction = (id, newStatus) => {
        // Optimistically update the UI state
        setStudentData(prevData =>
            prevData.map(student =>
                student.id === id ? { ...student, status: newStatus } : student
            )
        );
    };

    return (
        <div className="registration">
            <h1>Admin Dashboard: All Student Records</h1>
            
            <div className="admin-data-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Enrollment No.</th>
                            <th>Status</th>
                            <th>Recent Complaint</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.enrollment}</td>
                                <td>
                                    <span style={{ 
                                        // Simple inline styles to visually distinguish status
                                        color: student.status === 'Approved' ? '#28a745' : '#ffc107', 
                                        fontWeight: 'bold' 
                                    }}>
                                        {student.status}
                                    </span>
                                </td>
                                <td>{student.complaint.substring(0, 30)}{student.complaint.length > 30 ? '...' : ''}</td>
                                <td>
                                    {student.status === 'Pending' ? (
                                        <button 
                                            className="view-details-btn" 
                                            onClick={() => handleAction(student.id, 'Approved')}
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button className="view-details-btn" style={{backgroundColor: '#333'}} disabled>
                                            Approved
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {studentData.length === 0 && <p>No student records found.</p>}
            </div>
        </div>
    );
}

export default AdminDataView;