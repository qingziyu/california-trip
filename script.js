// 平滑滚动导航
document.addEventListener('DOMContentLoaded', function() {
    // 导航链接点击事件
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
            }
        });
    }, observerOptions);

    // 观察时间线项目
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // 添加活跃导航样式
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active {
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255,107,107,0.3);
        }
    `;
    document.head.appendChild(style);

    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // 鼠标悬停效果增强
    const activities = document.querySelectorAll('.activity');
    activities.forEach(activity => {
        activity.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        activity.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 添加心形飘落动画
    function createHeart() {
        const hearts = ['💕', '❤️', '💖', '💗', '💝'];
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '-50px';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.opacity = '0.7';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'fall 8s linear forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    // 添加飘落动画CSS
    const heartStyle = document.createElement('style');
    heartStyle.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-50px) rotate(0deg);
                opacity: 0.7;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(heartStyle);

    // 每隔一段时间创建心形
    setInterval(createHeart, 4000);

    // 加载保存的数据
    loadSavedData();
});

// 全局变量
let currentEditingElement = null;

// 编辑行程功能
function editActivity(button) {
    const activity = button.closest('.activity');
    const contentElement = activity.querySelector('.activity-content');
    currentEditingElement = contentElement;
    
    const modal = document.getElementById('editModal');
    const editContent = document.getElementById('editContent');
    
    editContent.value = contentElement.textContent;
    modal.style.display = 'block';
}

// 保存编辑
function saveEdit() {
    if (currentEditingElement) {
        const newContent = document.getElementById('editContent').value;
        currentEditingElement.textContent = newContent;
        
        // 保存到本地存储
        saveToLocalStorage();
        
        closeModal();
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingElement = null;
}

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
        
        // 保存到本地存储
        saveToLocalStorage();
    }
}

// 保存数据到本地存储
function saveToLocalStorage() {
    const data = {
        activities: {},
        comments: {}
    };
    
    // 保存活动内容
    document.querySelectorAll('.timeline-item').forEach(item => {
        const day = item.dataset.day;
        const content = item.querySelector('.activity-content').textContent;
        data.activities[day] = content;
    });
    
    // 保存评论
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
        
        // 加载活动内容
        if (data.activities) {
            Object.keys(data.activities).forEach(day => {
                const item = document.querySelector(`[data-day="${day}"]`);
                if (item) {
                    const contentElement = item.querySelector('.activity-content');
                    if (contentElement) {
                        contentElement.textContent = data.activities[day];
                    }
                }
            });
        }
        
        // 加载评论
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

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}

// 回车键添加评论
document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
        const button = e.target.nextElementSibling;
        addComment(button);
    }
});