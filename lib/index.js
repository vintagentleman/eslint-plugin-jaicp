/**
 * @fileoverview An ESLint plugin to extract and lint scripts from JAICP DSL files.
 * @author Konstantin Sipunin
 */

"use strict";

const processor = require("./processor");
const globals = require("./globals");

const overrides = [
  {
    files: ["*.sc"],
    processor: "jaicp/jaicp",
  },
  {
    files: ["**/*.sc/*.es5.js"],
    env: {
      "jaicp/es5": true,
    },
    // The plugin does not detect whether a variable referenced in a `script`/`init` block
    // is defined in a `require`d JavaScript file or another `init` block, or actually not defined.
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.sc/*.es6.js"],
    env: {
      "jaicp/es6": true,
      es2022: true,
    },
    // The same applies to `scriptEs6` blocks.
    // Unfortunately, this disables checking for globals not yet implemented.
    rules: {
      "no-undef": "off",
    },
  },
];

module.exports = {
  environments: {
    es5: {
      globals: globals.es5,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
        ecmaVersion: 5,
        sourceType: "script",
      },
    },
    es6: {
      globals: globals.es6,
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
        ecmaVersion: 13,
        sourceType: "module",
      },
    },
  },
  configs: {
    es5: {
      plugins: ["jaicp"],
      overrides: [
        ...overrides,
        {
          files: ["*.js"],
          excludedFiles: ["**/*.sc/*.es5.js", "**/*.sc/*.es6.js"],
          env: {
            "jaicp/es5": true,
          },
          // In `require`d files, the plugin does not detect either that referenced variables are defined elsewhere,
          // or that their own variable definitions are used elsewhere.
          rules: {
            "no-undef": "off",
            "no-unused-vars": "off",
          },
        },
      ],
    },
    es6: {
      plugins: ["jaicp"],
      overrides: [
        ...overrides,
        {
          files: ["*.js"],
          excludedFiles: ["**/*.sc/*.es5.js", "**/*.sc/*.es6.js"],
          env: {
            "jaicp/es6": true,
            es2022: true,
          },
          // `require`d ES6 files are regular ECMAScript modules and don't need to have any rules overridden.
        },
      ],
    },
  },
  processors: {
    jaicp: processor,
  },
  rules: {},
};
