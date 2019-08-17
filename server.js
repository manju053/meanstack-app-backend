const Issue = require('./models/issue');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());




var mongoDB = `mongodb+srv://manju053:8050319599@mycluster-hoin2.mongodb.net/issues?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, {useNewUrlParser: true });
const connection = mongoose.connection;

connection.on('open', () => {
    console.log("Mongo DB database connection established successfully");
});

app.use('/', router);
router.route('/issues').get((req, res) => {
    Issue.find((err,issues) => {
        if(err) {
            console.log(err);
        } else {
            res.json(issues);
        }
    });
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err,issue) => {
        if(err) {
            console.log(err);
        } else {
            res.json(issue);
        }
    });
});

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
         .then(issue => {
             res.status(200).json({'issue': 'Added successfully'})
         })
         .catch(err => {
             res.status(400).send('Failed to create new records');
         });
});

router.route('/issues/update/:id').post((req,res) => {
    Issue.findById(req.params.id, (err,issue) => {
        if(!issue) {
            return next(new Error('Could not load the document'));
        } else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;
            issue.save()
                 .then(issue => {
                     res.json('Update done');
                 })
                 .catch(err => {
                     res.status(400).send('Update failed');
                 });
        }
    });
});

router.route('/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({"_id": req.params.id}, (err,issue) => {
        if(err)
            res.json(err);
        else 
            res.json('Removed successfully');
    });
});
//app.get('/', (req, res) => res.send('Hello World!'));
app.listen(5000, () => console.log('express server running on port 5000'));