# eslint-plugin-jaicp

An ESLint plugin to extract and lint scripts from JAICP DSL files

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-jaicp`:

```sh
npm install eslint-plugin-jaicp --save-dev
```

## Usage

Add `jaicp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "jaicp"
    ]
}
```
