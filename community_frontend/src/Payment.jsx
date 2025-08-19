import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentPage() {
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [refundAmount, setRefundAmount] = useState(null);
    const [payingAmount, setPayingAmount] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const { requiredAmount, orderId, from } = location.state || {};

    useEffect(() => {
        if (!requiredAmount || !orderId) {
            navigate(from ||"/");
        }
    }, [requiredAmount, orderId, navigate,from]);

    const handleConfirmPayment = async () => {
        try {
            setIsPaying(true);
            setMessage('');
            setRefundAmount(null);

            console.log("Sending payment:", {
                orderId,
                payingAmount: parseFloat(payingAmount)
            });

            const response = await axios.post('http://localhost:3001/2/pay', {
                orderId,
                payingAmount: parseFloat(payingAmount)
            });

            console.log("Backend Response:", response.data);

            setMessage(response.data.messege || 'Unknown response');

            if (response.data.messege?.toLowerCase().includes('success')) {
                setPaymentSuccess(true);
                setTimeout(() => {
                    navigate(from || "/", { state: { paymentSuccess: true } });
                 }, 1000);
               // setTimeout(navigate("/buywater", { state: { paymentSuccess: true } }));
            } else {
                if (response.data.amount !== undefined) {
                    setRefundAmount(response.data.amount);
                }
            }
        } catch (err) {
            console.error('Payment error:', err);
            setMessage(err.response?.data?.messege || 'Payment processing error');
        } finally {
            setIsPaying(false);
        }
    };

    if (!requiredAmount || !orderId) return null;

    return (
        <div style={{
            maxWidth: '400px',
            margin: 'auto',
            padding: '20px',
            textAlign: 'center'
        }}>
            <h2>Complete Your Payment</h2>

            <div style={{
                margin: '20px 0',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '5px'
            }}>
                <h3>Payment Due: ₹{requiredAmount}</h3>
                <p>Order ID: {orderId}</p>
            </div>

            <label>
                Rupees:
                <input
                    type="number"
                    value={payingAmount}
                    onChange={(e) => setPayingAmount(e.target.value)}
                    placeholder="Enter amount"
                    style={{ marginLeft: "10px" }}
                    min="0.1"
                    step="0.1"
                />
            </label>
            <button
                onClick={handleConfirmPayment}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: isPaying ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isPaying ? 'not-allowed' : 'pointer'
                }}
            >
                {isPaying ? 'Processing...' : 'Confirm Payment'}
            </button>

            {message && (
                <p style={{
                    color: paymentSuccess ? 'green' : 'red',
                    margin: '10px 0'
                }}>
                    {message}
                </p>
            )}

            {refundAmount !== null && !paymentSuccess && (
                <p style={{ color: 'orange' }}>
                    Refunded Amount: ₹{refundAmount}
                </p>
            )}
        </div>
    );
}
