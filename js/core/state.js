// 应用状态管理
const AppState = {
    currentCategory: 'all',
    currentSearch: '',
    filteredTools: [],
    
    // 初始化状态
    init() {
        this.filteredTools = ToolsDB.getAllTools();
        this.render();
    },
    
    // 设置当前分类
    setCategory(category) {
        this.currentCategory = category;
        this.applyFilters();
    },
    
    // 设置搜索关键词
    setSearch(query) {
        this.currentSearch = query;
        this.applyFilters();
    },
    
    // 应用筛选条件
    applyFilters() {
        let tools = ToolsDB.getAllTools();
        
        // 按分类筛选
        if (this.currentCategory !== 'all') {
            tools = ToolsDB.getToolsByCategory(this.currentCategory);
        }
        
        // 按搜索关键词筛选
        if (this.currentSearch) {
            tools = ToolsDB.searchTools(this.currentSearch);
        }
        
        this.filteredTools = tools;
        this.render();
    },
    
    // 渲染工具列表
    render() {
        const container = document.getElementById('toolsContainer');
        if (container) {
            container.innerHTML = this.filteredTools.map(tool => 
                Helpers.renderToolCard(tool)
            ).join('');
        }
    }
};

// 导出到全局
window.AppState = AppState;
js/core/app-core.js

javascript
// 应用主逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI工具集应用已启动');
    
    // 初始化应用状态
    AppState.init();
    
    // 这里可以添加其他初始化代码
    // 比如事件监听器、功能模块初始化等
    
    // 临时示例：添加一些交互功能
    const functionTags = document.querySelectorAll('.function-tags .tag');
    functionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除其他标签的active类
            functionTags.forEach(t => t.classList.remove('active'));
            // 给当前点击的标签添加active类
            this.classList.add('active');
            
            // 这里可以添加分类筛选逻辑
            const category = this.textContent;
            console.log('选择了分类:', category);
        });
    });
    
    // 底部导航交互
    const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // 移除其他按钮的active类
            navButtons.forEach(b => b.classList.remove('active'));
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 这里可以添加页面切换逻辑
            const page = this.querySelector('span:last-child').textContent;
            console.log('切换到页面:', page);
        });
    });
});
