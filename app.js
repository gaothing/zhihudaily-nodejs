var express=require("express");
var bodyParser=require("body-parser");
var request=require("request");
var path=require("path");
var fs=require("fs");
const nunjucks = require('nunjucks');
//创建app应用
var app=express();
//JSON类型body
app.use(bodyParser.json());
//query String类型body
app.use(bodyParser.urlencoded({
	extended:false
}))
//使用Nunjucks的函数render。
function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});
//静态目录(如果是静态资源直接发送)
app.use(express.static(path.join(__dirname, 'public')));
//路由与依赖
app.use("/user",require("./routes/user.js"));
app.use("/theme",require("./routes/theme.js"));
//8000监听
app.use("/",function(req,res){
	request("http://news-at.zhihu.com/api/4/news/latest",function(err,resq,body){
		nunjucks.configure(__dirname+'/public',{autoescape:true});
		var data=JSON.parse(body);
        request("http://news-at.zhihu.com/api/4/themes",function(err,resq,bodys){
            var them=JSON.parse(bodys);
            var sq=[data,them];
            var html = nunjucks.render('list.html',{data:sq});
            res.send(html)
        })
	})
});

app.listen(80);
console.log('app started at port 80...');
