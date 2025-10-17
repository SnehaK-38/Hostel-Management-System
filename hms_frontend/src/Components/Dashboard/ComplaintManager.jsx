import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, updateDoc, setLogLevel } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
// NOTE: Styles for react-toastify are assumed to be loaded externally or provided by a global stylesheet.

// Enable Firebase debugging (optional, but good practice for dev)
setLogLevel('debug'); 

// --- Global Context Setup ---
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
const rawFirebaseConfig = typeof window.__firebase_config !== 'undefined' ? window.__firebase_config : '{}';
const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

let firebaseConfig = {};
try {
    firebaseConfig = JSON.parse(rawFirebaseConfig);
} catch (e) {
    console.error("Failed to parse Firebase configuration:", e);
}

const isConfigAvailable = Object.keys(firebaseConfig).length > 0;
const app = isConfigAvailable ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// --- Utility Functions ---
const getFormattedDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString();
    } catch (e) {
        return 'Invalid Date';
    }
};

/**
 * ComplaintManager Component
 * Fetches and manages complaints from Firestore.
 */
function ComplaintManager() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Tracks auth state

    // 1. Firebase Initialization and Auth
    useEffect(() => {
        if (!isConfigAvailable) {
            setError("Firebase configuration is not available. Cannot connect to database.");
            setLoading(false);
            return;
        }

        // Authentication Handler
        const handleAuth = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (err) {
                console.error("Firebase Auth Error:", err);
                setError("Authentication failed.");
            }
        };

        handleAuth();

        // Listener for Auth state changes
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                console.log("Authenticated user ID:", user.uid);
            } else {
                setUserId(null);
                // Re-attempt sign-in if needed, though handleAuth above should cover the initial case.
            }
        });

        return () => unsubscribeAuth();
    }, []); // Run only on mount

    // 2. Real-time Complaint Fetching
    useEffect(() => {
        if (!db || !userId) {
            // Wait for DB to be ready and user to be authenticated
            if (!isConfigAvailable) setLoading(false);
            return;
        }

        const collectionPath = `artifacts/${appId}/public/data/complaints`;
        const complaintsCollectionRef = collection(db, collectionPath);

        // Set up real-time listener
        const unsubscribeSnapshot = onSnapshot(complaintsCollectionRef, (snapshot) => {
            const fetchedComplaints = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by status (Pending first) and then by timestamp
            fetchedComplaints.sort((a, b) => {
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                if (a.status !== 'Pending' && b.status === 'Pending') return 1;
                return new Date(b.timestamp) - new Date(a.timestamp);
            });

            setComplaints(fetchedComplaints);
            setLoading(false);
        }, (err) => {
            console.error("Firestore Snapshot Error:", err);
            setError("Failed to load complaints.");
            setLoading(false);
        });

        return () => unsubscribeSnapshot(); // Clean up listener on unmount
    }, [db, userId]); // Re-run when db or userId changes

    // 3. Update Status Handler
    const handleUpdateStatus = async (complaintId, newStatus) => {
        if (!db) {
            toast.error("Database not connected.");
            return;
        }

        try {
            const complaintDocRef = doc(db, `artifacts/${appId}/public/data/complaints`, complaintId);
            await updateDoc(complaintDocRef, {
                status: newStatus,
                reviewedBy: userId, // Record who approved it
                reviewDate: new Date().toISOString()
            });
            toast.success(`Complaint ID ${complaintId.substring(0, 4)}... status updated to ${newStatus}.`);
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error("Failed to update status.");
        }
    };


    // --- Render Logic ---

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl m-4 md:m-8">
                <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-indigo-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p>Loading complaints from Firestore...</p>
            </div>
        );
    }
    
    // Admin User Info Display
    const adminInfo = userId 
        ? <p className="text-sm text-gray-600 mb-6">Signed in as Admin User ID: <code className="bg-gray-100 p-1 rounded text-xs font-mono">{userId}</code></p>
        : <p className="text-sm text-yellow-600 mb-6">User ID unavailable. Authentication pending or failed.</p>;


    return (
        <div className="p-4 md:p-8 min-h-screen bg-gray-50">
            <ToastContainer position="bottom-right" autoClose={3000} />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin Complaint Dashboard</h1>
                <p className="text-lg text-gray-500 mb-6">Manage real-time submissions from users.</p>
                
                {adminInfo}

                <div className="space-y-6">
                    {complaints.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No Complaints</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                There are currently no complaints submitted.
                            </p>
                        </div>
                    ) : (
                        complaints.map((comp) => (
                            <div 
                                key={comp.id} 
                                className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${
                                    comp.status === 'Pending' ? 'border-yellow-500' : 
                                    comp.status === 'Approved' ? 'border-green-500' : 'border-gray-500'
                                } flex flex-col md:flex-row justify-between`}
                            >
                                <div className="flex-grow">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            comp.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            comp.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {comp.status}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-800">{comp.subject}</h3>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{comp.complaint}</p>
                                    
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                                        <p><strong>From:</strong> {comp.firstname} {comp.lastname} ({comp.email})</p>
                                        <p><strong>Submitted:</strong> {getFormattedDate(comp.timestamp)}</p>
                                        <p><strong>User ID:</strong> <code className="font-mono">{comp.userId}</code></p>
                                        {comp.reviewedBy && <p><strong>Reviewed By:</strong> {comp.reviewedBy.substring(0, 8)}...</p>}
                                    </div>
                                </div>
                                
                                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 flex items-center">
                                    {comp.status === 'Pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus(comp.id, 'Approved')}
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 w-full md:w-auto"
                                            title="Approve this complaint"
                                        >
                                            <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Approve
                                        </button>
                                    )}
                                    {comp.status !== 'Pending' && (
                                        <span className="text-sm text-green-500 font-medium">Action Complete</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComplaintManager;
