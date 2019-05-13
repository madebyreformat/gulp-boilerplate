module.exports = (ctx) => ({
  plugins: {
    'postcss-import-ext-glob': {},
    'postcss-import': {},
    'tailwindcss': './tailwind.config.js',
    'postcss-preset-env': {
      browsers: 'last 2 versions',
      features: {
        'autoprefixer': {},
        'custom-properties': {
          importFrom: './src/css/global/properties.css',
        },
        'custom-media-queries': {
          importFrom: './src/css/global/queries.css',
        }
      }
    },
    'postcss-utilities': {},
    'precss': {},
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: [
        'default',
        {
          calc: false,
          discardComments: {
            removeAll: true
          }
        }
      ]
    } : false,
  }
})