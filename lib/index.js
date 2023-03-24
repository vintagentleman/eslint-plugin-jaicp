/**
 * @fileoverview An ESLint plugin to extract and lint scripts from JAICP DSL files
 * @author Konstantin Sipunin
 */
"use strict";

const { preprocess } = require("./processor");
const { es5Globals, es6Globals } = require("./globals");

module.exports = {
  environments: {
    es5: {
      globals: es5Globals,
    },
    es6: {
      globals: es6Globals,
    },
  },
  configs: {
    es5: {
      plugins: ["jaicp"],
      env: {
        "jaicp/es5": true,
      },
    },
    es6: {
      plugins: ["jaicp"],
      env: {
        "jaicp/es6": true,
        es6: true,
      },
    },
  },
  rules: {},
  processors: {
    ".sc": {
      preprocess,
      supportsAutofix: true,
    },
  },
};
