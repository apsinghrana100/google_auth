const express=require('express');
const { authenticate } = require('../middleware/auth');
const router=express.Router();

function isAuthenticated(req, res, next) {
    // Check if the user is authenticated (based on your authentication mechanism)
    if (!req.user) {
      // If the user is not authenticated, redirect to the login page
      return res.redirect('/loginPage.htm'); // Change '/login' to the actual login page URL
    }
    // If the user is authenticated, continue to the next middleware
    next();
  }

router.get('/home',isAuthenticated,(req,res)=>{
    res.render('/loginPage.htm')
})

module.exports = router;