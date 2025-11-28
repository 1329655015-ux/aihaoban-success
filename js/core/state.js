/**
 * 应用状态管理
 * 管理全局状态和数据流
 */

// 应用状态
const AppState = {
    // 当前状态
    current: {
        category: 'all',
        searchQuery: '',
        activeFilters: {
            badge: 'all',
            features: [],
            rating: 0,
            usage: 'all'
        },
        sortBy: 'name',
        sortOrder: 'asc',
        viewMode: 'grid', // grid | list
        currentPage: 1,
        itemsPerPage: 12
    },

    // 缓存数据
    cache: {
        filteredTools: [],
        searchResults: [],
        categoryTools: {}
    },

    // 用户偏好
    preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true,
        autoSave: true
    },

    // 初始化状态
    init() {
        console.log('初始化应用状态');
        
        // 从本地存储加载用户偏好
        this.loadPreferences();
        
        // 初始化缓存
        this.updateFilteredTools();
        
        // 设置默认视图
        this.setDefaultView();
        
        return this;
    },

    /**
     * 设置当前分类
     */
    setCategory(categoryId) {
        this.current.category = categoryId;
        this.current.currentPage = 1; // 重置页码
        this.updateFilteredTools();
        this.saveState();
        this.notifyChange('category');
        
        return this;
    },

    /**
     * 设置搜索查询
     */
    setSearchQuery(query) {
        this.current.searchQuery = query;
        this.current.currentPage = 1; // 重置页码
        this.updateFilteredTools();
        this.saveState();
        this.notifyChange('search');
        
        return this;
    },

    /**
     * 设置筛选条件
     */
    setFilter(type, value) {
        if (type === 'features') {
            // 特性筛选是数组
            const index = this.current.activeFilters.features.indexOf(value);
            if (index > -1) {
                this.current.activeFilters.features.splice(index, 1);
            } else {
                this.current.activeFilters.features.push(value);
            }
        } else {
            this.current.activeFilters[type] = value;
        }
        
        this.current.currentPage = 1; // 重置页码
        this.updateFilteredTools();
        this.saveState();
        this.notifyChange('filter');
        
        return this;
    },

    /**
     * 清除所有筛选
     */
    clearFilters() {
        this.current.activeFilters = {
            badge: 'all',
            features: [],
            rating: 0,
            usage: 'all'
        };
        this.current.searchQuery = '';
        this.current.currentPage = 1;
        this.updateFilteredTools();
        this.saveState();
        this.notifyChange('filter');
        
        return this;
    },

    /**
     * 设置排序
     */
    setSort(sortBy, sortOrder = 'asc') {
        this.current.sortBy = sortBy;
        this.current.sortOrder = sortOrder;
        this.updateFilteredTools();
        this.saveState();
        this.notifyChange('sort');
        
        return this;
    },

    /**
     * 设置视图模式
     */
    setViewMode(mode) {
        this.current.viewMode = mode;
        this.saveState();
        this.notifyChange('view');
        
        return this;
    },

    /**
     * 设置当前页码
     */
    setCurrentPage(page) {
        this.current.currentPage = page;
        this.saveState();
        this.notifyChange('page');
        
        return this;
    },

    /**
     * 更新筛选后的工具列表
     */
    updateFilteredTools() {
        let tools = ToolsDB.getAllTools();

        // 按分类筛选
        if (this.current.category !== 'all') {
            tools = ToolsDB.getToolsByCategory(this.current.category);
        }

        // 按搜索查询筛选
        if (this.current.searchQuery) {
            tools = ToolsDB.searchTools(this.current.searchQuery);
        }

        // 按标签筛选
        if (this.current.activeFilters.badge !== 'all') {
            tools = tools.filter(tool => 
                tool.badge && tool.badge.type === this.current.activeFilters.badge
            );
        }

        // 按特性筛选
        if (this.current.activeFilters.features.length > 0) {
            tools = tools.filter(tool =>
                this.current.activeFilters.features.every(feature =>
                    tool.features.includes(feature)
                )
            );
        }

        // 按评分筛选
        if (this.current.activeFilters.rating > 0) {
            tools = tools.filter(tool => tool.rating >= this.current.activeFilters.rating);
        }

        // 按使用情况筛选
        if (this.current.activeFilters.usage !== 'all') {
            tools = tools.filter(tool => tool.usage === this.current.activeFilters.usage);
        }

        // 排序
        tools = this.sortTools(tools);

        // 更新缓存
        this.cache.filteredTools = tools;
        
        return tools;
    },

    /**
     * 工具排序
     */
    sortTools(tools) {
        const { sortBy, sortOrder } = this.current;
        
        return [...tools].sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'rating':
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case 'usage':
                    const usageOrder = { high: 3, medium: 2, low: 1 };
                    aValue = usageOrder[a.usage] || 0;
                    bValue = usageOrder[b.usage] || 0;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    },

    /**
     * 获取当前页的工具
     */
    getCurrentPageTools() {
        const startIndex = (this.current.currentPage - 1) * this.current.itemsPerPage;
        const endIndex = startIndex + this.current.itemsPerPage;
        return this.cache.filteredTools.slice(startIndex, endIndex);
    },

    /**
     * 获取总页数
     */
    getTotalPages() {
        return Math.ceil(this.cache.filteredTools.length / this.current.itemsPerPage);
    },

    /**
     * 获取分页信息
     */
    getPaginationInfo() {
        const total = this.cache.filteredTools.length;
        const totalPages = this.getTotalPages();
        const startItem = (this.current.currentPage - 1) * this.current.itemsPerPage + 1;
        const endItem = Math.min(startItem + this.current.itemsPerPage - 1, total);

        return {
            totalItems: total,
            totalPages: totalPages,
            currentPage: this.current.currentPage,
            itemsPerPage: this.current.itemsPerPage,
            startItem: startItem,
            endItem: endItem,
            hasPrevious: this.current.currentPage > 1,
            hasNext: this.current.currentPage < totalPages
        };
    },

    /**
     * 获取当前筛选状态描述
     */
    getFilterDescription() {
        const parts = [];
        
        if (this.current.category !== 'all') {
            parts.push(`分类: ${ToolsDB.getCategoryName(this.current.category)}`);
        }
        
        if (this.current.searchQuery) {
            parts.push(`搜索: "${this.current.searchQuery}"`);
        }
        
        if (this.current.activeFilters.badge !== 'all') {
            parts.push(`标签: ${this.current.activeFilters.badge}`);
        }
        
        if (this.current.activeFilters.features.length > 0) {
            parts.push(`特性: ${this.current.activeFilters.features.join(', ')}`);
        }
        
        if (this.current.activeFilters.rating > 0) {
            parts.push(`评分: ≥ ${this.current.activeFilters.rating}`);
        }
        
        if (this.current.activeFilters.usage !== 'all') {
            parts.push(`使用: ${this.current.activeFilters.usage}`);
        }

        return parts.length > 0 ? parts.join(' | ') : '全部工具';
    },

    /**
     * 获取统计信息
     */
    getStats() {
        const total = ToolsDB.getAllTools().length;
        const filtered = this.cache.filteredTools.length;
        const categories = ToolsDB.getCategoryStats();
        
        return {
            totalTools: total,
            filteredTools: filtered,
            categories: categories,
            usageStats: ToolsDB.getUsageStats(),
            ratingDistribution: ToolsDB.getRatingDistribution()
        };
    },

    /**
     * 设置用户偏好
     */
    setPreference(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
        this.notifyChange('preference');
        
        return this;
    },

    /**
     * 保存状态到本地存储
     */
    saveState() {
        if (this.preferences.autoSave) {
            Helpers.Storage.set('app_state', this.current);
        }
    },

    /**
     * 加载状态从本地存储
     */
    loadState() {
        const savedState = Helpers.Storage.get('app_state');
        if (savedState) {
            this.current = { ...this.current, ...savedState };
            this.updateFilteredTools();
        }
    },

    /**
     * 保存用户偏好
     */
    savePreferences() {
        Helpers.Storage.set('user_preferences', this.preferences);
    },

    /**
     * 加载用户偏好
     */
    loadPreferences() {
        const savedPrefs = Helpers.Storage.get('user_preferences');
        if (savedPrefs) {
            this.preferences = { ...this.preferences, ...savedPrefs };
        }
    },

    /**
     * 设置默认视图
     */
    setDefaultView() {
        // 根据屏幕尺寸设置默认视图
        if (window.innerWidth < 768) {
            this.current.viewMode = 'grid';
            this.current.itemsPerPage = 6;
        }
    },

    /**
     * 状态变化通知
     */
    notifyChange(type) {
        // 创建自定义事件
        const event = new CustomEvent('appStateChange', {
            detail: {
                type: type,
                state: this.current,
                data: this.cache.filteredTools
            }
        });
        
        // 分发事件
        document.dispatchEvent(event);
        
        // 控制台日志（开发环境）
        if (process.env.NODE_ENV === 'development') {
            console.log(`状态变化: ${type}`, this.current);
        }
    },

    /**
     * 重置状态
     */
    reset() {
        this.current = {
            category: 'all',
            searchQuery: '',
            activeFilters: {
                badge: 'all',
                features: [],
                rating: 0,
                usage: 'all'
            },
            sortBy: 'name',
            sortOrder: 'asc',
            viewMode: 'grid',
            currentPage: 1,
            itemsPerPage: 12
        };
        
        this.updateFilteredTools();
        this.saveState();
        this.notifyChange('reset');
        
        return this;
    },

    /**
     * 导出状态
     */
    exportState() {
        return {
            current: this.current,
            preferences: this.preferences,
            exportedAt: new Date().toISOString()
        };
    },

    /**
     * 导入状态
     */
    importState(stateData) {
        if (stateData.current) {
            this.current = { ...this.current, ...stateData.current };
        }
        if (stateData.preferences) {
            this.preferences = { ...this.preferences, ...stateData.preferences };
        }
        
        this.updateFilteredTools();
        this.saveState();
        this.savePreferences();
        this.notifyChange('import');
        
        return this;
    }
};

// 初始化状态管理
AppState.init();

// 导出到全局
window.AppState = AppState;

console.log('AppState 状态管理已初始化');
