
var inquirer = require("inquirer");
var query = require("./query.js");
var classes = require("./class.js");
var questions = require("./questions.js");
var table = require("console.table");

function kickoff(){
    inquirer.prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Reports","Add a New EE/Role/Dept","Transfer an Employee","Quit"]
    })
    .then(function(answer){
        switch(answer.start){
            case "View Reports":
                view();
                break;
            case "Add a New EE/Role/Dept":
                add();
                break;
            case "Transfer an Employee":
                transfer();
                break;
            case "Quit":
                quit();
                break;
        }
    })
}


function view(){
    inquirer.prompt({
        name: "view",
        type: "list",
        message: "What would you like to see?",
        choices: ["Organizational Chart","All Employees","All Departments","All Roles","A Specific EE","Quit"]
    })
    .then(function(answer){
        switch(answer.view){
            case "Organizational Chart":
                query.orgChartQuery();
                break;
            case "All Employees":
                query.eesQuery();
                break;
            case "All Departments":
                query.deptsQuery();
                break;
            case "All Roles":
                query.rolesQuery();
                break;
            case "A Specific EE":
                employeeSearch();
                break;
            case "Quit":
                quit();
                break;

            
        }
    })
};

function employeeSearch(){
    inquirer.prompt({
        name: "lastName",
        type: "Input",
        message: "Enter the last name of the EE you would like to see",
    })
    .then(function(answer){
        query.eeQuery(answer.lastName);
    })
}

function quit(){
    figlet('Thanks for using \n HR Data Base!', function(err,data){
        if(err) {
            console.log("something went wrong....");
            console.dir(err);
            return;
        }
        console.log(data)
        
        query.connection.end();
    });
}

function transfer(){
    console.log("Write Transfer function")
}


function add(){
    inquirer.prompt({
        name: "add",
        type: "list",
        message: "What would you like to add?",
        choices: ["Employee","Role","Department","Quit"]
    })
    .then(function(answer){
        switch(answer.add){
            case "Employee":
                query.rolesList();
                break;
            case "Role":
                query.deptsList();
                break;
            case "Department":
                newDepartment();
                break;
            case "Quit":
                quit();
                break;
        }
    })
}

o
function newDepartment(){
    var newDept = [];

    inquirer.prompt({
        name: "name",
        type: "input",
        message: "What is the name of your new department?"
    })
    .then(function(answer){
        newDept = new classes.Department(answer.name);
    })
    .then(function(){
        query.addDepartment(newDept);
    })
};


function newRole(depts){
    var role = [];

    inquirer.prompt([
        {
            name:"title",
            type: "input",
            message: "What is the title for this role?"
        },
        {
            name:"salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name:"department",
            type: "list",
            message: "What department should it be in?",
            choices: depts
        },
    ])
    .then(function(answer){
        var dept_id = parseInt((answer.dpt).slice(0,3));

        var salary = parseInt(answer.salary);
                
        role = new classes.Role(answer.title,salary,dept_id);
    })
    .then(function(){
        query.addRole(role);
    })
};
ion
function newEmployee(roles,managers){
    var employee = [];
    inquirer.prompt([
        {
            name: "firName",
            type: "input",
            message: "What is the Employee's first name?",
        },
        {
            name: "laName",
            type: "input",
            message: "What is the Employee's last name?",
        },
        {
            name: "role_id",
            type: "list",
            message: "Which role is the Employee filling?",
            choices: roles
        },
        {
            name: "manager",
            type: "list",
            message: "Who will be the manager?",
            choices: managers
        },

    ])
    .then(function(answer){
        var role_id = parseInt((answer.role_id).slice(0,3));
        var mgr_id = parseInt((answer.manager).slice(0,3));
        
        employee = new classes.Employee(answer.fName,answer.lName,role_id,mgr_id);
    })
    .then(function(){
        
        query.addEmployee(employee);
    })
    
    
};


class Employee{
    constructor(first_name,last_name,role_id,manager_id){
        
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
}

class Department{
    constructor(name){
        this.name = name;
    }
}

class Role{
    constructor(title,salary,department_id){
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }
}

function eesQuery(){
    connection.query(
        "SELECT * FROM employee", function(err,results){
            if(err) throw err;

            console.table(results)

            questions.kickoff();
        });
};

function deptsQuery(){
    connection.query(
        "SELECT * FROM department", function(err,results){
            if(err) throw err;

            console.table(results);

            questions.kickoff();
        });
};


function rolesQuery(){
    connection.query(
        "SELECT * FROM role", function(err,results){
            if(err) throw err;

            console.table(results);

            questions.kickoff();
        });
};


function deptsList(){
    var depts = [];

    connection.query(
        "SELECT * FROM department", function(err,results){
            if(err) throw err;
            for (var i = 0; i < results.length; i++){
                var newid = results[i].id;
                var newName = results[i].name;
                var idName = newid + " " + newName;
                depts.push(idName);
            }
            questions.newRole(depts);
            
        });
};


function eeList(){
    var roles = [];
    var ees = [];

    var query1 = "SELECT id, title FROM role";

    var query2 = "SELECT id, last_name FROM employee";

    connection.query(query1, function(err,results){
            if(err) throw err;

            for (var i = 0; i < results.length; i++){
                var newID = results[i].id;
                var newTitle = results[i].title;
                var idTitle = newID + " " + newTitle;
                roles.push(idTitle);
            }

            
            connection.query(query2, function(err,results){
                    if(err) throw err;
        
                    for (var i = 0; i < results.length; i++){
                        var id = results[i].id;
                        var last_name = results[i].last_name;
                        var idLname = id + " " + last_name;
                        ees.push(idLname);
                      }
                      questions.transfer(roles,ees);
                });
                
        });
};


function rolesList(){
    
    var roles = [];
    var mgrs = [];

    
    var query1 = "SELECT id, title FROM role";

    
    var query2 = "SELECT first_name, role_id FROM employee WHERE SUBSTRING(role_id,3,1) = 1";

    connection.query(query1, function(err,results){
            if(err) throw err;

            for (var i = 0; i < results.length; i++){
                var newID = results[i].id;
                var newTitle = results[i].title;
                var idTitle = newID + " " + newTitle;
                roles.push(idTitle);
            }
            connection.query(query2, function(err,results){
                if(err) throw err;
                
                for (var i = 0; i < results.length; i++){
                  var mgrName = results[i].first_name;
                  var mgrID = results[i].role_id;
                  var mgrNameID = mgrID + " " + mgrName;
                  mgrs.push(mgrNameID);
                

                }
            })
            questions.newEmployee(roles,mgrs);

            
        });
};


function addEmployee(employee){

   connection.query("INSERT INTO employee SET ?",
    {
       first_name: employee.first_name,
       last_name: employee.last_name,
       role_id: employee.role_id,
       manager_id: employee.manager_id    
    },function(err,results) {
        if(err){throw err}
        console.log("Employee Added Successfully!")
        questions.kickoff();
    })
  
}

function addRole(role){

    connection.query("INSERT INTO role SET ?",
    {
        title: role.title,
        salary: role.salary,
        department_id: role.department_id
    },function(err,results) {
        if(err){throw err}
        console.log("Role Added Successfully!")
        questions.kickoff();
    }
    )
}


function addDepartment(newDept){
    connection.query("INSERT INTO department SET ?",
    {
        name: newDept.name
    },function(err,results){
        if(err){throw err}
        console.log("Department Added Successfully!")
        questions.kickoff();
    }
    )
};


function updateEE(ee_id,role_id){
    connection.query("UPDATE employee SET ? WHERE ?",
    [
        {
            role_id: role_id
        },
        {
            id: ee_id
        }

    ],
    function(err,results){
        if(err){throw err}
        console.log("EE Sucessfully Transferred!")
        questions.kickoff();
    }
    )
}


function roleQuery(role){
    var query = "SELECT * FROM role WHERE ?";

    connection.query(query, {title: role}, function(err, results) {
        if(err){throw err}
        else if(results.length === 0){
            error();

            questions.view();
        }
        else{
        console.table(results);

        questions.kickoff();
        }} 
    )
};


function orgChartQuery (){
  
    var query = "SELECT e1.id,e1.first_name,e1.last_name,e1.role_id,r1.title,r1.salary,r1.department_id,d1.name AS dept_name,CONCAT(e2.first_name,' ',e2.last_name) AS Mgr_Name,r2.title AS Mgr_Title ";

   
    query += "FROM employee e1 JOIN employee e2 ON e1.manager_id = e2.role_id ";

  
    query += "JOIN role r1 ON e1.role_id = r1.id "

    query += "JOIN role r2 ON e2.role_id = r2.id "


    query += "JOIN department d1 ON r1.department_id = d1.id "

    connection.query(query, function(err,results){
            if(err) throw err;
            console.table(results);

            questions.kickoff();
        });
}


function eeQuery(lastName){
    
    var query = "SELECT e1.id,e1.first_name,e1.last_name,e1.role_id,r1.title,r1.salary,r1.department_id,d1.name AS dept_name,CONCAT(e2.first_name,' ',e2.last_name) AS Mgr_Name,r2.title AS Mgr_Title ";

    query += "FROM employee e1 JOIN employee e2 ON e1.manager_id = e2.role_id ";

    query += "JOIN role r1 ON e1.role_id = r1.id "

    query += "JOIN role r2 ON e2.role_id = r2.id "

    query += "JOIN department d1 ON r1.department_id = d1.id "

    query += "WHERE (e1.last_name = ?)"
    
    connection.query(query,[lastName], function(err, results) {
        if(err){throw err}
        else if(results.length === 0){
            error();

            questions.view();
        }
        else{
        console.table(results);

        questions.kickoff();
        }} 
    )
};

module.exports.Role = Role;
module.exports.Department = Department;
module.exports.Employee = Employee;
module.exports.kickoff = kickoff;
module.exports.view = view;
module.exports.add = add;
module.exports.transfer = transfer;
module.exports.quit = quit;
module.exports.newEmployee = newEmployee;
module.exports.newRole = newRole;
module.exports.eesQuery = eesQuery;
module.exports.eeQuery = eeQuery;
module.exports.deptsQuery = deptsQuery;
module.exports.rolesQuery = rolesQuery;
module.exports.orgChartQuery = orgChartQuery;
module.exports.addDepartment = addDepartment;
module.exports.roleQuery = roleQuery;
module.exports.rolesList = rolesList;
module.exports.connection = connection;
module.exports.addEmployee = addEmployee;
module.exports.deptsList = deptsList;
module.exports.addRole = addRole;
module.exports.eeList = eeList;
module.exports.updateEE = updateEE;