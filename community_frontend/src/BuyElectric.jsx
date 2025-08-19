// BuyElectric.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BuyElectric() {
    const [units, setUnits] = useState("");
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUnits = localStorage.getItem("orderedUnits");
        // If coming back from payment with success
        if (location.state?.paymentSuccess && savedUnits) {
            setUnits(savedUnits);
            setOrderConfirmed(true);
        }
    }, [location.state]);

    const handleBuy = async () => {
        try {
            const unitsNum = parseFloat(units);
            if (units && !isNaN(unitsNum) && unitsNum > 0) {
                // Save to localStorage before going to payment
                localStorage.setItem("orderedUnits", units, );
            }

            const res = await axios.post("http://localhost:3002/3/buyelectric", {
                requiredUnit: parseInt(units, 10)
            });

            if (res.data) {
                navigate('/payment', { 
                    state: { 
                        requiredAmount: res.data.requiredAmount, 
                        orderId: res.data.orderId,
                        from: "/buyelectric"
                    } 
                });
            } else {
                setError("No payment url received");
            }
        } catch (err) {
            console.error(err);
            setError("There is something wrong.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
            <h2>Buy Electric Units</h2>

            {!orderConfirmed && (
                <>
                    <label>
                        Units:
                        <input
                            type="number"
                            value={units}
                            onChange={(e) => setUnits(e.target.value)}
                            placeholder="Enter units"
                            style={{ marginLeft: "10px" }}
                            min="0.1"
                            step="0.1"
                        />
                    </label>
                    <br />
                    <button
                        onClick={handleBuy}
                        style={{ marginTop: "10px" }}
                    >
                        Buy Now
                    </button>
                </>
            )}

            {orderConfirmed && (
                <h2 style={{ marginTop: "20px", color: "green" }}>
                    ⚡ Electricity Supplied: {units} {parseFloat(units) === 1 ? "unit" : "units"}
                </h2>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
