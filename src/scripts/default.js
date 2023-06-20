const cron = require('node-cron');
const BD = require('../database/database')
const bcrypt = require('bcryptjs');


const email = process.env.EMAIL_ADMIN || "isaacisvaldobunga300@gmail.com";
const username =process.env.USER_ADMIN  ||'isvaldo';
    const senha = '12345678';
    var salt = bcrypt.genSaltSync(10);
    var senha_admin = bcrypt.hashSync(senha, salt);

cron.schedule('*/60 * * * *',  async() => {
    
    const admin=await BD('admin')
    .where('username', username)
    .orWhere('email',email).first();
                        

if(admin){
    console.log('Encontrei o Admin');

}else{
    const admin = await BD('admin').insert({image:'user.png',nome:'Isaac Isvaldo Bunga', email:'isaacisvaldobunga300@gmail.com', telefone:'930333042', username, senha:senha_admin, nif:'123456789LA234',role:1})
                                
   console.log('Administrador Cadastrado !');
    console.log(admin)
}
});
    