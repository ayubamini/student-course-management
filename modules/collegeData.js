const Sequelize = require('sequelize');

var sequelize = new Sequelize('dgzhjlln', 'dgzhjlln', 'F46qV0jTjkGqGjivW_Bf8sFM3y-WprON', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// define a "Student" model
var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "studentNum" as a primary key
        autoIncrement: true // automatically increment the value
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

// define a "Course" model
var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "courseId" as a primary key
        autoIncrement: true // automatically increment the value
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// define a has-many relationship between Students and Courses
Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function initialize() {
    return new Promise(function (resolve, reject) {
        sequelize
            .sync().then(function (data) {
                console.log('Connection has been established successfully.');
                resolve(data);
            }).catch(function (err) {
                reject("unable to sync the database");
            });
    });
}

module.exports.getAllStudents = function getAllStudents() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Student.findAll().then(function (data) {
                resolve(data);
            }).catch(function () {
                reject("no results returned");
            });
        });
    });
}

module.exports.getStudentsByCourse = function getStudentsByCourse(course) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Student.findAll({
                where: {
                    course: course
                }
            }).then(function (data) {
                resolve(data);
            }).catch(function () {
                reject("no results returned");
            });
        });
    });
}

module.exports.getStudentByNum = function getStudentByNum(num) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            Student.findAll({
                attributes:
                    ['studentNum',
                        'firstName',
                        'lastName',
                        'email',
                        'course',
                        'addressStreet',
                        'addressCity',
                        'addressProvince',
                        'TA',
                        'status'],
                where: {
                    studentNum: num
                }
            }).then(function (data) {
                resolve(data[0]);
            }).catch(function () {
                reject("no results returned");
            });
        });
    });
}

module.exports.getCourses = function getCourses() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Course.findAll().then(function (data) {
                resolve(data);
            }).catch(function () {
                reject("no results returned");
            });
        });
    });
}

module.exports.getCourseById = function getCourseById(id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

            Course.findAll({
                attributes: ['courseId', 'courseCode', 'courseDescription'],
                where: {
                    courseId: id
                }
            }).then(function (data) {
                resolve(data[0]);
            }).catch(function () {
                reject("no results returned");
            });
        });
    });
}

// Manipulate Student
module.exports.addStudent = function addStudent(studentData) {
    return new Promise(function (resolve, reject) {

        studentData.TA = (studentData.TA) ? true : false;

        for (let key in studentData) {
            if (studentData[key] == "") {
                studentData[key] = null;
            }
        }

        sequelize.sync().then(function () {

            Student.create(studentData).then(function () {
                resolve();
                console.log("success!")
            }).catch(function (err) {
                console.log("something went wrong!");
                reject(err);
            });
        });
    });
}

module.exports.updateStudent = function updateStudent(studentData) {
    return new Promise(function (resolve, reject) {

        studentData.TA = (studentData.TA) ? true : false;

                for (let key in studentData) {
            if (studentData[key] == "") {
                studentData[key] = null;
            }
          }

        Student.update({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            course: studentData.course,
            addressProvince: studentData.addressProvince,
            addressCity: studentData.addressCity,
            addressStreet: studentData.addressStreet,
            status: studentData.status
        }, {
            where: {
                studentNum: studentData.studentNum
            }
        }).then(function () {
            console.log('the student was created to the database!');
            resolve("the student has been updated");
        }).catch(function (err) {
            console.log(err);
            reject("unable to update student");
        });
    });
}

// Manipulate Course
module.exports.addCourse = function addCourse(courseData) {
    return new Promise(function (resolve, reject) {

        for (let key in courseData) {
            if (courseData[key] == "") {
                courseData[key] = null;
            }
        }
        sequelize.sync().then(function () {

            Course.create(courseData)
            .then(function () {
                resolve();
                console.log("success!")
            }).catch(function () {
                console.log("something went wrong!");
                reject();
            });
        });
    });
}

module.exports.updateCourse = function updateCourse(courseData) {
    return new Promise(function (resolve, reject) {

        for (let key in courseData) {
            if (courseData[key] == "") {
                courseData[key] = null;
            }
        }

        Course.update({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription,
        }, {
            where: { courseId: courseData.courseId }
        }).then(function () {
            console.log("the course has been updated");
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
}

module.exports.deleteCourseById = function deleteCourseById(id) {
    return new Promise(function (resolve, reject) {
        Course.destroy({
            where: {
                courseId: id
            }
        }).then(function () {
            console.log("the course has been destroyed");
            resolve("destroyed");
        }).catch(function (error) {
            console.log("request for delete course has been rejected");
            reject("was rejected");
        });
    });
}

module.exports.deleteStudentByNum = function deleteStudentByNum(studentNum) {
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: {
                studentNum: studentNum
            }
        }).then(function () {
            console.log("the student has been destroyed");
            resolve("destroyed");
        }).catch(function () {
            console.log("request for delete student has been rejected");
            reject("rejected");
        });
    });
}