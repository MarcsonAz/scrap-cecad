import axios from 'axios'
import cheerio from 'cheerio';
import nodemon from 'nodemon';


// '07/20070,62'
function tratamento(str){
    let data = str.substring(0,7);
    let valor = str.substring(7,).replace(',','.');
    return( [ data, parseFloat(valor) ] )
}

async function getData(UF,MUN,INDICADOR) {
    let list = []
    try {
      const { data } = await axios({
          method: "GET",
          url: `https://cecad.cidadania.gov.br/agregado/resumovariavelCecad.php`,
          params: {
            uf_ibge : UF,
            p_ibge : MUN,
            id : INDICADOR,
          }
      })
      
      const $ = cheerio.load(data)
      const elemSelector = '#id_3 > div > table > tbody > tr'
      
      $(elemSelector).each( (pIdx,pElem) => {
            const x = $(pElem).text()
            let [data,valor] = tratamento(x)
            list.push({'uf':UF,'idmun':MUN,data,valor})
      })
      //console.log(list)
    } catch (err) {
        console.error(err)
    }
    return(list)
}

async function getMunListByUf(cod_UF) {
    
    let list = []
    try {
      const { data } = await axios({
          method: "GET",
          url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${cod_UF}/municipios`,
          params: {
            view : 'nivelado'
          }
      })
      
      //console.log(data)
      data.forEach( el => {
        list.push({'regiao': el['regiao-nome'], 'sigla': el['UF-sigla'], 
        'id': el['municipio-id'], 'nome': el['municipio-nome']})  
      })
      
    } catch (err) {
        console.error(err)
    }
    return(list)
}

async function getMunListByUf2(cod_UF,INDICADOR) { 
  let list = []
  try {
    const { data } = await axios({
      method: "GET",
      url: `https://cecad.cidadania.gov.br/agregado/resumovariavelCecad.php`,
      params: {
        uf_ibge : cod_UF,
        id : INDICADOR,
      }
    })
    const $ = cheerio.load(data)
    const elemSelector = '#municipioSAGIUFMU > option[value!=""]'
      
    $(elemSelector).each( (pIdx,pElem) => {
      const id = $(pElem).attr('value')
      const nome = $(pElem).text()
      list.push({id,nome})
      console.log({id,nome})
    })

  } 
  catch (err) {
      console.error(err)
  }
  return(list)
}



async function getUfList() {
    
    let list = []
    try {
      const {data}  = await axios({
          method: "GET",
          url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
          params: {
            view : 'nivelado'
          }
      })
      //console.log(data)

      data.forEach(elem => {
        list.push(elem['UF-id'])  
      });
        
      
    } catch (err) {
        console.error(err)
    }
    return(list)
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {getData,getUfList,getMunListByUf,timeout}