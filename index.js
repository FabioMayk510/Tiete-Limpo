/**
 * * * * * * * * PROJETO TIETÊ LIMPO * * * * * * * *
 * 
 * SERVIDOR DESENVOLVIDO NODEJS E DESTINADO AO USO DA
 * ATIVIDADE PRÁTICA SUPERVISIONADA DO CURSO SISTEMAS
 * DA INFORMAÇÃO 4°/5° SEMESTRE BARCHARELADO DA UNIP
 * 
 * DESENVOLVEDORES:
 * 
 * CLEBER COLAÇO DOS SANTOS JUNIOR
 * FABIO MAYK SOUZA SILVA
 * GABRIEL GUTIERRE BOGONES
 * JOÃO VITOR MACIEL SOARES
 * PEDRO HENRIQUE PEREIRA DAMASCENO
 * 
 * TODO E QUALQUER TRECHO DESTE CÓDIGO ESTA PROTEGIDO
 * SOB A LICENÇA ISC
 * 
 * Copyright (c) 2024 Projeto Tietê Limpo
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

 */

/* Import dos módulos */
const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');
const axios = require("axios");
const conection = require('./db');
const { sign } = require('crypto');
// const { Task } = require('./task')

/* Configurações */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(cors())
app.use(express.urlencoded());
app.use(express.json());
const port = 3000;

/* Export do Modulo para atualizações */
module.exports = function() {
    return app;
}

class Partidas{
    static whatsWinner(playerOne, playerTwo, scoreOne, scoreTwo) {
        return parseInt(scoreOne) > parseInt(scoreTwo) ? playerOne : playerTwo;
    }

    resumo(){
        if(this.mode === "SinglePlayer"){
            console.log("Modo: ", this.mode, "\nPlayer: ", this.player, "\nScore: ", this.score, "\nDifficulty: ", this.difficulty)
        } else if(this.mode === "MultiPlayer"){
            console.log("Modo: ", this.mode, "\nPlayer 1: ", this.playerOne, "\nPlayer 2: ", this.playerTwo, "\nScore Player 1: ", this.scoreOne, "\nScore Player 2: ", this.scoreTwo,"\nDifficulty: ", this.difficulty, "\nWinner: ", Partidas.whatsWinner(this.playerOne, this.playerTwo, this.scoreOne, this.scoreTwo))
        }
    }
}

class Partida extends Partidas{
    constructor(format, match){
        super()
        for(let i = 0; i < match.length; i++){
            this[format[i]] = match[i]
        }
        if(this.mode === "SinglePlayer")
            console.log()
        else if(this.mode === "MultiPlayer")
            this.winner = Partidas.whatsWinner(this.playerOne, this.playerTwo, this.scoreOne, this.scoreTwo)
            partidasMulti.push(this)
        
    }
}

var partidasSingle = []
var partidasMulti = []

/* Regras para formatação dos logs */
const single = {
    regex: /^(\w+);\s*(\w+);\s*(\w+);\s*(\d+)$/,
    format: ['mode', 'difficulty', 'player', 'score']
}
const multi = {
    regex: /^(\w+);\s*(\w+);\s*(\w+);\s*(\w+);\s*(\d+);\s*(\d+)$/,
    format: ['mode', 'difficulty', 'playerOne', 'playerTwo', 'scoreOne', 'scoreTwo']
}
var rege = [single, multi]

function conect(){
    conection.initialize().then(() => {
        console.log("Funfooou")
    }).catch((err) => {
        console.log("Não funfooou ", err)
    })
  }
  
  conect()

/* Função para retornar partidas SinglePlayer de um usuario */
function verificaPartidasSingle (playerName){
    // Verificar partidas singleplayer
    singleplayer = []
    partidasSingle.forEach(partida => {
        if (partida.player === playerName) {
            singleplayer.push(partida);
        }
    });
    return singleplayer
}

/* Função para retornar partidas MultiPlayer de um usuario */
function verificaPartidasMulti (playerName){
    multiplayer = []
    // Verificar partidas multiplayer
    partidasMulti.forEach(partida => {
        if (partida.playerOne === playerName || partida.playerTwo === playerName) {
            multiplayer.push(partida);
        }
    });
    return multiplayer
}

/* Cadastro das partidas */
function generateLogs(log, rege) {
    const match = rege.regex.exec(log);

    if (match) {
        // Extrair os nomes das variáveis do objeto rege.format
        let format = rege.format.map(item => item);

        // Remover a primeira posição de match, que é a string completa da partida
        const valores = match.slice(1);

        // Verificar se já existe um registro para o player no array partidasSingle
        const playerIndex = partidasSingle.findIndex(partida => partida.player === valores[format.indexOf('player')]);

        if (playerIndex !== -1) {
            // Se o jogador já existir, verificar se o novo score é maior
            const currentScore = parseInt(valores[format.indexOf('score')]);
            const existingScore = parseInt(partidasSingle[playerIndex].score);

            if (currentScore > existingScore) {
                // Se o novo score for maior, atualizar a partida existente
                partidasSingle[playerIndex] = new Partida(format, valores);
            }
            console.log("ja existe")
        } else {
            // Se o jogador não existir, criar uma nova partida
            let partida = new Partida(format, valores);
            partidasSingle.push(partida);
        }

        return 0;
    } else {
        return 1;
    }
}

/* Função que retorna lista com os nomes dos usuarios */
async function users(){
    try{
        let q = await conection.query(`SELECT nome FROM users`)
        return q
    } catch (erro) {
        console.log("Erro ao realizar consulta: ", erro)
    }
}

/* Função que retorna nome e senha dos usuarios */
async function login(){
    try {
        let q = await conection.query(`SELECT nome, senha FROM users`)
        return q
    } catch (erro) {
        console.log("Erro ao realizar consulta", erro)
    }
}

/* Função que cadastra usuarios */
async function signUp(nome, senha, res){
    // Recupera os nomes dos usuarios
    let userList = await users()
    isEqual = false
    // Percorre o array de nomes e verifica se o usuario ja esta cadastrado
    for (let e of userList){
        let nomeAtual = e.nome;
        if (nomeAtual.toLowerCase() === nome.toLowerCase()){
            isEqual = true
        }
    }
    // Se o usuario ja existir, retorna um erro 409 (Conflict)
    if(isEqual === true){
        res.status(409).send("Usuario ja cadastrado")
    } else {
        // Se o usuario nao existir, insere-o no banco de dados e retorna status 200 (OK)
        try {
            let q = await conection.query(`INSERT INTO users(nome, senha) VALUES('${nome}', '${senha}')`)
            console.log("Usuario cadastrado com sucesso: ", q)
            res.status(200).send("Usuario cadastrado com sucesso")
        } catch (erro) {
            // Se nao for possivel cadastrar o usuario envia status 503 (Service Unavaliable)
            console.log("Não foi possivel cadastrar usuario: ", erro)
            res.status(503).send(erro)
        }
    }
}

/* Função para logar usuario */
async function signIn(nome, senha){
    // Recupera lista de nomes e senhas do banco (abordagem usada pela limitada quantidade de linhas do banco usado nesta aplicação)
    let userList = await login()
    let isEqual = false
    // Percorre a lista de usuarios verificando se o mesmo ja existe
    for (let e of userList){
        let nomeAtual = e.nome;
        if (nomeAtual.toLowerCase() === nome.toLowerCase()){
            senhaAtual = e.senha;
            // Caso o usuario exista, verifica se a senha está correta
            if (senhaAtual.toLowerCase() === senha.toLowerCase()){
                isEqual = true;
            }
        }
    }
    // Retorna o codigo de status 200 (OK) ou 401 (Unauthorized), a depender da consulta
    return isEqual === true ? 200 : 401
}

/* Rota padrão (Talvez será usada para hospedar o jogo) */
app.get('/', (req, res) => {
    console.log(users())
    res.render("index.ejs")
})

/* Rota de cadastro do usuario */
app.post('/signUp', async (req, res) => {
    // Recebe nome e senha
    nome = req.body.nome;
    senha = req.body.senha;
    // Envia para função de cadastro
    signUp(nome, senha, res)
})

/* Rota de login do usuario */
app.post('/signIn', async (req, res) => {
    // Recebe nome e senha
    nome = req.body.nome;
    senha = req.body.senha;
    // Envia para função de login
    let code = await signIn(nome, senha)
    // Verifica a resposta do login e retorna o codigo
    if (code === 200){
        console.log("Logadoo")
    } else {
        console.log("Deslogado")
    }
    code === 200 ? 
        res.send("Login efetuado com sucesso").status(code) 
        : 
        res.status(code).send("Falha ao efetuar login")
})

/* Rota para receber logs da partida */
app.post('/logs', (req, res) => {
    log = req.body.log //SinglePlayer; Hard; Fabio; 3300

    // Envia o log recebido com todos os regex pre-definidos, ate encontrar o correspondente e cadastra-o
    let i = 0
    while(generateLogs(log, rege[i]) == 1){
        i++
    }
    res.json("funfou");
})

/* Rpta para retornar as partidas MultiPlayer de um usuario */
app.get('/logsMultiByName', (req, res) => {
    const playerName = req.query.name;
    res.json(verificaPartidasMulti(playerName))
})

/* Rota para retornar as partidas SinglePlayer de um usuario */
app.get('/logsSingleByName', (req, res) => {
    const playerName = req.query.name;
    res.json(verificaPartidasSingle(playerName))
})

/* Rota para retornar todas as partidas (SinglePlayer e MultiPlayer) de um usuario */
app.get('/logsByName', (req, res) => {
    const playerName = req.query.name;
    const playerPartidas = {
        singleplayer: verificaPartidasSingle(playerName),
        multiplayer: verificaPartidasMulti(playerName)
    };
    res.json(playerPartidas);
});

/* Rota para retornar placar de scores */
app.get('/logsByScore', (req, res) => {
    // Ordena os dados por pontuação decrescente
    const dadosOrdenados = partidasSingle.sort((a, b) => b.score - a.score);
    console.log(dadosOrdenados)
    // Retorna os dados
    res.json(dadosOrdenados)
})

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em http://10.10.24.159:${port}`);
});