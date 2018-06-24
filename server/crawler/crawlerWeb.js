//import mongoose from 'mongoose'
//import crawlerModel from './crawlerModel'
import mongooseOp from './crawlerModel'
import Crawler from 'crawler'
import schedule from 'node-schedule'


//爬取网站信息
var siteArry = [
	{uri:'https://segmentfault.com/channel/frontend', host:'https://segmentfault.com', site:'segmentfault', titleClass:'.news__item-title'},
	{uri:'https://blog.csdn.net/nav/web', host:'https://blog.csdn.net', site:'csdn', titleClass:'.list_con .title h2'},
	{uri:'https://juejin.im/welcome/frontend', host:'https://juejin.im', site:'juejin', titleClass:'.title-row'},
	{uri:'http://imweb.io/question/tab/all', host:'http://imweb.io', site:'imweb', titleClass:'.one-line'},
	{uri:'https://www.jianshu.com/c/NEt52a', host:'https://www.jianshu.com', site:'jianshu', titleClass:'.title'},
	{uri:'http://www.admin10000.com/javascript/', host:'http://www.admin10000.com', site:'admin10000', titleClass:'.head h2'},
	{uri:'https://www.smashingmagazine.com/articles/', host:'https://www.smashingmagazine.com', site:'smashingmagazine', titleClass:'.article--post__title'}
	
	

]

var httpPreTest = /^http.*/;

//初始化数据库
var mgOp = new mongooseOp();
mgOp.init();

//爬虫
var c = new Crawler({
    maxConnections : 10,
	rateLimit: 2000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
 
			var aDOm = $(res.options.titleClass).find('a');	
			var divDom = $(res.options.titleClass);
			var tempTitle = [];
			var tempHref = [];
			var elemDom = aDOm.length<divDom.length?divDom:aDOm;
			//console.log("site---", res.options.site);
			//console.log('elemDom',aDOm.length," ",divDom.length);
			elemDom.each(function(i, elem) {
				tempTitle[i] = $(this).text().replace(/[\n]/g, '').replace(/(^\s*)|(\s*$)/g, "");
				//console.log("title---",tempTitle[i]);
				tempHref[i]= $(this).attr('href');
				//console.log("tempHref---",tempHref[i]);
				if(!httpPreTest.test(tempHref[i]))
					tempHref[i] =  res.options.host + tempHref[i];
			})
			
								
			//var insertData = {};
			var insertData = [];
			//insertData.sitename = res.options.site;
			//insertData.url = res.options.host;
			
			var nowDate = new Date();
			var currentTime = nowDate.toLocaleDateString() + " "+ nowDate.toLocaleTimeString();
	
			var len = tempTitle.length<8?tempTitle.length:8;

			for (var i = 0; i < len; i++) {
				insertData[i] = {};
				insertData[i].sitename = res.options.site;
				insertData[i].url = res.options.host;
				insertData[i].time = currentTime;
				
				insertData[i].title = tempTitle[i];
				insertData[i].href = tempHref[i];
				insertData[i].index = i+1;
				//mgOp.saveData(insertData); 
			}
			for (var k = 0; k < len; k++) {
				mgOp.saveData(insertData[k]); 
			}
			
			
			
			
        }
        done();
    }
});


//定时任务
//5 second
var rule1     = new schedule.RecurrenceRule();  
var times1    = [1,6,11,16,21,26,31,36,41,46,51,56];  
rule1.second  = times1; 
//8 hour 
//var times1    = [1,9,17,25];  
//rule1.hour  = times1; rule1.minute = 0; 

//5 minute
//var rule2     = new schedule.RecurrenceRule();  
//var times2    = [1,6,11,16,21,26,31,36,41,46,51,56];  
//rule2.minute  = times2; 

//4 hour
//var rule3     = new schedule.RecurrenceRule();  
//var times3    = [1,5,9,13,17,21];  
//rule3.hour  = times3; rule1.minute = 0; 

schedule.scheduleJob(rule1, function(){  

	for (var i in siteArry){
		c.queue(siteArry[i]);
	}
  
});  















