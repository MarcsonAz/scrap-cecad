# scrap-cecad
Coletar dados do PBF na base do CECAD

### tarefa

Coletar indicadores de gestão do PBF no site: [CECAD](https://cecad.cidadania.gov.br/agregado/index4.php) 

Explorar > Série Histórica > IGDM > Até julho de 2015


Serão coletadas as séries para cada município, o padrão na url que permitirá o scrap tem 3 variáveis, o código da UF, o código do Município (7dig) e o código do indicador.


ex.:
"https://cecad.cidadania.gov.br/agregado/resumovariavelCecad.php?uf_ibge=16&p_ibge=1600279&id=75"


Os dados coletados são pares de data e valor de referência do indicador para cada município, será criado um arquivo em csv para cada município com os dados que serão tratados depois no programa em R.



