/*arquivo que faz a conexão com o mongodb*/

//importando o modulo do mongoose
const mongoose = require('mongoose')

//metodo do mongoose que realiza a conexão com o banco de dados do MongoDB
mongoose.connect('mongodb://localhost/user',{useNewUrlParser:true})

mongoose.Promise = global.Promise

module.exports = mongoose