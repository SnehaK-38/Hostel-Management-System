import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, ArrowRight, Check, FileText, Home, User } from 'lucide-react';

// --- Mock Data Structure (Simulates a database lookup) ---
const MOCK_STUDENT_DATA = {
  'A1001': {
    name: "Aisha Sharma",
    hostelId: "H-A305",
    fees: [
        { id: 1, name: "Room Rent (Sept)", amount: 5000.00 },
        { id: 2, name: "Mess Fee (Sept)", amount: 3000.00 },
        { id: 3, name: "Utility Charges", amount: 500.00 },
    ],
  },
  'B2002': {
    name: "Vikram Singh",
    hostelId: "H-B211",
    fees: [
        { id: 1, name: "Room Rent (Sept)", amount: 5000.00 },
        { id: 2, name: "Laundry Service", amount: 850.00 },
    ],
  },
};

const DUE_MONTH = "September 2024";

// --- Utility Functions ---
const calculateTotal = (fees) => {
    if (!fees || fees.length === 0) return { subTotal: 0, lateFee: 0, total: 0 };
    
    const subTotal = fees.reduce((sum, item) => sum + item.amount, 0);
    // Mock late fee rule: 100.00 applied if subTotal > 0 and current day > 10
    const lateFee = subTotal > 0 && new Date().getDate() > 10 ? 100.00 : 0.00; 
    const total = subTotal + lateFee;
    
    return { subTotal, lateFee, total };
};

// --- Mock Payment Element ---
const MockStripeElement = ({ onDetailsChange }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        // Notify parent component about the validity/presence of payment details
        const isValid = cardNumber.length > 15 && expiry.length === 5 && cvc.length === 3;
        onDetailsChange(isValid);
    }, [cardNumber, expiry, cvc, onDetailsChange]);

    const formatCardNumber = (value) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue.match(/.{1,4}/g)?.join(' ') || '';
    };

    const formatExpiry = (value) => {
        const numericValue = value.replace(/\D/g, '').substring(0, 4);
        if (numericValue.length > 2) {
            return `${numericValue.substring(0, 2)}/${numericValue.substring(2)}`;
        }
        return numericValue;
    };

    return (
        <div className="payment-element-box">
            <input
                className="stripe-input-mock"
                type="text"
                placeholder="Card Number (16 Digits)"
                value={formatCardNumber(cardNumber)}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                maxLength="19" // 16 digits + 3 spaces
            />
            <div className="flex space-x-2 mt-2">
                <input
                    className="stripe-input-mock w-1/2"
                    type="text"
                    placeholder="MM/YY"
                    value={formatExpiry(expiry)}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength="5"
                />
                <input
                    className="stripe-input-mock w-1/2"
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    maxLength="3"
                />
            </div>
            <p className="text-xs mt-3 text-gray-500">
                <Lock className="inline h-3 w-3 mr-1 align-sub" /> All transactions are secured via a mock payment gateway.
            </p>
        </div>
    );
};


// --- Step 1: Fee Review and Student Details ---
const Step1_FeeReview = ({ setStep, student, totalCalc, userId, setUserId }) => (
  <div className="step-content">
    <h2 className="step-heading">
      <FileText className="heading-icon" /> 1. Review Monthly Fee
    </h2>

    {/* User ID Input Card */}
    <div className="info-card bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
        <h3 className="info-heading border-b pb-2 mb-3 text-lg font-bold text-gray-700">
            <User className="inline h-5 w-5 mr-2 text-primary-blue" />
            Enter Your Student ID
        </h3>
        <input
            className="w-full p-3 border border-gray-300 rounded-lg text-lg font-mono focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition"
            type="text"
            placeholder="e.g., A1001 or B2002"
            value={userId}
            onChange={(e) => setUserId(e.target.value.toUpperCase())}
        />
        <p className="text-xs mt-2 text-gray-500">
            Enter a valid ID (A1001 or B2002) to load personalized fee details.
        </p>
    </div>

    {student ? (
        <>
            {/* Student Info Card */}
            <div className="info-card">
                <h3 className="info-heading">Student Details</h3>
                <div className="info-grid">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{student.name}</span>
                    <span className="info-label">Hostel ID:</span>
                    <span className="info-value">{student.hostelId}</span>
                    <span className="info-label">Fee Month:</span>
                    <span className="info-value">{DUE_MONTH}</span>
                </div>
            </div>

            {/* Fee List */}
            <div className="fee-item-list">
                <div className="fee-list-header">
                    <span>Fee Item</span>
                    <span>Amount</span>
                </div>
                {student.fees.map((item) => (
                    <div key={item.id} className="fee-item-row">
                        <span className="fee-name">{item.name}</span>
                        <span className="fee-amount">₹{item.amount.toFixed(2)}</span>
                    </div>
                ))}
                {totalCalc.lateFee > 0 && (
                    <div className="late-fee-row">
                        <span className="fee-name late-fee-name">Late Fee (Post-10th)</span>
                        <span className="fee-amount late-fee-amount">₹{totalCalc.lateFee.toFixed(2)}</span>
                    </div>
                )}
                
                {/* Total Row */}
                <div className="fee-total-row">
                    <span className="fee-name total-label">Total Payable</span>
                    <span className="fee-amount total-amount">₹{totalCalc.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Alert for Late Fee */}
            {totalCalc.lateFee > 0 && (
                <div className="late-fee-alert">
                    <p>A late fee of ₹{totalCalc.lateFee.toFixed(2)} has been automatically applied.</p>
                </div>
            )}

            {/* Action Button */}
            <div className="action-buttons justify-end">
                <button 
                    onClick={() => setStep(2)} 
                    className="primary-button"
                    disabled={totalCalc.total === 0}
                >
                    Proceed to Payment <ArrowRight className="button-icon ml-2" />
                </button>
            </div>
        </>
    ) : (
        <div className="info-card bg-yellow-100 border-yellow-400 text-yellow-800">
            <p className="font-semibold">Please enter a valid Student ID to view your outstanding fees.</p>
        </div>
    )}
  </div>
);

// Step 2: Confirmation and Payment Entry
const Step2_PaymentConfirmation = ({ setStep, student, totalCalc }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentValid, setIsPaymentValid] = useState(false);

    // Mock handler for Stripe API call
    const handleSubmit = async () => {
        setIsProcessing(true);
        console.log("Submitting payment for total:", totalCalc.total);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API/Stripe delay
        setIsProcessing(false);
        setStep(3); // Go to success page
    };

    return (
        <div className="step-content">
            <h2 className="step-heading">
                <Lock className="heading-icon" /> 2. Confirm & Pay
            </h2>

            {/* Summary */}
            <div className="summary-box">
                <h3 className="summary-heading">Payment Summary</h3>
                <div className="summary-row">
                    <span className="summary-label">Student Name</span>
                    <span className="summary-value">{student.name}</span>
                </div>
                <div className="summary-row">
                    <span className="summary-label">Fee Month</span>
                    <span className="summary-value">{DUE_MONTH}</span>
                </div>
                <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">₹{totalCalc.subTotal.toFixed(2)}</span>
                </div>
                {totalCalc.lateFee > 0 && (
                    <div className="summary-row">
                        <span className="summary-label late-fee-name">Late Fee</span>
                        <span className="summary-value late-fee-amount">₹{totalCalc.lateFee.toFixed(2)}</span>
                    </div>
                )}
                <div className="summary-total-row">
                    <span className="summary-label">Amount Payable</span>
                    <span className="summary-value total-amount">₹{totalCalc.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Element */}
            <h3 className="summary-heading mt-6">Enter Payment Details (Mock)</h3>
            <MockStripeElement onDetailsChange={setIsPaymentValid} />

            {/* Action Buttons */}
            <div className="action-buttons justify-between">
                <button 
                    onClick={() => setStep(1)} 
                    className="secondary-button"
                    disabled={isProcessing}
                >
                    <ArrowLeft className="button-icon mr-2" /> Back to Review
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="primary-button"
                    disabled={isProcessing || !isPaymentValid || totalCalc.total === 0}
                >
                    {isProcessing ? 'Processing...' : `Pay ₹${totalCalc.total.toFixed(2)}`}
                    <Lock className="button-icon ml-2" />
                </button>
            </div>
        </div>
    );
};

// Step 3: Payment Success
const Step3_Success = ({ totalCalc, student }) => (
    <div className="success-box">
        <Check className="success-icon" />
        <h2 className="success-message">Payment Successful!</h2>
        <p className="success-details">
            Thank you, **{student.name}**. Your payment of **₹{totalCalc.total.toFixed(2)}** for the **{DUE_MONTH}** hostel fees has been processed successfully.
        </p>
        <p className="success-details">
            A confirmation receipt has been sent to your registered email address.
        </p>
        <button 
            onClick={() => window.location.reload()} 
            className="primary-button mt-4"
        >
            Return to Dashboard
        </button>
    </div>
);


// --- Main App Component ---
const App = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [student, setStudent] = useState(null);
  const [totalCalc, setTotalCalc] = useState(calculateTotal([]));

  // Effect to load student data when userId changes
  useEffect(() => {
    const studentData = MOCK_STUDENT_DATA[userId];
    setStudent(studentData || null);
    
    const calculation = calculateTotal(studentData?.fees || []);
    setTotalCalc(calculation);
  }, [userId]);

  const StepMarker = ({ stepNumber, label, currentStep }) => (
    <div className="step-item">
      <div 
        className={`step-marker ${stepNumber === currentStep ? 'step-marker-active' : ''} ${stepNumber < currentStep ? 'step-marker-complete' : ''}`}
      >
        {stepNumber < currentStep ? <Check className="check-icon" /> : stepNumber}
      </div>
      <span className="step-label">{label}</span>
    </div>
  );

  let currentStepComponent;
  switch (step) {
    case 1:
      currentStepComponent = <Step1_FeeReview 
                                setStep={setStep} 
                                student={student} 
                                totalCalc={totalCalc} 
                                userId={userId} 
                                setUserId={setUserId} 
                              />;
      break;
    case 2:
      if (!student) {
        currentStepComponent = <div>Please go back to Step 1 and enter a valid ID.</div>;
        break;
      }
      currentStepComponent = <Step2_PaymentConfirmation 
                                setStep={setStep} 
                                student={student} 
                                totalCalc={totalCalc} 
                              />;
      break;
    case 3:
      currentStepComponent = <Step3_Success student={student} totalCalc={totalCalc} />;
      break;
    default:
      currentStepComponent = <div>Error: Invalid Step</div>;
  }

  const progressWidth = (step - 1) * 50; 

  return (
    <div className="payment-app">
      <style>{`
        /* * Custom CSS for the Hostel Fee Payment Component.
         * This file implements a fully responsive, blue-themed design using standard CSS.
         */

        /* --- Custom Variables & Theme (Blue Focus) --- */
        :root {
            --primary-blue: #3b82f6;      
            --light-blue: #eff6ff;        
            --medium-blue: #93c5fd;       
            --dark-blue: #1e40af;         
            --gray-bg: #f9fafb;           
            --text-primary: #1f2937;      
            --text-secondary: #4b5563;    
            --shadow-color: rgba(0, 0, 0, 0.15); 
        }

        /* Base Body and App Container */
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: var(--gray-bg);
        }

        .payment-app {
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 1rem;
            box-sizing: border-box;
        }

        @media (min-width: 640px) {
            .payment-app {
                align-items: center; 
            }
        }

        /* Main Card Container */
        .payment-card {
            width: 100%;
            max-width: 48rem; 
            background-color: #ffffff;
            box-shadow: 0 10px 25px var(--shadow-color);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            box-sizing: border-box;
        }

        @media (min-width: 768px) {
            .payment-card {
                padding: 2.5rem;
            }
        }

        /* Header */
        .header-title {
            font-size: 1.875rem; 
            font-weight: 800; 
            color: var(--text-primary);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            line-height: 1;
        }

        .header-icon {
            width: 1.75rem; 
            height: 1.75rem; 
            margin-right: 0.5rem;
            color: var(--primary-blue);
        }

        /* --- Step Navigation --- */
        .step-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 1rem;
            position: relative;
            margin-bottom: 2rem;
        }

        /* Progress Bar Track */
        .progress-bar-track {
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 4px;
            background-color: #e5e7eb;
            transform: translateY(-50%);
            margin-left: 2.5rem;
            margin-right: 2.5rem;
        }

        /* Progress Bar Fill */
        .progress-bar-fill {
            height: 100%;
            background-color: var(--primary-blue);
            transition: width 500ms ease-in-out;
        }

        /* Step Item */
        .step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10; 
        }

        /* Step Marker (Circle) */
        .step-marker {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #ffffff;
            background-color: #9ca3af; 
            transition: background-color 300ms ease;
            box-shadow: 0 0 0 4px #ffffff; 
        }

        .step-marker-active {
            background-color: var(--primary-blue);
            box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px var(--medium-blue);
        }

        .step-marker-complete {
            background-color: var(--dark-blue);
        }

        .check-icon {
            width: 1.25rem;
            height: 1.25rem;
        }

        .step-label {
            font-size: 0.75rem; 
            margin-top: 0.25rem;
            color: var(--text-secondary);
            display: none; 
        }

        @media (min-width: 640px) {
            .step-label {
                display: block; 
            }
        }

        /* --- Step Content --- */
        .step-content {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .step-heading {
            font-size: 1.25rem; 
            font-weight: 600;
            color: var(--text-primary);
            display: flex;
            align-items: center;
        }

        .heading-icon {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.5rem;
            color: var(--primary-blue);
        }

        /* --- Info Card (Student Details) --- */
        .info-card {
            background-color: var(--light-blue);
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--medium-blue);
        }

        .info-heading {
            font-size: 1rem;
            font-weight: 700;
            color: var(--dark-blue);
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--medium-blue);
            padding-bottom: 0.5rem;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem 1rem;
            font-size: 0.875rem; 
        }

        .info-label {
            font-weight: 500;
            color: var(--text-secondary);
        }

        .info-value {
            font-weight: 600;
            color: var(--text-primary);
        }

        /* --- Fee Item List --- */
        .fee-item-list {
            border: 1px solid #d1d5db;
            border-radius: 0.75rem;
            overflow: hidden;
            margin-top: 1.5rem;
        }

        .fee-list-header {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            background-color: var(--medium-blue);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.875rem;
        }

        .fee-item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            font-size: 0.875rem;
            border-top: 1px solid #e5e7eb;
        }

        /* Zebra striping */
        .fee-item-row:nth-child(even) {
            background-color: #f9fafb;
        }

        .late-fee-row {
            background-color: #fee2e2; 
            border-top: 1px solid #fca5a5;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            font-size: 0.875rem;
        }

        .fee-name {
            color: var(--text-secondary);
        }

        .late-fee-name {
            color: #b91c1c; 
            font-weight: 600;
        }

        .fee-amount {
            font-weight: 500;
            color: var(--text-primary);
        }

        .late-fee-amount {
            color: #b91c1c;
            font-weight: 600;
        }

        .fee-total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background-color: var(--light-blue);
            font-size: 1.25rem; 
            font-weight: 800;
            color: var(--dark-blue);
            border-top: 2px solid var(--primary-blue);
        }

        /* Alert Box */
        .late-fee-alert {
            font-size: 0.875rem;
            text-align: center;
            color: #b91c1c;
            background-color: #fee2e2;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #fca5a5;
        }

        /* --- Summary Box (Step 2) --- */
        .summary-box {
            border: 1px solid var(--medium-blue);
            border-radius: 0.5rem;
            padding: 1.5rem;
        }

        .summary-heading {
            font-size: 1.125rem; 
            font-weight: 600;
            color: var(--dark-blue);
            margin-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.5rem;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px dashed #e5e7eb;
            font-size: 0.9375rem;
        }
        .summary-row:last-of-type {
            border-bottom: none;
        }

        .summary-label {
            font-weight: 500;
            color: var(--text-secondary);
        }

        .summary-value {
            font-weight: 600;
            color: var(--text-primary);
        }

        .summary-total-row {
            display: flex;
            justify-content: space-between;
            padding-top: 1rem;
            margin-top: 1rem;
            border-top: 2px solid var(--primary-blue);
            font-weight: 800;
            font-size: 1.25rem; 
            color: var(--primary-blue);
        }

        /* --- Payment Element Placeholder --- */
        .payment-element-box {
            padding: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            background-color: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            text-align: center;
            color: var(--text-secondary);
            font-style: italic;
        }

        .stripe-input-mock {
            width: 100%;
            padding: 0.75rem;
            margin-top: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            background-color: #fafafa;
            color: var(--text-primary);
            font-style: normal;
            text-align: left;
            transition: border-color 200ms;
        }
        .stripe-input-mock:focus {
            outline: none;
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 1px var(--primary-blue);
        }
        .w-1\/2 { width: calc(50% - 0.25rem); }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .ml-2 { margin-left: 0.5rem; }
        .mr-2 { margin-right: 0.5rem; }
        .align-sub { vertical-align: sub; }
        .h-3 { height: 0.75rem; }
        .w-3 { width: 0.75rem; }
        .text-xs { font-size: 0.75rem; }
        .text-gray-500 { color: #6b7280; }
        .flex { display: flex; }
        .space-x-2 > * + * { margin-left: 0.5rem; }
        .w-full { width: 100%; }
        .p-3 { padding: 0.75rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .text-lg { font-size: 1.125rem; }
        .font-mono { font-family: monospace; }
        .transition { transition-property: all; }
        .focus\:border-primary-blue:focus { border-color: var(--primary-blue); }
        .focus\:ring-1:focus { box-shadow: 0 0 0 1px var(--primary-blue); }


        /* --- Action Buttons --- */
        .action-buttons {
            display: flex;
            margin-top: 2rem;
        }

        .justify-end {
            justify-content: flex-end;
        }

        .justify-between {
            justify-content: space-between;
        }

        /* Primary Button (Blue) */
        .primary-button {
            background-color: var(--primary-blue);
            color: #ffffff;
            font-weight: 600;
            padding: 0.75rem 1.5rem; 
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            transition: all 300ms ease;
            display: flex;
            align-items: center;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4); 
        }

        .primary-button:hover:not(:disabled) {
            background-color: var(--dark-blue);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(59, 130, 246, 0.6);
        }

        .primary-button:disabled {
            background-color: #93c5fd; 
            cursor: not-allowed;
            opacity: 0.7;
            box-shadow: none;
            transform: translateY(0);
        }

        /* Secondary Button (Back) */
        .secondary-button {
            background-color: transparent;
            color: var(--text-secondary);
            font-weight: 600;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 300ms ease;
            display: flex;
            align-items: center;
        }

        .secondary-button:hover:not(:disabled) {
            color: var(--primary-blue);
            background-color: #e5e7eb;
            border-color: #d1d5db;
        }

        .button-icon {
            width: 1rem;
            height: 1rem;
        }

        /* --- Success Box (Step 3) --- */
        .success-box {
            text-align: center;
            color: #155724; 
            background-color: #d4edda; 
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid #c3e6cb;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .success-icon {
            width: 2.5rem;
            height: 2.5rem;
            color: #28a745; 
            margin: 0 auto;
        }

        .success-message {
            font-size: 1.5rem; 
            font-weight: 700;
            color: #155724;
            margin-bottom: 0.5rem;
        }

        .success-details {
            color: #383d41;
            line-height: 1.5;
            font-size: 1rem;
        }

        .success-box .primary-button {
            margin-top: 1rem;
        }
      `}</style>
      <div className="payment-card">
        <h1 className="header-title">
          <Home className="header-icon" />
          Hostel Fee Payment
        </h1>

        {/* Step Navigation */}
        <div className="step-navigation">
          {/* Progress Bar */}
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          
          <StepMarker stepNumber={1} label="Fee Review" currentStep={step} />
          <StepMarker stepNumber={2} label="Payment" currentStep={step} />
          <StepMarker stepNumber={3} label="Success" currentStep={step} />
        </div>
        
        {/* Main Content */}
        <div className="main-content">
            {currentStepComponent}
        </div>
        
      </div>
    </div>
  );
};

export default App;
