import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { apiFetch } from "#utils/apiFetch";
import "./Plans.css";

const stripePromise = loadStripe("pk_test_51R0pjqP1jnBE1veqsiXWTUll0H44mEoupgzDAnrFyjZ9pUPNHZ3aGViTzT49nYDchBr0F6UhI6V7kMA3DV2OFi3Z00XUhmPX1A");

function PlanCard({ title, features, price, color, onClick }) {
    return (
        <div className="plan-card" style={{ borderColor: color }}>
            <h2 className="plan-title" style={{ color }}>{title}</h2>
            <p className="plan-price">{price}</p>
            <ul>
                {features.map((f, idx) => <li key={idx}>{f}</li>)}
            </ul>
            <button onClick={() => {
                alert(`¡Has elegido el ${title.toLowerCase()}!`);
                onClick();
            }}
                    style={{ backgroundColor: color }}
                    className="plan-button">Seleccionar</button>
        </div>
    );
}

const PremiumCheckout = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/subs?result=success",
            },
        });

        if (error) {
            console.error("Error de pago:", error.message);
            alert("Error en el pago: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <PaymentElement />
            <button className="btn-blue" disabled={!stripe}>Pagar</button>
        </form>
    );
};

const Plans = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const result = params.get("result");
        if (result === "success") {
            localStorage.setItem("is_premium", "true");
            alert("¡Ahora eres Premium!");
            navigate("/account");
        }
    }, [location]);

    const cambiarAGratis = async () => {
        const response = await apiFetch("/user/premium", {
            method: "POST",
            body: { is_premium: false }
        });

        if (response) {
            localStorage.setItem("is_premium", "false");
            setIsPremium(false);
            navigate(-1);
        } else {
            alert("Error al cambiar de plan");
        }
    };

    const iniciarPago = async () => {
        const res = await apiFetch("/stripe/create-payment-intent", {
            method: "POST",
            body: {}
        });
        const secret = res.clientSecret;
        setClientSecret(secret);
    };

    return (
        <div className="plans-wrapper">
            <img src="/vibrablanco.png" alt="Logo" className="plans-logo" />
            {clientSecret ? (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret,
                        appearance: {
                            theme: "night",
                            variables: {
                                colorPrimary: "#79e2ff",
                                colorText: "#79e2ff",
                                colorBackground: "#2a2a2a",
                                fontFamily: "'Inter Tight', sans-serif",
                                spacingUnit: "6px",
                                borderRadius: "10px",
                            },
                            rules: {
                                ".Input": {
                                    color: "#79e2ff",
                                },
                                ".Label": {
                                    color: "#79e2ff",
                                },
                            },
                        }
                    }}
                >
                    <PremiumCheckout clientSecret={clientSecret} />
                </Elements>
            ) : (
                <div className="plans-container">
                    <PlanCard
                        title="Plan Gratuito"
                        price="0€/mes"
                        color="#FF6B6B"
                        features={[
                            "Reproducción con anuncios",
                            "5 saltos por día",
                            "Publicidad visual"
                        ]}
                        onClick={cambiarAGratis}
                    />
                    <PlanCard
                        title="Plan Premium"
                        price="4,99€/mes"
                        color="#79e2ff"
                        features={[
                            "Sin anuncios",
                            "Saltos ilimitados",
                            "Cancela cuando quieras"
                        ]}
                        onClick={iniciarPago}
                    />
                </div>
            )}
        </div>
    );
};

export default Plans;

