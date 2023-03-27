const SCRIPT_TAG_REGEX = /^(?<indent>\s*)(?<tag>(?:init|script(?:Es6)?):)\s*$/;
const ANOTHER_TAG_REGEX = /^(?<indent>\s*)(?<tag>\w+!?:)/;
const HASH_COMMENT_REGEX = /^(?<indent>\s*) #/;

class ScriptBlock {
  constructor(tagLine, tagColumn) {
    this.tagLine = tagLine;
    this.tagColumn = tagColumn;
    this.scriptLines = [];
  }

  addLine(line) {
    // Hash comments at line beginnings are allowed in `.sc` files.
    // Here they are replaced with regular `//` comments so ESLint doesn't complain.
    this.scriptLines.push(line.replace(HASH_COMMENT_REGEX, "$<indent>//"));
  }

  toString() {
    // Code block is prepended with newlines to adjust for its position in the `.sc` file.
    // Ideally, this should be done with the `postprocess` processor method instead.
    return [...new Array(this.tagLine).fill(""), ...this.scriptLines].join("\n");
  }
}
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
      const match = line.match(SCRIPT_TAG_REGEX);

      if (match) {
        currentBlock = new ScriptBlock(index + 1, match.groups.indent.length);
      }
    } else {
      const match = line.match(ANOTHER_TAG_REGEX);

      if (match && match.groups.indent.length <= currentBlock.tagColumn) {
        blocks.push({ text: currentBlock.toString(), filename: `${index}.js` });
        currentBlock = undefined;
      } else {
        currentBlock.addLine(line);
      }
    }
  });

  return blocks;
};

module.exports = {
  preprocess,
};
