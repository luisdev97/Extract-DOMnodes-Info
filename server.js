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

app.get('/scrap', (req, res) => {
    for(let i = 0; i < 890; i++){
        
            let id = i + 1;
            scrapPokemon(id).then(res => {

                
                const pokemon = {
                    id,
                    description: res[0].pokemon
                }
                readJson('data.json', pokemon);
            });

    }
    
    res.json({
        ok: true
    });
})


app.get('/readJson' , async(req, res) => {
    let file = await fs.readFileSync('data.json','utf-8');
    let lista = JSON.parse(file);
    console.log(lista.find(i => i.id == 150));   
});

app.put('/sortJson', async(req, res) => {
    let file = await fs.readFileSync('data.json','utf-8');
    let lista = JSON.parse(file);
})
app.listen(3000, () => {
    console.log('server run in port 3000');
})