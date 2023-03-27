# eslint-plugin-jaicp

An [ESLint](https://eslint.org/) plugin to extract and lint scripts from [JAICP DSL](https://help.just-ai.com/) projects.

## Installation

You’ll need to install ESLint and this plugin using [npm](https://nodejs.dev/en/learn/an-introduction-to-the-npm-package-manager/):

```sh
npm i --save-dev eslint eslint-plugin-jaicp
```

## Configuration

Add one of the following configs to the `extends` section of your [`.eslintrc`](https://eslint.org/docs/latest/use/configure/configuration-files) configuration file:

- `plugin:jaicp/es5` if you use the old JavaScript runtime.
- `plugin:jaicp/es6` if you use the new JavaScript runtime with [ECMAScript 6 support](https://help.just-ai.com/docs/ru/JS_API/es6-support).

```json
{
    "extends": [
        // ... Other configs you use, e.g. "eslint:recommended"
        "plugin:jaicp/es5"
    ]
}
```

## Usage

### CLI

```shell
npx eslint src/
```

### Editor integrations

Use the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension to integrate ESLint into Visual Studio Code.

Note that you also need to teach VS Code to recognize `.sc` files as JAICP DSL. To do this:

1. Install the [JAICP](https://help.just-ai.com/docs/en/developer-tools/vscode-extension) extension for VS Code.
2. In the editor settings, add `jaicp` to the list of language IDs that ESLint will validate:

    ```json
    {
        "eslint.validate": [
            "jaicp", "javascript"
        ]
    }
    ```

## Rules

The following ESLint rules are modified by the plugin configs:

| Rule | Status |
|---|---|
| [`no-param-reassign`](https://eslint.org/docs/latest/rules/no-param-reassign) | Enabled with `props` set to `true`. Modifications to `$context` properties are ignored: this is a common use case of `bind` callbacks. |
| [`no-undef`](https://eslint.org/docs/latest/rules/no-undef) | Disabled. The plugin does not detect whether a referenced value is defined in a `require`d JavaScript file or `init` block, or actually not defined. |
| [`no-unused-vars`](https://eslint.org/docs/latest/rules/no-unused-vars) | Disabled in `plugin:jaicp/es5` config. The plugin does not detect whether variables defined in `require`d JavaScript files are actually used. |
