// 文件结构配置
const fileStructure = {
    backend: [
        { name: '分布式系统', path: 'backend/distributed-system.md' },
        { name: '消息队列', path: 'backend/message-queue.md' },
        { name: '微服务', path: 'backend/micro-service.md' },
        { name: 'Redis', path: 'backend/redis.md' },
        { name: 'SQL', path: 'backend/SQL.md' },
        { name: '系统设计', path: 'backend/system-desgin.md' },
        { name: 'Web框架', path: 'backend/web-framework.md' }
    ],
    devops: [
        { name: 'DevOps实践', path: 'devops/devops.md' },
        { name: 'Docker', path: 'devops/docker.md' },
        { name: 'Kubernetes & CRD', path: 'devops/k8s&CRD.md' },
        { name: 'Kubernetes', path: 'devops/kubernetes.md' }
    ],
    foundations: [
        { name: '网络', path: 'foundations/network.md' },
        { name: '操作系统', path: 'foundations/OS.md' }
    ],
    insights: [
        { name: 'GMP', path: 'insights/GMP.md' },
        { name: '内存分配与垃圾回收', path: 'insights/内存分配与垃圾回收.md' }
    ],
    interviews: [
        { name: 'Shein', path: 'interviews/Shein.md' },
        { name: '咪咕', path: 'interviews/咪咕.md' },
        { name: '字节跳动', path: 'interviews/字节跳动.md' },
        { name: '平头哥', path: 'interviews/平头哥.md' },
        { name: '摩尔线程', path: 'interviews/摩尔线程.md' },
        { name: '文远知行', path: 'interviews/文远知行.md' },
        { name: '百度', path: 'interviews/百度.md' },
        { name: '识货', path: 'interviews/识货.md' },
        { name: '鹰角', path: 'interviews/鹰角.md' }
    ],
    programming: [
        { name: 'C++', path: 'programming/cpp.md' },
        { name: 'Golang', path: 'programming/golang.md' },
        { name: 'Python', path: 'programming/python.md' }
    ],
    docs: [
        { name: 'Mermaid', path: 'docs/mermaid.md' },
        { name: '问题', path: 'docs/questions.md' },
        { name: '资源', path: 'docs/resource.md' },
        { name: '自我介绍', path: 'docs/self-introduction.md' }
    ]
};

// 分类标题映射
const categoryTitles = {
    all: '全部知识点',
    backend: '后端 (Backend)',
    devops: '运维 (DevOps)',
    foundations: '基础 (Foundations)',
    insights: '深入理解 (Insights)',
    interviews: '面试经验 (Interviews)',
    programming: '编程语言 (Programming)',
    docs: '文档 (Docs)'
};

// 全局状态
let currentCategory = 'all';
let currentFiles = [];
let searchQuery = '';
const contentCache = {};

// DOM 元素
const searchInput = document.getElementById('searchInput');
const fileListContainer = document.getElementById('fileListContainer');
const contentViewer = document.getElementById('contentViewer');
const viewerContent = document.getElementById('viewerContent');
const viewerTitle = document.getElementById('viewerTitle');
const backButton = document.getElementById('backButton');
const categoryTitle = document.getElementById('categoryTitle');
const fileCount = document.getElementById('fileCount');
const topBar = document.querySelector('.top-bar');
const tocList = document.getElementById('tocList');
const tocPanel = document.getElementById('tocPanel');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.querySelector('.sidebar');

// 配置 marked.js 使用 highlight.js 进行语法高亮
if (typeof marked !== 'undefined' && typeof hljs !== 'undefined') {
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }
            return hljs.highlightAuto(code).value;
        },
        langPrefix: 'hljs language-'
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 隐藏顶部标签栏（左侧已有分类标签）
    if (topBar) {
        topBar.style.display = 'none';
    }

    loadFiles();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            setActiveCategory(category);
        });
    });

    // 搜索输入
    searchInput.addEventListener('input', async (e) => {
        searchQuery = e.target.value.toLowerCase();
        await filterAndDisplayFiles();
    });

    // 返回按钮
    backButton.addEventListener('click', () => {
        showFileList();
    });

    // 移动端菜单切换
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // 点击外部关闭移动端菜单
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// 设置活动分类
function setActiveCategory(category) {
    currentCategory = category;
    
    // 更新导航状态
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === category) {
            link.classList.add('active');
        }
    });

    // 更新标题
    categoryTitle.textContent = categoryTitles[category] || '全部知识点';

    // 切换分类时返回列表视图，避免停留在旧文档
    showFileList();
    viewerContent.innerHTML = '';

    // 加载文件
    loadFiles();
    
    // 关闭移动端菜单
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

// 加载文件列表
async function loadFiles() {
    fileListContainer.innerHTML = '<div class="loading">加载中...</div>';
    
    let files = [];
    
    if (currentCategory === 'all') {
        // 加载所有文件
        Object.values(fileStructure).forEach(categoryFiles => {
            files = files.concat(categoryFiles);
        });
    } else {
        files = fileStructure[currentCategory] || [];
    }
    
    currentFiles = files;
    await filterAndDisplayFiles();
}

// 过滤并显示文件
async function filterAndDisplayFiles() {
    let filteredFiles = currentFiles;
    
    // 应用搜索过滤
    if (searchQuery) {
        // 预先加载当前分类下文件的内容，支持全文搜索
        await preloadFileContents(filteredFiles);
        filteredFiles = currentFiles.filter(file => {
            const nameMatch = file.name.toLowerCase().includes(searchQuery) ||
                file.path.toLowerCase().includes(searchQuery);
            const content = (contentCache[file.path] || '').toLowerCase();
            const contentMatch = content.includes(searchQuery);
            return nameMatch || contentMatch;
        });
    }
    
    // 更新文件计数
    fileCount.textContent = `${filteredFiles.length} 个文件`;
    
    // 构建列表容器
    fileListContainer.innerHTML = '';

    // 搜索提示（无论有无结果都显示）
    if (searchQuery) {
        const hint = document.createElement('div');
        hint.className = 'search-hint';
        hint.textContent = `搜索 “${searchQuery}” 的结果`;
        hint.style.margin = '0 0 12px 4px';
        hint.style.color = 'var(--text-secondary, #6b7280)';
        hint.style.fontSize = '14px';
        fileListContainer.appendChild(hint);
    }

    // 显示文件列表或空状态
    if (filteredFiles.length === 0) {
        fileListContainer.innerHTML += `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">未找到匹配的文件</div>
            </div>
        `;
        return;
    }
    
    const fileGrid = document.createElement('div');
    fileGrid.className = 'file-grid';
    
    filteredFiles.forEach(file => {
        const card = createFileCard(file);
        fileGrid.appendChild(card);
    });
    
    fileListContainer.appendChild(fileGrid);
}

// 创建文件卡片
function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    
    const category = getCategoryFromPath(file.path);
    const categoryLabel = categoryTitles[category] || category;
    
    card.innerHTML = `
        <div class="file-card-title">
            📄 ${file.name}
        </div>
        <div class="file-card-path">${file.path}</div>
        <div>
            <span class="file-card-category">${categoryLabel}</span>
        </div>
    `;
    
    card.addEventListener('click', () => {
        loadFileContent(file);
    });
    
    return card;
}

// 从路径获取分类
function getCategoryFromPath(path) {
    if (path.startsWith('backend/')) return 'backend';
    if (path.startsWith('devops/')) return 'devops';
    if (path.startsWith('foundations/')) return 'foundations';
    if (path.startsWith('insights/')) return 'insights';
    if (path.startsWith('interviews/')) return 'interviews';
    if (path.startsWith('programming/')) return 'programming';
    if (path.startsWith('docs/')) return 'docs';
    return 'other';
}

// 加载文件内容
async function loadFileContent(file) {
    viewerContent.innerHTML = '<div class="loading">加载中...</div>';
    viewerTitle.textContent = file.name;
    
    try {
        // 加一个时间戳避免浏览器缓存旧的 markdown 内容
        const cacheBuster = `?t=${Date.now()}`;
        const response = await fetch(`${file.path}${cacheBuster}`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        viewerContent.innerHTML = html;
        
        // 显示查看器，隐藏列表
        fileListContainer.style.display = 'none';
        contentViewer.style.display = 'flex';
        
        // 滚动到顶部
        viewerContent.scrollTop = 0;
        
        // 处理图片路径
        processImages(file.path);

    // 构建目录
    buildTOC();
        
    } catch (error) {
        console.error('Error loading file:', error);
        viewerContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div class="empty-state-text">加载失败: ${error.message}</div>
                <p style="margin-top: 16px; color: var(--text-secondary);">
                    请确保文件路径正确，并且通过 HTTP 服务器访问此页面。
                </p>
            </div>
        `;
    }
}

// 预加载文件内容，便于全文搜索
async function preloadFileContents(files) {
    const tasks = files.map(async (file) => {
        if (contentCache[file.path]) return;
        try {
            const cacheBuster = `?t=${Date.now()}`;
            const resp = await fetch(`${file.path}${cacheBuster}`, { cache: 'no-store' });
            if (!resp.ok) return;
            const text = await resp.text();
            contentCache[file.path] = text;
        } catch (err) {
            console.error('Error preloading file:', file.path, err);
        }
    });
    await Promise.all(tasks);
}
// 处理图片路径
function processImages(filePath) {
    const images = viewerContent.querySelectorAll('img');
    const basePath = filePath.substring(0, filePath.lastIndexOf('/'));
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
            // 相对路径转换为绝对路径
            const newSrc = src.startsWith('../') 
                ? src.replace('../', '') 
                : `${basePath}/${src}`;
            img.setAttribute('src', newSrc);
        }
    });
}

// 构建目录（类似 GitHub 右侧目录）
function buildTOC() {
    if (!tocList || !viewerContent) return;

    const headings = viewerContent.querySelectorAll('h1, h2, h3');
    tocList.innerHTML = '';

    if (!headings.length) {
        tocList.innerHTML = '<div class="toc-empty">暂无标题</div>';
        return;
    }

    headings.forEach((heading, index) => {
        // 为标题生成锚点
        if (!heading.id) {
            heading.id = slugifyHeading(heading.textContent) + '-' + index;
        }

        const level = heading.tagName === 'H1' ? 1 : heading.tagName === 'H2' ? 2 : 3;
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = `toc-item level-${level}`;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveTOC(link);
        });

        tocList.appendChild(link);
    });

    // 监听滚动，高亮当前标题
    observeHeadings(headings);
}

function slugifyHeading(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[\s\/]+/g, '-')
        .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
        .replace(/-+/g, '-');
}

function setActiveTOC(activeLink) {
    if (!tocList) return;
    tocList.querySelectorAll('.toc-item').forEach(item => item.classList.remove('active'));
    activeLink.classList.add('active');
}

let headingObserver = null;
function observeHeadings(headings) {
    if (headingObserver) {
        headingObserver.disconnect();
    }

    headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const activeLink = tocList.querySelector(`a[href="#${id}"]`);
                if (activeLink) setActiveTOC(activeLink);
            }
        });
    }, { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] });

    headings.forEach(h => headingObserver.observe(h));
}

// 显示文件列表
function showFileList() {
    contentViewer.style.display = 'none';
    fileListContainer.style.display = 'block';
}

