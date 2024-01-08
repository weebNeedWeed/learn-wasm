const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
	entry: './index.js',
	devtool: 'source-map',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: "production",
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
			inject: false
		}),
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, "./.."),
			outDir: path.resolve(__dirname, "./../pkg"),
			forceMode: "production"
		})
	],
	experiments: {
		asyncWebAssembly: true
	}
};