function sessao(req, res, next){
    if(req.session.admin != undefined){
        
        res.redirect("/Dashboard");
       
       
    } else if(req.session.cliente != undefined){
        res.redirect("/cliente");
    }else{
       next() 
    }
 }
 
 module.exports = sessao