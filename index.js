#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
console.log(chalk.blueBright("\n                           Welcome to Student Management System                \n"));
class Student {
    name;
    static idCounter = 0;
    studentID;
    courses = [];
    balance = 0;
    constructor(name) {
        this.name = name;
        Student.idCounter++;
        this.studentID = this.generatesStudentID();
    }
    generatesStudentID() {
        return 10000 + Student.idCounter;
    }
    enrollCourses(course) {
        this.courses.push(course);
        this.balance += 1000;
    }
    viewBalance() {
        return this.balance;
    }
    payCourseFee(amount) {
        this.balance -= amount;
    }
    showStatus() {
        console.log(`
         Name : ${this.name}
         Student ID : ${this.studentID}
         Coures Enrolled : ${this.courses.join(",")}
         Balance: ${this.balance} 
        `);
    }
    get StudentID() {
        return this.studentID;
    }
    get Name() {
        return this.name;
    }
}
const students = [];
async function mainMenu() {
    const userInputMenu = await inquirer.prompt({
        type: "list",
        name: "menu",
        message: " Select an option:",
        choices: [
            "1. Add New Student",
            "2. Enroll Student in Course",
            "3. View Student Balance",
            "4. Pay Course Fee",
            "5. Show Student Status",
            "6. Exit"
        ]
    });
    const { menu } = userInputMenu;
    if (menu === "1. Add New Student")
        await addNewStudent();
    if (menu === "2. Enroll Student in Course")
        await enrollStudent();
    if (menu === "3. View Student Balance")
        await viewStudentBalance();
    if (menu === "4. Pay Course Fee")
        await payTuition();
    if (menu === "5. Show Student Status")
        await showStatus();
    if (menu === "6. Exit") {
        console.log("Thank You for using Student Management System \n");
        process.exit();
    }
    mainMenu();
}
async function addNewStudent() {
    const userInput = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Enter Student Name:"
    });
    const student = new Student(userInput.name);
    students.push(student);
    console.log(`Student ${student.Name} added with ID ${student.StudentID}\n`);
}
async function enrollStudent() {
    const student = await selectStudent();
    if (student) {
        const userInput = await inquirer.prompt({
            type: "list",
            name: "course",
            message: "Select the course to enroll",
            choices: ["TypeScript", "JavaScript", "Python", "Next.js"]
        });
        student.enrollCourses(userInput.course);
        console.log(`Enrolled in course: ${userInput.course}`);
    }
}
async function viewStudentBalance() {
    const student = await selectStudent();
    if (student) {
        console.log(`Balance: ${student.viewBalance()}`);
    }
}
async function payTuition() {
    const student = await selectStudent();
    if (student) {
        const userInput = await inquirer.prompt({
            type: "input",
            name: "amount",
            message: "Enter the amount you want to pay:"
        });
        student.payCourseFee(parseFloat(userInput.amount));
        console.log(`Paid ${userInput.amount}.Balance remaining ${student.viewBalance()}`);
    }
}
async function showStatus() {
    const student = await selectStudent();
    if (student) {
        student.showStatus();
    }
}
async function selectStudent() {
    if (students.length === 0) {
        console.log(`No Student record available.\n`);
    }
    else {
        const stdSelect = await inquirer.prompt({
            type: "list",
            name: "stdID",
            message: "Select a Student",
            choices: students.map((std) => ({
                name: std.Name,
                value: std.StudentID
            }))
        });
        return (students.find((std) => std.StudentID === stdSelect.stdID) || null);
    }
}
mainMenu();
