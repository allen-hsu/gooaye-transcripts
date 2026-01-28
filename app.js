// Podcast data
let episodes = [];

// DOM Elements
const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalBody = document.getElementById('modal-body');

// Load data
async function loadData() {
    cardsContainer.innerHTML = '<div class="loading">載入中...</div>';
    
    try {
        const response = await fetch('data/episodes.json');
        episodes = await response.json();
        renderCards(episodes);
    } catch (error) {
        console.error('Error loading data:', error);
        cardsContainer.innerHTML = '<div class="no-results">無法載入資料</div>';
    }
}

// Generate summary from transcript
function generateSummary(transcript, maxLength = 200) {
    // Skip ad content at the beginning
    const lines = transcript.split('\n').filter(line => line.trim());
    let content = '';
    
    for (const line of lines) {
        // Skip obvious ads
        if (line.includes('贊助') || line.includes('優惠碼') || line.includes('連結附上')) {
            continue;
        }
        content += line + ' ';
        if (content.length > maxLength) break;
    }
    
    return content.trim().slice(0, maxLength) + '...';
}

// Extract tags from content
function extractTags(transcript) {
    const tags = [];
    const keywords = [
        { word: '台積電', tag: '台積電' },
        { word: 'AI', tag: 'AI' },
        { word: '衛星', tag: '衛星' },
        { word: '低軌道', tag: '低軌衛星' },
        { word: 'SpaceX', tag: 'SpaceX' },
        { word: 'Starlink', tag: 'Starlink' },
        { word: '記憶體', tag: '記憶體' },
        { word: '被動元件', tag: '被動元件' },
        { word: '漲價', tag: '漲價' },
        { word: '川普', tag: '川普' },
        { word: '關稅', tag: '關稅' },
        { word: 'PCB', tag: 'PCB' },
        { word: '伺服器', tag: '伺服器' },
        { word: '網通', tag: '網通' },
        { word: 'Tesla', tag: 'Tesla' },
    ];
    
    for (const { word, tag } of keywords) {
        if (transcript.includes(word) && !tags.includes(tag)) {
            tags.push(tag);
            if (tags.length >= 4) break;
        }
    }
    
    return tags;
}

// Render cards
function renderCards(data) {
    if (data.length === 0) {
        cardsContainer.innerHTML = '<div class="no-results">找不到相關內容</div>';
        return;
    }
    
    cardsContainer.innerHTML = data.map((ep, index) => {
        const summary = generateSummary(ep.transcript);
        const tags = extractTags(ep.transcript);
        
        return `
            <div class="card" data-index="${index}">
                <div class="card-header">
                    <span class="card-episode">${ep.episode}</span>
                    <span class="card-date">${ep.date}</span>
                </div>
                <h3 class="card-title">${ep.title}</h3>
                <p class="card-summary">${summary}</p>
                ${tags.length > 0 ? `
                    <div class="card-tags">
                        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            openModal(data[index]);
        });
    });
}

// Open modal
function openModal(episode) {
    modalTitle.textContent = `${episode.episode} - ${episode.title}`;
    modalDate.textContent = episode.date;
    modalBody.textContent = episode.transcript;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        renderCards(episodes);
        return;
    }
    
    const filtered = episodes.filter(ep => {
        return ep.title.toLowerCase().includes(query) ||
               ep.transcript.toLowerCase().includes(query) ||
               ep.episode.toLowerCase().includes(query);
    });
    
    renderCards(filtered);
}

// Event listeners
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300);
});

// Initialize
loadData();
