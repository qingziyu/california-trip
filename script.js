// 创建粒子背景
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 页面加载动画
function showLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-text">✨ 加州之旅即将开始 ✨</div>';
    document.body.appendChild(loadingOverlay);

    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }, 2000);
}

// 视差滚动效果
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section-illustration');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// 动态文字效果
function initTextAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target;
                text.style.animation = 'none';
                text.offsetHeight; // 触发重排
                text.style.animation = 'slideInUp 0.8s ease-out forwards';
            }
        });
    });

    document.querySelectorAll('.day-header h2, .activity h3').forEach(el => {
        observer.observe(el);
    });
}

// 彩虹光标轨迹
function initRainbowCursor() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #ff6b6b, #ffa726, #ffcc02);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// 音效系统
function initSoundEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playTone(frequency, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    document.addEventListener('click', (e) => {
        if (e.target.matches('button, .nav-links a')) {
            playTone(800, 0.1);
        }
    });
}

// 智能提示系统
function initSmartTooltips() {
    const tooltips = {
        '.edit-btn': '点击编辑行程安排',
        '.comment-input': '分享你的旅行想法',
        '.nav-links a': '快速跳转到对应行程',
        '.icon-item': '加州元素，点击有惊喜！'
    };

    Object.entries(tooltips).forEach(([selector, text]) => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.textContent = text;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 1000;
                    pointer-events: none;
                    white-space: nowrap;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
                
                e.target._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    delete e.target._tooltip;
                }
            });
        });
    });
}

// 手势识别
function initGestureRecognition() {
    let startX, startY, startTime;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });
    
    document.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        const diffTime = endTime - startTime;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && diffTime < 300) {
            const sections = document.querySelectorAll('.day-section');
            const currentSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
            });
            
            if (currentSection) {
                const currentIndex = Array.from(sections).indexOf(currentSection);
                const nextIndex = diffX > 0 ? currentIndex + 1 : currentIndex - 1;
                
                if (sections[nextIndex]) {
                    sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
}

// 转换活动内容为可编辑格式
function convertToEditableFormat() {
    document.querySelectorAll('.activity-content').forEach(content => {
        const html = content.innerHTML;
        const items = html.split('<br>').filter(item => item.trim());
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'activity-items';
        
        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'activity-item';
            itemDiv.innerHTML = `
                <div class="item-content">${item}</div>
                <div class="item-controls">
                    <button onclick="editItem(this)" title="编辑">✏️</button>
                    <button onclick="deleteItem(this)" title="删除">🗑️</button>
                </div>
            `;
            itemsContainer.appendChild(itemDiv);
        });
        
        const addButton = document.createElement('button');
        addButton.className = 'add-item-btn';
        addButton.innerHTML = '➕ 添加行程';
        addButton.onclick = () => addNewItem(itemsContainer);
        
        content.innerHTML = '';
        content.appendChild(itemsContainer);
        content.appendChild(addButton);
    });
}

// 编辑单个行程项
function editItem(button) {
    const itemDiv = button.closest('.activity-item');
    const contentDiv = itemDiv.querySelector('.item-content');
    const currentText = contentDiv.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'item-edit-input';
    input.style.cssText = `
        width: 100%;
        padding: 8px;
        border: 2px solid var(--california-sunset);
        border-radius: 8px;
        font-size: 14px;
        background: rgba(255,255,255,0.9);
    `;
    
    contentDiv.innerHTML = '';
    contentDiv.appendChild(input);
    input.focus();
    
    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText) {
            contentDiv.innerHTML = newText;
            saveToLocalStorage();
            showNotification('✅ 已保存！', 'success');
        } else {
            contentDiv.innerHTML = currentText;
        }
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

// 删除行程项
function deleteItem(button) {
    const itemDiv = button.closest('.activity-item');
    itemDiv.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
        itemDiv.remove();
        saveToLocalStorage();
        showNotification('🗑️ 已删除！', 'info');
    }, 300);
}

// 添加新行程项
function addNewItem(container) {
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.innerHTML = `
        <div class="item-content">
            <input type="text" placeholder="输入新的行程安排..." class="item-edit-input" style="
                width: 100%;
                padding: 8px;
                border: 2px solid var(--california-sunset);
                border-radius: 8px;
                font-size: 14px;
                background: rgba(255,255,255,0.9);
            ">
        </div>
        <div class="item-controls">
            <button onclick="editItem(this)" title="编辑">✏️</button>
            <button onclick="deleteItem(this)" title="删除">🗑️</button>
        </div>
    `;
    
    container.appendChild(newItem);
    const input = newItem.querySelector('input');
    input.focus();
    
    const saveNew = () => {
        const text = input.value.trim();
        if (text) {
            newItem.querySelector('.item-content').innerHTML = text;
            saveToLocalStorage();
            showNotification('➕ 已添加！', 'success');
        } else {
            newItem.remove();
        }
    };
    
    input.addEventListener('blur', saveNew);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveNew();
        }
    });
}

// 主初始化函数
document.addEventListener('DOMContentLoaded', function() {
    showLoadingAnimation();
    createParticles();
    
    setTimeout(() => {
        initParallax();
        initTextAnimations();
        initRainbowCursor();
        initSmartTooltips();
        initGestureRecognition();
        
        // 转换为可编辑格式
        convertToEditableFormat();
        
        document.addEventListener('click', initSoundEffects, { once: true });
    }, 2500);

    // 平滑滚动导航
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 滚动时高亮当前导航项
    const sections = document.querySelectorAll('.day-section');
    const navItems = document.querySelectorAll('.nav-links a');

    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // 滚动动画观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('sparkle');
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        observer.observe(item);
    });

    // 添加活跃导航样式
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active {
            background: var(--california-sunset) !important;
            color: white !important;
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 35px rgba(255,107,107,0.4);
        }
        
        .activity-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .activity-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .activity-item:hover {
            background: rgba(255,255,255,0.2);
            transform: translateX(5px);
        }
        
        .item-content {
            flex: 1;
        }
        
        .item-controls {
            display: flex;
            gap: 5px;
        }
        
        .item-controls button {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .item-controls button:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.2);
        }
        
        .add-item-btn {
            margin-top: 10px;
            padding: 8px 16px;
            background: linear-gradient(135deg, var(--california-sunset), var(--ocean-blue));
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .add-item-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255,107,107,0.3);
        }
        
        @keyframes slideOut {
            to {
                opacity: 0;
                transform: translateX(-100%);
            }
        }
    `;
    document.head.appendChild(style);

    // 图标点击特效
    document.querySelectorAll('.icon-item').forEach(icon => {
        icon.addEventListener('click', function() {
            for (let i = 0; i < 12; i++) {
                const spark = document.createElement('div');
                spark.textContent = '✨';
                spark.style.cssText = `
                    position: fixed;
                    pointer-events: none;
                    z-index: 1000;
                    font-size: 20px;
                    left: ${this.getBoundingClientRect().left + this.offsetWidth/2}px;
                    top: ${this.getBoundingClientRect().top + this.offsetHeight/2}px;
                `;
                
                document.body.appendChild(spark);
                
                const angle = (i / 12) * Math.PI * 2;
                const distance = 100;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                spark.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).onfinish = () => spark.remove();
            }
            
            if (navigator.vibrate) {
                navigator.vibrate([50, 30, 50]);
            }
        });
    });

    loadSavedData();
});

// 添加评论功能
function addComment(button) {
    const commentInput = button.previousElementSibling;
    const commentText = commentInput.value.trim();
    
    if (commentText) {
        const commentsList = button.closest('.comments-section').querySelector('.comments-list');
        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.textContent = commentText;
        
        commentsList.appendChild(comment);
        commentInput.value = '';
        
        saveToLocalStorage();
        showNotification('💬 评论已添加！', 'info');
    }
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 25px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #4caf50, #45a049);' : ''}
        ${type === 'info' ? 'background: linear-gradient(135deg, #2196f3, #1976d2);' : ''}
        ${type === 'error' ? 'background: linear-gradient(135deg, #f44336, #d32f2f);' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 保存数据到本地存储
function saveToLocalStorage() {
    const data = {
        activities: {},
        comments: {}
    };
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        const day = item.dataset.day;
        const items = [];
        item.querySelectorAll('.activity-item .item-content').forEach(content => {
            items.push(content.textContent || content.innerHTML);
        });
        data.activities[day] = items;
    });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        const day = item.dataset.day;
        const comments = [];
        item.querySelectorAll('.comment').forEach(comment => {
            comments.push(comment.textContent);
        });
        data.comments[day] = comments;
    });
    
    localStorage.setItem('tripData', JSON.stringify(data));
}

// 从本地存储加载数据
function loadSavedData() {
    const savedData = localStorage.getItem('tripData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.activities) {
            Object.keys(data.activities).forEach(day => {
                const item = document.querySelector(`[data-day="${day}"]`);
                if (item) {
                    const itemsContainer = item.querySelector('.activity-items');
                    if (itemsContainer && data.activities[day]) {
                        itemsContainer.innerHTML = '';
                        data.activities[day].forEach(activityText => {
                            const itemDiv = document.createElement('div');
                            itemDiv.className = 'activity-item';
                            itemDiv.innerHTML = `
                                <div class="item-content">${activityText}</div>
                                <div class="item-controls">
                                    <button onclick="editItem(this)" title="编辑">✏️</button>
                                    <button onclick="deleteItem(this)" title="删除">🗑️</button>
                                </div>
                            `;
                            itemsContainer.appendChild(itemDiv);
                        });
                    }
                }
            });
        }
        
        if (data.comments) {
            Object.keys(data.comments).forEach(day => {
                const item = document.querySelector(`[data-day="${day}"]`);
                if (item) {
                    const commentsList = item.querySelector('.comments-list');
                    if (commentsList) {
                        data.comments[day].forEach(commentText => {
                            const comment = document.createElement('div');
                            comment.className = 'comment';
                            comment.textContent = commentText;
                            commentsList.appendChild(comment);
                        });
                    }
                }
            });
        }
    }
}

// 回车键添加评论
document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
        const button = e.target.nextElementSibling;
        addComment(button);
    }
});

// PWA支持
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}