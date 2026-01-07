const getAskedVersion = require("../lib/versioning.js");

module.exports = function apiVersioning(versions) {
  return function (req, res, next) {
    const apiVersion = getAskedVersion(req); 
    const versionController = versions[apiVersion]; 
    if (versionController === undefined) {
      versions.default(req, res, next);
    } else versionController(req, res, next); 
  };
};
