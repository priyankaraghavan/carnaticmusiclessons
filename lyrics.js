function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderDirectory(songs) {
  document.getElementById("header-title").textContent = "Song Lyrics";
  document.getElementById("header-subtitle").textContent = "Songs Niranjana has learned, with raga, tala & lyrics";
  document.title = "Song Lyrics · Niranjana's Lesson Journal";

  const content = document.getElementById("content");
  if (!songs.length) {
    content.innerHTML = '<p class="empty-state">No songs added yet.</p>';
    return;
  }

  content.innerHTML = '<div class="song-grid"></div>';
  const grid = content.querySelector(".song-grid");
  for (const song of songs) {
    const card = document.createElement("a");
    card.className = "song-card";
    card.href = `lyrics.html?song=${encodeURIComponent(song.slug)}`;
    card.innerHTML = `
      <div class="song-card-title">${escapeHtml(song.title)}</div>
      <div class="song-card-meta">${escapeHtml(song.raga || "")}${song.raga && song.tala ? " &middot; " : ""}${escapeHtml(song.tala || "")}</div>
      <div class="song-card-composer">${escapeHtml(song.composer || "")}</div>
    `;
    grid.appendChild(card);
  }
}

function renderSong(song) {
  document.getElementById("header-title").textContent = song.title;
  document.getElementById("header-subtitle").textContent = [song.raga, song.tala, song.composer].filter(Boolean).join(" · ");
  document.title = `${song.title} · Niranjana's Lesson Journal`;

  const content = document.getElementById("content");
  const sectionsHtml = (song.sections || [])
    .map(
      (section) => `
        <div class="lyric-section">
          <div class="lyric-section-label">${escapeHtml(section.label)}</div>
          ${section.lines.map((line) => `<p class="lyric-line">${escapeHtml(line)}</p>`).join("")}
        </div>
      `
    )
    .join("");

  content.innerHTML = `
    <p class="nav-links"><a href="lyrics.html">&larr; All songs</a></p>
    <div class="song-detail">
      ${sectionsHtml}
      ${song.notes ? `<div class="song-notes">${escapeHtml(song.notes)}</div>` : ""}
      ${song.source ? `<p class="song-source"><a href="${escapeHtml(song.source)}" target="_blank" rel="noopener">Full lyrics / source &rarr;</a></p>` : ""}
    </div>
  `;
}

fetch("songs.json")
  .then((res) => res.json())
  .then((songs) => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("song");

    if (!slug) {
      renderDirectory(songs);
      return;
    }

    const song = songs.find((s) => s.slug === slug);
    if (!song) {
      document.getElementById("content").innerHTML =
        '<p class="empty-state">Song not found. <a href="lyrics.html">See all songs</a></p>';
      return;
    }
    renderSong(song);
  })
  .catch((err) => {
    document.getElementById("content").innerHTML =
      '<p class="empty-state">Could not load songs.json</p>';
    console.error(err);
  });
