const express = require('express')
const app = express();
const cors = require('cors');
const port = 3000;

//Configurando o path para trabalhar com diretorio
const path = require('path');
const axios = require("axios");

// Configurar o mecanismo de visualização e a pasta de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(cors())
app.use(express.urlencoded());
app.use(express.json());

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
const single = {
    regex: /^(\w+);\s*(\w+);\s*(\w+);\s*(\d+)$/,
    format: ['mode', 'difficulty', 'player', 'score']
}
const multi = {
    regex: /^(\w+);\s*(\w+);\s*(\w+);\s*(\w+);\s*(\d+);\s*(\d+)$/,
    format: ['mode', 'difficulty', 'playerOne', 'playerTwo', 'scoreOne', 'scoreTwo']
}
var rege = [single, multi]

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



// Rota padrão
app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.post('/logs', (req, res) => {
    log = req.body.log //SinglePlayer; Hard; Fabio; 3300

    let i = 0
    while(generateLogs(log, rege[i]) == 1){
        i++
    }
    res.json("funfou");
})

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

app.get('/logsMultiByName', (req, res) => {
    const playerName = req.query.name;
    res.json(verificaPartidasMulti(playerName))
})

app.get('/logsSingleByName', (req, res) => {
    const playerName = req.query.name;
    res.json(verificaPartidasSingle(playerName))
})

app.get('/logsByName', (req, res) => {
    const playerName = req.query.name;
    const playerPartidas = {
        singleplayer: verificaPartidasSingle(playerName),
        multiplayer: verificaPartidasMulti(playerName)
    };
    res.json(playerPartidas);
});


app.get('/logsByScore', (req, res) => {
    const dadosOrdenados = partidasSingle.sort((a, b) => b.score - a.score);
    console.log(dadosOrdenados)
    res.json(dadosOrdenados)
})

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em http://10.10.24.159:${port}`);
  });