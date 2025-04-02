
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "#utils/apiFetch";
import "./Plans.css";

const PlanCard = ({ title, features, price, color, onClick }) => (
    <div className="plan-card" style={{ borderColor: color }}>
        <h2 className="plan-title" style={{ color }}>{title}</h2>
        <p className="plan-price">{price}</p>
        <ul>
            {features.map((f, idx) => <li key={idx}>{f}</li>)}
        </ul>
        <button
            className="plan-button"
            style={{backgroundColor: color}}
            onClick={onClick}
        >
            Seleccionar
        </button>

    </div>
);

PlanCard.propTypes = {
    title: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    price: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

const Plans = () => {

    const navigate = useNavigate();

    const cambiarAGratis = () => {
        localStorage.setItem("is_premium", "false");
        navigate("/account?plan=gratis");
    };


    const iniciarPago = async () => {
        const res = await apiFetch("/stripe/create-payment-intent", {
            method: "POST",
            body: {}
        });
        const secret = res.clientSecret;
        navigate(`/checkout?clientSecret=${encodeURIComponent(secret)}`);
    };

    return (
        <div className="plans-wrapper">
            <img src="/vibrablanco.png" alt="Logo" className="plans-logo" />

            <section className="plans-intro">
                <h1 className="plans-title">Siente la diferencia</h1>
                <p className="plans-subtitle">
                    Pásate a Premium y disfruta del control total de lo que escuchas. Cancela cuando quieras.
                </p>

                <div className="comparison-table">
                    <div className="table-header">
                        <span>Qué incluye</span>
                        <span>Plan Gratuito</span>
                        <span>Plan Premium</span>
                    </div>
                    <div className="table-row">
                        <span>Escucha tu música favorita sin anuncios</span>
                        <span>—</span>
                        <span>✅</span>
                    </div>
                    <div className="table-row">
                        <span>Escucha la canción que quieras en el momento que quieras</span>
                        <span>—</span>
                        <span>✅</span>
                    </div>
                </div>
            </section>

            <div className="plans-container">
                <PlanCard
                    title="Plan Gratuito"
                    price="0€/mes"
                    color="#FF6B6B"
                    features={["Reproducción con anuncios", "5 saltos por día", "Publicidad visual"]}
                    onClick={cambiarAGratis}
                />
                <PlanCard
                    title="Plan Premium"
                    price="4,99€/mes"
                    color="#79e2ff"
                    features={["Sin anuncios", "Saltos ilimitados", "Cancela cuando quieras"]}
                    onClick={iniciarPago}
                />
            </div>

            <section className="plans-faq">
                <h2 className="faq-title">¿Tienes alguna pregunta?</h2>
                {[
                    {
                        q: "¿Puedo cancelar mi suscripción premium cuando quiera?",
                        a: "Sí, puedes cancelar tu suscripción Premium en cualquier momento desde tu cuenta."
                    },
                    {
                        q: "¿Qué métodos de pago aceptan?",
                        a: "Aceptamos tarjetas de crédito y débito."
                    },
                    {
                        q: "¿Perderé mis playlists si cancelo la suscripción premium?",
                        a: "No, tus playlists y canciones guardadas seguirán disponibles con el plan gratuito."
                    }
                ].map((faq, idx) => (
                    <details key={idx} className="faq-item">
                        <summary>{faq.q}</summary>
                        <p>{faq.a}</p>
                    </details>
                ))}
            </section>
        </div>
    );
};

export default Plans;
