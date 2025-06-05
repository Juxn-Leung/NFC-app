//vue.config.js里面添加如下配置
module.exports = {
    transpileDependencies: [
        /[/\\]node_modules[/\\](.+?)?@uni-ui(.*)[/\\]code-plugs/
    ],
}