var http = require('http');
var config = require('../../config');
exports.PostCheckBox = function (data, fn) {
    var content = JSON.stringify(data);
    var options = {
        hostname: config.host,
        port: config.port,
        path: '/web/make/technology',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(content)
        }
    };
    var req = http.request(options, function (res) {
        var _data = '';
        res.on('data', function (chunk) {
            _data += chunk;
        });
        res.on('end', function () {
            if (res.statusCode == 200) {
                fn({ Data: JSON.parse(_data), statusCode: 200 });
            } else {
                console.log(_data);
                fn({ Data: JSON.parse(_data), statusCode: 500 });
            }
        });
    });
    req.write(content);
    req.end();
}
exports.GetTechTem = function (Cid, id, req, success) {
    var options = {
        hostname: config.host,
        port: config.port,
        path: '/web/make/technology/template?GoodsSeriesCode=' + Cid + "&&CategoryBId=" + id,
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