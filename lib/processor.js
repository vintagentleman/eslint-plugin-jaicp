/**
 * @fileoverview Processes JAICP DSL files for consumption by ESLint.
 * @author Konstantin Sipunin
 */

/**
 * `vfile` is used to convert positional locations to offsets during autofix postprocessing.
 * TODO Upgrade to latest package versions after migrating the plugin to ESLint flat config.
 */
const vfile = require("vfile");
const vfileLocation = require("vfile-location");

const SCRIPT_BLOCK_START_REGEX = /^(?<indent> *)(?:(?<tag>init|script(?:Es6)?):)(?:(?<whitespace> *)(?<script>.+))?$/;
const SCRIPT_BLOCK_POSSIBLE_END_REGEX = /^(?<indent> *)(?:(?<tag>\w+!?:)|(?<comment>#))?/;
const HASH_COMMENT_REGEX = /^(?<indent> *)(?<comment>#)/;

class ScriptBlock {
  constructor(tagName, tagLine, tagColumn) {
    this.tagName = tagName;
    this.tagLine = tagLine;
    this.tagColumn = tagColumn;

    this.tagLineScript = undefined; // {column: number, content: string}
    this.indentedScript = undefined; // {indent: number, contents: string[]}
  }

  toString() {
    if (this.indentedScript === undefined && this.tagLineScript === undefined) return "";
    if (this.indentedScript === undefined) return this.tagLineScript.content + "\n";

    return [
      this.tagLineScript === undefined ? "" : this.tagLineScript.content + "\n",
      this.indentedScript.contents.map((content) => content.slice(this.indentedScript.indent)).join("\n"),
      "\n",
    ].join("");
  }
}

function getScriptBlocks(text) {
  const lines = text.split(/\r?\n/);
  const scriptBlocks = [];
  let currentBlock;

  lines.forEach((line, index) => {
    // Here, the parser is not in the context of a script block.
    if (currentBlock === undefined) {
      const match = line.match(SCRIPT_BLOCK_START_REGEX);

      // Does a script block begin on the current line?
      if (match !== null) {
        currentBlock = new ScriptBlock(match.groups.tag, index + 1, match.groups.indent.length); // Lines are 1-indexed

        // Does the block have a script line immediately following the tag?
        if (match.groups.script !== undefined) {
          currentBlock.tagLineScript = {
            column: match.groups.indent.length + match.groups.tag.length + match.groups.whitespace.length,
            content: match.groups.script,
          };
        }
      }

      return;
    }

    // Here, the parser is in a script block context.
    const match = line.match(SCRIPT_BLOCK_POSSIBLE_END_REGEX);

    /**
     * The block only ends on two conditions:
     * 1) The current line either has no indentation, or begins with a tag or a comment.
     * 2) Its indentation level is *lower* than that of the script tag.
     */
    if (match === null || match.groups.indent.length <= currentBlock.tagColumn) {
      scriptBlocks.push(currentBlock);
      currentBlock = undefined;
      return; // TODO Should be `continue` to handle adjacent tags
    }

    // Set the script indentation level if this is the first line of the indented script.
    if (currentBlock.indentedScript === undefined) {
      currentBlock.indentedScript = { indent: match.groups.indent.length, contents: [] };
    } else if (match.groups.indent.length < currentBlock.indentedScript.indent) {
      currentBlock.indentedScript.indent = match.groups.indent.length;
    }

    // Hash comments at line beginnings are allowed in `.sc` files, so replace them with regular `//` comments.
    currentBlock.indentedScript.contents.push(line.replace(HASH_COMMENT_REGEX, "$<indent>//"));
  });

  return scriptBlocks;
}

const fileCache = new Map();

/**
 *
 * @param {string} text - Contents of the `.sc` file to be processed.
 * @param {string} filename - Absolute file name.
 * @returns {Object[]} - Array of code blocks to lint.
 */
function preprocess(text, filename) {
  const file = vfile({ contents: text, path: filename });
  file.data.scriptBlocks = getScriptBlocks(text);

  fileCache[filename] = file;
  return file.data.scriptBlocks.map((block, index) => ({
    text: block.toString(),
    filename: `${file.stem}.${index}.${block.tagName.endsWith("Es6") ? "es6" : "es5"}.js`,
  }));
}

/**
 *
 * @param {Message[][]} blocks - Array of arrays of lint messages related to each block returned from `preprocess`.
 * @param {string} filename - Absolute file name.
 * @returns {Message[]} Array of lint messages to display to the user.
 */
function postprocess(blocks, filename) {
  const file = fileCache[filename];
  const location = vfileLocation(file);
  delete fileCache[filename];

  return blocks
    .map((messages, index) => {
      const block = file.data.scriptBlocks[index];

      return messages.map((message) => {
        let newMessage;

        if (block.tagLineScript === undefined) {
          newMessage = {
            line: message.line + block.tagLine,
            endLine: message.endLine ? message.endLine + block.tagLine : undefined,
            column: message.column + block.indentedScript.indent,
            endColumn: message.endColumn ? message.endColumn + block.indentedScript.indent : undefined,
          };
        } else if (message.line === 1) {
          newMessage = {
            line: message.line + block.tagLine - 1,
            endLine: message.endLine ? message.endLine + block.tagLine - 1 : undefined,
            column: message.column + block.tagLineScript.column,
            endColumn: message.endColumn ? message.endColumn + block.tagLineScript.column : undefined,
          };
        } else {
          newMessage = {
            line: message.line + block.tagLine - 1,
            endLine: message.endLine ? message.endLine + block.tagLine - 1 : undefined,
            column: message.column + block.indentedScript.indent,
            endColumn: message.endColumn ? message.endColumn + block.indentedScript.indent : undefined,
          };
        }

        if (message.fix) {
          const fixStart = { line: newMessage.line, column: newMessage.column };
          const fixEnd =
            message.fix.range[0] === message.fix.range[1]
              ? fixStart
              : { line: newMessage.endLine, column: newMessage.endColumn };

          newMessage.fix = {
            range: [location.toOffset(fixStart), location.toOffset(fixEnd)],
            text: message.fix.text,
          };
        }

        return { ...message, ...newMessage };
      });
    })
    .flat();
}

module.exports = {
  preprocess,
  postprocess,
  supportsAutofix: true,
};
