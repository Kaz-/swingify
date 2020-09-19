module.exports = {
  apps: [
    {
      name: 'Core',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
