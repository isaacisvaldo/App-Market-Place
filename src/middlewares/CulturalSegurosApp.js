const jwt = require("jsonwebtoken");
const JWTSecret = "djkshahjksdajksdhasISAACISVALDOPIMENTELBUNGA123jkdhasjkdhasjkdhasjkdkkkkklllllbbbnn";
function Admin(req, res, next){
    const authToken = req.headers['authorization'];
  
    if(authToken != undefined){
       console.log(authToken)
        jwt.verify(authToken,JWTSecret,(err, data) => {
            if(err){
                res.status(401);
                res.render('error/500')
            }else{
                req.token = authToken
                req.Adm = {idAdmin: data.idAdmin,email: data.email,acesso:data.acesso};
               
               if(req.Adm.acesso !=1){
                  res.status(401);
                  res.render('error/401')
                 } else{
                  next();
                  }            
                
            }
        });
    }else{
        res.status(401);
        res.json({err:"Token inválido!"});
    } 
  }
   
   module.exports = Admin