/**
 * 导航模块
 * 处理顶部导航、底部导航和分类导航
 */

const Navigation = {
    // 模块配置
    config: {
        mobileBreakpoint: 768,
        animationDuration: 300,
        activeClass: 'active',
        loadingClass: 'loading'
    },

    // 模块状态
    state: {
        currentPage: 'home',
        previousPage: null,
        isMobile: false,
        menuOpen: false,
        loading: false
    },

    /**
     * 初始化导航模块
     */
    init() {
        console.log('初始化导航模块');
        
        this.detectMobile();
        this.initTopNavigation();
        this.initBottomNavigation();
        this.initCategoryNavigation();
        this.initMobileNavigation();
        this.initPageTransitions();
        this.bindEvents();
        
        return this;
    },

    /**
     * 检测移动设备
     */
    detectMobile() {
        this.state.isMobile = window.innerWidth <= this.config.mobileBreakpoint;
        
        // 添加设备类到body
        if (this.state.isMobile) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.add('is-desktop');
        }
    },

    /**
     * 初始化顶部导航
     */
    initTopNavigation() {
        const navItems = document.querySelectorAll('.main-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTopNavClick(item);
            });
        });

        console.log('顶部导航初始化完成:', navItems.length, '个导航项');
    },

    /**
     * 初始化底部导航
     */
    initBottomNavigation() {
        const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBottomNavClick(btn);
            });
        });

        console.log('底部导航初始化完成:', navButtons.length, '个导航按钮');
    },

    /**
     * 初始化分类导航
     */
    initCategoryNavigation() {
        const categoryTags = document.querySelectorAll('.function-tags .tag');
        
        categoryTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.handleCategoryClick(tag);
            });
        });

        // 添加分类导航容器（如果不存在）
        if (!document.querySelector('.category-nav')) {
            this.createCategoryNav();
        }

        console.log('分类导航初始化完成:', categoryTags.length, '个分类标签');
    },

    /**
     * 初始化移动端导航
     */
    initMobileNavigation() {
        // 创建移动菜单按钮
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn btn btn-outline';
        menuBtn.innerHTML = '☰ 菜单';
        menuBtn.style.display = this.state.isMobile ? 'block' : 'none';
        
        // 插入到头部操作区域
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(menuBtn);
        }

        // 移动菜单点击事件
        menuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // 创建移动菜单
        this.createMobileMenu();

        console.log('移动导航初始化完成');
    },

    /**
     * 初始化页面切换
     */
    initPageTransitions() {
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onPageShow();
            } else {
                this.onPageHide();
            }
        });

        // 监听页面加载
        window.addEventListener('load', () => {
            this.onPageLoad();
        });

        // 监听页面离开
        window.addEventListener('beforeunload', (e) => {
            this.onPageUnload(e);
        });
    },

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 窗口大小变化
        window.addEventListener('resize', Helpers.Function.debounce(() => {
            this.handleResize();
        }, 250));

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // 历史记录变化
        window.addEventListener('popstate', (e) => {
            this.handlePopState(e);
        });
    },

    /**
     * 处理顶部导航点击
     */
    handleTopNavClick(navItem) {
        const navType = navItem.textContent.trim();
        
        // 更新活跃状态
        this.setActiveNavItem(navItem, '.main-nav .nav-item');
        
        // 根据导航类型执行不同操作
        switch (navType) {
            case '每日':
                this.showDailyTools();
                break;
            case '快讯':
                this.showNews();
                break;
            case '免费':
                this.showFreeTools();
                break;
            case '社群':
                this.showCommunity();
                break;
            case '最新':
                this.showLatestTools();
                break;
            case '项目':
                this.showProjects();
                break;
            case '热门':
                this.showPopularTools();
                break;
            case '教程':
                this.showTutorials();
                break;
            default:
                this.showDefaultContent();
        }

        // 更新页面状态
        this.state.currentPage = navType.toLowerCase();
        this.saveNavigationState();
        
        // 发送通知
        Helpers.showNotification(`切换到${navType}页面`, 'info');
        
        console.log('顶部导航点击:', navType);
    },

    /**
     * 处理底部导航点击
     */
    handleBottomNavClick(navBtn) {
        const pageName = navBtn.querySelector('span:last-child').textContent;
        
        // 更新活跃状态
        this.setActiveNavItem(navBtn, '.bottom-nav .nav-btn');
        
        // 根据页面名称执行不同操作
        switch (pageName) {
            case '首页':
                this.showHomePage();
                break;
            case '我的文档':
                this.showMyDocuments();
                break;
            case '我的内容':
                this.showMyContent();
                break;
            case '我的素材':
                this.showMyMaterials();
                break;
            case '我的分享':
                this.showMyShares();
                break;
            default:
                this.showHomePage();
        }

        // 更新页面状态
        this.state.currentPage = this.mapPageNameToId(pageName);
        this.saveNavigationState();
        
        // 移动端自动关闭菜单
        if (this.state.isMobile && this.state.menuOpen) {
            this.closeMobileMenu();
        }

        console.log('底部导航点击:', pageName);
    },

    /**
     * 处理分类点击
     */
    handleCategoryClick(categoryTag) {
        const categoryName = categoryTag.textContent.trim();
        const categoryId = this.mapCategoryNameToId(categoryName);
        
        // 更新活跃状态
        this.setActiveNavItem(categoryTag, '.function-tags .tag');
        
        // 设置应用状态
        AppState.setCategory(categoryId);
        
        // 更新URL（不刷新页面）
        this.updateURL({ category: categoryId });
        
        // 滚动到工具区域
        this.scrollToTools();
        
        console.log('分类导航点击:', categoryName, '->', categoryId);
    },

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.detectMobile();
        
        if (wasMobile !== this.state.isMobile) {
            // 设备类型发生变化
            this.onDeviceChange();
        }
        
        // 更新移动菜单按钮显示
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (menuBtn) {
            menuBtn.style.display = this.state.isMobile ? 'block' : 'none';
        }
        
        // 在桌面端自动关闭移动菜单
        if (!this.state.isMobile && this.state.menuOpen) {
            this.closeMobileMenu();
        }
    },

    /**
     * 处理键盘导航
     */
    handleKeydown(e) {
        // ESC键关闭菜单
        if (e.key === 'Escape' && this.state.menuOpen) {
            this.closeMobileMenu();
        }
        
        // 方向键导航
        if (e.altKey) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigatePrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.scrollToTop();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.scrollToBottom();
                    break;
            }
        }
    },

    /**
     * 处理外部点击
     */
    handleOutsideClick(e) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (this.state.menuOpen && mobileMenu && menuBtn) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnMenuBtn = menuBtn.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnMenuBtn) {
                this.closeMobileMenu();
            }
        }
    },

    /**
     * 处理历史记录变化
     */
    handlePopState(e) {
        console.log('历史记录变化:', e.state);
        
        if (e.state && e.state.page) {
            this.navigateToPage(e.state.page, false); // 不添加历史记录
        }
    },

    /**
     * 设置活跃导航项
     */
    setActiveNavItem(activeItem, selector) {
        const allItems = document.querySelectorAll(selector);
        
        allItems.forEach(item => {
            item.classList.remove(this.config.activeClass);
        });
        
        activeItem.classList.add(this.config.activeClass);
    },

    /**
     * 创建分类导航
     */
    createCategoryNav() {
        const categories = ToolsDB.getAllCategories();
        const navHtml = `
            <div class="category-nav">
                <div class="category-nav-header">
                    <h3>工具分类</h3>
                    <button class="category-nav-close btn btn-ghost">×</button>
                </div>
                <div class="category-nav-list">
                    ${categories.map(cat => `
                        <div class="category-nav-item" data-category="${cat.id}">
                            <span class="category-icon">${cat.icon}</span>
                            <span class="category-name">${cat.name}</span>
                            <span class="category-count">${cat.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', navHtml);
        
        // 添加点击事件
        const categoryItems = document.querySelectorAll('.category-nav-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.dataset.category;
                this.handleCategoryNavClick(categoryId);
            });
        });
        
        // 关闭按钮事件
        const closeBtn = document.querySelector('.category-nav-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCategoryNav();
            });
        }
    },

    /**
     * 创建移动菜单
     */
    createMobileMenu() {
        const categories = ToolsDB.getAllCategories();
        const menuHtml = `
            <div class="mobile-menu">
                <div class="mobile-menu-header">
                    <div class="mobile-menu-logo">AI好伴</div>
                    <button class="mobile-menu-close btn btn-ghost">×</button>
                </div>
                <div class="mobile-menu-content">
                    <div class="mobile-menu-section">
                        <h4>主要分类</h4>
                        <div class="mobile-menu-categories">
                            ${categories.map(cat => `
                                <div class="mobile-menu-category" data-category="${cat.id}">
                                    <span class="category-icon">${cat.icon}</span>
                                    <span class="category-name">${cat.name}</span>
                                    <span class="category-count">${cat.count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="mobile-menu-section">
                        <h4>快速导航</h4>
                        <div class="mobile-menu-links">
                            <a href="#" class="mobile-menu-link" data-page="daily">每日推荐</a>
                            <a href="#" class="mobile-menu-link" data-page="free">免费工具</a>
                            <a href="#" class="mobile-menu-link" data-page="latest">最新上架</a>
                            <a href="#" class="mobile-menu-link" data-page="popular">热门工具</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mobile-menu-overlay"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', menuHtml);
        
        // 添加事件监听器
        this.bindMobileMenuEvents();
    },

    /**
     * 绑定移动菜单事件
     */
    bindMobileMenuEvents() {
        // 分类点击
        const categories = document.querySelectorAll('.mobile-menu-category');
        categories.forEach(cat => {
            cat.addEventListener('click', () => {
                const categoryId = cat.dataset.category;
                this.handleCategoryNavClick(categoryId);
                this.closeMobileMenu();
            });
        });
        
        // 链接点击
        const links = document.querySelectorAll('.mobile-menu-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
                this.closeMobileMenu();
            });
        });
        
        // 关闭按钮
        const closeBtn = document.querySelector('.mobile-menu-close');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
    },

    /**
     * 切换移动菜单
     */
    toggleMobileMenu() {
        if (this.state.menuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    /**
     * 打开移动菜单
     */
    openMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (menu && overlay) {
            menu.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            this.state.menuOpen = true;
        }
    },

    /**
     * 关闭移动菜单
     */
    closeMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (menu && overlay) {
            menu.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            this.state.menuOpen = false;
        }
    },

    /**
     * 处理分类导航点击
     */
    handleCategoryNavClick(categoryId) {
        AppState.setCategory(categoryId);
        this.updateURL({ category: categoryId });
        this.scrollToTools();
        
        // 更新分类标签的活跃状态
        const categoryName = ToolsDB.getCategoryName(categoryId);
        const categoryTag = Array.from(document.querySelectorAll('.function-tags .tag'))
            .find(tag => tag.textContent.trim() === categoryName);
        
        if (categoryTag) {
            this.setActiveNavItem(categoryTag, '.function-tags .tag');
        }
    },

    /**
     * 显示分类导航
     */
    showCategoryNav() {
        const categoryNav = document.querySelector('.category-nav');
        if (categoryNav) {
            categoryNav.classList.add('show');
        }
    },

    /**
     * 隐藏分类导航
     */
    hideCategoryNav() {
        const categoryNav = document.querySelector('.category-nav');
        if (categoryNav) {
            categoryNav.classList.remove('show');
        }
    },

    /**
     * 导航到页面
     */
    navigateToPage(pageId, pushState = true) {
        this.state.previousPage = this.state.currentPage;
        this.state.currentPage = pageId;
        
        // 更新页面内容
        this.updatePageContent(pageId);
        
        // 更新URL历史记录
        if (pushState) {
            this.updateURL({ page: pageId });
        }
        
        // 发送导航事件
        this.emitNavigationEvent(pageId);
    },

    /**
     * 更新页面内容
     */
    updatePageContent(pageId) {
        // 这里可以根据页面ID加载不同的内容
        // 目前我们主要处理工具展示，所以大部分逻辑在AppState中
        
        switch (pageId) {
            case 'home':
                AppState.setCategory('all');
                break;
            case 'documents':
                this.showMyDocuments();
                break;
            case 'content':
                this.showMyContent();
                break;
            case 'materials':
                this.showMyMaterials();
                break;
            case 'shares':
                this.showMyShares();
                break;
            default:
                AppState.setCategory('all');
        }
    },

    /**
     * 更新URL
     */
    updateURL(params) {
        const url = new URL(window.location);
        
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        window.history.pushState(params, '', url);
    },

    /**
     * 发送导航事件
     */
    emitNavigationEvent(pageId) {
        const event = new CustomEvent('navigationChange', {
            detail: {
                page: pageId,
                previousPage: this.state.previousPage,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
    },

    /**
     * 保存导航状态
     */
    saveNavigationState() {
        Helpers.Storage.set('navigation_state', {
            currentPage: this.state.currentPage,
            timestamp: Date.now()
        });
    },

    /**
     * 加载导航状态
     */
    loadNavigationState() {
        const savedState = Helpers.Storage.get('navigation_state');
        if (savedState && savedState.currentPage) {
            this.navigateToPage(savedState.currentPage, false);
        }
    },

    /**
     * 页面显示时的回调
     */
    onPageShow() {
        console.log('页面显示');
        // 可以在这里重新加载数据或更新状态
    },

    /**
     * 页面隐藏时的回调
     */
    onPageHide() {
        console.log('页面隐藏');
        // 可以在这里暂停视频或动画
    },

    /**
     * 页面加载完成时的回调
     */
    onPageLoad() {
        console.log('页面加载完成');
        this.loadNavigationState();
    },

    /**
     * 页面卸载时的回调
     */
    onPageUnload(e) {
        console.log('页面卸载');
        // 可以在这里保存状态或清理资源
    },

    /**
     * 设备类型变化时的回调
     */
    onDeviceChange() {
        console.log('设备类型变化:', this.state.isMobile ? '移动端' : '桌面端');
        
        // 更新body类
        document.body.classList.toggle('is-mobile', this.state.isMobile);
        document.body.classList.toggle('is-desktop', !this.state.isMobile);
        
        // 发送设备变化事件
        const event = new CustomEvent('deviceChange', {
            detail: {
                isMobile: this.state.isMobile,
                breakpoint: this.config.mobileBreakpoint
            }
        });
        
        document.dispatchEvent(event);
    },

    /**
     * 映射页面名称到ID
     */
    mapPageNameToId(pageName) {
        const map = {
            '首页': 'home',
            '我的文档': 'documents',
            '我的内容': 'content',
            '我的素材': 'materials',
            '我的分享': 'shares'
        };
        
        return map[pageName] || 'home';
    },

    /**
     * 映射分类名称到ID
     */
    mapCategoryNameToId(categoryName) {
        const categories = ToolsDB.getAllCategories();
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.id : 'all';
    },

    // 以下是一些示例页面方法，实际项目中需要根据需求实现

    showDailyTools() {
        console.log('显示每日工具');
        // 实现每日工具展示逻辑
    },

    showNews() {
        console.log('显示快讯');
        // 实现快讯展示逻辑
    },

    showFreeTools() {
        console.log('显示免费工具');
        AppState.setFilter('badge', 'free');
    },

    showCommunity() {
        console.log('显示社群');
        // 实现社群展示逻辑
    },

    showLatestTools() {
        console.log('显示最新工具');
        AppState.setSort('date', 'desc');
    },

    showProjects() {
        console.log('显示项目');
        // 实现项目展示逻辑
    },

    showPopularTools() {
        console.log('显示热门工具');
        AppState.setSort('usage', 'desc');
    },

    showTutorials() {
        console.log('显示教程');
        // 实现教程展示逻辑
    },

    showDefaultContent() {
        console.log('显示默认内容');
        AppState.setCategory('all');
    },

    showHomePage() {
        console.log('显示首页');
        AppState.setCategory('all');
    },

    showMyDocuments() {
        console.log('显示我的文档');
        // 实现我的文档展示逻辑
    },

    showMyContent() {
        console.log('显示我的内容');
        // 实现我的内容展示逻辑
    },

    showMyMaterials() {
        console.log('显示我的素材');
        // 实现我的素材展示逻辑
    },

    showMyShares() {
        console.log('显示我的分享');
        // 实现我的分享展示逻辑
    },

    navigatePrevious() {
        console.log('导航到上一页');
        // 实现上一页导航逻辑
    },

    navigateNext() {
        console.log('导航到下一页');
        // 实现下一页导航逻辑
    },

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    scrollToBottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },

    scrollToTools() {
        const toolsSection = document.querySelector('.tools-section');
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

// 初始化导航模块
Navigation.init();

// 导出到全局
window.Navigation = Navigation;

console.log('Navigation 导航模块已加载');
