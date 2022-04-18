const express = require("express");
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http").Server(app);

const sessionHandler = session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3_000,
  },
});

app.use(sessionHandler);

app.set("views", "./views");
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/login', (request, response) => {
  const { user } = request.query;

  if (!user) {
    return response
      .send('Login failed');
  }else{
    request.session.user = user;
    
    return response
      .render('pages/main', {user : user})
  }
});

app.get('/logout', (request, response) => {
  const {user} = request.query;
  request.session.destroy((error) => {
    if (error) {
      return response
        .send({
          status: 'Logout error',
          body: error,
        });
    }

    return response
      .render('pages/logout', {user : user});
  });
});


const PORT = 8080;

http.listen(PORT, () => {
  console.log(`servidor escuchando en http://localhost:${PORT}`);
});

http.on("error", (error) => {
  console.log("error en el servidor:", error);
});
