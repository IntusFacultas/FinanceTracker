const OFF = 0;
const ERROR = 2;
module.exports = {
    root: true,
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    env: {
        node: true,
        browser: true,
        es6: true,
    },
    overrides: [
        {
            files: ['**/*-test.ts', '**/test/**/*.ts', '**/tests/**/*.ts', '**/test/**/*.test.ts', './jest-setup.ts'],
            env: {
                jest: true,
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'jest-extended', 'prettier', 'react-hooks', 'react', 'import'],
    rules: {
        'jest-extended/prefer-to-be-true': 'warn',
        'jest-extended/prefer-to-be-false': 'error',
        'prettier/prettier': ERROR,
        quotes: [
            ERROR,
            'single',
            {
                allowTemplateLiterals: true,
                avoidEscape: true,
            },
        ],
        '@typescript-eslint/no-var-requires': OFF,
        '@typescript-eslint/no-empty-function': OFF,
        'no-unused-vars': OFF,
        '@typescript-eslint/no-unused-vars': [
            ERROR,
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        'react/react-in-jsx-scope': OFF,
        'react/no-unknown-property': OFF,

        // TODO determine how many of these I care about
        'no-array-constructor': ERROR,
        'no-eval': ERROR,
        'no-caller': ERROR,
        'no-implied-eval': ERROR,
        'no-extend-native': ERROR,
        'no-extra-bind': ERROR,
        'no-iterator': ERROR,
        'no-labels': ERROR,
        'no-lone-blocks': ERROR,
        'no-loop-func': ERROR,
        'no-multi-spaces': [ERROR, { ignoreEOLComments: true }],
        'no-multi-str': ERROR,
        'no-native-reassign': ERROR,
        // no-new-side-effects
        'no-new': ERROR,
        'no-new-func': ERROR,
        'no-new-object': ERROR,
        'no-new-wrappers': ERROR,
        'no-octal-escape': ERROR,
        'no-return-assign': [ERROR, 'except-parens'],
        'no-script-url': ERROR,
        'no-sequences': ERROR,
        'no-shadow': ERROR,
        'no-shadow-restricted-names': ERROR,
        'no-spaced-func': ERROR,
        'no-trailing-spaces': ERROR,
        'no-use-before-define': [ERROR, 'nofunc'],
        'no-with': ERROR,
        'comma-spacing': ERROR,
        'consistent-return': OFF,
        curly: ERROR,
        'eol-last': ERROR,
        eqeqeq: ERROR,
        'key-spacing': ERROR,
        'new-parens': ERROR,
        semi: ERROR,
        'semi-spacing': ERROR,
        'space-infix-ops': ERROR,
        'space-unary-ops': ERROR,
        'prefer-rest-params': ERROR,
        'arrow-body-style': OFF,
        'jsx-quotes': [ERROR, 'prefer-double'],
        strict: [ERROR, 'global'],
        'space-before-function-paren': [ERROR, { anonymous: 'always', named: 'never' }],
        camelcase: [ERROR, { properties: 'never' }],
        'no-console': OFF,
        'no-undef': ERROR,
        'no-eq-null': ERROR,
        'no-floating-decimal': ERROR,
        'no-param-reassign': ERROR,
        'no-self-compare': ERROR,
        'no-dupe-keys': ERROR,
        'wrap-iife': ERROR,
        // handled by prettier/prettier
        indent: OFF,
        'no-constant-condition': ERROR,
        'brace-style': [ERROR, '1tbs', { allowSingleLine: true }],
        'keyword-spacing': ERROR,
        'array-callback-return': ERROR,
        'no-new-symbol': ERROR,
        'no-self-assign': ERROR,
        'no-useless-constructor': ERROR,
        'no-whitespace-before-property': ERROR,
        'no-multiple-empty-lines': [ERROR, { max: 2 }],

        // Using JSX so disabled
        'react/display-name': OFF,
        'react/jsx-no-duplicate-props': ERROR,
        'react/jsx-no-undef': ERROR,
        'react/jsx-uses-react': ERROR,
        'react/jsx-uses-vars': ERROR,
        'react/jsx-wrap-multilines': ERROR,
        'react/no-did-mount-set-state': ERROR,
        'react/no-danger': ERROR,
        'react/no-did-update-set-state': ERROR,

        // required in constructors
        'react/no-direct-mutation-state': OFF,

        // monoliths allowed
        'react/no-multi-comp': OFF,
        'react/no-typos': ERROR,

        'react/prop-types': OFF,
        'react/self-closing-comp': ERROR,
        'react/sort-comp': [
            ERROR,
            {
                order: ['everything-else', 'render'],
            },
        ],
        'import/default': ERROR,
        'import/named': ERROR,
        'import/no-unresolved': ERROR,
        'import/export': ERROR,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
