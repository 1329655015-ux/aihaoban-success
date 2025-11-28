// 工具数据库
const ToolsDB = {
    tools: [
        {
            id: 1,
            name: "文心一言",
            date: "2024/1/14",
            badge: { type: "free", text: "免费" },
            description: "百度开发的对话AI，中文理解优秀，适合中文场景，集成百度生态",
            features: ["中文优化", "多模态", "百度集成"],
            category: "对话助手",
            url: "https://yiyan.baidu.com",
            affiliateLink: "#"
        },
        {
            id: 2,
            name: "Gemini",
            date: "2024/1/14", 
            badge: { type: "free", text: "免费" },
            description: "谷歌最新大模型，多模态能力强，集成谷歌生态，支持图像理解",
            features: ["多模态", "谷歌集成", "实时搜索"],
            category: "对话助手",
            url: "https://gemini.google.com",
            affiliateLink: "#"
        },
        {
            id: 3,
            name: "通义千问",
            date: "2024/1/12",
            badge: { type: "free", text: "免费" },
            description: "阿里云的大模型，在编程和数据分析方面表现突出，适合技术用户",
            features: ["编程辅助", "数据分析", "阿里生态"],
            category: "对话助手", 
            url: "https://tongyi.aliyun.com",
            affiliateLink: "#"
        },
        {
            id: 4,
            name: "Grok",
            date: "2024/1/10",
            badge: { type: "pro", text: "快捷" },
            description: "马斯克xAI开发，实时网络访问，回答风格幽默直接，信息更新快",
            features: ["实时网络", "幽默风格", "快速响应"],
            category: "对话助手",
            url: "https://grok.x.ai",
            affiliateLink: "#"
        }
    ],

    // 获取所有工具
    getAllTools() {
        return this.tools;
    },

    // 按分类获取工具
    getToolsByCategory(category) {
        if (category === 'all') return this.tools;
        return this.tools.filter(tool => tool.category === category);
    },

    // 搜索工具
    searchTools(query) {
        const lowerQuery = query.toLowerCase();
        return this.tools.filter(tool => 
            tool.name.toLowerCase().includes(lowerQuery) ||
            tool.description.toLowerCase().includes(lowerQuery) ||
            tool.features.some(feature => feature.toLowerCase().includes(lowerQuery))
        );
    }
};

// 导出到全局
window.ToolsDB = ToolsDB;
