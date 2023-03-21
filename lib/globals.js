const es5Globals = {
  $client: "writable",
  $context: "writable",
  $injector: "readonly",
  $parseTree: "readonly",
  $request: "readonly",
  $response: "readonly",
  $session: "writable",
  $temp: "writable",

  bind: "readonly",
  capitalize: "readonly",
  currentDate: "readonly",
  hasOperatorsOnline: "readonly",
  log: "readonly",
  parseXml: "readonly",
  toPrettyString: "readonly",

  $analytics: "readonly",
  $caila: "readonly",
  $dialer: "readonly",
  $env: "readonly",
  $faq: "readonly",
  $http: "readonly",
  $imputer: "readonly",
  $integration: "readonly",
  $jsapi: "readonly",
  $mail: "readonly",
  $nlp: "readonly",
  $pushgate: "readonly",
  $reactions: "readonly",
  $secrets: "readonly",
};

const es6Globals = {
  ...es5Globals,

  currentDate: "off",
  parseXml: "off",
  toPrettyString: "off",

  $dialer: "off",
  $faq: "off",
  $http: "off",
  $imputer: "off",
  $integration: "off",
  $mail: "off",
};

module.exports = { es5Globals, es6Globals };
