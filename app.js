const express = require('express');
const app = new express();
const config = require('./config');
const bodyParser = require('body-parser');
const nunjucks=require('nunjucks');
const fs = require('fs')
const path = require('path')
const dayjs=require('dayjs');
const fileUpload = require('express-fileupload');

app.use(bodyParser.urlencoded({extended: false}));
nunjucks.configure({ autoescape: true });

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache :true
});

const {User, Games} = require('./db/index')
app.use(fileUpload());

app.post('/api/upload', function(req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    sampleFile = req.files.file;
    const fileName=sampleFile.md5+'.'+sampleFile.name.split('.')[1];
    uploadPath = __dirname + '/public/img/' + fileName;
    sampleFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).json({
                success:false
            });
        res.json({
            success:true,
            fileName
        })
    });
});


app.use('/public', express.static('./public'));


app.get('/',async (req,res)=>{
    res.render('index.html',{

    })
})

app.get('/reg',async (req,res)=>{
    res.render('reg2.html',{})
});

app.get('/games',async(req,res)=>{
   const data= await  Games.findAll()
    const cart=await Games.findAll({
        where:{
            use:true
        },
        raw:true
    })
    let total=cart.reduce((total,cur)=>{
        return Number(total) +Number( cur.price)
    },0)
   res.render('games.html',{data,cart,total})
});

app.get('/gamedetail',async(req,res)=>{
    try{
        const data= await  Games.findOne({
            where:{
                id:req.query.id
            }
        })
        data.time=dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')
        res.render('detail.html',{
            data
        })
    }
    catch (e){
        res.redirect('/games')
    }
});


app.get('/add',async (req,res)=>{
   res.render('add.html')
});
const loadRouters = (dir) => {
    fs.readdirSync(dir).forEach(item => {
        app.use(`/api`, require(path.resolve(__dirname, dir, item)))
    })
}

app.use(require('./routers/user'))
app.listen(config.port, () => {
    loadRouters('./routers');
    config.bootTip();
})


