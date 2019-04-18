/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : nodesample

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2016-06-29 15:37:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `userinfo`
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `UserName` varchar(64) NOT NULL COMMENT '用户名',
  `UserPass` varchar(64) NOT NULL COMMENT '用户密码',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('1', 'zxx', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('2', 'abc', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('3', 'zhou', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('4', 'aaa', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('5', 'bbb', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('6', 'ccc', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('7', 'ddd', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('8', 'eee', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('9', 'fff', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `userinfo` VALUES ('10', 'hhh', 'e10adc3949ba59abbe56e057f20f883e');

-- ----------------------------
-- Procedure structure for `P_UserInfo`
-- ----------------------------
DROP PROCEDURE IF EXISTS `P_UserInfo`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `P_UserInfo`(IN ExtId INT,IN ExtUserName VARCHAR(64),IN ExtUserPass VARCHAR(64),OUT ExtReturnVal INT)
TOP: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET ExtReturnVal = 0;  -- Failed
    END;

START TRANSACTION;

        INSERT INTO userinfo(Id,UserName,UserPass) VALUES(ExtId,ExtUserName,ExtUserPass);
        
        SET ExtReturnVal = 1;
        SELECT ExtReturnVal;
        COMMIT;
END
;;
DELIMITER ;
