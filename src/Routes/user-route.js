const express = require('express')
const User = require('../Models/User')

//middleware implementado para realizar a validação do token do usuário para acessa a rota
const check_auth = require('../Middleware/check-auth')

//biblioteca javascript para encriptar senha para salvar no banco
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/user',(req,res)=>{
    User.find({},(err,users)=>{
        
        if(err){
            res.send('erro ao listar usuários')
        }

        else{
            res.send(users)
        }
    })
})

router.post('/user',check_auth,(req,res) => {
    User.find({email:req.body.email}, async (err,users)=>{
        if(users.length >= 1){
            await res.send('Email já cadastrado')
        }

        else{
            // metodo de encpriptar a senha (string,salt,callback)
            //salt é o numero de string randomicas incluidas no hash para dificultar decriptação do hash de senha
            bcrypt.hash(req.body.password,10, async (err,hash) => {
            if(err){
                return res.status(500).json({erro:err})
            }

            else{
                const Newuser = new User({
                    email:req.body.email,
                    name:req.body.name,
                    password:hash
                })  
                await Newuser.save()
                res.send("Usuário criado")
            }
            })
        }
    })

   
})


//rota que define a autorização do usuário
router.post('/auth',(req,res)=> {
    try{
        //verifica se a o email existe no banco de dados se não existir retorna uma array vazio
        User.find({email:req.body.email},(err,users)=> {
            if(users.length < 1 ){
               return res.status(400).json({message:"autorizacao falhou"})
            }
            //compara a entrada com a senha encriptada no banco de dados
            bcrypt.compare(req.body.password,users[0].password,(err,result)=>{
                if(err){
                    return res.status(400).json({message:"autorizacao falhou"})
                }

                if(result){
                    //verifica se o usuário é admin e gera um token para admin
                    if(users[0].email === 'user_teste1@algo.com'){
                        const token = jwt.sign({email:users[0].email,id:users[0]._id,admin:true},
                            "secret",{expiresIn:"1h"})
                        return res.status(200).json({message:'autorizacao Funcionou',token:token})    
                    }
                    //criando token pro usuário e enviando na resposta
                    const token = jwt.sign({email:users[0].email,id:users[0]._id},"secret",{expiresIn:"1h"})
                    return res.status(200).json({message:'autorizacao funcinou',token:token})
                }

                res.status(400).json({message:"autorizacao falhou"})
            })
        })
    }

    catch(err){
        console.log('autorização falhou')
    }
})


router.delete("/:userId",(req,res)=>{
    User.remove({_id:req.params.userId},async(result) => {
        res.status(200).json({
            message:"User deleted"
        })
    })
})


module.exports = router