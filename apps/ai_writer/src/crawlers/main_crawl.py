from datetime import datetime
import time

from AI_news_web.apps.ai_writer.src.crawlers.vnexpress_crawler import VNExpressCrawler

if __name__ == "__main__":
    crawler = VNExpressCrawler(base_delay=1.5)

    # Danh sách chuyên mục cần crawl
    categories = [
        # "thoi-su",
        # "the-gioi", "giao-duc", "kinh-doanh",
        # "suc-khoe", "doi-song", "du-lich", "the-thao",
        # "phap-luat", "giai-tri", "khoa-hoc",
        "so-hoa"
    ]

    MAX_TOTAL_ARTICLES = 50000
    MAX_PER_CATEGORY = 5000
    total_articles = 0

    for cat in categories:
        if total_articles >= MAX_TOTAL_ARTICLES:
            break

        print(f"\n📥 Bắt đầu crawl chuyên mục: {cat}")
        articles = crawler.crawl_all(
            start_url=f"https://vnexpress.net/{cat}",
            category_slug=cat,
            get_detail=True,
            max_articles=MAX_PER_CATEGORY,
            url_history_path=f"url_history_{cat}.json"
        )

        # Giới hạn nếu sắp vượt tổng số bài
        if total_articles + len(articles) > MAX_TOTAL_ARTICLES:
            articles = articles[:MAX_TOTAL_ARTICLES - total_articles]

        crawler.save_data(
            articles,
            output_dir=f"data/vnexpress/{cat}",
            source=f"vnexpress_{cat}",
            formats=["json"]
        )

        total_articles += len(articles)
        print(f" {cat}: {len(articles)} bài | Tổng cộng: {total_articles}")

        time.sleep(10)  # nghỉ giữa các chuyên mục

    print(f"\nCrawl hoàn tất. Tổng số bài viết: {total_articles}")
