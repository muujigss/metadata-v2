module.exports = {
  apps: [
    {
      name: "metadata.nso.mn",
      script: "npm run start",
      watch: true,
    },
  ],
  deploy: {
    production: {
      key: "",
      user: "",
      host: "",
      ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/main",
      repo: "",
      path: "",
      "post-deploy":
        "npm install --force && npm run schema && npm run build && pm2 restart ecosystem.config.js --env production",
    },
  },
};
