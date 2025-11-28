/**
 * 筛选模块
 * 处理工具的多维度筛选和过滤功能
 */

const Filters = {
    // 模块配置
    config: {
        animationDuration: 300,
        activeClass: 'active',
        filterPanelId: 'filter-panel',
        mobileBreakpoint: 768
    },

    // 模块状态
    state: {
        isOpen: false,
        activeFilters: {
            category: 'all',
            badge: 'all',
            features: [],
            rating: 0,
            usage: 'all',
            tags: []
        },
        availableFeatures: [],
        availableTags: [],
        filterCount: 0
    },

    /**
     * 初始化筛选模块
     */
    init() {
        console.log('初始化筛选模块');

        this.loadAvailableFilters();
        this.createFilterPanel();
        this.bindEvents();
        this.updateFilterCount();

        return this;
    },

    /**
     * 加载可用筛选条件
     */
    loadAvailableFilters() {
        // 从数据库获取特性列表
        this.state.availableFeatures = ToolsDB.getAllFeatures();
        
        // 从所有工具中提取标签
        const allTags = new Set();
        ToolsDB.getAllTools().forEach(tool => {
            tool.tags.forEach(tag => allTags.add(tag));
        });
        this.state.availableTags = Array.from(allTags).sort();

        console.log('可用筛选条件加载完成:', {
            features: this.state.availableFeatures.length,
            tags: this.state.availableTags.length
        });
    },

    /**
     * 创建筛选面板
     */
    createFilterPanel() {
        // 检查是否已存在筛选面板
        if (document.getElementById(this.config.filterPanelId)) {
            return;
        }

        const toolsSection = document.querySelector('.tools-section');
        if (!toolsSection) return;

        const filterPanel = document.createElement('div');
        filterPanel.id = this.config.filterPanelId;
        filterPanel.className = 'filter-panel';
        filterPanel.innerHTML = this.getFilterPanelHTML();

        toolsSection.insertBefore(filterPanel, toolsSection.querySelector('.tools-grid'));

        console.log('筛选面板创建完成');
    },

    /**
     * 获取筛选面板HTML
     */
    getFilterPanelHTML() {
        return `
            <div class="filter-header">
                <h4>筛选工具</h4>
                <div class="filter-actions">
                    <button class="filter-clear btn btn-outline">清除筛选</button>
                    <button class="filter-toggle btn btn-ghost">
                        <span class="filter-toggle-icon">▼</span>
                    </button>
                </div>
            </div>
            
            <div class="filter-content">
                <div class="filter-options">
                    <!-- 分类筛选 -->
                    <div class="filter-group">
                        <label for="filter-category">分类</label>
                        <select id="filter-category" class="filter-category">
                            <option value="all">全部分类</option>
                            ${ToolsDB.getAllCategories().map(cat => 
                                `<option value="${cat.id}">${cat.name} (${cat.count})</option>`
                            ).join('')}
                        </select>
                    </div>

                    <!-- 标签筛选 -->
                    <div class="filter-group">
                        <label for="filter-badge">标签</label>
                        <select id="filter-badge" class="filter-badge">
                            <option value="all">全部标签</option>
                            <option value="free">免费</option>
                            <option value="pro">专业版</option>
                            <option value="new">新上架</option>
                            <option value="hot">热门</option>
                        </select>
                    </div>

                    <!-- 评分筛选 -->
                    <div class="filter-group">
                        <label for="filter-rating">最低评分</label>
                        <select id="filter-rating" class="filter-rating">
                            <option value="0">全部评分</option>
                            <option value="4.5">4.5星以上</option>
                            <option value="4.0">4.0星以上</option>
                            <option value="3.5">3.5星以上</option>
                            <option value="3.0">3.0星以上</option>
                        </select>
                    </div>

                    <!-- 使用情况筛选 -->
                    <div class="filter-group">
                        <label for="filter-usage">使用情况</label>
                        <select id="filter-usage" class="filter-usage">
                            <option value="all">全部</option>
                            <option value="high">高频使用</option>
                            <option value="medium">中等使用</option>
                            <option value="low">低频使用</option>
                        </select>
                    </div>
                </div>

                <!-- 特性筛选 -->
                <div class="filter-group feature-filters-group">
                    <label>功能特性</label>
                    <div class="feature-filters">
                        ${this.getFeatureFiltersHTML()}
                    </div>
                </div>

                <!-- 标签筛选 -->
                <div class="filter-group tag-filters-group">
                    <label>工具标签</label>
                    <div class="tag-filters">
                        ${this.getTagFiltersHTML()}
                    </div>
                </div>

                <!-- 激活的筛选条件 -->
                <div class="active-filters-container">
                    <div class="active-filters-header">
                        <span>当前筛选条件</span>
                        <span class="filter-count">0</span>
                    </div>
                    <div class="active-filters"></div>
                </div>
            </div>
        `;
    },

    /**
     * 获取特性筛选HTML
     */
    getFeatureFiltersHTML() {
        const features = this.state.availableFeatures;
        const chunkSize = Math.ceil(features.length / 2);
        const chunks = [
            features.slice(0, chunkSize),
            features.slice(chunkSize)
        ];

        return chunks.map(chunk => `
            <div class="feature-filters-column">
                ${chunk.map(feature => `
                    <label class="feature-filter-label">
                        <input type="checkbox" value="${feature}" class="feature-filter">
                        <span class="feature-filter-text">${feature}</span>
                    </label>
                `).join('')}
            </div>
        `).join('');
    },

    /**
     * 获取标签筛选HTML
     */
    getTagFiltersHTML() {
        return this.state.availableTags.map(tag => `
            <label class="tag-filter-label">
                <input type="checkbox" value="${tag}" class="tag-filter">
                <span class="tag-filter-text">${tag}</span>
            </label>
        `).join('');
    },

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        this.bindFilterEvents();
        this.bindPanelEvents();
        this.bindAppStateEvents();
    },

    /**
     * 绑定筛选事件
     */
    bindFilterEvents() {
        // 分类筛选
        const categorySelect = document.getElementById('filter-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.setFilter('category', e.target.value);
            });
        }

        // 标签筛选
        const badgeSelect = document.getElementById('filter-badge');
        if (badgeSelect) {
            badgeSelect.addEventListener('change', (e) => {
                this.setFilter('badge', e.target.value);
            });
        }

        // 评分筛选
        const ratingSelect = document.getElementById('filter-rating');
        if (ratingSelect) {
            ratingSelect.addEventListener('change', (e) => {
                this.setFilter('rating', parseFloat(e.target.value));
            });
        }

        // 使用情况筛选
        const usageSelect = document.getElementById('filter-usage');
        if (usageSelect) {
            usageSelect.addEventListener('change', (e) => {
                this.setFilter('usage', e.target.value);
            });
        }

        // 特性筛选
        const featureFilters = document.querySelectorAll('.feature-filter');
        featureFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.handleFeatureFilterChange(e.target);
            });
        });

        // 标签筛选
        const tagFilters = document.querySelectorAll('.tag-filter');
        tagFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.handleTagFilterChange(e.target);
            });
        });

        // 清除筛选
        const clearButton = document.querySelector('.filter-clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    },

    /**
     * 绑定面板事件
     */
    bindPanelEvents() {
        // 面板切换
        const toggleButton = document.querySelector('.filter-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.togglePanel();
            });
        }

        // 移动端优化
        this.optimizeForMobile();
    },

    /**
     * 绑定应用状态事件
     */
    bindAppStateEvents() {
        // 监听应用状态变化
        document.addEventListener('appStateChange', (e) => {
            if (e.detail.type === 'filter') {
                this.syncWithAppState();
            }
        });

        // 监听搜索事件
        document.addEventListener('searchPerformed', (e) => {
            this.onSearchPerformed(e.detail);
        });
    },

    /**
     * 设置筛选条件
     */
    setFilter(type, value) {
        this.state.activeFilters[type] = value;
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
        
        console.log('设置筛选条件:', type, value);
    },

    /**
     * 处理特性筛选变化
     */
    handleFeatureFilterChange(checkbox) {
        const feature = checkbox.value;
        
        if (checkbox.checked) {
            if (!this.state.activeFilters.features.includes(feature)) {
                this.state.activeFilters.features.push(feature);
            }
        } else {
            this.state.activeFilters.features = this.state.activeFilters.features.filter(
                f => f !== feature
            );
        }
        
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
    },

    /**
     * 处理标签筛选变化
     */
    handleTagFilterChange(checkbox) {
        const tag = checkbox.value;
        
        if (checkbox.checked) {
            if (!this.state.activeFilters.tags.includes(tag)) {
                this.state.activeFilters.tags.push(tag);
            }
        } else {
            this.state.activeFilters.tags = this.state.activeFilters.tags.filter(
                t => t !== tag
            );
        }
        
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
    },

    /**
     * 应用筛选条件
     */
    applyFilters() {
        // 更新应用状态
        AppState.current.activeFilters = { ...this.state.activeFilters };
        AppState.updateFilteredTools();
        
        // 发送筛选事件
        this.emitFilterEvent();
        
        // 更新URL参数
        this.updateURLParams();
    },

    /**
     * 清除所有筛选条件
     */
    clearAllFilters() {
        // 重置状态
        this.state.activeFilters = {
            category: 'all',
            badge: 'all',
            features: [],
            rating: 0,
            usage: 'all',
            tags: []
        };
        
        // 重置UI
        this.resetFilterUI();
        
        // 应用更改
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
        
        Helpers.showNotification('所有筛选条件已清除', 'success');
    },

    /**
     * 重置筛选UI
     */
    resetFilterUI() {
        // 重置选择框
        const categorySelect = document.getElementById('filter-category');
        const badgeSelect = document.getElementById('filter-badge');
        const ratingSelect = document.getElementById('filter-rating');
        const usageSelect = document.getElementById('filter-usage');
        
        if (categorySelect) categorySelect.value = 'all';
        if (badgeSelect) badgeSelect.value = 'all';
        if (ratingSelect) ratingSelect.value = '0';
        if (usageSelect) usageSelect.value = 'all';
        
        // 重置复选框
        const featureFilters = document.querySelectorAll('.feature-filter');
        const tagFilters = document.querySelectorAll('.tag-filter');
        
        featureFilters.forEach(filter => filter.checked = false);
        tagFilters.forEach(filter => filter.checked = false);
    },

    /**
     * 更新激活的筛选条件显示
     */
    updateActiveFiltersDisplay() {
        const activeFiltersContainer = document.querySelector('.active-filters');
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = '';

        // 分类筛选
        if (this.state.activeFilters.category !== 'all') {
            const categoryName = ToolsDB.getCategoryName(this.state.activeFilters.category);
            this.addActiveFilter(`分类: ${categoryName}`, 'category');
        }

        // 标签筛选
        if (this.state.activeFilters.badge !== 'all') {
            this.addActiveFilter(`标签: ${this.state.activeFilters.badge}`, 'badge');
        }

        // 评分筛选
        if (this.state.activeFilters.rating > 0) {
            this.addActiveFilter(`评分: ≥ ${this.state.activeFilters.rating}`, 'rating');
        }

        // 使用情况筛选
        if (this.state.activeFilters.usage !== 'all') {
            this.addActiveFilter(`使用: ${this.state.activeFilters.usage}`, 'usage');
        }

        // 特性筛选
        this.state.activeFilters.features.forEach(feature => {
            this.addActiveFilter(`特性: ${feature}`, `feature-${feature}`);
        });

        // 标签筛选
        this.state.activeFilters.tags.forEach(tag => {
            this.addActiveFilter(`标签: ${tag}`, `tag-${tag}`);
        });
    },

    /**
     * 添加激活的筛选条件
     */
    addActiveFilter(text, type) {
        const activeFiltersContainer = document.querySelector('.active-filters');
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            <span class="active-filter-text">${text}</span>
            <button class="active-filter-remove" data-filter-type="${type}">×</button>
        `;

        // 添加移除事件
        const removeButton = filterElement.querySelector('.active-filter-remove');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFilter(type);
        });

        activeFiltersContainer.appendChild(filterElement);
    },

    /**
     * 移除筛选条件
     */
    removeFilter(type) {
        if (type === 'category') {
            this.state.activeFilters.category = 'all';
            document.getElementById('filter-category').value = 'all';
        } else if (type === 'badge') {
            this.state.activeFilters.badge = 'all';
            document.getElementById('filter-badge').value = 'all';
        } else if (type === 'rating') {
            this.state.activeFilters.rating = 0;
            document.getElementById('filter-rating').value = '0';
        } else if (type === 'usage') {
            this.state.activeFilters.usage = 'all';
            document.getElementById('filter-usage').value = 'all';
        } else if (type.startsWith('feature-')) {
            const feature = type.replace('feature-', '');
            this.state.activeFilters.features = this.state.activeFilters.features.filter(
                f => f !== feature
            );
            document.querySelector(`.feature-filter[value="${feature}"]`).checked = false;
        } else if (type.startsWith('tag-')) {
            const tag = type.replace('tag-', '');
            this.state.activeFilters.tags = this.state.activeFilters.tags.filter(
                t => t !== tag
            );
            document.querySelector(`.tag-filter[value="${tag}"]`).checked = false;
        }

        this.applyFilters();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
    },

    /**
     * 更新筛选计数
     */
    updateFilterCount() {
        let count = 0;
        
        if (this.state.activeFilters.category !== 'all') count++;
        if (this.state.activeFilters.badge !== 'all') count++;
        if (this.state.activeFilters.rating > 0) count++;
        if (this.state.activeFilters.usage !== 'all') count++;
        count += this.state.activeFilters.features.length;
        count += this.state.activeFilters.tags.length;
        
        this.state.filterCount = count;
        
        // 更新UI
        const filterCountElement = document.querySelector('.filter-count');
        if (filterCountElement) {
            filterCountElement.textContent = count;
            filterCountElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
        
        // 更新清除按钮状态
        const clearButton = document.querySelector('.filter-clear');
        if (clearButton) {
            clearButton.disabled = count === 0;
        }
    },

    /**
     * 切换面板显示
     */
    togglePanel() {
        const filterPanel = document.getElementById(this.config.filterPanelId);
        if (!filterPanel) return;

        this.state.isOpen = !this.state.isOpen;
        
        if (this.state.isOpen) {
            filterPanel.classList.add('open');
        } else {
            filterPanel.classList.remove('open');
        }
        
        // 更新切换按钮图标
        const toggleIcon = document.querySelector('.filter-toggle-icon');
        if (toggleIcon) {
            toggleIcon.textContent = this.state.isOpen ? '▲' : '▼';
        }
    },

    /**
     * 移动端优化
     */
    optimizeForMobile() {
        const updateMobileView = () => {
            const isMobile = window.innerWidth <= this.config.mobileBreakpoint;
            const filterPanel = document.getElementById(this.config.filterPanelId);
            
            if (filterPanel) {
                if (isMobile) {
                    filterPanel.classList.add('mobile-view');
                    // 在移动端默认关闭面板
                    if (!this.state.isOpen) {
                        filterPanel.classList.remove('open');
                    }
                } else {
                    filterPanel.classList.remove('mobile-view');
                    // 在桌面端默认打开面板
                    filterPanel.classList.add('open');
                    this.state.isOpen = true;
                }
            }
        };

        // 初始检测
        updateMobileView();
        
        // 监听窗口大小变化
        window.addEventListener('resize', Helpers.Function.debounce(updateMobileView, 250));
    },

    /**
     * 与应用状态同步
     */
    syncWithAppState() {
        // 从应用状态同步筛选条件
        this.state.activeFilters = { ...AppState.current.activeFilters };
        
        // 更新UI
        this.updateFilterUI();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
    },

    /**
     * 更新筛选UI
     */
    updateFilterUI() {
        // 更新选择框
        const categorySelect = document.getElementById('filter-category');
        const badgeSelect = document.getElementById('filter-badge');
        const ratingSelect = document.getElementById('filter-rating');
        const usageSelect = document.getElementById('filter-usage');
        
        if (categorySelect) categorySelect.value = this.state.activeFilters.category;
        if (badgeSelect) badgeSelect.value = this.state.activeFilters.badge;
        if (ratingSelect) ratingSelect.value = this.state.activeFilters.rating.toString();
        if (usageSelect) usageSelect.value = this.state.activeFilters.usage;
        
        // 更新复选框
        const featureFilters = document.querySelectorAll('.feature-filter');
        const tagFilters = document.querySelectorAll('.tag-filter');
        
        featureFilters.forEach(filter => {
            filter.checked = this.state.activeFilters.features.includes(filter.value);
        });
        
        tagFilters.forEach(filter => {
            filter.checked = this.state.activeFilters.tags.includes(filter.value);
        });
    },

    /**
     * 搜索完成时的处理
     */
    onSearchPerformed(searchDetail) {
        // 如果有搜索关键词，可以自动调整某些筛选条件
        if (searchDetail.query) {
            // 例如：搜索时自动清除某些筛选条件
            // this.clearSomeFilters();
        }
    },

    /**
     * 更新URL参数
     */
    updateURLParams() {
        const params = {};
        
        if (this.state.activeFilters.category !== 'all') {
            params.category = this.state.activeFilters.category;
        }
        
        if (this.state.activeFilters.badge !== 'all') {
            params.badge = this.state.activeFilters.badge;
        }
        
        if (this.state.activeFilters.rating > 0) {
            params.rating = this.state.activeFilters.rating;
        }
        
        if (this.state.activeFilters.usage !== 'all') {
            params.usage = this.state.activeFilters.usage;
        }
        
        if (this.state.activeFilters.features.length > 0) {
            params.features = this.state.activeFilters.features.join(',');
        }
        
        if (this.state.activeFilters.tags.length > 0) {
            params.tags = this.state.activeFilters.tags.join(',');
        }
        
        // 更新URL（不刷新页面）
        Navigation.updateURL(params);
    },

    /**
     * 从URL参数加载筛选条件
     */
    loadFromURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('category')) {
            this.setFilter('category', urlParams.get('category'));
        }
        
        if (urlParams.has('badge')) {
            this.setFilter('badge', urlParams.get('badge'));
        }
        
        if (urlParams.has('rating')) {
            this.setFilter('rating', parseFloat(urlParams.get('rating')));
        }
        
        if (urlParams.has('usage')) {
            this.setFilter('usage', urlParams.get('usage'));
        }
        
        if (urlParams.has('features')) {
            const features = urlParams.get('features').split(',');
            features.forEach(feature => {
                if (!this.state.activeFilters.features.includes(feature)) {
                    this.state.activeFilters.features.push(feature);
                }
            });
        }
        
        if (urlParams.has('tags')) {
            const tags = urlParams.get('tags').split(',');
            tags.forEach(tag => {
                if (!this.state.activeFilters.tags.includes(tag)) {
                    this.state.activeFilters.tags.push(tag);
                }
            });
        }
        
        // 更新UI
        this.updateFilterUI();
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        this.updateFilterCount();
    },

    /**
     * 发送筛选事件
     */
    emitFilterEvent() {
        const event = new CustomEvent('filtersApplied', {
            detail: {
                filters: this.state.activeFilters,
                filterCount: this.state.filterCount,
                results: AppState.cache.filteredTools.length
            }
        });
        
        document.dispatchEvent(event);
    },

    /**
     * 获取筛选统计
     */
    getFilterStats() {
        const totalTools = ToolsDB.getAllTools().length;
        const filteredTools = AppState.cache.filteredTools.length;
        
        return {
            totalTools: totalTools,
            filteredTools: filteredTools,
            filterCount: this.state.filterCount,
            activeFilters: this.state.activeFilters,
            reductionPercent: totalTools > 0 ? 
                Math.round((1 - filteredTools / totalTools) * 100) : 0
        };
    },

    /**
     * 保存筛选预设
     */
    saveFilterPreset(name) {
        const preset = {
            name: name,
            filters: { ...this.state.activeFilters },
            timestamp: Date.now()
        };
        
        const presets = Helpers.Storage.get('filter_presets', []);
        presets.push(preset);
        Helpers.Storage.set('filter_presets', presets);
        
        return preset;
    },

    /**
     * 加载筛选预设
     */
    loadFilterPreset(presetName) {
        const presets = Helpers.Storage.get('filter_presets', []);
        const preset = presets.find(p => p.name === presetName);
        
        if (preset) {
            this.state.activeFilters = { ...preset.filters };
            this.updateFilterUI();
            this.applyFilters();
            this.updateActiveFiltersDisplay();
            this.updateFilterCount();
            
            return true;
        }
        
        return false;
    },

    /**
     * 获取筛选预设列表
     */
    getFilterPresets() {
        return Helpers.Storage.get('filter_presets', []);
    },

    /**
     * 销毁模块
     */
    destroy() {
        // 清理事件监听器
        const filterPanel = document.getElementById(this.config.filterPanelId);
        if (filterPanel) {
            filterPanel.remove();
        }
        
        console.log('筛选模块已销毁');
    }
};

// 初始化筛选模块
Filters.init();

// 导出到全局
window.Filters = Filters;

console.log('Filters 筛选模块已加载');
