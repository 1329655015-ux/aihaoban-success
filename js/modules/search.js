/**
 * 搜索模块
 * 处理工具搜索功能，包括实时搜索和搜索建议
 */

const Search = {
    // 模块配置
    config: {
        debounceDelay: 300,
        minQueryLength: 1,
        maxSuggestions: 8,
        highlightClass: 'search-highlight',
        searchHistoryKey: 'search_history',
        maxHistoryItems: 10,
        searchDelay: 150
    },

    // 模块状态
    state: {
        query: '',
        isSearching: false,
        hasResults: false,
        currentFocus: -1,
        searchHistory: [],
        suggestions: [],
        lastSearch: null
    },

    /**
     * 初始化搜索模块
     */
    init() {
        console.log('初始化搜索模块');

        this.createSearchInterface();
        this.loadSearchHistory();
        this.bindEvents();
        this.initSearchStyles();

        return this;
    },

    /**
     * 创建搜索界面
     */
    createSearchInterface() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        // 创建搜索容器
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="搜索AI工具..." autocomplete="off">
                <button class="search-btn btn btn-primary" type="submit">
                    <span class="search-icon">🔍</span>
                    <span class="search-text">搜索</span>
                </button>
                <button class="search-clear btn btn-ghost" type="button" style="display: none;">
                    <span>×</span>
                </button>
            </div>
            <div class="search-suggestions"></div>
        `;

        // 插入到头部操作区域
        headerActions.insertBefore(searchContainer, headerActions.firstChild);

        console.log('搜索界面创建完成');
    },

    /**
     * 初始化搜索样式
     */
    initSearchStyles() {
        // 样式已经在 components.css 中定义
        // 这里只需要确保必要的类存在
        const styleCheck = document.createElement('style');
        styleCheck.textContent = `
            .search-highlight {
                background-color: rgba(var(--primary-color), 0.2);
                padding: 2px 4px;
                border-radius: 4px;
                font-weight: 600;
            }
        `;
        document.head.appendChild(styleCheck);
    },

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchClear = document.querySelector('.search-clear');
        const searchContainer = document.querySelector('.search-container');

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
            if (!this.state.query) {
                this.showSearchHistory();
            }
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
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
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

        // 监听应用状态变化
        document.addEventListener('appStateChange', (e) => {
            if (e.detail.type === 'search') {
                this.updateSearchState();
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
            this.state.isSearching = true;
            this.updateSuggestions();
        } else {
            this.hideSuggestions();
            this.state.isSearching = false;
        }
    },

    /**
     * 处理按键
     */
    handleKeydown(e) {
        const suggestions = document.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (this.state.currentFocus > -1 && suggestions[this.state.currentFocus]) {
                    // 有选中的建议项，使用建议项
                    this.selectSearchResult(
                        parseInt(suggestions[this.state.currentFocus].dataset.toolId)
                    );
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
                this.state.currentFocus = Math.min(
                    this.state.currentFocus + 1, 
                    suggestions.length - 1
                );
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
            searchClear.style.display = this.state.query ? 'flex' : 'none';
        }
    },

    /**
     * 显示搜索建议
     */
    showSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'block';
        }
    },

    /**
     * 隐藏搜索建议
     */
    hideSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
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
            <div class="search-history-item" data-query="${Helpers.String.escapeHtml(query)}">
                <span class="history-icon">🕒</span>
                <span class="history-query">${Helpers.String.escapeHtml(query)}</span>
                <button class="history-remove" data-query="${Helpers.String.escapeHtml(query)}">×</button>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = `
            <div class="search-history">
                <div class="search-history-header">
                    <span>搜索历史</span>
                    <button class="clear-history">清除全部</button>
                </div>
                ${historyHtml}
            </div>
        `;

        // 绑定历史项点击事件
        const historyItems = suggestionsContainer.querySelectorAll('.search-history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('history-remove')) {
                    const query = item.dataset.query;
                    this.setSearchQuery(query);
                    this.performSearch(query);
                }
            });
        });

        // 绑定移除单个历史记录事件
        const removeButtons = suggestionsContainer.querySelectorAll('.history-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const query = btn.dataset.query;
                this.removeFromSearchHistory(query);
                this.showSearchHistory();
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
            <div class="search-result-item" data-tool-id="${tool.id}" data-index="${index}">
                <div class="result-tool-name">${this.highlightText(tool.name, this.state.query)}</div>
                <div class="result-tool-description">${this.highlightText(tool.description, this.state.query)}</div>
                <div class="result-tool-features">
                    ${tool.features.slice(0, 2).map(feature => 
                        `<span class="result-feature-tag">${feature}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = suggestionsHtml;

        // 绑定建议项点击事件
        const suggestionItems = suggestionsContainer.querySelectorAll('.search-result-item');
        suggestionItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolId = parseInt(item.dataset.toolId);
                this.selectSearchResult(toolId);
            });
        });

        this.showSuggestions();
    },

    /**
     * 更新焦点项
     */
    updateFocus() {
        const suggestions = document.querySelectorAll('.search-result-item');
        const searchInput = document.querySelector('.search-input');
        
        suggestions.forEach((item, index) => {
            if (index === this.state.currentFocus) {
                item.classList.add('focused');
                // 确保焦点项在可视区域内
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('focused');
            }
        });

        // 更新输入框值（当使用键盘导航时）
        if (this.state.currentFocus > -1 && suggestions[this.state.currentFocus]) {
            const toolId = parseInt(suggestions[this.state.currentFocus].dataset.toolId);
            const tool = ToolsDB.getToolById(toolId);
            if (tool && searchInput) {
                // 临时显示工具名称，但保留原始查询
                searchInput.value = tool.name;
            }
        } else if (searchInput) {
            // 恢复原始查询
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
        
        const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escapedText.replace(regex, '<span class="search-highlight">$1</span>');
    },

    /**
     * 选择搜索结果
     */
    selectSearchResult(toolId) {
        const tool = ToolsDB.getToolById(toolId);
        if (tool) {
            this.setSearchQuery(tool.name);
            this.performSearch(tool.name);
            this.hideSuggestions();
            
            // 滚动到该工具（如果它在当前列表中）
            this.scrollToTool(toolId);
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
        this.state.lastSearch = Date.now();
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
     * 滚动到指定工具
     */
    scrollToTool(toolId) {
        const toolElement = document.querySelector(`.tool-card[data-id="${toolId}"]`);
        if (toolElement) {
            toolElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // 添加高亮效果
            toolElement.classList.add('highlight-tool');
            setTimeout(() => {
                toolElement.classList.remove('highlight-tool');
            }, 2000);
        }
    },

    /**
     * 清除搜索
     */
    clearSearch() {
        this.state.query = '';
        this.state.isSearching = false;
        
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
        
        Helpers.showNotification('搜索已清除', 'info');
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
        this.state.searchHistory = this.state.searchHistory.filter(item => 
            item.toLowerCase() !== query.toLowerCase()
        );
        
        // 添加到开头
        this.state.searchHistory.unshift(query);
        
        // 限制历史记录数量
        if (this.state.searchHistory.length > this.config.maxHistoryItems) {
            this.state.searchHistory = this.state.searchHistory.slice(0, this.config.maxHistoryItems);
        }
        
        // 保存到本地存储
        this.saveSearchHistory();
    },

    /**
     * 从搜索历史中移除
     */
    removeFromSearchHistory(query) {
        this.state.searchHistory = this.state.searchHistory.filter(item => 
            item.toLowerCase() !== query.toLowerCase()
        );
        this.saveSearchHistory();
    },

    /**
     * 清除搜索历史
     */
    clearSearchHistory() {
        this.state.searchHistory = [];
        this.saveSearchHistory();
        this.showSearchHistory();
        
        Helpers.showNotification('搜索历史已清除', 'success');
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
     * 更新搜索状态
     */
    updateSearchState() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput && AppState.current.searchQuery !== this.state.query) {
            this.state.query = AppState.current.searchQuery;
            searchInput.value = this.state.query;
            this.updateClearButton();
        }
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
            hasQuery: !!this.state.query,
            isSearching: this.state.isSearching
        };
    },

    /**
     * 搜索建议（用于其他模块调用）
     */
    suggest(query) {
        if (!query || query.length < this.config.minQueryLength) {
            return [];
        }
        
        return ToolsDB.searchTools(query).slice(0, this.config.maxSuggestions);
    },

    /**
     * 快速搜索（不更新界面）
     */
    quickSearch(query) {
        return ToolsDB.searchTools(query);
    },

    /**
     * 获取热门搜索
     */
    getPopularSearches() {
        // 简单的热门搜索算法（基于搜索频率）
        const searchCount = {};
        this.state.searchHistory.forEach(query => {
            searchCount[query] = (searchCount[query] || 0) + 1;
        });
        
        return Object.entries(searchCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([query]) => query);
    },

    /**
     * 销毁模块
     */
    destroy() {
        // 清理事件监听器
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.replaceWith(searchInput.cloneNode(true));
        }
        
        console.log('搜索模块已销毁');
    }
};

// 初始化搜索模块
Search.init();

// 导出到全局
window.Search = Search;

console.log('Search 搜索模块已加载');
