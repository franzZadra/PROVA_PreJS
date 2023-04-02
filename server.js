import express from 'express';
import fs from 'fs';
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import url from 'url';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = await open({
    filename: 'db.db',
    driver: sqlite3.Database
});

await db.exec('CREATE TABLE IF NOT EXISTS Registro(materia varchar(20) PRIMARY KEY, voto INT not null)');


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    try {
      var content = fs.readFileSync('index.html', 'utf8');
      res.set('Content-Type', 'text/html');
      res.status(200).send(content);
    } catch (err) {
      res.send(err);
    }
    res.end();
  });

app.get('/stampa', async (req, res) => {
    try{
        const data = await db.all('SELECT * FROM Registro');
        const arraydati = [];
        for(let i = 0; i < data.length; i++){
            arraydati.push({
                "materia" : data[i].materia,
                "voto" : data[i].voto
            });
        }
        res.status(200).send(arraydati);
    }catch(err){
        console.error(err);
        console.log("Errore nella trasmissione");
        res.status(500).send("Errore nella trasmissione");
    }
});

app.post('/', async (req, res) => {
    try{
        const materia = req.body.materia;
        const voto = req.body.voto;
        
        const data = await db.run('INSERT INTO Registro VALUES (?, ?)', [materia, voto]);
        if(data != null){
            res.status(200).send("Inserimento effettuato");
        }
        else{
            res.status(400).send("Problemi nell'insert");
        }
    }catch(err){
        console.error(err);
        console.log("Errore nella trasmissione");
        res.status(500).send("Errore nella trasmissione");
    }
});

app.put('/put', async (req, res) => {
    try{
        
    }catch(err){
        console.error(err);
        console.log("Errore nella trasmissione");
        res.status(500).send("Errore nella trasmissione");
    }
});

app.delete('/delete', async (req, res) => {
    try{
        
    }catch(err){
        console.error(err);
        console.log("Errore nella trasmissione");
        res.status(500).send("Errore nella trasmissione");
    }
});

app.listen(3000, 'localhost', () => {
    console.log("Sever listening on http://localhost:3000");
});