const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("test key");

// API

// App config
const app = express();

// Middlewares
app.use(cors({origin: true}));
app.use(express.json());

// API Routes
app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log(`Payment request received for: ${total}`);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    console.log("PaymentIntent created:", paymentIntent);

    response.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    response.status(500).send({error: error.message});
  }
});

// Listen Command
exports.api = functions.https.onRequest(app);

// Example Endpoint
// http://127.0.0.1:5001/project-20e2f/us-central1/api
