const path = require('path');
const packageJson = require('./package.json');

module.exports = {
    entry: './src/client/main.mjs',
    mode: "production",
    output: {
        filename: `${packageJson.name}.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    externals: {
        //puppeteer: 'puppeteer',
    },
    externalsPresets: { node: true },
    target: 'node',
    stats: {
        errorDetails: true
    }
};