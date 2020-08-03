// Token duration config
const durationRefreshToken = 129600; // 90 d‬
const durationToken = 900; // 15 min

// Error handler
function centralErrorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  } else if (err.message == "Not allowed by CORS") {
    res.status(401).send("Not allowed from this origin.");
  } else {
    next(err);
  }
}

// allowlisted domains
const allowlist = [
  "https://kaffeerudel.at",
  //"http://localhost:3000",
  "https://dev.kaffeerudel.at",
  "https://aichner.cloud",
];

// Cross-Origin options
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request from origin: " + origin);
    if (allowlist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//#region > Exports
module.exports.centralErrorHandler = centralErrorHandler;
module.exports.durationRefreshToken = durationRefreshToken;
module.exports.durationToken = durationToken;
module.exports.corsOptions = corsOptions;
module.exports.port = process.env.PORT || 8080;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
