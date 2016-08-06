(function() {
  var projectName;

  if ((typeof module !== "undefined" && module !== null) && module.exports) {
    projectName = require("../js/main.js");
  }

  if (typeof window !== "undefined" && window !== null) {
    projectName = window.projectName;
  }

}).call(this);
