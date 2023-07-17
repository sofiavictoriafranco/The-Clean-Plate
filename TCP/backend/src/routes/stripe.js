const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);
const express = require("express");
const { Router } = require("express");
const router = Router();
const { createOrder } = require("../controllers/createOrderDbControllers");
const { stockUpdateDb } = require("../controllers/stockUpdateDbControllers");

router.post("/create-checkout-session", express.json(), async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.item),
      },
    });

    const line_items = req.body.item?.map((el) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: el.name,
            images: [el.image],
            description: el.category,
            metadata: {
              id: el.id,
            },
          },
          unit_amount: Math.round(el.price * 100),
        },
        quantity: el.cartAmount,
      };
    });

    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      customer: customer.id,
      line_items,
      mode: "payment",
      // success_url: "http://localhost:5173/#/CheckoutSuccess",
      // cancel_url: "http://localhost:5173/#/cart",

      //!DEPLOY
       success_url: "https://the-clean-plate.vercel.app/#/CheckoutSuccess",
      cancel_url: "http://the-clean-plate.vercel.app/#/cart",
    });
    // console.log("session console", session);
    res.send({ url: session.url });
  } catch (error) {
    console.log(error);
  }
});

// const success = (status, res) => {
//   res.send(status);
//   console.log("*******", status);
// };
// router.get("/success", success);

//successe response

//stripe webhook

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const endpointSecret = process.env.ENDPOINT;
    const payload = request.body;
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      console.log("verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    const data = event.data.object;
    // Handle the event1
    if (event.type === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data);
          stockUpdateDb(customer);
        })

        // .then(() => {
        //   const status = data.payment_status;
        //   success(status);
        // })
        .catch((error) => console.log(error.message));
    }

    response.json(data.payment_status);
  }
);

module.exports = router;
