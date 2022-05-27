const express = require('express')
const app = express()
const axios = require('axios').default;
const fs = require('fs');

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
const port = 3000

app.get('/:userName', (req, res) => {
    try {
        fs.readFile(`jsonData/${req.params.userName}.json`, (err, data) => {
            if (err) {res.status(500).send("json not available for the user")}
            else{
                let dbData = JSON.parse(data);
                res.send(dbData)
            }
          
        });
    } catch (error) {
        res.status(500).send("some error occurred")
    }

})

app.post('/createFakeAPI', async (req, res) => {
    try {
        axios.get(req.body['url'])
            .then(function (response) {
                let userName = req.body['url'].split('https://raw.githubusercontent.com/')[1].split('/')[0]
                let data = JSON.stringify(response.data);
                fs.writeFileSync(`jsonData/${userName}.json`, data);
                res.send(data)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    } catch (error) {
        res.status(500).send("some error occurred")

    }
});

app.get('/:userName/:tableName', (req, res) => {
    try {
        fs.readFile(`jsonData/${req.params.userName}.json`, (err, data) => {
            if (err) {res.status(500).send("json not available for the user")}
            else{
                let dbData = JSON.parse(data);
                res.send(dbData[req.params.tableName])
            }
           
        });
    } catch (error) {
        res.status(500).send("some error occurred")

    }
})


app.post('/:userName/:tableName', async (req, res) => {
    try {
        fs.readFile(`jsonData/${req.params.userName}.json`, (err, data) => {
            if (err) {res.status(500).send("json not available for the user")}
            else{
                let dbData = JSON.parse(data);
                dbData[req.params.tableName].push(req.body)
                fs.writeFileSync(`jsonData/${req.params.userName}.json`, JSON.stringify(dbData));
                res.send(req.body)
            }
        });
    } catch (error) {
        res.status(500).send("some error occurred")

    }
});


app.put('/:userName/:tableName/:documentId', async (req, res) => {
    try {
        fs.readFile(`jsonData/${req.params.userName}.json`, (err, data) => {
            let documentId = req.params.documentId
            if (err) {res.status(500).send("json not available for the user")}
            else{
                let dbData = JSON.parse(data);
                let foundIndex = -1;
                foundIndex = dbData[req.params.tableName].findIndex((obj => obj.id == documentId));
                if (foundIndex>-1) {
                    let dataToBeUpdated = req.body
                    dataToBeUpdated['id'] = documentId
                    dbData[req.params.tableName][foundIndex] = dataToBeUpdated
                }
                fs.writeFileSync(`jsonData/${req.params.userName}.json`, JSON.stringify(dbData));
                res.send(req.body)
            }
           
        });
    } catch (error) {
        res.status(500).send("some error occurred")

    }
});


app.delete('/:userName/:tableName/:documentId', async (req, res) => {
    try {
        fs.readFile(`jsonData/${req.params.userName}.json`, (err, data) => {
            let documentId = req.params.documentId
            if (err) {res.status(500).send("json not available for the user")}
            else{
                let dbData = JSON.parse(data);
                let foundIndex = -1;
                foundIndex = dbData[req.params.tableName].findIndex((obj => obj.id == documentId));
                if (foundIndex>-1) {
                    dbData[req.params.tableName].splice(foundIndex, 1);
                }
                fs.writeFileSync(`jsonData/${req.params.userName}.json`, JSON.stringify(dbData));
                res.send(req.body)
            }
           
        });
    } catch (error) {
        res.status(500).send("some error occurred")

    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})