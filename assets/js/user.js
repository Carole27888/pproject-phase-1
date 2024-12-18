const BASE_URL = "http://localhost:4000";

// Fetch and display contributions
async function fetchContributions() {
    const contributions = await (await fetch(`${BASE_URL}/contributions`)).json();

    const contributionList = document.getElementById("contributionHistory");
    contributions.forEach((contribution) => {
        const li = document.createElement("li");
        li.textContent = `Amount: Ksh ${contribution.amount} | Date: ${contribution.date}`;
        li.className = "list-group-item";
        contributionList.appendChild(li);
    });
}

// Add new contribution
async function addContribution() {
    const amount = document.getElementById("newContribution").value;

    if (!amount || amount <= 0) {
        alert("Please enter a valid contribution amount.");
        return;
    }

    await fetch(`${BASE_URL}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: 2, // Replace with dynamic user ID
            amount: parseInt(amount),
            date: new Date().toISOString().split("T")[0],
        }),
    });

    alert("Contribution added successfully!");
    document.getElementById("newContribution").value = "";
    fetchContributions();
}

// Fetch loans
async function fetchLoanStatus() {
    const loans = await (await fetch(`${BASE_URL}/loans`)).json();

    const loanList = document.getElementById("loanStatus");
    loans.forEach((loan) => {
        const li = document.createElement("li");
        li.textContent = `Amount: Ksh ${loan.amount} | Status: ${loan.status}`;
        li.className = "list-group-item";
        loanList.appendChild(li);
    });
}

// Fetch events
async function fetchEvents() {
    const events = await (await fetch(`${BASE_URL}/events`)).json();

    const eventList = document.getElementById("eventRSVP");
    events.forEach((event) => {
        const li = document.createElement("li");
        li.textContent = `${event.name} on ${event.date} at ${event.location}`;
        li.className = "list-group-item";
        eventList.appendChild(li);
    });
}

// Fetch savings progress
async function fetchSavings() {
    const contributions = await (await fetch(`${BASE_URL}/contributions`)).json();
    const totalSavings = contributions.reduce((sum, c) => sum + c.amount, 0);

    document.getElementById("totalSavings").textContent = `Ksh ${totalSavings}`;
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
    fetchContributions();
    fetchLoanStatus();
    fetchEvents();
    fetchSavings();
});
