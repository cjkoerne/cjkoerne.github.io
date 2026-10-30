async function loadActivities() {
  try {
    const response = await fetch("activities.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data.categories) || !Array.isArray(data.activityDetails)) {
      throw new Error("The JSON data is missing categories or activity details.");
    }
    return data;
  } catch (error) {
    console.error("Could not load activities.json:", error);
    const message = document.querySelector("#error-message");
    if (message) {
      message.textContent = "Activity data could not be loaded. Please check that activities.json is in the same folder as this page and try refreshing.";
    }
    return null;
  }
}

function makeImage(src, alt) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt || "";
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.hidden = true;
  });
  return image;
}

function displayCategories(categories) {
  const container = document.querySelector("#categories");
  if (!container) return;
  container.replaceChildren();

  categories.forEach(category => {
    const card = document.createElement("article");
    card.className = "category-card";
    const imageData = category.images && category.images[0];

    if (imageData) card.appendChild(makeImage(imageData.src, imageData.alt));

    const heading = document.createElement("h3");
    heading.textContent = category.title;
    const description = document.createElement("p");
    description.textContent = category.introduction;
    const link = document.createElement("a");
    link.className = "button-link";
    link.href = `two-step.html?category=${encodeURIComponent(category.id)}`;
    link.textContent = "Explore activities";

    card.append(heading, description, link);
    container.appendChild(card);
  });
}

function showActivityDetail(activity, category) {
  const container = document.querySelector("#activity-result");
  if (!container) return;
  container.replaceChildren();

  const card = document.createElement("article");
  card.className = "result-card";
  const heading = document.createElement("h2");
  heading.textContent = activity.title;
  card.appendChild(heading);

  const imageWrap = document.createElement("div");
  imageWrap.className = "activity-grid";
  activity.images.forEach(image => imageWrap.appendChild(makeImage(image.src, image.alt)));
  card.appendChild(imageWrap);

  const description = document.createElement("p");
  description.textContent = activity.description;
  card.appendChild(description);

  if (activity.destinations && activity.destinations.length) {
    const subheading = document.createElement("h3");
    subheading.textContent = `Best places for ${activity.title.toLowerCase()}`;
    card.appendChild(subheading);
    const list = document.createElement("ul");
    list.className = "destination-list";
    activity.destinations.forEach(destination => {
      const item = document.createElement("li");
      item.textContent = destination.details
        ? `${destination.name}: ${destination.details}`
        : destination.name;
      list.appendChild(item);
    });
    card.appendChild(list);
  }

  if (activity.extra) {
    const extra = document.createElement("p");
    extra.textContent = activity.extra;
    card.appendChild(extra);
  }

  container.appendChild(card);
  const message = document.querySelector("#two-step-message");
  if (message) message.textContent = `Showing ${activity.title} in ${category.title}.`;
}

function setupTwoStep(data) {
  const categorySelect = document.querySelector("#category-select");
  const activitySelect = document.querySelector("#activity-select");
  if (!categorySelect || !activitySelect) return;

  data.categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.has("category")) categorySelect.value = params.get("category");

  function fillActivities() {
    const category = data.categories.find(item => item.id === categorySelect.value);
    activitySelect.replaceChildren();
    const first = document.createElement("option");
    first.value = "";
    first.textContent = category ? "Select an activity" : "Choose a category first";
    activitySelect.appendChild(first);

    activitySelect.disabled = !category;
    document.querySelector("#activity-result").replaceChildren();

    if (!category) {
      document.querySelector("#two-step-message").textContent = "Choose a category to get started.";
      return;
    }

    category.activities.forEach(activity => {
      const option = document.createElement("option");
      option.value = activity.id;
      option.textContent = activity.title;
      activitySelect.appendChild(option);
    });
    document.querySelector("#two-step-message").textContent = `Now choose an activity in ${category.title}.`;
  }

  categorySelect.addEventListener("change", fillActivities);
  activitySelect.addEventListener("change", () => {
    const category = data.categories.find(item => item.id === categorySelect.value);
    const activity = data.activityDetails.find(item =>
      item.id === activitySelect.value && item.category === categorySelect.value
    );
    if (category && activity) showActivityDetail(activity, category);
    else document.querySelector("#activity-result").replaceChildren();
  });

  if (categorySelect.value) {
    fillActivities();
  }
}

function displayStaticActivities(activities) {
  const container = document.querySelector("#static-activities");
  if (!container) return;
  container.replaceChildren();

  activities.forEach(activity => {
    const card = document.createElement("article");
    card.className = "activity-card";
    if (activity.images && activity.images[0]) {
      card.appendChild(makeImage(activity.images[0].src, activity.images[0].alt));
    }
    const heading = document.createElement("h3");
    heading.textContent = activity.title;
    const description = document.createElement("p");
    description.textContent = activity.description;
    const category = document.createElement("p");
    category.textContent = `Category: ${activity.category}`;
    card.append(heading, category, description);

    if (activity.destinations && activity.destinations.length) {
      const subheading = document.createElement("h4");
      subheading.textContent = "Destinations";
      const list = document.createElement("ul");
      list.className = "destination-list";
      activity.destinations.forEach(destination => {
        const item = document.createElement("li");
        item.textContent = destination.details
          ? `${destination.name}: ${destination.details}`
          : destination.name;
        list.appendChild(item);
      });
      card.append(subheading, list);
    }
    container.appendChild(card);
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const formMessage = document.querySelector("#form-message");
    const name = document.querySelector("#name").value.trim();
    formMessage.textContent = `Thank you, ${name}! Your form was validated, but this demo does not send or store your information.`;
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadActivities();
  if (!data) return;

  const page = document.body.dataset.page;
  if (page === "home") displayCategories(data.categories);
  if (page === "two-step") setupTwoStep(data);
  if (page === "static-data") displayStaticActivities(data.activityDetails);
  if (page === "contact") setupContactForm();
});
