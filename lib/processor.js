const JS_REGION_BEGIN_REGEX = /^(?<indent>\s*)(?<tag>(?:init|script(?:Es6)?):)\s*$/;
const JS_REGION_END_REGEX = /^(?<indent>\s*)(?<tag>\w+!?:)/;

/**
 *
 * @param {string} text - Contents of the `.sc` file to be processed.
 * @returns {Object[]} - Array of code blocks to lint.
 */
const preprocess = (text) => {
  const lines = text.split(/\r?\n/);

  const blocks = [];
  let currentBlock;

  lines.forEach((line, index) => {
    if (currentBlock === undefined) {
      const match = line.match(JS_REGION_BEGIN_REGEX);

      if (match) {
        // Code block is prepended with newlines to adjust for its position in the `.sc` file.
        // FIXME Ideally, this should be done with the `postprocess` processor method.
        currentBlock = { indent: match.groups.indent.length, text: "\n".repeat(index) };
      }
    } else {
      const match = line.match(JS_REGION_END_REGEX);

      if (match && match.groups.indent.length <= currentBlock.indent) {
        blocks.push({ text: currentBlock.text, filename: "0.js" });
        currentBlock = undefined;
      } else {
        currentBlock.text += "\n" + line;
      }
    }
  });
  return blocks;
};

module.exports = {
  preprocess,
};
