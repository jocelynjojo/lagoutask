## 一、简答题
### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

- 初始化项目
- 配置文件 webpack.config.js
  - 配置项目入口、输出路径、开发模式等
  - 配置不同资源处理的 loader
  - 配置 plugin
- 执行打包命令
- webpack 通过配置文件的 entry 入口配置开始查找项目依赖资源
- webpack 根据配置的 把资源传入到不同的loader，输出打包后的资源。
- webpack根据配置的 利用plugin在打包的各个阶段做一些额外的工作

### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

loader 主要是将对不同的资源文件做处理，比如将es6处理成es5, 而plugin 主要是在 webpack 构建的不同阶段执行一些额外的工作，比如拷贝静态资源、清空打包后的文件夹等

loader 开发思路
通过 module.exports 导出一个函数
该函数默认参数一个参数 source(即要处理的资源文件)
在函数体中处理资源(loader 里配置响应的 loader 后)
通过 return 返回最终打包后的结果(这里返回的结果需为字符串形式)

plugin开发思路
通过钩子机制实现
插件必须是一个函数或包含 apply 方法的对象
在方法体内通过 webpack 提供的 API 获取资源做响应处理
将处理完的资源通过 webpack 提供的方法返回该资源

## 二、编程题
### 1、使用 Webpack 实现 Vue 项目打包任务

实战步骤
#### 实现在webpack 没配置时候的格式化功能
配置eslintrc 和 vscode , 实现在没有配置webpack ,或者webpack 配置过程中的格式化功能
> yarn add eslint -D
> yarn eslint --init

给vscode 安装eslint 插件，同时编辑项目代码，添加.vscode/settings.json 文件，并在其中添加此代码
```javascript
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
}
```

#### 实现打包功能
1. 本地安装开发依赖  webpack webpack-cli
> yarn add webpack webpack-cli -D

2. 为了节约打命令时间，先去配置 package.json
```javascript
"build": "webpack --config webpack.prod.js"
```
3. 在 webpack.common.js 中配置入口文件和打包文件夹，并在webpack.prod.js /webpack.dev.js  中引入，并使用webpack-merge 合并选项
> yarn add webpack-merge -D
```javascript
//  webpack.common.js
const path = require('path')
module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].[hash:8].js',
    path: path.join(__dirname, 'dist')
  }
}

```
```javascript
//  webpack.prod.js
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
module.exports = merge(common, {
  mode: 'production'
})
```
```javascript
//  webpack.dev.js
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
module.exports = merge(common, {
  mode: 'development'
})

```
尝试打包
> yarn build


4. 配置loader
- 首先需要配置vue 相关的vue vue-loader，less 相关的less less-loader css-loader style-loader, vue-style-loader,  babel 相关 babel-loader @babel/core  @vue/cli-plugin-babel, url 相关的 file-loader, url-loader
  > yarn add vue vue-loader less less-loader css-loader style-loader vue-style-loader, babel-loader @babel/core @vue/cli-plugin-babel -D

得到如下的package.json
```javascript
"dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.12"
  },
  "devDependencies": {
    "@babel/core": "^7.11.4",
    "@vue/cli-plugin-babel": "^4.5.4",
    "babel-loader": "^8.1.0",
    "cache-loader": "^4.1.0",
    "css-loader": "^4.2.2",
    "eslint": "^7.7.0",
    "eslint-config-standard": "^14.1.1",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "eslint-plugin-vue": "^6.2.2",
    "file-loader": "^6.0.0",
    "less": "^3.12.2",
    "less-loader": "^6.2.0",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.3",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.12",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12",
    "webpack-merge": "^5.1.2"
  }
```
```javascript
// webpack.common.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        filename: '[name].[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                strictMath: true,
                            },
                        },
                    },

                ]
            },
            {
                test: /\.(png|jpeg|jpg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            esModule: false,
                            limit:10*1024
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // enable CSS Modules
                            modules: false,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}

```
运行yarn run build , 打包成功， 看到dist 

5. 配置开发服务器dev-server
> yarn add webpack-dev-server -D
```javascript
// package.json
"serve": "webpack-dev-server --open --config webpack.dev.js"
```
这时服务器可以起来了，但是，却看不到html 文件。因此需要为devServer 指定一个静态资源文件，同时需要为html 自动引入脚本
```javascript
// webpack.dev.js
devServer: {
    contentBase: 'public'
  }
```
```javascript
// webpack.common.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
new HtmlWebpackPlugin({
      BASE_URL: '/',
      title: '2-2',
      filename: 'index.html',
      template: './public/index.html'
    })
```

6. 拷贝文件
开发的时候可以通过开发服务器指定静态资源位置，但是上线的时候不行，因此需要在打包上线的时候，将静态资源拷贝到输出目录
> yarn add copy-webpack-plugin -D
```javascript
// webpack.common.js
const CopyWebpackPlugin = require('copy-webpack-plugin')
new CopyWebpackPlugin({ patterns: ['./src/assets/**', 'public'] })
```
起一个服务器，可以访问成功。

7. 最后对打包上线的代码还需要做一些优化
清除多次打包的无用代码
> yarn add clean-webpack-plugin -D
```javascript
// webpack.common.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
new CleanWebpackPlugin()

```
对代码进行压缩
```javascript
optimization: {
    usedExports: true,// 标记未引用代码
    minimize: true,//移除未使用代码
    splitChunks: {
        chunks: 'all'
    }
}
```

8. 最后的最后，把校验加上，希望上传代码前来一次检查
```javascript
"lint": "eslint ./src/main.js"
```
yarn lint 检查到main.js 有问题，证明命令正确
