// 将 tagColors 定义为全局变量
let tagColors = {};

// 将 isAdmin 定义为全局变量并初始化为 false
let isAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
    // 获取加载元素
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // 显示加载提示

    // 初始化侧边栏状态
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sections = document.querySelectorAll('.section');
    if (sidebar.classList.contains('hidden')) {
        mainContent.style.marginLeft = '0';
        sections.forEach(section => {
            section.style.marginLeft = '0';
        });
    } else {
        mainContent.style.marginLeft = '';
        sections.forEach(section => {
            section.style.marginLeft = '';
        });
    }

    // 监听窗口大小变化事件
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) { // 当屏幕宽度小于等于768px时
            sidebar.classList.add('hidden'); // 默认隐藏侧边栏
            mainContent.style.marginLeft = '0';
            sections.forEach(section => {
                section.style.marginLeft = '0';
            });
        } else {
            sidebar.classList.remove('hidden'); // 显示侧边栏
            mainContent.style.marginLeft = '';
            sections.forEach(section => {
                section.style.marginLeft = '';
            });
        }
    });

    // 触发一次resize事件以设置初始状态
    window.dispatchEvent(new Event('resize'));

    // 读取 cookies 中的 username
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    let username = null;
    for (const cookie of cookies) {
        if (cookie.startsWith('username=')) {
            username = cookie.substring('username='.length);
            break;
        }
    }

    // 如果存在 username，则在顶栏中显示
    if (username) {
        const navbar = document.querySelector('.navbar');

        // 检查 cookies 中的 admin 值
        for (const cookie of cookies) {
            if (cookie.startsWith('admin=')) {
                isAdmin = cookie.substring('admin='.length) === 'true';
                break;
            }
        }

        // 创建用户名按钮
        const userButton = document.createElement('button');
        userButton.className = 'btn'; // 使用 daisyUI 的 btn 类
        userButton.textContent = username;
        userButton.style.marginLeft = '10px';

        // 如果是管理员，添加红色标签
        if (isAdmin) {
            const adminBadge = document.createElement('span');
            adminBadge.textContent = '管理员';
            adminBadge.style.backgroundColor = '#FF4D4F'; // 红色背景
            adminBadge.style.color = '#fff'; // 白色字体
            adminBadge.style.padding = '2px 8px';
            adminBadge.style.marginLeft = '10px';
            adminBadge.style.borderRadius = '12px';
            adminBadge.style.fontSize = '0.9em';
            adminBadge.style.display = 'inline-block';
            adminBadge.style.verticalAlign = 'middle';
            userButton.appendChild(adminBadge);
        }

        userButton.addEventListener('click', (event) => {
            // 检查是否已经存在下拉菜单
            const existingDropdown = document.querySelector('.user-dropdown');
            if (existingDropdown) {
                // 如果存在，则添加消失动画并移除
                existingDropdown.classList.remove('show');
                existingDropdown.classList.add('hide');
                userButton.style.backgroundColor = '';
                setTimeout(() => navbar.removeChild(existingDropdown), 500);
                return;
            }

            // 创建气泡菜单
            const userDropdown = document.createElement('div');
            userDropdown.className = 'user-dropdown bubble-menu';
            setTimeout(() => userDropdown.classList.add('show'), 10);
            // 定位：靠右对齐按钮，稍微下移
            userDropdown.style.right = '0';
            userDropdown.style.left = 'auto';
            userDropdown.style.top = `${userButton.offsetTop + userButton.offsetHeight + 8}px`;
            userDropdown.style.zIndex = '99999';

            // 添加三角箭头
            // const arrow = document.createElement('div');
            // arrow.className = 'bubble-arrow';
            // userDropdown.appendChild(arrow);

            // 设置按钮背景色为白色
            userButton.style.backgroundColor = '#fff';

            // 创建“设置”选项
            const settingsLink = document.createElement('a');
            settingsLink.href = '/bbs/settings';
            settingsLink.textContent = '设置';
            settingsLink.className = 'block px-4 py-2 hover:bg-base-200';
            settingsLink.target = '_blank';
            settingsLink.style.display = 'block';
            settingsLink.style.textAlign = 'center';
            settingsLink.style.fontSize = '15px';
            settingsLink.style.marginTop = '8px';

            settingsLink.addEventListener('click', (event) => {
                event.preventDefault();
                // 读取 cookies 中的 open_in_box 值
                const cookies = document.cookie.split(';').map(cookie => cookie.trim());
                let openInBox = null;
                for (const cookie of cookies) {
                    if (cookie.startsWith('open_in_box=')) {
                        openInBox = cookie.substring('open_in_box='.length);
                        break;
                    }
                }

                // 如果没有值，默认在新标签页打开，并设置 open_in_box 为 false
                if (openInBox === null) {
                    document.cookie = 'open_in_box=false; path=/;';
                    openInBox = 'newtab';
                }

                if (openInBox === 'newtab') {
                    // 在新标签页打开
                    window.open('/bbs/settings', '_blank');
                } else if (openInBox === 'upwindow') {
                    // 在弹出式窗口中打开
                    window.open('/bbs/settings', '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
                } else if (openInBox === 'indexwindow') {
                    // 在网页中嵌入一个窗口打开
                    const modal = document.createElement('div');
                    modal.style.position = 'fixed';
                    modal.style.top = '0';
                    modal.style.left = '0';
                    modal.style.width = '100%';
                    modal.style.height = '100%';
                    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    modal.style.display = 'flex';
                    modal.style.justifyContent = 'center';
                    modal.style.alignItems = 'center';
                    modal.style.zIndex = '1000';

                    const modalContent = document.createElement('div');
                    modalContent.style.backgroundColor = '#fff';
                    modalContent.style.padding = '20px';
                    modalContent.style.borderRadius = '8px';
                    modalContent.style.maxWidth = '600px';
                    modalContent.style.width = '100%';
                    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    modalContent.style.maxHeight = '80%'; // 限制高度
                    modalContent.style.overflowY = 'auto'; // 添加垂直滚动条

                    const iframe = document.createElement('iframe');
                    iframe.src = '/bbs/settings';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = 'none';

                    const closeButton = document.createElement('button');
                    closeButton.textContent = '关闭';
                    closeButton.className = 'pushButton';
                    closeButton.style.marginTop = '10px';
                    closeButton.onclick = () => document.body.removeChild(modal);

                    modalContent.appendChild(iframe);
                    modalContent.appendChild(closeButton);
                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);
                }
            });

            // 创建“退出登录”选项
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = '退出登录';
            logoutLink.className = 'block px-4 py-2 hover:bg-base-200';
            logoutLink.style.display = 'block';
            logoutLink.style.textAlign = 'center';
            logoutLink.style.fontSize = '15px';
            logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.reload();
            });

            // 将选项添加到菜单中
            userDropdown.appendChild(settingsLink);
            userDropdown.appendChild(logoutLink);

            // 将菜单插入到顶栏中
            navbar.appendChild(userDropdown);

            // 点击空白处隐藏菜单
            const hideDropdown = (clickEvent) => {
                if (!userDropdown.contains(clickEvent.target) && !userButton.contains(clickEvent.target)) {
                    userDropdown.classList.remove('show');
                    userDropdown.classList.add('hide');
                    userButton.style.backgroundColor = '';
                    setTimeout(() => navbar.removeChild(userDropdown), 500);
                    document.removeEventListener('click', hideDropdown);
                }
            };
            document.addEventListener('click', hideDropdown);
        });

        navbar.appendChild(userButton);

        // 隐藏登录和注册按钮
        const loginLink = document.querySelector('.navbar a[href="/bbs/login"]');
        const registerLink = document.querySelector('.navbar a[href="/bbs/reg"]');
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
    }

    // 加载 type.json 文件
    fetch('/api/bbs/type.json')
        .then(response => response.json())
        .then(typeData => {
            // 将 type.json 转换为以标签名为键的对象，方便快速查找
            for (const tag in typeData) {
                tagColors[tag] = typeData[tag].color;
            }

            // 加载板块数据
            return fetch('/api/part')
                .then(response => response.json())
                .then(data => {
                    const sectionsContainer = document.getElementById('sections');
                    const sidebarLinks = document.getElementById('sidebar-links');
                    const sidebarTags = document.getElementById('sidebar-tags');
                    const sectionOrder = Object.keys(data);

                    sectionOrder.forEach(section => {
                        if (section.trim() === '') return;

                        // 创建侧边栏链接
                        const linkElement = document.createElement('li');
                        const anchorElement = document.createElement('a');
                        anchorElement.href = `#${section}`;
                        anchorElement.textContent = section;
                        linkElement.appendChild(anchorElement);
                        sidebarLinks.appendChild(linkElement);

                        const posts = Array.isArray(data[section]) ? data[section] : [];

                        posts.forEach(post => {
                            if (post && Array.isArray(post.type)) {
                                post.type.forEach(tag => {
                                    const tagElement = document.createElement('li');
                                    const tagAnchorElement = document.createElement('a');
                                    tagAnchorElement.href = `#tag-${tag}`;
                                    tagAnchorElement.textContent = tag;

                                    if (tagColors[tag]) {
                                        tagAnchorElement.style.backgroundColor = `${tagColors[tag]}80`;
                                        tagAnchorElement.style.color = '#fff';
                                        tagAnchorElement.style.padding = '5px 10px';
                                        tagAnchorElement.style.borderRadius = '20px';
                                    }

                                    tagElement.appendChild(tagAnchorElement);
                                    sidebarTags.appendChild(tagElement);
                                });
                            }
                        });

                        const sectionElement = document.createElement('div');
                        sectionElement.className = 'section';
                        sectionElement.id = section;

                        const sectionTitleElement = document.createElement('div');
                        sectionTitleElement.className = 'section-title';
                        sectionTitleElement.textContent = section;

                        const postsContainer = document.createElement('div');
                        const postsArr = Array.isArray(data[section]) ? data[section] : [];

                        postsArr.sort((a, b) => b.time - a.time);

                        postsArr.forEach(post => {
                            const postElement = document.createElement('div');
                            postElement.className = 'post';

                            const titleElement = document.createElement('div');
                            titleElement.className = 'post-title';
                            titleElement.textContent = post.title;

                            const tagsContainer = document.createElement('div');
                            tagsContainer.style.display = 'flex';
                            tagsContainer.style.gap = '5px';

                            if (Array.isArray(post.type) && post.type.length > 0) {
                                post.type.forEach(tag => {
                                    const tagElement = document.createElement('div');
                                    tagElement.className = 'post-tags';

                                    if (tagColors[tag]) {
                                        tagElement.style.backgroundColor = `${tagColors[tag]}80`;
                                        tagElement.style.color = '#fff';
                                    }

                                    tagElement.textContent = tag;
                                    tagsContainer.appendChild(tagElement);
                                });
                            } else {
                                tagsContainer.style.display = 'none';
                            }

                            titleElement.appendChild(tagsContainer);

                            const timeElement = document.createElement('div');
                            timeElement.style.color = '#888';
                            timeElement.style.fontSize = '0.9em';
                            const date = new Date(post.time);
                            timeElement.textContent = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

                            const authorElement = document.createElement('span');
                            authorElement.style.marginLeft = '10px';
                            authorElement.style.color = '#555';
                            authorElement.textContent = `${post.author}`;

                            // 添加 Apple Liquid Glass 风格按钮
                            const viewBtn = document.createElement('button');
                            viewBtn.className = 'post-view-btn';
                            viewBtn.title = '在新标签页中查看';
                            viewBtn.innerHTML = '<img src="/bbs/icon/viewfinder.svg" alt="查看">';
                            viewBtn.onclick = (e) => {
                                e.stopPropagation();
                                const sectionTitle = section;
                                const postTitle = post.title;
                                const url = `/bbs/${encodeURIComponent(sectionTitle)}/${encodeURIComponent(postTitle)}`;
                                window.open(url, '_blank');
                            };
                            timeElement.appendChild(authorElement);
                            timeElement.appendChild(viewBtn);

                            titleElement.appendChild(timeElement);

                            const contentElement = document.createElement('div');
                            contentElement.className = 'post-content post-content-truncated';
                            contentElement.innerHTML = marked.parse(post.text);

                            postElement.appendChild(titleElement);
                            postElement.appendChild(contentElement);
                            postsContainer.appendChild(postElement);
                        });

                        sectionElement.appendChild(sectionTitleElement);
                        sectionElement.appendChild(postsContainer);
                        sectionsContainer.appendChild(sectionElement);
                    });

                    const loadingElement = document.getElementById('loading');
                    loadingElement.style.display = 'none'; // 隐藏加载提示
                });
        })
        .catch(error => {
            console.error('Error fetching type data:', error);
        });

    // 为“注册”按钮绑定点击事件
    // const registerLink = document.getElementById('register-link');
    // registerLink.addEventListener('click', (event) => {
    //     event.preventDefault(); // 阻止默认跳转行为
    //     alert('Bloret 网站账号统一至服内，如要注册，请前往 bloret.net 服内进行注册。'); // 显示提示信息
    // });

    // 控制动画逻辑的 JavaScript
    const footer = document.querySelector('.sidebar-footer');
    let animationTimeout;

    footer.addEventListener('mouseenter', () => {
        clearTimeout(animationTimeout); // 清除之前的定时器
        footer.classList.add('hovering'); // 添加类以触发动画
    });

    footer.addEventListener('mouseleave', () => {
        footer.classList.remove('hovering'); // 移除类以停止动画
        animationTimeout = setTimeout(() => {
            footer.classList.add('hovering'); // 等待2秒后重新触发动画
        }, 2000);
    });
});

function showContent(contentId) {
    const tabs = document.querySelectorAll('.sidebar-tab');
    const contents = document.querySelectorAll('.sidebar-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    contents.forEach(content => {
        content.classList.remove('active');
    });

    document.getElementById(contentId).classList.add('active');
    document.querySelector(`.sidebar-tab[onclick="showContent('${contentId}')"]`).classList.add('active');
    
    // 更新侧边栏状态时调整主要内容位置
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sections = document.querySelectorAll('.section');
    if (sidebar.classList.contains('hidden')) {
        mainContent.style.marginLeft = '0';
        sections.forEach(section => {
            section.style.marginLeft = '0';
        });
    } else {
        mainContent.style.marginLeft = '';
        sections.forEach(section => {
            section.style.marginLeft = '';
        });
    }
}

// 弹出窗口函数
function showPostModal(title, content, tags) {
    // 读取 cookies 中的 open_in_box 值
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    let openInBox = null;
    for (const cookie of cookies) {
        if (cookie.startsWith('open_in_box=')) {
            openInBox = cookie.substring('open_in_box='.length);
            break;
        }
    }

    // 如果没有值，默认在新窗口中打开，并设置 open_in_box 为 newtab
    if (openInBox === null) {
        document.cookie = 'open_in_box=newtab; path=/;';
        openInBox = 'newtab';
    }

    if (openInBox === 'newtab') {
        // 在新标签页打开
        const newTab = window.open('', '_blank');
        let tagsHtml = '';
        if (Array.isArray(tags) && tags.length > 0) {
            tags.forEach(tag => {
                tagsHtml += `<div class="post-tags" style="background-color: ${tagColors[tag]}80; color: #fff;">${tag}</div>`;
            });
        }
        newTab.document.write(`
            <html>
                <head>
                    <title>${title} - Bloret</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; }
                        h2 { margin-bottom: 10px; }
                        .post-tags { color: #666; padding: 5px 10px; background-color: #f0f0f0; border-radius: 20px; font-size: 0.9em; display: inline-block; margin-right: 5px; margin-bottom: 10px; }
                        button { margin-top: 10px; padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; }
                        button:hover { background-color: #0056b3; }
                    </style>
                </head>
                <body>
                    <h2>${title}</h2>
                    <div>${tagsHtml}</div>
                    <div>${marked.parse(content)}</div>
                    <button class="pushButton" onclick="window.close()">关闭</button>
                </body>
            </html>
        `);
        newTab.document.close();
    } else if (openInBox === 'upwindow') {
        // 在浏览器自带的弹出式窗口中打开
        const popupWindow = window.open('', '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        let tagsHtml = '';
        if (Array.isArray(tags) && tags.length > 0) {
            tags.forEach(tag => {
                tagsHtml += `<div class="post-tags" style="background-color: ${tagColors[tag]}80; color: #fff;">${tag}</div>`;
            });
        }
        popupWindow.document.write(`
            <html>
                <head>
                    <title>${title} - Bloret</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; }
                        h2 { margin-bottom: 10px; }
                        .post-tags { color: #666; padding: 5px 10px; background-color: #f0f0f0; border-radius: 20px; font-size: 0.9em; display: inline-block; margin-right: 5px; margin-bottom: 10px; }
                        button { margin-top: 10px; padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; }
                        button:hover { background-color: #0056b3; }
                    </style>
                </head>
                <body>
                    <h2>${title}</h2>
                    <div>${tagsHtml}</div>
                    <div>${marked.parse(content)}</div>
                    <button class="pushButton" onclick="window.close()">关闭</button>
                </body>
            </html>
        `);
        popupWindow.document.close();
    } else if (openInBox === 'indexwindow') {
        // 在浏览器弹出式窗口中打开
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.maxWidth = '600px';
        modalContent.style.width = '100%';
        modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modalContent.style.maxHeight = '80%'; // 限制高度
        modalContent.style.overflowY = 'auto'; // 添加垂直滚动条

        let tagsHtml = '';
        if (Array.isArray(tags) && tags.length > 0) {
            tags.forEach(tag => {
                tagsHtml += `<div class="post-tags" style="background-color: ${tagColors[tag]}80; color: #fff;">${tag}</div>`;
            });
        }

        modalContent.innerHTML = `
            <h2>${title}</h2>
            <div>${tagsHtml}</div>
            <div>${marked.parse(content)}</div>
            <button class="pushButton" onclick="document.body.removeChild(this.parentElement.parentElement)">关闭</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
}

// 切换侧边栏显示/隐藏的函数
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sections = document.querySelectorAll('.section');
    const toggleButton = document.getElementById('toggle-sidebar');
    const icon = toggleButton.querySelector('img');

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden'); // 显示侧边栏
        icon.src = 'icon/square.righthalf.fill.svg'; // 修改图标
        mainContent.style.marginLeft = '';
        sections.forEach(section => {
            section.style.marginLeft = '';
        });
        // 更新顶栏宽度
        document.querySelector('.navbar').style.width = 'calc(100% - 20ch)';
    } else {
        sidebar.classList.add('hidden'); // 隐藏侧边栏
        icon.src = 'icon/square.svg'; // 修改图标
        mainContent.style.marginLeft = '0';
        sections.forEach(section => {
            section.style.marginLeft = '0';
        });
        // 更新顶栏宽度
        document.querySelector('.navbar').style.width = '100%';
    }
}
// 获取服务器状态信息
function fetchServerStatus() {
    fetch('https://api.mcsrvstat.us/3/bloret.net')
        .then(response => response.json())
        .then(data => {
            // 更新 MOTD 显示
            const motdDisplay = document.getElementById('motd-display');
            motdDisplay.innerHTML = ''; // 清空当前内容
            
            if (data.motd && data.motd.html) {
                data.motd.html.forEach(line => {
                    const lineElement = document.createElement('div');
                    lineElement.innerHTML = line;
                    motdDisplay.appendChild(lineElement);
                });
            } else {
                motdDisplay.textContent = '无法获取 MOTD 信息';
            }
            
            // 更新玩家数量
            const onlinePlayers = document.getElementById('online-players');
            const maxPlayers = document.getElementById('max-players');
            
            if (data.players) {
                onlinePlayers.textContent = data.players.online;
                maxPlayers.textContent = data.players.max;
                
                // 如果在线人数超过最大值的50%，显示警告颜色
                if (data.players.online > data.players.max * 0.5) {
                    onlinePlayers.style.color = '#FF9900';
                } else {
                    onlinePlayers.style.color = '';
                }
            } else {
                onlinePlayers.textContent = '未知';
                maxPlayers.textContent = '未知';
            }
            
            // 更新版本信息
            // const versionInfo = document.getElementById('version-info');
            // if (data.version || (data.protocol && data.protocol.name)) {
            //     let versionText = '版本：';
            //     if (data.version) {
            //         versionText += data.version;
            //     } else if (data.protocol && data.protocol.name) {
            //         versionText += data.protocol.name;
            //     }
                
            //     // 添加协议版本号（如果可用）
            //     if (data.protocol && data.protocol.version) {
            //         versionText += ` (协议 ${data.protocol.version})`;
            //     }
                
            //     versionInfo.textContent = versionText;
            // } else {
            //     versionInfo.textContent = '';
            // }
            
            // 更新服务器状态图标
            const serverStatusIcon = document.getElementById('server-status-icon');
            serverStatusIcon.style.backgroundColor = data.online ? '#4CAF50' : '#F44336';
            
            // 设置缓存过期时间（默认1分钟）+ 缓存结果
            const cacheExpire = data.debug?.cacheexpire ? 
                data.debug.cacheexpire * 1000 : Date.now() + 60000;
            
            localStorage.setItem('serverStatusCache', JSON.stringify({
                data,
                expireTime: cacheExpire
            }));
        })
        .catch(error => {
            console.error('Error fetching server status:', error);
            
            // 检查是否有缓存数据
            const cachedData = localStorage.getItem('serverStatusCache');
            if (cachedData) {
                try {
                    const { data, expireTime } = JSON.parse(cachedData);
                    if (Date.now() < expireTime) {
                        // 使用缓存数据更新界面
                        updateServerUI(data);
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse cached server status:', e);
                }
            }
            
            // 显示错误信息
            document.getElementById('motd-display').innerHTML = '<div>无法连接到服务器API</div>';
            document.getElementById('online-players').textContent = '离线';
            document.getElementById('max-players').textContent = '';
            // document.getElementById('version-info').textContent = '';
            document.getElementById('server-status-icon').style.backgroundColor = '#888';
        });
}

// 使用缓存数据更新UI
function updateServerUI(data) {
    const motdDisplay = document.getElementById('motd-display');
    motdDisplay.innerHTML = '';
    
    if (data.motd && data.motd.html) {
        data.motd.html.forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.innerHTML = line;
            motdDisplay.appendChild(lineElement);
        });
    }
    
    const onlinePlayers = document.getElementById('online-players');
    const maxPlayers = document.getElementById('max-players');
    
    if (data.players) {
        onlinePlayers.textContent = data.players.online;
        maxPlayers.textContent = data.players.max;
        
        if (data.players.online > data.players.max * 0.5) {
            onlinePlayers.style.color = '#FF9900';
        } else {
            onlinePlayers.style.color = '';
        }
    }
    
    // const versionInfo = document.getElementById('version-info');
    // if (data.version || (data.protocol && data.protocol.name)) {
    //     let versionText = '版本：';
    //     if (data.version) {
    //         versionText += data.version;
    //     } else if (data.protocol && data.protocol.name) {
    //         versionText += data.protocol.name;
    //     }
        
    //     // if (data.protocol && data.protocol.version) {
    //     //     versionText += ` (协议 ${data.protocol.version})`;
    //     // }
        
    //     versionInfo.textContent = versionText;
    // }
    
    const serverStatusIcon = document.getElementById('server-status-icon');
    serverStatusIcon.style.backgroundColor = data.online ? '#4CAF50' : '#F44336';
}

// 页面加载时获取服务器状态
document.addEventListener('DOMContentLoaded', () => {
    // 初始加载服务器状态
    fetchServerStatus();
    
    // 每隔5分钟更新一次服务器状态（300000毫秒）
    setInterval(fetchServerStatus, 300000);
});