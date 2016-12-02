'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  sqlite3 = require('sqlite3').verbose(),

  config = require('./config'),
  app = express(),

  port = 5000;

const
  monthNames = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

app.set('view engine', 'pug');

//app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  const db = new sqlite3.Database(config.databaseFilename, sqlite3.OPEN_READONLY);

  let entries, total;

  db.all('SELECT id, transaction_date, amount, account_a, account_b, description FROM t1 ORDER BY transaction_date DESC, id DESC', (err, rows) => {
    entries = rows.map(({
      id,
      transaction_date,
      amount,
      account_a,
      account_b,
      description
    }) => {
      const d = new Date(transaction_date);
      return {
        id,
        transactionDate: weekDayNames[d.getDay()].substring(0, 2) + ' ' + d.getDate() + ' ' + monthNames[d.getMonth()].substring(0, 3),
        amount,
        accountA: account_a,
        accountB: account_b,
        description
      }
    });
  });

  db.get('SELECT SUM(amount) AS amount FROM t1', (err, row) => {
    total = row;
  });

  db.close(() => {
    res.render('index', { total, entries });
  });
});

app.get('/insert', (req, res) => {
  const db = new sqlite3.Database(config.databaseFilename, sqlite3.OPEN_READONLY);

  let transaction_date;

  db.get('SELECT transaction_date FROM t1 ORDER BY created_on DESC LIMIT 1', (err, row) => {
    transaction_date = row.transaction_date;
  });

  db.close(() => {
    res.render('form', {
      entry: {
        transaction_date
      }
    });
  });
});

app.post('/insert', (req, res) => {
  const db = new sqlite3.Database(config.databaseFilename, sqlite3.OPEN_READWRITE);

  db.run('INSERT INTO t1 (transaction_date, amount, account_a, account_b, description) VALUES (?, ?, ?, ?, ?)', [
    req.body.date,
    req.body.amount,
    req.body.account_a.trim(),
    req.body.account_b.trim(),
    req.body.description.trim()
  ]);

  db.close(() => {
    res.redirect('/');
  });
});

app.get('/entries/:id', (req, res) => {
  const db = new sqlite3.Database(config.databaseFilename, sqlite3.OPEN_READONLY);

  let entry;

  db.get('SELECT id, transaction_date, amount, account_a, account_b, description FROM t1 WHERE id = ?', [req.params.id], (err, row) => {
    entry = row;
  });

  db.close(() => {
    res.render('form', { entry });
  });
});

app.post('/entries/:id', (req, res) => {
  const db = new sqlite3.Database(config.databaseFilename, sqlite3.OPEN_READWRITE);

  db.run('UPDATE t1 SET transaction_date = ?, amount = ?, account_a = ?, account_b = ?, description = ? WHERE id = ?', [
    req.body.date,
    req.body.amount,
    req.body.account_a.trim(),
    req.body.account_b.trim(),
    req.body.description.trim(),
    req.params.id
  ]);

  db.close(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  const address = require('ip').address();
  console.log('listening on ' + address + ':' + port);
});

// http://stackoverflow.com/a/10429662
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', text => {
  if (text.slice(0, -1) === 'q') {
    process.exit();
  }
});
