const axios = require("axios");

const paystack = () => {
  const initializepayment = async (form) => {
    try {
      const options = {
        url: "https://api.paystack.co/transaction/initialize",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        data: form,
      };

      const response = await axios.post(options.url, options.data, {
        headers: options.headers,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const verifypayment = async (ref) => {
    try {
      const options = {
        url: `https://api.paystack.co/transaction/verify/${ref}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(options.url, {
        headers: options.headers,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    }
  };
  return { initializepayment, verifypayment };
};

module.exports = paystack;
