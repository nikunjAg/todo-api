const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbname = 'TodosApp';

MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=> {
    if(err) {
        return console.log('Can\'t connect to the server');
    }

    console.log('Connected to the server');

    var db = client.db(dbname);

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bcd9dd1035754205c888873')
    }, {
        $set: {
            name: 'DEF'
        },
        $inc: {
            age: +1
        }
    },
    {
        returnOriginal: false
    }).then((result)=> {
        console.log('This is the updated document');
        console.log(JSON.stringify(result.value, undefined, 2));
    }, (err)=> {
        console.log('Unable to update this document', err);
    });

    client.close();

});