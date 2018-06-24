import Express from 'express'
import Tags from '../../models/tags'
import Article from '../../models/article'
import Interact from '../../models/interact'
import Timeline from '../../models/timeline'
import Friendlink from '../../models/friendlink'
import Crawlers from '../../models/Crawler'
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
    let responseData = {
        total: 0,
        list: []
    };
    Article.count(searchCondition)
        .then(count => {
            responseData.total = count;
            Article.find(searchCondition, '_id title isPublish author viewCount commentCount time coverImg', {
                skip: skip,
                limit: 5
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
    let responseData = {
        list: []
    };
    ///*
    Interact.find({type:'1'}, 'visitor comment parent type time').sort({time:-1}).then(data => {
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
        time
    } = req.body;
    let visitor = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    visitor = "visitor"+md5(visitor).substr(1,5);
    let tempComment = new Interact({
        visitor,
        comment,
        type,
        parent,
        time
    });
    let responseData = {
        list: []
    };
    tempComment.save().then(data=>{
        //responseClient(res,200,0,'留言成功',data)
        Interact.find({type:'1'}, 'visitor comment parent type time').sort({time:-1}).then(data => {
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
