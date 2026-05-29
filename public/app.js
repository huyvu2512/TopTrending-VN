document.addEventListener('DOMContentLoaded', () => {
    let trendingData = {};
    const topThreeContainer = document.getElementById('top-three-list');
    const videoListContainer = document.getElementById('video-list');
    const tabs = document.querySelectorAll('.tab');
    const lastUpdatedPcEl = document.getElementById('last-updated-pc');
    const lastUpdatedMobileEl = document.getElementById('last-updated-mobile');
    const modalLastUpdatedPcEl = document.getElementById('modal-last-updated-pc');
    const modalLastUpdatedMobileEl = document.getElementById('modal-last-updated-mobile');

    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const shareBtn = document.getElementById('share-button');
    const readMoreBtn = document.getElementById('read-more-btn');
    const modalDesc = document.getElementById('modal-description');

    const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num);
    const formatVPH = (num) => {
        if (num >= 10000) {
            return Math.round(num / 1000) + 'K';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.', ',') + 'K';
        }
        return num.toString();
    };
    const formatViewsLikes = (num) => {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1).replace('.', ',').replace(',0', '') + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1).replace('.', ',').replace(',0', '') + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1).replace('.', ',').replace(',0', '') + 'K';
        }
        return num.toString();
    };

    async function loadData() {
        try {
            const res = await fetch('data.json');
            if (!res.ok) throw new Error('Không tìm thấy data.json');
            const json = await res.json();
            trendingData = json.categories;
            
            const date = new Date(json.last_updated);
            
            // PC format: Cập nhật mới nhất: 19:12:37 - 29/5/2026
            const timeStringPc = `Cập nhật mới nhất: ${date.toLocaleTimeString('vi-VN')} - ${date.toLocaleDateString('vi-VN')}`;
            
            // Mobile format: Cập nhật: 19:00 29/05/26
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            const dateStr = `${day}/${month}/${year}`;
            const timeStringMobile = `Cập nhật: ${hours}:${minutes} ${dateStr}`;
            
            if (lastUpdatedPcEl) lastUpdatedPcEl.textContent = timeStringPc;
            if (lastUpdatedMobileEl) lastUpdatedMobileEl.textContent = timeStringMobile;
            if (modalLastUpdatedPcEl) modalLastUpdatedPcEl.textContent = timeStringPc;
            if (modalLastUpdatedMobileEl) modalLastUpdatedMobileEl.textContent = timeStringMobile;
            
            renderList('default');

            // Handle loading initial video if ID is in the URL on load
            const path = window.location.pathname;
            const videoId = path && path !== '/' ? path.replace(/^\//, '') : null;
            if (videoId) {
                let foundVideo = null;
                for (const cat in trendingData) {
                    foundVideo = trendingData[cat].find(v => v.id === videoId);
                    if (foundVideo) break;
                }
                if (foundVideo) {
                    openModal(foundVideo, false);
                }
            }
        } catch (error) {
            videoListContainer.innerHTML = `<div style="text-align: center; color: var(--accent-red);">Chưa có dữ liệu, hãy chờ GitHub Actions chạy hoặc chạy lệnh api!</div>`;
        }
    }

    function renderList(categoryKey) {
        const videos = trendingData[categoryKey] || [];
        topThreeContainer.innerHTML = '';
        videoListContainer.innerHTML = '';

        const topThree = videos.slice(0, 3);
        const remaining = videos.slice(3);

        function getTrendHtml(video, isTop = false) {
            let trendHtml = '';
            if (video.trend === 'NEW') {
                trendHtml = `<span class="trend-new">NEW</span>`;
            } else if (video.trend && video.trend.startsWith('▲')) {
                const val = video.trend.substring(2);
                trendHtml = `
                    <div class="trend up">
                        <span class="trend-icon">▲</span>
                        <span class="trend-value">${val}</span>
                    </div>
                `;
            } else if (video.trend && video.trend.startsWith('▼')) {
                const val = video.trend.substring(2);
                trendHtml = `
                    <div class="trend down">
                        <span class="trend-icon">▼</span>
                        <span class="trend-value">${val}</span>
                    </div>
                `;
            } else {
                return '';
            }

            if (isTop) {
                return `<div class="top-trend-badge">${trendHtml}</div>`;
            }
            return trendHtml;
        }

        // Render Top 3
        topThree.forEach(video => {
            const rankClass = `rank-${video.rank}`;
            const article = document.createElement('article');
            article.className = 'top-card';
            article.innerHTML = `
                <div class="top-thumbnail-container">
                    <img src="${video.thumbnail}" alt="Thumbnail" class="top-thumbnail">
                    ${video.trend === 'NEW' ? `<div class="top-trend-badge"><span class="trend-new">NEW</span></div>` : ''}
                </div>
                <div class="top-card-content">
                    <div class="top-card-rank-col">
                        <div class="top-card-rank ${rankClass}">${video.rank}</div>
                        ${video.trend && video.trend !== 'NEW' ? getTrendHtml(video, false) : ''}
                    </div>
                    <div class="top-card-info">
                        <h2 class="top-card-title" title="${video.title.replace(/"/g, '&quot;')}">${video.title}</h2>
                        <p class="top-card-channel">${video.channelTitle}</p>
                        <div class="top-card-stats-dock">
                            <span class="stat-pill views">
                                <svg class="stat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${formatViewsLikes(video.views)}</span>
                            </span>
                            <span class="stat-pill likes">
                                <svg class="stat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                <span>${formatViewsLikes(video.likes)}</span>
                            </span>
                            <span class="stat-pill vph">
                                <svg class="stat-icon fire" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                                </svg>
                                <span>${formatVPH(video.viewsPerHour)}/h</span>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            article.addEventListener('click', () => openModal(video));
            topThreeContainer.appendChild(article);
        });

        // Render remaining videos
        remaining.forEach(video => {
            const rankClass = video.rank <= 3 ? `top-${video.rank}` : '';
            const article = document.createElement('article');
            article.className = 'video-card';
            article.innerHTML = `
                <div class="rank-container">
                    <span class="rank ${rankClass}">${video.rank}</span>
                    ${video.trend && video.trend !== 'NEW' ? getTrendHtml(video) : ''}
                </div>
                <div class="thumbnail-container">
                    <img src="${video.thumbnail}" alt="Thumbnail" class="thumbnail">
                    ${video.trend === 'NEW' ? `<div class="top-trend-badge"><span class="trend-new">NEW</span></div>` : ''}
                </div>
                <div class="video-info">
                    <h2 class="title" title="${video.title.replace(/"/g, '&quot;')}">${video.title}</h2>
                    <p class="channel-name">${video.channelTitle}</p>
                    <div class="top-card-stats-dock">
                        <span class="stat-pill views">
                            <svg class="stat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <span>${formatViewsLikes(video.views)}</span>
                        </span>
                        <span class="stat-pill likes">
                            <svg class="stat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            <span>${formatViewsLikes(video.likes)}</span>
                        </span>
                        <span class="stat-pill comments">
                            <svg class="stat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>${formatViewsLikes(video.comments)}</span>
                        </span>
                        <span class="stat-pill vph">
                            <svg class="stat-icon fire" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                            </svg>
                            <span>${formatVPH(video.viewsPerHour)}/h</span>
                        </span>
                    </div>
                </div>
            `;
            article.addEventListener('click', () => openModal(video));
            videoListContainer.appendChild(article);
        });
    }

    function openModal(video, shouldPushState = true) {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        modalIframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=${isMobile ? 0 : 1}`;
        document.getElementById('modal-title').textContent = video.title;
        document.getElementById('modal-views').textContent = formatNumber(video.views);
        document.getElementById('modal-likes').textContent = formatNumber(video.likes);
        document.getElementById('modal-comments').textContent = formatNumber(video.comments);
        document.getElementById('modal-vph').textContent = formatNumber(video.viewsPerHour);
        
        const escapeHtml = (text) => {
            if (!text) return "";
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
        const convertUrlsToLinks = (text) => {
            if (!text) return "Không có mô tả.";
            const escaped = escapeHtml(text);
            const urlRegex = /(https?:\/\/[^\s\)\],;\!\'"”’<>]+)/g;
            return escaped.replace(urlRegex, (url) => {
                const cleanClass = 'desc-link-' + url.replace(/[^a-zA-Z0-9]/g, '');
                return `<a href="${url}" target="_blank" class="desc-link ${cleanClass}">${url}</a>`;
            });
        };

        modalDesc.innerHTML = convertUrlsToLinks(video.description);
        modalDesc.classList.remove('collapsed');
        readMoreBtn.textContent = 'Thu gọn';
        
        // Parse and populate hashtags under the title
        const hashtagsContainer = document.getElementById('modal-hashtags');
        if (hashtagsContainer) {
            hashtagsContainer.innerHTML = '';
            if (video.description) {
                const matches = video.description.match(/#[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || [];
                const uniqueHashtags = Array.from(new Set(matches));
                if (uniqueHashtags.length > 0) {
                    uniqueHashtags.forEach(tag => {
                        const pill = document.createElement('span');
                        pill.className = 'modal-hashtag-pill';
                        pill.textContent = tag;
                        hashtagsContainer.appendChild(pill);
                    });
                    hashtagsContainer.style.display = 'flex';
                } else {
                    hashtagsContainer.style.display = 'none';
                }
            } else {
                hashtagsContainer.style.display = 'none';
            }
        }
        
        // Parse and populate links inside sidebar
        const linksSection = document.getElementById('modal-links-section');
        const linksList = document.getElementById('modal-links-list');
        if (linksSection && linksList) {
            linksList.innerHTML = '';
            
            const extractLinks = (text) => {
                if (!text) return [];
                const urlRegex = /(https?:\/\/[^\s\)\],;\!\'""'<>]+)/g;
                const matches = text.match(urlRegex) || [];
                
                const seen = new Set();
                const uniqueUrls = [];
                matches.forEach(url => {
                    const norm = url.toLowerCase().replace(/\/$/, '');
                    if (!seen.has(norm)) {
                        seen.add(norm);
                        uniqueUrls.push(url);
                    }
                });
                
                const icons = {
                    facebook: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
                    instagram: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
                    tiktok: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.06-1.45-.77-.56-1.43-1.28-1.93-2.11-.01 1.95-.01 3.9-.01 5.86 0 1.92-.37 3.89-1.4 5.48-1.53 2.4-4.38 3.86-7.21 3.43-2.88-.44-5.46-2.76-5.83-5.67-.47-3.69 1.98-7.39 5.62-8.08 1.1-.2 2.23-.11 3.3.21v4.11c-.77-.32-1.63-.44-2.44-.24-1.64.4-2.92 2.05-2.61 3.73.27 1.48 1.67 2.61 3.17 2.42 1.64-.21 2.76-1.74 2.67-3.34-.02-3.32-.01-6.64-.01-9.97z"/></svg>`,
                    twitter: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
                    youtube: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
                    spotify: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .007c-6.627 0-12 5.372-12 12s5.373 12 12 12 12-5.372 12-12-5.373-12-12-12zm5.502 17.31c-.22.359-.689.475-1.047.256-2.882-1.761-6.509-2.16-10.781-1.183-.41.093-.82-.165-.913-.574-.093-.41.165-.82.574-.913 4.674-1.068 8.68-.616 11.91 1.357.358.219.474.689.257 1.047zm1.468-3.262c-.277.449-.865.599-1.314.321-3.298-2.028-8.327-2.616-12.227-1.432-.504.153-1.031-.137-1.184-.641-.153-.504.137-1.031.641-1.184 4.457-1.353 9.992-.7 13.763 1.622.449.277.599.865.321 1.314zm.126-3.414c-3.953-2.348-10.473-2.565-14.257-1.417-.606.184-1.249-.153-1.433-.76-.184-.606.153-1.249.76-1.433 4.348-1.32 11.547-1.066 16.1 1.637.545.323.725 1.026.402 1.57-.323.546-1.027.726-1.571.403z"/></svg>`,
                    applemusic: `<svg class="stat-icon" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.89 16.5 4.39 9.3 8.65 9.17c1.35.04 2.27.7 3 1.04.75-.4 1.83-1.12 3.42-1 1.66.07 2.92.74 3.6 1.77-3.13 1.87-2.61 6.13.2 7.28-.68 1.71-1.57 3.32-2.82 4.12zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2.5-2.06 4.38-3.74 4.25z"/></svg>`,
                    globe: `<svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
                };

                const getLinkInfo = (url) => {
                    const lower = url.toLowerCase();
                    let name = "Liên kết";
                    let iconHtml = icons.globe;
                    let priority = 10;

                    if (lower.includes('facebook.com') || lower.includes('fb.com')) {
                        name = "Facebook";
                        iconHtml = icons.facebook;
                        priority = 1;
                    } else if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
                        name = "Instagram";
                        iconHtml = icons.instagram;
                        priority = 2;
                    } else if (lower.includes('tiktok.com')) {
                        name = "TikTok";
                        iconHtml = icons.tiktok;
                        priority = 3;
                    } else if (lower.includes('twitter.com') || lower.includes('x.com')) {
                        name = "Twitter / X";
                        iconHtml = icons.twitter;
                        priority = 4;
                    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
                        name = "YouTube";
                        iconHtml = icons.youtube;
                        priority = 5;
                    } else if (lower.includes('spotify.com') || lower.includes('spoti.fi')) {
                        name = "Spotify";
                        iconHtml = icons.spotify;
                        priority = 6;
                    } else if (lower.includes('apple.co') || lower.includes('music.apple.com')) {
                        name = "Apple Music";
                        iconHtml = icons.applemusic;
                        priority = 7;
                    } else {
                        try {
                            const domain = new URL(url).hostname.replace('www.', '');
                            name = domain;
                        } catch (e) {
                            name = "Website";
                        }
                        iconHtml = icons.globe;
                        priority = 100;
                    }
                    return { url, name, iconHtml, priority };
                };

                return uniqueUrls.map(getLinkInfo).sort((a, b) => a.priority - b.priority);
            };

            const parsedLinks = extractLinks(video.description);
            if (parsedLinks.length > 0) {
                parsedLinks.forEach(link => {
                    const linkBox = document.createElement('a');
                    linkBox.href = link.url;
                    linkBox.target = '_blank';
                    linkBox.className = 'modal-link-box';
                    
                    // Deep linking handling on mobile
                    linkBox.addEventListener('click', (e) => {
                        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                        if (!isMobile) return; // Allow normal link opening on PC
                        
                        e.preventDefault();
                        let deepLink = link.url;
                        const lower = link.url.toLowerCase();
                        
                        if (lower.includes('facebook.com') || lower.includes('fb.com')) {
                            deepLink = `fb://facewebmodal/query?href=${encodeURIComponent(link.url)}`;
                        } else if (lower.includes('instagram.com')) {
                            const match = link.url.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/);
                            if (match) deepLink = `instagram://user?username=${match[1]}`;
                        } else if (lower.includes('tiktok.com')) {
                            const match = link.url.match(/tiktok\.com\/@([a-zA-Z0-9_\.]+)/);
                            if (match) deepLink = `snssdk1128://user/profile/userId?username=${match[1]}`;
                        } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
                            deepLink = link.url.replace(/^https?:\/\//, 'youtube://');
                        } else if (lower.includes('spotify.com')) {
                            deepLink = link.url.replace(/^https?:\/\/(open|play)\.spotify\.com\//, 'spotify://');
                        }
                        
                        if (deepLink !== link.url) {
                            window.location.href = deepLink;
                            // Fallback to web browser if app is not installed
                            setTimeout(() => {
                                window.open(link.url, '_blank');
                            }, 1000);
                        } else {
                            window.open(link.url, '_blank');
                        }
                    });
                    linkBox.innerHTML = `
                        <span class="label">
                            ${link.iconHtml}
                            ${link.name}
                        </span>
                        <svg class="link-icon-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    `;
                    
                    // Sync hover state (glow left link when hovering right box)
                    const cleanClass = 'desc-link-' + link.url.replace(/[^a-zA-Z0-9]/g, '');
                    linkBox.addEventListener('mouseenter', () => {
                        const targets = document.querySelectorAll(`.${cleanClass}`);
                        targets.forEach(el => el.classList.add('glow'));
                    });
                    linkBox.addEventListener('mouseleave', () => {
                        const targets = document.querySelectorAll(`.${cleanClass}`);
                        targets.forEach(el => el.classList.remove('glow'));
                    });

                    linksList.appendChild(linkBox);
                });
                linksSection.style.display = 'block';
            } else {
                linksSection.style.display = 'none';
            }
        }

        shareBtn.onclick = () => {
            const url = `https://www.youtube.com/watch?v=${video.id}`;
            navigator.clipboard.writeText(url).then(() => {
                const originalText = shareBtn.innerHTML;
                shareBtn.innerHTML = 'Đã copy link!';
                setTimeout(() => shareBtn.innerHTML = originalText, 2000);
            });
        };

        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        if (shouldPushState) {
            history.pushState({ videoId: video.id }, '', `/${video.id}`);
        }
    }

    function closeModal(shouldPushState = true) {
        modal.style.display = 'none';
        modalIframe.src = ''; 
        document.body.classList.remove('modal-open');
        if (shouldPushState) {
            history.pushState(null, '', '/');
        }
    }

    closeModalBtn.addEventListener('click', () => closeModal());
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        const videoId = path && path !== '/' ? path.replace(/^\//, '') : null;
        if (videoId) {
            let foundVideo = null;
            for (const cat in trendingData) {
                foundVideo = trendingData[cat].find(v => v.id === videoId);
                if (foundVideo) break;
            }
            if (foundVideo) {
                openModal(foundVideo, false);
            } else {
                closeModal(false);
            }
        } else {
            closeModal(false);
        }
    });

    readMoreBtn.addEventListener('click', () => {
        modalDesc.classList.toggle('collapsed');
        readMoreBtn.textContent = modalDesc.classList.contains('collapsed') ? 'Xem thêm' : 'Thu gọn';
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.tab.active').classList.remove('active');
            tab.classList.add('active');
            renderList(tab.dataset.category);
        });
    });

    // Back to top logic
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    loadData();
});
