/*middlware necessário para realizar a decodificação do token e continua com a rotina da rota houver sucesso na autenticação.*/

const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token,"secret")
        if(decoded.admin){
            next()
        }
        else{
            res.send('not admin')
        }
    }
    catch(error){
        res.send('auth failed')
    }
}