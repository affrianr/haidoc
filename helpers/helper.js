const bcrypt = require('bcryptjs');

function  hashPass(password) {
    let hash = bcrypt.hashSync(password, 8)
    return hash
}

// class Helper {
//     static hashPass(password){
//         let hash = bcrypt.hashSync(password, 8)
//         password = hash
//     }
// }
module.exports =  { hashPass } 