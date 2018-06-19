module.exports = {
    env: {
        es6: true,
        node: true,
        mocha: true,
    },
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'all' }],
    },
};
