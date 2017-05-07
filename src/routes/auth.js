const pool = require('../index');
const jwt = require('jsonwebtoken');

module.exports = function(router) {

  router.post('/login',(req, res) => {

    const{ email, password } = req.body;

    pool.query(`SELECT * FROM users WHERE email='${email}' AND password=crypt('${password}', password);`)
      .then((users) => {
        if(users && users.rows.length) {

        const session = {
          user_email: users.rows[0].email
        }

        const JWT = jwt.sign(session, '2l3k45j8a-a-0iga');

        res.status(200).cookie('redit_session', JWT, {
          secure: false,
          maxAge: 7200000,
          httpOnly: true
        }).send('Sucess, you\'re logged in!');


          res.status(200).send();
        } else res.status(403).send('Invalid username or password...');
      }).catch(err => {
        console.log(err);
        res.status(500).send('Database error...');
      });

    });

  router.get('/logout', (req, res) => {

  });

  return router;

}
