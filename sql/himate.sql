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

-- 导出  表 himate.app_package 结构
CREATE TABLE IF NOT EXISTS `app_package` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'app包自增id',
  `app_size` int(11) NOT NULL COMMENT '应用大小',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `app_name` varchar(48) NOT NULL COMMENT '应用包名称',
  `app_version` varchar(16) NOT NULL COMMENT '应用版本',
  `app_description` varchar(240) NOT NULL COMMENT '应用描述',
  `app_fileName` varchar(120) NOT NULL COMMENT '应用文件名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.chat 结构
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '聊天自增id',
  `clientMsg_id` varchar(36) NOT NULL COMMENT '客户端消息id',
  `session_id` varchar(36) NOT NULL COMMENT '关联生成的会话id',
  `send_uid` int(11) NOT NULL COMMENT '发送方id',
  `send_ip` varchar(48) DEFAULT NULL COMMENT '发送方ip',
  `msgdata` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息内容',
  `chat_type` enum('personal','group') NOT NULL COMMENT '会话类型',
  `msg_type` enum('text','image','video','audio','other') NOT NULL COMMENT '消息类型',
  `msg_status` enum('read','unread') NOT NULL DEFAULT 'unread' COMMENT '消息状态',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `sessionId` int(11) DEFAULT NULL COMMENT '会话自增id',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `msg_secret` varchar(120) DEFAULT NULL COMMENT '消息密钥',
  PRIMARY KEY (`id`),
  KEY `IDX_9017c2ee500cd1ba895752a0aa` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=305 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.favorites 结构
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `creator_uid` int(11) NOT NULL COMMENT '群组所属用户id',
  `creator_name` varchar(48) NOT NULL COMMENT '创建者昵称',
  `favorites_remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '收藏夹描述',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `creator_avatar` varchar(120) NOT NULL COMMENT '创建者头像',
  `favorites_name` varchar(120) NOT NULL COMMENT '收藏夹名',
  `favorites_cover` varchar(120) NOT NULL DEFAULT 'default_assets/default_favorites_cover.jpg' COMMENT '收藏夹封面',
  `is_public` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否公开(0:私密, 1:公开)',
  `is_default` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否是默认收藏夹(0:否, 1:是)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.favorites_music_music 结构
CREATE TABLE IF NOT EXISTS `favorites_music_music` (
  `favoritesId` int(11) NOT NULL,
  `musicId` int(11) NOT NULL,
  PRIMARY KEY (`favoritesId`,`musicId`),
  KEY `IDX_e95aebb2d11a7d7f80ef682844` (`favoritesId`),
  KEY `IDX_a3f48ccb91186bec398c218983` (`musicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.file 结构
CREATE TABLE IF NOT EXISTS `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件自增id',
  `file_type` enum('text','image','video','audio','other') NOT NULL COMMENT '文件类型',
  `use_type` enum('user','chat','group','system','music','upload','unknown') NOT NULL DEFAULT 'unknown' COMMENT '使用类型',
  `file_hash` varchar(64) NOT NULL COMMENT '文件hash',
  `upload_uid` int(11) NOT NULL COMMENT '上传者id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `file_name` varchar(120) NOT NULL COMMENT '文件名',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cd3d24adc04a5519083a7f82b4` (`file_name`),
  KEY `IDX_712c210b0916548c6ff723fc04` (`file_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=9911 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.group 结构
CREATE TABLE IF NOT EXISTS `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群组自增id',
  `group_id` varchar(36) NOT NULL COMMENT '群组uuid',
  `creator_uid` int(11) NOT NULL COMMENT '群组所属用户id',
  `group_name` varchar(48) DEFAULT NULL COMMENT '群组名称',
  `group_status` enum('forbidden','normal') NOT NULL DEFAULT 'normal' COMMENT '群状态',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `group_avatar` varchar(120) NOT NULL DEFAULT 'default_assets/default_group_avatar.jpg' COMMENT '群组头像',
  `group_introduce` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '群组简介',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7a17850f39a0b7ee48fa586b2f` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.group_member 结构
CREATE TABLE IF NOT EXISTS `group_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群成员表自增id',
  `group_id` varchar(36) NOT NULL COMMENT '关联群组id',
  `member_uid` int(11) NOT NULL COMMENT '群成员用户id',
  `member_remark` varchar(48) NOT NULL COMMENT '群成员备注',
  `member_role` enum('admin','owner','member') NOT NULL DEFAULT 'member' COMMENT '群成员权限',
  `member_status` enum('forbidden','normal') NOT NULL DEFAULT 'normal' COMMENT '群成员状态',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `groupId` int(11) DEFAULT NULL COMMENT '群组自增id',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `member_avatar` varchar(120) NOT NULL COMMENT '群成员头像',
  PRIMARY KEY (`id`),
  KEY `IDX_e200cd6ff3e3903c5be5ae1400` (`group_id`),
  KEY `IDX_8264f490704d49a234f9b10d45` (`member_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.group_test 结构
CREATE TABLE IF NOT EXISTS `group_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群组自增id',
  `creator_uid` int(11) NOT NULL COMMENT '群组所属用户id',
  `group_introduce` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '群组简介',
  `group_status` enum('forbidden','normal') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '群状态',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `group_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '群组uuid',
  `group_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '群组名称',
  `group_avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default_assets/default_group_avatar.jpg' COMMENT '群组头像',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_982944f1e6772a7b738b4e036d` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据导出被取消选择。

-- 导出  表 himate.mate 结构
CREATE TABLE IF NOT EXISTS `mate` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '好友自增id',
  `mate_id` varchar(36) NOT NULL COMMENT '随机好友id',
  `apply_uid` int(11) NOT NULL COMMENT '申请用户id',
  `apply_remark` varchar(48) NOT NULL COMMENT '同意者给申请人的备注',
  `agree_uid` int(11) NOT NULL COMMENT '同意用户id',
  `agree_remark` varchar(48) NOT NULL COMMENT '申请人给同意者的备注',
  `mate_status` enum('agreed','waiting','refused') NOT NULL DEFAULT 'waiting' COMMENT '好友状态',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `apply_avatar` varchar(120) NOT NULL COMMENT '申请人头像',
  `agree_avatar` varchar(120) NOT NULL COMMENT '同意者头像',
  `validate_msg` varchar(240) DEFAULT NULL COMMENT '验证消息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f796fc866ca968e9032ddfce3d` (`mate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.music 结构
CREATE TABLE IF NOT EXISTS `music` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '音乐自增id',
  `upload_uid` int(11) NOT NULL COMMENT '上传者id',
  `sampleRate` int(11) DEFAULT NULL COMMENT '采样率',
  `bitrate` int(11) DEFAULT NULL COMMENT '比特率',
  `duration` int(11) DEFAULT NULL COMMENT '音乐时长',
  `artists` json DEFAULT NULL COMMENT '音乐艺术家集合',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `musicMoreId` int(11) DEFAULT NULL COMMENT '音乐扩展信息自增id',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `file_name` varchar(120) NOT NULL COMMENT '文件名',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小',
  `title` varchar(120) NOT NULL COMMENT '音乐名称',
  `artist` varchar(120) DEFAULT NULL COMMENT '音乐艺术家',
  `album` varchar(120) DEFAULT NULL COMMENT '专辑名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5268 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.music_more 结构
CREATE TABLE IF NOT EXISTS `music_more` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '音乐扩展信息自增id',
  `music_id` int(11) NOT NULL COMMENT '本地音乐id',
  `match_id` varchar(16) NOT NULL COMMENT '匹配第三方音乐id',
  `music_lyric` mediumtext COMMENT '标准歌词',
  `music_trans` mediumtext COMMENT '翻译歌词',
  `music_yrc` mediumtext COMMENT '逐字歌词',
  `music_roma` mediumtext COMMENT '音译歌词',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `music_name` varchar(120) NOT NULL COMMENT '音乐名称',
  `music_singer` varchar(120) NOT NULL COMMENT '音乐作者',
  `music_album` varchar(120) NOT NULL COMMENT '专辑名',
  `music_cover` varchar(120) NOT NULL COMMENT '音乐封面',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a2da14b28beeec9f99432ea17a` (`music_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5184 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.session 结构
CREATE TABLE IF NOT EXISTS `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '会话自增id',
  `session_id` varchar(36) NOT NULL COMMENT '会话id(好友id或群组id)',
  `device_id` varchar(48) DEFAULT NULL COMMENT '用户设备唯一id',
  `creator_uid` int(11) NOT NULL COMMENT '创建者id',
  `last_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '最后一条消息',
  `last_msgId` int(11) DEFAULT NULL COMMENT '最后一条消息的id',
  `last_msgUid` int(11) DEFAULT NULL COMMENT '发送最后一条消息用户的id',
  `last_msgType` enum('text','image','video','audio','other') NOT NULL DEFAULT 'text' COMMENT '最后的消息类型',
  `chat_type` enum('personal','group') NOT NULL COMMENT '会话类型',
  `unread_count` int(11) NOT NULL DEFAULT '0' COMMENT '会话未读数',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `mateId` int(11) DEFAULT NULL COMMENT '好友自增id',
  `groupId` int(11) DEFAULT NULL COMMENT '群组自增id',
  `create_by` int(11) NOT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `last_msgSecret` varchar(120) DEFAULT NULL COMMENT '最后一条消息的秘钥',
  PRIMARY KEY (`id`),
  KEY `IDX_8ba62b11184a8d3312278d4d1a` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

-- 导出  表 himate.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_name` varchar(48) NOT NULL DEFAULT '普通用户' COMMENT '用户名',
  `user_avatar` varchar(120) NOT NULL DEFAULT 'default_assets/default_user_avatar.jpg' COMMENT '用户头像',
  `sex` enum('man','woman','unknown') NOT NULL DEFAULT 'unknown' COMMENT '性别',
  `birthday` timestamp NULL DEFAULT NULL COMMENT '生日',
  `age` tinyint(4) DEFAULT NULL COMMENT '年龄',
  `account` varchar(48) NOT NULL COMMENT '账号',
  `self_account` varchar(48) NOT NULL COMMENT '自定义账号',
  `user_role` enum('default','admin','vip') NOT NULL DEFAULT 'default' COMMENT '用户权限',
  `password` varchar(64) NOT NULL COMMENT '用户密码',
  `user_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '用户状态(1:正常 0:禁用)',
  `create_by` int(11) DEFAULT NULL COMMENT '创建者id',
  `update_by` int(11) DEFAULT NULL COMMENT '修改者id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
