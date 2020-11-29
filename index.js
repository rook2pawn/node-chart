const lib = require("./lib");
const app = require("./app");

lib.DOMContentLoadedPromise.then(app);
