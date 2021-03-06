/**
 * Arquivo: server.js
 * Descrição: Arquivo responsável por levantar o serviço do Node.Js para poder
 * executar a aplicação e a API através do Express.Js.
 * Author: Oliveira Wesley
 * Data de Criação: 29 de Abril de 2018
 */

//Configuração Base da Aplicação:
//====================================================================================

/* Chamada das Packages que iremos precisar para a nossa aplicação */
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var Usuario     = require('./app/models/usuario');

mongoose.connect('mongodb://dizwes:dw23012016@ds157089.mlab.com:57089/todowes'); //via Modulus

/** Configuração da variável 'app' para usar o 'bodyParser()'.
 * Ao fazermos isso nos permitirá retornar os dados a partir de um POST
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Definição da porta onde será executada a nossa aplicação */
var port = process.env.PORT || 8000;

//Rotas da nossa API:
//==============================================================

/* Aqui o 'router' irá pegar as instâncias das Rotas do Express */
var router = express.Router();

/* Middleware para usar em todos os requests enviados para a nossa API- Mensagem Padrão */
router.use(function(req, res, next) {
    console.log('Opa, alguma coisa foi modificada........');
    next(); //aqui é para sinalizar de que prosseguiremos para a próxima rota. E que não irá parar por aqui!!!
});

/* Rota de Teste para sabermos se tudo está realmente funcionando (acessar através: GET: http://localhost:8000/api) */
router.get('/', function(req, res) {
    res.json({ message: 'YEAH! Seja Bem-Vindo ao ToDoWes API' });
});

// Rotas que irão terminar em '/todos' - (servem tanto para: GET All & POST)
router.route('/todos')

    /* 1) Método: Criar Usuario (acessar em: POST http://localhost:8080/api/todos */
    .post(function(req, res) {
        var todo = new Todo();

        //aqui setamos os campos do usuario (que virá do request)
        todo.description = req.body.description;
        todo.done = req.body.done;
        todo.createdAt = req.body.createdAt;

        todo.save(function(error) {
            if(error)
                res.send(error);

            res.json({ message: 'ToDo criado!' });
        });
    })

    /* 2) Método: Selecionar Todos (acessar em: GET http://locahost:8080/api/todos) */
    .get(function(req, res) {

        //Função para Selecionar Todos os 'todos' e verificar se há algum erro:
        Todo.find(function(err, todos) {
            if(err)
                res.send(err);

            res.json(todos);
        });
    });

// Rotas que irão terminar em '/todos/:todo_id' - (servem tanto para GET by Id, PUT, & DELETE)
router.route('/todos/:todo_id')

    /* 3) Método: Selecionar Por Id (acessar em: GET http://localhost:8080/api/todos/:todo_id) */
    .get(function(req, res) {

        //Função para Selecionar Por Id e verificar se há algum erro:
        Todo.findById(req.params.todo_id, function(error, todo) {
            if(error)
                res.send(error);

            res.json(todo);
        });
    })

    /* 4) Método: Atualizar (acessar em: PUT http://localhost:8080/api/todos/:todo_id) */
    .put(function(req, res) {

        //Primeiro: Para atualizarmos, precisamos primeiro achar o Todo. Para isso, vamos selecionar por id:
        Todo.findById(req.params.todo_id, function(error, todo) {
            if(error)
                res.send(error);

            //Segundo: Diferente do Selecionar Por Id... a resposta será a atribuição do que encontramos na classe modelo:
            todo.description = req.body.description;
            todo.done = req.body.done;
            todo.createdAt = req.body.createdAt;

            //Terceiro: Agora que já atualizamos os campos, precisamos salvar essa alteração....
            todo.save(function(error) {
                if(error)
                    res.send(error);

                res.json({ message: 'Todo Atualizado!' });
            });
        });
    })

    /* 5) Método: Excluir (acessar em: http://localhost:8080/api/todos/:todo_id) */
    .delete(function(req, res) {

        //Função para excluir os dados e também verificar se há algum erro no momento da exclusão:
        Todo.remove({
        _id: req.params.todo_id
        }, function(error) {
            if(error)
                res.send(error);

            res.json({ message: 'Todo excluído com Sucesso! '});
        });
    });

/* Todas as nossas rotas serão prefixadas com '/api' */
app.use('/api', router);

//Iniciando o Servidor (Aplicação):
//==============================================================
app.listen(port);
console.log('Iniciando a aplicação na porta ' + port);
