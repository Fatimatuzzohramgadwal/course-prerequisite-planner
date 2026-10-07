const API = "http://localhost:8080/api";


// ===============================
// CHECK LOGIN
// ===============================

const studentId = localStorage.getItem("studentId");
const studentName = localStorage.getItem("studentName");

if (!studentId) {

    window.location.href = "login.html";

}


// ===============================
// DISPLAY STUDENT NAME
// ===============================

document.getElementById("studentName").textContent =
    studentName;


// ===============================
// LOAD COURSES
// ===============================

async function loadCourses() {

    try {

        const response =
            await fetch(`${API}/courses`);

        const courses =
            await response.json();

        const courseList =
            document.getElementById("courseList");

        courseList.innerHTML = "";

        courses.forEach(course => {

            courseList.innerHTML += `
                <div class="course">

                    <strong>
                        ${course.courseCode}
                    </strong>

                    <br>

                    ${course.courseName}

                    <br>

                    <span>
                        Credits: ${course.credits}
                    </span>

                    <br>

                    <small>
                        ${course.description || ""}
                    </small>

                </div>
            `;

        });

    } catch (error) {

        document.getElementById("courseList").innerHTML =
            `<p class="error">
                Unable to load courses.
            </p>`;

    }
}


// ===============================
// SHOW LEARNING PATH
// ===============================

function showLearningPathSection() {

    document.getElementById("learningPathSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// GENERATE LEARNING PATH
// ===============================

async function getStudentLearningPath() {

    const courseId =
        document.getElementById("pathCourseId").value;

    const result =
        document.getElementById("learningPathResult");


    if (!courseId) {

        result.innerHTML =
            `<p class="error">
                Please enter a course ID.
            </p>`;

        return;
    }


    try {

        const response =
            await fetch(`${API}/planner/${courseId}`);


        if (!response.ok) {

            result.innerHTML =
                `<p class="error">
                    Course not found.
                </p>`;

            return;
        }


        const courses =
            await response.json();


        result.innerHTML =
            `<h3>Recommended Learning Path</h3>`;


        courses.forEach((course, index) => {

            result.innerHTML += `

                <div class="path-item">

                    <strong>
                        Step ${index + 1}
                    </strong>

                    →
                    ${course.courseCode}
                    -
                    ${course.courseName}

                </div>

            `;

        });

    } catch (error) {

        result.innerHTML =
            `<p class="error">
                Unable to generate learning path.
            </p>`;

    }

}


// ===============================
// SHOW ELIGIBILITY
// ===============================

function showEligibilitySection() {

    document.getElementById("eligibilitySection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// CHECK ELIGIBILITY
// ===============================

async function checkStudentEligibility() {

    const courseId =
        document.getElementById("eligibilityCourseId").value;

    const completed =
        document.getElementById("completedCourses").value;


    const result =
        document.getElementById("eligibilityResult");


    if (!courseId) {

        result.innerHTML =
            `<p class="error">
                Please enter a target course ID.
            </p>`;

        return;
    }


    let url =
        `${API}/eligibility/${courseId}`;


    if (completed.trim() !== "") {

        const ids =
            completed
                .split(",")
                .map(id => id.trim())
                .filter(id => id !== "");


        const params =
            ids
                .map(id => `completed=${id}`)
                .join("&");


        url += `?${params}`;

    }


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            result.innerHTML =
                `<p class="error">
                    Course not found.
                </p>`;

            return;
        }


        const data =
            await response.json();


        if (data.eligible) {

            result.innerHTML = `

                <p class="success">

                    ✓ You are eligible for
                    ${data.course.courseName}.

                </p>

            `;

        } else {

            result.innerHTML = `

                <p class="error">

                    ✗ You are not eligible for
                    ${data.course.courseName}.

                </p>

                <div class="missing">

                    <strong>
                        Missing Prerequisites:
                    </strong>

                    <ul>

                        ${data.missingPrerequisites
                            .map(course => `
                                <li>
                                    ${course.courseCode}
                                    -
                                    ${course.courseName}
                                </li>
                            `)
                            .join("")
                        }

                    </ul>

                </div>

            `;

        }

    } catch (error) {

        result.innerHTML =
            `<p class="error">
                Unable to check eligibility.
            </p>`;

    }

}

async function addPrerequisite() {

    const courseId =
        document.getElementById("prerequisiteCourseId").value;

    const prerequisiteId =
        document.getElementById("prerequisiteId").value;

    const result =
        document.getElementById("prerequisiteResult");

    if (!courseId || !prerequisiteId) {
        result.innerHTML =
            `<p class="error">Please enter both course IDs.</p>`;
        return;
    }

    if (courseId === prerequisiteId) {
        result.innerHTML =
            `<p class="error">
                A course cannot be its own prerequisite.
            </p>`;
        return;
    }

    try {

        const response = await fetch(
            `${API}/prerequisites/${courseId}/${prerequisiteId}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {

    const errorMessage = await response.text();

    result.innerHTML =
        `<p class="error">
            ${errorMessage}
        </p>`;

    return;
}

        const data = await response.json();

        result.innerHTML = `
            <p class="success">
                ✓ Prerequisite added successfully.
            </p>
            <p>
                Course ID ${data.course.id}
                requires
                Course ID ${data.prerequisiteCourse.id}.
            </p>
        `;

    } catch (error) {

        result.innerHTML =
            `<p class="error">
                Unable to connect to server.
            </p>`;
    }
}


async function viewPrerequisites() {

    const courseId =
        document.getElementById("prerequisiteCourseId").value;

    const result =
        document.getElementById("prerequisiteResult");

    if (!courseId) {
        result.innerHTML =
            `<p class="error">
                Enter a Course ID to view prerequisites.
            </p>`;
        return;
    }

    try {

        const response =
            await fetch(`${API}/prerequisites/${courseId}`);

        if (!response.ok) {
            result.innerHTML =
                `<p class="error">Course not found.</p>`;
            return;
        }

        const prerequisites = await response.json();

        if (prerequisites.length === 0) {
            result.innerHTML =
                `<p>No prerequisites found for this course.</p>`;
            return;
        }

        result.innerHTML = `
            <h3>Prerequisites</h3>
            <div class="missing">
                <ul>
                    ${prerequisites.map(item => `
                        <li>
                            ${item.prerequisiteCourse.courseCode}
                            -
                            ${item.prerequisiteCourse.courseName}
                        </li>
                    `).join("")}
                </ul>
            </div>
        `;

    } catch (error) {

        result.innerHTML =
            `<p class="error">
                Unable to load prerequisites.
            </p>`;
    }
}

// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("studentId");

    localStorage.removeItem("studentName");

    localStorage.removeItem("studentEmail");


    window.location.href =
        "login.html";

}