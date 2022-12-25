const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/download/whitehousecookbo00gillrich/whitehousecookbo00gillrich.pdf",
    createProxyMiddleware({
      target: "https://archive.org",
      changeOrigin: true,
    })
  );
};
// https://archive.org/download/whitehousecookbo00gillrich/whitehousecookbo00gillrich.pdf
