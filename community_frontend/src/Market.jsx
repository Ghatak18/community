import React from "react";
import { useNavigate } from "react-router-dom";

export default function Market() {
    const navigate = useNavigate();

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            //backgroundColor: "#f4f4f4"
        }}>
            <h1 style={{ marginBottom: "30px" }}>Welcome to the Market</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                <button
                    style={{
                        padding: "15px 30px",
                        fontSize: "18px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none"
                    }}
                    onClick={() => navigate("/buywater")}
                >
                    💧 Buy Water
                </button>

                <button
                    style={{
                        padding: "15px 30px",
                        fontSize: "18px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none"
                    }}
                    onClick={() => navigate("/buyelectric")}
                >
                    ⚡ Buy Electricity
                </button>
            </div>
        </div>
    );
}
