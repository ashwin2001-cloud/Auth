const express= require('express');
const app= express();
const port= process.env.POST || 3000;

const {db, mongoURL}= require('./config/mongoose');
const Users= require('./models/users');
const path= require('path');

const session= require('express-session');
const MongoStore= require('connect-mongo');

const passport= require('passport');
const passportLocal= require('./config/passport-local');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded());

app.use(session({
    name: "Session_name",
    secret: "Some secret",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({mongoUrl:mongoURL})
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res)=>{
    console.log(req.sessionID);
    if(req.isAuthenticated()){
        res.render('profile', {
            email: req.user.email
        });
    }
    else res.redirect('/login');
})

app.get('/login', (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('/');
    }
    else res.render('login');
})

app.get('/signup', (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('/');
    }
    else res.render('signup');
});

app.post('/createSession', passport.authenticate('local', { failureRedirect: '/login'}), (req, res)=>{
    res.redirect('/');
})

app.get('/logout', (req, res)=>{
    // req.logout();
    res.clearCookie('Session_name');
    console.log('***', req.sessionID, '***');
    res.redirect('/');
})

app.post('/createAccount', (req, res)=>{
    console.log(req.body);
    if(req.body.password==req.body.password_reenter){
        Users.create(req.body);
    }
    res.redirect('/login');
})


app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Blog is running on port: ', port);
    }
});