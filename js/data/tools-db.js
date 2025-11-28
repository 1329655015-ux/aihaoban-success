/**
 * 工具数据库
 * 管理所有AI工具的数据和分类
 */

// AI工具数据库
const ToolsDB = {
    // 工具数据
    tools: [
        {
            id: 1,
            name: "文心一言",
            date: "2024/1/14",
            badge: { type: "free", text: "免费" },
            description: "百度开发的对话AI，中文理解优秀，适合中文场景，集成百度生态",
            features: ["中文优化", "多模态", "百度集成"],
            category: "对话助手",
            tags: ["百度", "中文", "多模态"],
            url: "https://yiyan.baidu.com",
            affiliateLink: "#",
            rating: 4.5,
            usage: "high",
            featured: true
        },
        {
            id: 2,
            name: "Gemini",
            date: "2024/1/14", 
            badge: { type: "free", text: "免费" },
            description: "谷歌最新大模型，多模态能力强，集成谷歌生态，支持图像理解",
            features: ["多模态", "谷歌集成", "实时搜索"],
            category: "对话助手",
            tags: ["谷歌", "多模态", "实时搜索"],
            url: "https://gemini.google.com",
            affiliateLink: "#",
            rating: 4.3,
            usage: "high",
            featured: true
        },
        {
            id: 3,
            name: "通义千问",
            date: "2024/1/12",
            badge: { type: "free", text: "免费" },
            description: "阿里云的大模型，在编程和数据分析方面表现突出，适合技术用户",
            features: ["编程辅助", "数据分析", "阿里生态"],
            category: "对话助手", 
            tags: ["阿里云", "编程", "数据分析"],
            url: "https://tongyi.aliyun.com",
            affiliateLink: "#",
            rating: 4.2,
            usage: "medium",
            featured: false
        },
        {
            id: 4,
            name: "Grok",
            date: "2024/1/10",
            badge: { type: "pro", text: "快捷" },
            description: "马斯克xAI开发，实时网络访问，回答风格幽默直接，信息更新快",
            features: ["实时网络", "幽默风格", "快速响应"],
            category: "对话助手",
            tags: ["xAI", "实时", "幽默"],
            url: "https://grok.x.ai",
            affiliateLink: "#",
            rating: 4.0,
            usage: "medium",
            featured: false
        },
        {
            id: 5,
            name: "即梦AI",
            date: "2024/1/08", 
            badge: { type: "free", text: "免费" },
            description: "文生视频/图生视频，每天免费用，支持多种视频风格",
            features: ["视频生成", "免费额度", "多种风格"],
            category: "视频制作",
            tags: ["视频生成", "免费", "创意"],
            url: "#",
            affiliateLink: "#",
            rating: 4.1,
            usage: "low",
            featured: true
        },
        {
            id: 6, 
            name: "链接写作",
            date: "2024/1/05",
            badge: { type: "pro", text: "专业" },
            description: "AI一键生成小说，多种模板选择，支持长篇创作",
            features: ["创作辅助", "小说模板", "长篇支持"], 
            category: "写作创作",
            tags: ["写作", "小说", "创作"],
            url: "#",
            affiliateLink: "#",
            rating: 4.4,
            usage: "medium",
            featured: false
        },
        {
            id: 7,
            name: "CodePilot",
            date: "2024/1/03",
            badge: { type: "free", text: "免费" },
            description: "智能代码助手，支持多种编程语言，实时代码建议",
            features: ["代码补全", "多语言", "实时建议"],
            category: "编程开发",
            tags: ["编程", "代码", "开发"],
            url: "#",
            affiliateLink: "#",
            rating: 4.6,
            usage: "high",
            featured: true
        },
        {
            id: 8,
            name: "ArtGenius",
            date: "2024/1/01",
            badge: { type: "pro", text: "专业" },
            description: "AI艺术生成工具，支持多种艺术风格和高分辨率输出",
            features: ["艺术生成", "多种风格", "高分辨率"],
            category: "图像设计",
            tags: ["艺术", "设计", "图像生成"],
            url: "#",
            affiliateLink: "#",
            rating: 4.3,
            usage: "medium",
            featured: false
        },
        {
            id: 9,
            name: "MindMapper",
            date: "2023/12/28",
            badge: { type: "free", text: "免费" },
            description: "AI思维导图工具，智能整理思路，自动生成结构",
            features: ["思维导图", "自动整理", "协作编辑"],
            category: "办公增效",
            tags: ["思维导图", "办公", "协作"],
            url: "#",
            affiliateLink: "#",
            rating: 4.2,
            usage: "low",
            featured: false
        },
        {
            id: 10,
            name: "AudioCraft",
            date: "2023/12/25",
            badge: { type: "pro", text: "专业" },
            description: "AI音频处理工具，支持语音合成和音频编辑",
            features: ["语音合成", "音频编辑", "音效处理"],
            category: "音频处理",
            tags: ["音频", "语音", "编辑"],
            url: "#",
            affiliateLink: "#",
            rating: 4.0,
            usage: "low",
            featured: false
        }
    ],

    // 分类数据
    categories: [
        { id: "all", name: "全部工具", description: "所有AI工具", count: 10, icon: "🔍" },
        { id: "conversation", name: "对话助手", description: "智能对话和聊天机器人", count: 4, icon: "💬" },
        { id: "writing", name: "写作创作", description: "文案写作和内容创作工具", count: 1, icon: "✍️" },
        { id: "design", name: "图像设计", description: "图片生成和设计工具", count: 1, icon: "🎨" },
        { id: "video", name: "视频制作", description: "视频生成和编辑工具", count: 1, icon: "🎬" },
        { id: "programming", name: "编程开发", description: "代码辅助和开发工具", count: 1, icon: "💻" },
        { id: "productivity", name: "办公增效", description: "提高工作效率的工具", count: 1, icon: "📊" },
        { id: "audio", name: "音频处理", description: "音频编辑和语音处理工具", count: 1, icon: "🎵" }
    ],

    // 特性标签
    features: [
        "中文优化", "多模态", "百度集成", "谷歌集成", "实时搜索", 
        "编程辅助", "数据分析", "阿里生态", "实时网络", "幽默风格",
        "快速响应", "视频生成", "免费额度", "多种风格", "创作辅助",
        "小说模板", "长篇支持", "代码补全", "多语言", "实时建议",
        "艺术生成", "高分辨率", "思维导图", "自动整理", "协作编辑",
        "语音合成", "音频编辑", "音效处理"
    ],

    /**
     * 获取所有工具
     */
    getAllTools() {
        return this.tools;
    },

    /**
     * 按ID获取工具
     */
    getToolById(id) {
        return this.tools.find(tool => tool.id === id);
    },

    /**
     * 按分类获取工具
     */
    getToolsByCategory(categoryId) {
        if (categoryId === 'all') {
            return this.tools;
        }
        return this.tools.filter(tool => tool.category === this.getCategoryName(categoryId));
    },

    /**
     * 获取分类名称
     */
    getCategoryName(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.name : '全部工具';
    },

    /**
     * 搜索工具
     */
    searchTools(query) {
        if (!query || query.trim() === '') {
            return this.tools;
        }

        const lowerQuery = query.toLowerCase().trim();
        
        return this.tools.filter(tool => 
            tool.name.toLowerCase().includes(lowerQuery) ||
            tool.description.toLowerCase().includes(lowerQuery) ||
            tool.features.some(feature => feature.toLowerCase().includes(lowerQuery)) ||
            tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    },

    /**
     * 按特性筛选工具
     */
    filterToolsByFeatures(features) {
        if (!features || features.length === 0) {
            return this.tools;
        }

        return this.tools.filter(tool =>
            features.every(feature => tool.features.includes(feature))
        );
    },

    /**
     * 按标签筛选工具
     */
    filterToolsByTags(tags) {
        if (!tags || tags.length === 0) {
            return this.tools;
        }

        return this.tools.filter(tool =>
            tags.some(tag => tool.tags.includes(tag))
        );
    },

    /**
     * 按评分筛选工具
     */
    filterToolsByRating(minRating) {
        return this.tools.filter(tool => tool.rating >= minRating);
    },

    /**
     * 获取推荐工具
     */
    getRecommendedTools(limit = 6) {
        return this.tools
            .filter(tool => tool.featured || tool.usage === 'high')
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    },

    /**
     * 获取新上架工具
     */
    getNewTools(limit = 5) {
        return this.tools
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },

    /**
     * 获取热门工具
     */
    getPopularTools(limit = 5) {
        return this.tools
            .filter(tool => tool.usage === 'high')
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    },

    /**
     * 获取免费工具
     */
    getFreeTools() {
        return this.tools.filter(tool => tool.badge && tool.badge.type === 'free');
    },

    /**
     * 获取所有分类
     */
    getAllCategories() {
        return this.categories;
    },

    /**
     * 获取分类统计
     */
    getCategoryStats() {
        return this.categories.map(category => {
            const count = this.getToolsByCategory(category.id).length;
            return {
                ...category,
                count: count
            };
        });
    },

    /**
     * 获取所有特性
     */
    getAllFeatures() {
        return this.features;
    },

    /**
     * 添加新工具
     */
    addTool(toolData) {
        const newTool = {
            id: this.generateId(),
            date: Helpers.Date.format(new Date(), 'YYYY/MM/DD'),
            rating: 0,
            usage: 'low',
            featured: false,
            ...toolData
        };

        this.tools.push(newTool);
        this.updateCategoryCounts();
        
        return newTool;
    },

    /**
     * 更新工具
     */
    updateTool(id, toolData) {
        const index = this.tools.findIndex(tool => tool.id === id);
        if (index !== -1) {
            this.tools[index] = { ...this.tools[index], ...toolData };
            return this.tools[index];
        }
        return null;
    },

    /**
     * 删除工具
     */
    deleteTool(id) {
        const index = this.tools.findIndex(tool => tool.id === id);
        if (index !== -1) {
            this.tools.splice(index, 1);
            this.updateCategoryCounts();
            return true;
        }
        return false;
    },

    /**
     * 生成新ID
     */
    generateId() {
        return Math.max(...this.tools.map(tool => tool.id), 0) + 1;
    },

    /**
     * 更新分类计数
     */
    updateCategoryCounts() {
        this.categories.forEach(category => {
            category.count = this.getToolsByCategory(category.id).length;
        });
    },

    /**
     * 获取工具使用情况统计
     */
    getUsageStats() {
        const stats = {
            high: 0,
            medium: 0,
            low: 0
        };

        this.tools.forEach(tool => {
            stats[tool.usage]++;
        });

        return stats;
    },

    /**
     * 获取评分分布
     */
    getRatingDistribution() {
        const distribution = {
            '5.0': 0,
            '4.0-4.9': 0,
            '3.0-3.9': 0,
            '2.0-2.9': 0,
            '1.0-1.9': 0
        };

        this.tools.forEach(tool => {
            if (tool.rating >= 4.5) distribution['5.0']++;
            else if (tool.rating >= 4.0) distribution['4.0-4.9']++;
            else if (tool.rating >= 3.0) distribution['3.0-3.9']++;
            else if (tool.rating >= 2.0) distribution['2.0-2.9']++;
            else distribution['1.0-1.9']++;
        });

        return distribution;
    },

    /**
     * 导出工具数据
     */
    exportData() {
        return {
            tools: this.tools,
            categories: this.categories,
            features: this.features,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    },

    /**
     * 导入工具数据
     */
    importData(data) {
        if (data.tools) this.tools = data.tools;
        if (data.categories) this.categories = data.categories;
        if (data.features) this.features = data.features;
        
        this.updateCategoryCounts();
        return true;
    },

    /**
     * 重置为默认数据
     */
    resetToDefault() {
        // 在实际应用中，这里会重新初始化数据
        this.updateCategoryCounts();
        return true;
    },

    /**
     * 获取工具详情HTML
     */
    getToolDetailHTML(toolId) {
        const tool = this.getToolById(toolId);
        if (!tool) return '';

        return `
            <div class="tool-detail">
                <div class="tool-detail-header">
                    <h2>${tool.name}</h2>
                    <div class="tool-meta">
                        <span class="tool-date">${tool.date}</span>
                        ${tool.badge ? `<span class="tool-badge ${tool.badge.type}">${tool.badge.text}</span>` : ''}
                        <span class="tool-rating">⭐ ${tool.rating}/5.0</span>
                    </div>
                </div>
                
                <div class="tool-detail-content">
                    <div class="tool-description">
                        <h3>工具介绍</h3>
                        <p>${tool.description}</p>
                    </div>
                    
                    <div class="tool-features">
                        <h3>主要特性</h3>
                        <div class="features-list">
                            ${tool.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="tool-tags">
                        <h3>标签</h3>
                        <div class="tags-list">
                            ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="tool-actions">
                        <a href="${tool.affiliateLink || tool.url}" class="btn btn-primary" target="_blank" rel="noopener">
                            访问官网
                        </a>
                        <button class="btn btn-outline" onclick="window.history.back()">
                            返回列表
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

// 初始化分类计数
ToolsDB.updateCategoryCounts();

// 导出到全局
window.ToolsDB = ToolsDB;

console.log('ToolsDB 数据库已加载，共', ToolsDB.tools.length, '个工具');
