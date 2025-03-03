import React from "react";
import "./Subs.css"; // Archivo CSS para los estilos

const plans = [
  {
    name: "Gratuito",
    price: "0 € durante toda la vida",
    features: [
      "Reproducción con anuncios",
      "Anuncios visuales y de audio",
      "Podrás saltar 5 canciones al día"
    ],
    after: "0 €/mes",
    buttonText: "Pasar a Gratuito",
    note: "0 € durante toda la vida. Al cancelar una suscripción de pago, se activará esta suscripción automáticamente.",
    color: "#ffb6c1",
    logo: "../vibrarosa.png"
  },
  {
    name: "Premium",
    price: "4,99 € al mes",
    features: [
      "Experiencia libre de anuncios",

      "Saltar ilimitadas canciones al día",
      "Cancela cuando quieras"
    ],
    after: "4,99 €/mes",
    buttonText: "Pasar a Premium",
    note: "4,99 € al mes. Al cancelar esta suscripción, se activará la suscripción Gratuita.",
    color: "#b0c4de",
    logo: "../vibraazul.png"
  }
];

const SubCard = ({ plan }) => {
  return (
    <div className="sub-card">
      <img
        src={plan.logo}
        alt="Vibra Logo"
        className="logo"
        onClick={() => window.location.reload()}
      />
      <span className={plan.name}>{plan.name}</span>
      <p className="price">{plan.price}</p>
      {plan.after && <p className="after">{plan.after}</p>}
      <hr className="line"></hr>
      <ul>
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <hr className="line"></hr>
      <button style={{ backgroundColor: plan.color }}>{plan.buttonText}</button>
      <p className="note">{plan.note}</p>
    </div>
  );
};

const Subs = () => {
  return (
    <div className="subs-container">
      {plans.map((plan, index) => (
        <SubCard key={index} plan={plan} />
      ))}
    </div>
  );
};

export default Subs;