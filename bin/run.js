#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

require(path.join(path.dirname(fs.realpathSync(__filename)), "..", "lib"))
  .run()
  .then(() => {})
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
