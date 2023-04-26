
function users() {   
    return `CREATE TABLE users (
        user_id int PRIMARY KEY AUTO_INCREMENT,
        about varchar(511),
        education varchar(255),
        occupation varchar(255),
        durables_used varchar(511),
        created_at TIMESTAMP default now()
    )`
}

function apps_m() {
    return `create table apps_m (
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
    );`
}

function app_category_m() {
    
    return `create table app_category_m (
        id int PRIMARY KEY AUTO_INCREMENT,
        category_name varchar(255),
        description text,
        created_at TIMESTAMP default now(),
        created_by int default 1,
        modified_at TIMESTAMP,
        modified_by int,
        status varchar(10) default 'active'
    );`

}

function event_info_m(){
    return `create table event_info_m (
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
    );`
}
function data_patterns_m(){
    return `create table data_patterns_m (
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
    );`
}

function ott_data(){
    return `create table ott_data (
        id int PRIMARY KEY AUTO_INCREMENT,
        user_id int,
        app_name varchar(50),
        tag varchar(255),
        data text,
        event_time TIMESTAMP,
        created_at TIMESTAMP default now()
    );`
}
module.exports = {users,ott_data,event_info_m,app_category_m,apps_m,data_patterns_m };