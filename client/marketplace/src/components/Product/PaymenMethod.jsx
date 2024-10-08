// src/components/PaymentMethod.jsx
import React from "react";

const PaymentMethod = ({ name, icon }) => {
  return (
    <div className="payment-method flex items-center">
      <img src={icon} alt={name} className="payment-icon mr-2" />
      <span>{name}</span>
    </div>
  );
};

export default PaymentMethod;
