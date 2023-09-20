const mysql = require('./db.js')
const express = require('express')
const dayjs = require('dayjs')
const port = 3000;
const exphbs = require('express-handlebars')
const app = express()
con.connect((err) => { console.log(err ?? "Conexão bem sucedida!") })
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(express.json());

const hbs = exphbs.create({
  partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))

con.connect((err) => { console.log(err ?? "Conexão bem sucedida!") })

app.get('/', (req, res) => {
  res.render('home')
})
// Register routes
app.get('/register', (req, res) => {
  res.render('cadastrarLivro')
})
app.get('/register-author', (req, res) => {
  con.execute(`SELECT MAX(id_author) as largest_id FROM author`, (err, query) => {
    largest_id = (query[0].largest_id + 1)
    console.log(err ?? query[0].largest_id)
    res.render('cadastrarAutor', { largest_id })
  })
})

// Select routes
app.get('/books', (req, res) => {
  con.execute(`SELECT * FROM books as b join author as a on b.fk_author = a.id_author `, (err, query) => {
    queryLength = query.length
    for (let i = 0; i < queryLength; i++) {
      query[i].data_publicacao = dayjs(query[i].data_publicacao).format('DD/MM/YYYY')
    }
    console.log(err ?? query)
    res.render('livros', { query, queryLength })
  })
  app.get('/books/:id', (req, res) => {
    con.execute(`SELECT * FROM books as b join author as a on b.fk_author = a.id_author WHERE b.id="${parseInt(req.params.id)}"`, (err, query) => {
      query[0].data_publicacao = dayjs(query[0].data_publicacao).format('DD/MM/YYYY')
      selectedBook = query[0]
      console.log(err ?? selectedBook)
      res.render('selectedBook', { choicedBook: selectedBook })
    })
  })
})

// Save routes
app.post('/save', (req, res) => {
  con.execute(`INSERT INTO books (nome, genero, data_publicacao,fk_author)
  VALUES("${req.body.nome_livro}", "${req.body.genero}", "${req.body.releaseDate}", "${req.body.autor}");`
  )
  res.redirect('/')
})
app.post('/save-author', (req, res) => {
  con.execute(`INSERT INTO author (nome_author)
  VALUES("${req.body.nome}");`
  )
  res.redirect('/')
})

// Delete routes
app.get('/books/delete/:id', (req, res) => {
  con.execute(`SELECT * FROM books as b join author as a on b.fk_author = a.id_author WHERE b.id="${parseInt(req.params.id)}"`, (err, query) => {
    query[0].data_publicacao = dayjs(query[0].data_publicacao).format('DD/MM/YYYY')
    selectedBook = query[0]
    console.log(err ?? selectedBook)
    res.render('delLivro', { choicedBook: selectedBook })
  })
})
app.get('/books/yes/:id', (req, res) => {
  con.execute(`DELETE FROM books WHERE id="${req.params.id}"`, (err, query) => {
    return err ?? res.redirect('/')
  })
})
app.listen(port)