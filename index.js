const express= require('express');
const app= express();
const port= 3000;

const {db, mongoURL}= require('./config/mongoose');
const Users= require('./models/users');
const path= require('path');

const session= require('express-session');
const MongoStore= require('connect-mongo');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded());

app.use(session({
    name: "Session_name",
    secret: "Some secret",
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: mongoURL})
}));

app.get('/', (req, res)=>{
    if(req.session.user){
        res.render('profile', {
            email: req.session.user
        });
    }
    else res.redirect('/login');
})

app.get('/login', (req, res)=>{
    if(req.session.user){
        res.redirect('/');
    }
    else res.render('login');
})

app.get('/signup', (req, res)=>{
    if(req.session.user){
        res.redirect('/');
    }
    else res.render('signup');
});

app.post('/createSession', (req, res)=>{
    console.log(req.body);
    Users.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            console.log(err); return;
        }

        if(user && user.password==req.body.password){
            req.session.user= req.body.email;
            res.redirect('/');
        }
        else res.redirect('/login');
    })
})

app.get('/logout', (req, res)=>{
    res.clearCookie("Session_name");
    res.redirect('/');
})

app.post('/createAccount', (req, res)=>{
    console.log(req.body);
    if(req.body.password==req.body.password_reenter){
        Users.create(req.body);
        req.session.user= req.body.email;
        console.log(req.session.user);
        res.redirect('/');
    }
    else res.redirect('/');
})


app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Blog is running on port: ', port);
    }
});