-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.7.26 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 导出 himate 的数据库结构
CREATE DATABASE IF NOT EXISTS `himate` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `himate`;

-- 导出  表 himate.app 结构
CREATE TABLE IF NOT EXISTS `app` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'app自增id',
  `app_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用名称',
  `app_version` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用版本',
  `app_description` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用描述',
  `app_size` int(11) NOT NULL COMMENT '应用大小',
  `app_fileName` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用文件名',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.app_package 结构
CREATE TABLE IF NOT EXISTS `app_package` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'app包自增id',
  `app_description` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用描述',
  `app_size` int(11) NOT NULL COMMENT '应用大小',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `app_name` varchar(16) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用包名称',
  `app_version` varchar(8) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用版本',
  `app_fileName` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用文件名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.chat 结构
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '聊天自增id',
  `msgdata` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息内容',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `send_uid` int(11) NOT NULL COMMENT '发送方id',
  `sessionId` int(11) DEFAULT NULL COMMENT '会话自增id',
  `send_ip` varchar(48) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '发送方ip',
  `msg_secret` varchar(96) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '消息密钥',
  `chat_type` enum('personal','group') COLLATE utf8_unicode_ci NOT NULL COMMENT '会话类型',
  `msg_type` enum('text','image','video','audio','other') COLLATE utf8_unicode_ci NOT NULL COMMENT '消息类型',
  `msg_status` enum('read','unread') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unread' COMMENT '消息状态',
  `clientMsg_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '客户端消息id',
  `session_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '关联生成的会话id',
  PRIMARY KEY (`id`),
  KEY `IDX_9017c2ee500cd1ba895752a0aa` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.favorites 结构
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `creator_uid` int(11) NOT NULL COMMENT '创建者id',
  `creator_name` varchar(48) COLLATE utf8_unicode_ci NOT NULL COMMENT '创建者昵称',
  `creator_avatar` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '创建者头像',
  `favorites_cover` varchar(96) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'default_favorites_cover.jpg' COMMENT '收藏夹封面',
  `favorites_remark` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '收藏夹描述',
  `is_default` enum('1','0') COLLATE utf8_unicode_ci NOT NULL DEFAULT '0' COMMENT '是否是默认收藏夹(0:否, 1:是)',
  `is_public` enum('1','0') COLLATE utf8_unicode_ci NOT NULL DEFAULT '0' COMMENT '是否公开(0:私密, 1:公开)',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `favorites_name` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '收藏夹名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.favorites_music_music 结构
CREATE TABLE IF NOT EXISTS `favorites_music_music` (
  `favoritesId` int(11) NOT NULL,
  `musicId` int(11) NOT NULL,
  PRIMARY KEY (`favoritesId`,`musicId`),
  KEY `IDX_e95aebb2d11a7d7f80ef682844` (`favoritesId`),
  KEY `IDX_a3f48ccb91186bec398c218983` (`musicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.file 结构
CREATE TABLE IF NOT EXISTS `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `file_size` int(11) NOT NULL COMMENT '文件大小',
  `upload_uid` int(11) NOT NULL COMMENT '上传者id',
  `file_type` enum('text','image','video','audio','other') COLLATE utf8_unicode_ci NOT NULL COMMENT '文件类型',
  `use_type` enum('user','chat','group','system','music','upload','unknown') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unknown' COMMENT '使用类型',
  `file_name` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '文件名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.group 结构
CREATE TABLE IF NOT EXISTS `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群组自增id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `creator_uid` int(11) NOT NULL COMMENT '群组所属用户id',
  `group_name` varchar(48) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '群组名称',
  `group_avatar` varchar(96) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'default_group_avatar.jpg' COMMENT '群组头像',
  `group_status` enum('forbidden','normal') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '群状态',
  `group_introduce` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '群组简介',
  `group_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '群组uuid',
  PRIMARY KEY (`id`),
  KEY `IDX_7a17850f39a0b7ee48fa586b2f` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.group_member 结构
CREATE TABLE IF NOT EXISTS `group_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群成员表自增id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `groupId` int(11) DEFAULT NULL COMMENT '群组自增id',
  `member_uid` int(11) NOT NULL COMMENT '群成员用户id',
  `member_avatar` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '群成员头像',
  `member_remark` varchar(48) COLLATE utf8_unicode_ci NOT NULL COMMENT '群成员备注',
  `member_role` enum('admin','owner','member') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'member' COMMENT '群成员权限',
  `member_status` enum('forbidden','normal') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '群成员状态',
  `group_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '关联群组id',
  PRIMARY KEY (`id`),
  KEY `IDX_8264f490704d49a234f9b10d45` (`member_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.mate 结构
CREATE TABLE IF NOT EXISTS `mate` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '好友自增id',
  `apply_uid` int(11) NOT NULL COMMENT '申请用户id',
  `agree_uid` int(11) NOT NULL COMMENT '同意用户id',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `mate_status` enum('agreed','waiting','refused') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'waiting' COMMENT '好友状态',
  `apply_remark` varchar(48) COLLATE utf8_unicode_ci NOT NULL COMMENT '同意者给申请人的备注',
  `apply_avatar` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '申请人头像',
  `agree_remark` varchar(48) COLLATE utf8_unicode_ci NOT NULL COMMENT '申请人给同意者的备注',
  `agree_avatar` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '同意者头像',
  `validate_msg` varchar(96) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '验证消息',
  `mate_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '随机好友id',
  PRIMARY KEY (`id`),
  KEY `IDX_f796fc866ca968e9032ddfce3d` (`mate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.music 结构
CREATE TABLE IF NOT EXISTS `music` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `file_size` int(11) NOT NULL COMMENT '文件大小',
  `upload_uid` int(11) NOT NULL COMMENT '上传者id',
  `file_name` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '文件名',
  `artists` json DEFAULT NULL COMMENT '音乐艺术家数组',
  `sampleRate` int(11) DEFAULT NULL COMMENT '采样率',
  `bitrate` int(11) DEFAULT NULL COMMENT '比特率',
  `duration` int(11) DEFAULT NULL COMMENT '音乐时长',
  `title` varchar(96) COLLATE utf8_unicode_ci NOT NULL COMMENT '音乐名称',
  `artist` varchar(48) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '音乐艺术家',
  `album` varchar(48) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '专辑名',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.query-result-cache 结构
CREATE TABLE IF NOT EXISTS `query-result-cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `duration` int(11) NOT NULL,
  `query` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `result` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.session 结构
CREATE TABLE IF NOT EXISTS `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '会话自增id',
  `last_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '最后一条消息',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `last_msgId` int(11) DEFAULT NULL COMMENT '最后一条消息的id',
  `last_msgUid` int(11) DEFAULT NULL COMMENT '发送最后一条消息用户的id',
  `unread_count` int(11) NOT NULL DEFAULT '0' COMMENT '会话未读数',
  `creator_uid` int(11) NOT NULL COMMENT '创建者id',
  `mateId` int(11) DEFAULT NULL COMMENT '好友自增id',
  `groupId` int(11) DEFAULT NULL COMMENT '群组自增id',
  `device_id` varchar(48) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户设备唯一id',
  `last_msgSecret` varchar(96) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '最后一条消息的秘钥',
  `last_msgType` enum('text','image','video','audio','other') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'text' COMMENT '最后的消息类型',
  `chat_type` enum('personal','group') COLLATE utf8_unicode_ci NOT NULL COMMENT '会话类型',
  `session_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '会话id(好友id或群组id)',
  PRIMARY KEY (`id`),
  KEY `IDX_8ba62b11184a8d3312278d4d1a` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `birthday` timestamp NULL DEFAULT NULL COMMENT '生日',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `password` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户密码',
  `user_name` varchar(48) COLLATE utf8_unicode_ci NOT NULL DEFAULT '普通用户' COMMENT '用户名',
  `user_avatar` varchar(96) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'default_user_avatar.jpg' COMMENT '用户头像',
  `sex` enum('man','woman','unknown') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unknown' COMMENT '性别',
  `age` tinyint(4) DEFAULT NULL COMMENT '年龄',
  `account` varchar(48) COLLATE utf8_unicode_ci NOT NULL COMMENT '账号',
  `self_account` varchar(48) COLLATE utf8_unicode_ci NOT NULL COMMENT '自定义账号',
  `user_role` enum('default','admin','vip') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'default' COMMENT '用户权限',
  `user_status` enum('1','0') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1' COMMENT '用户状态(1:正常 0:禁用)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- 数据导出被取消选择。

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
