CREATE TABLE users (
    user_id int PRIMARY KEY AUTO_INCREMENT,
    about varchar(511),
    education varchar(255),
    occupation varchar(255),
    durables_used varchar(511),
	mobile_no varchar(25),
	created_at TIMESTAMP default now()
);

create table apps_m (
	app_id int PRIMARY KEY AUTO_INCREMENT,
    app_name varchar(255),
	description text,
	category_id int,
	packageName varchar(255),
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(25) default 'active'
);

create table app_category_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    category_name varchar(255),
	description text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
);


-- create table data_patterns_m (
-- 	id int PRIMARY KEY AUTO_INCREMENT,
--     app_id int,
-- 	name varchar(255),
-- 	description text,
-- 	eventInfo varchar(511),
--     created_at TIMESTAMP default now(),
-- 	created_by int default 1,
-- 	modified_at TIMESTAMP,
-- 	modified_by int,
-- 	status varchar(10) default 'active'
-- );


create table event_info_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    app_id int,
	event_info varchar(511),
    name text,
	description text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
);


create table data_patterns_m (
	id int PRIMARY KEY AUTO_INCREMENT,
    app_id int,
	name varchar(255),
	description text,
	event_info varchar(511),
    prefix text,
    suffix text,
    data text,
    created_at TIMESTAMP default now(),
	created_by int default 1,
	modified_at TIMESTAMP,
	modified_by int,
	status varchar(10) default 'active'
);

create table usage_stats (
	id int PRIMARY KEY AUTO_INCREMENT,
	data_transaction_id int,
	user_id int,
	device_id varchar(127),
	google_ad_id varchar(127),
	telecom varchar(127),
	phone_brand varchar(127),
	model_name varchar(127),
	apps_usage varchar(5000),
	event_time TIMESTAMP,
	created_at TIMESTAMP default now()
);

create table ott_data (
	id int PRIMARY KEY AUTO_INCREMENT,
	data_event_id int,
    user_id int,
    app_name varchar(50),
    tag varchar(255),
	data text,
    event_time TIMESTAMP,
    created_at TIMESTAMP default now()
);

create table ecommerce_data (
	id int PRIMARY KEY AUTO_INCREMENT,
	data_event_id int,
    user_id int,
    app_name varchar(50),
    tag varchar(255),
	data text,
    event_time TIMESTAMP,
    created_at TIMESTAMP default now()
);

create table audio_stream_data (
	id int PRIMARY KEY AUTO_INCREMENT,
	data_event_id int,
    user_id int,
    app_name varchar(50),
    tag varchar(255),
	data text,
    event_time TIMESTAMP,
    created_at TIMESTAMP default now()
);

create table short_video_data (
	id int PRIMARY KEY AUTO_INCREMENT,
	data_event_id int,
    user_id int,
    app_name varchar(50),
    tag varchar(255),
	data text,
    event_time TIMESTAMP,
    created_at TIMESTAMP default now()
);