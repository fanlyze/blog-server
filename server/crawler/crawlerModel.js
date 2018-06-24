import mongoose from 'mongoose'


var mongooseOp = function() {
	this.crawlerSchema = new mongoose.Schema({
		sitename:String,
		url:String,
		title:String,
		href:String,
		time:String,
		index:String
	});
	this.crawlerModel;
	
}


mongooseOp.prototype.init = function() {
	mongoose.Promise = require('bluebird');
	mongoose.connect(`mongodb://localhost:27017/reactDb`, function (err) {
		if (err) {
			console.log(err, "数据库连接失败");
			return;
		}
		console.log('数据库连接成功');

	});
	this.crawlerModel = mongoose.model('crawler',this.crawlerSchema);
}



mongooseOp.prototype.find = function() {
	this.crawlerModel.find(null, 'sitename url title href time index').then(data => {
		//console.log('数据库查询结果');
	}).catch(err => {
		console.log('数据库查询出错');
	})
}

mongooseOp.prototype.update = function(data) {
	const {
        sitename,
        url,
        title,
        href,
		time,
        index
    } = data;
    this.crawlerModel.update({index:index,sitename:sitename},{url,title,href,time})
        .then(result=>{
            //console.log('数据库更新成功');           
        }).cancel(err=>{
			console.log(err);
		});
		
	
		
		
}


mongooseOp.prototype.insert = function(data) {
	const {
		sitename,
        url,
        title,
        href,
		time,
		index
    } = data;

    let tempModel = new this.crawlerModel({
		sitename,
        url,
        title,
        href,
		time,
		index
    });
    tempModel.save().then(data=>{
       //console.log('数据库保存成功');
    }).cancel(err=>{
        console.log(err);
    });
}

mongooseOp.prototype.saveData = function(data) {
	const {
		sitename,
        url,
        title,
        href,
		time,
		index
    } = data;
	
	const search = {sitename:sitename};
	this.crawlerModel.count(search)
	.then(count => {
		if(index <= count)
			this.update(data);
		else
			this.insert(data);
				
		
	}).cancel(err => {
		console.log(err);
    });	
}

mongooseOp.prototype.delete = function(data) {
	//todo
}

module.exports =  mongooseOp;

