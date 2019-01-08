const express = require('express');
const path = require("path");
const app = express()


const fs = require('fs');

const csvFilePath = './public/poa_min.csv'; //arq csv
const csv = require('csvtojson')

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
       
    
    var dias = {};
    jsonObj.map(function(dado) {
        
        if (!dias[dado.Data_Fato]){
            dias[dado.Data_Fato] = newArrayHoras();
        }

        let end = dado.Hora_Fato.length == 5 ? 2 : 1;

        var dadoSalvar = {
            "ID": dado.ID,
            "Data_Fato": dado.Data_Fato,
            "Hora_Fato": dado.Hora_Fato,
            "Lat": dado.lat,
            "Lon": dado.long
        }
       
       dias[dado.Data_Fato][dado.Hora_Fato.substring(0, end)].push(dadoSalvar);
    });
   
    fs.writeFileSync(path.join(__dirname + '/public/dados.json'), JSON.stringify(dias), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
})

function newArrayHoras () {
   var horas = [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    
    for(let i = 0; i <24; i++) {
        horas[i] = [];
    }

    return horas;
}

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, () => console.log('Listening on port 3000!'))