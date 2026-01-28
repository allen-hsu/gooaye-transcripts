# 股癌 Podcast 轉錄網站

🎙️ Gooaye 股癌節目逐字稿整理

## 功能

- 📜 瀑布卡片式展示轉錄內容
- 🔍 全文搜尋
- 🏷️ 自動標籤（台積電、AI、衛星等熱門話題）
- 📱 響應式設計

## 本地開發

```bash
# 使用任意靜態伺服器
npx serve .
# 或
python -m http.server 8000
```

## 新增集數

1. 將轉錄檔案放到 `data/` 目錄
2. 更新 `data/episodes.json`

## 聲明

- 非官方網站，僅供個人學習使用
- 原節目：[Gooaye 股癌](https://linktr.ee/gooaye)
- 轉錄使用 MLX Whisper
