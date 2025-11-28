// 导航模块
const Navigation = {
    init() {
        console.log('导航模块已初始化');
        this.initTopNavigation();
        this.initBottomNavigation();
        this.initCategoryFilters();
    },

    // 初始化顶部导航
    initTopNavigation() {
        const navItems = document.querySelectorAll('.main-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 移除其他项目的active类
                navItems.forEach(nav => nav.classList.remove('active'));
                // 添加active类到当前项目
                item.classList.add('active');
                
                const navType = item.textContent;
                this.handleTopNavClick(navType);
            });
        });
    },

    // 初始化底部导航
    initBottomNavigation() {
        const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 移除其他按钮的active类
                navButtons.forEach(b => b.classList.remove('active'));
                // 添加active类到当前按钮
                btn.classList.add('active');
                
                const page = btn.querySelector('span:last-child').textContent;
                this.handleBottomNavClick(page);
            });
        });
    },

    // 初始化分类筛选
    initCategoryFilters() {
        const functionTags = document.querySelectorAll('.function-tags .tag');
        functionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // 移除其他标签的active类
                functionTags.forEach(t => t.classList.remove('active'));
                // 添加active类到当前标签
                tag.classList.add('active');
                
                const category = this.mapTagToCategory(tag.textContent);
                AppState.setCategory(category);
            });
        });
    },

    // 映射标签到分类
    mapTagToCategory(tagText) {
        const categoryMap = {
            '会员PPT': '办公',
            '写作': '写作创作',
            '设计': '图像设计',
            '对话助手': '对话助手',
            '图像设计': '图像设计',
            '视频制作': '视频制作'
        };
        return categoryMap[tagText] || 'all';
    },

    // 处理顶部导航点击
    handleTopNavClick(navType) {
        console.log('切换到导航:', navType);
        // 这里可以根据导航类型筛选内容
        // 例如：每日更新、免费工具、热门推荐等
        this.showNotification(`切换到${navType}页面`);
    },

    // 处理底部导航点击
    handleBottomNavClick(page) {
        console.log('切换到底部页面:', page);
        // 这里可以处理页面路由切换
        this.showNotification(`切换到${page}页面`);
    },

    // 显示通知
    showNotification(message) {
        // 可以在这里添加更漂亮的通知组件
        console.log('通知:', message);
    }
};

window.Navigation = Navigation;
