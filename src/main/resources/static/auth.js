const API = "http://localhost:8080/api";


// ===============================
// SHOW LOGIN
// ===============================

function showLogin() {

    document.getElementById("loginCard").style.display = "block";

    document.getElementById("registerCard").style.display = "none";
}


// ===============================
// SHOW REGISTER
// ===============================

function showRegister() {

    document.getElementById("loginCard").style.display = "none";

    document.getElementById("registerCard").style.display = "block";
}


// ===============================
// REGISTER STUDENT
// ===============================

async function registerStudent() {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("registerMessage");


    if (!name || !email || !password || !confirmPassword) {

        message.className = "error";
        message.textContent = "Please fill all fields.";

        return;
    }


    if (password !== confirmPassword) {

        message.className = "error";
        message.textContent = "Passwords do not match.";

        return;
    }


    try {

        const response = await fetch(
            `${API}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            message.className = "error";
            message.textContent =
                typeof data === "string"
                    ? data
                    : "Registration failed.";

            return;
        }


        message.className = "success";

        message.textContent =
            "Registration successful! Please login.";


        setTimeout(() => {

            showLogin();

        }, 1200);


    } catch (error) {

        message.className = "error";

        message.textContent =
            "Unable to connect to server.";
    }
}


// ===============================
// LOGIN STUDENT
// ===============================

async function loginStudent() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const message =
        document.getElementById("loginMessage");


    if (!email || !password) {

        message.className = "error";
        message.textContent =
            "Please enter email and password.";

        return;
    }


    try {

        const response = await fetch(
            `${API}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            message.className = "error";

            message.textContent =
                typeof data === "string"
                    ? data
                    : "Invalid email or password.";

            return;
        }


        // Save logged-in student information

        localStorage.setItem(
            "studentId",
            data.studentId
        );

        localStorage.setItem(
            "studentName",
            data.name
        );

        localStorage.setItem(
            "studentEmail",
            data.email
        );


        message.className = "success";

        message.textContent =
            "Login successful!";


        setTimeout(() => {

            window.location.href =
                "student-dashboard.html";

        }, 700);


    } catch (error) {

        message.className = "error";

        message.textContent =
            "Unable to connect to server.";
    }
}