const { User } = require('../models/UserModal');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getHashedPasword = (password) => {
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
            .then(res => {
                if (res === "user existed") return res;
                const newUser = new User({
                    username,
                    password: res
                })
                return newUser.save();
            })
            .then(res => {
                const payload = {
                    username: res.username,
                    pawn: res.pawn,
                    bishop: res.bishop,
                    rook: res.rook,
                    knight: res.knight,
                    prince: res.prince,
                    queen: res.queen,
                    king: res.king,
                    guard: res.guard,
                    exp: res.exp
                }
                if (res === "user existed") return res;
                return jwt.sign(
                    payload,
                    process.env.SECRET_KEY || "secret",
                )
            })

    },
    login: (username, password) => {
        return User.findOne({ username })
            .then(userDB => {
                if (!userDB) return false;
                else {
                    return bcrypt.compare(password, userDB.password)
                        .then(isMatch => {

                            if (!isMatch) return false;

                            const payload = {
                                username: userDB.username,
                                pawn: userDB.pawn,
                                bishop: userDB.bishop,
                                rook: userDB.rook,
                                knight: userDB.knight,
                                prince: userDB.prince,
                                queen: userDB.queen,
                                king: userDB.king,
                                guard: userDB.guard,
                                exp: userDB.exp
                            }
                            return jwt.sign(
                                payload,
                                process.env.SECRET_KEY || "secret",
                            )
                        })
                }
            })
    },
    getAllUser: () => {
        return User.find()
            .then(res => {
                return res.map(user => {
                    return {
                        username: user.username
                    }
                })
            })
    }
}


module.exports = UserService