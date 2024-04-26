import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";
import WebpackDevServer from 'webpack-dev-server';

// @ts-ignore
declare module 'webpack' {
    interface Configuration {
        devServer?: WebpackDevServer.Configuration;
    }
}

const fileName = 'dev.js';

const configuration: webpack.Configuration = {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: fileName,
        clean: true,
    },
    devServer: {
        static: path.join(__dirname, '../dist'),
        port: 9000,
        open: true,
        hot: true,
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};

export default merge(common, configuration);