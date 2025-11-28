// 状态管理
let currentMode = 'chat';
let messages = JSON.parse(localStorage.getItem('aihaoban_messages')) || [];

function saveMessages() {
    localStorage.setItem('aihaoban_messages', JSON.stringify(messages.slice(-50))); // 限50条
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const btn = document.querySelector('.theme-toggle');
    btn.textContent = document.body.classList.contains('dark') ? '☀️ 亮模式' : '🌙 暗模式';
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function loadState() {
    if (localStorage.getItem('theme') === 'dark') toggleTheme();
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    updatePlaceholder();
    if (confirm('切换模式将清空当前聊天，确认吗？')) {
        messages = [];
        saveMessages();
        document.getElementById('chatContainer').innerHTML = `<div class="message ai"><p>已切换到${getModeName(mode)}模式。开始新对话吧！</p></div>`;
    }
}

function getModeName(mode) {
    const names = { chat: '智能对话', write: '创意写作', draw: 'AI画图' };
    return names[mode] || '未知';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('hidden');
}

window.clearChat = () => { if (confirm('清空聊天历史？')) { messages = []; saveMessages(); document.getElementById('chatContainer').innerHTML = ''; } };
