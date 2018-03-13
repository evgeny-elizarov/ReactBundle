'use strict';
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractFilePlugin = require('extract-file-loader/Plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = function makeWebpackConfig(options) {
    /**
     * Whether we are generating minified assets for production
     */

    var LIBRARY_SHORT_NAME = 'ReactBundle';
    var NAMESPACE = 'Andevis';
    var LIBRARY_NAME = NAMESPACE + LIBRARY_SHORT_NAME;
    var LIBRARY_ALIAS = '@' + LIBRARY_NAME;
    var BUILD = 'prod';


    var ENTRY = __dirname + '/src/Andevis/ReactBundle/UI/main.js';

    var ALIAS = {};
    ALIAS[LIBRARY_ALIAS] = __dirname + '/src/'+ NAMESPACE +'/' + LIBRARY_SHORT_NAME;
    ALIAS['@AndevisGraphQLBundle'] = __dirname + '/../graph-ql-bundle/src/'+ NAMESPACE +'/GraphQLBundle';

    var OUTPUT_PATH = __dirname + '/src/'+ NAMESPACE +'/' + LIBRARY_SHORT_NAME + '/';

    /**
     * Whether we are running inside webpack-dashboard
     */
    var DASHBOARD = process.env.WEBPACK_DASHBOARD === 'enabled';


    // if (options.parameters.path) {
    //     outputPath = options.parameters.path;
    // } else {
    //     const findPublicDirectory = function(currentDirectory, fallback) {
    //         var parentDirectory = path.dirname(currentDirectory);
    //         if (parentDirectory === currentDirectory) {
    //             return fallback;
    //         }
    //
    //         var publicDirectory = parentDirectory + '/public';
    //         if (fs.existsSync(publicDirectory)) {
    //             return publicDirectory;
    //         }
    //
    //         var webDirectory = parentDirectory + '/web';
    //         if (fs.existsSync(webDirectory)) {
    //             return webDirectory;
    //         }
    //
    //         return findPublicDirectory(parentDirectory, fallback);
    //     };
    //     outputPath = __dirname + '/compiled/'; //findPublicDirectory(__dirname, __dirname + '../../web') + '/compiled/';
    // }

    /**
     * Config
     * Reference: https://webpack.js.org/concepts/
     * This is the object where all configuration gets set
     */
    var config = {
        entry: ENTRY,
        resolve: {
            alias: ALIAS,
            extensions: ['.js', '.jsx'],
            modules: ['node_modules']
        },

        output: {
            // Absolute output directory
            path: OUTPUT_PATH,

            // Output path from the view of the page
            // publicPath: publicPath,

            // Filename for entry points
            // Only adds hash in build mode
            filename: 'index.js',

            library: LIBRARY_NAME, // string,
            // the name of the exported library

            libraryTarget: "umd",
            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[chunkhash].js' : '[name].bundle.js'
        },

        /**
         * Options for webpack-dev-server.
         * Enables overlay inside the page if any error occurs when compiling.
         * Enables CORS headers to allow hot reload from other domain / port.
         * Reference: https://webpack.js.org/configuration/dev-server/
         */
        devServer: Object.assign({
            overlay: {
                warnings: false,
                errors: true
            },
            disableHostCheck: true,
            headers: { "Access-Control-Allow-Origin": "*" }
        }, {})
    };


    /**
     * Loaders
     * Reference: https://webpack.js.org/concepts/loaders/
     * List: https://webpack.js.org/loaders/
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        rules: [
            /**
             * Compiles ES6 and ES7 into ES5 code
             * Reference: https://github.com/babel/babel-loader
             */
            {
                test: /\.jsx?$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // options: {
                //     presets: [['env', {
                //         "modules": false
                //     }]]
                // }
            },

            /**
             * Minify PNG, JPEG, GIF and SVG images with imagemin
             * Reference: https://github.com/tcoopman/image-webpack-loader
             *
             * See `config.imageWebpackLoader` for configuration options
             *
             * Query string is needed for URLs inside css files, like bootstrap
             */
            {
                test: /\.(gif|png|jpe?g|svg)(\?.*)?$/i,
                enforce: 'pre',
                loader: 'image-webpack-loader',
                options: {
                    optipng: {
                        optimizationLevel: 7,
                        progressive: true
                    }
                }
            },
            /**
             * Copy files to output directory
             * Rename the file using the asset hash
             * Pass along the updated reference to your code
             *
             * Reference: https://github.com/webpack/file-loader
             *
             * Query string is needed for URLs inside css files, like bootstrap
             * Overwrites name parameter to put original name in the destination filename, too
             */
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*)?$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },

            /**
             * Loads HTML files as strings inside JavaScript - can be used for templates
             *
             * Reference: https://github.com/webpack/raw-loader
             */
            {
                test: /\.html$/i,
                loader: 'raw-loader'
            },

            /**
             * Allow loading CSS through JS
             * Reference: https://github.com/webpack/css-loader
             *
             * postcss: Postprocess your CSS with PostCSS plugins (add vendor prefixes to CSS)
             * Reference: https://github.com/postcss/postcss-loader
             * Reference: https://github.com/postcss/autoprefixer
             *
             * ExtractTextPlugin: Extract CSS files into separate ones to load directly
             * Reference: https://github.com/webpack/extract-text-webpack-plugin
             *
             * If ExtractTextPlugin is disabled, use style loader
             * Reference: https://github.com/webpack/style-loader
             */
            {
                test: /\.(css|less|scss)$/i,
                loader: ExtractTextPlugin.extract({
                    'fallback': 'style-loader',
                    use: [
                        'css-loader?sourceMap',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        autoprefixer({
                                            browsers: ['last 2 version']
                                        })
                                    ];
                                }
                            }
                        }
                    ]
                })
            },

            /**
             * Compile LESS to CSS, then use same rules
             * Reference: https://github.com/webpack-contrib/less-loader
             */
            {
                test: /\.less$/i,
                loader: 'less-loader?sourceMap',
                enforce: 'pre'
            },

            /**
             * Compile SASS to CSS, then use same rules
             * Reference: https://github.com/webpack-contrib/sass-loader
             */
            {
                test: /\.scss$/i,
                loader: 'sass-loader?sourceMap',
                enforce: 'pre'
            }
        ]
    };

    /**
     * Plugins
     * Reference: https://webpack.js.org/configuration/plugins/
     * List: https://webpack.js.org/plugins/
     */
    config.plugins = [
        /**
         * Used for CSS files to extract from JavaScript
         * Reference: https://github.com/webpack/extract-text-webpack-plugin
         */
        new ExtractTextPlugin(
            {
                filename: BUILD ? '[name].css' : '[name].bundle.css',
                disable: true
            }
        ),

        /**
         * Webpack plugin that emits a json file with assets paths - used by the bundle
         * Reference: https://github.com/kossnocorp/assets-webpack-plugin
         */
        // new AssetsPlugin({
        //     filename: path.basename(options.manifest_path),
        //     path: path.dirname(options.manifest_path)
        // }),

        /**
         * Adds assets loaded with extract-file-loader as chunk files to be available in generated manifest
         * Used by the bundle to use binary files (like images) as entry-points
         * Reference: https://github.com/mariusbalcytis/extract-file-loader
         */
        new ExtractFilePlugin()
    ];

    /**
     * Adds CLI dashboard when compiling assets instead of the standard output
     * Reference: https://github.com/FormidableLabs/webpack-dashboard
     */
    if (DASHBOARD) {
        config.plugins.push(new DashboardPlugin());
    }

    config.externals = [
        "react", "react-intl"
    ];

    /**
     * Build specific plugins - used only in production environment
     */
    // if (BUILD) {
    config.plugins.push(
        /**
         * Only emit files when there are no errors
         * Reference: https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
         */
        // new webpack.NoEmitOnErrorsPlugin(),

        /**
         * Minify all javascript, switch loaders to minimizing mode
         * Reference: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
         */
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
    );
    // }

    /**
     * Devtool - type of sourcemap to use per build type
     * Reference: https://webpack.js.org/configuration/devtool/
     */
    if (BUILD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    return config;
};
