var express = require('express'),
    router = express.Router(),
    app = express(),
    Contract = require('../../models/emake/contract.js'),
    Tec = require('../../models/emake/technical.js'),
    http = require('http'),
    url = require('url'),
    crypto = require('crypto'),
    querystring = require('querystring'),
    util = require('util'),
    CheckBoxTi = [];
var getBiddingList = require("../../models/biddingModel/biddingListModel");
/**
 * 获取技术协议
 */
router.get('/:contractId/:productCode', function (req, res) {
    let Cid = req.params.contractId;
    let Pid = req.params.productCode;
    let template = [];
    Contract.findProduct(Cid, Pid, req, function (i, data) {
        if (!data.ResultCode) {
            Tec.GetTechTem(data.Data.technology.GoodsSeriesCode, req, function (i, result) {
                if (data.Data.technology.CheckBox) {
                    console.log(data.Data.technology);
                    data.Data.technology.Template = JSON.parse(data.Data.technology.CheckBox);
                    template = data.Data.technology;
                } else {
                    result.Data.Template = JSON.parse(result.Data.Template);
                    template = result.Data;
                }
                res.render('bidding/biddingtechnical', {
                    title: '技术协议', data: data.Data, tem: template
                });
            });
        }
    });
});

router.get("/:biddingID", function (req, res) {
    var bid = req.params.biddingID;
    getBiddingList.getList(bid, function (resList) {
        let dataList = [];
        var k = 0;
        (function s() {
            Contract.findProduct(resList[k].AppOrderNo, resList[k].GoodsID, req, function (i, data) {
                if (!data.ResultCode) {
                    Tec.GetTechTem(data.Data.technology.GoodsSeriesCode, req, function (i, result) {
                        if (data.Data.technology.CheckBox) {
                            console.log(data.Data.technology);
                            data.Data.technology.Template = JSON.parse(data.Data.technology.CheckBox);
                            var template = data.Data.technology;
                        } else {
                            result.Data.Template = JSON.parse(result.Data.Template);
                            var template = result.Data;
                        }
                        dataList.push({ title: '技术协议', data: data.Data, tem: template });
                        k++;
                        if (k == resList.length) {
                            res.render('bidding/biddinglisttec', { list: dataList });
                            return;
                        }
                        s();
                    });
                }
            });
        })();
    });
});

/**
 * 刷新服务端缓存
 */
router.get('/getnew/:contractId/:productCode', function (req, res) {
    CheckBoxTi = [];
    let Cid = req.params.contractId;
    let Pid = req.params.productCode;
    Contract.findProduct(Cid, Pid, req, function (i, data) {
        if (!data.ResultCode) {
            Tec.GetTechTem(data.Data.technology.GoodsSeriesCode, req, function (i, result) {
                if (data.Data.technology.CheckBox) {
                    CheckBoxTi = JSON.parse(data.Data.technology.CheckBox);
                } else {
                    CheckBoxTi = JSON.parse(result.Data.Template);
                }
                res.send(JSON.stringify('success'));
            });
        }
    });
});
router.post('/getcheck/:contractId/:productCode', function (req, res) {
    req.body.forEach(gs => {
        CheckBoxTi.forEach(cis => {
            if (gs.TechnicalParameters == cis.TechnicalParameters) {
                cis.value = gs.value;
            }
        });
    });
    var Data = { MainProductId: req.params.productCode, CheckBox: JSON.stringify(CheckBoxTi) };
    Tec.PostCheckBox(req.params.contractId, Data, function (require) {
        console.log(require)
        if (require.statusCode == 200) {
            res.send(require.Data);
        } else { res.send('error'); }
    });
});
module.exports = router;