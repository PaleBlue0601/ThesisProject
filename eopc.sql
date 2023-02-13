/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50734
 Source Host           : localhost:3306
 Source Schema         : eopc

 Target Server Type    : MySQL
 Target Server Version : 50734
 File Encoding         : 65001

 Date: 13/02/2023 17:08:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for object_exchange
-- ----------------------------
DROP TABLE IF EXISTS `object_exchange`;
CREATE TABLE `object_exchange`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `alUserID` int(11) NULL DEFAULT NULL COMMENT '申请方ID',
  `rsUserID` int(11) NULL DEFAULT NULL COMMENT '处理方ID',
  `alObjectID` int(11) NULL DEFAULT NULL COMMENT '申请方藏品ID',
  `rsObjectID` int(11) NULL DEFAULT NULL COMMENT '处理方藏品ID',
  `status` enum('pending','success') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '业务状态',
  `noneUserID` int(11) NULL DEFAULT NULL COMMENT '对目标用户隐藏此条数据标识',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for object_info
-- ----------------------------
DROP TABLE IF EXISTS `object_info`;
CREATE TABLE `object_info`  (
  `objectID` int(11) NOT NULL AUTO_INCREMENT COMMENT '藏品ID',
  `userID` int(11) NOT NULL COMMENT '持有者ID',
  `objectName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '藏品名称',
  `objectDescribe` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '藏品描述',
  `objectPic` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '藏品图片',
  `modifyDate` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '改动时间',
  `views` int(11) NULL DEFAULT NULL COMMENT '浏览数',
  `likes` int(11) NULL DEFAULT NULL COMMENT '点赞数',
  `status` enum('unexchange','inexchange','exchangeed') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '状态',
  PRIMARY KEY (`objectID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for object_likes
-- ----------------------------
DROP TABLE IF EXISTS `object_likes`;
CREATE TABLE `object_likes`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `userID` int(11) NOT NULL COMMENT '用户ID',
  `objectID` int(11) NOT NULL COMMENT '藏品ID',
  `whether` enum('yes','no') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否点赞',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ship_to_address
-- ----------------------------
DROP TABLE IF EXISTS `ship_to_address`;
CREATE TABLE `ship_to_address`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL COMMENT '用户id',
  `consignee` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人',
  `location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '所在地',
  `detailedAddress` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '详细地址',
  `postalCode` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮编',
  `phoneNumber` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '手机号码',
  `isDefault` enum('yes','no') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '是否默认',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `userID` int(11) NOT NULL COMMENT '用户id',
  `petName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `gender` enum('男','女') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '性别',
  `birthday` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生日',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '电话',
  `mailbox` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `avatarPath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像路径',
  PRIMARY KEY (`userID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_name_password
-- ----------------------------
DROP TABLE IF EXISTS `user_name_password`;
CREATE TABLE `user_name_password`  (
  `userID` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `userName` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `code` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册验证码',
  `isLive` enum('yes','no') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '验证是否已经注册',
  PRIMARY KEY (`userID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
