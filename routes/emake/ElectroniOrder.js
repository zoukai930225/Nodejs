var express = require('express'),
    async = require('async'),
    router = express.Router(),
    order = require('../../models/emake/order'),
    http = require('http'),
    url = require('url'),
    crypto = require('crypto');
router.get('/:contractId', function (req, res) {
    let CId = req.params.contractId;
    order.findOrder(CId, req, function (i, data) {
        if (!data.ResultCode) {
            data.Data.ContractInfo.combined = GetAmount(data.Data.ContractInfo.ContractAmount);
            data.Data.ContractInfo.TaxPrice = GetAmount(data.Data.ContractInfo.TaxPrice);
            res.render('emake/ElectroniOrder', { data: data.Data });
        }
    });
});
function GetAmount(s) {
    function GetCap(n) {
        var fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['圆', '万', '亿'],
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
        return head + s.replace(/(零.)*零圆/, '圆')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零圆整');
    }
    s = GetCap(s);
    return s;
}
module.exports = router;