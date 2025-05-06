from bs4 import BeautifulSoup
from urllib.parse import urljoin
from typing import Dict, Optional, List
from datetime import datetime
from tqdm import tqdm
import re
import time
import pytz

from AI_news_web.apps.ai_writer.src.crawlers import base2
from setting.Lib import logging

class VNExpressCrawler(base2.BaseCrawler):

    def __init__(self, base_delay: float = 2.0):
        super().__init__(base_delay=base_delay)
        self.base_url = "https://vnexpress.net"
        self.timezone = pytz.timezone('Asia/Ho_Chi_Minh')

    def _clean_text(self, text: str, remove_html: bool = True) -> str:
        if not text:
            return ""
        text = re.sub(r'[^\w\s\u00C0-\u1EF9\.,!?;:\-\']', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        text = re.sub(r'(\(|\[)?\s*(Video|Ảnh|Clip)\s*[^\)\]]*(\)|\])?', '', text)
        return text

    def _build_page_url(self, base_url: str, page: int, page_param: str = 'p') -> str:
        if page == 1:
            return base_url
        return f"{base_url}-p{page}"

    def _extract_article_items(self, soup: BeautifulSoup) -> list:
        items = []
        items.extend(soup.select('article.item-news, article.item-news-full'))
        items.extend(soup.select('div.item-news-common'))
        return items

    def _parse_vnexpress_date(self, date_str: str) -> Optional[str]:
        if not date_str:
            return None
        try:
            date_str = re.sub(r'\(GMT[+-]\d+\)', '', date_str)
            date_str = re.sub(r'Thứ [2-7],\s*', '', date_str)
            for fmt in ('%d/%m/%Y, %H:%M', '%d/%m/%Y'):
                try:
                    dt = datetime.strptime(date_str.strip(), fmt)
                    return self.timezone.localize(dt).isoformat()
                except ValueError:
                    continue
            return None
        except Exception:
            return None

    def _extract_article_data(self, item, page_url: str) -> Optional[Dict]:
        try:
            if item.select_one('.icon_premium, .icon_premium_black'):
                return None

            url = self._safe_extract(item, ['h2.title-news a', 'h3.title-news a', 'a'], attr='href')
            if not url:
                return None

            title = self._clean_text(
                self._safe_extract(item, ['h2.title-news', 'h3.title-news', 'h3.title-news-common']))
            if not title:
                return None

            summary = self._clean_text(self._safe_extract(item, ['p.description', 'p.description_news']))
            if summary and len(summary) < 20:
                summary = None

            return {
                'title': title,
                'url': urljoin(self.base_url, url),
                'summary': summary,
                'crawl_time': datetime.now(self.timezone).isoformat()
            }
        except Exception as e:
            self._log_error('parse_failed', f"Error extracting article: {str(e)}")
            return None

    def _crawl_article_detail(self, url: str) -> Optional[Dict]:
        cache_key = self._get_cache_key(url)
        if cache_key in self.cache:
            return self.cache[cache_key]
        try:
            html_content = self._fetch_page(url)
            if not html_content:
                return None
            detail_data = self._extract_article_detail(html_content)
            if detail_data:
                self.cache[cache_key] = detail_data
            return detail_data
        except Exception as e:
            self._log_error('detail_failed', f"Error crawling {url}: {str(e)}")
            return None

    def _extract_article_detail(self, html_content: str) -> Dict:
        soup = BeautifulSoup(html_content, 'html.parser')
        content_element = soup.select_one('article.fck_detail')
        content = self._clean_text(content_element.get_text()) if content_element else None

        keywords = []
        for tag in soup.select('ul.list_tag a')[:3]:
            if tag and tag.text:
                keywords.append(self._clean_text(tag.text))
        return {
            'content': content,
            'keywords': keywords
        }

    def crawl_all(self, start_url: str, category_slug: str, page_param: str = 'p',
                  page_start: int = 1, get_detail: bool = False,
                  url_history_path: str = 'url_history.json',
                  max_articles: Optional[int] = None) -> List[Dict]:

        url_history = self._load_url_history(url_history_path)
        articles = []
        page = page_start
        consecutive_duplicate_pages = 0
        max_consecutive = 3

        while True:
            page_url = self._build_page_url(start_url, page, page_param)
            logging.info(f"Crawling page {page}: {page_url}")
            html_content = self._fetch_page(page_url)
            if not html_content:
                break

            soup = BeautifulSoup(html_content, 'html.parser')
            article_items = self._extract_article_items(soup)
            if not article_items:
                logging.info(f"No articles found on page {page}. Ending crawl.")
                break

            new_articles = []
            for item in tqdm(article_items, desc=f"Page {page}", leave=False):
                if max_articles and len(articles) + len(new_articles) >= max_articles:
                    break

                article_data = self._extract_article_data(item, page_url)
                if not article_data:
                    continue
                if article_data['url'] in url_history:
                    continue

                if get_detail:
                    detail = self._crawl_article_detail(article_data['url'])
                    if detail:
                        article_data.update(detail)

                if 'content' not in article_data or not article_data['content']:
                    continue

                article_data['category'] = category_slug
                article_data['stt'] = len(articles) + len(new_articles) + 1
                new_articles.append(article_data)
                url_history.add(article_data['url'])
                time.sleep(self.base_delay * 0.5)

            if new_articles:
                articles.extend(new_articles)
                consecutive_duplicate_pages = 0
            else:
                consecutive_duplicate_pages += 1

            if consecutive_duplicate_pages >= max_consecutive:
                logging.info("Stopping crawl due to too many duplicate pages.")
                break

            if max_articles and len(articles) >= max_articles:
                logging.info("Reached max_articles limit. Stopping crawl.")
                break

            page += 1

        self._save_url_history(url_history, url_history_path)
        return articles
