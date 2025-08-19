// BuyWater.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BuyWater() {
    const [liters, setLiters] = useState("");
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedLiters = localStorage.getItem("orderedLiters");
        // If coming back from payment with success
        if (location.state?.paymentSuccess && savedLiters) {
            setLiters(savedLiters);
            setOrderConfirmed(true);
        }
    }, [location.state]);

    const handleBuy = async () => {
        try {
            const litersNum = parseFloat(liters);
            if (liters && !isNaN(litersNum) && litersNum > 0) {
                // Save to localStorage before going to payment
                localStorage.setItem("orderedLiters", liters);
            }

            const res = await axios.post("http://localhost:3000/1/buywater", {
                requiredUnit: parseInt(liters, 10)
            });

            if (res.data) {
                navigate('/payment', { 
                    state: { 
                        requiredAmount: res.data.requiredAmount, 
                        orderId: res.data.orderId,
                        from: "/buywater"
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
            <h2>Buy Water</h2>

            {!orderConfirmed && (
                <>
                    <label>
                        Liters:
                        <input
                            type="number"
                            value={liters}
                            onChange={(e) => setLiters(e.target.value)}
                            placeholder="Enter liters"
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
                    🚰 Water Delivered: {liters} {parseFloat(liters) === 1 ? "liter" : "liters"}
                </h2>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
