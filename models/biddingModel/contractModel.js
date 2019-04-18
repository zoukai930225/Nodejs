var http = require('http');
var mysql = require("mysql");

var cfg = require("../../config");

exports.find = function (Cid, req, success) {
    var data = {};
    var ContractID,CompanyAID,CompanyBID;
    var s1 = "SELECT BiddingID,ContractID,ContractNo,IFNULL(HasPayFee,0) HasPayFee, \
ContractAmount,DeliveryDate,ContractTerms,CompanyAID,CompanyBID,IsIncludeTax,CreateTime,IsODM,ODMAmount,ContractODM,TechnologyAgreement FROM tf_contract WHERE ContractNo='"+ Cid +"'";
    var connection = mysql.createConnection(cfg.biddingcfg);
    connection.query(s1, function(err,result1){
        if(err){
            console.log(err);
            connection.end();
            return;
        }
        CompanyAID = result1[0].CompanyAID;
        CompanyBID = result1[0].CompanyBID;
        ContractID = result1[0].ContractID;
        data = result1[0];
        var s2 = "SELECT ElectronicSealUrl,CompanyName,CompanyAddress,CompanyTax,CompanyFax,DepositBank,BankAccount,Contacter,LegalPerson,CompanyTel,CompanyFax FROM tf_emake_sub_company WHERE CompanyID='" + CompanyAID +"'";
        connection.query(s2,function(err,result2){
            data.CompanyA_Tax = result2[0].CompanyTax;
            data.CompanyA_Name = result2[0].CompanyName;
            data.CompanyA_Address = result2[0].CompanyAddress;
            data.CompanyA_Fax = result2[0].CompanyFax;
            data.CompanyA_DepositBank = result2[0].DepositBank;
            data.CompanyA_BankAccount = result2[0].BankAccount;
            data.CompanyA_Contacter = result2[0].Contacter;
            data.CompanyA_LegalPerson = result2[0].LegalPerson;
            data.CompanyA_Tel = result2[0].CompanyTel;
            data.CompanyA_Fax = result2[0].CompanyFax;
            data.CompanyAImg = result2[0].ElectronicSealUrl;
            var s3 = "SELECT CompanyName,CompanyAddress,CompanyFax,CompanyTax,DepositBank,BankAccount,Contacter,LegalPerson,CompanyTel,CompanyFax FROM tf_company WHERE CompanyID='" + CompanyBID +"'";
            connection.query(s3,function(err,result3){
                data.CompanyB_Tax = result3[0].CompanyTax;
                data.CompanyB_Name = result3[0].CompanyName;
                data.CompanyB_Address = result3[0].CompanyAddress;
                data.CompanyB_Fax = result3[0].CompanyFax;
                data.CompanyB_DepositBank = result3[0].DepositBank;
                data.CompanyB_BankAccount = result3[0].BankAccount;
                data.CompanyB_Contacter = result3[0].Contacter;
                data.CompanyB_LegalPerson = result3[0].LegalPerson;
                data.CompanyB_Tel = result3[0].CompanyTel;
                data.CompanyB_Fax = result3[0].CompanyFax;
                data.ContractAmount = data.ContractAmount/100;
                data.HasPayFee = data.HasPayFee/100;
                var s4 = "SELECT BiddingID,GoodsName,Remark,GoodsLabel, \
                TechnologyAgreement,SuccessfulPrice,GoodsPrice,OrderQty,DeliveryDate \
                FROM tf_contract_detail WHERE ContractID='" + ContractID +"'";
                connection.query(s4,function(err,result4){
                    result4.forEach(ele => {
                        ele.SuccessfulPrice = ele.SuccessfulPrice/100;
                        ele.GoodsPrice = ele.GoodsPrice/100;
                    });
                    data.Details = result4;
                    var s5 = "SELECT ContracAnnexID,ContractAnnexUrl FROM tf_contract_annex WHERE ContractID='" + ContractID +"'";
                    connection.query(s5,function(err,result5){
                        data.Annexs = result5[0];
                        success(data);
                        connection.end();
                    });
                })
            });
        });
    });
}

// exports.findProduct = function (Cid, Pid, req, success) {
//     console.log(config.host + '/web/html/contract/' + Cid + "?ProductId=" + Pid)
//     var options = {
//         hostname: config.host,
//         port: config.port,
//         path: '/web/html/contract/' + Cid + "?ProductId=" + Pid,
//         method: 'GET'
//     };
//     var req = http.request(options, function (response) {
//         var str = '';
//         response.setEncoding('utf-8');
//         response.on('data', function (chunk) {
//             str += chunk;
//         });
//         response.on('end', function () {
//             // console.log(str)
//             success(response, JSON.parse(str));
//         });
//     });
//     req.on('error', function (e) {
//         console.log('problem with request: ' + e.message);
//     });
//     req.end();
// }