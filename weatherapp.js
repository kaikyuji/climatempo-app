const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https')

app.use('/public', express.static('public')); // enviar arquivos como CSS e imagens
app.use(bodyParser.urlencoded({extended:true})); // ativar bodyParser
app.set('view engine', 'ejs');// 

app.listen(3000, () =>{
    console.log('hello :), server started in port 3000')
});

brazilStates = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins']

let weatherIcon
let temperature
let temperatureMin
let temperatureMax
let humidity
let selectedState

app.get('/', (req, res) =>{
    res.render('index', {brazilStates})
});

app.post('/', (req, res) => {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
    const APIkey = '&units=metric&appid=94c76bb9f6dae30658e01290409e1779';
    selectedState = req.body.states_select_name
    https.get(apiUrl+selectedState+APIkey, (serverData) =>{
        // Aqui é basicamente toda a requisição da API Weather
        let data = ''
        serverData.on('data', (chunk) => {
            data +=chunk
        })
        serverData.on('end', () => {
            const weatherApiData = JSON.parse(data)
            const iconCode = weatherApiData.weather[0].icon
            weatherIcon = `http://openweathermap.org/img/wn/${iconCode}.png`;
            temperature = weatherApiData.main.temp
            temperatureMin = weatherApiData.main.temp_min
            temperatureMax = weatherApiData.main.temp_max
            humidity = weatherApiData.main.humidity
            apiData = [{weatherIcon, temperature, temperatureMin, temperatureMax, humidity, selectedState}]
            // Verificação do estado do servidor
            if(serverData.statusCode != 200){
                const numberError = serverData.statusCode
                const msgError = serverData.statusMessage
                res.render('error', {numberError, msgError})
                // res.send(`Error ${numberError}: ${msgError}`)
            }else{
                res.redirect('/')
                console.log(apiData[0])
            }
        })
    })
});


////////////////////////