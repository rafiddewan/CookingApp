const path = require('path'); //include a built in path node module
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: `./src/js/index.js`, //where webpack will look to bundle 
    output: { //tell webpack where to exactly save our bundle file
        path: path.resolve(__dirname, 'dist'), //path to the folder, __dirname = absolute path
        filename: 'js/bundle.js' //filename
    },
    //dev server to bundle our JavaScript files and then reload the app to the browser whenever we change a file
    devServer: {
        contentBase: './dist' //specify the folder where webpack should server our files
    },

    //import html into index.html in the dist folder using plugins
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
};
