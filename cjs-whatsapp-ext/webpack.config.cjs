const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
    entry: './src/client/main.mjs',
    mode: "development",
    output: {
        filename: `${packageJson.name}.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
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
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: `${packageJson.name}.js.map`
        }),
        new webpack.WatchIgnorePlugin({ paths: ["./dist"] })
    ],
    externals: {
        //puppeteer: 'puppeteer',
    },
    externalsPresets: { node: true },
    target: 'node',
    stats: {
        errorDetails: true
    }
};