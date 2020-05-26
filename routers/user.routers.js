var express = require('express');
var userRouter = express.Router();
var user = require('../models/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* User list */
userRouter.get('/', function (req, res, next) {
    user.find().then((users) => {
        res.json(users);
    }).catch((err) => {
        res.json(err);
    });
});

/* User create. */
userRouter.post("/", function (req, res, next) {
    var hash = '';
    bcrypt.hash(req.body.password, 10, (error, result) => {
        hash = result;
        new user({
            userName: req.body.userName,
            password: hash
        }).save().then(() => {
            res.json("Kaydetme İşlemi Başarılı.");
        }).catch((err) => {
            res.json("Kaydetme İşleminde Hata Oluştu.");
        });
    });
});

/* User update. */
userRouter.put("/:id", function (req, res, next) {
    var id = req.params.id;

    var hash = '';
    bcrypt.hash(req.body.password, 10, (error, result) => {
        hash = result;
        req.body.password = hash;
        user.findByIdAndUpdate({ "_id": id }, req.body).then((newUser) => {
            res.json("Güncelleme İşlemi Başarılı.");
        }).catch((err) => {
            res.json("Güncelleme İşleminde Hata Oluştu.");
        });
    });

    
});

/* User delete. */
userRouter.delete("/:id", function (req, res, next) {
    var id = req.params.id;
    user.findByIdAndRemove(id).then(() => {
        res.json("Silme İşlemi Başarılı.");
    }).catch((err) => {
        res.json("Silme İşleminde Hata Oluştu.");
    });
});

/*User token */
userRouter.post("/token", (request, response, next) => {
    const { userName, password } = request.body;
    user.findOne({ userName })
        .then(data => {
            //Girilen userName değerinde bir kayıt varsa burası çalışacaktır.
            bcrypt.compare(password, data.password)
                .then(data => {
                    //Veritabanındaki şifrelenmiş password ile kullanıcıdan alınan password birbirlerini doğruluyorsa
                    // eğer data değeri true gelecektir. Aksi taktirde false değeri gelecektir.
                    if (!data)
                        response.send("Kullanıcı adı veya şifre yanlış...");
                    else {
                        //Eğer data parametresi true değerinde geldiyse token oluşturulacaktır.
                        const payLoad = { userName, password };
                        const token = jwt.sign(payLoad, request.app.get("api_secret_key"), { expiresIn: 120/*dk*/ });
                        response.json({
                            status: true,
                            userName,
                            password,
                            token
                        });
                    }
                });
        })
        .catch(error => console.log("Beklenmeyen bir hatayla karşılaşıldı..."));
});

module.exports = userRouter;

