<script>
  let games = [];

  function switchTab(tab) {
    document.getElementById('juegosTab').classList.toggle('hidden', tab !== 'juegos');
    document.getElementById('statsTab').classList.toggle('hidden', tab !== 'stats');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab')[tab === 'juegos' ? 0 : 1].classList.add('active');
    if (tab === 'stats') updateStats();
  }

function updateStats() {
  const stats = {
    Jugando: 0,
    Completado: 0,
    "En pausa": 0,
    Abandonado: 0,
    totalLogros: 0,
    logrosDesbloqueados: 0
  };

  games.forEach(g => {
    stats[g.status] = (stats[g.status] || 0) + 1;
    stats.totalLogros += g.total;
    stats.logrosDesbloqueados += g.unlocked;
  });

  const cont = document.getElementById('generalStats');
  cont.innerHTML = `
    🎮 Jugando: ${stats.Jugando}<br>
    ✅ Completado: ${stats.Completado}<br>
    ⏸️ En pausa: ${stats["En pausa"]}<br>
    🚫 Abandonado: ${stats.Abandonado}<br><br>
    🏆 Logros totales: ${stats.totalLogros}<br>
    ⭐ Logros desbloqueados: ${stats.logrosDesbloqueados}
  `;
}

  function addGame() {
    const name = document.getElementById('gameName').value.trim();
    const status = document.getElementById('gameStatus').value;
    const unlocked = parseInt(document.getElementById('achievementsUnlocked').value);
    const total = parseInt(document.getElementById('achievementsTotal').value);
    const imageUrl = document.getElementById('gameImageUrl').value.trim();
    const imageFile = document.getElementById('gameImageFile').files[0];

    if (!name || isNaN(unlocked) || isNaN(total)) return;

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageData = e.target.result;
        games.push({ name, status, unlocked, total, image: imageData });
        saveGames();
        clearForm();
        renderGames();
      };
      reader.readAsDataURL(imageFile);
    } else {
      const finalImage = imageUrl || '';
      games.push({ name, status, unlocked, total, image: finalImage });
      saveGames();
      clearForm();
      renderGames();
    }
  }

  function clearForm() {
    document.getElementById('gameName').value = '';
    document.getElementById('achievementsUnlocked').value = '';
    document.getElementById('achievementsTotal').value = '';
    document.getElementById('gameImageUrl').value = '';
    document.getElementById('gameImageFile').value = '';
  }

  function renderGames() {
    const container = document.getElementById('gamesList');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('filterStatus').value;
    container.innerHTML = '';

    games.filter(g => 
      g.name.toLowerCase().includes(search) &&
      (!filter || g.status === filter)
    ).forEach((g, index) => {
      const div = document.createElement('div');
      div.className = 'game-card fade-in';

      const imgHtml = g.image ? `<img src="${g.image}" alt="${g.name}" class="game-image-side">` : '';

      div.innerHTML = `
        <div class="game-card-content">
          ${imgHtml}
          <div class="game-info">
            <h3>${g.name}</h3>
            <p><strong>Estado:</strong> ${getStatusEmoji(g.status)} ${g.status}</p>
            <p><strong>Logros:</strong> ${g.unlocked} / ${g.total}</p>
            <button onclick="openEditForm(${index})">✏️ Editar</button>
            <button onclick="deleteGame(${index})">🗑️ Eliminar</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  function openEditForm(index) {
    const game = games[index];
    editIndex = index;
    document.getElementById('editName').value = game.name;
    document.getElementById('editStatus').value = game.status;
    document.getElementById('editUnlocked').value = game.unlocked;
    document.getElementById('editTotal').value = game.total;

    // Cargar la imagen actual en el formulario de edición
    document.getElementById('editImage').src = game.image || '';
    document.getElementById('editForm').classList.remove('hidden');
  }

  function closeEditForm() {
    document.getElementById('editForm').classList.add('hidden');
  }

  function saveEdit() {
    const name = document.getElementById('editName').value.trim();
    const status = document.getElementById('editStatus').value;
    const unlocked = parseInt(document.getElementById('editUnlocked').value);
    const total = parseInt(document.getElementById('editTotal').value);

    const imageUrl = document.getElementById('editImage').src; // Mantener la imagen

    if (!name || isNaN(unlocked) || isNaN(total)) return;

    games[editIndex] = { name, status, unlocked, total, image: imageUrl };
    saveGames();
    renderGames();
    closeEditForm();
  }

  function saveGames() {
    localStorage.setItem('videoGameTracker', JSON.stringify(games));
  }

  function loadGames() {
    const data = localStorage.getItem('videoGameTracker');
    if (data) games = JSON.parse(data);
    renderGames();
  }

  function deleteGame(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este juego?")) {
      games.splice(index, 1);
      saveGames();
      renderGames();
    }
  }

  function getStatusEmoji(status) {
    return {
      "Jugando": "🎮",
      "Completado": "✅",
      "En pausa": "⏸️",
      "Abandonado": "🚫"
    }[status] || "";
  }

  loadGames();
</script>