const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbname = 'TodosApp';

MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=> {
    if(err) {
        return console.log('Can\'t connect to the server');
    }

    console.log('Connected to the server');

    var db = client.db(dbname);

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=> {
    //     console.log(result);
    // }, (err)=> {
    //     console.log('Unable to delete the document', err);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=> {
    //     console.log(result);
    // }, (err)=> {
    //     console.log('Unable to delete the document', err);
    // })

    // deleteMany
    db.collection('Todos').findOneAndDelete({completed: 'true'}).then((result)=> {
        console.log('The following document has been deleted.')
        console.log(JSON.stringify(result.value, undefined, 2));
    }, (err)=> {
        console.log('Unable to delete the record', err);
    });

    client.close();

});