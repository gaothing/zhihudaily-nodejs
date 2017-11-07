const express=require("express");
const router=express.Router();
const request=require("request");
const path=require("path");
const nunjucks = require('nunjucks');
//rest风格
router.get("/:id",function(req,res){
	var id=req.params.id;
	var urls="http://news-at.zhihu.com/api/4/news/"+id;
	request(urls,function(req,resw,body){
		var newBody=JSON.parse(body);
		var c=JSON.stringify(newBody.body).replace(/<[^>]+>|<\/>|/g,'');	
		var t=c.replace(/[\\n\/]/g, '');
		var s=t.slice(1).split("r").join('').replace("widow.daily=tue\"","");
		var newpath=path.resolve(__dirname,"../public");
		// var newbodys=newBody.body.toString();
		// var ne=newbodys.substring(1,newbodys.lastIndexOf("'"))
		// console.log(typeof newbodys)
		nunjucks.configure(newpath,{autoescape:true});
		if(newBody.images.length){
            var img=newBody.images[0];
		}else{
			var img="";
		}
		var newimg=img.substring(img.lastIndexOf('/'));
		// 评论和赞
		request("http://news-at.zhihu.com/api/4/story-extra/"+id,function (req2,res2,body2) {
            var comBody=JSON.parse(body2);
			var htmldata=[s,newBody.title,newimg,comBody.popularity,comBody.comments];
            var html = nunjucks.render('show.html',{data:htmldata});
            res.send(html);
        })
	})
});

module.exports=router;