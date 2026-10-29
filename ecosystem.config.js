module.exports = {
  apps: [
    {
      name: 'my-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: 'D:/playground/cms-demo/cms',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};