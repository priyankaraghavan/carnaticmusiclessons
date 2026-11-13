const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function monthKey(dateStr) {
  const [y, m] = dateStr.split("-").map(Number);
  return `${y}-${String(m).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function renderLessons(lessons) {
  const container = document.getElementById("lessons");
  const summaryEl = document.getElementById("summary");

  if (!lessons.length) {
    container.innerHTML = '<p class="empty-state">No lessons logged yet.</p>';
    return;
  }

  const sorted = [...lessons].sort((a, b) => b.date.localeCompare(a.date));

  const groups = new Map();
  for (const lesson of sorted) {
    const key = monthKey(lesson.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(lesson);
  }

  const monthCount = groups.size;
  const totalCount = sorted.length;
  summaryEl.innerHTML = `
    <div class="summary-item"><span class="num">${totalCount}</span><span class="label">Total lessons logged</span></div>
    <div class="summary-item"><span class="num">${monthCount}</span><span class="label">Months tracked</span></div>
    <div class="summary-item"><span class="num">${monthLabel([...groups.keys()][0])}</span><span class="label">Most recent month</span></div>
  `;

  container.innerHTML = "";
  for (const [key, monthLessons] of groups) {
    const group = document.createElement("section");
    group.className = "month-group";

    const heading = document.createElement("div");
    heading.className = "month-heading";
    heading.innerHTML = `${monthLabel(key)} <span class="count">(${monthLessons.length} ${monthLessons.length === 1 ? "class" : "classes"})</span>`;
    group.appendChild(heading);

    for (const lesson of monthLessons) {
      const card = document.createElement("div");
      card.className = "lesson-card";
      card.innerHTML = `
        <div class="lesson-date">${formatDate(lesson.date)}</div>
        <div class="lesson-topics">${lesson.topics}</div>
        ${lesson.notes ? `<div class="lesson-notes">${lesson.notes}</div>` : ""}
      `;
      group.appendChild(card);
    }

    container.appendChild(group);
  }
}

fetch("lessons.json")
  .then((res) => res.json())
  .then(renderLessons)
  .catch((err) => {
    document.getElementById("lessons").innerHTML =
      '<p class="empty-state">Could not load lessons.json</p>';
    console.error(err);
  });
