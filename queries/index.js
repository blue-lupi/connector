const { gql } = require("graphql-request");

const query = gql`
  query GetProducts {
    ... on QueryRoot {
      products(first: 25) {
        edges {
          node {
            id
            collections(first: 1) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
            tags
            title
            options {
              id
              name
              values
            }
            descriptionHtml
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  inventoryQuantity
                  image {
                    id
                    src
                  }
                  price
                  availableForSale
                  selectedOptions {
                    value
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

module.exports.query = query;
