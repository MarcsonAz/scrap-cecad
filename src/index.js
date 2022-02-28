//import axios from 'axios'
//import cheerio from 'cheerio'
import express from 'express'
import {getData,getUfList,getMunListByUf,timeout} from './modules.js';

import ObjectsToCsv from 'objects-to-csv'

const PORT = process.env.PORT || 5000

const app = express()

let listaUF = await getUfList()
/* GERAR UM ARQUIVO POR UF (0 - uf 11 Rondonia , 7 - uf 21 Maranhao)*/
const UF = listaUF[20]

let MUN = await getMunListByUf(UF)

let INDICADOR = '75' /* TAC: 75 e TCQC: 77 - lista em src/indicador.txt*/ 

let saidaUF = []

console.log(MUN.length)

for(let i=0; i<MUN.length; i++){
    //console.log(i,MUN[i].id)
    let saida = await getData(UF,MUN[i].id,INDICADOR);
    console.log(`${MUN[i].regiao} ${MUN[i].sigla} ${MUN[i].id} ${MUN[i].nome}`);
    saidaUF.push(saida);
    await timeout(1);
}

let listaSaida = []
saidaUF.forEach(ar => {
    ar.forEach(item => {
        listaSaida.push(item)
    })
})


const csv = new ObjectsToCsv(listaSaida);
await csv.toDisk(`./municipios/dados_UF_${UF}_indicador_${INDICADOR}.csv`); 

app.listen(PORT, () => console.log(`Servidor esta rodando na porta: ${PORT}`))