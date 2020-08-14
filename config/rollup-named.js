function relativeModule(name) {
  return require.resolve(name).slice(process.env['ROOT_PATH'].length);
}

exports.default = {
  [relativeModule("chai")]: [
    "expect",
    "use"
  ],
  [relativeModule('noicejs')]: [
    "BaseError",
    "ConsoleLogger",
    "NullLogger",
    "logWithLevel"
  ],
  [relativeModule('js-yaml')]: [
    "DEFAULT_SAFE_SCHEMA",
    "SAFE_SCHEMA",
    "safeDump",
    "safeLoad",
    "safeLoadAll",
    "Schema",
    "Type"
  ],
  [relativeModule('yargs')]: [
    "showCompletionScript",
    "usage"
  ]
};
