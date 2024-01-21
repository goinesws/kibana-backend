// routes/paymentRoutes.js

const express = require('express');
const PaymentModel = require('../models/paymentModel');

const router = express.Router();
const paymentModel = new PaymentModel();

router.post('/process-payment', async (req, res) => {
  const paymentDetails = req.body;
  const result = await paymentModel.processPayment(paymentDetails);
  res.json(result);
});

router.post('/refund-payment', async (req, res) => {
  const transactionId = req.body.transactionId;
  const result = await paymentModel.refundPayment(transactionId);
  res.json(result);
});

module.exports = router;
