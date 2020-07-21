//#region > Imports
//> Express
// Node.js Framework used to build web applications and APIs
const express = require("express");

//> Additional
/**
 * Node.js body parsing middleware.
 * Parse incoming request bodies in a middleware before your handlers.
 */
const bodyParser = require("body-parser");
// Providing a Connect/Express middleware to enable CORS
const cors = require("cors");

//> Configuration
// Basic Express config
const config = require("./config");

//> Routes
const routes = require("./routes");
//#endregion

//#region > Initializers
// Init Express application
const app = express();
// Get .env values
require("dotenv").config();

app.use(cors(config.corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(config.centralErrorHandler);
app.use("/", routes);

app.listen(config.port, () => {
  console.log(`Server is up and running at http://localhost:${config.port}`);
});

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
