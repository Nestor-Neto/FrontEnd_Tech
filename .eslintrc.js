module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    'vue/script-indent': ['error', 2, {
      baseIndent: 0,
      switchCase: 1,
      ignores: []
    }]
  },
  overrides: [
    {
      files: ['src/views/dashboard/components/core/AppBar.vue'],
      rules: {
        'vue/html-indent': 'off',
        'vue/script-indent': 'off'
      }
    }
  ]
}
