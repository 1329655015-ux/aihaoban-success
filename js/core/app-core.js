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
