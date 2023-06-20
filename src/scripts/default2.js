
const cron = require('node-cron');
const BD = require('../databases/database')
const bcrypt = require('bcryptjs');


const email = "iamgelson@gmail.com";
const user ='gelson';
    const senha = '12345678';
    var salt = bcrypt.genSaltSync(10);
    var senha_admin = bcrypt.hashSync(senha, salt);

cron.schedule('*/60 * * * *',  async() => {
    
    const admin_geral = await BD("admin_geral")
    .where("email_admin", email)
    .orWhere("username_admin", user)
    .first();


if(admin_geral){
    console.log('Encontrei o Admin');

}else{
    const admin_geral = await BD("admin_geral").insert({ image_admin:'user.png', username_admin:user, nome_admin:'Gelson Mesquita', email_admin:email, telefone_admin:'930333042', senha_admin, nif_admin:'123456789LA234', nip_admin:'000-000-000', role:1})
    console.log('Administrador Cadastrado !');
    console.log(admin_geral)
}
});
    