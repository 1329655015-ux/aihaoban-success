/**
 * 搜索模块
 * 处理工具搜索功能，包括实时搜索和搜索建议
 */

const Search = {
    // 模块配置
    config: {
        debounceDelay: 300,
        minQueryLength: 1,
        maxSuggestions: 5,
        highlightClass: 'highlight',
        searchHistoryKey: 'search_history',
        maxHistoryItems: 10
    },

    // 模块状态
    state: {
        query: '',
        isSearching: false,
        hasResults: false,
        currentFocus: -1,
        searchHistory: [],
        suggestions: []
    },

    /**
     * 初始化搜索模块
     */
    init() {
        console.log('初始化搜索模块');

        this.createSearchInterface();
        this.loadSearchHistory();
        this.bindEvents();

        return this;
    },

    /**
     * 创建搜索界面
     */
    createSearchInterface() {
        // 查找或创建搜索容器
        let searchContainer = document.querySelector('.search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            
            const headerActions = document.querySelector('.header-actions');
            if (headerActions) {
                headerActions.prepend(searchContainer);
            }
        }

        // 搜索框HTML
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="搜索AI工具..." autocomplete="off">
                <button class="search-btn btn btn-primary" type="button">
                    <span class="search-icon">🔍</span>
                </button>
                <button class="search-clear btn btn-ghost" type="button" style="display: none;">
                    <span>×</span>
                </button>
            </div>
            <div class="search-suggestions"></div>
        `;

        // 添加搜索样式
        this.addSearchStyles();

        console.log('搜索界面创建完成');
    },

    /**
     * 添加搜索样式
     */
    addSearchStyles() {
        // 如果已经添加过样式，则跳过
        if (document.getElementById('search-styles')) return;

        const styles = `
            .search-container {
                position: relative;
                margin-right: 10px;
            }

            .search-box {
                display: flex;
                align-items: center;
                background: var(--bg-secondary);
                border-radius: var(--radius-lg);
                padding: 8px;
                transition: all 0.3s ease;
                border: 1px solid transparent;
            }

            .search-box:focus-within {
                background: var(--bg-primary);
                border-color: var(--primary-color);
                box-shadow: var(--shadow-md);
            }

            .search-input {
                flex: 1;
                border: none;
                background: none;
                outline: none;
                padding: 0 8px;
                font-size: var(--font-size-sm);
                color: var(--text-primary);
            }

            .search-input::placeholder {
                color: var(--text-muted);
            }

            .search-btn {
                padding: 6px 12px;
                border-radius: var(--radius-md);
            }

            .search-clear {
                padding: 4px;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: var(--z-dropdown);
                max-height: 300px;
                overflow-y: auto;
                display: none;
                margin-top: 4px;
            }

            .search-suggestions.show {
                display: block;
            }

            .suggestion-item {
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid var(--border-light);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .suggestion-item:hover,
            .suggestion-item.focused {
                background: var(--bg-secondary);
            }

            .suggestion-item:last-child {
                border-bottom: none;
            }

            .suggestion-icon {
                font-size: 16px;
                opacity: 0.7;
            }

            .suggestion-text {
                flex: 1;
            }

            .suggestion-name {
                font-weight: 500;
                font-size: var(--font-size-sm);
                margin-bottom: 2px;
            }

            .suggestion-description {
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }

            .search-history {
                border-top: 1px solid var(--border-light);
                padding: 8px 0;
            }

            .search-history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 16px;
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }

            .clear-history {
                background: none;
                border: none;
                color: var(--primary-color);
                cursor: pointer;
                font-size: var(--font-size-xs);
            }

            .history-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                cursor: pointer;
            }

            .history-item:hover {
                background: var(--bg-secondary);
            }

            .history-icon {
                font-size: 14px;
                opacity: 0.6;
            }

            .history-query {
                flex: 1;
                font-size: var(--font-size-sm);
            }

            .no-results {
                padding: 16px;
                text-align: center;
                color: var(--text-muted);
                font-size: var(--font-size-sm);
            }

            .highlight {
                background-color: rgba(var(--primary-color-rgb), 0.1);
                padding: 0 2px;
                border-radius: 2px;
            }

            @media (max-width: 768px) {
                .search-container {
                    margin-right: 0;
                    flex: 1;
                    max-width: 200px;
                }

                .search-input {
                    font-size: var(--font-size-base);
                }
            }

            @media (max-width: 480px) {
                .search-container {
                    max-width: 150px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'search-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    },

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchClear = document.querySelector('.search-clear');
        const suggestionsContainer = document.querySelector('.search-suggestions');

        if (!searchInput) return;

        // 输入事件 - 防抖处理
        searchInput.addEventListener('input', Helpers.Function.debounce((e) => {
            this.handleInput(e.target.value);
        }, this.config.debounceDelay));

        // 按键事件
        searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // 聚焦事件
        searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });

        // 失去焦点事件
        searchInput.addEventListener('blur', () => {
            // 延迟隐藏以便点击建议项
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });

        // 搜索按钮点击
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(this.state.query);
            });
        }

        // 清除按钮点击
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // 点击外部隐藏建议
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    },

    /**
     * 处理输入
     */
    handleInput(query) {
        this.state.query = query.trim();
        this.updateClearButton();

        if (this.state.query.length >= this.config.minQueryLength) {
            this.showSuggestions();
            this.updateSuggestions();
        } else {
            this.showSearchHistory();
        }
    },

    /**
     * 处理按键
     */
    handleKeydown(e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (this.state.currentFocus > -1 && suggestions[this.state.currentFocus]) {
                    // 有选中的建议项，使用建议项
                    suggestions[this.state.currentFocus].click();
                } else {
                    // 执行搜索
                    this.performSearch(this.state.query);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.state.currentFocus = Math.max(this.state.currentFocus - 1, -1);
                this.updateFocus();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.state.currentFocus = Math.min(this.state.currentFocus + 1, suggestions.length - 1);
                this.updateFocus();
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    },

    /**
     * 更新清除按钮显示
     */
    updateClearButton() {
        const searchClear = document.querySelector('.search-clear');
        if (searchClear) {
            searchClear.style.display = this.state.query ? 'block' : 'none';
        }
    },

    /**
     * 显示搜索建议
     */
    showSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('show');
        }
    },

    /**
     * 隐藏搜索建议
     */
    hideSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('show');
        }
        this.state.currentFocus = -1;
    },

    /**
     * 更新搜索建议
     */
    updateSuggestions() {
        if (!this.state.query) {
            this.showSearchHistory();
            return;
        }

        const results = ToolsDB.searchTools(this.state.query);
        this.state.suggestions = results.slice(0, this.config.maxSuggestions);
        this.renderSuggestions();
    },

    /**
     * 显示搜索历史
     */
    showSearchHistory() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;

        if (this.state.searchHistory.length === 0) {
            suggestionsContainer.innerHTML = '<div class="no-results">暂无搜索历史</div>';
            return;
        }

        const historyHtml = this.state.searchHistory.map(query => `
            <div class="history-item" data-query="${query}">
                <span class="history-icon">🕒</span>
                <span class="history-query">${query}</span>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = `
            <div class="search-history">
                <div class="search-history-header">
                    <span>搜索历史</span>
                    <button class="clear-history">清除</button>
                </div>
                ${historyHtml}
            </div>
        `;

        // 绑定历史项点击事件
        const historyItems = suggestionsContainer.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                this.setSearchQuery(query);
                this.performSearch(query);
            });
        });

        // 绑定清除历史按钮
        const clearBtn = suggestionsContainer.querySelector('.clear-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearSearchHistory();
            });
        }
    },

    /**
     * 渲染搜索建议
     */
    renderSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;

        if (this.state.suggestions.length === 0) {
            suggestionsContainer.innerHTML = '<div class="no-results">未找到相关工具</div>';
            return;
        }

        const suggestionsHtml = this.state.suggestions.map((tool, index) => `
            <div class="suggestion-item" data-tool-id="${tool.id}" data-index="${index}">
                <span class="suggestion-icon">🔍</span>
                <div class="suggestion-text">
                    <div class="suggestion-name">${this.highlightText(tool.name, this.state.query)}</div>
                    <div class="suggestion-description">${this.highlightText(tool.description, this.state.query)}</div>
                </div>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = suggestionsHtml;

        // 绑定建议项点击事件
        const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolId = parseInt(item.dataset.toolId);
                this.selectSuggestion(toolId);
            });
        });
    },

    /**
     * 更新焦点项
     */
    updateFocus() {
        const suggestions = document.querySelectorAll('.suggestion-item');
        
        suggestions.forEach((item, index) => {
            if (index === this.state.currentFocus) {
                item.classList.add('focused');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('focused');
            }
        });

        // 更新输入框值
        const searchInput = document.querySelector('.search-input');
        if (this.state.currentFocus > -1 && suggestions[this.state.currentFocus]) {
            const toolId = parseInt(suggestions[this.state.currentFocus].dataset.toolId);
            const tool = ToolsDB.getToolById(toolId);
            if (tool) {
                searchInput.value = tool.name;
            }
        } else {
            searchInput.value = this.state.query;
        }
    },

    /**
     * 高亮匹配文本
     */
    highlightText(text, query) {
        if (!query) return Helpers.String.escapeHtml(text);
        
        const escapedText = Helpers.String.escapeHtml(text);
        const escapedQuery = Helpers.String.escapeHtml(query);
        
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<span class="highlight">$1</span>');
    },

    /**
     * 选择建议项
     */
    selectSuggestion(toolId) {
        const tool = ToolsDB.getToolById(toolId);
        if (tool) {
            this.setSearchQuery(tool.name);
            this.performSearch(tool.name);
            this.hideSuggestions();
        }
    },

    /**
     * 执行搜索
     */
    performSearch(query) {
        if (!query.trim()) {
            Helpers.showNotification('请输入搜索关键词', 'warning');
            return;
        }

        this.state.query = query.trim();
        this.state.isSearching = true;
        
        // 更新应用状态
        AppState.setSearchQuery(this.state.query);
        
        // 添加到搜索历史
        this.addToSearchHistory(this.state.query);
        
        // 隐藏建议
        this.hideSuggestions();
        
        // 更新输入框
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = this.state.query;
        }
        
        // 发送搜索事件
        this.emitSearchEvent(this.state.query);
        
        console.log('执行搜索:', this.state.query);
    },

    /**
     * 清除搜索
     */
    clearSearch() {
        this.state.query = '';
        
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        
        this.updateClearButton();
        this.hideSuggestions();
        
        // 清除应用状态的搜索
        AppState.setSearchQuery('');
        
        // 发送清除搜索事件
        this.emitSearchEvent('');
    },

    /**
     * 设置搜索查询
     */
    setSearchQuery(query) {
        this.state.query = query;
        
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = query;
        }
        
        this.updateClearButton();
    },

    /**
     * 添加到搜索历史
     */
    addToSearchHistory(query) {
        if (!query.trim()) return;
        
        // 移除重复项
        this.state.searchHistory = this.state.searchHistory.filter(item => item !== query);
        
        // 添加到开头
        this.state.searchHistory.unshift(query);
        
        // 限制历史记录数量
        if (this.state.searchHistory.length > this.config.maxHistoryItems) {
            this.state.searchHistory.pop();
        }
        
        // 保存到本地存储
        this.saveSearchHistory();
    },

    /**
     * 清除搜索历史
     */
    clearSearchHistory() {
        this.state.searchHistory = [];
        this.saveSearchHistory();
        this.showSearchHistory();
    },

    /**
     * 保存搜索历史
     */
    saveSearchHistory() {
        Helpers.Storage.set(this.config.searchHistoryKey, this.state.searchHistory);
    },

    /**
     * 加载搜索历史
     */
    loadSearchHistory() {
        this.state.searchHistory = Helpers.Storage.get(this.config.searchHistoryKey, []);
    },

    /**
     * 发送搜索事件
     */
    emitSearchEvent(query) {
        const event = new CustomEvent('searchPerformed', {
            detail: {
                query: query,
                timestamp: Date.now(),
                results: AppState.cache.filteredTools
            }
        });
        
        document.dispatchEvent(event);
    },

    /**
     * 获取搜索统计
     */
    getSearchStats() {
        return {
            totalSearches: this.state.searchHistory.length,
            recentQueries: this.state.searchHistory.slice(0, 5),
            hasQuery: !!this.state.query
        };
    },

    /**
     * 销毁模块
     */
    destroy() {
        // 移除事件监听器
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.replaceWith(searchInput.cloneNode(true));
        }
        
        // 移除样式
        const styles = document.getElementById('search-styles');
        if (styles) {
            styles.remove();
        }
        
        console.log('搜索模块已销毁');
    }
};

// 初始化搜索模块
Search.init();

// 导出到全局
window.Search = Search;

console.log('Search 搜索模块已加载');
