import Express from 'express'

const router = Express.Router();
import Friendlink from '../../models/friendlink'
import {responseClient} from '../util'


router.get('/getFriendlinkDetail', (req, res) => {
    let _id = req.query.id;
   Friendlink.findOne({_id})
       .then(data=>{
           responseClient(res,200,0,'success',data);
       }).cancel(err => {
       responseClient(res);
   });
});

router.post('/addFriendlink', function (req, res) {
    const {
        sitename,
        link,
        describe,
        img
    } = req.body;

    let tempFriendlink = new Friendlink({
        sitename,
        link,
        describe,
        img
    });
    tempFriendlink.save().then(data=>{
        responseClient(res,200,0,'保存成功',data)
    }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

router.post('/updateFriendlink',(req,res)=>{
    const {
        sitename,
        link,
        describe,
        img,
        id
    } = req.body;
    Friendlink.update({_id:id},{sitename,link,describe,img})
        .then(result=>{
            console.log(result);
            responseClient(res,200,0,'更新成功',result)
        }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

router.get('/delFriendlink',(req,res)=>{
    let id = req.query.id;
    Friendlink.remove({_id:id})
        .then(result=>{
            if(result.result.n === 1){
                responseClient(res,200,0,'删除成功!')
            }else{
                responseClient(res,200,1,'友链不存在');
            }
        }).cancel(err=>{
            responseClient(res);
    })
});

module.exports = router;
