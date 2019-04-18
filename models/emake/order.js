var http = require('http');
var config = require('../../config');
exports.findOrder = function (Cid, req, success) {
    var options = {
        hostname: config.host,
        port: config.port,
        path: '/web/make/contract/html?ContractNo=' + Cid,
        method: 'GET'
    };
    var req = http.request(options, function (response) {
        var str = '';
        response.setEncoding('utf-8');
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            success(response, JSON.parse(str));
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}