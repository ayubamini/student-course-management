# Student Course Management

A Node.js and Express application for managing students and courses. Includes a dynamic Handlebars-based UI.

## Project Structure

- `student-course-management/`
  - `README.md`
  - `LICENSE`
  - `app.js`
  - `modules/`
    - `collegeData.js`
  - `public/`
    - `css/`
    - `js/`
    - `images/`
  - `views/`
    - `layouts/`
      - `main.hbs`
    - `home.hbs`
    - `about.hbs`
    - `htmlDemo.hbs`
    - `students.hbs`
    - `student.hbs`
    - `addStudent.hbs`
    - `courses.hbs`
    - `addCourse.hbs`
    - `404.html`
  - `.gitignore`
  - `package.json`
  - `package-lock.json`

## Features
- Add, update, and delete students and courses.
- View students and courses with filtering options.
- Dynamic Handlebars templates.

## File Structure
- `app.js`: Main server file.
- `modules/collegeData.js`: Module for database interactions.
- `views/`: Handlebars templates for the UI.
- `public/`: Static assets.

## Setup Instructions

### Prerequisites
- Node.js and npm installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/student-course-management.git

