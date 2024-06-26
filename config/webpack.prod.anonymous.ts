// webpack.prod.ts

import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";
import Dotenv from 'dotenv-webpack';

const configuration: webpack.Configuration = {
    mode: "production",
    devtool: "cheap-module-source-map",
    entry: path.resolve(__dirname, "../src/anonymous-tgram"),
    output: {
        path: path.resolve(__dirname, "../dist/prod/anonymous"),
        filename: "[name].js",
        clean: true,
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../.env.production'),
        }),
    ],
};

export default merge(common, configuration);