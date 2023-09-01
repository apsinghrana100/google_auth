const express=require('express');
const session = require('express-session');
const app=express();
const router = express.Router();
const passport = require('passport');
const cors=require('cors')
const usermodule=require('../module/usertable');

app.use(cors());






/*  Google AUTH  */

var userProfile;

app.use(passport.initialize());
app.use(passport.session());
 
router.get('/success', async (req, res) => {

  const count=await usermodule.count({where:{useremailid:userProfile.emails[0].value}});
  if(count)
  {
      res.redirect('/addexpenseform.htm')
  }else{
    if(userProfile.emails[0].verified){
      await  usermodule.create({
        username:userProfile.displayName,
        useremailid:userProfile.emails[0].value,
      });
      res.redirect('/addexpenseform.htm')
    }else{
      res.send("This email id does not exits");
    }
     
   
  }
    //  res.send(userProfile)
});
router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '34373141691-2bgpdv2sahgfs0eo0rttvv9pur7ii20t.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));


 
router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
  router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

  module.exports = router;