javascript
// 工具函数库
const Helpers = {
    // DOM 操作助手
    createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    },

    // 渲染工具卡片
    renderToolCard(tool) {
        return `
            <div class="tool-card" data-category="${tool.category}" data-id="${tool.id}">
                <div class="tool-header">
                    <div>
                        <h3 class="tool-name">${tool.name}</h3>
                        <div class="tool-meta">
                            <span class="tool-date">${tool.date}</span>
                            ${tool.badge ? `<span class="tool-badge ${tool.badge.type}">${tool.badge.text}</span>` : ''}
                        </div>
                    </div>
                </div>
                <p class="tool-description">${tool.description}</p>
                <div class="tool-features">
                    ${tool.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="tool-actions">
                    <a href="${tool.affiliateLink || tool.url}" class="btn btn-primary" target="_blank">访问官网</a>
                    <a href="#" class="btn btn-outline view-details">查看详情</a>
                </div>
            </div>
        `;
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// 导出到全局
window.Helpers = Helpers;
