const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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

});

app.get('/todos', (req, res)=> {
    Todo.find().then((todos)=> {
        res.send({todos});
    }, (err)=> {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res)=> {
    var id = req.params.id;

    if(!ObjectID.isValid(id))
        return res.status(404).send({
            err: 'This Id not a valid one.'
        });
       
    Todo.findById(id).then((todo)=> {

        // when object ID is valid but is not present inside the collection
        if(!todo){
            return res.status(404).send({
                err: 'No Todo found with this ID.'
            });
        }

        res.send({todo});
    }).catch((e) => res.status(400).send({
        err: 'Error Occured.'
    }));    

});

app.listen(3000, ()=> {
    console.log('App has started on port 3000');
});

module.exports = {app};