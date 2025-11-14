const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// 🔍 Zoek nummers
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  showData(data);
}

// 🎧 Toon lijst met resultaten
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `
        <li>
          <span><strong>${song.artist.name}</strong> - ${song.title}</span>
          <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Lyrics</button>
        </li>`
        )
        .join('')}
    </ul>
  `;
  more.innerHTML = '';
}

// 🎤 Haal lyrics op
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics
    ? data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    : 'Geen songtekst gevonden 😢';

  result.innerHTML = `
    <h2 class="lyrics-title"><strong>${artist}</strong> - ${songTitle}</h2>
    <p class="lyrics-text">${lyrics}</p>
  `;
  more.innerHTML = '';
}

// 🖱️ Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert('Voer een zoekterm in.');
    return;
  }
  searchSongs(searchTerm);
});

result.addEventListener('click', (e) => {
  const clickedEl = e.target;
  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');
    getLyrics(artist, songTitle);
  }
});
