// Sample users
let users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "guest1", password: "guest123", role: "guest" }
];

// Default data
if (!localStorage.getItem("menu")) {
    localStorage.setItem("menu", "Rice, Curry, Salad");
}

if (!localStorage.getItem("cleaning")) {
    localStorage.setItem("cleaning", "Monday - Room 101\nTuesday - Room 102");
}

if (!localStorage.getItem("vacations")) {
    localStorage.setItem("vacations", JSON.stringify([]));
}

if (!localStorage.getItem("issues")) {
    localStorage.setItem("issues", JSON.stringify([]));
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        if (user.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "guest.html";
        }
    } else {
        document.getElementById("msg").innerText = "Invalid credentials!";
    }
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

// Admin page functions
if (window.location.pathname.includes("admin.html")) {
    document.getElementById("menuText").value = localStorage.getItem("menu");
    document.getElementById("cleaningText").value = localStorage.getItem("cleaning");

    document.getElementById("guestList").innerHTML = users
        .filter(u => u.role === "guest")
        .map(u => `<li>${u.username}</li>`).join("");

    document.getElementById("vacationList").innerHTML = JSON.parse(localStorage.getItem("vacations"))
        .map(v => `<li>${v.username} from ${v.from} to ${v.to}</li>`).join("");

    document.getElementById("issueList").innerHTML = JSON.parse(localStorage.getItem("issues"))
        .map((i, idx) => `<li>${i.username}: ${i.text} <button onclick="resolveIssue(${idx})">Resolve</button></li>`).join("");
}

function updateMenu() {
    let newMenu = document.getElementById("menuText").value;
    localStorage.setItem("menu", newMenu);
    alert("Menu updated!");
}

function updateCleaning() {
    let newSchedule = document.getElementById("cleaningText").value;
    localStorage.setItem("cleaning", newSchedule);
    alert("Cleaning schedule updated!");
}

function resolveIssue(index) {
    let issues = JSON.parse(localStorage.getItem("issues"));
    issues.splice(index, 1);
    localStorage.setItem("issues", JSON.stringify(issues));
    location.reload();
}

// Guest page functions
if (window.location.pathname.includes("guest.html")) {
    document.getElementById("menuDisplay").innerText = localStorage.getItem("menu");
    document.getElementById("cleaningDisplay").innerText = localStorage.getItem("cleaning");
}

function submitVacation() {
    let from = document.getElementById("fromDate").value;
    let to = document.getElementById("toDate").value;
    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (from && to) {
        let vacations = JSON.parse(localStorage.getItem("vacations"));
        vacations.push({ username: user.username, from, to });
        localStorage.setItem("vacations", JSON.stringify(vacations));
        document.getElementById("vacationMsg").innerText = "Vacation request submitted!";
    } else {
        document.getElementById("vacationMsg").innerText = "Please select dates!";
    }
}

function submitIssue() {
    let issueText = document.getElementById("issueText").value;
    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (issueText.trim() !== "") {
        let issues = JSON.parse(localStorage.getItem("issues"));
        issues.push({ username: user.username, text: issueText });
        localStorage.setItem("issues", JSON.stringify(issues));
        document.getElementById("issueMsg").innerText = "Issue reported!";
        document.getElementById("issueText").value = "";
    } else {
        document.getElementById("issueMsg").innerText = "Please describe the issue!";
    }
}
