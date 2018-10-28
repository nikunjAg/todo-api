const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 3
}

var token = jwt.sign(data, '123abc');
// console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('Decoded', decoded);


// var data = {
//     id: 3
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'mySecret').toString()
// }

// token.data.id = 4;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// if(SHA256(JSON.stringify(token.data) + 'mySecret').toString() === token.hash){
//     console.log('Data wasn\'t changed');
// }
// else{
//     console.log('Data was changed. Don\'t trust.')
// }