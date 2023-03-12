const CustomApiError = (message, code, status, statusText) => {
  const error = new Error(message);

  error.code = code;

  error.response = {
    status,
    statusText,
  };

  return error;
};

export default CustomApiError;