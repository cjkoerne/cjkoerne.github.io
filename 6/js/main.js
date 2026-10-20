
async function loadActivities() {
    try {
        const response = await fetch("./activities.json");

        if (!response.ok) {
            throw new Error("Could not load activities.json");
        }

        const data = await response.json();

        console.log("Activities loaded successfully!", data);

        return data;
    } catch (error) {
        console.error("Error loading activity data:", error);

        const message = document.querySelector("#error-message");
        if (message) {
            message.textContent =
                "Sorry, the activity information could not be loaded. Please try again later.";
        }

        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const activities = await loadActivities();

    if (activities) {
        document.dispatchEvent(
            new CustomEvent("activitiesLoaded", {
                detail: activities
            })
        );
    }
});
