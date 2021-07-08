const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const helmet = require('helmet')

const app = express();


mongoose.connect('mongodb+srv://dwain:kc92CPEJ4su9aWLB@sopekocko.eqm96.mongodb.net/sopekocko?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet())


app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app