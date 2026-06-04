import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
    console.error("LỖI: Không tìm thấy YOUTUBE_API_KEY trong file .env hoặc biến môi trường.");
    process.exit(1);
}

const FILE_PATH = path.resolve(__dirname, '../public/data.json');
const API_URL = "https://www.googleapis.com/youtube/v3/videos";

const CATEGORIES = {
    "default": "",
    "music": "10",
    "movies": "1",
    "gaming": "20"
};

async function fetchCategory(categoryId) {
    try {
        const response = await axios.get(API_URL, {
            params: {
                part: "snippet,statistics",
                chart: "mostPopular",
                regionCode: "VN",
                maxResults: 50,
                key: API_KEY,
                videoCategoryId: categoryId || undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error(`LỖI gọi YouTube API: ${error.message}`);
        throw error;
    }
}

async function updateData() {
    console.log("Bắt đầu cập nhật dữ liệu...");
    let oldData = {};
    let lastUpdatedOld = 0;
    
    try {
        const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        oldData = parsed.categories || {};
        lastUpdatedOld = new Date(parsed.last_updated).getTime();
    } catch (e) {
        console.log("Không tìm thấy file public/data.json cũ. Tiến hành tạo mới hoàn toàn.");
    }

    const currentTime = Date.now();
    const hoursDiff = lastUpdatedOld ? (currentTime - lastUpdatedOld) / (1000 * 60 * 60) : 0;
    
    const newData = {
        last_updated: new Date().toISOString(),
        categories: {}
    };

    for (const [key, id] of Object.entries(CATEGORIES)) {
        console.log(`Đang lấy dữ liệu danh mục: ${key === 'default' ? 'Tổng hợp' : key}...`);
        const data = await fetchCategory(id);
        const videos = data.items.map((item, index) => {
            const currentRank = index + 1;
            const videoId = item.id;
            const views = parseInt(item.statistics.viewCount || "0");
            
            const oldCategoryList = oldData[key] || [];
            const oldVideo = oldCategoryList.find(v => v.id === videoId);
            
            const publishedAt = item.snippet.publishedAt;
            const publishTime = new Date(publishedAt).getTime();
            const daysSincePublish = (currentTime - publishTime) / (1000 * 60 * 60 * 24);

            let viewsPerHour = 0;
            let trend = "—";
            let trendDirection = null;  // "up" | "down" | null
            let trendCount = 0;
            const NEW_VIDEO_THRESHOLD_DAYS = 3;

            if (daysSincePublish <= NEW_VIDEO_THRESHOLD_DAYS) {
                trend = "NEW";
                trendDirection = null;
                trendCount = 0;
            } else if (oldVideo) {
                const oldRank = oldVideo.rank;
                const change = oldRank - currentRank; // dương = tăng hạng, âm = giảm hạng

                if (change > 0) {
                    // Video đang TĂNG hạng
                    if (oldVideo.trendDirection === 'up') {
                        // Cùng hướng tăng -> cộng dồn
                        trendDirection = 'up';
                        trendCount = (oldVideo.trendCount || 0) + change;
                    } else {
                        // Đổi hướng (trước đó giảm hoặc mới) -> RESET
                        trendDirection = 'up';
                        trendCount = change;
                    }
                    trend = `▲ ${trendCount}`;
                } else if (change < 0) {
                    // Video đang GIẢM hạng
                    if (oldVideo.trendDirection === 'down') {
                        // Cùng hướng giảm -> cộng dồn
                        trendDirection = 'down';
                        trendCount = (oldVideo.trendCount || 0) + Math.abs(change);
                    } else {
                        // Đổi hướng (trước đó tăng hoặc mới) -> RESET
                        trendDirection = 'down';
                        trendCount = Math.abs(change);
                    }
                    trend = `▼ ${trendCount}`;
                } else {
                    // Giữ nguyên hạng -> giữ nguyên trend cũ
                    trendDirection = oldVideo.trendDirection || null;
                    trendCount = oldVideo.trendCount || 0;
                    if (trendDirection === 'up' && trendCount > 0) {
                        trend = `▲ ${trendCount}`;
                    } else if (trendDirection === 'down' && trendCount > 0) {
                        trend = `▼ ${trendCount}`;
                    } else {
                        trend = "—";
                    }
                }
            }

            // Tính Xem/Giờ
            if (oldVideo && hoursDiff > 0) {
                const oldViews = oldVideo.views;
                if (views >= oldViews) {
                    viewsPerHour = Math.round((views - oldViews) / hoursDiff);
                } else {
                    // Lượt xem giảm (YouTube hiệu chỉnh) -> giữ nguyên giá trị cũ
                    viewsPerHour = oldVideo.viewsPerHour || 0;
                }
            }

            return {
                id: videoId,
                rank: currentRank,
                trend: trend,
                trendDirection: trendDirection,
                trendCount: trendCount,
                publishedAt: publishedAt,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                views: views,
                likes: parseInt(item.statistics.likeCount || "0"),
                comments: parseInt(item.statistics.commentCount || "0"),
                viewsPerHour: viewsPerHour
            };
        });
        newData.categories[key] = videos;
    }

    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, JSON.stringify(newData, null, 2), 'utf-8');
    console.log("Cập nhật thành công vào public/data.json!");
}

updateData().catch(console.error);
