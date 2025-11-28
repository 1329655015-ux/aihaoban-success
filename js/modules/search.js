// 搜索模块
function initSearch() {
    // 未来集成真实搜索API
    console.log('Search module initialized');
}

function useTool(tool) {
    let prompt = getPrompt(tool); // 从 helpers.js
    switch (tool) {
        case 'search':
            addMessage(`使用工具：网页搜索 "${prompt}"`, 'user');
            setTimeout(() => addMessage(`搜索结果：找到了相关信息，包括AI工具教程。（模拟，实际调用web_search API）`, 'ai'), 1500);
            break;
        case 'code':
            addMessage(`执行代码：${prompt}`, 'user');
            setTimeout(() => addMessage(`代码输出：结果为42。（使用code_execution工具模拟）`, 'ai'), 1500);
            break;
        case 'weather':
            addMessage(`查询天气：${prompt}`, 'user');
            setTimeout(() => addMessage(`北京天气：晴，25°C。（调用weather API）`, 'ai'), 1500);
            break;
        case 'image':
            addMessage(`生成图像：${prompt}`, 'user');
            setTimeout(() => {
                const imgSrc = `https://via.placeholder.com/400x300/28a745/white?text=AI+Image: ${encodeURIComponent(prompt)}`;
                addMessage(`<p>图像生成完成！</p><img src="${imgSrc}" alt="生成图像">`, 'ai');
            }, 2000);
            break;
    }
}
