module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, { isServer, dev }) => {
    config.output.chunkFilename = isServer
      ? `${dev ? "[name]" : "[name].[fullhash]"}.js`
      : `static/chunks/${dev ? "[name]" : "[name].[fullhash]"}.js`;

    return config;
  },
}