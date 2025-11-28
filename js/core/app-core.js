// 核心应用逻辑
const API_BASE = 'https://api.aihaoban.cn'; // 替换为您的API

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    input.value = '';
    
    setTimeout(() => {
        let response = generateResponse(text, currentMode);
        if (currentMode === 'draw') {
            response = `<p>生成图像中... 提示：${text}</p><img src="https://via.placeholder.com/400x300/007bff/white?text=AI+Generated+Image: ${encodeURIComponent(text)}" alt="AI图像">`;
        }
        addMessage(response, 'ai');
    }, 1000);
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) sendMessage();
}

function addMessage(text, sender) {
    const msg = { text, sender, timestamp: new Date().toISOString() };
    messages.push(msg);
    saveMessages();
    renderMessage(msg);
}

function renderMessage(msg) {
    const container = document.getElementById('chatContainer');
    const div = document.createElement('div');
    div.className = `message ${msg.sender}`;
    if (msg.sender === 'ai') {
        div.innerHTML = `<div class="markdown">${marked.parse(msg.text)}</div>`;
    } else {
        div.textContent = msg.text;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function generateResponse(text, mode) {
    const responses = {
        chat: `在${mode}模式下，你说：${text}。我理解你的意思，让我们深入聊聊！（模拟响应，可替换API）`,
        write: `写作灵感：基于“${text}”，我为你生成一段故事开头：从前，有一个...（继续扩展）`,
        draw: '' // 由sendMessage处理
    };
    return responses[mode] || '有趣的想法！AI好伴在思考中...';
}

function loadMessages() {
    messages.forEach(renderMessage);
}

function updatePlaceholder() {
    const input = document.getElementById('messageInput');
    const placeholders = { chat: '聊聊今天的心情？', write: '描述你的写作主题...', draw: '输入画图提示，如“一只飞翔的龙”' };
    input.placeholder = placeholders[currentMode] || '输入你的消息...';
}
