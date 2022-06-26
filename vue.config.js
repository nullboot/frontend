const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "https://backend-dev-null.app.secoder.net/",
        changOrigin: true,
      },
      "/file-host": {
        target: "https://frontend-dev-null.app.secoder.net/",
        changOrigin: true,
      },
    },
  },
});
