var express = require('express');
const app = express();
const osmosis = require('osmosis');
var bodyParser = require("body-parser");
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function readJson(jsonPath, pokemon) {
    let file = await fs.readFileSync(jsonPath,'utf-8');
    let actualList = JSON.parse(file);
    let updatedList = [...actualList, pokemon];
    fs.writeFileSync('data.json', JSON.stringify(updatedList, 'utf-8'));
}

async function scrapPokemon (id){
    return new Promise((resolve, reject ) => {
        let response =  [];
        osmosis.get(`https://www.pokemon.com/es/pokedex/${id}`)
        .find('p.version-y')
        .set('pokemon')
        .data(res => { response.push(res);})
        .error(err => reject(err))
        .done(() => resolve(response));
    });
}

app.get('/scrap', async(req, res) => {
    for(let i = 1; i < 891; i++){
        
            await scrapPokemon(i).then(res => {

                const pokemon = {
                    id: i,
                    description: res[0].pokemon
                }
                readJson('data.json', pokemon);
            });

    }
    
    res.json('Ready');
});


app.listen(3000, () => {
    console.log('server run in port 3000');
});