const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const extractText = new ExtractTextPlugin('[name].bundle.css');

const ENV_PRODUCTION = 'production';
const ENV = process.env.NODE_ENV || ENV_PRODUCTION;

const ENVS = {
    development: ENV === 'development',
    production: ENV === ENV_PRODUCTION
};

console.log(`=== Environment [${ENV}] ===`);

const METADATA = {
    devHost: process.env.HOST || 'localhost',
    devPort: process.env.PORT || 3000,
    ENV: ENV,
    webConfig: {
        //version: 'v1',
        //apiUrl: 'http://localhost:3300/api'
    }
};

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};
PATHS.data = path.join(PATHS.src, 'data');

const CONFIGS = {
    common: {
        node: {
            __filename: true
        },
        entry: {
            app: PATHS.src,
            lib: [
                '_styles/lib/index.less',

                'lodash',
                'jquery',
                'font-awesome/less/font-awesome.less',

                //'toastr',
                //'toastr/toastr.less',

                'bootstrap',
                /*'bootstrap/less/bootstrap.less',*/ // see '_styles/lib/lib.less' above

                'angular',
                'angular-resource',
                'angular-animate',
                'angular-touch',
                'angular-sanitize',

                // angular-ui-router
                'angular-ui-router',
                //'ui-router-route-to-components',

                'angular-ui-bootstrap',

                // nya-bootstrap-select
                'nya-bootstrap-select/dist/js/nya-bs-select.js',
                'nya-bootstrap-select/dist/css/nya-bs-select.css',

                // highcharts-ng
                // 'highcharts/highcharts.src.js',
                'highcharts-ng/dist/highcharts-ng.min.js',

                // angular-google-places-autocomplete
                //'angular-google-places-autocomplete/src/autocomplete.js',
                //'angular-google-places-autocomplete/src/autocomplete.css',

                'angular-filter/dist/angular-filter.js',
                'ng-focus-on/lib/index.js',

                // ng-scrollbars
                'jquery-mousewheel/jquery.mousewheel.js',
                'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
                'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
                'ng-scrollbars/src/scrollbars.js',

                // angular-bootstrap-switch
                // 'bootstrap-switch/dist/js/bootstrap-switch.js',
                /*'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css'*/ // see '_styles/lib/lib.less' above
                // 'angular-bootstrap-switch/dist/angular-bootstrap-switch.js'

                //highmap country info
                // '_modules/detail/highmap-world.js'
            ]
        },
        output: {
            path: PATHS.build,
            filename: '[name].bundle.js'
        },
        resolve: {
            root: [path.resolve(PATHS.src), path.resolve('node_modules'), path.resolve('bower_components')],
            modulesDirectories: ['node_modules'/*, 'bower_components'*/],
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
            alias: {
                _app: PATHS.src,
                _data: PATHS.data,
                _util: path.join(PATHS.src, 'util.js'),
                _modules: path.join(PATHS.src, 'modules'),
                _styles: path.join(PATHS.src, 'styles'),
                _images: path.join(PATHS.src, 'assets', 'images'),
                _fonts: path.join(PATHS.src, 'assets', 'fonts')
                //'ngComponentRouter': '@angular/router/angular1/angular_1_router'
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                _: 'lodash'
            })
        ],
        module: {
            // TODO configure "noParse"
            noParse: [
                //'bower_components/angular/angular.js' //require.resolve('angular')
                'node_modules/angular/angular.js' //require.resolve('angular')
            ],
            loaders: [
                {
                    test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery'
                },
                {
                    test: require.resolve('malihu-custom-scrollbar-plugin'), loader: 'imports?module=>false'
                },
                {
                    test: /\.(js|tsx?)$/,
                    loader: 'ts-loader',
                    include: [
                        path.resolve(PATHS.src),
                        path.resolve('bower_components/angular-relative-date')
                    ]
                },
                {
                    test: /\.json/,
                    loader: 'json'
                },
                {
                    // TODO pass variables to the HTMLs (app prefix at least, "template-string-loader" ...)
                    test: /\.html$/,
                    loader: 'html',
                    include: [
                        path.resolve(PATHS.src, 'modules')
                    ]
                },
                {
                    test: /\.css$/,
                    loader: ENVS.test ? 'null' : extractText.extract('css!postcss')
                },
                {
                    test: /\.less$/,
                    loader: ENVS.test ? 'null' : extractText.extract('css!postcss!less')
                },
                {
                    test: /\.(ico|gif|png|jpe?g|svg)$/i,
                    loaders: [
                        'file?name=assets/[name].[hash].[ext]'
                        //'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant: {quality: "65-90", speed: 4}}'
                    ]
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff&name=assets/[name].[hash].[ext]&context=' + PATHS.src
                },
                {
                    test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file?name=assets/[name].[hash].[ext]&context=' + PATHS.src
                }
            ],
            postLoaders: [
                {
                    test: /\.js$/,
                    exclude: /\/(node_modules|bower_components)\//,
                    loader: 'autopolyfiller',
                    query: {browsers: ['last 2 versions', 'ie >= 10']}
                }
            ]
        },
        ts: {
            transpileOnly: true
        },
        postcss: [
            autoprefixer({
                browsers: [
                    'last 2 versions',
                    'Chrome >= 40',
                    'Firefox >= 31.8',
                    'Explorer >= 10',
                    'iOS >= 6.1',
                    'Android >= 4'
                ]
            }),
            cssnano({
                compatibility: 'ie10',
                reduceIdents: false,
                mergeIdents: false,
                zindex: false,
                discardUnused: {
                    fontFace: false
                }
            })
        ]
    },

    development: {
        //devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.build,
            port: METADATA.devPort,
            host: METADATA.devHost,
            hot: true,
            inline: true,
            historyApiFallback: true,

            quiet: false,
            noInfo: true,
            progress: false,
            //stats: {
            //    colors: true,
            //    modules: false,
            //    cached: false,
            //    chunk: false
            //},

            proxy: {
                //'/a/*': {
                //    target: 'http://localhost:8080',
                //    secure: false
                //}
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin
        ]
    },

    production: {
        devtool: 'source-map',
        plugins: [
            new webpack.NoErrorsPlugin,
            new webpack.optimize.UglifyJsPlugin({
                //keepFnames: true, // preventing Angular errors if "function.name" style is used
                compress: {
                    warnings: false
                }
            })
        ]
    }
};

CONFIGS.common.plugins.push(
    //new webpack.DefinePlugin({
    //    TEST_VARIABLE: 'test123'
    //}),
    new webpack.optimize.DedupePlugin,
    new webpack.optimize.CommonsChunkPlugin({name: 'lib'}),
    new HtmlWebpackPlugin({
        metadata: METADATA,
        chunks: ['lib', 'app'],
        template: path.join(PATHS.src, 'index.html'),
        hash: ENVS.production,
        minify: false,
        inject: false
    }),
    extractText
);

module.exports = merge(CONFIGS.common, CONFIGS[METADATA.ENV]);
