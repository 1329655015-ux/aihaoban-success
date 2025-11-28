// 应用主逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI工具集应用已启动');
    
    // 初始化所有模块
    try {
        // 初始化应用状态
        AppState.init();
        
        // 初始化功能模块
        Navigation.init();
        Search.init();
        Filters.init();
        
        console.log('所有模块初始化完成');
        
        // 添加一些示例工具数据（如果数据库为空）
        if (ToolsDB.getAllTools().length === 0) {
            console.warn('工具数据库为空，请检查数据加载');
        }
        
    } catch (error) {
        console.error('应用初始化错误:', error);
    }
    
    // 添加全局错误处理
    window.addEventListener('error', function(e) {
        console.error('全局错误:', e.error);
    });
});
