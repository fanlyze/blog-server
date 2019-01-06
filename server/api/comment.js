import Express from 'express'

const router = Express.Router();
import Comment from '../../models/interact'
import {responseClient} from '../util'


router.get('/getCommentsDetail', (req, res) => {
    let _id = req.query.id;
   Comment.findOne({_id})
       .then(data=>{
           responseClient(res,200,0,'success',data);
       }).cancel(err => {
       responseClient(res);
   });
});

router.post('/addComments', function (req, res) {
    const {
        visitor,
        comment,
        parent,
        img,
        time,
        type,
        aId
    } = req.body;

    let tempComment = new Comment({
        visitor,
        comment,
        parent,
        img,
        time,
        type,
        aId
    });
    tempComment.save().then(data=>{
        responseClient(res,200,0,'保存成功',data)
    }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

router.post('/updateComments',(req,res)=>{
    const {
        visitor,
        comment,
        parent,
        img,
        time,
        type,
        aId,
        id
    } = req.body;
    Comment.update({_id:id},{visitor,comment,parent,img,time,type,aId})
        .then(result=>{
            console.log(result);
            responseClient(res,200,0,'更新成功',result)
        }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

router.get('/delComments',(req,res)=>{
    let id = req.query.id;
    Comment.remove({_id:id})
        .then(result=>{
            if(result.result.n === 1){
                responseClient(res,200,0,'删除成功!')
            }else{
                responseClient(res,200,1,'评论不存在');
            }
        }).cancel(err=>{
            responseClient(res);
    })
});

module.exports = router;
