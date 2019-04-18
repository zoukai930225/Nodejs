var express = require('express'),
    async = require('async'),
    router = express.Router(),
    Contract = require('../../models/biddingModel/contractModel'),
    Tec = require('../../models/emake/technical.js'),
    http = require('http'),
    url = require('url'),
    crypto = require('crypto');

router.get('/:contractId', function (req, res) {
    let CId = req.params.contractId;
    Contract.find(CId, req, function (data) {
        if (!data.ResultCode) {
            data.CACN = GetAmount(data.ContractAmount);
            var str = new RegExp('&lt;', 'g');
            var _str = new RegExp('&gt;', 'g');
            var bfh = new RegExp('&qt', 'g');
            data.ContractTerms = data.ContractTerms.replace(str, "<");
            data.ContractTerms = data.ContractTerms.replace(_str, ">");
            data.ContractTerms = data.ContractTerms.replace(bfh, "%");
            data.ContractODM = data.ContractTerms.replace(str, "<");
            data.ContractODM = data.ContractTerms.replace(_str, ">");
            data.ContractODM = data.ContractTerms.replace(bfh, "%");
            data.CreateTime = GetTime(data.CreateTime);
            data.Details.forEach( function(ele){
                ele.DeliveryDate = GetTime(ele.DeliveryDate);
            } );
            res.render('bidding/contract', { data: data });
        }
    });
});

function GetTime(t) {
    t = new Date(t).getFullYear() + '年' + (new Date(t).getMonth()
        + 1) + '月' + new Date(t).getDate() + '日';
    return t;
}
function GetAmount(s) {
    function GetCap(n) {
        var fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
    }
    s = GetCap(s);
    return s;
}
module.exports = router;