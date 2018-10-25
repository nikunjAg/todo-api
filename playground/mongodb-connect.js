const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbname = 'TodosApp';

MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=> {

    if(err) {
        return console.log('Unable to connect to the server.')
    }

    console.log('Connected to the server.');

    const db = client.db(dbname);

    db.collection('Users').insertOne({
        name: 'Abc',
        age: 14,
        location: 'Delhi'
    }, (err, result)=> {
        if(err) {
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();
});


