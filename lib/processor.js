const JS_BLOCK_BEGIN_REGEX = /^(?<indent> *)(init:|script(?:Es6)?:)\s*$/; // Inline JS (`if`, `{{ }}`) is not linted
const JS_BLOCK_END_REGEX = /^(?<indent> *)(\w+!?:|#)/; // Block boundaries can be other tags or hash comments

const HASH_COMMENT_REGEX = /^(?<indent> *)#/;
const LEADING_SPACE_REGEX = /^(?<indent> *)/;

class ScriptBlock {
  constructor(tagLine, tagColumn) {
    this.tagLine = tagLine;
    this.tagColumn = tagColumn;

    this.scriptIndent = undefined;
    this.scriptLines = [];
  }

  addLine(line) {
    // Hash comments at line beginnings are allowed in `.sc` files.
    // Here they are replaced with regular `//` comments so ESLint doesn't complain.
    this.scriptLines.push(line.replace(HASH_COMMENT_REGEX, "$<indent>//"));
  }

  toString() {
    // The leading indentation is trimmed before the line is saved to be processed by ESLint.
    // This indentation is restored in `postprocess`.
    return this.scriptLines.map((line) => line.slice(this.scriptIndent)).join("\n");
  }
}

const blockContext = {};

/**
 *
 * @param {string} text - Contents of the `.sc` file to be processed.
 * @param {string} filename - Absolute file name.
 * @returns {Object[]} - Array of code blocks to lint.
 */
const preprocess = (text, filename) => {
  const lines = text.split(/\r?\n/);
  blockContext[filename] = [];
  let currentBlock;

  lines.forEach((line, index) => {
    if (currentBlock === undefined) {
      const match = line.match(JS_BLOCK_BEGIN_REGEX);
      if (match) {
        currentBlock = new ScriptBlock(index + 1, match.groups.indent.length);
      }
      return;
    }

    const match = line.match(JS_BLOCK_END_REGEX);

    if (match && match.groups.indent.length <= currentBlock.tagColumn) {
      blockContext[filename].push(currentBlock);
      currentBlock = undefined;
      return;
    }

    if (currentBlock.scriptIndent === undefined) {
      currentBlock.scriptIndent = line.match(LEADING_SPACE_REGEX).groups.indent.length;
    }
    currentBlock.addLine(line);
  });

  return blockContext[filename].map((block) => block.toString());
};

/**
 *
 * @param {Message[][]} blocks - Array of arrays of lint messages related to each block returned from `preprocess`.
 * @param {string} filename - Absolute file name.
 * @returns {Message[]} Array of lint messages to display to the user.
 */
const postprocess = (blocks, filename) => {
  const newMessages = [];
  const fileBlockContext = blockContext[filename];

  blocks.forEach((messages, index) => {
    const block = fileBlockContext[index];

    messages.forEach((message) => {
      newMessages.push({
        ...message,
        line: message.line + block.tagLine,
        column: message.column + block.scriptIndent,
        endLine: message.endLine ? message.endLine + block.tagLine : undefined,
        endColumn: message.endColumn ? message.endColumn + block.scriptIndent : undefined,
      });
    });
  });

  return newMessages;
};

module.exports = {
  preprocess,
  postprocess,
};
