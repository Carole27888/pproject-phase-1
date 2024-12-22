const BASE_URL = "http://localhost:4000";

// On Page Load - Fetch Data
document.addEventListener("DOMContentLoaded", () => {
    loadContributions();
    loadLoanStatus();
    loadEvents();
    fetchTotalSavings();
});

// Load Contributions
async function loadContributions() {
    try {
        const response = await fetch(`${BASE_URL}/contributions`);
        const contributions = await response.json();

        const contributionHistory = document.getElementById("contributionHistory");
        contributionHistory.innerHTML = ""; // Clear list

        contributions.forEach(contribution => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerText = `Amount: Ksh ${contribution.amount} | Date: ${contribution.date}`;
            contributionHistory.appendChild(li);
        });

        contributionHistory.style.display = "none"; // Initially hidden
    } catch (error) {
        console.error("Error loading contributions:", error);
    }
}

// Add Contribution
function addContribution() {
    const newContribution = document.getElementById("newContribution").value;

    if (!newContribution || newContribution <= 0) {
        alert("Please enter a valid contribution amount.");
        return;
    }

    fetch(`${BASE_URL}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newContribution, date: new Date().toISOString().split("T")[0] })
    })
        .then(response => response.json())
        .then(() => {
            alert("Contribution added successfully!");
            loadContributions();
        })
        .catch(error => console.error("Error adding contribution:", error));
}

// Load Loan Status
async function loadLoanStatus() {
    try {
        const response = await fetch(`${BASE_URL}/loans`);
        const loans = await response.json();

        const loanStatus = document.getElementById("loanStatus");
        loanStatus.innerHTML = ""; // Clear list

        loans.forEach(loan => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerText = `Amount: Ksh ${loan.amount} | Status: ${loan.status || "pending"}`;
            loanStatus.appendChild(li);
        });

        loanStatus.style.display = "none"; // Initially hidden
    } catch (error) {
        console.error("Error loading loans:", error);
    }
}

// Load Events
async function loadEvents() {
    try {
        const response = await fetch(`${BASE_URL}/events`);
        const events = await response.json();

        const eventRSVP = document.getElementById("eventRSVP");
        eventRSVP.innerHTML = ""; // Clear list

        events.forEach(event => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerText = `${event.name} - ${event.date}`;
            eventRSVP.appendChild(li);
        });

        eventRSVP.style.display = "none"; // Initially hidden
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Fetch Total Savings
async function fetchTotalSavings() {
    try {
        const response = await fetch(`${BASE_URL}/contributions`);
        const contributions = await response.json();

        const totalSavings = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
        document.getElementById("totalSavings").innerText = `Ksh ${totalSavings}`;
    } catch (error) {
        console.error("Error fetching total savings:", error);
    }
}

// Toggle Visibility Functions
function toggleVisibility(sectionId, buttonId, showText, hideText) {
    const section = document.getElementById(sectionId);
    const button = document.getElementById(buttonId);

    if (section.style.display === "none") {
        section.style.display = "block";
        button.innerText = hideText;
    } else {
        section.style.display = "none";
        button.innerText = showText;
    }
}
