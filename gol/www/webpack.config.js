const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
	entry: './index.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: "development",
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
			inject: false
		}),
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, "./.."),
			outDir: path.resolve(__dirname, "./../pkg"),
			inject: false
		})
	],
	experiments: {
		asyncWebAssembly: true
	}
};