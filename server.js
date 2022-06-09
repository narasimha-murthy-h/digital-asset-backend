const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const Asset = require('./models/assets');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

mongoose.connect(
  'mongodb+srv://narasimha_murthy:Murthy99160@cluster0.khamb.mongodb.net/?retryWrites=true&w=majority'
);
const upload = multer({ dest: 'uploads/' });

const { uploadFile } = require('./s3');

const app = express();
app.use(cors());
app.use(express.json());
app.post('/register', function (request, response) {
  console.log(request.body);
  const userData = new User({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  });
  userData.save();

  response.json({ status: 'ok' });
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  console.log(req.body.email);

  if (!user) {
    return { status: 'error', error: 'Invalid login' };
  }
  var isPasswordValid = false;
  if (req.body.password === user.password) {
    isPasswordValid = true;
  }

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      'secret123'
    );

    return res.json({ status: 'ok', user: token });
  } else {
    return res.json({ status: 'error', user: '' });
  }
});
// });

app.post('/uploads', upload.single('uploads'), async (req, res, err) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  console.log(result);

  const dictionary = new Asset({
    object_id: '179238',
    company_id: 'ZYMR',
    asset_id: '179238',
    owner: 'Sitanshu Joshi',
    name: 'Primary Image',
    status: 'ACTIVE',
    type: 'Image',
    content_reference: result.Location,
    mime_type: file.mimetype,
    version_number: '1.1.0',
    language: 'EN-US',
    note: 'Digital Asset Primary Image',
  });
  dictionary.save();

  res.send('success');
  if (err) {
    return res.status(500).json(err);
  }

  return res.status(200).send(file);
});

app.get('/', (req, res) => {
  Asset.find()
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static());
  app.get('*', (req, res) => {
    req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(8000, () => {
  console.log('App is running on port 8000');
});
