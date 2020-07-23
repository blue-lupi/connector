//#region > Imports
//> Express
// Node.js Framework used to build web applications and APIs
const express = require("express");

//> Services
// Shopify Service
const shopify = require("../services/shopify.js");
//#endregion

//#region > Routes
const router = express.Router();

router.post("/orders", (req, res) => {
  if (req.body.orderId) {
    // Returns details of one specific order
    shopify
      .getOrderDetails(req.body.orderId)
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    // Returns all orders
    shopify
      .getOrders()
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

router.post("/products", (req, res) => {
  shopify
    .getAvailable()
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
//#endregion

//#region > Exports
module.exports = router;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
