DROP DATABASE IF EXISTS employeedata_DB;
CREATE database employeedata_DB;

USE employeedata_DB;

CREATE TABLE  departments (
    id INT(8) NOT NULL,
    name VARCHAR(200) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT(8) NOT NULL,
    title VARCHAR(200) NOT NULL,
    salary DECIMAL(10,2),
    department_id INT(8) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employees (  
    id INT (8) NOT NULL,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    role_id INT (8) NOT NULL,
    manager_id INT(8) Null,
    PRIMARY KEY(id))