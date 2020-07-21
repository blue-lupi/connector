//#region > Imports
// Request is designed to be the simplest way possible to make http calls
const request = require("request");
//#endregion

//#region > Functions
// Get all orders
function getOrders() {
  return new Promise((resolve, reject) => {
    let apiKey = process.env.SHOPIFY_API_KEY;
    let apiPass = process.env.SHOPIFY_API_PASS;
    let shopname = "bluelupi";
    let apiVersion = "2020-07";
    let resource = "orders";

    request.get(
      `https://${apiKey}:${apiPass}@${shopname}.myshopify.com/admin/api/${apiVersion}/${resource}.json?status=any`,
      (error, response, body) => {
        if (error != null) {
          reject("Error receiving orders: " + error);
        } else {
          resolve(body);
        }
      }
    );
  });
}

// Get details by order id
function getOrderDetails(orderId) {
  return new Promise((resolve, reject) => {
    let apiKey = process.env.SHOPIFY_API_KEY;
    let apiPass = process.env.SHOPIFY_API_PASS;
    let shopname = "bluelupi";
    let apiVersion = "2020-07";
    let resource = "orders";

    request.get(
      `https://${apiKey}:${apiPass}@${shopname}.myshopify.com/admin/api/${apiVersion}/${resource}/${orderId}.json`,
      (error, response, body) => {
        if (error !== null || !body) {
          reject("Error receiving order: " + error);
        } else {
          // JSON parse the response body
          const details = JSON.parse(body);

          resolve({
            buyer_accepts_marketing: details.order.buyer_accepts_marketing,
            checkout_id: details.order.checkout_id,
            confirmed: details.order.confirmed,
            currency: details.order.currency,
            created_at: details.order.created_at,
            status: {
              paid: details.order.financial_status === "paid" ? true : false,
              fulfilled:
                details.order.fulfillment_status === "fulfilled" ? true : false,
              details: details.order.fulfillments,
            },
            items: details.order.line_items,
            name: details.order.name,
            shipping: details.order.shipping_address,
            weight: details.order.total_weight,
            price: {
              tax: {
                included: details.order.tax_included,
                total: details.order.total_tax,
              },
              total: details.order.total_price,
            },
          });
        }
      }
    );
  });
}
//#endregion

//#region > Exports
module.exports.getOrders = getOrders;
module.exports.getOrderDetails = getOrderDetails;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */