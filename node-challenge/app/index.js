const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000

const connectionString = 'mysql://root:root@db:3306/nodedb';

function connectWithRetry() {
    const connection = mysql.createConnection(connectionString);
    
    connection.connect((err) => {
        if (err) {
            console.log('Failed to connect to db - retrying in 5 sec');
            setTimeout(connectWithRetry, 5000);
            return;
        }
        console.log('Connected to database');
        initializeApp(connection);
    });
}

function initializeApp(connection) {
    const sql = `CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(255), PRIMARY KEY(id))`
    connection.query(sql)

    app.get('/', (req,res) => {
        const name = 'Full Cycle'
        connection.query(`INSERT INTO people(name) values('${name}')`)
        
        connection.query(`SELECT name FROM people`, (error, results) => {
            if (error) {
                throw error
            }
            
            let html = '<h1>Node Challenge</h1>'
            html += '<ul>'
            results.forEach(result => {
                html += `<li>${result.name}</li>`
            })
            html += '</ul>'
            
            res.send(html)
        })
    })

    app.listen(port, () => {
        console.log('Running on port ' + port)
    })
}

connectWithRetry();
