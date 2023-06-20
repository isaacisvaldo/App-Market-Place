const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const BD = require('../database/database')
//Sercret JWT
const JWTSecret = "djkshahjksdajksdhasISAACISVALDOPIMENTELBUNGA123jkdhasjkdhasjkdhasjkdkkkkklllllbbbnn";
class E_commerceController {

    async LoginE_commerce(req, res) {
        try {
            var { email, senha } = req.body;
            if (email == '') {
                res.json({ erro: "Preenche O campo e-mail !" })
            } else if (senha == "") {
                res.json({ erro: "Preenche O campo da senha!" })
            } else {


                console.log(email, senha)
                if (email.length != 0 || !(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email))) {
                    const cliente = await BD('clientes').where('username', email).orWhere('email', email).first()

                    if (cliente != undefined) {
                        var correct = bcrypt.compareSync(senha, cliente.senha);
                        if (correct) {

                            const cliente_id = cliente.idCliente;

                            jwt.sign({ idCliente: cliente.idCliente, email: cliente.email, acesso: 0 }, JWTSecret, { expiresIn: '48h' }, async (err, token) => {
                                if (err) {
                                    res.status(400);
                                    res.json({ erro: "Erro ao Gerar Token" })

                                } else {
                                    const actividade = await BD('actividades').insert({ detalhes: 'Iniciou Sessao No ShopSeguro', estado_atividade: 0, cliente_id })
                                    if (cliente.acesso_Ecommerce == 0) {
                                        const atualizar = await BD('clientes').where('idCliente', cliente_id).update({ acesso_Ecommerce: 1 })
                                        const cliente = await BD('clientes').where('idCliente', cliente_id)

                                        res.json({ token, cliente })
                                    } else if (cliente.acesso_Ecommerce == 1) {
                                        res.json({ token, cliente })
                                    } else {
                                        // const cliente = await BD('clientes').where('idCliente',cliente_id).join('produto', 'produto.cliente_id', '=', 'clientes.idCliente')
                                        const produtos = await BD('produto').where('cliente_id', cliente_id).andWhere('estadoProduto', 1).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('categoria', 'categoria.idCategoria', '=', 'produto.idProduto').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')

                                        res.json({ token, cliente, produtos })
                                        console.log(cliente)
                                    }




                                }
                            })
                        } else {

                            res.json({ erro: "Credencias Inválida" })

                        }
                    } else {

                        res.json({ erro: "E-mail desconhecido" })

                    }

                } else {

                    res.json({ erro: "E-mail Incorreto" })

                }
            }

        } catch (error) {

            res.json({ erro: "Ocorreu um problema" })

            console.log(error)
        }
    }
    async NovoCliente(req, res) {
        try {

            const { nome, email, telefone, username, senha, senha2, nif, provincia, municipio, endereco } = req.body;
            const cod = "123456;"
            console.log(nome, email, telefone, username, senha, senha2, nif);
            if (nome.length < 5) {

                res.json({ erro: 'Nome demasiado Curto' })

            } else if ((/[A-Z]/.test(username))) {
                console.log((/[A-Z]/.test(username)))

                res.json({ erro: ' user nao pode ter letra Maiscula' })

            } else if ((/\s/g.test(username))) {
                console.log((/\s/g.test(username)))

                res.json({ erro: 'User nao pode ter espaço' })
            } else if (!(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email))) {

                res.json({ erro: 'e-mail Incorrreto' })
            } else if (senha.length < 8) {

                res.json({ erro: 'Senha muito fraca' })
            } else if (senha != senha2) {

                res.json({ erro: 'Senha Diferentes' })
            } else if (!(/^[9]{1}[0-9]{8}$/.test(telefone))) {

                res.json({ erro: 'Numero de Telefone incorreto' })

            } else if (!(/^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(nif))) {

                res.json({ erro: 'NIF incorreto' })
            } else {
                const cliente = await BD('admin').where('username', username).orWhere('email', email).orWhere('telefone', telefone)
                const admin = await BD('clientes').where('username', username).orWhere('email', email).orWhere('telefone', telefone)
                if (cliente.length < 1) {
                    if (admin.length < 1) {
                        const image = (req.file) ? req.file.filename : 'user.png';
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(senha, salt);
                        const cliente = await BD('clientes').insert({ provincia, municipio, endereco, image, nome, cod, email, telefone, username, senha: hash, nif, estado: 1 })
                        res.json({ certo: 'Conta criado com sucesso' })

                    } else {

                        res.json({ erro: 'Dados ja Cadastrado' })
                    }

                } else {

                    res.json({ erro: 'Dados ja Cadastrado' })
                }
            }


        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    //Listar
    async Categorias(req, res) {
        try {

            const categorias = await BD('categoria').select('*')
            res.json({ categorias })

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    //produtos pela categoria
    async Categoria_Produtos(req, res) {
        try {
            const { categoria_id } = req.params;
            const produtos = await BD('produto').where("categoria_id", categoria_id).andWhere('estadoProduto', 1).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')
            res.json({ produtos })

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async Categoria(req, res) {
        try {
            const { categoria_id } = req.params;
            const categoria = await BD('categoria').where('idCategoria', categoria_id).join('produto', 'produto.categoria_id', '=', 'categoria.idCategoria').where('estadoProduto', 1).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')
            res.json({ categoria })

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async Produtos(req, res) {
        try {

            const produtos = await BD('produto').where('estadoProduto', 1).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('categoria', 'categoria.idCategoria', '=', 'produto.categoria_id').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')
            res.json({ produtos })

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async Produto(req, res) {
        try {
            const {produto_id} = req.params;
            const produto = await BD('produto').where('idProduto',produto_id).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('categoria', 'categoria.idCategoria', '=', 'produto.categoria_id').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')
            const comentarios = await BD('avaliacao_produto').where('produto_id_avaliacao_produto',produto_id).join('clientes', 'clientes.idCliente', '=', 'avaliacao_produto.id_cliente_avaliacao_produto ').select('*')
            res.json({ produto,comentarios })
            console.log(produto_id)

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    //Fim Listagens
   
    //Função Cliente Normal
    async TornarVendedor(req, res) {
        try {
            const { motivo, detalhes, cliente_id ,limitePeriodo, valorPago} = req.body
            console.log({ motivo, detalhes, cliente_id ,limitePeriodo, valorPago});
            const compravativoPedido = (req.file) ? req.file.filename : 'arquivo nao encontrado!';
         const solicitacao = await BD('tornar_vendedor').where('cliente_id', cliente_id).andWhere('estado_solicitacao', 0).first()
         if (!solicitacao) {
            var data = new Date();
            var dia = String(data.getDate()).padStart(2,'0')
            var mes = String(data.getMonth() + 1).padStart(2,'0')
            var ano = String(data.getFullYear()).padStart(2,'0')
            var dataAtual = ano +'-'+mes+'-'+ dia
           
                    function addDias(data,dias) {
                        var res = new Date(data);
                        res.setDate(res.getDate() + 1 + dias);
                        return res
                    }
            const dataFimPeriodo = addDias(dataAtual,limitePeriodo-1)
            if (motivo.length < 2) {
                res.json({ errado: "Nome do produto muito Curto!" })
            } else if (detalhes.length < 10) {
                res.json({ errado: "Pouca informação ao detalhar o produto !" })
            } else {
                const soli = await BD('tornar_vendedor').insert({ motivo, detalhes, estado_solicitacao: 0, cliente_id })
                if (soli) {

                    const periodovendedor = await BD('periodo_vendedor').insert({compravativoPedido,limitePeriodo,dataFimPeriodo,id_tornar_vendedor:soli , valorPago})
                    const actividade = await BD('actividades').insert({ detalhes: 'Enviou uma solicitação para se tornar um vendedor na plataforma', estado_atividade: 0, cliente_id })
                    res.json({ certo: "Solicitaçao enviada  com Exito " })
                }
                else {
                    res.json({ erro: "Ocorreu um problema ao enviar a solicitação!" })
                }
            }
        }else{
            res.json({ erro: "Ja Submeteste A Sua solicitação Porfavor Aguarde!" })
        }
        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async ComprarProduto(req, res) {
        try {
            //Compra
            const { detalhes, id_cliente, quantidade_produto, produto_id } = req.body;
            //pagamento
            const { tipo_pagamento, detalhes_pagamento } = req.body;
            //entrega
            const { tipo_entrega, detalhes_entrega, data_entrega, hora_entrega } = req.body;
            //Endereço
            const { provincia, municipio, endereco, lat, lng } = req.body
            //Comprovativo
            const arquivo = (req.file) ? req.file.filename : 'arquivo nao encontrado!';
            const findProduto = await BD('produto').where('idProduto', produto_id).first()
            const novo = (findProduto.quantProduto - quantidade_produto);
            if (findProduto.quantProduto < quantidade_produto) {
                res.json({ errado: 'A Quantidade de produto Que se pretende Nao temos !' })
            } else {
                const preco_pagar = (quantidade_produto * precoProduto)
                const compra = await BD('compras').insert({ quantidade_produto, preco_pagar, detalhes, estado_compra: 0, id_cliente, produto_id })
                if (compra) {
                    const pagamento = await BD('pagamento').insert({ tipo_pagamento, detalhes_pagamento, estado_pagamento: 0, compra_id: compra })
                    const comprovativo = await BD('comprovativo').insert({ arquivo, estado_comprovativo: 0, pagamento_id: pagamento })
                    const entrega = await BD('entrega').insert({ tipo_entrega, detalhes_entrega, data_entrega, hora_entrega, estado_entrega: 0, compra_id: compra })
                    if (entrega) {
                        //Caso o tipo de entrega for ao domicílio... 	
                        const enderecoEntrega = await BD('endereco').insert({ provincia, municipio, endereco, lat, lng, estado_endereco: 0, entrega_id: entrega })
                        const updade = await BD('produto').where('idProduto', produto_id).update({ quantidadeProduto: novo })
                        res.json({ certo: 'Compra Efectuado Com exito !' })
                    } else {
                        //Caso nao for ao Domicilio!
                    }

                } else {
                    res.json({ errado: 'A Compra não foi Efectuado !' })
                }
            }


        } catch (error) {

            res.json({ erro: 'Houve um problema Interno' })
            console.log(error)
        }
    }
    async Avaliar_produto (req,res){
        try {
            const {	comentario_avaliacao_produto,avaliacao_produto,id_cliente_avaliacao_produto,produto_id_avaliacao_produto} = req.body;
            const comentario = await BD('avaliacao_produto').insert({	comentario_avaliacao_produto,avaliacao_produto,estado_avaliacao_produto:0,id_cliente_avaliacao_produto,produto_id_avaliacao_produto})
            if (comentario) {
               const actividade = await BD('actividades').insert({ detalhes: 'Adicicionou um comentário A um determinado produto !', estado_atividade: 0, cliente_id:id_cliente_avaliacao_produto })
                res.json({ certo: "Solicitaçao enviada  com Exito " })
            }
            else {
                res.json({ erro: "Ocorreu um problema ao enviar Comentario!" })
            }
           

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }

    }
    //Funcao Vendedor
    async RegistarProduto(req, res) {
        try {
            const { nomeProduto, precoProduto, descProduto, descGeralProduto, quantProduto, idCliente, situacaoProduto, negociavelProduto, corProduto, idCategoria, descSituacaoProduto } = req.body
            // console.log({ nomeProduto, precoProduto, descProduto, descGeralProduto, quantProduto, idCliente, situacaoProduto, negociavelProduto, corProduto, idCategoria });
            if (precoProduto < 100) {
                res.json({ errado: "preço do Produto Não Aceite !" })
            } else if (nomeProduto.length < 2) {
                res.json({ errado: "Nome do produto muito Curto!" })
            } else if (descProduto.length < 10) {
                res.json({ errado: "Pouca informação ao detalhar o produto !" })
            } else if (descGeralProduto.length < 20) {
                res.json({ errado: "Pouca informação ao detalhar o produto !" })
            } else if (situacaoProduto == "") {
                res.json({ errado: "Tens que preencher a Provincia!" })
            } else if (quantProduto == "" || quantProduto < 1) {
                res.json({ errado: "Quantidade inferior a 1!" })
            } else {

                if (req.files) {
                    const upl = req.files;
                    console.log(upl);
                    const imagens = upl.map(img => {
                        return img.filename    
                    })
                    const imagenProduto1 = imagens[0].filename
                    const imagenProduto2 = imagens[1].filename
                    const imagenProduto3 = imagens[2].filename
                    const imagenProduto4 = imagens[3].filename
                    const imagenProduto5 = imagens[4].filename
                    const produto = await BD('produto').insert({ precoProduto, nomeProduto, descProduto, provinciaProduto: 'NP', municipioProduto: 'NP', quantProduto, lat: 'N', lng: 'N', estadoProduto: 0, cliente_id: idCliente, categoria_id: idCategoria, descGeralProduto, situacaoProduto, descSituacaoProduto, corProduto, negociavelProduto })
                    console.log(produto)
                    if (produto) {
                        console.log(produto)
                        const img = await BD('imagensproduto').insert({ imagenProduto1, imagenProduto2, imagenProduto3, imagenProduto4, imagenProduto5, produto_id: produto })
                        const actividade = await BD('actividades').insert({ detalhes: 'Registou um novo produto na plataforma', estado_atividade: 0, cliente_id: idCliente })
                        res.json({ certo: "Produto cadastrado com Exito " })
                    } else {
                        res.json({ errado: "Ocorreu um problema ao Cadastrar o produto!" })
                    }

                } else {
                    res.json({ errado: "Ocorreu um problema ao Cadastrar o produto!" })
                }
            }

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async RegistarImagensProduto(req, res) {
        try {
            const { produto_id } = req.body
            if (req.files) {
                const upl = req.files;
                const imagens = upl.filter(imagen => {
                    return { path: imagen.filename }
                })
                const imagenProduto1 = imagens[0].filename
                const imagenProduto2 = imagens[1].filename
                const imagenProduto3 = imagens[2].filename
                const imagenProduto4 = imagens[3].filename
                const imagenProduto5 = imagens[4].filename

                const produto = await BD('imagensproduto').insert({ imagenProduto1, imagenProduto2, imagenProduto3, imagenProduto4, imagenProduto5, produto_id })
                if (produto) {
                    const produto = await BD('produto').where('idProduto', produto_id).first()
                    const cliente_id = produto.cliente_id
                    res.json({ certo: "Imagens Cadastrado" })
                    const actividade = await BD('actividades').insert({ detalhes: 'Registou novas imagens para o seu produto', estado_atividade: 0, cliente_id })


                } else {
                    res.json({ errado: "Ocoreu um problema ao Cadastrar as Imagens" })
                }

            }
        } catch (error) {
            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async Promocao_produto(req, res) {
        try {
            const {	nome_propaganda	,descricao_propaganda,produto_id,NovoprecoProduto} = req.body
            if (req.files) {
                const upl = req.files;
                const imagens = upl.filter(imagen => {
                    return { path: imagen.filename }
                })
                const produto = await BD('produto').where('idProduto', produto_id).first()
                const cliente_id = produto.cliente_id
                console.log(imagens)
                const imagemPropaganda1 = imagens[0].filename
                const imagemPropaganda2 = imagens[1].filename
                const imagemPropaganda3 = imagens[2].filename
                const imagemPropaganda4 = imagens[3].filename
                const imagemPropaganda5 = imagens[4].filename
                const ficheiro_comprovatico = imagens[5].filename

                const propaganda = await BD('propaganda').insert({nome_propaganda,descricao_propaganda,preco_anterior:produto.precoProduto,imagemPropaganda1,	imagemPropaganda2	,imagemPropaganda3,	imagemPropaganda4,	imagemPropaganda5,estado_propaganda:0,produto_id	,ficheiro_comprovatico })
                if (propaganda) {
                    const updade = await BD('produto').where('idProduto',produto_id).update({precoProduto:NovoprecoProduto})
                    const actividade = await BD('actividades').insert({ detalhes: 'Adicionou um produto em promoção !', estado_atividade: 0, cliente_id })
                    res.json({ certo: " Cadastrado com sucesso !" })

                } else {
                    res.json({ errado: "Ocoreu um problema ao Cadastrar" })
                }

            }
        } catch (error) {
            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async Quantidadades_venda_produto(req, res) {
        try {
            const {produto_id}= req.params
            const produtos = await BD('compras').where('Compra_produto_id', produto_id).join('produto', 'compras.Compra_produto_id	', '=', 'produto.idProduto').join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').select('*')
            const quantidade_estrela = await BD('avaliacao_produto')
              .where('produto_id_avaliacao_produto', produto_id)
              .sum('avaliacao_produto as total_estrelas')
             
            
            res.json({ produtos,quantidade_estrela})

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }
    async Pesquisa_Dinanica(req, res) {
        try {
            //produto, categoria,Vendendor
            const {pesquisa}= req.body
            const produto = await BD('produto').where('nomeProduto', 'like', `%${pesquisa}%`).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('categoria', 'categoria.idCategoria', '=', 'produto.categoria_id').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')
            const categoria = await BD('categoria').where('nomeCategoria','like', `%${pesquisa}%`).orWhere('detalhesCategoria','like', `%${pesquisa}%`).join('produto', 'produto.categoria_id', '=', 'categoria.idCategoria').where('estadoProduto', 1).join('imagensproduto', 'imagensproduto.produto_id', '=', 'produto.idProduto').join('clientes', 'clientes.idCliente', '=', 'produto.cliente_id').select('*')
            const vendedores = await BD('clientes').where('nome','like', `%${pesquisa}%`).orWhere('username','like', `%${pesquisa}%`).andWhere('acesso_Ecommerce',2).select('*')
            res.json({produto,categoria,vendedores})

        } catch (error) {

            res.json({ erro: 'Houve um problema' })
            console.log(error)
        }
    }





} module.exports = new E_commerceController();