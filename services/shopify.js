//#region > Imports
const { request, GraphQLClient } = require("graphql-request");
// Request is designed to be the simplest way possible to make http calls
//const request = require("request");
const query = require("../queries/index.js");
//#endregion

//#region > Functions
// Get all orders
function getOrders() {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPass = process.env.SHOPIFY_API_PASS;
    const shopname = "bluelupi";
    const apiVersion = "2020-07";
    const resource = "orders";

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
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPass = process.env.SHOPIFY_API_PASS;
    const shopname = "bluelupi";
    const apiVersion = "2020-07";
    const resource = "orders";

    request.get(
      `https://${apiKey}:${apiPass}@${shopname}.myshopify.com/admin/api/${apiVersion}/${resource}/${orderId}.json`,
      (error, response, body) => {
        if (error !== null || !body) {
          reject("Error receiving order: " + error);
        } else {
          // JSON parse the response body
          const details = JSON.parse(body);

          if (details.order) {
            resolve({
              buyer_accepts_marketing: details.order.buyer_accepts_marketing,
              checkout_id: details.order.checkout_id,
              confirmed: details.order.confirmed,
              currency: details.order.currency,
              created_at: details.order.created_at,
              status: {
                paid: details.order.financial_status === "paid" ? true : false,
                fulfilled:
                  details.order.fulfillment_status === "fulfilled"
                    ? true
                    : false,
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
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

// Get available quantity per product
function getAllProducts() {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPass = process.env.SHOPIFY_API_PASS;
    const shopname = "bluelupi";
    const apiVersion = "2021-01";

    // Define basic URL for query
    const queryUrl = `https://${shopname}.myshopify.com/admin/api/${apiVersion}/graphql.json`;

    try {
      const client = new GraphQLClient(queryUrl, {
        headers: {
          "X-Shopify-Access-Token": "5a905e875d40479bf73ec5576621416c",
        },
      });

      client.request(query.query).then((data) => {
        let products = data.products.edges.map((product) => {
          const info = product.node;

          return {
            collection: info.collections.edges[0]
              ? info.collections.edges[0].node.handle
              : null,
            descriptionHtml: info.descriptionHtml,
            id: info.id,
            options: info.options,
            tags: info.tags,
            title: info.title,
            variants: info.variants,
          };
        });

        resolve(products);
      });
    } catch (e) {
      // Anweisungen für jeden Fehler
      console.log(e); // Fehler-Objekt an die Error-Funktion geben
    }
  });
}
//#endregion

//#region > Exports
module.exports.getOrders = getOrders;
module.exports.getOrderDetails = getOrderDetails;
module.exports.getAllProducts = getAllProducts;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
