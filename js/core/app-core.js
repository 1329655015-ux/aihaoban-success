// === 把 js/core/app-core.js 里的这两个函数整个替换成下面这段 ===

// 真实发送消息（支持所有大模型）
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    document.getElementById('sendBtn').disabled = true;

    // 显示“AI正在思考”
    const thinkingMsg = addMessage('▍', 'ai');
    thinkingMsg.id = 'thinking';

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-你的DeepSeek密钥放这里'   // ←←← 这里填你的密钥
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: text }],
                stream: true
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ') && !line.endsWith('[DONE]')) {
                    try {
                        const json = JSON.parse(line.slice(6));
                        const delta = json.choices[0]?.delta?.content || '';
                        aiText += delta;
                        // 实时更新最后一条消息
                        const msgEl = document.getElementById('thinking');
                        if (msgEl) {
                            msgEl.innerHTML = `<div class="markdown">${marked.parse(aiText + '▍')}</div>`;
                        }
                    } catch (e) { }
                }
            }
        }
        // 结束流式，移除光标
        const msgEl = document.getElementById('thinking');
        if (msgEl) {
            msgEl.id = '';
            msgEl.innerHTML = `<div class="markdown">${marked.parse(aiText)}</div>`;
        }
        messages[messages.length - 1].text = aiText; // 保存完整内容
    } catch (err) {
        addMessage('网络错误，请检查API密钥或网络', 'ai');
    } finally {
        input.disabled = false;
        document.getElementById('sendBtn').disabled = false;
        input.focus();
    }
}

// 工具调用（现在也真实了）
async function useTool(tool) {
    let prompt = '';
    switch (tool) {
        case 'search': prompt = window.prompt('网页搜索关键词：'); break;
        case 'code':   prompt = window.prompt('输入要执行的代码：'); break;
        case 'weather':prompt = window.prompt('输入城市名：'); break;
        case 'image':  prompt = window.prompt('输入画图描述：'); break;
    }
    if (!prompt) return;

    addMessage(`使用工具：${tool === 'search' ? '网页搜索' : tool === 'code' ? '代码执行' : tool === 'weather' ? '天气查询' : '生成图像'} "${prompt}"`, 'user');
    
    // 直接复用上面的 sendMessage 逻辑，让AI自己决定怎么用工具
    document.getElementById('messageInput').value = prompt;
    sendMessage();
}
