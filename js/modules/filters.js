/**
 * 筛选模块
 * 处理工具的多维度筛选功能
 */

const Filters = {
    // 模块配置
    config: {
        animationDuration: 300,
        activeClass: 'active',
        filterPanelClass: 'filter-panel',
        mobileBreakpoint: 768
    },

    // 模块状态
    state: {
        isOpen: false,
        activeFilters: {
            badge: 'all',
            features: [],
            rating: 0,
            usage: 'all'
        },
        availableFeatures: [],
        isMobile: false
    },

    /**
     * 初始化筛选模块
     */
    init() {
        console.log('初始化筛选模块');

        this.detectMobile();
        this.createFilterPanel();
        this.loadFilterState();
        this.bindEvents();

        return this;
    },

    /**
     * 检测移动设备
     */
    detectMobile() {
        this.state.isMobile = window.innerWidth <= this.config.mobileBreakpoint;
    },

    /**
     * 创建筛选面板
     */
    createFilterPanel() {
        // 如果筛选面板已存在，则跳过
        if (document.querySelector('.filter-panel')) return;

        const toolsSection = document.querySelector('.tools-section');
        if (!toolsSection) return;

        const features = ToolsDB.getAllFeatures();
        this.state.availableFeatures = features;

        const filterPanelHtml = `
            <div class="filter-panel">
                <div class="filter-header">
                    <h4>筛选工具</h4>
                    <div class="filter-actions">
                        <button class="filter-toggle btn btn-ghost" type="button">
                            <span class="filter-icon">⚙️</span>
                            <span class="filter-text">筛选</span>
                        </button>
                        <button class="filter-clear btn btn-outline" type="button">清除筛选</button>
                    </div>
                </div>
                
                <div class="filter-content">
                    <div class="filter-options">
                        <div class="filter-group">
                            <label class="filter-label">分类</label>
                            <select class="filter-select filter-category">
                                <option value="all">全部分类</option>
                                ${ToolsDB.getAllCategories().map(cat => `
                                    <option value="${cat.id}">${cat.name} (${cat.count})</option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="filter-group">
                            <label class="filter-label">标签</label>
                            <select class="filter-select filter-badge">
                                <option value="all">全部标签</option>
                                <option value="free">免费</option>
                                <option value="pro">专业</option>
                                <option value="new">新上架</option>
                                <option value="hot">热门</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label class="filter-label">评分</label>
                            <select class="filter-select filter-rating">
                                <option value="0">全部评分</option>
                                <option value="4.5">4.5星以上</option>
                                <option value="4.0">4.0星以上</option>
                                <option value="3.5">3.5星以上</option>
                                <option value="3.0">3.0星以上</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label class="filter-label">使用情况</label>
                            <select class="filter-select filter-usage">
                                <option value="all">全部</option>
                                <option value="high">高频使用</option>
                                <option value="medium">中等使用</option>
                                <option value="low">低频使用</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label class="filter-label">排序方式</label>
                            <select class="filter-select filter-sort">
                                <option value="name:asc">名称 A-Z</option>
                                <option value="name:desc">名称 Z-A</option>
                                <option value="date:desc">最新上架</option>
                                <option value="date:asc">最早上架</option>
                                <option value="rating:desc">评分最高</option>
                                <option value="rating:asc">评分最低</option>
                                <option value="usage:desc">最常使用</option>
                                <option value="usage:asc">最少使用</option>
                            </select>
                        </div>
                    </div>

                    <div class="filter-features">
                        <label class="filter-label">功能特性</label>
                        <div class="features-grid">
                            ${features.map(feature => `
                                <label class="feature-checkbox">
                                    <input type="checkbox" value="${feature}">
                                    <span class="checkmark"></span>
                                    <span class="feature-text">${feature}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="active-filters">
                        <!-- 激活的筛选条件将显示在这里 -->
                    </div>
                </div>
            </div>
        `;

        toolsSection.insertAdjacentHTML('afterbegin', filterPanelHtml);

        // 添加筛选样式
        this.addFilterStyles();

        console.log('筛选面板创建完成');
    },

    /**
     * 添加筛选样式
     */
    addFilterStyles() {
        // 如果已经添加过样式，则跳过
        if (document.getElementById('filter-styles')) return;

        const styles = `
            .filter-panel {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                margin-bottom: var(--space-lg);
                transition: all 0.3s ease;
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
                font-size: var(--font-size-lg);
            }

            .filter-actions {
                display: flex;
                gap: var(--space-sm);
                align-items: center;
            }

            .filter-toggle {
                display: none;
            }

            .filter-content {
                display: block;
            }

            .filter-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-lg);
                margin-bottom: var(--space-lg);
            }

            .filter-group {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }

            .filter-label {
                font-weight: var(--font-medium);
                color: var(--text-primary);
                font-size: var(--font-size-sm);
            }

            .filter-select {
                padding: var(--space-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-primary);
                font-size: var(--font-size-sm);
                color: var(--text-primary);
                transition: border-color 0.2s ease;
                cursor: pointer;
            }

            .filter-select:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
            }

            .filter-features {
                margin-bottom: var(--space-lg);
            }

            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: var(--space-sm);
                margin-top: var(--space-sm);
            }

            .feature-checkbox {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                cursor: pointer;
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
                transition: background-color 0.2s ease;
            }

            .feature-checkbox:hover {
                background: var(--bg-tertiary);
            }

            .feature-checkbox input {
                display: none;
            }

            .checkmark {
                width: 18px;
                height: 18px;
                border: 2px solid var(--border-color);
                border-radius: var(--radius-sm);
                position: relative;
                transition: all 0.2s ease;
            }

            .feature-checkbox input:checked + .checkmark {
                background: var(--primary-color);
                border-color: var(--primary-color);
            }

            .feature-checkbox input:checked + .checkmark::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .feature-text {
                font-size: var(--font-size-sm);
                color: var(--text-primary);
            }

            .active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-sm);
                align-items: center;
                min-height: 40px;
                padding: var(--space-sm) 0;
                border-top: 1px solid var(--border-light);
            }

            .active-filter {
                display: inline-flex;
                align-items: center;
                gap: var(--space-xs);
                background: var(--primary-color);
                color: var(--text-inverse);
                padding: 6px 12px;
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                line-height: 1;
            }

            .active-filter .remove {
                cursor: pointer;
                background: none;
                border: none;
                color: inherit;
                font-size: 14px;
                line-height: 1;
                padding: 0;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }

            .active-filter .remove:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .no-filters {
                color: var(--text-muted);
                font-size: var(--font-size-sm);
            }

            @media (max-width: 768px) {
                .filter-panel {
                    padding: var(--space-md);
                }

                .filter-header {
                    flex-direction: column;
                    align-items: stretch;
                    gap: var(--space-sm);
                }

                .filter-actions {
                    justify-content: space-between;
                }

                .filter-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-xs);
                }

                .filter-content {
                    display: none;
                }

                .filter-panel.open .filter-content {
                    display: block;
                }

                .filter-options {
                    grid-template-columns: 1fr;
                    gap: var(--space-md);
                }

                .features-grid {
                    grid-template-columns: 1fr;
                }

                .active-filters {
                    min-height: 32px;
                }
            }

            @media (max-width: 480px) {
                .filter-panel {
                    padding: var(--space-sm);
                    margin-bottom: var(--space-md);
                }

                .features-grid {
                    grid-template-columns: 1fr;
                }

                .active-filter {
                    padding: 4px 8px;
                    font-size: 0.7rem;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'filter-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    },

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 筛选切换按钮
        const filterToggle = document.querySelector('.filter-toggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                this.toggleFilterPanel();
            });
        }

        // 清除筛选按钮
        const filterClear = document.querySelector('.filter-clear');
        if (filterClear) {
            filterClear.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // 分类筛选
        const categorySelect = document.querySelector('.filter-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.handleCategoryFilter(e.target.value);
            });
        }

        // 标签筛选
        const badgeSelect = document.querySelector('.filter-badge');
        if (badgeSelect) {
            badgeSelect.addEventListener('change', (e) => {
                this.handleBadgeFilter(e.target.value);
            });
        }

        // 评分筛选
        const ratingSelect = document.querySelector('.filter-rating');
        if (ratingSelect) {
            ratingSelect.addEventListener('change', (e) => {
                this.handleRatingFilter(parseFloat(e.target.value));
            });
        }

        // 使用情况筛选
        const usageSelect = document.querySelector('.filter-usage');
        if (usageSelect) {
            usageSelect.addEventListener('change', (e) => {
                this.handleUsageFilter(e.target.value);
            });
        }

        // 排序方式
        const sortSelect = document.querySelector('.filter-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSortChange(e.target.value);
            });
        }

        // 特性筛选
        const featureCheckboxes = document.querySelectorAll('.feature-checkbox input');
        featureCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleFeatureFilter(e.target.value, e.target.checked);
            });
        });

        // 窗口大小变化
        window.addEventListener('resize', Helpers.Function.debounce(() => {
            this.handleResize();
        }, 250));
    },

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.detectMobile();
        
        if (wasMobile !== this.state.isMobile) {
            this.onDeviceChange();
        }
    },

    /**
     * 设备类型变化
     */
    onDeviceChange() {
        const filterPanel = document.querySelector('.filter-panel');
        if (filterPanel) {
            if (this.state.isMobile && this.state.isOpen) {
                filterPanel.classList.add('open');
            } else if (!this.state.isMobile) {
                filterPanel.classList.remove('open');
            }
        }
    },

    /**
     * 切换筛选面板
     */
    toggleFilterPanel() {
        const filterPanel = document.querySelector('.filter-panel');
        if (filterPanel) {
            filterPanel.classList.toggle('open');
            this.state.isOpen = filterPanel.classList.contains('open');
        }
    },

    /**
     * 处理分类筛选
     */
    handleCategoryFilter(categoryId) {
        AppState.setCategory(categoryId);
        this.updateActiveFilters();
    },

    /**
     * 处理标签筛选
     */
    handleBadgeFilter(badgeType) {
        AppState.setFilter('badge', badgeType);
        this.updateActiveFilters();
    },

    /**
     * 处理评分筛选
     */
    handleRatingFilter(minRating) {
        AppState.setFilter('rating', minRating);
        this.updateActiveFilters();
    },

    /**
     * 处理使用情况筛选
     */
    handleUsageFilter(usageType) {
        AppState.setFilter('usage', usageType);
        this.updateActiveFilters();
    },

    /**
     * 处理特性筛选
     */
    handleFeatureFilter(feature, isChecked) {
        AppState.setFilter('features', feature);
        this.updateActiveFilters();
    },

    /**
     * 处理排序变化
     */
    handleSortChange(sortValue) {
        const [sortBy, sortOrder] = sortValue.split(':');
        AppState.setSort(sortBy, sortOrder);
    },

    /**
     * 更新激活的筛选条件显示
     */
    updateActiveFilters() {
        const activeFiltersContainer = document.querySelector('.active-filters');
        if (!activeFiltersContainer) return;

        const state = AppState.current;
        activeFiltersContainer.innerHTML = '';

        // 分类筛选
        if (state.category !== 'all') {
            this.addActiveFilter('分类', ToolsDB.getCategoryName(state.category), 'category');
        }

        // 标签筛选
        if (state.activeFilters.badge !== 'all') {
            this.addActiveFilter('标签', state.activeFilters.badge, 'badge');
        }

        // 评分筛选
        if (state.activeFilters.rating > 0) {
            this.addActiveFilter('评分', `≥ ${state.activeFilters.rating}星`, 'rating');
        }

        // 使用情况筛选
        if (state.activeFilters.usage !== 'all') {
            this.addActiveFilter('使用', state.activeFilters.usage, 'usage');
        }

        // 特性筛选
        state.activeFilters.features.forEach(feature => {
            this.addActiveFilter('特性', feature, `feature-${feature}`);
        });

        // 搜索查询
        if (state.searchQuery) {
            this.addActiveFilter('搜索', state.searchQuery, 'search');
        }

        // 如果没有激活的筛选条件
        if (activeFiltersContainer.children.length === 0) {
            activeFiltersContainer.innerHTML = '<div class="no-filters">暂无筛选条件</div>';
        }
    },

    /**
     * 添加激活的筛选条件
     */
    addActiveFilter(type, value, filterId) {
        const activeFiltersContainer = document.querySelector('.active-filters');
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            <span class="filter-type">${type}:</span>
            <span class="filter-value">${value}</span>
            <button class="remove" data-filter-id="${filterId}">×</button>
        `;

        // 添加移除事件
        const removeButton = filterElement.querySelector('.remove');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFilter(filterId);
        });

        activeFiltersContainer.appendChild(filterElement);
    },

    /**
     * 移除筛选条件
     */
    removeFilter(filterId) {
        if (filterId === 'category') {
            AppState.setCategory('all');
            this.updateSelectValue('.filter-category', 'all');
        } else if (filterId === 'badge') {
            AppState.setFilter('badge', 'all');
            this.updateSelectValue('.filter-badge', 'all');
        } else if (filterId === 'rating') {
            AppState.setFilter('rating', 0);
            this.updateSelectValue('.filter-rating', '0');
        } else if (filterId === 'usage') {
            AppState.setFilter('usage', 'all');
            this.updateSelectValue('.filter-usage', 'all');
        } else if (filterId === 'search') {
            AppState.setSearchQuery('');
            Search.clearSearch();
        } else if (filterId.startsWith('feature-')) {
            const feature = filterId.replace('feature-', '');
            AppState.setFilter('features', feature);
            this.updateCheckboxValue(feature, false);
        }

        this.updateActiveFilters();
    },

    /**
     * 更新选择框的值
     */
    updateSelectValue(selector, value) {
        const select = document.querySelector(selector);
        if (select) {
            select.value = value;
        }
    },

    /**
     * 更新复选框的值
     */
    updateCheckboxValue(feature, isChecked) {
        const checkbox = document.querySelector(`.feature-checkbox input[value="${feature}"]`);
        if (checkbox) {
            checkbox.checked = isChecked;
        }
    },

    /**
     * 清除所有筛选
     */
    clearAllFilters() {
        // 重置应用状态
        AppState.clearFilters();
        
        // 重置UI控件
        this.updateSelectValue('.filter-category', 'all');
        this.updateSelectValue('.filter-badge', 'all');
        this.updateSelectValue('.filter-rating', '0');
        this.updateSelectValue('.filter-usage', 'all');
        this.updateSelectValue('.filter-sort', 'name:asc');
        
        // 清除所有特性复选框
        const featureCheckboxes = document.querySelectorAll('.feature-checkbox input');
        featureCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // 更新激活的筛选条件显示
        this.updateActiveFilters();
        
        // 发送通知
        Helpers.showNotification('已清除所有筛选条件', 'success');
        
        console.log('所有筛选条件已清除');
    },

    /**
     * 加载筛选状态
     */
    loadFilterState() {
        // 从应用状态同步筛选条件
        this.state.activeFilters = { ...AppState.current.activeFilters };
        this.updateActiveFilters();
        
        // 更新UI控件
        this.updateSelectValue('.filter-category', AppState.current.category);
        this.updateSelectValue('.filter-badge', AppState.current.activeFilters.badge);
        this.updateSelectValue('.filter-rating', AppState.current.activeFilters.rating.toString());
        this.updateSelectValue('.filter-usage', AppState.current.activeFilters.usage);
        this.updateSelectValue('.filter-sort', `${AppState.current.sortBy}:${AppState.current.sortOrder}`);
        
        // 更新特性复选框
        AppState.current.activeFilters.features.forEach(feature => {
            this.updateCheckboxValue(feature, true);
        });
    },

    /**
     * 获取筛选统计
     */
    getFilterStats() {
        const state = AppState.current;
        return {
            activeCategory: state.category,
            activeFilters: state.activeFilters,
            totalActive: state.activeFilters.features.length + 
                         (state.category !== 'all' ? 1 : 0) +
                         (state.activeFilters.badge !== 'all' ? 1 : 0) +
                         (state.activeFilters.rating > 0 ? 1 : 0) +
                         (state.activeFilters.usage !== 'all' ? 1 : 0),
            hasSearch: !!state.searchQuery
        };
    },

    /**
     * 销毁模块
     */
    destroy() {
        // 移除事件监听器
        const filterPanel = document.querySelector('.filter-panel');
        if (filterPanel) {
            filterPanel.remove();
        }
        
        // 移除样式
        const styles = document.getElementById('filter-styles');
        if (styles) {
            styles.remove();
        }
        
        console.log('筛选模块已销毁');
    }
};

// 初始化筛选模块
Filters.init();

// 导出到全局
window.Filters = Filters;

console.log('Filters 筛选模块已加载');
