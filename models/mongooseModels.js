import mongoose from 'mongoose'

/**
 * article 表结构
 **/
var articleSchema = new mongoose.Schema({
    title:String,//文章标题
    abstract:String,//文章摘要
    content:String,//文章内容
    viewCount:Number,//浏览次数
    commentCount:Number,//评论次数
    time:String,//发表时间
    coverImg:String,//封面图片
    author:String,//作者
    tags:Array,//标签
    isPublish:Boolean//是否发布
});

/**
 * crawler 表结构
 * */
var crawlerSchema = new mongoose.Schema({
    sitename:String,
    url:String,
    title:String,
    href:String,
    time:String,
    index:String
});

/**
 * friendlink 表结构
 * */
var friendlinkSchema = new mongoose.Schema({
    sitename:String,
    link:String,
    describe:String,
    img:String
});


/**
 * interact 表结构
 * */
var interactSchema = new mongoose.Schema({
    visitor:String,
    comment:String,
    parent:String,
    img:String,
    time:String,
    type:String,
    aId:String
});


/**
 * tags 表结构
 * */
var tagSchema = new mongoose.Schema({
    name:String,
    index:String
});

/**
 * timeline 表结构
 * */
var timelineSchema = new mongoose.Schema({
    time:String,
    title:String,
    content:String,
    img:String
});

/**
 * 用户的表结构
 */
var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    userimg:String,
    type:String//管理员、普通用户
});

/**
 * 访问用户的表结构
 */
var visitrecordSchema = new mongoose.Schema({
    time:String,
    ip:String,
    count:Number
});


/**
 * model
 */
module.exports.Article = mongoose.model('article',articleSchema);

module.exports.Crawlers =  mongoose.model('crawler',crawlerSchema);

module.exports.Friendlink =  mongoose.model('friendlink',friendlinkSchema);

module.exports.Interact =  mongoose.model('interact',interactSchema);

module.exports.Tags =  mongoose.model('tag',tagSchema);

module.exports.Timeline =  mongoose.model('timeline',timelineSchema);

module.exports.User = mongoose.model("user",userSchema);

module.exports.Visitrecord =  mongoose.model('visitrecord',visitrecordSchema);
