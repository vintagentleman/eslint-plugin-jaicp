const es6 = {
  // A common use case is to modify `$context` properties in `bind` callbacks
  "no-param-reassign": [
    "error",
    {
      props: true,
      ignorePropertyModificationsForRegex: ["^\\$?(context|ctx)$"],
    },
  ],
  // The plugin cannot detect exports from `require`d files and `init`s
  "no-undef": "off",
};

const es5 = {
  ...es6,
  // The plugin cannot detect exported value usages across files
  "no-unused-vars": "off",
};

module.exports = { es5, es6 };
