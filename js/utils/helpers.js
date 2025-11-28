/**
 * 工具函数库
 * 提供通用的工具函数和辅助方法
 */

// 全局工具对象
const Helpers = {
    
    /**
     * DOM 操作助手
     */
    DOM: {
        // 创建元素
        create(tag, classes = '', content = '', attributes = {}) {
            const element = document.createElement(tag);
            if (classes) element.className = classes;
            if (content) element.innerHTML = content;
            
            // 设置属性
            Object.keys(attributes).forEach(key => {
                element.setAttribute(key, attributes[key]);
            });
            
            return element;
        },
        
        // 获取元素
        get(selector, parent = document) {
            return parent.querySelector(selector);
        },
        
        // 获取元素列表
        getAll(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        },
        
        // 显示元素
        show(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) element.style.display = '';
            return element;
        },
        
        // 隐藏元素
        hide(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) element.style.display = 'none';
            return element;
        },
        
        // 切换元素显示/隐藏
        toggle(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) {
                element.style.display = element.style.display === 'none' ? '' : 'none';
            }
            return element;
        },
        
        // 添加类
        addClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) element.classList.add(className);
            return element;
        },
        
        // 移除类
        removeClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) element.classList.remove(className);
            return element;
        },
        
        // 切换类
        toggleClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) element.classList.toggle(className);
            return element;
        },
        
        // 检查是否有类
        hasClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            return element ? element.classList.contains(className) : false;
        },
        
        // 设置样式
        setStyle(element, styles) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) {
                Object.assign(element.style, styles);
            }
            return element;
        },
        
        // 清空元素内容
        empty(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) element.innerHTML = '';
            return element;
        },
        
        // 在元素后插入
        insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        
        // 移除所有子元素
        removeChildren(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            }
            return element;
        }
    },
    
    /**
     * 字符串处理
     */
    String: {
        // 首字母大写
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        // 转换为驼峰命名
        camelCase(str) {
            return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
        },
        
        // 转换为连字符命名
        kebabCase(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },
        
        // 截断字符串
        truncate(str, length, suffix = '...') {
            return str.length > length ? str.substring(0, length) + suffix : str;
        },
        
        // 移除 HTML 标签
        stripTags(str) {
            return str.replace(/<[^>]*>/g, '');
        },
        
        // 转义 HTML
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        // 生成随机字符串
        random(length = 8) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    },
    
    /**
     * 数组处理
     */
    Array: {
        // 数组去重
        unique(arr) {
            return [...new Set(arr)];
        },
        
        // 数组洗牌
        shuffle(arr) {
            const newArr = [...arr];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        },
        
        // 数组分组
        chunk(arr, size) {
            const chunks = [];
            for (let i = 0; i < arr.length; i += size) {
                chunks.push(arr.slice(i, i + size));
            }
            return chunks;
        },
        
        // 扁平化数组
        flatten(arr) {
            return arr.reduce((flat, next) => 
                flat.concat(Array.isArray(next) ? this.flatten(next) : next), []);
        },
        
        // 按条件分组
        groupBy(arr, key) {
            return arr.reduce((groups, item) => {
                const group = typeof key === 'function' ? key(item) : item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },
        
        // 按条件排序
        sortBy(arr, key, order = 'asc') {
            return [...arr].sort((a, b) => {
                const aVal = typeof key === 'function' ? key(a) : a[key];
                const bVal = typeof key === 'function' ? key(b) : b[key];
                
                if (aVal < bVal) return order === 'asc' ? -1 : 1;
                if (aVal > bVal) return order === 'asc' ? 1 : -1;
                return 0;
            });
        }
    },
    
    /**
     * 对象处理
     */
    Object: {
        // 深拷贝
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj);
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        },
        
        // 合并对象
        merge(target, ...sources) {
            sources.forEach(source => {
                for (const key in source) {
                    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        target[key] = this.merge(target[key] || {}, source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            });
            return target;
        },
        
        // 获取嵌套属性值
        get(obj, path, defaultValue = null) {
            const keys = path.split('.');
            let result = obj;
            
            for (const key of keys) {
                if (result === null || result === undefined) return defaultValue;
                result = result[key];
            }
            
            return result === undefined ? defaultValue : result;
        },
        
        // 设置嵌套属性值
        set(obj, path, value) {
            const keys = path.split('.');
            let current = obj;
            
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[keys[keys.length - 1]] = value;
            return obj;
        },
        
        // 对象过滤
        pick(obj, keys) {
            const result = {};
            keys.forEach(key => {
                if (key in obj) {
                    result[key] = obj[key];
                }
            });
            return result;
        },
        
        // 对象排除
        omit(obj, keys) {
            const result = { ...obj };
            keys.forEach(key => {
                delete result[key];
            });
            return result;
        }
    },
    
    /**
     * 函数工具
     */
    Function: {
        // 防抖
        debounce(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        },
        
        // 节流
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // 只执行一次
        once(func) {
            let called = false;
            let result;
            return function(...args) {
                if (!called) {
                    called = true;
                    result = func.apply(this, args);
                }
                return result;
            };
        },
        
        // 函数柯里化
        curry(func) {
            return function curried(...args) {
                if (args.length >= func.length) {
                    return func.apply(this, args);
                } else {
                    return function(...args2) {
                        return curried.apply(this, args.concat(args2));
                    };
                }
            };
        },
        
        // 函数组合
        compose(...funcs) {
            return function(...args) {
                return funcs.reduceRight((result, func) => [func.apply(this, result)], args)[0];
            };
        }
    },
    
    /**
     * 存储工具
     */
    Storage: {
        // 设置本地存储
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('LocalStorage set error:', e);
                return false;
            }
        },
        
        // 获取本地存储
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('LocalStorage get error:', e);
                return defaultValue;
            }
        },
        
        // 移除本地存储
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('LocalStorage remove error:', e);
                return false;
            }
        },
        
        // 清空本地存储
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('LocalStorage clear error:', e);
                return false;
            }
        },
        
        // 检查是否存在
        has(key) {
            return localStorage.getItem(key) !== null;
        }
    },
    
    /**
     * 日期时间工具
     */
    Date: {
        // 格式化日期
        format(date, format = 'YYYY-MM-DD') {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },
        
        // 相对时间
        relativeTime(date) {
            const now = new Date();
            const diffMs = now - new Date(date);
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffSecs < 60) return '刚刚';
            if (diffMins < 60) return `${diffMins}分钟前`;
            if (diffHours < 24) return `${diffHours}小时前`;
            if (diffDays < 7) return `${diffDays}天前`;
            
            return this.format(date, 'YYYY-MM-DD');
        },
        
        // 添加天数
        addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        
        // 获取日期范围
        getDateRange(start, end) {
            const dates = [];
            const current = new Date(start);
            const last = new Date(end);
            
            while (current <= last) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            
            return dates;
        },
        
        // 是否是今天
        isToday(date) {
            const today = new Date();
            const check = new Date(date);
            return today.toDateString() === check.toDateString();
        },
        
        // 是否是本周
        isThisWeek(date) {
            const today = new Date();
            const check = new Date(date);
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            return check >= weekStart && check <= weekEnd;
        }
    },
    
    /**
     * 数字工具
     */
    Number: {
        // 格式化数字（千分位）
        format(num, decimals = 0) {
            return num.toLocaleString('zh-CN', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },
        
        // 随机数范围
        random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        // 限制数字范围
        clamp(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },
        
        // 百分比计算
        percentage(value, total, decimals = 1) {
            if (total === 0) return 0;
            return Number(((value / total) * 100).toFixed(decimals));
        },
        
        // 字节大小格式化
        formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
        }
    },
    
    /**
     * 验证工具
     */
    Validation: {
        // 邮箱验证
        isEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        
        // 手机号验证
        isPhone(phone) {
            const regex = /^1[3-9]\d{9}$/;
            return regex.test(phone);
        },
        
        // URL 验证
        isURL(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        
        // 身份证验证（简单版本）
        isIDCard(id) {
            const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return regex.test(id);
        },
        
        // 空值检查
        isEmpty(value) {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string') return value.trim() === '';
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === 'object') return Object.keys(value).length === 0;
            return false;
        },
        
        // 数字范围检查
        isInRange(value, min, max) {
            const num = Number(value);
            return !isNaN(num) && num >= min && num <= max;
        }
    },
    
    /**
     * 网络工具
     */
    Network: {
        // 获取 URL 参数
        getUrlParams(url = window.location.search) {
            const params = {};
            new URLSearchParams(url).forEach((value, key) => {
                params[key] = value;
            });
            return params;
        },
        
        // 构建 URL 参数
        buildUrlParams(params) {
            const searchParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    searchParams.append(key, params[key]);
                }
            });
            return searchParams.toString();
        },
        
        // 下载文件
        downloadFile(url, filename) {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        
        // 复制到剪贴板
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            }
        },
        
        // 图片预加载
        preloadImages(urls) {
            return Promise.all(
                urls.map(url => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = url;
                    });
                })
            );
        }
    },
    
    /**
     * 动画工具
     */
    Animation: {
        // 淡入
        fadeIn(element, duration = 300) {
            return new Promise(resolve => {
                element.style.opacity = '0';
                element.style.display = '';
                
                let start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const opacity = Math.min(progress / duration, 1);
                    
                    element.style.opacity = opacity.toString();
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        resolve();
                    }
                }
                
                window.requestAnimationFrame(step);
            });
        },
        
        // 淡出
        fadeOut(element, duration = 300) {
            return new Promise(resolve => {
                let start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const opacity = Math.max(1 - progress / duration, 0);
                    
                    element.style.opacity = opacity.toString();
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        element.style.display = 'none';
                        resolve();
                    }
                }
                
                window.requestAnimationFrame(step);
            });
        },
        
        // 滑动展开
        slideDown(element, duration = 300) {
            return new Promise(resolve => {
                element.style.display = '';
                const height = element.scrollHeight;
                element.style.height = '0px';
                element.style.overflow = 'hidden';
                
                let start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const currentHeight = (progress / duration) * height;
                    
                    element.style.height = Math.min(currentHeight, height) + 'px';
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        element.style.height = '';
                        element.style.overflow = '';
                        resolve();
                    }
                }
                
                window.requestAnimationFrame(step);
            });
        },
        
        // 滑动收起
        slideUp(element, duration = 300) {
            return new Promise(resolve => {
                const height = element.scrollHeight;
                element.style.height = height + 'px';
                element.style.overflow = 'hidden';
                
                let start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const currentHeight = height - (progress / duration) * height;
                    
                    element.style.height = Math.max(currentHeight, 0) + 'px';
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        element.style.display = 'none';
                        element.style.height = '';
                        element.style.overflow = '';
                        resolve();
                    }
                }
                
                window.requestAnimationFrame(step);
            });
        }
    },
    
    /**
     * 工具卡片渲染
     */
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
                    <a href="${tool.affiliateLink || tool.url}" class="btn btn-primary" target="_blank" rel="noopener">
                        访问官网
                    </a>
                    <button class="btn btn-outline view-details" data-tool-id="${tool.id}">
                        查看详情
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * 显示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        // 创建通知容器（如果不存在）
        let container = document.getElementById('notification-container');
        if (!container) {
            container = this.DOM.create('div', 'notification-container', '', {
                id: 'notification-container',
                style: 'position: fixed; top: 20px; right: 20px; z-index: 1060;'
            });
            document.body.appendChild(container);
        }
        
        // 创建通知
        const notification = this.DOM.create('div', `notification ${type}`, `
            <div class="notification-content">
                <div class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close">×</button>
            </div>
        `);
        
        // 添加到容器
        container.appendChild(notification);
        
        // 显示动画
        setTimeout(() => notification.classList.add('show'), 10);
        
        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        const closeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeNotification);
        
        // 自动关闭
        if (duration > 0) {
            setTimeout(closeNotification, duration);
        }
        
        return closeNotification;
    },
    
    /**
     * 显示加载状态
     */
    showLoading(container, message = '加载中...') {
        const loadingHtml = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        if (typeof container === 'string') {
            container = this.DOM.get(container);
        }
        
        if (container) {
            container.innerHTML = loadingHtml;
        }
        
        return container;
    },
    
    /**
     * 隐藏加载状态
     */
    hideLoading(container) {
        if (typeof container === 'string') {
            container = this.DOM.get(container);
        }
        
        if (container) {
            const loading = container.querySelector('.loading-container');
            if (loading) {
                loading.remove();
            }
        }
        
        return container;
    }
};

// 导出到全局
window.Helpers = Helpers;

// 自动初始化一些工具函数
document.addEventListener('DOMContentLoaded', function() {
    // 创建通知容器
    if (!document.getElementById('notification-container')) {
        const container = Helpers.DOM.create('div', 'notification-container', '', {
            id: 'notification-container',
            style: 'position: fixed; top: 20px; right: 20px; z-index: 1060;'
        });
        document.body.appendChild(container);
    }
});

console.log('Helpers 工具库已加载');
