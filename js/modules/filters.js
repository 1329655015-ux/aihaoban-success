// 筛选模块
const Filters = {
    currentFilters: {
        category: 'all',
        badge: 'all',
        features: []
    },

    init() {
        console.log('筛选模块已初始化');
        this.createFilterPanel();
        this.initFilterEvents();
    },

    // 创建筛选面板
    createFilterPanel() {
        const toolsSection = document.querySelector('.tools-section');
        if (!toolsSection) return;

        const filterPanel = document.createElement('div');
        filterPanel.className = 'filter-panel';
        filterPanel.innerHTML = `
            <div class="filter-header">
                <h4>筛选工具</h4>
                <button class="filter-clear btn btn-outline">清除筛选</button>
            </div>
            <div class="filter-options">
                <div class="filter-group">
                    <label>分类</label>
                    <select class="filter-category">
                        <option value="all">全部分类</option>
                        <option value="对话助手">对话助手</option>
                        <option value="写作创作">写作创作</option>
                        <option value="图像设计">图像设计</option>
                        <option value="视频制作">视频制作</option>
                        <option value="编程开发">编程开发</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>标签</label>
                    <select class="filter-badge">
                        <option value="all">全部标签</option>
                        <option value="free">免费</option>
                        <option value="pro">专业</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>功能特性</label>
                    <div class="feature-filters">
                        <label><input type="checkbox" value="多模态"> 多模态</label>
                        <label><input type="checkbox" value="中文优化"> 中文优化</label>
                        <label><input type="checkbox" value="实时搜索"> 实时搜索</label>
                        <label><input type="checkbox" value="编程辅助"> 编程辅助</label>
                    </div>
                </div>
            </div>
            <div class="active-filters">
                <!-- 激活的筛选条件将显示在这里 -->
            </div>
        `;

        toolsSection.insertBefore(filterPanel, toolsSection.querySelector('.tools-grid'));

        // 添加筛选面板样式
        this.addFilterStyles();
    },

    // 添加筛选样式
    addFilterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .filter-panel {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                margin-bottom: var(--space-lg);
            }

            .filter-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-md);
            }

            .filter-header h4 {
                margin: 0;
                color: var(--text-primary);
            }

            .filter-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-lg);
                margin-bottom: var(--space-md);
            }

            .filter-group {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }

            .filter-group label {
                font-weight: 500;
                color: var(--text-primary);
                font-size: var(--font-size-sm);
            }

            .filter-group select {
                padding: var(--space-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-primary);
                font-size: var(--font-size-sm);
            }

            .feature-filters {
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
            }

            .feature-filters label {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                font-weight: normal;
                cursor: pointer;
            }

            .feature-filters input[type="checkbox"] {
                margin: 0;
            }

            .active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-sm);
                min-height: 30px;
            }

            .active-filter {
                background: var(--primary-color);
                color: white;
                padding: 4px 8px;
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .active-filter .remove {
                cursor: pointer;
                background: none;
                border: none;
                color: white;
                font-size: 14px;
                line-height: 1;
            }

            @media (max-width: 768px) {
                .filter-options {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    },

    // 初始化筛选事件
    initFilterEvents() {
        // 分类筛选
        const categorySelect = document.querySelector('.filter-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        // 标签筛选
        const badgeSelect = document.querySelector('.filter-badge');
        if (badgeSelect) {
            badgeSelect.addEventListener('change', (e) => {
                this.currentFilters.badge = e.target.value;
                this.applyFilters();
            });
        }

        // 特性筛选
        const featureCheckboxes = document.querySelectorAll('.feature-filters input[type="checkbox"]');
        featureCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFeatureFilters();
            });
        });

        // 清除筛选
        const clearButton = document.querySelector('.filter-clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    },

    // 更新特性筛选
    updateFeatureFilters() {
        const checkedFeatures = Array.from(document.querySelectorAll('.feature-filters input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        
        this.currentFilters.features = checkedFeatures;
        this.applyFilters();
    },

    // 应用筛选
    applyFilters() {
        let filteredTools = ToolsDB.getAllTools();

        // 分类筛选
        if (this.currentFilters.category !== 'all') {
            filteredTools = filteredTools.filter(tool => 
                tool.category === this.currentFilters.category
            );
        }

        // 标签筛选
        if (this.currentFilters.badge !== 'all') {
            filteredTools = filteredTools.filter(tool => 
                tool.badge && tool.badge.type === this.currentFilters.badge
            );
        }

        // 特性筛选
        if (this.currentFilters.features.length > 0) {
            filteredTools = filteredTools.filter(tool =>
                this.currentFilters.features.every(feature =>
                    tool.features.includes(feature)
                )
            );
        }

        // 更新应用状态
        AppState.filteredTools = filteredTools;
        AppState.render();

        // 更新激活的筛选条件显示
        this.updateActiveFiltersDisplay();

        console.log('应用筛选条件:', this.currentFilters, '结果数量:', filteredTools.length);
    },

    // 更新激活的筛选条件显示
    updateActiveFiltersDisplay() {
        const activeFiltersContainer = document.querySelector('.active-filters');
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = '';

        // 分类筛选
        if (this.currentFilters.category !== 'all') {
            this.addActiveFilter('分类: ' + this.currentFilters.category, 'category');
        }

        // 标签筛选
        if (this.currentFilters.badge !== 'all') {
            this.addActiveFilter('标签: ' + this.currentFilters.badge, 'badge');
        }

        // 特性筛选
        this.currentFilters.features.forEach(feature => {
            this.addActiveFilter('特性: ' + feature, 'feature-' + feature);
        });
    },

    // 添加激活的筛选条件
    addActiveFilter(text, type) {
        const activeFiltersContainer = document.querySelector('.active-filters');
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            ${text}
            <button class="remove" data-filter-type="${type}">×</button>
        `;

        // 添加移除事件
        const removeButton = filterElement.querySelector('.remove');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFilter(type);
        });

        activeFiltersContainer.appendChild(filterElement);
    },

    // 移除筛选条件
    removeFilter(type) {
        if (type === 'category') {
            this.currentFilters.category = 'all';
            document.querySelector('.filter-category').value = 'all';
        } else if (type === 'badge') {
            this.currentFilters.badge = 'all';
            document.querySelector('.filter-badge').value = 'all';
        } else if (type.startsWith('feature-')) {
            const feature = type.replace('feature-', '');
            this.currentFilters.features = this.currentFilters.features.filter(f => f !== feature);
            document.querySelector(`.feature-filters input[value="${feature}"]`).checked = false;
        }

        this.applyFilters();
    },

    // 清除所有筛选
    clearFilters() {
        this.currentFilters = {
            category: 'all',
            badge: 'all',
            features: []
        };

        // 重置UI
        document.querySelector('.filter-category').value = 'all';
        document.querySelector('.filter-badge').value = 'all';
        document.querySelectorAll('.feature-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.applyFilters();
    }
};

window.Filters = Filters;
