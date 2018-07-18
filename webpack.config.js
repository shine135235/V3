const HtmlWebpackPlugin=require('html-webpack-plugin');

const CleanWebpackPlugin=require('clean-webpack-plugin');

const theme = require('./js/theme');


// const imgPath='./img/';
// const jsPath='./js/'


module.exports={
    entry:{
        index:'./js/index',// 默认配置入口文件
        // index:'./js/index-charts',
        vendor:['react','react-dom','antd','axios','echarts','./js/config']
    },
    output:{
        publicPath:'/',
        filename: `[name].[${process.env.NODE_ENV === 'production' ? 'chunkhash' : 'hash'}:8].js`,
    },
    devServer: {
        historyApiFallback: true,
        hot:false
    },
    module:{
        rules:[//配置加载器
            {
                test:/\.js$/,
                exclude:'/node_modules/',
                use:{
                    loader:'babel-loader'//babel
                } 
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                  // eslint options (if necessary)
                  formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader", options: {
                      javascriptEnabled: true,
                      modifyVars: theme
                    }
                }]
              },
            {
                test: /\.(png|jpe?g|gif|svg|woff|eot|ttf)$/,//文件加载
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10000,
                      name: `[name].[hash:8].[ext]`
                    }
                  }
                ]
              },
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({//动态输出
            title:'智能IT运维平台',
            template:'index.html',
            favicon:'./favicon.ico',
            inject:true,
            minify:{
                html5:true
            },
            hash:false,
        }),
        new CleanWebpackPlugin(['dist'])//打包时清理打包内容
    ],
    optimization:{
        //代码分割
        splitChunks:{
            chunks:'all',
            minChunks:1,
            minSize:0,
            cacheGroups:{
                vendor:{
                    test:'vendor',
                    name:'vendor'
                }
            }
        }
    }
}