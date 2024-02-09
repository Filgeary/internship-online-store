// Docs: https://eslint.org/docs/latest/use/getting-started
// Docs: https://github.com/jsx-eslint/eslint-plugin-react#configuration

// stylelint (in `.stylelintrc.json`)
// get-started: https://stylelint.io/user-guide/get-started/
// customize:   https://stylelint.io/user-guide/customize/

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    // Docs: https://www.npmjs.com/package/eslint-plugin-promise
    'plugin:promise/recommended',
    'plugin:react/jsx-runtime',
    // Docs: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
    'airbnb',
    'airbnb/hooks',
    // Docs: https://www.npmjs.com/package/eslint-plugin-prettier
    'plugin:prettier/recommended',
  ],
  // Docs: https://typescript-eslint.io/getting-started/
  parser: '@typescript-eslint/parser',
  // Docs: https://typescript-eslint.io/getting-started/
  root: true,
  overrides: [
    // Different lint rules for JavaScript and TypeScript files
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'standard-with-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // Docs: https://www.npmjs.com/package/eslint-config-airbnb-typescript
        'airbnb-typescript',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        /*
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
          },
        ], */
        // Вот тут можно убрать кое-что, тогда проверять жёстче будет
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'no-alert': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'consistent-return': 'off',
        'no-console': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    // Docs: https://www.npmjs.com/package/eslint-plugin-promise
    'promise',
    '@typescript-eslint',
    // Docs: https://www.npmjs.com/package/eslint-plugin-prettier
    'prettier',
  ],
  // Docs: https://eslint.org/docs/latest/rules/
  rules: {
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    // For Redux toolkit
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    // Docs: https://eslint.org/docs/latest/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    // Docs: https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    // "Missing file extension "ts" import/extensions"
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // Docs: https://www.npmjs.com/package/eslint-plugin-prettier
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // Docs: https://eslint.org/docs/latest/rules/semi
    // semi: ["error", "always"],
    // Docs: https://eslint.org/docs/latest/rules/quotes
    // quotes: ["error", "double"],
    // JS vs JSX
    // Doc: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    // If you wanted to allow both '.jsx' and '.js', the configuration would be:
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/react-in-jsx-scope': 'off',
  },
  //
  settings: {
    // "Missing file extension "ts" import/extensions"
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    // --------------------------------------------------------------------------------------
    // React settings start: https://github.com/jsx-eslint/eslint-plugin-react#configuration
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      flowVersion: '0.53', // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' },
      // for rules that check exact prop wrappers
      { property: 'forbidExtraProps', exact: true },
    ],
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      { property: 'styled' }, // `object` is optional
      { property: 'observer', object: 'Mobx' },
      { property: 'observer', object: '<pragma>' }, // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    formComponents: [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      'CustomForm',
      { name: 'Form', formAttribute: 'endpoint' },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { name: 'Link', linkAttribute: 'to' },
    ],
  },
  // React settings end
  // --------------------------------------------------------------------------------------
};
