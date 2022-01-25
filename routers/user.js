const express = require('express');
const Router = express.Router();
const { User, Games, Code } = require('../db/index')
var email = require('nodemailer');
const { auth, upload } = require('../middlewares/index');
//登录
Router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let data = await User.findOne({
        where: {
            username,
            password
        }
    })
    if (data) {
        res.json({
            success: true,
            msg: 'Login succeeded',
            redirect: '/games'
        })
    } else {
        res.json({
            success: false,
            msg: 'username or password error',
        })
    }

});
//注册用户
Router.post('/user', async (req, res) => {
    try {
        const { code, username, email, password } = req.body;

        let target = await Code.findOne({
            where:{
                code,
                email
            }
        })
        if(!target){
            return res.json({
                success:false,
                msg:'Verification code error'
            })
        }

        await User.create(
            {
                username,
                password,
                email
            }
        )
        res.json({
            success: true,
            msg: 'Register succeeded',
            redirect: '/'
        })
    } catch (e) {
        res.json({
            success: false,
            msg: 'Register Failed'
        })
    }

});

Router.post('/game', async (req, res) => {
    const { name, desc, cover, price, language, author, isbn, publisher, size } = req.body;
    await Games.create({
        name, desc, cover, price, language, author, isbn, publisher, size
    })
    res.json({
        success: true,
        msg: 'ok'
    })
})

Router.delete('/game', async (reqq, res) => {
    let id = req.query.id;
    await Games.destroy({
        where: {
            id
        }
    })
    res.json({
        success: true,
        msg: 'ok'
    })
});

Router.get('/use', async (req, res) => {
    await Games.update({
        use: req.query.use,
    },
        {
            where: {
                id: req.query.id
            }
        });
    res.json({
        success: true
    })
});

Router.get('/del', async (req, res) => {
    let id = req.query.id;
    if (!id) {
        res.json({
            success: false,
            msg: 'game id is required'
        })
    }
    await Games.destroy({
        where: {
            id
        }
    })
    res.json({
        success: true
    })
});

var transporter = email.createTransport({
    service: 'qq',
    auth: {
        user: '867785789@qq.com',
        pass: 'nocunoykhbwibbfe' //授权码,通过QQ获取
    }
});



Router.post('/send', async (req, res) => {
    let email=req.body.email;
  
    let proving = ~~(Math.random()*9000 + 1000);
    let target=await Code.findOne({
        where:{
            email
        }
    })
    if(!target){
         await Code.create({
            email,
            code:proving
        })
        await send(email, proving)
        return res.json({
            success:true,
            msg:'The email has been sent successfully'
        })
    }else{

        let result=new Date().getTime() - new Date(target.updatedAt).getTime()
        if(new Date().getTime() - new Date(target.updatedAt).getTime() < 60000){
            return res.json({
                success:false,
                msg:'The operation is too frequent. Please try again later'
            })
        }else{
            await Code.update({
                code:proving
            },
            {
                where:{
                    email
                }
            })
            await send(email,proving)
            return res.json({
                success:true,
                msg:'Verify that the message has been sent successfully'
            })
        }
    }
})

function send(email,code) {
    var mailOptions = {
        from: '867785789@qq.com',
        to: email,
        subject: 'Register', 
        html: '<table style="width: 1193px;padding: 0;border-collapse: collapse;margin:0 auto; background-color: #f1f1f1;"><tr> <td style="padding: 0;"> <div style="box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);width: 953px;height: 436px;background-color: #fff;margin:80px auto;font-family: PingFangSC,Microsoft Yahei;color:#424242"> <div style="padding:0 120px 70px;"> <div> <div style="height: 106px;padding-top: 15px;border-bottom: 1px solid #e0e0e0;text-align: center;line-height: 121px;"><img src="//img.027cgb.cn/20170510/2017525422407433177.png"/></div><div style="padding-bottom: 60px;;border-bottom:1px solid #e0e0e0;font-size: 14px;line-height: 30px;"> <div style="height: 89px;line-height: 89px;font-size: 24px;font-weight:600;color: #1a1a1a;"> Perfect World Games </div> <div style="font-family: PingFangSC-Regular,Microsoft Yahei;"><div>Hello:</div><div style="line-height: 30px;margin-top: -2px;"> 	Please verify your email address using the code <span style="font-size: 22px;font-family: PingFangSC-Semibold,Arial;color:#da101f;font-weight:600">' + code + '</span> above to complete account setup.Your verification code will expire in 30 minutes, so make sure you use it as soon as you can.</div> </div> </div> <div style="margin-top: 17px; font-size: 12px;color: #8c8c8c;text-align: center;"> This is an automatically generated email. Please do not reply.</div></div></div></div></td></tr><tr><td style="padding: 0;"><div style="background: #323232;height: 40px;text-align: center;line-height: 40px;color:#fff;font-size: 12px">Perfect World Games</div></td> </tr> </table>'
    };
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                console.log('发送失败');
            }
            else{
                console.log('发送成功');
            }
            resolve(!!err)
        });
    });
}


module.exports = Router;
