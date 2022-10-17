const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("index.html", 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%currTemp%}", orgVal.main.temp);
    
    temperature = temperature.replace("{%minTemp%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%maxTemp%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%status%}", orgVal.weather[0].main);
    return temperature;
};                                                                               
      

const server = http.createServer((req, res) => {
 
    if (req.url == "/") { 
        requests("https://api.openweathermap.org/data/2.5/weather?q=patna&appid=2d805d78cf6dcc1becdb14ba5342b343&units=metric").on('data', (chunkdata)=> {

                const objData = JSON.parse(chunkdata);
                const arrData = [objData];
                // console.log(arrData);
                // console.log(arrData[0].main.temp)
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val))
                .join("");
            res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log('There is an error', err);
                
            })
    }
    
});
    
server.listen(3000, "127.0.0.1");