const express = require(`express`);
const router = express.Router();
//Controllers

const  Administracao =require('../controllers/ger-admin-controllers/AdminController');
const Ecommerceontroller = require('../controllers/get-cliente-controllers/ClientController');
const LojistasController = require('../controllers/get-lojista-controllers/lojistasControllers');




//E-commerce APK««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««««
router.post('/LoginEcommerce', Ecommerceontroller.LoginE_commerce);
router.post('/NovoClienteEcommerce', Ecommerceontroller.NovoCliente);
router.get('/Categorias', Ecommerceontroller.Categorias);
router.get('/Categoria_Produtos/:categoria_id', Ecommerceontroller.Categoria_Produtos);
router.get('/Categoria/:categoria_id', Ecommerceontroller.Categoria);
router.get('/Produtos', Ecommerceontroller.Produtos);
router.get('/Produto/:produto_id', Ecommerceontroller.Produto);
router.post('/ComprarProduto', Ecommerceontroller.ComprarProduto);
router.post('/Avaliar_produto', Ecommerceontroller.Avaliar_produto);
router.get('/Quantidadades_venda_produto/:produto_id', Ecommerceontroller.Quantidadades_venda_produto);
router.post('/Pesquisa_Dinanica_Gshop', Ecommerceontroller.Pesquisa_Dinanica);


module.exports = router;