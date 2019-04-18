var http = require('http');
var config = require('../../config');
//签订合同
exports.sign = function (Cid, auth, req, success) {
    var options = {
        hostname: config.host,
        port: config.port,
        path: '/web/contract/sign/' + Cid,
        method: 'GET',
        headers: {
            authorization: auth,
        }
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
exports.find = function (Cid, req, success) {
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
exports.findProduct = function (Cid, Pid, req, success) {
    var options = {
        hostname: config.host,
        port: config.port,
        path: '/web/make/technology?ContractNo=' + Cid + "&ProductId=" + Pid,
        method: 'GET'
    };
    var req = http.request(options, function (response) {
        var str = '';
        response.setEncoding('utf-8');
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            // console.log(JSON.parse(str));
            success(response, JSON.parse(str));
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}