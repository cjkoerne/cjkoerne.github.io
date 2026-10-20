
async function loadActivities() {
    try {
        const response = await fetch("./activities.json");

        if (!response.ok) {
            throw new Error("Could not load activities.json");
        }

        const data = await response.json();
        displayCategories(data.categories);
    } catch (error) {
        console.error("Error loading activity data:", error);

        const container = document.querySelector("#categories");
        if (container) {
            container.textContent =
                "Sorry, the activities could not be loaded. Please try again.";
        }

        const message = document.querySelector("#error-message");
        if (message) {
            message.textContent = "Please refresh the page or try again later.";
        }
    }
}

function displayCategories(categories) {
    const container = document.querySelector("#categories");

    if (!container || !Array.isArray(categories)) {
        return;
    }

    container.replaceChildren();

    categories.forEach(category => {
        const card = document.createElement("article");
        card.className = "category-card";

        const heading = document.createElement("h3");
        heading.textContent = category.title;

        const description = document.createElement("p");
        description.textContent = category.introduction;

        const image = document.createElement("img");
        image.src = category.images[0].src;
        image.alt = category.images[0].alt;

        const link = document.createElement("a");
        link.href = "two-step.html";
        link.textContent = "Explore activities";

        link.addEventListener("click", () => {
            sessionStorage.setItem("selectedCategory", category.id);
        });

        card.append(image, heading, description, link);
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", loadActivities);
