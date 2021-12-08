module.exports = {
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'import',
      {
        libraryName: '@/components',
        libraryDirectory: '',
        camel2DashComponentName: false
      },
      'component'
    ]
  ],
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ]
}
