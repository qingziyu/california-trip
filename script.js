// 强制横屏
function forceOrientation() {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
            // 如果无法锁定屏幕方向，使用CSS transform
            document.body.style.transform = 'rotate(90deg)';
            document.body.style.transformOrigin = 'center center';
        });
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    forceOrientation();
    initParticles();
    initScrollEffects();
    initSoundEffects();
    initGestureRecognition();
    initFineGrainedEditing();
    loadComments();
});

// 粒子系统
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 183, 77, ${particle.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 滚动视差效果
function initScrollEffects() {
    const sections = document.querySelectorAll('.day-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        sections.forEach((section, index) => {
            const rate = scrolled * -0.5;
            const illustration = section.querySelector('.section-illustration');
            if (illustration) {
                illustration.style.transform = `translateY(${rate * 0.3}px)`;
            }
        });
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

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            playTone(440, 0.2);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playTone(660, 0.1);
        });
    });
}

// 手势识别
function initGestureRecognition() {
    let startY = 0;
    let startTime = 0;

    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });

    document.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const deltaY = startY - endY;
        const deltaTime = endTime - startTime;

        if (Math.abs(deltaY) > 50 && deltaTime < 300) {
            if (deltaY > 0) {
                // 向上滑动
                const nextSection = document.querySelector('.day-section:not(.viewed)');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                    nextSection.classList.add('viewed');
                }
            } else {
                // 向下滑动
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

// 精细化编辑系统
function initFineGrainedEditing() {
    document.querySelectorAll('.activity-content').forEach(content => {
        content.addEventListener('click', (e) => {
            if (e.target.tagName === 'STRONG' || e.target.parentElement.tagName === 'STRONG') {
                e.stopPropagation();
                editTimeSlot(e.target.tagName === 'STRONG' ? e.target : e.target.parentElement);
            }
        });
    });
}

function editTimeSlot(element) {
    const originalText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'inline-edit';
    input.style.cssText = `
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid #ff6b35;
        border-radius: 4px;
        padding: 2px 6px;
        font-weight: bold;
        font-size: inherit;
        width: auto;
        min-width: 80px;
    `;

    element.replaceWith(input);
    input.focus();
    input.select();

    function saveEdit() {
        const newElement = document.createElement('strong');
        newElement.textContent = input.value || originalText;
        input.replaceWith(newElement);
        saveToLocalStorage();
        
        // 重新绑定事件
        newElement.addEventListener('click', (e) => {
            e.stopPropagation();
            editTimeSlot(newElement);
        });
    }

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

function editActivity(button) {
    const activity = button.closest('.activity');
    const content = activity.querySelector('.activity-content');
    const originalHTML = content.innerHTML;

    const textarea = document.createElement('textarea');
    textarea.value = content.textContent;
    textarea.className = 'edit-textarea';
    textarea.style.cssText = `
        width: 100%;
        min-height: 150px;
        padding: 15px;
        border: 2px solid #ff6b35;
        border-radius: 10px;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
        background: rgba(255, 255, 255, 0.95);
        resize: vertical;
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.className = 'save-btn';
    saveBtn.style.cssText = `
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        margin: 10px 5px 0 0;
        cursor: pointer;
        font-weight: 500;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.className = 'cancel-btn';
    cancelBtn.style.cssText = `
        background: #666;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        margin: 10px 0 0 0;
        cursor: pointer;
        font-weight: 500;
    `;

    content.innerHTML = '';
    content.appendChild(textarea);
    content.appendChild(saveBtn);
    content.appendChild(cancelBtn);

    textarea.focus();

    saveBtn.addEventListener('click', () => {
        const lines = textarea.value.split('\n');
        let newHTML = '';
        
        lines.forEach(line => {
            line = line.trim();
            if (line) {
                if (line.includes('：') || line.includes(':')) {
                    const parts = line.split(/[：:]/);
                    if (parts.length >= 2) {
                        newHTML += `<strong>${parts[0]}：</strong> ${parts.slice(1).join('：')}<br>`;
                    } else {
                        newHTML += `${line}<br>`;
                    }
                } else {
                    newHTML += `${line}<br>`;
                }
            }
        });
        
        content.innerHTML = newHTML;
        saveToLocalStorage();
        initFineGrainedEditing();
    });

    cancelBtn.addEventListener('click', () => {
        content.innerHTML = originalHTML;
        initFineGrainedEditing();
    });
}

function addComment(button) {
    const input = button.previousElementSibling;
    const commentText = input.value.trim();
    
    if (commentText) {
        const commentsList = button.closest('.comments-section').querySelector('.comments-list');
        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerHTML = `
            <span class="comment-text">${commentText}</span>
            <span class="comment-time">${new Date().toLocaleString('zh-CN')}</span>
            <button class="delete-comment" onclick="deleteComment(this)">×</button>
        `;
        
        commentsList.appendChild(comment);
        input.value = '';
        saveToLocalStorage();
    }
}

function deleteComment(button) {
    button.parentElement.remove();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    const data = {
        content: document.querySelector('main').innerHTML,
        timestamp: Date.now()
    };
    localStorage.setItem('californiaTrip', JSON.stringify(data));
}

function loadComments() {
    const saved = localStorage.getItem('californiaTrip');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.content) {
                document.querySelector('main').innerHTML = data.content;
                initFineGrainedEditing();
            }
        } catch (e) {
            console.log('无法加载保存的数据');
        }
    }
}