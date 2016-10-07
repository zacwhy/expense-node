const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    sqlite3 = require('sqlite3').verbose();

const dbFilename = '../transactions/db';

app.set('view engine', 'jade');

//app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    const db = new sqlite3.Database(dbFilename, sqlite3.OPEN_READONLY);

    var total, records;

    db.get('SELECT sum(amount) as amount FROM t1', (err, row) => {
        total = row;
    });

    db.all('SELECT * FROM t1 ORDER BY transaction_date DESC', (err, rows) => {
        records = rows;
    });

    db.close(() => {
        res.render('index', { total, records });
    });
});

app.get('/insert', (req, res) => {
    res.render('insert');
});

app.post('/insert', (req, res) => {
    //res.send(req.body); return;

    const db = new sqlite3.Database(dbFilename, sqlite3.OPEN_READWRITE);

    db.run('INSERT INTO t1 (transaction_date, amount, account_a, account_b, description) VALUES (?, ?, ?, ?, ?)', [
        req.body.date,
        req.body.amount,
        req.body.account_a,
        req.body.account_b,
        req.body.description
    ]);
    
    db.close(() => {
        res.redirect('/');
    });
});

app.listen(5000, () => {
    console.log('http://localhost:5000');
});
