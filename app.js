// 文件结构配置 - 只需配置路径
const fileStructure = {
    backend: [
        'backend/distributed-system.md',
        'backend/message-queue.md',
        'backend/micro-service.md',
        'backend/redis.md',
        'backend/SQL.md',
        'backend/system-desgin.md',
        'backend/web-framework.md'
    ],
    devops: [
        'devops/devops.md',
        'devops/docker.md',
        'devops/k8s-crd.md',
        'devops/kubernetes.md'
    ],
    foundations: [
        'foundations/network.md',
        'foundations/OS.md'
    ],
    programming: [
        'programming/cpp.md',
        'programming/golang.md',
        'programming/python.md'
    ],
    insights: [
        'insights/GMP.md',
        'insights/内存分配与垃圾回收.md',
        'insights/golang性能分析.md',
        'insights/API-Server源码解读.md'
    ],
    docs: [
        'docs/interviews.md',
        'docs/questions.md',
        'docs/resource.md',
        'docs/self-introduction.md'
    ]
};

// 全局状态
let currentCategory = 'all';  // 改为小写
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
        langPrefix: 'hljs language-',
        breaks: false,
        gfm: true,
        pedantic: false
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 隐藏顶部标签栏（左侧已有分类标签）
    if (topBar) {
        topBar.style.display = 'none';
    }

    // 动态生成导航菜单
    generateNavMenu();
    
    loadFiles();
    setupEventListeners();
});

// 动态生成导航菜单
function generateNavMenu() {
    const navList = document.getElementById('navList');
    navList.innerHTML = '';
    
    // 添加"全部"选项
    const allItem = document.createElement('li');
    allItem.innerHTML = `<a href="#" data-category="all" class="nav-link active">all</a>`;
    navList.appendChild(allItem);
    
    // 根据 fileStructure 动态生成分类
    Object.keys(fileStructure).forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-category="${category}" class="nav-link">${category}</a>`;
        navList.appendChild(li);
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 导航链接点击（使用事件委托）
    const navList = document.getElementById('navList');
    navList.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            setActiveCategory(category);
        }
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
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === category) {
            link.classList.add('active');
        }
    });

    // 使用格式化函数更新标题
    categoryTitle.textContent = formatCategoryName(category);

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

// 从路径生成文件对象
function pathToFile(path) {
    const fileName = path.split('/').pop().replace('.md', '');
    return {
        name: fileName,
        path: path
    };
}

// 加载文件列表
async function loadFiles() {
    fileListContainer.innerHTML = '<div class="loading">加载中...</div>';
    
    let files = [];
    
    if (currentCategory === 'all') {
        // 加载所有分类的文件
        Object.keys(fileStructure).forEach(category => {
            const paths = fileStructure[category];
            files = files.concat(paths.map(pathToFile));
        });
    } else if (fileStructure[currentCategory]) {
        // 加载特定分类的文件
        const paths = fileStructure[currentCategory];
        files = paths.map(pathToFile);
    }
    
    currentFiles = files;
    
    // 预加载所有文件内容以支持全文搜索
    await preloadFileContents(files);
    
    // 显示文件列表
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

// 分类图标和颜色配置
const categoryConfig = {
    backend: { icon: '🔧', color: '#3b82f6', label: 'Backend' },
    devops: { icon: '⚙️', color: '#8b5cf6', label: 'DevOps' },
    foundations: { icon: '📚', color: '#f59e0b', label: 'Foundations' },
    insights: { icon: '💡', color: '#10b981', label: 'Insights' },
    docs: { icon: '📝', color: '#6366f1', label: 'Docs' },
    programming: { icon: '💻', color: '#06b6d4', label: 'Programming' },
    all: { icon: '📂', color: '#6b7280', label: 'All' }
};

// 创建文件卡片
function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    
    const category = getCategoryFromPath(file.path);
    const config = categoryConfig[category] || categoryConfig.all;
    
    card.innerHTML = `
        <div class="file-card-title">
            ${config.icon} ${file.name}
        </div>
        <div class="file-card-path">${file.path}</div>
        <div>
            <span class="file-card-category" style="background-color: ${config.color}20; color: ${config.color}; border-color: ${config.color}40">
                ${config.label}
            </span>
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
    if (path.startsWith('docs/')) return 'docs';
    if (path.startsWith('programming/')) return 'programming';
    return 'other';
}

// 加载文件内容
async function loadFileContent(file) {
    viewerContent.innerHTML = '<div class="loading">加载中...</div>';
    viewerTitle.textContent = file.path;  // 显示完整路径
    
    try {
        const cacheBuster = `?t=${Date.now()}`;
        const response = await fetch(`${file.path}${cacheBuster}`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        viewerContent.innerHTML = html;
        
        // 手动触发代码高亮（以防万一）
        viewerContent.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        
        fileListContainer.style.display = 'none';
        contentViewer.style.display = 'flex';
        viewerContent.scrollTop = 0;
        
        processImages(file.path);
        await renderMermaidDiagrams();
        buildTOC();
        
    } catch (error) {
        console.error('Error loading file:', error);
        viewerContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div class="empty-state-text">加载失败: ${error.message}</div>
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
// 渲染 Mermaid 图表
async function renderMermaidDiagrams() {
    if (typeof mermaid === 'undefined') {
        console.warn('Mermaid library not loaded');
        return;
    }
    
    // 初始化 Mermaid
    mermaid.initialize({ 
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose'
    });
    
    // 查找所有包含 mermaid 代码块的 <pre><code> 标签
    const mermaidBlocks = viewerContent.querySelectorAll('pre code.language-mermaid');
    
    // 先收集所有需要渲染的 div
    const mermaidDivs = [];
    mermaidBlocks.forEach((block, index) => {
        try {
            const code = block.textContent;
            const pre = block.parentElement;
            
            // 创建一个 div 来容纳 Mermaid 图表
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.textContent = code;
            mermaidDiv.id = `mermaid-${Date.now()}-${index}`;
            
            // 替换原有的 <pre> 标签
            pre.parentNode.replaceChild(mermaidDiv, pre);
            mermaidDivs.push(mermaidDiv);
        } catch (error) {
            console.error('Error preparing Mermaid diagram:', error);
        }
    });
    
    // 统一渲染所有图表
    if (mermaidDivs.length > 0) {
        try {
            await mermaid.run({
                nodes: mermaidDivs
            });
        } catch (error) {
            console.error('Error rendering Mermaid diagrams:', error);
        }
    }
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

// 删除或注释掉 categoryTitles 常量
// const categoryTitles = { ... };

// 添加格式化函数
function formatCategoryName(category) {
    if (category === 'all') return '全部知识点';
    // 首字母大写
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function formatFileName(path) {
    // 从路径中提取文件名（不含扩展名）
    const fileName = path.split('/').pop().replace('.md', '');
    return fileName;
}

