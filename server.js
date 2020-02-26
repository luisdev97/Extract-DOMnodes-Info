var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



function readJson(jsonPath, pokemon){
    
     fs.readFile(jsonPath, 'utf-8', (err, data) => {
        if(err){
            console.log(err);
            return err;
        }

        let actualList = JSON.parse(data);
        console.log(actualList);
        actualList.push(pokemon);
        console.log('actualList');
        let updatedList = JSON.stringify(actualList);
        fs.writeFile('data.json', updatedList, 'utf-8', () => {});

        
    });

}



app.post('/write', (req, res) => {
    const pokemon = req.body.pokemon;
    readJson('data.json', pokemon);
   
    res.send('ready');
});


var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

