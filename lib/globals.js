const es5 = {
  $client: "writable",
  $context: "writable",
  $global: "writable",
  $injector: "readonly",
  $parseTree: "writable",
  $request: "readonly",
  $response: "writable",
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

  _: "readonly",
};

const es6 = {
  ...es5,

  currentDate: "off",
  parseXml: "off",
  toPrettyString: "off",

  $dialer: "off",
  $faq: "off",
  $http: "off",
  $imputer: "off",
  $integration: "off",
  $mail: "off",

  moment: "readonly",
};

module.exports = { es5, es6 };
