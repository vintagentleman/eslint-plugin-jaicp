/**
 * @fileoverview An ESLint plugin to extract and lint scripts from JAICP DSL files.
 * @author Konstantin Sipunin
 */

"use strict";

const merge = require("deepmerge");
const processor = require("./processor");
const globals = require("./globals");

const environments = {
  "es5:script": {
    globals: globals.es5,
    parserOptions: {
      ecmaFeatures: {
        globalReturn: true,
        impliedStrict: true,
      },
      ecmaVersion: 5,
      sourceType: "script",
    },
  },
  "es6:script": {
    globals: globals.es6,
    parserOptions: {
      ecmaFeatures: {
        globalReturn: true,
        impliedStrict: true,
      },
      ecmaVersion: 13,
      sourceType: "script",
    },
  },
};

const overrides = [
  {
    files: ["*.sc"],
    processor: "jaicp/jaicp",
  },
  {
    files: ["**/*.sc/*.es5.js"],
    env: {
      "jaicp/es5:script": true,
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
      "jaicp/es6:script": true,
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
    ...environments,
    "es5:file": merge(environments["es5:script"], {
      parserOptions: {
        ecmaFeatures: {
          globalReturn: false,
        },
      },
    }),
    "es6:file": merge(environments["es6:script"], {
      parserOptions: {
        ecmaFeatures: {
          globalReturn: false,
        },
        sourceType: "module",
      },
    }),
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
            "jaicp/es5:file": true,
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
            "jaicp/es6:file": true,
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
