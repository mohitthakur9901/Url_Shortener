const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(() => {

    console.log("Connected to database");
}).catch((err) => {
    console.log(err);   
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const ShortUrl = await shortUrl.findOne({ short: req.params.shortUrl })
  if (ShortUrl == null) return res.sendStatus(404)
  ShortUrl.clicks++ 
  ShortUrl.save()
  res.redirect(ShortUrl.full)
})

app.listen(process.env.PORT || 3000);



