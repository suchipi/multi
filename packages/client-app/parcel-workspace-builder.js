const { exec, bin } = require("@workspace-builder/tools");

module.exports = function(workspace) {
  exec(`${bin("parcel")} build src/index.html`);
};
