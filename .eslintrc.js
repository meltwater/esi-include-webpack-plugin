module.exports = {
  "extends": ["airbnb-base", "airbnb-base/legacy", "prettier", "plugin:jasmine/recommended"],
  "plugins": ["prettier", "jasmine"],
  "env": {
    "jasmine": true
  },
  "rules": {
    "prettier/prettier": ["error"],
    "no-console": "off"
  }
}