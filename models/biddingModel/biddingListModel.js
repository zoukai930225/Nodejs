var mysql = require("mysql");
var cfg = require("../../config").biddingcfg;

exports.getList = function(biddingID,fn){
    var connection = mysql.createConnection(cfg);
    var  GetSql = "SELECT AppOrderNo,GoodsID FROM tf_bidding_goods WHERE BiddingID='" + biddingID + "'";
    connection.query(GetSql,function(err,result){
        if(err){
            console.log(err);
            connection.end();
            return;
        }
        fn(result);
        connection.end();
    });
}