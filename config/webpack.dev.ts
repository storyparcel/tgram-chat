import path from "path";
import webpack from "webpack";
import "webpack-dev-server";
import { merge } from "webpack-merge";
import common from "./webpack.common";

const configuration: webpack.Configuration = {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, "public"),
        port: 3000,
        open: true,
        compress: true,
        historyApiFallback: true,
        hot: true
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};

export default merge(common, configuration);