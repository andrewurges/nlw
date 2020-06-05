// importar a dependência do Express
const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", { // pasta onde se encontra os HTMLs 
    express: server,
    noCache: true
})

// configurar rota para página inicial
server.get("/", (req, res) => {
    return res.render("index.html")
}) 

// configurar rota para cadastro de ponto de coleta
server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.post("/save-point", (req, res) => {

    // inserir dados na tabela
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
        );
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]
    
    function afterInsertData(err) {
        if(err) {
            return res.send("Erro no cadastro")
        }
    
        return res.render("create-point.html", { saved: true })
    }
    
    db.run(query, values, afterInsertData)
})

// configurar rota para tela de resultados
server.get("/search-results", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return  res.render("search-results.html", { total: 0 })
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página html com os dados retornados
        return  res.render("search-results.html", { places: rows, total: total })
    })    
})

// ligar servidor na porta 3000
server.listen(3000)