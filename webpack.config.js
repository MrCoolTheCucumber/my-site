const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

// TODO:
// set up copy plugin to bundle favico, etc
// see create-react-app and look into manifest.json?

let mode = process.env.MODE || "development";

module.exports = {
    mode,
    target: 'web',
    entry: path.resolve(__dirname, './src/index.tsx'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader"
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'site.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'public',
                    globOptions: {
                        ignore: [
                            "**/*.html"
                        ]
                    } 
                }
            ]
        })
    ],
    // TODO: understand how this fix works
    // https://ui.dev/react-router-cannot-get-url-refresh/
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true
    },
};
