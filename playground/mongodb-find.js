const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbname = 'TodosApp';

MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=> {
    if(err) {
        return console.log('Can\'t connect to the server');
    }

    console.log('Connected to the server');

    var db = client.db(dbname);

    db.collection('Users').find({name: 'Nikunj'}).toArray().then((docs)=> {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=> {
        console.log('Unable to fetch the document', err);
    });

    client.close();

});