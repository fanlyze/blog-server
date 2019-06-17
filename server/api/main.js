import Express from 'express'
import {Article,Interact,Timeline,Tags,Friendlink,Crawlers,Visitrecord} from '../../models/mongooseModels'
import {responseClient,md5} from '../util'

const router = Express.Router();

router.use('/user', require('./user'));
//获取全部标签
router.get('/getAllTags', function (req, res) {
    Tags.find(null, 'name index').then(data => {
        responseClient(res, 200, 0, '请求成功', data);
    }).catch(err => {
        responseClient(res);
    })
});

//获取文章
router.get('/getArticles', function (req, res) {
    let tag = req.query.tag || null;
    let isPublish = req.query.isPublish;
    let searchCondition = {
        isPublish,
    };
    if (tag) {
        searchCondition.tags = tag;
    }
    if (isPublish === 'false') {
        searchCondition = null
    }
    let skip = (req.query.pageNum - 1) < 0 ? 0 : (req.query.pageNum - 1) * 5;
    let limit = req.query.pageNum * 5;
    let responseData = {
        total: 0,
        pageNum:1,
        list: []
    };
    responseData.pageNum = parseInt(req.query.pageNum);
    Article.count(searchCondition)
        .then(count => {
            responseData.total = count;
            Article.find(searchCondition, '_id title abstract isPublish author viewCount commentCount time coverImg', {
                //skip: skip,
                limit: limit
            })
                .then(result => {
                    responseData.list = result;
                    responseClient(res, 200, 0, 'success', responseData);
                }).cancel(err => {
                throw err
            })
        }).cancel(err => {
        responseClient(res);
    });
});
router.get('/getAllArticles', function (req, res) {
    let responseData = {
        list: []
    };
    Article.find(null, '_id title abstract isPublish author viewCount commentCount time coverImg')
        .then(result => {
            responseData.list = result;
            responseClient(res, 200, 0, 'success', responseData);
        }).cancel(err => {
        responseClient(res);
    })

});
//获取文章详情
router.get('/getArticleDetail', (req, res) => {
    let _id = req.query.id;
   Article.findOne({_id})
       .then(data=>{
           data.viewCount = data.viewCount+1;
           Article.update({_id},{viewCount:data.viewCount})
               .then(result=>{
                   responseClient(res,200,0,'success',data);
               }).cancel(err=>{
                   throw err;
           })

       }).cancel(err => {
       responseClient(res);
   });
});

//获取时间线
router.get('/getTimeLine', function (req, res) {
    let responseData = {
        list: []
    };
    Timeline.find(null, 'time title content img').then(data => {
        responseData.list = data;
        responseClient(res, 200, 0, '请求成功', responseData);
    }).catch(err => {
        responseClient(res);
    })
});

//获取友情链接
router.get('/getFriendLink', function (req, res) {
    let responseData = {
        list: []
    };
    Friendlink.find(null, 'sitename link describe img').then(data => {
        responseData.list = data;
        responseClient(res, 200, 0, '请求成功', responseData);
    }).catch(err => {
        responseClient(res);
    })
});

//获取评论
router.get('/getComments', function (req, res) {
    let _type = req.query.type;
    let _aId = req.query.aId;
    let responseData = {
        list: []
    };

    ///*
    //find  {type:_type, aId:_aId}
    Interact.find(null, 'visitor comment parent type time img aId').sort({time:-1}).then(data => {
        responseData.list = data;
        responseClient(res, 200, 0, '请求成功', responseData);
    }).catch(err => {
        responseClient(res);
    })
    //*/
});

router.post('/addComment', function (req, res) {
    const {
        //visitor,
        comment,
        type,
        parent,
        time,
        aId
    } = req.body;
    let visitor_ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    let visitor = "visitor"+md5(visitor_ip).substr(1,5);

    var visitor_ip_tmp = visitor_ip.replace(/\./g, '');
    Math.seed =  parseInt(visitor_ip_tmp);
    Math.seededRandom = function(max, min)
    {
       max = max || 35; min = min || 0;
       Math.seed = (Math.seed * 9301 + 49297) % 233280;
       var rnd = Math.seed / 233280.0;
       return min + rnd * (max - min);
    };
    let img = "/interact/"+ parseInt(Math.seededRandom()) + ".jpg";
    if(typeof req.session.userInfo != 'undefined') {
        visitor = req.session.userInfo.username;
        img = req.session.userInfo.userimg;
    }

    let tempComment = new Interact({
        visitor,
        comment,
        type,
        parent,
        img,
        time,
        aId
    });
    let responseData = {
        list: []
    };
    tempComment.save().then(data=>{
        //responseClient(res,200,0,'留言成功',data)
        Interact.find(null, 'visitor comment parent type time img aId').sort({time:-1}).then(data => {

            if(type == 2) {
                let _id = aId;
                Article.findOne({_id})
                   .then(data=>{
                       data.commentCount = data.commentCount+1;
                       Article.update({_id},{commentCount:data.commentCount})
                           .then(result=>{
                               //responseClient(res,200,0,'success',data);
                           }).cancel(err=>{
                               throw err;
                       })

                   }).cancel(err => {
                   responseClient(res);
                });
            }

            responseData.list = data;
            responseClient(res, 200, 0, '留言成功', responseData);
        }).catch(err => {
            responseClient(res);
        })
    }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

//获取栏目网站
router.get('/getColumn', function (req, res) {
    let responseData = {
        list: []
    };
    let siteName = req.query.site;
    //responseData.list = data;
    Crawlers.find({sitename:siteName}, 'url title href time').then(data => {
        responseData.list = data;
        responseClient(res, 200, 0, '请求成功', responseData);
    }).catch(err => {
        responseClient(res);
    })
});

router.get('/getWebsiteInfo', function (req, res) {
    let responseData = {};
    var promiseBluebird = require('bluebird');
    var getArticleCnt = function(cfg){
        return new promiseBluebird(function(resolve, reject){
            Article.count()
                .then(count => {
                    responseData.articleTotal = count;
                    resolve(count);
                }).cancel(err => {
                //responseClient(res);
                reject(err);
            });
        });
    }
    var getCommentCnt = function(cfg){
        return new promiseBluebird(function(resolve, reject){

            Interact.count()
                .then(count => {
                    responseData.commentTotal = count;
                    resolve(count);

                }).cancel(err => {
                //responseClient(res);
                reject(err);
            });

        });
    }
    var getVisitCnt = function(cfg){
        return new promiseBluebird(function(resolve, reject){

            Visitrecord.aggregate([{$group:{_id:"null", count:{ $sum:"$count"}}}])
                .then(obj => {
                    responseData.visitTotal = obj[0].count;
                    //resolve(count);
                    responseClient(res, 200, 0, '请求成功', responseData);

                }).cancel(err => {
                //responseClient(res);
                reject(err);
            });
        });
    }
    var setVisitCnt = function(cfg){
        return new promiseBluebird(function(resolve, reject){

            let visitor_ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
            Visitrecord.findOne({ip: visitor_ip})
               .then(data=>{
                    let dateFormat = require('dateformat');
                    let time = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    if(data == null) {
                       let count = 1;
                       let tmpVisitrecord = new Visitrecord({
                           ip: visitor_ip,
                           time,
                           count
                       });
                       tmpVisitrecord.save().then(data=>{
                           resolve(data);
                       }).cancel(err=>{
                           reject(err);
                       });
                    } else {
                        let nowDate = new Date(data.time);
                        if(Date.now()-nowDate.getTime()>30*60*1000) {
                            data.count = data.count+1;
                        }
                        Visitrecord.update({ip: visitor_ip},{count:data.count,time:time})
                           .then(result=>{
                               resolve(result);
                           }).cancel(err=>{
                               reject(err);
                       })
                   }
               }).cancel(err => {
               responseClient(res);
            });



        });
    }


    //文章数、评论数、访问数
    getArticleCnt().then(getCommentCnt).then(getVisitCnt).catch(err => {
        responseClient(res);
    })
    setVisitCnt();

});

module.exports = router;
