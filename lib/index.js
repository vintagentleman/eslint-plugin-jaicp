/**
 * @fileoverview An ESLint plugin to extract and lint scripts from JAICP DSL files
 * @author Konstantin Sipunin
 */
"use strict";

const { preprocess } = require("./processor");
const { es5Globals, es6Globals } = require("./globals");

const commonConfig = {
  plugins: ["jaicp"],
  rules: {
    // A common use case is to modify `$context` properties in `bind` callbacks
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsForRegex: ["^\\$?(context|ctx)$"],
      },
    ],
    // Tabs are prohibited in `.sc` files
    "no-tabs": "error",
    // The plugin cannot detect exports from `require`d files and `init`s
    "no-undef": "off",
  },
};

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
      ...commonConfig,
      env: {
        "jaicp/es5": true,
      },
    },
    es6: {
      ...commonConfig,
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
