const http = require('http');
const url = require('url');
const querystring = require('querystring');
const {countries} = require('countries-list');
const {error, info} = require('./src/modules/myLogs');

const server = http.createServer(function(request,response){
    const parsed = url.parse(request.url);
    const pathname = parsed.pathname;
    const query = querystring.parse(parsed.query);
    console.log('query',query);
    console.log('parsed',parsed);
    if(pathname === '/'){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write('<html><body>Home Page</body></html>');
        response.end();
    } else if(pathname === '/exit') {
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write('<html><body>Bye</body></html>');
        response.end();
    } else if(pathname === '/country') {
        response.writeHead(200,{'Content-Type':'application/json'});
        response.write(JSON.stringify(countries[query.code]));
        response.end();
    } else if(pathname === '/info') {
        const result = info(pathname);
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(result);
        response.end();
    } else if(pathname === '/error') {
        const result = error(pathname);
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(result);
        response.end();
    } else {
        response.writeHead(404,{'Content-Type':'text/html'});
        response.write('<html><body>404 Not Found</body></html>');
        response.end();
    }
    
});

server.listen(4000);
console.log("running on 4000");

