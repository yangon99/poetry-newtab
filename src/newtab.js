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
    this.settingsToggle = document.getElementById('settingsToggle');
    this.settingsPanel = document.getElementById('settingsPanel');
    this.typewriterModeSelect = document.getElementById('typewriterMode');
    this.authorAlignSelect = document.getElementById('authorAlign');
    
    this.history = this.loadHistory();
    this.maxHistoryItems = 10;
    this.settings = this.loadSettings();
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.renderHistory();
    this.initSettings();
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
    const authorInfo = `—— ${origin.author}《${origin.title}》`;
    
    // 决定是否使用打字机效果（新诗词可以使用 always 或 newOnly 模式）
    const shouldUseTypewriter = this.settings.typewriterMode === 'always' || 
                               this.settings.typewriterMode === 'newOnly';
    
    this.displayContent(content, authorInfo, shouldUseTypewriter);
  }

  displayHistoryPoem(data) {
    const authorInfo = `—— ${data.author}《${data.title}》`;
    
    // 历史诗词只在 always 模式下使用打字机效果
    const shouldUseTypewriter = this.settings.typewriterMode === 'always';
    
    this.displayContent(data.content, authorInfo, shouldUseTypewriter);
  }

  displayContent(content, authorInfo, useTypewriter) {
    this.hideLoading();
    this.hideError();
    
    // 清空之前的内容
    this.poemEl.innerHTML = '';
    this.fromEl.innerHTML = '';
    
    // 应用作者信息样式
    this.applyAuthorStyle();
    
    if (useTypewriter) {
      // 使用打字机效果显示诗词
      this.typewriterEffect(this.poemEl, content, () => {
        // 诗词显示完成后显示作者信息
        this.typewriterEffect(this.fromEl, authorInfo);
      });
    } else {
      // 直接显示内容
      this.poemEl.textContent = content;
      this.fromEl.textContent = authorInfo;
    }
    
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
    this.settingsToggle.addEventListener('click', () => this.toggleSettings());
    this.typewriterModeSelect.addEventListener('change', () => this.saveSettings());
    this.authorAlignSelect.addEventListener('change', () => this.saveSettings());
    
    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      const isClickInsideHistoryPanel = this.historyPanel.contains(e.target);
      const isClickOnHistoryToggle = this.historyToggle.contains(e.target);
      const isClickInsideSettingsPanel = this.settingsPanel.contains(e.target);
      const isClickOnSettingsToggle = this.settingsToggle.contains(e.target);
      
      if (!isClickInsideHistoryPanel && !isClickOnHistoryToggle) {
        this.hideHistory();
      }
      
      if (!isClickInsideSettingsPanel && !isClickOnSettingsToggle) {
        this.hideSettings();
      }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.fetchPoem();
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleHistory();
      } else if (e.key === 's' || e.key === 'S') {
        this.toggleSettings();
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
    // 清空历史记录列表
    this.historyList.innerHTML = '';
    
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<div class="history-empty">暂无历史记录</div>';
      return;
    }
    
    // 安全地创建历史记录项
    this.history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      // 直接在元素上存储数据引用，而不是使用 data 属性
      historyItem._historyData = item;
      
      const poemDiv = document.createElement('div');
      poemDiv.className = 'history-poem';
      poemDiv.textContent = item.content;
      
      const authorDiv = document.createElement('div');
      authorDiv.className = 'history-author';
      authorDiv.textContent = `—— ${item.author}《${item.title}》`;
      
      historyItem.appendChild(poemDiv);
      historyItem.appendChild(authorDiv);
      
      // 添加点击事件
      historyItem.addEventListener('click', () => {
        const historyData = historyItem._historyData;
        if (historyData) {
          this.displayHistoryPoem(historyData);
          this.hideHistory();
        }
      });
      
      this.historyList.appendChild(historyItem);
    });
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
  
  // 设置功能
  loadSettings() {
    try {
      const saved = localStorage.getItem('poetry-settings');
      const defaultSettings = {
        typewriterMode: 'always', // 'always', 'newOnly', 'never'
        authorAlign: 'center' // 'left', 'center', 'right', 'hidden'
      };
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.error('加载设置失败:', error);
      return { typewriterMode: 'always', authorAlign: 'center' };
    }
  }
  
  saveSettings() {
    try {
      this.settings.typewriterMode = this.typewriterModeSelect.value;
      this.settings.authorAlign = this.authorAlignSelect.value;
      localStorage.setItem('poetry-settings', JSON.stringify(this.settings));
      
      // 立即应用作者信息样式
      this.applyAuthorStyle();
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }
  
  initSettings() {
    this.typewriterModeSelect.value = this.settings.typewriterMode;
    this.authorAlignSelect.value = this.settings.authorAlign;
    // 初始化时应用作者信息样式
    this.applyAuthorStyle();
  }
  
  applyAuthorStyle() {
    // 清除所有对齐类
    this.fromEl.classList.remove('align-left', 'align-center', 'align-right', 'hidden');
    
    // 根据设置应用相应的样式
    switch (this.settings.authorAlign) {
      case 'left':
        this.fromEl.classList.add('align-left');
        break;
      case 'center':
        this.fromEl.classList.add('align-center');
        break;
      case 'right':
        this.fromEl.classList.add('align-right');
        break;
      case 'hidden':
        this.fromEl.classList.add('hidden');
        break;
    }
  }
  
  toggleSettings() {
    this.settingsPanel.classList.toggle('hidden');
  }
  
  hideSettings() {
    this.settingsPanel.classList.add('hidden');
  }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new PoemApp();
});
