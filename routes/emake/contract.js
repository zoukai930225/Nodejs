var express = require('express'),
    async = require('async'),
    router = express.Router(),
    Contract = require('../../models/emake/contract.js'),
    Tec = require('../../models/emake/technical.js'),
    order = require('../../models/emake/order'),
    http = require('http'),
    url = require('url'),
    crypto = require('crypto');

router.get('/:contractId', function (req, res) {
    let CId = req.params.contractId;
    Contract.find(CId, req, function (i, data) {
        if (!data.ResultCode) {
            // console.log(JSON.stringify(data));
            // if (data.Data.ContractInfo.ContractType == "A1" || data.Data.ContractInfo.ContractType == "A0") {
            if (!data.Data.ContractInfo.ContractTemplateDetail) {
                // console.log(1111111);
                data.Data.ContractTemplate.ContractTemplateDetails =
                    JSON.parse(data.Data.ContractTemplate.ContractTemplateDetail);
            } else {
                // console.log(222222);
                data.Data.ContractTemplate.ContractTemplateDetails = JSON.parse(data.Data.ContractInfo.ContractTemplateDetail);
            }
            // console.log(JSON.stringify(data));
            // if (!data.Data.ContractTemplate.ContractTemplateDetail) {
            //     data.Data.ContractTemplate.ContractTemplateDetails = [];
            // } else {

            // }
            data.Data.ContractInfo.addWhen = GetTime(data.Data.ContractInfo.addWhen);
            data.Data.ContractInfo.ContractAmount = convertCurrency(
                data.Data.ContractInfo.ContractAmount);
            data.Data.ContractInfo.TaxPrice = convertCurrency(
                data.Data.ContractInfo.TaxPrice);
            async.eachSeries(data.Data.technologys, function (tis, callback) {
                tis.Template = [];
                if (tis.CheckBox) {
                    tis.Template = JSON.parse(tis.CheckBox);
                    callback(null);
                } else {
                    Contract.findProduct(CId, tis.ProductId, req, function (i, datas) {
                        if (!datas.ResultCode) {
                            Tec.GetTechTem(datas.Data.GoodsSeriesCode, data.Data.ContractInfo.CategoryBId, req, function (i, result) {
                                result.Data.template = JSON.parse(result.Data.Template);
                                result.Data.template.forEach(tris => {
                                    datas.Data.params.forEach(dits => {
                                        if (dits.SpecName == tris.TechnicalParameters) {
                                            tris.value = dits.ParamName
                                        }
                                    });
                                });
                                tis.Template = result.Data.template;
                                callback(null);
                            });
                        }
                    });
                }
            }, err => {
                data.Data.Attachments = data.Data.Attachment.split('；');
                // console.log(JSON.stringify(data.Data));
                // console.log(data.Data)
                if (data.Data.ContractInfo.IsIncludeTax == "1") {
                    res.render('emake/contract', { title: '销售合同', data: data.Data });
                } else if (data.Data.ContractInfo.IsIncludeTax == "0") {
                    res.render('emake/ElectroniOrder', { title: '商品订单', data: data.Data });
                }
            });
            // } else if (data.Data.ContractInfo.ContractType == "A2") {
            //     order.findOrder(CId, req, function (i, dis) {
            //         if (!dis.ResultCode) {
            //             console.log(JSON.stringify(dis))
            // dis.Data.ContractInfo.combined = convertCurrency(dis.Data.ContractInfo.ContractAmount);
            // dis.Data.ContractInfo.TaxPrice = convertCurrency(dis.Data.ContractInfo.TaxPrice);
            // dis.Data.Attachments = dis.Data.Attachment.split('；');
            // res.render('emake/ElectroniOrder', { title: '销售合同', data: dis.Data });
            //         }
            //     });
            // }
        }
    });
});
function GetTime(t) {
    t = new Date(t).getFullYear() + '年' + (new Date(t).getMonth()
        + 1) + '月' + new Date(t).getDate() + '日';
    return t;
}
function convertCurrency(money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '圆';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}
module.exports = router;