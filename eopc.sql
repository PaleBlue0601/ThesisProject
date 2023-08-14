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

 Date: 14/08/2023 15:45:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for object_exchange
-- ----------------------------
DROP TABLE IF EXISTS `object_exchange`;
CREATE TABLE `object_exchange`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `alUserID` int(11) NOT NULL COMMENT '申请方ID',
  `rsUserID` int(11) NOT NULL COMMENT '处理方ID',
  `alObjectID` int(11) NOT NULL COMMENT '申请方藏品ID',
  `rsObjectID` int(11) NOT NULL COMMENT '处理方藏品ID',
  `status` enum('pending','success') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '订单状态',
  `noneUserID` int(11) NULL DEFAULT NULL COMMENT '对目标用户隐藏此条数据标识',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of object_exchange
-- ----------------------------
INSERT INTO `object_exchange` VALUES (6, 13, 14, 34, 35, 'success', NULL);
INSERT INTO `object_exchange` VALUES (11, 13, 15, 33, 46, 'success', NULL);
INSERT INTO `object_exchange` VALUES (15, 13, 15, 29, 41, 'pending', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of object_info
-- ----------------------------
INSERT INTO `object_info` VALUES (29, 13, '假面骑士01腰带', '假面骑士01腰带\n01标配230没了\n盒说全灭亡迅雷带dvd360\n盒说全主题曲秘钥200\ndx金属蝗虫秘钥190\ndx日本狼秘钥220     有台词套盒子\ndx灭绝蝗虫秘钥130\n公文包剑30\n扭蛋十块一个\n成色九新声光联动正常。', '05a6b0c416bba8ac93cca7552917354a.png', '2023-3-12 19:32:40', 6, 1, 'inexchange');
INSERT INTO `object_info` VALUES (30, 13, '假面骑士帝骑腰带', '假面骑士万能帝骑3.1，万能白帝，sam3.1套件，本体是万代再版白帝dx，有原版盒说，盒说全。\n腰带本体成色9新，除了改了3.1套件和双活扣其他都没有改动，不喜欢改太多东西。只有腰带和原装盒子配件等，没有卡片，卡片自备，送一节电池和充电器。', 'a7e3257a956464b628264317cec3dc6e.jpg', '2023-3-12 19:22:27', 3, 1, 'unexchange');
INSERT INTO `object_info` VALUES (31, 13, '欧布变身套装奥特曼玩具', '功能：\n欧布圣剑，发光发声，圆盘可转动。\n欧布圆环，发光发声，两翼可自动弹开。\n欧布奥特曼，软胶材质，手臂和腰部可360旋转。\n卡片盒，奥特曼卡片收纳盒，孩子学会收纳，玩具不乱丢。\n\n尺寸：\n欧布圣剑，35*10厘米。\n欧布圆环，21*22厘米。\n欧布奥特曼，24*8.5厘米。', 'c0642f9672c7a8f2ab057b35fd34532a.jpg', '2023-3-12 19:27:41', 4, 1, 'unexchange');
INSERT INTO `object_info` VALUES (32, 13, '泽塔升华器', '正版万代泽塔升华器奥特曼变身器套装豪华版勋章联动配件光弩玩具，勋章只有雷欧奥特曼。', 'f4404b8116752355105f1848477c65cc.jpg', '2023-3-12 19:32:15', 1, 1, 'unexchange');
INSERT INTO `object_info` VALUES (33, 13, '明日方舟水月签名板', '明日方舟 水月与深蓝之树 签名板绝版系列 Arknights，抽奖中的。', '2e38a3c795dc4353f887866c1104ed77.jpg', '2023-3-12 19:39:14', 1, NULL, 'exchangeed');
INSERT INTO `object_info` VALUES (34, 13, '三国杀桌游卡牌', '三国杀桌游卡牌正版全套标准版游戏卡牌休闲益智聚会娱乐对抗\n卡牌大小5.7*8.7cm 全新未拆封 细节见图\n标准版156张卡牌 27张武将牌 11张体力牌 \n10张身份牌 108张游戏牌\n王者之巅70张（SP 界限 神话一将成名 ）加161张游戏牌\n武将合集492张牌（290张武将牌）\n尊享版547张（362张武将牌）\n乱世诸神130张（界限 风林火山 神将 国战）加268张游戏牌\n神话再临86张（界限 神话 12神将 阴雷）加161。', 'd0ec232ca4ae0d28ec3134591f5eda76.jpg', '2023-3-12 19:50:6', 1, 1, 'exchangeed');
INSERT INTO `object_info` VALUES (35, 14, 'UNO桌游纸牌', 'UNO桌游纸牌带惩罚优诺牌乌诺牌游戏牌.', '999e8c5afc045d88db3e7bab78827685.jpg', '2023-3-12 20:7:7', 2, NULL, 'exchangeed');
INSERT INTO `object_info` VALUES (36, 14, '大领主', '大领主 城市之主  领土 桌游卡牌  合集 diy\n玩过一次，没内衬，闲置出之，盒控绕道。', '2ce1ebda484364c277926fb98801bdbe.jpg', '2023-3-12 20:7:58', 2, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (37, 14, '谁是卧底豪华版', '谁是卧底豪华版，成人休闲聚会桌游卡牌多人桌游。', '39e1fbaba44aa8b367e52a0141b065ba.jpg', '2023-3-12 20:8:24', NULL, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (38, 14, '假面骑士revice', '假面骑士revice shf revi利维shf\n  改造成品。肩甲布条链接，独立胸甲，头灯效果一般。瑕疵如图。全配无损。', '6c5de27b80a3efd0701bf836f96eb5a8.jpg', '2023-3-12 20:8:48', 2, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (39, 14, '金属模型旅游车', '金属模型旅游车。', 'e16d6c64e6ec2b562e93435c2e9d3d87.jpg', '2023-3-12 20:9:4', 1, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (40, 14, '高达万代mg', '高达万代mg尸装成品盒子说明书啥的都在\n感兴趣的话点“我想要”和我私聊吧～', 'ab9fc615d2329f8d6abad67618e28bb8.jpg', '2023-3-12 20:9:22', NULL, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (41, 15, '中国邮票中国民居邮票大全套', '中国邮票中国民居邮票大全套，中国人民邮政八六至九一年发行的全部21枚民居邮票。', 'c2a513bc5a17c96cab962a08daf812b7.jpg', '2023-3-12 20:25:5', 5, 0, 'inexchange');
INSERT INTO `object_info` VALUES (42, 15, '印花双面绢布原神周边', '原神同款扇子神里绫华cos游戏动漫凌华联名印花双面绢布原神周边.', 'd59b8980a8d121b2f79dfb0bd750a672.jpg', '2023-3-12 20:33:14', 2, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (43, 15, '镇魂剧版碟', '镇魂 剧版碟 全齐', '8bd0a630977719464dbc3a9fdb8be833.jpg', '2023-3-12 20:33:35', NULL, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (44, 15, '漫长的告别', '漫长的告别 文学名著读客经典（插图珍藏版）。', '76039fb9b1ebcd5520c893c3f784be34.jpg', '2023-3-12 20:34:18', NULL, NULL, 'unexchange');
INSERT INTO `object_info` VALUES (46, 15, '铃兰车挂', '铃兰车挂，还没配上蕾丝蝴蝶结和绑带，需要可配，手工制作，默认微瑕。', '336f03d11e53a7ce5e19c4000ce95e26.jpg', '2023-3-12 20:35:4', 1, NULL, 'exchangeed');

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
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of object_likes
-- ----------------------------
INSERT INTO `object_likes` VALUES (1, 14, 23, 'yes');
INSERT INTO `object_likes` VALUES (2, 13, 12, 'yes');
INSERT INTO `object_likes` VALUES (3, 15, 12, 'yes');
INSERT INTO `object_likes` VALUES (4, 15, 13, 'no');
INSERT INTO `object_likes` VALUES (5, 15, 14, 'yes');
INSERT INTO `object_likes` VALUES (6, 15, 27, 'yes');
INSERT INTO `object_likes` VALUES (7, 13, 25, 'no');
INSERT INTO `object_likes` VALUES (8, 13, 26, 'no');
INSERT INTO `object_likes` VALUES (9, 15, 26, 'no');
INSERT INTO `object_likes` VALUES (10, 15, 15, 'no');
INSERT INTO `object_likes` VALUES (11, 13, 17, 'no');
INSERT INTO `object_likes` VALUES (12, 13, 18, 'no');
INSERT INTO `object_likes` VALUES (13, 13, 22, 'no');
INSERT INTO `object_likes` VALUES (14, 13, 23, 'yes');
INSERT INTO `object_likes` VALUES (15, 14, 13, 'no');
INSERT INTO `object_likes` VALUES (16, 13, 28, 'no');
INSERT INTO `object_likes` VALUES (17, 13, 29, 'yes');
INSERT INTO `object_likes` VALUES (18, 13, 31, 'yes');
INSERT INTO `object_likes` VALUES (19, 13, 30, 'yes');
INSERT INTO `object_likes` VALUES (20, 13, 33, 'no');
INSERT INTO `object_likes` VALUES (21, 13, 35, 'no');
INSERT INTO `object_likes` VALUES (22, 13, 38, 'no');
INSERT INTO `object_likes` VALUES (23, 13, 42, 'no');
INSERT INTO `object_likes` VALUES (24, 13, 41, 'no');
INSERT INTO `object_likes` VALUES (25, 14, 30, 'no');
INSERT INTO `object_likes` VALUES (26, 13, 34, 'yes');
INSERT INTO `object_likes` VALUES (27, 13, 32, 'yes');
INSERT INTO `object_likes` VALUES (28, 13, 36, 'no');
INSERT INTO `object_likes` VALUES (29, 13, 46, 'no');
INSERT INTO `object_likes` VALUES (30, 15, 36, 'no');
INSERT INTO `object_likes` VALUES (31, 15, 29, 'no');

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
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ship_to_address
-- ----------------------------
INSERT INTO `ship_to_address` VALUES (2, 13, '王洪彬', '江西省 新余市 分宜县 ', '朝阳路尚阳一品', '0000', '13755582645', 'no');
INSERT INTO `ship_to_address` VALUES (14, 13, '彬2', '江西省 新余市 分宜县 ', '安仁路127号江西省分宜中学', '0000', '212144124', 'yes');
INSERT INTO `ship_to_address` VALUES (15, 14, '淡蓝色', '江西省 九江市 浔阳区 ', '九江学院', '0000', '14655457323', 'yes');
INSERT INTO `ship_to_address` VALUES (16, 15, '黑羽', '北京市 市辖区 西城区 ', '测试地区', '0000', '13755582645', 'yes');

-- ----------------------------
-- Table structure for user_complains
-- ----------------------------
DROP TABLE IF EXISTS `user_complains`;
CREATE TABLE `user_complains`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `complainant` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '投诉者',
  `defendant` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '被告人',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '投诉内容',
  `date` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '投诉时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_complains
-- ----------------------------
INSERT INTO `user_complains` VALUES (4, '淡蓝色', '546453234', '举报功能测试1', '2023-3-14 15:12:1');
INSERT INTO `user_complains` VALUES (5, '淡蓝色', '黑羽', '举报功能测试信息2', '2023-3-14 15:12:15');
INSERT INTO `user_complains` VALUES (6, '546453234', '淡蓝色', '举报功能测试信息3\n', '2023-3-14 15:12:52');
INSERT INTO `user_complains` VALUES (7, '546453234', '黑羽', '举报功能测试信息4', '2023-3-14 15:13:7');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `userID` int(11) NOT NULL COMMENT '用户id',
  `petName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '昵称',
  `gender` enum('男','女') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '性别',
  `birthday` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生日',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '电话',
  `mailbox` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `avatarPath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像路径',
  `status` enum('admin','ban','user','') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'user' COMMENT '用户身份',
  PRIMARY KEY (`userID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (13, '淡蓝色', '男', '2000-06-01', '122322322', '1876252223@qq.com', '8f2e49665879cf43bd78cdb6011656c7.jpg', 'user');
INSERT INTO `user_info` VALUES (14, '546453234', '女', '2024-01-23', '16584347251', '2901589805@qq.com', '8c35096e36bcda8530d2f1c19dadb5bd.jpg', 'user');
INSERT INTO `user_info` VALUES (15, '黑羽2', '女', '2001-04-17', NULL, NULL, '5ce2883e6e7781eb76cd9a1be3325a0a.jpg', 'user');
INSERT INTO `user_info` VALUES (16, 'admin', NULL, NULL, NULL, NULL, NULL, 'admin');
INSERT INTO `user_info` VALUES (17, '354883468', NULL, NULL, NULL, NULL, NULL, 'user');
INSERT INTO `user_info` VALUES (18, '3432424', NULL, NULL, NULL, NULL, NULL, 'user');
INSERT INTO `user_info` VALUES (19, '1212332432', NULL, NULL, NULL, NULL, NULL, 'user');

-- ----------------------------
-- Table structure for user_name_password
-- ----------------------------
DROP TABLE IF EXISTS `user_name_password`;
CREATE TABLE `user_name_password`  (
  `userID` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `userName` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '账号',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '123456' COMMENT '密码',
  `code` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册验证码',
  `isLive` enum('yes','no') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '验证是否已经注册',
  PRIMARY KEY (`userID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_name_password
-- ----------------------------
INSERT INTO `user_name_password` VALUES (13, '153434333', '12353423', '7409', 'yes');
INSERT INTO `user_name_password` VALUES (14, '546453234', '1156745643', '0510', 'yes');
INSERT INTO `user_name_password` VALUES (15, '6574543534', '4342342', '3848', 'yes');
INSERT INTO `user_name_password` VALUES (16, 'admin', '123456', NULL, 'yes');
INSERT INTO `user_name_password` VALUES (17, '354883468', '1154077274', '1252', 'yes');
INSERT INTO `user_name_password` VALUES (18, '3432424', '564534324', '7245', 'yes');
INSERT INTO `user_name_password` VALUES (19, '1212332432', '234324232', '3859', 'yes');

SET FOREIGN_KEY_CHECKS = 1;
