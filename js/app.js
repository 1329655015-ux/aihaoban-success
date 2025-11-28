// AI工具数据库 - 285款工具
const aiTools = [
    // === 对话助手类 (35款) ===
    {
        id: 1, name: "ChatGPT", category: ["chat", "writing", "productivity", "code"],
        description: "OpenAI开发的对话AI，支持复杂问题解答、代码编写、创意写作，功能最全面",
        tags: ["global", "paid", "hot"], rating: 4.9, updated: "2024-01-15",
        features: ["多轮对话", "代码生成", "文件上传"], url: "https://chat.openai.com"
    },
    {
        id: 2, name: "Claude", category: ["chat", "writing"],
        description: "Anthropic的AI助手，擅长长文本处理和复杂推理任务，上下文理解强",
        tags: ["global", "free"], rating: 4.7, updated: "2024-01-12",
        features: ["长文本", "逻辑推理", "安全可靠"], url: "https://claude.ai"
    },
    {
        id: 3, name: "文心一言", category: ["chat", "writing"],
        description: "百度开发的对话AI，中文理解优秀，适合中文场景，集成百度生态",
        tags: ["china", "free"], rating: 4.5, updated: "2024-01-12",
        features: ["中文优化", "多模态", "百度集成"], url: "https://yiyan.baidu.com"
    },
    {
        id: 4, name: "通义千问", category: ["chat", "code"],
        description: "阿里云的大模型，在编程和数据分析方面表现突出，适合技术用户",
        tags: ["china", "free"], rating: 4.4, updated: "2024-01-08",
        features: ["编程辅助", "数据分析", "阿里生态"], url: "https://tongyi.aliyun.com"
    },
    {
        id: 5, name: "Gemini", category: ["chat", "search"],
        description: "谷歌最新大模型，多模态能力强，集成谷歌生态，支持图像理解",
        tags: ["global", "free"], rating: 4.7, updated: "2024-01-14",
        features: ["多模态", "谷歌集成", "实时搜索"], url: "https://gemini.google.com"
    },
    {
        id: 6, name: "Grok", category: ["chat"],
        description: "马斯克xAI开发，实时网络访问，回答风格幽默直接，信息更新快",
        tags: ["global", "paid"], rating: 4.3, updated: "2024-01-10",
        features: ["实时网络", "幽默风格", "快速响应"], url: "https://grok.x.ai"
    }
    // 为测试先放6个工具，确认修复后再添加更多
];

// 应用状态
let currentState = {
    activeCategory: 'all',
    searchQuery: '',
    filteredTools: [...aiTools]
};

// 初始化应用
function initApp() {
    console.log('开始初始化应用...');
    renderNavigation();
    renderTools(currentState.filteredTools);
    setupEventListeners();
    console.log('AI好伴初始化完成');
}

// 渲染导航
function renderNavigation() {
    console.log('渲染导航...');
    const navList = document.querySelector('.nav-list');
    const categories = [
        { id: 'all', name: '🏠 全部工具', count: aiTools.length },
        { id: 'chat', name: '🤖 对话助手', count: aiTools.filter(t => t.category.includes('chat')).length },
        { id: 'design', name: '🎨 图像设计', count: aiTools.filter(t => t.category.includes('design')).length },
        { id: 'video', name: '🎬 视频制作', count: aiTools.filter(t => t.category.includes('video')).length },
        { id: 'writing', name: '✍️ 写作创作', count: aiTools.filter(t => t.category.includes('writing')).length },
        { id: 'code', name: '💻 编程开发', count: aiTools.filter(t => t.category.includes('code')).length }
    ];

    navList.innerHTML = categories.map(cat => `
        <li class="nav-item ${cat.id === 'all' ? 'active' : ''}" 
            data-category="${cat.id}">
            <span class="nav-text">${cat.name}</span>
            <span class="nav-badge">${cat.count}</span>
        </li>
    `).join('');
    
    console.log('导航渲染完成');
}

// 渲染工具卡片
function renderTools(tools) {
    console.log('渲染工具卡片，数量:', tools.length);
    const toolsGrid = document.getElementById('toolsGrid');
    
    if (tools.length === 0) {
        toolsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 60px 20px; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
                <h3 style="margin-bottom: 8px;">未找到相关工具</h3>
                <p>尝试调整搜索关键词或选择其他分类</p>
            </div>
        `;
        return;
    }

    toolsGrid.innerHTML = tools.map(tool => `
        <div class="tool-card" data-category="${tool.category[0]}" data-id="${tool.id}">
            <div class="tool-header">
                <div>
                    <div class="tool-name">${tool.name}</div>
                    <div class="tool-meta">
                        <div class="tool-rating">
                            <span>⭐</span>
                            <span>${tool.rating}</span>
                        </div>
                        <div class="tool-updated">${formatDate(tool.updated)}</div>
                    </div>
                </div>
            </div>
            
            <div class="tool-tags">
                ${tool.tags.map(tag => `<span class="tag ${tag}">${getTagText(tag)}</span>`).join('')}
            </div>
            
            <p class="tool-desc">${tool.description}</p>
            
            <div class="tool-features">
                ${tool.features.map(feature => `
                    <div class="feature">
                        <span>✓</span>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="tool-actions">
                <a href="${tool.url}" class="tool-link" target="_blank" onclick="trackClick('${tool.name}')">
                    访问官网 →
                </a>
                <button class="tool-link secondary" onclick="showToolDetail(${tool.id})">
                    查看详情
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('工具卡片渲染完成');
}

// 设置事件监听 - 修复版
function setupEventListeners() {
    console.log('设置事件监听...');
    
    // 导航点击事件 - 使用事件委托
    document.querySelector('.nav-list').addEventListener('click', function(e) {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            const category = navItem.dataset.category;
            console.log('点击分类:', category);
            filterTools(category);
            setActiveNav(navItem);
        }
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentState.searchQuery = e.target.value.toLowerCase();
            console.log('搜索关键词:', currentState.searchQuery);
            applyFilters();
        });
    }

    // 移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    console.log('事件监听设置完成');
}

// 筛选工具
function filterTools(category) {
    console.log('筛选工具，分类:', category);
    currentState.activeCategory = category;
    applyFilters();
}

// 应用所有筛选条件
function applyFilters() {
    console.log('应用筛选条件...');
    let filtered = aiTools;
    
    // 分类筛选
    if (currentState.activeCategory !== 'all') {
        filtered = filtered.filter(tool => 
            tool.category.includes(currentState.activeCategory)
        );
    }
    
    // 搜索筛选
    if (currentState.searchQuery) {
        filtered = filtered.filter(tool =>
            tool.name.toLowerCase().includes(currentState.searchQuery) ||
            tool.description.toLowerCase().includes(currentState.searchQuery) ||
            (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(currentState.searchQuery)))
        );
    }
    
    currentState.filteredTools = filtered;
    console.log('筛选后工具数量:', filtered.length);
    renderTools(filtered);
    updateToolCounts();
}

// 设置激活导航
function setActiveNav(activeElement) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeElement.classList.add('active');
}

// 更新工具数量
function updateToolCounts() {
    const count = currentState.filteredTools.length;
    const descriptionElement = document.querySelector('.page-description');
    if (descriptionElement) {
        descriptionElement.textContent = `找到 ${count} 款AI工具，覆盖全行业应用场景`;
    }
}

// 工具函数
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('zh-CN');
}

function getTagText(tag) {
    const tagMap = {
        'global': '国际',
        'china': '国产',
        'free': '免费',
        'paid': '付费',
        'freemium': '免费+',
        'hot': '热门'
    };
    return tagMap[tag] || tag;
}

// 移动端侧边栏切换
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// 点击追踪
function trackClick(toolName) {
    console.log(`工具点击: ${toolName}`);
}

// 工具详情
function showToolDetail(toolId) {
    const tool = aiTools.find(t => t.id === toolId);
    if (tool) {
        alert(`即将展示 ${tool.name} 的详细信息和教程...`);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化应用');
    initApp();
});

// 全局导出函数供HTML调用
window.toggleSidebar = toggleSidebar;
window.trackClick = trackClick;
window.showToolDetail = showToolDetail;
