const grid = document.getElementById("modsGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-pill");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");

let mods = [];
let activeFilter = "all";

fetch("/data/mods.json")
  .then(res => res.json())
  .then(data => {
    mods = data;
    render();
  });

function render() {
  const search = searchInput.value.toLowerCase();

  const filtered = mods.filter(mod => {
    const matchesFilter =
      activeFilter === "all" ||
      mod.category.includes(activeFilter);

    const matchesSearch =
      mod.title.toLowerCase().includes(search) ||
      mod.description.toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = "";

  filtered.forEach(mod => {
    const card = document.createElement("article");
    card.className = "mod-card";

    card.innerHTML = `
      <div class="mod-thumb">
        <img src="${mod.image}" alt="${mod.title}" />
        <span class="badge ${mod.badge}">${mod.badge}</span>
      </div>

      <div class="mod-body">
        <div class="mod-meta">
          ${mod.tags.map(tag => `<span class="mini-tag">${tag}</span>`).join("")}
        </div>

        <h3>${mod.title}</h3>
        <p>${mod.description}</p>

        <div class="mod-actions">
          <a href="${mod.link}" class="action-btn primary" target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  resultsCount.textContent = `Showing ${filtered.length} item${filtered.length !== 1 ? "s" : ""}`;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });
});

searchInput.addEventListener("input", render);
