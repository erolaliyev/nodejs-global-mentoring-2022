import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const users = [];

function validateUser(user) {
  const schema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string()
      .pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
      .required(),
    age: Joi.number().min(4).max(130).prefs({ convert: false }).required(),
  });

  return schema.validate(user);
}

function getAutoSuggestUsers(loginSubstring, limit) {
  return users
    .filter((user) => user.login.includes(loginSubstring))
    .sort((user1, user2) => (user1.login > user2.login ? 1 : -1))
    .slice(0, limit);
}

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get('/users', (req, res) => {
  try {
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
});

app.get('/users/suggested-users', (req, res) => {
  try {
    return res
      .status(200)
      .send(getAutoSuggestUsers(req.query.loginSubstring, req.query.limit));
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
});

app.get('/users/:id', (req, res) => {
  try {
    const foundUser = users.find((user) => user.id === req.params.id);
    if (!foundUser) {
      return res.status(404).send('The user with the given ID was not found!');
    }
    return res.status(200).send(foundUser);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
});

app.post('/users', (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = {
      id: uuidv4(),
      login: req.body.login,
      password: req.body.password,
      age: req.body.age,
      isDeleted: false,
    };
    users.push(user);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
});

app.put('/users/:id', (req, res) => {
  try {
    const user = users.find((user) => user.id === req.params.id);
    if (!user) {
      return res.status(404).send('The user with given ID was not found!');
    }

    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    user.login = req.body.login;
    user.password = req.body.password;
    user.age = req.body.age;

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
});

app.delete('/users/delete/:login', (req, res) => {
  try {
    const user = users.find((user) => user.login === req.params.login);
    if (!user) {
      return res.status(404).send('The user with given login was not found!');
    }

    if (user.isDeleted) {
      return res
        .status(400)
        .send('The user with given login is already deleted!');
    }

    user.isDeleted = true;
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ error: error.toString() });
  }
});
