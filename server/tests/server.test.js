const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

var todos = [{
    _id: new ObjectID(),
    text: 'Test todos text1'
}, {
    _id: new ObjectID(),
    text: 'Test todos text2',
    completed: true,
    completedAt: 333
}];

beforeEach((done)=> {
    Todo.deleteMany({}).then(()=> {
        Todo.insertMany(todos);
    }).then(()=> done());
})

describe('POST /todos', ()=> {
    it('should create a new todo', (done)=> {
        
        var text = 'Test Todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=> {
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=> {
                if(err)
                    return done(err);
                
                Todo.find({text}).then((todos)=> {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> {done(e)});    
            });       
    });

    it('should not update the database on wrong entry', (done)=> {
        
        // here end has a function as the request is async
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res)=> {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=> {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });

});

describe('GET /todos', ()=> {
        
    // here end is normal as the request is not async
    it('should get all todos', (done)=> {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=> {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

});

describe('GET /todos/:id', ()=> {

    it('should print all the valid todo', (done)=> {
        request(app)
            .get('/todos/' + todos[0]._id.toHexString())
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end(done);
    });

    it('should return 404 if no todo found', (done)=> {

        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-ObjectID', (done)=> {

        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todos/:id', ()=> {
    it('should delete a todo', (done)=> {
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res)=> {
                if(err)
                    return done(err);
                
                Todo.findById(hexID).then((todo)=> {
                    expect(todo).toBe(null);
                    done(); 
                }).catch((e)=> done(e));    
            });

    });

    it('should return 404 if the TODO wasn\'t deleted', (done)=> {
        request(app)
            .delete('/todos/' + new ObjectID().toHexString())
            .expect(404)
            .end(done);
    });

    it('sholud return 404 if the ID wasn\'t valid', (done)=> {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });

});


describe('PATCH /todos/:id', ()=> {

    it('should update the todo', (done)=> {
        var id = todos[0]._id.toHexString();

        request(app)
            .patch('/todos/' + id)
            .send({
                text: 'Test todo text 5',
                completed: true
            })
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe('Test todo text 5'.toString());
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done)=> {
        var id = todos[1]._id.toHexString();

        request(app)
            .patch('/todos/' + id)
            .send({
                text: 'Test todo text6',
                completed: false
            })
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe('Test todo text6'.toString());
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist;
            })
            .end(done);
    });

});