const express=require("express");
const router = express.Router();

const UserService = require("../../services/UserService");


router.post('/register', (req,response) =>{
    UserService.createUser(req.body.username, req.body.password)
    .then((token)=>{
        if (token==="user existed")
            return response.status(200).json({result : token});
        const login = {
            token : token ? "bearer " + token : null,
            isLogin: token ? true: token
        }
        response.status(200).json({result : login});
    })
    .catch((err)=>{
        response.status(500).json("error bro")
    });
});

router.post('/login', (req,response)=>{
    UserService.login(req.body.username, req.body.password).then((token)=>{
        const login = {
            token : token ? "bearer " + token : null,
            isLogin: token ? true: token
        }
        response.status(200).json({result : login});
    })
    .catch((err)=>{
        response.status(500).json("error bro")
    })
})

router.get("/getuser",(req,response)=>{
    UserService.getAllUser().then(res=>{
        response.status(200).json({result : res});

    })
})

module.exports = router;