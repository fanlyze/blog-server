import Express from 'express'

const router = Express.Router();
import Timeline from '../../models/timeline'
import {responseClient} from '../util'

router.get('/getTimelineDetail', (req, res) => {
    let _id = req.query.id;
   Timeline.findOne({_id})
       .then(data=>{
           responseClient(res,200,0,'success',data);
       }).cancel(err => {
       responseClient(res);
   });
});

router.post('/addTimeline', function (req, res) {
    const {
        time,
        title,
        img,
        content
    } = req.body;

    let tempTimeline = new Timeline({
        time,
        title,
        img,
        content
    });
    tempTimeline.save().then(data=>{
        responseClient(res,200,0,'保存成功',data)
    }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

router.post('/updateTimeline',(req,res)=>{
    const {
        time,
        title,
        img,
        content,
        id
    } = req.body;
    Timeline.update({_id:id},{time,title,img,content})
        .then(result=>{
            console.log(result);
            responseClient(res,200,0,'更新成功',result)
        }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});

router.get('/delTimeline',(req,res)=>{
    let id = req.query.id;
    Timeline.remove({_id:id})
        .then(result=>{
            if(result.result.n === 1){
                responseClient(res,200,0,'删除成功!')
            }else{
                responseClient(res,200,1,'时间线不存在');
            }
        }).cancel(err=>{
            responseClient(res);
    })
});

module.exports = router;
