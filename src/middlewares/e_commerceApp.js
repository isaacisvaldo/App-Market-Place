function Cliente(req, res, next) {
    const authToken = req.headers['authorization'];
    if (authToken != undefined) {
        console.log(authToken)
        jwt.verify(authToken, JWTSecret, (err, data) => {
            if (err) {
                res.status(401);
                res.render('error/500')
            } else {
                req.token = authToken
                req.User = { id: data.idCliente, email: data.email, acesso: data.acesso };
                console.log(User)
                next();

            }
        });
    } else {
        res.status(401);
        res.json({ err: "Token inválido!" });
    }
}

module.exports = Cliente