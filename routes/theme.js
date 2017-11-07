var express=require("express");
var router=express.Router();
var request=require("request");
const path=require("path");
const nunjucks = require('nunjucks');
router.get("/:id",function(req,res){
    var id=req.params.id;
    request("http://news-at.zhihu.com/api/4/theme/"+id,function(err,resq,body){
        var newpath=path.resolve(__dirname,"../public");
        nunjucks.configure(newpath,{autoescape:true});
        var data=JSON.parse(body);
       var html = nunjucks.render('theme.html',{data:data});
            res.send(html);
    })
});
module.exports=router;