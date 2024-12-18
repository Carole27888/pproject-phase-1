const BASE_URL = "http://localhost:4000";

// On Page Load - Fetch Financial Summary
document.addEventListener("DOMContentLoaded", () => {
    fetchFinancialSummary();
    loadMembers();
    loadEvents();
});

// Fetch Financial Summary
async function fetchFinancialSummary() {
    try {
        const contributionsResponse = await fetch(`${BASE_URL}/contributions`);
        const loansResponse = await fetch(`${BASE_URL}/loans`);

        const contributions = await contributionsResponse.json();
        const loans = await loansResponse.json();

        const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
        const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);

        document.getElementById("totalContributions").innerText = `Ksh ${totalContributions}`;
        document.getElementById("totalLoans").innerText = `Ksh ${totalLoans}`;
    } catch (error) {
        console.error("Error fetching financial summary:", error);
    }
}

// Load Members
async function loadMembers() {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();

        const memberList = document.getElementById("memberList");
        memberList.innerHTML = ""; // Clear previous list

        users.forEach(user => {
            if (user.role === "user") {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    ${user.email}
                    <button class="btn btn-danger btn-sm" onclick="removeMember(${user.id})">Remove</button>
                `;
                memberList.appendChild(li);
            }
        });
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

// Add New Member
function addMember() {
    const email = prompt("Enter the new member's email:");
    const password = prompt("Enter a password for the new member:");

    if (email && password) {
        fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role: "user" })
        })
        .then(response => response.json())
        .then(() => {
            alert("Member added successfully!");
            loadMembers();
        })
        .catch(error => console.error("Error adding member:", error));
    } else {
        alert("Please enter valid email and password.");
    }
}

// Remove Member
function removeMember(id) {
    if (confirm("Are you sure you want to remove this member?")) {
        fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Member removed successfully!");
                loadMembers();
            })
            .catch(error => console.error("Error removing member:", error));
    }
}

// Load Events
async function loadEvents() {
    try {
        const response = await fetch(`${BASE_URL}/events`);
        const events = await response.json();

        const eventList = document.getElementById("eventList");
        eventList.innerHTML = ""; // Clear previous list

        events.forEach(event => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                ${event.name} - ${event.date}
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">Delete</button>
            `;
            eventList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Create New Event
function createEvent() {
    const name = prompt("Enter event name:");
    const date = prompt("Enter event date (YYYY-MM-DD):");

    if (name && date) {
        fetch(`${BASE_URL}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, date })
        })
        .then(response => response.json())
        .then(() => {
            alert("Event created successfully!");
            loadEvents();
        })
        .catch(error => console.error("Error creating event:", error));
    } else {
        alert("Please enter valid event details.");
    }
}

// Delete Event
function deleteEvent(id) {
    if (confirm("Are you sure you want to delete this event?")) {
        fetch(`${BASE_URL}/events/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Event deleted successfully!");
                loadEvents();
            })
            .catch(error => console.error("Error deleting event:", error));
    }
}

// Export Financial Report
function exportReport() {
    fetch(`${BASE_URL}/contributions`)
        .then(response => response.json())
        .then(contributions => {
            let csvContent = "data:text/csv;charset=utf-8,Date,Amount\n";
            contributions.forEach(c => {
                csvContent += `${c.date},${c.amount}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "financial_report.csv");
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
            alert("Financial report exported successfully!");
        })
        .catch(error => console.error("Error exporting report:", error));
}
