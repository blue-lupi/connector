//#region > Imports
// Request is designed to be the simplest way possible to make http calls
const request = require("request");
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
function getAvailable(collection) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPass = process.env.SHOPIFY_API_PASS;
    const shopname = "bluelupi";
    const apiVersion = "2020-07";
    const resource = "products";

    // Define basic URL for query
    const queryUrl = `https://${apiKey}:${apiPass}@${shopname}.myshopify.com/admin/api/${apiVersion}`;

    request.get(
      `${queryUrl}/${resource}.json`,
      (error, response, body) => {
        if (error != null) {
          reject("Error receiving orders: " + error);
        } else {
          // JSON parse the response body
          const details = JSON.parse(body);

          if (details) {
            let products = [];

            details.products.forEach((product) => {
              products = [
                ...products,
                {
                  id: Buffer.from(product.admin_graphql_api_id).toString(
                    "base64"
                  ),
                  variants: product.variants.map((variant) => {
                    return {
                      id: Buffer.from(variant.admin_graphql_api_id).toString(
                        "base64"
                      ),
                      quantity: variant.inventory_quantity,
                    };
                  }),
                },
              ];
            });
            resolve(products);
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
    const apiVersion = "2020-07";
    const resource = "products";

    // Define basic URL for query
    const queryUrl = `https://${apiKey}:${apiPass}@${shopname}.myshopify.com/admin/api/${apiVersion}`;

    request.get(
      `${queryUrl}/${resource}.json`,
      (error, response, body) => {
        if (error != null) {
          reject("Error receiving orders: " + error);
        } else {
          // JSON parse the response body
          const details = JSON.parse(body);

          if (details) {
            resolve(details?.products);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}
//#endregion

//#region > Exports
module.exports.getOrders = getOrders;
module.exports.getOrderDetails = getOrderDetails;
module.exports.getAvailable = getAvailable;
module.exports.getAllProducts = getAllProducts;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
