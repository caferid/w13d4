const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.json())

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});
const User = mongoose.model('user', userSchema);

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const isVaild = await bcrypt.compare(password, user.password)
    if (!isVaild) {
      res.send("parol yandlisdire")
      return
    }

    const token = await jwt.sign({ email, }, 'dffsdassdf');
    res.send(token)
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// app.post('/register', async(req, res) => {
//   const u= new user({
//     email : req.body.email,
//     password : req.body.password,
//     role : req.body.role
//   })
//   await u.save()
//   res.send("getdiiii")

// })

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})



mongoose.connect('mongodb+srv://ferid:OFzSlirfNy5XL3Hm@cluster0.o4zo8na.mongodb.net')
  .then(() => console.log('Connected!'))
  .catch(() => console.log("not connect"))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})