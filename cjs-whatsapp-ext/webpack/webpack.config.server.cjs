const path = require('path');

module.exports = {
    entry: './src/server/index.js',
    mode : "development",
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'node',
};