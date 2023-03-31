// TODO Implement `plugin:jaicp/recommended` including rules from the style guide.

const rules = {
  // A common pattern is to modify `$context` properties in `bind` callbacks.
  "no-param-reassign": [
    "error",
    {
      props: true,
      ignorePropertyModificationsForRegex: ["^\\$?(context|ctx)$"],
    },
  ],
};

module.exports = rules;
