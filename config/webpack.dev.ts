import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";
import WebpackDevServer from 'webpack-dev-server';
import Dotenv from 'dotenv-webpack';

// @ts-ignore
declare module 'webpack' {
    interface Configuration {
        devServer?: WebpackDevServer.Configuration;
    }
}

const configuration: webpack.Configuration = {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "../dist/dev"),
        filename: "[name].js",
        clean: true,
    },
    devServer: {
        static: path.join(__dirname, '../'),
        port: 9000,
        open: true,
        hot: true,
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../.env.development'),
        }),
    ],
};

export default merge(common, configuration);