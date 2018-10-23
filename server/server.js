const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res)=> {
    var newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((docs)=> {
        res.send(docs);
    }, (err)=> {
        res.status(400).send(err);
    });

})

app.listen(3000, ()=> {
    console.log('App has started on port 3000');
})