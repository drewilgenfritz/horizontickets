var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/users';
/* GET users listing. */
router.get('/', function(req, res, next) {
    var url = 'mongodb://localhost:27017/users';
    mongoose.connect(url, function (err, db) {
        //Check for Errors
        if(err) {
            console.log(err);
        } else {//connect to database
            console.log("Connection Established");
            //set collection
            var collection = db.collection('users');
            //send it to an array and do some error handling.
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    //res.render('error', {message: 'We ran into some problems, Contact system Administrator'});
                } else if (result.length) {
                    res.render('users', {"userlist": result});
                } else {
                    //res.render('error', {message: "There doesn't seem to be any records"});
                }
                db.close();
            });
        }
    });
});

router.get('/adduser', function (req, res) {
    res.render('adduser');
});

router.post('/adduser', function (req, res) {
    mongoose.connect(url, function (err, db) {
        //Check for Errors
        if(err) {
            console.log(err);
        } else {//connect to database
            console.log("Connection Established");
            //set collection
            var collection = db.collection('users');
            //send it to an array and do some error handling.
            var newUser = {username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email,
                            password: req.body.password, role: req.body.role};

                collection.insert([newUser], function (err,result) {
                    if (err) {
                        console.log(err);
                        res.redirect('/users');
                    } else {
                        res.redirect("/users");
                    }
                });

            db.close();

        }
    });
});

module.exports = router;
