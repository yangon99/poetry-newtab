// 导入 jinrishici npm 包
import { load as jinrishici } from 'jinrishici';

class PoemApp {
  constructor() {
    this.loadingEl = document.getElementById('loading');
    this.contentEl = document.getElementById('content');
    this.errorEl = document.getElementById('error');
    this.poemEl = document.getElementById('poem');
    this.fromEl = document.getElementById('from');
    this.refreshBtn = document.getElementById('refresh');
    this.retryBtn = document.getElementById('retry');
    this.historyToggle = document.getElementById('historyToggle');
    this.historyPanel = document.getElementById('historyPanel');
    this.historyList = document.getElementById('historyList');
    this.clearHistoryBtn = document.getElementById('clearHistory');
    
    this.history = this.loadHistory();
    this.maxHistoryItems = 10;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.renderHistory();
    this.fetchPoem();
  }
  
  async fetchPoem() {
    this.showLoading();
    
    try {
      // 使用 jinrishici npm 包
      const result = await new Promise((resolve, reject) => {
        jinrishici(
          (data) => resolve(data),
          (error) => reject(error)
        );
      });
      
      if (result && result.data) {
        this.displayPoem(result.data);
        this.addToHistory(result.data);
      } else {
        throw new Error('获取诗词失败');
      }
    } catch (error) {
      console.error('获取诗词失败:', error);
      this.showError();
    }
  }
  
  displayPoem(data) {
    const { content, origin } = data;
    
    this.hideLoading();
    this.hideError();
    
    // 清空之前的内容
    this.poemEl.innerHTML = '';
    this.fromEl.innerHTML = '';
    
    // 使用打字机效果显示诗词
    this.typewriterEffect(this.poemEl, content, () => {
      // 诗词显示完成后显示作者信息
      const authorInfo = `—— ${origin.author}《${origin.title}》`;
      this.typewriterEffect(this.fromEl, authorInfo);
    });
    
    this.showContent();
  }
  
  typewriterEffect(element, text, callback) {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        if (callback) callback();
      }
    }, 50);
  }
  
  bindEvents() {
    this.refreshBtn.addEventListener('click', () => this.fetchPoem());
    this.retryBtn.addEventListener('click', () => this.fetchPoem());
    this.historyToggle.addEventListener('click', () => this.toggleHistory());
    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    
    // 点击外部关闭历史面板
    document.addEventListener('click', (e) => {
      const isClickInsidePanel = this.historyPanel.contains(e.target);
      const isClickOnToggle = this.historyToggle.contains(e.target);
      
      if (!isClickInsidePanel && !isClickOnToggle) {
        this.hideHistory();
      }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.fetchPoem();
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleHistory();
      }
    });
  }
  
  showLoading() {
    this.loadingEl.classList.remove('hidden');
    this.contentEl.classList.add('hidden');
    this.errorEl.classList.add('hidden');
  }
  
  hideLoading() {
    this.loadingEl.classList.add('hidden');
  }
  
  showContent() {
    this.contentEl.classList.remove('hidden');
  }
  
  showError() {
    this.hideLoading();
    this.contentEl.classList.add('hidden');
    this.errorEl.classList.remove('hidden');
  }
  
  hideError() {
    this.errorEl.classList.add('hidden');
  }
  
  // 历史记录功能
  addToHistory(data) {
    const historyItem = {
      content: data.content,
      author: data.origin.author,
      title: data.origin.title,
      timestamp: Date.now()
    };
    
    // 避免重复添加相同内容
    const exists = this.history.some(item => item.content === historyItem.content);
    if (exists) return;
    
    this.history.unshift(historyItem);
    
    // 限制历史记录数量
    if (this.history.length > this.maxHistoryItems) {
      this.history = this.history.slice(0, this.maxHistoryItems);
    }
    
    this.saveHistory();
    this.renderHistory();
  }
  
  loadHistory() {
    try {
      const saved = localStorage.getItem('poetry-history');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('加载历史记录失败:', error);
      return [];
    }
  }
  
  saveHistory() {
    try {
      localStorage.setItem('poetry-history', JSON.stringify(this.history));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }
  
  renderHistory() {
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<div class="history-empty">暂无历史记录</div>';
      return;
    }
    
    const historyHTML = this.history.map(item => `
      <div class="history-item" data-content="${item.content}">
        <div class="history-poem">${item.content}</div>
        <div class="history-author">—— ${item.author}《${item.title}》</div>
      </div>
    `).join('');
    
    this.historyList.innerHTML = historyHTML;
    
    // 为历史记录项添加点击事件
    this.historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const content = item.dataset.content;
        const historyData = this.history.find(h => h.content === content);
        if (historyData) {
          this.displayHistoryPoem(historyData);
          this.hideHistory();
        }
      });
    });
  }
  
  displayHistoryPoem(data) {
    this.hideLoading();
    this.hideError();
    
    // 清空之前的内容
    this.poemEl.innerHTML = '';
    this.fromEl.innerHTML = '';
    
    // 直接显示历史诗词，不使用打字机效果
    this.poemEl.textContent = data.content;
    this.fromEl.textContent = `—— ${data.author}《${data.title}》`;
    
    this.showContent();
  }
  
  toggleHistory() {
    this.historyPanel.classList.toggle('hidden');
  }
  
  hideHistory() {
    this.historyPanel.classList.add('hidden');
  }
  
  clearHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
      this.history = [];
      this.saveHistory();
      this.renderHistory();
    }
  }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new PoemApp();
});
