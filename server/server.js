const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/user');
var {Todo} = require('./models/todo');
const {authenticate} = require('./middleware/authenticate');

const PORT = 3000;

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
        return res.status(404).send();
       
    Todo.findById(id).then((todo)=> {

        // when object ID is valid but is not present inside the collection
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => res.status(400).send());    

});

app.delete('/todos/:id', (req, res)=> {

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id).then((todo)=> {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res)=> {
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();   
    }  
    else{
        body.completed = false;
        body.completedAt = null;
    }  

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo)=> {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e)=> {
        res.status(400).send();
    })

});


app.post('/users', (req, res)=> {
    var body = _.pick(req.body, ['email', 'password']);

    var newUser = new Users({
        email: body.email,
        password: body.password
    });

    newUser.save().then(()=> {
        return newUser.generateAuthToken();
    }).then((token)=> {
        res.header('x-auth', token).send(newUser);        
    }).catch((e) => res.status(400).send({e}));

});

app.get('/users/me', authenticate, (req, res)=> {
    res.send(req.user);
})


app.listen(PORT, ()=> {  
    console.log(`App started on port ${PORT}.`);
});

module.exports = {app};