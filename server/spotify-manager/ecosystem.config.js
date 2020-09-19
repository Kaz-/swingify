module.exports = {
  apps: [
    {
      name: 'Spotify Manager',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
