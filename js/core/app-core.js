/**
 * 应用主逻辑
 * 协调所有模块，处理应用初始化和全局功能
 */

const AppCore = {
    // 应用配置
    config: {
        version: '1.0.0',
        environment: 'production',
        debug: false,
        apiBaseUrl: '',
        features: {
            search: true,
            filters: true,
            navigation: true,
            notifications: true,
            offline: false
        }
    },

    // 应用状态
    state: {
        isInitialized: false,
        isOnline: true,
        currentView: 'home',
        isLoading: false,
        error: null,
        lastUpdate: null
    },

    // 模块引用
    modules: {
        navigation: null,
        search: null,
        filters: null,
        state: null
    },

    /**
     * 初始化应用
     */
    init() {
        console.log('🚀 AI好伴应用初始化中...');
        
        try {
            this.setupEnvironment();
            this.initModules();
            this.bindGlobalEvents();
            this.setupErrorHandling();
            this.loadInitialData();
            this.setupServiceWorker();
            
            this.state.isInitialized = true;
            this.state.lastUpdate = new Date();
            
            this.onAppReady();
            
            console.log('✅ AI好伴应用初始化完成');
            
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
            this.handleError(error);
        }
        
        return this;
    },

    /**
     * 设置环境配置
     */
    setupEnvironment() {
        // 检测开发环境
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.config.environment = 'development';
            this.config.debug = true;
            this.config.apiBaseUrl = 'http://localhost:3000/api';
        }
        
        // 设置全局配置
        window.APP_CONFIG = this.config;
        
        console.log('环境配置:', this.config);
    },

    /**
     * 初始化所有模块
     */
    initModules() {
        console.log('正在初始化模块...');
        
        // 初始化工具函数（确保最先加载）
        if (typeof Helpers === 'undefined') {
            throw new Error('Helpers 工具库未加载');
        }
        
        // 初始化数据库
        if (typeof ToolsDB === 'undefined') {
            throw new Error('ToolsDB 数据库未加载');
        }
        
        // 初始化状态管理
        if (typeof AppState === 'undefined') {
            throw new Error('AppState 状态管理未加载');
        }
        this.modules.state = AppState;
        
        // 初始化导航模块
        if (typeof Navigation === 'undefined') {
            console.warn('Navigation 模块未加载，跳过初始化');
        } else {
            this.modules.navigation = Navigation;
        }
        
        // 初始化搜索模块
        if (typeof Search === 'undefined') {
            console.warn('Search 模块未加载，跳过初始化');
        } else {
            this.modules.search = Search;
        }
        
        // 初始化筛选模块
        if (typeof Filters === 'undefined') {
            console.warn('Filters 模块未加载，跳过初始化');
        } else {
            this.modules.filters = Filters;
        }
        
        console.log('模块初始化完成:', Object.keys(this.modules));
    },

    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 在线/离线状态检测
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.onConnectionRestored();
        });
        
        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.onConnectionLost();
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
        
        // 错误处理
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });
        
        // Promise rejection 处理
        window.addEventListener('unhandledrejection', (e) => {
            this.handlePromiseRejection(e);
        });
        
        console.log('全局事件绑定完成');
    },

    /**
     * 设置错误处理
     */
    setupErrorHandling() {
        // 重写 console.error 以捕获错误
        const originalConsoleError = console.error;
        console.error = (...args) => {
            originalConsoleError.apply(console, args);
            this.logError('Console Error', args.join(' '));
        };
        
        // 重写 console.warn
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            originalConsoleWarn.apply(console, args);
            if (this.config.debug) {
                this.logWarning('Console Warning', args.join(' '));
            }
        };
        
        console.log('错误处理设置完成');
    },

    /**
     * 加载初始数据
     */
    loadInitialData() {
        console.log('正在加载初始数据...');
        
        this.state.isLoading = true;
        
        try {
            // 从URL参数加载状态
            this.loadStateFromURL();
            
            // 加载用户偏好
            this.loadUserPreferences();
            
            // 初始化工具渲染
            this.renderInitialTools();
            
            this.state.isLoading = false;
            
            console.log('初始数据加载完成');
            
        } catch (error) {
            this.state.isLoading = false;
            this.handleError(error);
        }
    },

    /**
     * 从URL参数加载状态
     */
    loadStateFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 分类参数
        if (urlParams.has('category')) {
            const category = urlParams.get('category');
            AppState.setCategory(category);
        }
        
        // 搜索参数
        if (urlParams.has('search')) {
            const searchQuery = urlParams.get('search');
            AppState.setSearch(searchQuery);
        }
        
        // 页面参数
        if (urlParams.has('page')) {
            const page = urlParams.get('page');
            if (this.modules.navigation) {
                this.modules.navigation.navigateToPage(page, false);
            }
        }
        
        console.log('URL状态加载完成');
    },

    /**
     * 加载用户偏好
     */
    loadUserPreferences() {
        const preferences = Helpers.Storage.get('user_preferences');
        
        if (preferences) {
            // 应用主题
            if (preferences.theme) {
                this.applyTheme(preferences.theme);
            }
            
            // 语言设置
            if (preferences.language) {
                this.setLanguage(preferences.language);
            }
            
            console.log('用户偏好加载完成:', preferences);
        }
    },

    /**
     * 渲染初始工具列表
     */
    renderInitialTools() {
        const toolsContainer = document.getElementById('toolsContainer');
        if (!toolsContainer) return;
        
        const tools = AppState.getCurrentPageTools();
        
        if (tools.length === 0) {
            toolsContainer.innerHTML = this.getEmptyStateHTML();
            return;
        }
        
        toolsContainer.innerHTML = tools.map(tool => 
            Helpers.renderToolCard(tool)
        ).join('');
        
        // 绑定工具卡片事件
        this.bindToolCardEvents();
        
        console.log(`初始工具渲染完成: ${tools.length} 个工具`);
    },

    /**
     * 获取空状态HTML
     */
    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>未找到工具</h3>
                <p>当前筛选条件下没有找到匹配的工具，请尝试调整筛选条件。</p>
                <button class="btn btn-primary" onclick="AppCore.clearFilters()">
                    清除所有筛选条件
                </button>
            </div>
        `;
    },

    /**
     * 绑定工具卡片事件
     */
    bindToolCardEvents() {
        // 查看详情按钮
        const detailButtons = document.querySelectorAll('.view-details');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const toolId = parseInt(btn.dataset.toolId);
                this.showToolDetails(toolId);
            });
        });
        
        // 访问官网按钮（添加跟踪）
        const visitButtons = document.querySelectorAll('.tool-actions .btn-primary');
        visitButtons.forEach(btn => {
            if (btn.href && btn.href !== '#') {
                btn.addEventListener('click', () => {
                    this.trackToolVisit(btn.href);
                });
            }
        });
    },

    /**
     * 设置Service Worker
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator && this.config.features.offline) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(registration => {
                    console.log('Service Worker 注册成功:', registration);
                })
                .catch(error => {
                    console.log('Service Worker 注册失败:', error);
                });
        }
    },

    /**
     * 应用准备完成
     */
    onAppReady() {
        // 发送应用就绪事件
        const event = new CustomEvent('appReady', {
            detail: {
                version: this.config.version,
                modules: Object.keys(this.modules),
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
        
        // 显示欢迎通知
        if (this.config.features.notifications) {
            Helpers.showNotification(
                '🎉 AI好伴已准备就绪！开始探索AI工具吧。',
                'success',
                3000
            );
        }
        
        // 更新页面标题
        document.title = `AI好伴 - ${ToolsDB.getAllTools().length} 款AI工具推荐`;
        
        console.log('🎯 应用已就绪，可以开始使用');
    },

    /**
     * 处理全局按键
     */
    handleGlobalKeydown(e) {
        // Ctrl/Cmd + K 聚焦搜索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.focusSearch();
        }
        
        // ESC 键清除搜索和筛选
        if (e.key === 'Escape') {
            this.clearSearchAndFilters();
        }
        
        // F1 显示帮助
        if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
        }
    },

    /**
     * 处理全局错误
     */
    handleGlobalError(event) {
        const error = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        };
        
        this.logError('Global Error', error);
        this.showErrorToUser('应用发生了错误，请刷新页面重试。');
    },

    /**
     * 处理Promise rejection
     */
    handlePromiseRejection(event) {
        this.logError('Unhandled Promise Rejection', event.reason);
    },

    /**
     * 处理错误
     */
    handleError(error, context = 'AppCore') {
        this.state.error = error;
        
        this.logError(context, error);
        
        // 开发环境显示详细错误
        if (this.config.debug) {
            this.showErrorToUser(`错误: ${error.message}`);
        } else {
            this.showErrorToUser('操作失败，请重试。');
        }
    },

    /**
     * 记录错误
     */
    logError(context, error) {
        const errorLog = {
            context: context,
            error: error,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // 保存到本地存储（限制大小）
        const errorLogs = Helpers.Storage.get('error_logs', []);
        errorLogs.unshift(errorLog);
        
        // 只保留最近50个错误
        if (errorLogs.length > 50) {
            errorLogs.splice(50);
        }
        
        Helpers.Storage.set('error_logs', errorLogs);
        
        // 开发环境输出到控制台
        if (this.config.debug) {
            console.error(`[${context}]`, error);
        }
    },

    /**
     * 记录警告
     */
    logWarning(context, warning) {
        if (this.config.debug) {
            console.warn(`[${context}]`, warning);
        }
    },

    /**
     * 显示错误给用户
     */
    showErrorToUser(message) {
        Helpers.showNotification(message, 'error', 5000);
    },

    /**
     * 连接恢复
     */
    onConnectionRestored() {
        Helpers.showNotification('网络连接已恢复', 'success');
        console.log('网络连接恢复');
    },

    /**
     * 连接丢失
     */
    onConnectionLost() {
        Helpers.showNotification('网络连接已断开', 'warning');
        console.log('网络连接断开');
    },

    /**
     * 页面隐藏
     */
    onPageHidden() {
        console.log('页面隐藏');
        // 可以在这里暂停视频或动画
    },

    /**
     * 页面显示
     */
    onPageVisible() {
        console.log('页面显示');
        // 可以在这里恢复视频或动画
    },

    /**
     * 应用主题
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Helpers.Storage.set('theme', theme);
    },

    /**
     * 设置语言
     */
    setLanguage(language) {
        document.documentElement.lang = language;
        Helpers.Storage.set('language', language);
    },

    /**
     * 显示工具详情
     */
    showToolDetails(toolId) {
        const tool = ToolsDB.getToolById(toolId);
        if (!tool) return;
        
        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${tool.name}</h2>
                        <button class="modal-close btn btn-ghost">×</button>
                    </div>
                    <div class="modal-body">
                        ${ToolsDB.getToolDetailHTML(toolId)}
                    </div>
                </div>
            </div>
        `;
        
        // 创建模态框
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // 绑定关闭事件
        const closeBtn = modalContainer.querySelector('.modal-close');
        const overlay = modalContainer.querySelector('.modal-overlay');
        
        const closeModal = () => {
            document.body.removeChild(modalContainer);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    },

    /**
     * 跟踪工具访问
     */
    trackToolVisit(url) {
        const analytics = Helpers.Storage.get('tool_analytics', {});
        const domain = new URL(url).hostname;
        
        analytics[domain] = (analytics[domain] || 0) + 1;
        Helpers.Storage.set('tool_analytics', analytics);
        
        console.log(`工具访问跟踪: ${domain}`);
    },

    /**
     * 聚焦搜索框
     */
    focusSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    },

    /**
     * 清除搜索和筛选
     */
    clearSearchAndFilters() {
        if (this.modules.search) {
            this.modules.search.clearSearch();
        }
        
        if (this.modules.filters) {
            this.modules.filters.clearAllFilters();
        }
        
        AppState.setCategory('all');
    },

    /**
     * 清除所有筛选条件
     */
    clearFilters() {
        this.clearSearchAndFilters();
        Helpers.showNotification('所有筛选条件已清除', 'success');
    },

    /**
     * 显示帮助
     */
    showHelp() {
        const helpHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>使用帮助</h2>
                        <button class="modal-close btn btn-ghost">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="help-section">
                            <h3>🔍 搜索功能</h3>
                            <ul>
                                <li>在搜索框输入工具名称、描述或特性</li>
                                <li>支持实时搜索建议</li>
                                <li>快捷键: Ctrl+K / Cmd+K 快速聚焦搜索</li>
                            </ul>
                        </div>
                        <div class="help-section">
                            <h3>🎛️ 筛选功能</h3>
                            <ul>
                                <li>按分类、标签、评分、使用情况筛选</li>
                                <li>支持多特性组合筛选</li>
                                <li>点击激活的筛选条件可快速移除</li>
                            </ul>
                        </div>
                        <div class="help-section">
                            <h3>⌨️ 快捷键</h3>
                            <ul>
                                <li><kbd>ESC</kbd> - 清除搜索和筛选</li>
                                <li><kbd>Ctrl+K</kbd> - 聚焦搜索框</li>
                                <li><kbd>F1</kbd> - 显示帮助</li>
                                <li><kbd>↑↓</kbd> - 在搜索结果中导航</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 创建帮助模态框（实现方式与工具详情类似）
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = helpHtml;
        document.body.appendChild(modalContainer);
        
        // 绑定关闭事件（与showToolDetails类似）
        const closeBtn = modalContainer.querySelector('.modal-close');
        const overlay = modalContainer.querySelector('.modal-overlay');
        
        const closeModal = () => {
            document.body.removeChild(modalContainer);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    },

    /**
     * 获取应用状态信息
     */
    getAppInfo() {
        return {
            version: this.config.version,
            environment: this.config.environment,
            initialized: this.state.isInitialized,
            online: this.state.isOnline,
            toolsCount: ToolsDB.getAllTools().length,
            categoriesCount: ToolsDB.getAllCategories().length,
            lastUpdate: this.state.lastUpdate,
            modules: Object.keys(this.modules).filter(key => this.modules[key] !== null)
        };
    },

    /**
     * 导出应用数据
     */
    exportData() {
        const data = {
            tools: ToolsDB.exportData(),
            state: AppState.exportState(),
            preferences: Helpers.Storage.get('user_preferences', {}),
            analytics: Helpers.Storage.get('tool_analytics', {}),
            exportedAt: new Date().toISOString(),
            version: this.config.version
        };
        
        return JSON.stringify(data, null, 2);
    },

    /**
     * 导入应用数据
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.tools) {
                ToolsDB.importData(data.tools);
            }
            
            if (data.state) {
                AppState.importState(data.state);
            }
            
            if (data.preferences) {
                Helpers.Storage.set('user_preferences', data.preferences);
            }
            
            Helpers.showNotification('数据导入成功', 'success');
            return true;
            
        } catch (error) {
            this.handleError(error, 'Data Import');
            return false;
        }
    },

    /**
     * 重置应用
     */
    resetApp() {
        if (confirm('确定要重置应用吗？这将清除所有本地数据和设置。')) {
            localStorage.clear();
            sessionStorage.clear();
            location.reload();
        }
    },

    /**
     * 销毁应用
     */
    destroy() {
        // 清理所有模块
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // 移除全局事件监听器
        window.removeEventListener('online', this.onConnectionRestored);
        window.removeEventListener('offline', this.onConnectionLost);
        
        console.log('应用已销毁');
    }
};

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 设置加载状态
    Helpers.showLoading(document.body, 'AI好伴加载中...');
    
    // 延迟初始化以确保所有资源加载完成
    setTimeout(() => {
        AppCore.init();
        
        // 隐藏加载状态
        Helpers.hideLoading(document.body);
        
    }, 100);
});

// 导出到全局
window.AppCore = AppCore;

// 开发环境下的全局访问
if (process.env.NODE_ENV === 'development') {
    window.App = AppCore;
}

console.log('AppCore 应用主逻辑已加载');
