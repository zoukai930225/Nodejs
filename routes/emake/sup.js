var express = require('express'),
    async = require('async'),
    router = express.Router(),
    Contract = require('../../models/emake/contract.js'),
    Tec = require('../../models/emake/technical.js'),
    order = require('../../models/emake/order'),
    sup = require('../../models/emake/sup'),
    http = require('http'),
    url = require('url'),
    crypto = require('crypto');
Attachment = '';
router.get('/:contractId', function (req, res) {
    let CId = req.params.contractId;
    Contract.find(CId, req, function (i, data) {
        if (!data.ResultCode) {
            if (data.Data.ContractInfo.ContractType == "A1" || data.Data.ContractInfo.ContractType == "A0") {
                data.Data.ContractInfo.AddWhen = GetTime(data.Data.ContractInfo.AddWhen);
                res.render('emake/sup', { title: '合同补充附件', data: data.Data });
            } else if (data.Data.ContractInfo.ContractType == "A2") {
                order.findOrder(CId, req, function (i, dis) {
                    dis.Data.ContractInfo.AddWhen = GetTime(dis.Data.ContractInfo.AddWhen);
                    res.render('emake/sup', { title: '合同补充附件', data: dis.Data });
                });
            }
        }
    });
});
router.get('/getnew/:contractId', function (req, res) {
    let Cid = req.params.contractId;
    Contract.find(Cid, req, function (i, data) {
        if (!data.ResultCode) {
            if (data.Data.ContractInfo.ContractType == "A1" || data.Data.ContractInfo.ContractType == "A0") {
                Attachment = data.Data.attachment;
                res.send(JSON.stringify('success'));
            } else if (data.Data.ContractInfo.ContractType == "A2") {
                order.findOrder(Cid, req, function (i, dis) {
                    Attachment = dis.Data.attachment;
                    res.send(JSON.stringify('success'));
                });
            }
        }
    });
});
router.post('/getcheck/:contractId', function (req, res) {
    let Cid = req.params.contractId;
    if (!req.body.Attachment) {
        var Data = { ContractNo: req.params.contractId, Content: Attachment };
    } else {
        var Data = { ContractNo: req.params.contractId, Content: req.body.Attachment };
    }
    sup.PostAttachment(Data, function (require) {
        if (require.statusCode == 200 && !require.Data.ResultCode) {
            sup.GetNewAttach(Cid, req, function (success, successres) {
                if (!successres.statusCode) {
                    res.send(successres);
                } else {
                    res.send(successres);
                }
            });
        } else {
            res.send(require.Data);
        }
    });
});
function GetTime(t) {
    t = new Date(t).getFullYear() + '年' + (new Date(t).getMonth()
        + 1) + '月' + new Date(t).getDate() + '日';
    return t;
}
module.exports = router;