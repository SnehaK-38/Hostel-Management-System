import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, ArrowRight, Check, FileText, Home, User } from 'lucide-react';

// --- Mock Data Structure ---
const MOCK_STUDENT_DATA = {
  A1001: {
    name: "Aisha Sharma",
    hostelId: "H-A305",
    fees: [
      { id: 1, name: "Room Rent (Sept)", amount: 5000.0 },
      { id: 2, name: "Mess Fee (Sept)", amount: 3000.0 },
      { id: 3, name: "Utility Charges", amount: 500.0 },
    ],
  },
  B2002: {
    name: "Vikram Singh",
    hostelId: "H-B211",
    fees: [
      { id: 1, name: "Room Rent (Sept)", amount: 5000.0 },
      { id: 2, name: "Laundry Service", amount: 850.0 },
    ],
  },
};

const DUE_MONTH = "September 2024";

// --- Utility ---
const calculateTotal = (fees) => {
  if (!fees || fees.length === 0)
    return { subTotal: 0, lateFee: 0, total: 0 };

  const subTotal = fees.reduce((sum, item) => sum + item.amount, 0);
  const lateFee = subTotal > 0 && new Date().getDate() > 10 ? 100 : 0;
  return { subTotal, lateFee, total: subTotal + lateFee };
};

// --- Mock Payment Element ---
const MockStripeElement = ({ onDetailsChange }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const isValid =
      cardNumber.length > 15 && expiry.length === 5 && cvc.length === 3;
    onDetailsChange(isValid);
  }, [cardNumber, expiry, cvc, onDetailsChange]);

  return (
    <div className="payment-element-box">
      <input
        className="stripe-input-mock"
        placeholder="Card Number"
        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
      />
      <div className="flex space-x-2 mt-2">
        <input
          className="stripe-input-mock w-1/2"
          placeholder="MM/YY"
          onChange={(e) => setExpiry(e.target.value)}
        />
        <input
          className="stripe-input-mock w-1/2"
          placeholder="CVC"
          onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
        />
      </div>
      <p className="text-xs mt-3 text-gray-500">
        <Lock className="inline h-3 w-3 mr-1" />
        Secure mock payment
      </p>
    </div>
  );
};

// --- STEP 1 ---
const Step1_FeeReview = ({ setStep, student, totalCalc, userId, setUserId }) => (
  <div className="step-content">
    <input
      value={userId}
      onChange={(e) => setUserId(e.target.value.toUpperCase())}
      placeholder="Enter Student ID"
    />

    {student && (
      <>
        <p>Name: {student.name}</p>
        <p>Hostel: {student.hostelId}</p>
        <p>Total: ₹{totalCalc.total}</p>

        <button onClick={() => setStep(2)}>Proceed</button>
      </>
    )}
  </div>
);

// --- STEP 2 ---
const Step2_PaymentConfirmation = ({ setStep, student, totalCalc }) => {
  const [valid, setValid] = useState(false);

  return (
    <div className="step-content">
      <p>Pay ₹{totalCalc.total}</p>
      <MockStripeElement onDetailsChange={setValid} />
      <button disabled={!valid} onClick={() => setStep(3)}>
        Pay Now
      </button>
    </div>
  );
};

// --- STEP 3 (✅ FIXED) ---
const Step3_Success = ({ totalCalc, student }) => {
  if (!student) return <div>No payment data found</div>;

  return (
    <div className="success-box">
      <Check className="success-icon" />
      <h2>Payment Successful!</h2>

      <p className="success-details">
        Thank you, <strong>{student.name}</strong>. Your payment of{" "}
        <strong>₹{totalCalc.total.toFixed(2)}</strong> for{" "}
        <strong>{DUE_MONTH}</strong> hostel fees has been processed successfully.
      </p>

      <button onClick={() => window.location.reload()}>
        Return to Dashboard
      </button>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [student, setStudent] = useState(null);
  const [totalCalc, setTotalCalc] = useState(calculateTotal([]));

  useEffect(() => {
    const data = MOCK_STUDENT_DATA[userId];
    setStudent(data || null);
    setTotalCalc(calculateTotal(data?.fees || []));
  }, [userId]);

  return (
    <div className="payment-app">
      {step === 1 && (
        <Step1_FeeReview
          setStep={setStep}
          student={student}
          totalCalc={totalCalc}
          userId={userId}
          setUserId={setUserId}
        />
      )}
      {step === 2 && (
        <Step2_PaymentConfirmation
          setStep={setStep}
          student={student}
          totalCalc={totalCalc}
        />
      )}
      {step === 3 && (
        <Step3_Success student={student} totalCalc={totalCalc} />
      )}
    </div>
  );
};

export default App;
