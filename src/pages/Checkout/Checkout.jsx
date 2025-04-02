// src/pages/Checkout.jsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import "./Checkout.css";
import PropTypes from "prop-types";


const stripePromise = loadStripe("pk_test_51R0pjqP1jnBE1veqsiXWTUll0H44mEoupgzDAnrFyjZ9pUPNHZ3aGViTzT49nYDchBr0F6UhI6V7kMA3DV2OFi3Z00XUhmPX1A");

const PremiumCheckout = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/plans?result=success",
            },
        });

        if (error) {
            console.error("Error de pago:", error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <PaymentElement />
            <button className="btn-blue" disabled={!stripe}>Pagar</button>
        </form>
    );
};

PremiumCheckout.propTypes = {
    clientSecret: PropTypes.string.isRequired,
};

const Checkout = () => {
    const location = useLocation();
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const secret = params.get("clientSecret");
        if (secret) setClientSecret(secret);
    }, [location]);

    return (
        <div className="checkout-wrapper">
            <img src="/vibrablanco.png" alt="Logo" className="checkout-logo"/>
            <h2 className="checkout-title">Confirma tu suscripción a Vibra Premium</h2>

            {clientSecret ? (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret,
                        appearance: {
                            theme: "night",
                            variables: {
                                colorText: "#79e2ff",
                                fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
                                colorPrimary: "#79e2ff",
                                spacingUnit: "4px",
                                borderRadius: "8px"
                            }
                        }
                    }}
                >
                    <PremiumCheckout clientSecret={clientSecret} />
                </Elements>
            ) : (
                <p style={{ color: "white" }}>Cargando...</p>
            )}

        </div>
    );
};

export default Checkout;
