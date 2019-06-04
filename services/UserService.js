const { User } = require('../models/UserModal');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getHashedPasword = (password) =>{
    return bcrypt.genSalt(10).then((salt) => {
        return bcrypt.hash(password, salt)
    })
}

const UserService = {
    createUser: (username, password) => {
        return User.findOne({ username })
            .then(res => {
                if (res) return ("user existed");
                return getHashedPasword(password);
            })
            .then(res =>{
                if (res === "user existed") return res;
                const newUser = new User({
                    username,
                    password:res
                })
                return newUser.save();
            })
            .then(res=>{
                const payload={
                    username: res.username
                }
                if (res === "user existed") return res;
                return jwt.sign(
                    payload,
                    process.env.SECRET_KEY || "secret",
                )
            })

    },
    login : (username, password) =>{
        return User.findOne({username})
            .then(userDB =>{
                if (!userDB) return false;
                else {
                    return bcrypt.compare(password,userDB.password)
                        .then(isMatch=>{
                            if (!isMatch) return false;
                            const payload ={
                                username: userDB.username
                            }
                            return jwt.sign(
                                payload,
                                process.env.SECRET_KEY || "secret",
                            )
                        })
                }
            })
    },
    getAllUser :()=>{
      return User.find()
        .then(res=>{
            return res.map(user=>{
                return {
                    username:user.username
                }
            })
        })
    }
}


module.exports = UserService