const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const repository = require('./modules/collegeData.js');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// configure express-handlebars
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    },
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/'
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// setup website home page by route to listen on /
app.get("/", (req, res) => {
    res.render("home");
});

// setup website about page by route to listen on /about
app.get("/about", (req, res) => {
    res.render("about");
});

// setup website htmlDemo page by route to listen on /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

// -------------- Student-----------------------------------------------
app.get("/students", (req, res) => {
    if (req.query.course) {
        repository.getStudentsByCourse(req.query.course).then(function (data) {
            if (data.length > 0) {
                res.render("students", { students: data });
            } else {
                res.render("students", { message: "no results" });
            }
        });
    }
    else {
        repository.getAllStudents().then(function (data) {
            if (data.length > 0) {
                res.render("students", { students: data });
            } else {
                res.render("students", { message: "no results" });
            }
        });
    }
});

app.get("/student/:studentNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    repository.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error
    }).then(repository.getCourses).then((data) => {
        viewData.courses = data; // store course data in the "viewData" object as "courses"
        // loop through viewData.courses and once we have found the courseId that matches
        // the student's "course" value, add a "selected" property to the matching
        // viewData.courses object
        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.courses = []; // set courses to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    });
});

app.get("/students/add", (req, res) => {
    repository.getCourses().then((data) => {
        res.render("addStudent", { courses: data });
    }).catch((error) => {
        res.render("addStudent", { courses: [] });
    });
});

app.post("/students/add", (req, res) => {
    repository.addStudent(req.body).then(() => {
        res.redirect("/students");
    });
});

// Update Student
app.post("/student/update", (req, res) => {
    repository.updateStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch((error) => {
        res.render('student', { message: error })
    });
});

// Delete Student
app.get("/student/delete/:studentNum", (req, res) => {
    repository.deleteStudentByNum(req.params.studentNum).then(() => {
        res.redirect("/students");
    }).catch((error) => {
        res.status(500).send("Unable to Remove Student / Student not found)");
    });
});

// -------------- Course -----------------------------------------------
app.get("/courses", (req, res) => {
    repository.getCourses().then((data) => {
        res.render("courses", { courses: data });
    }).catch(err => {
        res.render("courses", { message: "no results" });
    });
});

app.get("/courses/add", (req, res) => {
    res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
    repository.addCourse(req.body).then(() => {
        res.redirect("/courses");
    });
});

// Update Course
app.post("/course/update", (req, res) => {
    repository.updateCourse(req.body).then(() => {
        res.redirect("/courses");
    }).catch((error) => {
        res.render("course", { message: error });
    });
});

app.get("/course/:id", (req, res) => {
    repository.getCourseById(req.params.id).then((data) => {
        if (data === undefined) {
            res.status(404).send("Course Not Found");
        } else {
            res.render("course", { course: data });
        }
    }).catch((err) => {
        res.render("course", { message: "no results" });
    });
});

// Delete Course
app.get("/course/delete/:id", (req, res) => {
    repository.deleteCourseById(req.params.id).then(() => {
        res.redirect("/courses");
    }).catch(() => {
        res.status(500).send("Unable to Remove Course / Course not found");
    });
});

// page not found message
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "/views/404.html"));
});

repository.initialize()
    .then(function (result) {
        if (result) {
            // setup http server to listen on HTTP_PORT
            app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
        } else {
            console.log("error in retrieved information.");
        }
    })
    .catch(function (error) {
        console.log(error);
    });

