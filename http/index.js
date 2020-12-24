let http = require('http')
let server = http.createServer(function(req, res) {
    res.writeHead(400, {
        "Content-type": "text/html"
    });
    res.end("<h1></h1>")
})

server.listen(4000, "localhost", function() {
    console.log("Http Server running on port 4000")
})