/*
 Navicat Premium Dump SQL

 Source Server         : himate
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : himate

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 17/12/2025 16:17:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for app_package
-- ----------------------------
DROP TABLE IF EXISTS `app_package`;
CREATE TABLE `app_package`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'app包自增id',
  `app_name` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '应用包名称',
  `app_version` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '应用版本',
  `app_description` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '应用描述',
  `file_id` int(11) NOT NULL COMMENT '文件id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_31e1b6091badec319f45979c7e`(`file_id`) USING BTREE,
  INDEX `idx_app_package_app_name`(`app_name`) USING BTREE,
  INDEX `idx_app_package_delete_time`(`delete_time`) USING BTREE,
  CONSTRAINT `FK_31e1b6091badec319f45979c7e9` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `favorites_uid` int(11) NOT NULL COMMENT '收藏夹用户id',
  `favorites_remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '收藏夹描述',
  `favorites_name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收藏夹名',
  `favorites_cover` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '收藏夹封面',
  `is_public` enum('yes','no') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no' COMMENT '是否公开',
  `is_default` enum('yes','no') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no' COMMENT '是否是默认收藏夹',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_favorites_id_uid`(`id`, `favorites_uid`) USING BTREE,
  INDEX `idx_favorites_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_favorites_uid`(`favorites_uid`) USING BTREE,
  CONSTRAINT `FK_62d185ad35ffbdcbcbfbae63422` FOREIGN KEY (`favorites_uid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for favorites_music
-- ----------------------------
DROP TABLE IF EXISTS `favorites_music`;
CREATE TABLE `favorites_music`  (
  `favoritesId` int(11) NOT NULL,
  `musicId` int(11) NOT NULL,
  PRIMARY KEY (`favoritesId`, `musicId`) USING BTREE,
  INDEX `IDX_bf387a03fc90b7e28f6d8f1c91`(`favoritesId`) USING BTREE,
  INDEX `IDX_d5a78d4c02618deda256823a36`(`musicId`) USING BTREE,
  CONSTRAINT `FK_bf387a03fc90b7e28f6d8f1c91b` FOREIGN KEY (`favoritesId`) REFERENCES `favorites` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d5a78d4c02618deda256823a36a` FOREIGN KEY (`musicId`) REFERENCES `music` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `original_file_name` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '原始文件名',
  `file_type` enum('image','video','audio','document','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other' COMMENT '文件类型',
  `use_type` enum('user','chat','group','system','music','upload','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown' COMMENT '使用类型',
  `file_hash` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件hash',
  `file_key` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件key',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NULL DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_file_file_key_unique`(`file_key`) USING BTREE,
  INDEX `idx_file_delete_time`(`delete_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 495 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群组自增id',
  `group_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '群组uuid',
  `group_name` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群组名称',
  `group_avatar` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群组头像',
  `group_introduce` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '群组简介',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_group_group_id_unique`(`group_id`) USING BTREE,
  INDEX `idx_group_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_group_id_name_avatar`(`group_id`, `group_name`, `group_avatar`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for group_member
-- ----------------------------
DROP TABLE IF EXISTS `group_member`;
CREATE TABLE `group_member`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群成员表自增id',
  `group_primary_id` int(11) NOT NULL COMMENT '关联群组id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `member_remarks` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '群成员备注',
  `member_role` enum('admin','owner','member') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member' COMMENT '群成员权限',
  `member_status` enum('forbidden','normal') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '群成员状态',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NULL DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `group_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '群组uuid',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_group_member_user_id`(`user_id`) USING BTREE,
  INDEX `idx_group_member_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_group_member_group_primary_id`(`group_primary_id`) USING BTREE,
  INDEX `idx_group_member_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `FK_21b27dcc328bcca3badd43f20d3` FOREIGN KEY (`group_primary_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_b2bc36d5183cc323a0223f9114c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for mate
-- ----------------------------
DROP TABLE IF EXISTS `mate`;
CREATE TABLE `mate`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '好友自增id',
  `mate_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '好友uuid',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `user_remarks` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '好友对用户的备注',
  `friend_id` int(11) NOT NULL COMMENT '好友id',
  `friend_remarks` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户对好友的备注',
  `mate_status` enum('agreed','waiting','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting' COMMENT '好友状态',
  `validate_msg` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '验证消息',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_mate_mate_id_unique`(`mate_id`) USING BTREE,
  INDEX `idx_mate_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_mate_id_friend`(`mate_id`, `friend_id`) USING BTREE,
  INDEX `idx_mate_id_user`(`mate_id`, `user_id`) USING BTREE,
  INDEX `idx_mate_friend_id`(`friend_id`, `mate_status`) USING BTREE,
  INDEX `idx_mate_user_id`(`user_id`, `mate_status`) USING BTREE,
  CONSTRAINT `FK_04ca79fd4d51e4768b69e02b69e` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_f3ee402c9e06ebc94819c267740` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '消息自增id',
  `session_primary_id` int(11) NOT NULL COMMENT '关联会话id',
  `sender_id` int(11) NOT NULL COMMENT '发送方id',
  `sender_ip` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发送方ip',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息内容',
  `msg_type` enum('text','image','video','audio','file','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息类型',
  `msg_secret` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '消息密钥',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `client_msg_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '客户端消息id',
  `is_system` tinyint(4) NOT NULL DEFAULT 0 COMMENT '是否系统消息',
  `reminders` json NULL COMMENT '要提醒的用户',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_message_client_msg_id`(`client_msg_id`) USING BTREE,
  INDEX `idx_message_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_message_session_primary_id`(`session_primary_id`) USING BTREE,
  INDEX `idx_message_sender_id`(`sender_id`) USING BTREE,
  CONSTRAINT `FK_2876aa1d0e759a09518c9a5fe04` FOREIGN KEY (`session_primary_id`) REFERENCES `session` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_c0ab99d9dfc61172871277b52f6` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 445 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for message_read_records
-- ----------------------------
DROP TABLE IF EXISTS `message_read_records`;
CREATE TABLE `message_read_records`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '消息读取记录自增id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `message_id` int(11) NOT NULL COMMENT '消息id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_message_read_records_user_id`(`user_id`, `message_id`) USING BTREE,
  INDEX `idx_message_read_records_delete_time`(`delete_time`) USING BTREE,
  INDEX `FK_22406d18594be2e14e875d15468`(`message_id`) USING BTREE,
  CONSTRAINT `FK_22406d18594be2e14e875d15468` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 780 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for music
-- ----------------------------
DROP TABLE IF EXISTS `music`;
CREATE TABLE `music`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '音乐自增id',
  `sample_rate` int(11) NULL DEFAULT NULL COMMENT '采样率',
  `bitrate` int(11) NULL DEFAULT NULL COMMENT '比特率',
  `duration` int(11) NULL DEFAULT NULL COMMENT '音乐时长',
  `artists` json NULL COMMENT '音乐艺术家集合',
  `file_key` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件key',
  `title` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '音乐名称',
  `artist` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '音乐艺术家',
  `album` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '专辑名',
  `music_extra_id` int(11) NULL DEFAULT NULL COMMENT '音乐额外信息id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_9caa32852678272ee2ef6ac8f6`(`music_extra_id`) USING BTREE,
  INDEX `idx_music_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_music_id_extra_id`(`id`, `music_extra_id`) USING BTREE,
  CONSTRAINT `FK_9caa32852678272ee2ef6ac8f64` FOREIGN KEY (`music_extra_id`) REFERENCES `music_extra` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for music_extra
-- ----------------------------
DROP TABLE IF EXISTS `music_extra`;
CREATE TABLE `music_extra`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '音乐扩展信息自增id',
  `music_id` int(11) NOT NULL COMMENT '音乐id',
  `match_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '第三方音乐id',
  `music_cover` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '音乐封面',
  `music_lyric` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '标准歌词',
  `music_trans` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '翻译歌词',
  `music_yrc` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '逐字歌词',
  `music_roma` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '音译歌词',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_134f584b2e79d703b9ec98b0e4`(`music_id`) USING BTREE,
  INDEX `idx_music_extra_delete_time`(`delete_time`) USING BTREE,
  CONSTRAINT `FK_134f584b2e79d703b9ec98b0e40` FOREIGN KEY (`music_id`) REFERENCES `music` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '会话自增id',
  `session_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '会话uuid',
  `last_msg_id` int(11) NULL DEFAULT NULL COMMENT '最后一条消息的id',
  `chat_type` enum('private','group') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '会话类型',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `mate_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '好友uuid',
  `group_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群组uuid',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_c16339507971a12fd08d5729ce`(`last_msg_id`) USING BTREE,
  INDEX `idx_session_session_id`(`session_id`) USING BTREE,
  INDEX `idx_session_last_msg_id`(`last_msg_id`) USING BTREE,
  INDEX `idx_session_chat_type`(`chat_type`) USING BTREE,
  INDEX `idx_session_update_time`(`update_time`) USING BTREE,
  INDEX `idx_session_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_session_mate_id`(`mate_id`) USING BTREE,
  INDEX `idx_session_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `FK_2a3824904f6e1c2a81fb4e073dc` FOREIGN KEY (`mate_id`) REFERENCES `mate` (`mate_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_6f0d9bf5bd78eeb8f7784a93bad` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_c16339507971a12fd08d5729ce1` FOREIGN KEY (`last_msg_id`) REFERENCES `message` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_name` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '普通用户' COMMENT '用户名',
  `user_avatar` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户头像',
  `sex` enum('man','woman','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown' COMMENT '性别',
  `birthday` timestamp NULL DEFAULT NULL COMMENT '生日',
  `age` tinyint(4) NOT NULL DEFAULT 0 COMMENT '年龄',
  `account` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `self_account` varchar(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '自定义账号',
  `user_role` enum('default','admin','vip') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default' COMMENT '用户权限',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `user_status` enum('enabled','disabled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enabled' COMMENT '用户状态(enabled:正常 disabled:禁用)',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) NOT NULL COMMENT '修改者id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `user_bg_img` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户背景图',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_delete_time`(`delete_time`) USING BTREE,
  INDEX `idx_user_id_user_name_avatar`(`id`, `user_name`, `user_avatar`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
