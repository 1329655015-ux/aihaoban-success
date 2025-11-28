// 主应用入口
document.addEventListener('DOMContentLoaded', () => {
    loadState(); // 从 state.js
    loadMessages(); // 从 app-core.js
    updatePlaceholder(); // 从 app-core.js
    if (window.innerWidth <= 768) document.querySelector('.toggle-sidebar').style.display = 'block';
    
    // 初始化模块
    initNavigation(); // 从 navigation.js
    initSearch(); // 从 search.js
    initFilters(); // 从 filters.js
    
    // 加载工具数据
    console.log('Loaded tools:', TOOLS_DB); // 从 tools-db.js
});
