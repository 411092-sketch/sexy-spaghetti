// 預設的10個國中英文單字
const defaultWordCards = [
  {
    word: "ancient",
    chinese: "古老的",
    pos: "形容詞",
    example: "The ancient temple stood quietly on the hill.",
    root: "ancient = 年紀大、年代久遠"
  },
  {
    word: "capture",
    chinese: "抓住；捕捉",
    pos: "動詞",
    example: "The photographer tried to capture the perfect sunset.",
    root: "cap- / capt- = 拿、抓"
  },
  {
    word: "energy",
    chinese: "精力；能量",
    pos: "名詞",
    example: "She has a lot of energy after breakfast.",
    root: "en- = 使…, erg- = 工作、力量"
  },
  {
    word: "history",
    chinese: "歷史",
    pos: "名詞",
    example: "We learned about ancient history today.",
    root: "hist- = 了解、知識; -ory = 名詞"
  },
  {
    word: "imagine",
    chinese: "想像",
    pos: "動詞",
    example: "Try to imagine a world without phones.",
    root: "im- = 進入、使…; ag- = 做、動作"
  },
  {
    word: "journey",
    chinese: "旅程；旅行",
    pos: "名詞",
    example: "Their journey to the mountains lasted three days.",
    root: "jour- = 日、一天; -ney = 路程"
  },
  {
    word: "knowledge",
    chinese: "知識；學問",
    pos: "名詞",
    example: "Reading books helps you gain knowledge.",
    root: "know = 知道; -ledge = 狀態、結果"
  },
  {
    word: "modern",
    chinese: "現代的",
    pos: "形容詞",
    example: "The museum has many modern paintings.",
    root: "mod- = 方式、樣式; -ern = 形容詞後綴"
  },
  {
    word: "prepare",
    chinese: "準備",
    pos: "動詞",
    example: "Please prepare your notes before the test.",
    root: "pre- = 先; par- = 準備、等候"
  },
  {
    word: "simple",
    chinese: "簡單的",
    pos: "形容詞",
    example: "The math problem was simple enough for everyone.",
    root: "sim- = 相同; -ple = 折、摺" 
  }
];

// ============================================
// 存儲和數據管理
// ============================================

const STORAGE_KEY = 'wordCards';

// 從localStorage獲取所有單字
function getAllWords() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // 首次訪問，存儲預設數據
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWordCards));
  return defaultWordCards;
}

// 新增單字到localStorage
function addWord(word) {
  const words = getAllWords();
  // 避免重複
  if (words.some(w => w.word.toLowerCase() === word.word.toLowerCase())) {
    alert('該單字已存在!');
    return false;
  }
  words.push(word);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  return true;
}

// 刪除單字
function deleteWord(wordToDelete) {
  const words = getAllWords();
  const filtered = words.filter(w => w.word !== wordToDelete);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// ============================================
// 頁面功能
// ============================================

// 頁面切換
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageName = link.getAttribute('data-page');
    switchPage(pageName);
  });
});

function switchPage(pageName) {
  // 隱藏所有頁面
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  // 移除所有active導航
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  // 顯示選定頁面
  document.getElementById(pageName).classList.add('active');
  document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
  
  // 頁面切換時更新內容
  if (pageName === 'admin') {
    renderWordList();
  } else {
    renderCards();
  }
}

// ============================================
// 渲染卡片網格
// ============================================

function renderCards() {
  const cardGrid = document.getElementById('cardGrid');
  cardGrid.innerHTML = '';  // 清空
  
  const wordCards = getAllWords();
  
  wordCards.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';

    const inner = document.createElement('div');
    inner.className = 'card-inner';
    inner.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });

    const front = document.createElement('div');
    front.className = 'card-face front';
    front.innerHTML = `
      <h2 class="front-title">${item.word}</h2>
      <p class="front-subtitle">點擊卡片查看詞性、例句與字根分析</p>
      <div class="card-line"></div>
      <p class="flip-hint">Tap to flip</p>
    `;

    const back = document.createElement('div');
    back.className = 'card-face back';
    back.innerHTML = `
      <h3 class="back-title">${item.word}</h3>
      <div class="back-item"><strong>中文解釋</strong><p>${item.chinese}</p></div>
      <div class="back-item"><strong>詞性</strong><p>${item.pos}</p></div>
      <div class="back-item"><strong>例句</strong><p class="example">${item.example}</p></div>
      <div class="back-item"><strong>字根分析</strong><p>${item.root}</p></div>
      <p class="flip-hint">再次點擊可翻回</p>
    `;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    cardGrid.appendChild(card);
  });
}

// ============================================
// 管理頁面功能
// ============================================

// 表單提交
document.getElementById('addWordForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newWord = {
    word: document.getElementById('word').value.trim(),
    chinese: document.getElementById('meaning').value.trim(),
    pos: document.getElementById('partOfSpeech').value.trim(),
    example: document.getElementById('example').value.trim(),
    root: document.getElementById('rootAnalysis').value.trim()
  };
  
  if (addWord(newWord)) {
    // 清空表單
    document.getElementById('addWordForm').reset();
    // 更新列表
    renderWordList();
    // 也更新首頁的卡片
    renderCards();
    alert('新增成功!');
  }
});

// 渲染單字列表
function renderWordList() {
  const wordList = document.getElementById('wordList');
  const wordCount = document.getElementById('wordCount');
  const words = getAllWords();
  
  wordCount.textContent = words.length;
  wordList.innerHTML = '';
  
  if (words.length === 0) {
    wordList.innerHTML = '<div class="word-item-empty">尚無單字，請新增。</div>';
    return;
  }
  
  words.forEach((word, index) => {
    const item = document.createElement('div');
    item.className = 'word-item';
    item.innerHTML = `
      <div class="word-item-header">
        <span class="word-item-word">${word.word}</span>
        <span class="word-item-pos">${word.pos}</span>
      </div>
      <div class="word-item-content">
        <div class="word-item-row">
          <strong>中文:</strong>
          <span>${word.chinese}</span>
        </div>
        <div class="word-item-row">
          <strong>例句:</strong>
          <span>${word.example}</span>
        </div>
        <div class="word-item-row">
          <strong>字根:</strong>
          <span>${word.root}</span>
        </div>
        <div style="margin-top: 0.75rem;">
          <button class="btn btn-delete" data-word="${word.word}">刪除</button>
        </div>
      </div>
    `;
    wordList.appendChild(item);
  });
  
  // 綁定刪除按鈕
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wordToDelete = e.target.getAttribute('data-word');
      if (confirm(`確定要刪除 "${wordToDelete}" 嗎?`)) {
        deleteWord(wordToDelete);
        renderWordList();
        renderCards();
      }
    });
  });
}

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderCards();
});
