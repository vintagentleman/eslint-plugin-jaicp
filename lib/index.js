/**
 * @fileoverview An ESLint plugin to extract and lint scripts from JAICP DSL files
 * @author Konstantin Sipunin
 */
"use strict";

const processor = require("./processor");
const environments = require("./environments");
const rules = require("./rules");

module.exports = {
  environments: {
    es5: environments.es5,
    es6: environments.es6,
  },
  configs: {
    es5: {
      plugins: ["jaicp"],
      env: {
        "jaicp/es5": true,
      },
      rules: rules.es5,
    },
    es6: {
      plugins: ["jaicp"],
      env: {
        "jaicp/es6": true,
        es2022: true,
      },
      rules: rules.es6,
    },
  },
  rules: {},
  processors: {
    ".sc": processor,
  },
};
