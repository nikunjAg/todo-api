const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

var id = '5bd15d4eda38691aa4cab4f2';
var userid = '5bcf24ecd91d5118a413bc8c';

if (!ObjectID.isValid(id)){
    console.log('Id is not valid');
}

// Todo.find({
//     _id: id
// }).then((todos)=> {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=> {
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo)=> {
    if(!todo)
        return console.log('Id not found');
    console.log('Todo By Id ', JSON.stringify(todo, undefined, 2));
}).catch((e)=> console.log(e));

Users.findById(userid).then((user)=> {
    if(!user)
        return console.log('No such user exists');
    console.log('User', JSON.stringify(user, undefined, 2));    
}).catch((e)=> console.log(e));