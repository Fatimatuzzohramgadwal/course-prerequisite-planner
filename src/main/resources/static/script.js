const API = "http://localhost:8080/api";


// ===============================
// LOAD COURSES
// ===============================

async function loadCourses() {

    try {

        const response = await fetch(`${API}/courses`);

        const courses = await response.json();

        const courseList = document.getElementById("courseList");

        courseList.innerHTML = "";

        courses.forEach(course => {

            courseList.innerHTML += `
                <div class="course">
                    <strong>${course.id}. ${course.courseCode}</strong>
                    <br>
                    ${course.courseName}
                    <br>
                    Credits: ${course.credits}
                </div>
            `;

        });

    } catch (error) {

        document.getElementById("courseList").innerHTML =
            `<p class="error">Unable to load courses.</p>`;

    }
}


// ===============================
// LEARNING PATH
// ===============================

async function getLearningPath() {

    const courseId =
        document.getElementById("courseId").value;

    if (!courseId) {
        alert("Please enter a course ID.");
        return;
    }

    try {

        const response =
            await fetch(`${API}/planner/${courseId}`);

        if (!response.ok) {

            document.getElementById("learningPath").innerHTML =
                `<p class="error">Course not found.</p>`;

            return;
        }

        const courses = await response.json();

        const result =
            document.getElementById("learningPath");

        result.innerHTML = "<h3>Recommended Learning Path:</h3>";

        courses.forEach((course, index) => {

            result.innerHTML += `
                <div class="path-item">
                    ${index + 1}. ${course.courseCode}
                    - ${course.courseName}
                </div>
            `;

        });

    } catch (error) {

        document.getElementById("learningPath").innerHTML =
            `<p class="error">Unable to generate learning path.</p>`;
    }
}


// ===============================
// ELIGIBILITY
// ===============================

async function checkEligibility() {

    const courseId =
        document.getElementById("eligibilityCourseId").value;

    const completed =
        document.getElementById("completedCourses").value;

    if (!courseId) {
        alert("Please enter target course ID.");
        return;
    }

    let url = `${API}/eligibility/${courseId}`;

    if (completed.trim() !== "") {

        const ids = completed
            .split(",")
            .map(id => id.trim())
            .filter(id => id !== "");

        const params =
            ids.map(id => `completed=${id}`).join("&");

        url += `?${params}`;
    }

    try {

        const response = await fetch(url);

        if (!response.ok) {

            document.getElementById("eligibilityResult").innerHTML =
                `<p class="error">Course not found.</p>`;

            return;
        }

        const data = await response.json();

        const result =
            document.getElementById("eligibilityResult");

        if (data.eligible) {

            result.innerHTML = `
                <p class="success">
                    ✓ You are eligible for ${data.course.courseName}.
                </p>
            `;

        } else {

            result.innerHTML = `
                <p class="error">
                    ✗ You are not eligible for
                    ${data.course.courseName}.
                </p>

                <div class="missing">
                    <strong>Missing Prerequisites:</strong>
                    <ul>
                        ${data.missingPrerequisites.map(course =>
                            `<li>
                                ${course.courseCode} -
                                ${course.courseName}
                            </li>`
                        ).join("")}
                    </ul>
                </div>
            `;
        }

    } catch (error) {

        document.getElementById("eligibilityResult").innerHTML =
            `<p class="error">Unable to check eligibility.</p>`;
    }
}

// ===============================
// ADD PREREQUISITE
// ===============================

async function addPrerequisite() {

    const courseId =
        document.getElementById("prerequisiteCourseId").value;

    const prerequisiteId =
        document.getElementById("prerequisiteId").value;

    if (!courseId || !prerequisiteId) {
        alert("Please enter both course IDs.");
        return;
    }

    try {

        const response = await fetch(
            `${API}/prerequisites/${courseId}/${prerequisiteId}`,
            {
                method: "POST"
            }
        );

        const result =
            document.getElementById("prerequisiteResult");

        if (!response.ok) {

            result.innerHTML =
                `<p class="error">
                    Course not found.
                </p>`;

            return;
        }

        const data = await response.json();

        result.innerHTML = `
            <p class="success">
                ✓ Prerequisite added successfully.
            </p>

            <div class="course">
                ${data.course.courseCode}
                requires
                ${data.prerequisiteCourse.courseCode}
            </div>
        `;

    } catch (error) {

        document.getElementById("prerequisiteResult").innerHTML =
            `<p class="error">
                Unable to add prerequisite.
            </p>`;
    }
}


// ===============================
// VIEW PREREQUISITES
// ===============================

async function viewPrerequisites() {

    const courseId =
        document.getElementById("prerequisiteCourseId").value;

    if (!courseId) {
        alert("Please enter a course ID.");
        return;
    }

    try {

        const response =
            await fetch(`${API}/prerequisites/${courseId}`);

        if (!response.ok) {

            document.getElementById("prerequisiteResult").innerHTML =
                `<p class="error">
                    Course not found.
                </p>`;

            return;
        }

        const prerequisites = await response.json();

        const result =
            document.getElementById("prerequisiteResult");

        if (prerequisites.length === 0) {

            result.innerHTML =
                `<p class="error">
                    No prerequisites found for this course.
                </p>`;

            return;
        }

        result.innerHTML =
            "<h3>Prerequisites:</h3>";

        prerequisites.forEach(item => {

            result.innerHTML += `
                <div class="path-item">
                    ${item.course.courseCode}
                    requires
                    ${item.prerequisiteCourse.courseCode}
                </div>
            `;

        });

    } catch (error) {

        document.getElementById("prerequisiteResult").innerHTML =
            `<p class="error">
                Unable to load prerequisites.
            </p>`;
    }
}