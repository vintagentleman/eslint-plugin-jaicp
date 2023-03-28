const globals = require("./globals");

const es5 = {
  globals: globals.es5,
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
    },
    ecmaVersion: 5,
    sourceType: "script",
  },
};

const es6 = {
  globals: globals.es6,
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
};

module.exports = { es5, es6 };
