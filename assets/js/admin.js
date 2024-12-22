const BASE_URL = "http://localhost:4000";

// On Page Load - Fetch Financial Summary and Data
document.addEventListener("DOMContentLoaded", () => {
    fetchFinancialSummary();
    loadMembers();
    loadEvents();
    loadLoans(); // Load loans on page load
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
                    <button class="btn btn-danger btn-sm" onclick="removeMember('${user.id}')">Remove</button>
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

        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }

        const events = await response.json();
        const eventList = document.getElementById("eventList");
        eventList.innerHTML = ""; // Clear previous list

        events.forEach(event => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                ${event.name} - ${event.date}
                <button class="btn btn-danger btn-sm" onclick="deleteEvent('${event.id}')">Delete</button>
            `;
            eventList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Create Event
function createEvent() {
    const name = prompt("Enter the event name:");

    if (!name) {
        alert("Event name is required.");
        return;
    }

    const date = prompt("Enter the event date (YYYY-MM-DD):");

    // Validate the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
        alert("Please enter a valid date in the format YYYY-MM-DD.");
        return;
    }

    fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to create event");
            }
            return response.json();
        })
        .then(newEvent => {
            alert(`Event "${newEvent.name}" created successfully!`);
            loadEvents(); // Reload the event list to reflect the new event
        })
        .catch(error => {
            console.error("Error creating event:", error);
            alert("Failed to create the event. Please try again.");
        });
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

// Load Loans
async function loadLoans() {
    try {
        const loansResponse = await fetch(`${BASE_URL}/loans`);
        const loans = await loansResponse.json();

        const usersResponse = await fetch(`${BASE_URL}/users`);
        const users = await usersResponse.json();

        const loanList = document.getElementById("loanList");
        loanList.innerHTML = ""; // Clear previous list

        loans.forEach(loan => {
            const user = users.find(u => u.id === loan.userId);
            const userEmail = user ? user.email : "Unknown User";

            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <div>
                    <strong>User:</strong> ${userEmail}<br>
                    <strong>Amount:</strong> Ksh ${loan.amount}<br>
                    <strong>Status:</strong> <span id="status-${loan.id}">${loan.status || "pending"}</span>
                </div>
                <div>
                    <button class="btn btn-success btn-sm" onclick="updateLoanStatus('${loan.id}', 'approved')">Approve</button>
                    <button class="btn btn-warning btn-sm" onclick="updateLoanStatus('${loan.id}', 'pending')">Pend</button>
                </div>
            `;
            loanList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading loans:", error);
    }
}

// Update Loan Status
function updateLoanStatus(loanId, status) {
    fetch(`${BASE_URL}/loans/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update loan status");
            }
            return response.json();
        })
        .then(updatedLoan => {
            document.getElementById(`status-${loanId}`).innerText = updatedLoan.status;
            alert(`Loan status updated to "${updatedLoan.status}"`);
        })
        .catch(error => {
            console.error("Error updating loan status:", error);
            alert("Failed to update loan status. Please try again.");
        });
}
