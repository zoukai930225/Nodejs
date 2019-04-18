study url:[http://www.cnblogs.com/zhongweiv/p/nodejs_express_webapp.html](http://www.cnblogs.com/zhongweiv/p/nodejs_express_webapp.html)

## 创建一个新项目

	express -e express -e sampleEjs



**cd 项目 执行**

	cd express -e sampleEjs
 
	npm install


运行项目 
	
	node app.js
	supervisor app.js

## Download Bootstarp

[https://github.com/twbs/bootstrap/releases/tag/v3.0.3](https://github.com/twbs/bootstrap/releases/tag/v3.0.3) 


## 报错情况


![](https://github.com/zxx1988328/nodejs-sampleEjs/blob/master/img/error.png)

	E:\nodework\sampleEjs\node_modules\express\lib\router\index.js:458
	      throw new TypeError('Router.use() requires middleware function but got a ' + gettype(fn));
	      ^
	
	TypeError: Router.use() requires middleware function but got a Object
	    at Function.use (E:\nodework\sampleEjs\node_modules\express\lib\router\index.js:458:13)
	    at EventEmitter.<anonymous> (E:\nodework\sampleEjs\node_modules\express\lib\application.js:219:2
	1)
	    at Array.forEach (native)
	    at EventEmitter.use (E:\nodework\sampleEjs\node_modules\express\lib\application.js:216:7)
	    at Object.<anonymous> (E:\nodework\sampleEjs\app.js:39:5)
	    at Module._compile (module.js:425:26)
	    at Object.Module._extensions..js (module.js:432:10)
	    at Module.load (module.js:356:32)
	    at Function.Module._load (module.js:311:12)
	    at Function.Module.runMain (module.js:457:10)


解决办法:在routes文件下的js文件，因为是空文件，加入下列代码

	var express = require('express'),
	router = express.Router();
	module.exports = router;


