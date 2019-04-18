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
/**
 * 获取技术协议
 */
router.get('/:contractId/:productCode', function (req, res) {
    let Cid = req.params.contractId;
    let Pid = req.params.productCode;
    let template = [];
    let name = '';
    Contract.findProduct(Cid, Pid, req, function (i, data) {
        if (!data.ResultCode) {
            Contract.find(Cid, req, function (is, dis) {
                dis.Data.technologys.forEach(tis => {
                    if (data.Data.ProductId == tis.ProductId) {
                        dis.Data.technology = tis;
                        name = dis.Data.GoodsList[dis.Data.technologys.indexOf(tis)].GoodsName;
                    }
                });
                Tec.GetTechTem(data.Data.GoodsSeriesCode, dis.Data.ContractInfo.CategoryBId, req, function (i, result) {
                    if (dis.Data.technology.CheckBox) {
                        dis.Data.technology.Template = JSON.parse(dis.Data.technology.CheckBox);
                        template = dis.Data.technology;
                    } else {
                        result.Data.Template = JSON.parse(result.Data.Template);
                        result.Data.Template.forEach(tris => {
                            data.Data.params.forEach(dits => {
                                if (dits.SpecName == tris.TechnicalParameters) {
                                    tris.value = dits.ParamName
                                }
                            });
                        });
                        template = result.Data;
                    }
                    res.render('emake/individualtechnicalagreement', {
                        title: '技术协议', data: dis.Data, tem: template, GoodsSeriesName: name
                    });
                });
            });
        }
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
            Contract.find(Cid, req, function (is, dis) {
                if (!dis.ResultCode) {
                    Tec.GetTechTem(data.Data.GoodsSeriesCode, dis.Data.ContractInfo.CategoryBId, req, function (i, result) {
                        if (data.Data.CheckBox) {
                            CheckBoxTi = JSON.parse(data.Data.CheckBox);
                        } else {
                            CheckBoxTi = JSON.parse(result.Data.Template);
                            CheckBoxTi.forEach(tris => {
                                data.Data.params.forEach(dits => {
                                    if (dits.SpecName == tris.TechnicalParameters) {
                                        tris.value = dits.ParamName
                                    }
                                });
                            });
                        }
                        res.send(JSON.stringify('success'));
                    });
                }
                console.log(JSON.stringify(dis));
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
    var Data = {
        MainProductId: req.params.productCode,
        CheckBox: JSON.stringify(CheckBoxTi),
        ContractNo: req.params.contractId,
    };
    Tec.PostCheckBox(Data, function (require) {
        if (require.statusCode == 200) {
            res.send(require.Data);
        } else {
            res.send('error');
        }
    });
});
module.exports = router;