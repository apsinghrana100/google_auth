const express=require('express');
const session = require('express-session');

const bodyperser=require('body-parser');
const path=require('path');
const cors=require('cors')
var passport = require('passport');

const app=express();

app.use(cors());
app.use(bodyperser.urlencoded({extended:true}));
app.use(bodyperser.json());


// const passport = require('passport');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));


// this is route(path)
const sequelize=require('./util/connection');
const routerlogin=require('./router/signupmodule');
const routerexpense=require('./router/expense');
const routepremium=require('./router/premium');
const routepassword=require('./router/password');
const routegoogle = require('./router/google')
const routepages = require('./router/pages');


// this is all Model(table)
const usertbl=require('./module/usertable');
const expenstbl=require('./module/expenstable');
const order=require('./module/ordertbl');
const forgetpassword=require('./module/ForgotPasswordRequests');
const downloadmodule=require('./module/downloadfilerecord');


const authen=require('./middleware/auth');
 app.use(routerlogin);
 app.use(routerexpense);
 app.use(routepremium);
app.use(routepassword);
app.use(routegoogle);
app.use(routepages);



app.use((req,res,next)=>{
    console.log(req.url);
    res.sendFile(path.join(__dirname,`view/${req.url}`));
})


// here relationship between table

usertbl.hasMany(expenstbl);
expenstbl.belongsTo(usertbl);
// usertbl.hasMany(expenstbl, { foreignKey: 'id' });
// expenstbl.belongsTo(usertbl, { foreignKey: 'tbluserdetailId' });
usertbl.hasMany(order);
order.belongsTo(usertbl);

usertbl.hasMany(forgetpassword);
forgetpassword.belongsTo(usertbl);   

usertbl.hasMany(downloadmodule);
downloadmodule.belongsTo(usertbl);



sequelize.sync().then((result)=>{
    app.listen(process.env.PortNumber || 4000);
}).catch(error=>{
    console.log(error);
});


