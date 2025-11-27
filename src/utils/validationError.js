function validationError(backendErrors, setError) {
  
  // Set errors in React Hook Form
  Object.entries(fieldErrors).forEach(([field, message]) => {
    // If it's an array of messages, join them into one string
    const msg = Array.isArray(message) ? message.join(", ") : message;
    setError(field, {
      type: "server",
      message: msg,
    });
  });


}

export default validationError