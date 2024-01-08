const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
	entry: './index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: "development",
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, "./.."),
			outDir: path.resolve(__dirname, "./../pkg"),
		})
	],
	experiments: {
		asyncWebAssembly: true
	}
};