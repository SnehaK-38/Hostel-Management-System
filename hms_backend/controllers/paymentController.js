// hms_backend/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// --- SERVER-SIDE FEE CALCULATION (MOCK DB LOOKUP) ---
// This is done on the server to prevent client-side manipulation.
const calculateFee = (studentId) => {
    // In a real application, you would query your MongoDB here
    // const student = await Student.findOne({ studentId });
    // const fees = student.getPendingFees();
    
    // MOCK DATA REPLICATION (Based on the structure in your Payment.jsx)
    const MOCK_SUB_TOTAL_RUPEES = 8500.00; // 5000 + 3000 + 500
    
    // Mock late fee rule based on current date
    const LATE_FEE_RUPEES = new Date().getDate() > 10 ? 100.00 : 0.00; 
    
    const totalPayableRupees = MOCK_SUB_TOTAL_RUPEES + LATE_FEE_RUPEES;
    
    // Stripe requires the amount in the smallest currency unit (e.g., cents/paise).
    const amountInCents = Math.round(totalPayableRupees * 100); 

    return { 
        amountInCents, 
        totalPayableRupees 
    };
};

/**
 * Creates a Stripe Payment Intent.
 * This is the first step in the payment process, setting up the transaction details.
 * POST /api/payments/create-payment-intent
 */
const createPaymentIntent = async (req, res) => {
    const { studentId } = req.body; 

    if (!studentId) {
        return res.status(400).json({ message: "Student ID is required to process payment." });
    }

    try {
        const { amountInCents, totalPayableRupees } = calculateFee(studentId);

        // Basic sanity check
        if (amountInCents < 50) {
             return res.status(400).json({ message: "Calculated amount is too low." });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCENTS,
            currency: 'inr', // Assuming INR for Rupees
            description: `Hostel Fees Payment for Student: ${studentId}`,
            metadata: { 
                integration_check: 'accept_a_payment',
                student_id: studentId // Used in the webhook to update the DB
            },
        });

        // Send the client secret and the verified amount back to the client
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            amount: totalPayableRupees, // Send Rupees amount for display
            message: "Payment Intent created successfully."
        });
    } catch (error) {
        console.error("Stripe Error creating PaymentIntent:", error.message);
        res.status(500).json({ message: "Failed to create payment intent.", error: error.message });
    }
};

/**
 * Handles incoming webhooks from Stripe for transaction success/failure.
 * POST /api/payments/webhook
 */
const handleStripeWebhook = (req, res) => {
    // IMPORTANT: In a real application, you MUST verify the Stripe signature here.

    let event = req.body; 

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent ${paymentIntent.id} succeeded for amount ${paymentIntent.amount}.`);
            
            // --- CRITICAL DATABASE UPDATE ---
            const studentId = paymentIntent.metadata.student_id;
            console.log(`Updating database for student ID: ${studentId} (Marking fee as Paid)`);
            // In production: await Student.findByIdAndUpdate(studentId, { feeStatus: 'Paid', ... });
            
            break;
        case 'payment_intent.payment_failed':
            console.log(`PaymentIntent ${event.data.object.id} failed.`);
            break;
        default:
            // console.log(`Unhandled event type ${event.type}`);
    }

    // Always return 200 to Stripe to acknowledge receipt of the event
    res.json({ received: true });
};

// Exporting both functions using named exports
module.exports = {
    createPaymentIntent,
    handleStripeWebhook,
};
