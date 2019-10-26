const proxy = require("http-proxy-middleware");
var port = process.env.PORT || 5000;

module.exports = function(app) {
  app.use(
    proxy(["/api", , "/otherApi"], { target: "http://localhost:" + port   })
  );
};