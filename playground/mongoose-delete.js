const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

// Todo.deleteMany({}).then((result)=> {
//     console.log(result);
// });

Todo.findByIdAndDelete('5bd1dcb90e0a1e19dc49a760').then((todo)=> {
    console.log(todo);
});