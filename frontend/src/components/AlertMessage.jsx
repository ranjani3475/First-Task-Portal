import React from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({ show, onClose, message, type }) => {
  return (
    show && (
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <Alert variant={type} onClose={onClose} dismissible>
          {message}
        </Alert>
      </div>
    )
  );
};

export default AlertMessage;
