import Express from 'express'
import Tags from '../../models/tags'
import Article from '../../models/article'
import Interact from '../../models/interact'
import Timeline from '../../models/timeline'
import Friendlink from '../../models/friendlink'
import Crawlers from '../../models/crawler'
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

//获取
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

module.exports = router;
