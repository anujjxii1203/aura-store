module.exports = {
  apps: [
    {
      name: "aura-store",
      script: "./server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5055,
      }
    }
  ]
};
