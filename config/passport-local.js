const passport= require('passport');
const localStrategy= require('passport-local');

const Users= require('../models/users');

passport.use(new localStrategy(
    {
        usernameField: 'email'    
    },
    (user, password, done)=>{
        Users.findOne({email: user}, (err, user)=>{
            if(err){
                return done(err, false);
            }

            if(!user || user.password!=password){
                return done(null, false);
            }
            return done(null, user);
        })
    }
))

//creates session and stores req.session.passport.user= user.id
passport.serializeUser((user, done)=>{
    done(null, user.id);
})

//stores user object in req.user
passport.deserializeUser((id, done)=>{
    Users.findById(id, (err, user)=>{
        if(err){
            done(err);
        }
        done(null, user);
    })
})

module.exports= passport;