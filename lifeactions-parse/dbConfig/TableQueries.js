

function data_transaction(tableName) {
    
    return `Create table ${tableName} (
        id int PRIMARY KEY AUTO_INCREMENT,
        data LONGTEXT,
        user_id int,
        file_id int,
        created_at TIMESTAMP default now()
    )`
}

function file(tableName) {
    return `CREATE TABLE ${tableName} (
        id int PRIMARY KEY AUTO_INCREMENT,
        file_name varchar(511),
        data MEDIUMBLOB,
        type varchar(255),
        file_size_bytes varchar(25),
        user_id int ,
        created_at TIMESTAMP default now()
    );`
}

function event_data(tableName) {
    
    return `create table ${tableName} (
        id int PRIMARY KEY AUTO_INCREMENT,
        data_transaction_id int,
        user_id int,
        category_id int,
        app_id int,
        pattern_id int,
        event_info varchar(1027),
        package_name varchar(511),
        data LONGTEXT,
        event_time TIMESTAMP,
        created_at TIMESTAMP default now()
    )`

}

module.exports = { data_transaction, file, event_data };