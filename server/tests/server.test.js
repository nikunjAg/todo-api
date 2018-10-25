const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

var todos = [{
    text: 'Test todos text1'
}, {
    text: 'Test todos text2'
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