function Cliente(req, res, next){
     if(req.session.cliente != undefined){
        next()
    }else{
        res.redirect("/login");
    }
 }
 
 module.exports = Cliente