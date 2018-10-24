var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var autoIncrement = require('mongodb-autoincrement');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tickets', function (req, res) {
    const url = 'mongodb://localhost:27017/tickets';
    mongoose.connect(url, function (err, db) {

   if(err) {
       console.log(err);
   } else{
       console.log("Connection Established");

       var collection = db.collection('tickets');

       collection.find({}).toArray(function (err, result) {
           if (err){
               res.render('error', { message: 'We ran into some problems, Contact system Administrator'});
           }else if (result.length){
               res.render('ticketlist',{ "ticketlist" : result});
           } else{
               res.render('error', { message: "There doesn't seem to be any records"});
           }
           db.close();
       })
   }
 })
});

router.get('/newticket', function (req,res) {
    res.render('newticket', {title: "New Ticket"});
});

router.post('/addticket', function (req,res) {
    //var MongoClient = mongodb.$MongoClient;

    var url = 'mongodb://localhost:27017/tickets';

    mongoose.connect(url, function (err, db) {
        if(err){
            console.log("unable to connect");
        } else {
            console.log("Connected to server");

            var collection = db.collection('tickets');

            var ticket1= {tNum: req.body.tNum, category: req.body.category, customer: req.body.customer,
            problem: req.body.problem, status: req.body.status, fAction: req.body.fAction, date: new Date(Date.now())};

            collection.insert([ticket1], function (err,result) {
                if(err){
                    console.log(err);
                } else{
                    res.redirect("/tickets");
                }

                db.close();
            });
        }
    });
});

router.get('/openticket', function (req, res) {
    var url ='mongodb://localhost:27017/tickets';
    mongoose.connect(url, function (err, db) {
        if (err){
            console.log('error');
        } else {
            var open = db.collection('tickets');

            open.find({"status": "Open"}).toArray(function (err, result) {
                res.render('ticketlist',{ "ticketlist" : result});

            });
        }

    });
});

router.get('/closedticket', function (req, res) {
    var url ='mongodb://localhost:27017/tickets';
    mongoose.connect(url, function (err, db) {
        if (err){
            console.log('error');
        } else {
            var open = db.collection('tickets');

            open.find({"status": "Closed"}).toArray(function (err, result) {
                res.render('ticketlist',{ "ticketlist" : result});
            });
        }

    });
});

router.get('/viewticket/:id', function (req, res) {
    var url = 'mongodb://localhost:27017/tickets';

    mongoose.connect(url, function (err, db) {
        if (err){
            console.log('Unable to connect');
        } else {
            console.log('Connected to Server');
            var collection = db.collection('tickets');
            //var o_id = req.param.id;
            var o_id = new ObjectId(req.params.id);

            console.log(o_id);
            collection.find({"_id":o_id}).toArray(function (err, result) {
                res.render('viewticket',{
                    tNum: result[0].tNum,
                    customer: result[0].customer,
                    problem: result[0].problem,
                    category: result[0].category,
                    fAction: result[0].fAction,
                    date: result[0].date,
                    status: result[0].status,
                    _id: result[0]._id

                });
            });
        }
    });
});
router.get('/edit/:id', function (req, res) {
    var url = 'mongodb://localhost:27017/tickets';

    mongoose.connect(url, function (err, db) {
        if (err){
            console.log('Unable to connect');
        } else {
            console.log('Connected to Server');
            var collection = db.collection('tickets');
            //var o_id = req.param.id;
            var o_id = new ObjectId(req.params.id);

            console.log(o_id);
            collection.find({"_id":o_id}).toArray(function (err, result) {
                res.render('editticket',{
                    tNum: result[0].tNum,
                    customer: result[0].customer,
                    problem: result[0].problem,
                    category: result[0].category,
                    fAction: result[0].fAction,
                    date: result[0].date,
                    status: result[0].status,
                    _id: result[0]._id

                });
            });
        }
    });
});

router.post('/edit/:id',function (req, res) {
    var url = 'mongodb://localhost:27017/tickets';

    mongoose.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect');
        } else {
            console.log('Connected to Server');
            var collection = db.collection('tickets');
            //var o_id = req.param.id;
            var o_id = new ObjectId(req.params.id);
            var ticket1= {tNum: req.body.tNum, category: req.body.category, customer: req.body.customer,
                problem: req.body.problem, status: req.body.status, fAction: req.body.fAction};

            console.log(o_id);
            collection.updateOne({"_id": o_id}, {$set:ticket1}),function (err, result) {
                console.log(result);
            };
            res.redirect('/tickets');
        }
    });
});

router.get('/delete/:id', function (req,res) {
    console.log('Deleted');
    res.render('deleteticket');
});

router.post('/delete/:id', function (req, res) {
    var url = 'mongodb://localhost:27017/tickets';
    mongoose.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect');
        } else {
            console.log('Connected to Server');
            var collection = db.collection('tickets');
            var object = req.params.id;
            var o_id= new ObjectId(object);
            collection.remove({"_id":o_id}, function (err, result) {
                console.log(result);
                res.redirect('/tickets');
            });
        }
    });
});
module.exports = router;
