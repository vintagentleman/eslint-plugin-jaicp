/**
 * @fileoverview An ESLint plugin to extract and lint scripts from JAICP DSL files
 * @author Konstantin Sipunin
 */
"use strict";

const { jaicpProcessor } = require("./processors");

module.exports = {
  rules: {},
  processors: {
    ".sc": jaicpProcessor,
  },
};
