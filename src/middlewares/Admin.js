function Admin(req, res, next){
    if(req.session.admin != undefined){
         next();
        }else{
        res.redirect("/login");
    }
 }
 
 module.exports = Admin