// 搜索模块
const Search = {
    init() {
        console.log('搜索模块已初始化');
        this.createSearchBar();
        this.initSearchEvents();
    },

    // 创建搜索栏
    createSearchBar() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        // 创建搜索容器
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="搜索AI工具...">
                <button class="search-btn btn btn-primary">
                    <span>搜索</span>
                </button>
                <button class="search-close btn btn-outline" style="display: none;">
                    <span>取消</span>
                </button>
            </div>
        `;

        // 插入到头部操作区域
        headerActions.insertBefore(searchContainer, headerActions.firstChild);

        // 添加搜索样式
        this.addSearchStyles();
    },

    // 添加搜索样式
    addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-container {
                position: relative;
                margin-right: var(--space-sm);
            }

            .search-box {
                display: flex;
                gap: var(--space-sm);
                align-items: center;
            }

            .search-input {
                padding: var(--space-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                font-size: var(--font-size-sm);
                width: 200px;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                outline: none;
                border-color: var(--primary-color);
                width: 250px;
            }

            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                max-height: 300px;
                overflow-y: auto;
                display: none;
            }

            .search-result-item {
                padding: var(--space-sm);
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .search-result-item:hover {
                background: var(--bg-secondary);
            }

            .search-result-item:last-child {
                border-bottom: none;
            }

            .no-results {
                padding: var(--space-sm);
                color: var(--text-muted);
                text-align: center;
            }

            @media (max-width: 768px) {
                .search-input {
                    width: 150px;
                }

                .search-input:focus {
                    width: 180px;
                }
            }
        `;
        document.head.appendChild(style);
    },

    // 初始化搜索事件
    initSearchEvents() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchClose = document.querySelector('.search-close');

        if (!searchInput) return;

        // 搜索按钮点击事件
        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        // 输入框回车事件
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        // 输入框输入事件（实时搜索）
        searchInput.addEventListener('input', Helpers.debounce((e) => {
            const query = e.target.value;
            if (query.length > 2) {
                this.showSearchResults(query);
            } else {
                this.hideSearchResults();
            }
        }, 300));

        // 取消按钮点击事件
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchInput.value = '';
                this.hideSearchResults();
                searchClose.style.display = 'none';
            });
        }

        // 输入框聚焦事件
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length > 2) {
                this.showSearchResults(searchInput.value);
            }
            if (searchClose) {
                searchClose.style.display = 'block';
            }
        });
    },

    // 执行搜索
    performSearch(query) {
        if (!query.trim()) {
            this.showNotification('请输入搜索关键词');
            return;
        }

        console.log('执行搜索:', query);
        AppState.setSearch(query);
        this.hideSearchResults();
        this.showNotification(`搜索: ${query}`);
    },

    // 显示搜索结果
    showSearchResults(query) {
        let resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            document.querySelector('.search-box').appendChild(resultsContainer);
        }

        const results = ToolsDB.searchTools(query);
        this.renderSearchResults(results, resultsContainer);
        resultsContainer.style.display = 'block';
    },

    // 隐藏搜索结果
    hideSearchResults() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    },

    // 渲染搜索结果
    renderSearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">未找到相关工具</div>';
            return;
        }

        container.innerHTML = results.map(tool => `
            <div class="search-result-item" data-tool-id="${tool.id}">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
            </div>
        `).join('');

        // 添加搜索结果点击事件
        const resultItems = container.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolId = parseInt(item.dataset.toolId);
                this.selectSearchResult(toolId);
            });
        });
    },

    // 选择搜索结果
    selectSearchResult(toolId) {
        const tool = ToolsDB.getAllTools().find(t => t.id === toolId);
        if (tool) {
            // 这里可以实现跳转到工具详情或筛选显示
            console.log('选择了工具:', tool.name);
            this.hideSearchResults();
            document.querySelector('.search-input').value = tool.name;
            this.showNotification(`已选择: ${tool.name}`);
        }
    },

    // 显示通知
    showNotification(message) {
        console.log('搜索通知:', message);
    }
};

window.Search = Search;
