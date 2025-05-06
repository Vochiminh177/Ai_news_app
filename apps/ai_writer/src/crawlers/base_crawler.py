import requests
from bs4 import BeautifulSoup
import pandas as pd
from pandas._libs import json
from tqdm import tqdm
import time
from typing import Optional, List, Dict
from urllib.parse import urljoin
from datetime import datetime
import logging
import hashlib
from pathlib import Path


class BaseCrawler:
    def __init__(self,
                 base_delay: float = 3.0,
                 request_timeout: int = 15,
                 max_retries: int = 3,
                 enable_detail_crawl: bool = True):
        self.base_delay = base_delay
        self.request_timeout = request_timeout
        self.max_retries = max_retries
        self.enable_detail_crawl = enable_detail_crawl
        self.cache = {}
        self.proxies = None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.error_counter = {
            'request_failed': 0,
            'parse_failed': 0,
            'invalid_content': 0,
            'detail_failed': 0,
            'other_errors': 0
        }
        self._configure_logging()

    def _configure_logging(self):
        log_dir = Path("log")
        log_dir.mkdir(exist_ok=True)
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_dir / 'crawler.log', encoding='utf-8'),
                logging.StreamHandler()
            ]
        )

    def set_proxies(self, proxies: Dict[str, str]):
        self.proxies = proxies
        self.session.proxies.update(proxies)

    def _get_cache_key(self, url: str) -> str:
        return hashlib.md5(url.encode('utf-8')).hexdigest()

    def _fetch_page(self, url: str) -> Optional[str]:
        cache_key = self._get_cache_key(url)
        if cache_key in self.cache:
            return self.cache[cache_key]
        for attempt in range(self.max_retries):
            try:
                response = self.session.get(url, timeout=self.request_timeout, proxies=self.proxies)
                response.raise_for_status()
                self.cache[cache_key] = response.text
                return response.text
            except requests.exceptions.RequestException as e:
                if attempt < self.max_retries - 1:
                    time.sleep(self.base_delay * (attempt + 1))
                    continue
                logging.error(f"Request failed: {str(e)}")
                self.error_counter['request_failed'] += 1
                return None

    def _build_page_url(self, base_url: str, page: int, page_param: str) -> str:
        """
        Xây dựng URL phân trang cho trang tiếp theo.

        Args:
            base_url: URL cơ bản
            page: Số trang cần tạo
            page_param: Tên tham số phân trang

        Returns:
            str: URL phân trang đầy đủ
        """
        if '?' in base_url:
            # Nếu có, chỉ cần thêm tham số phân trang
            return f"{base_url}&{page_param}={page}"
        else:
            # Nếu chưa có dấu hỏi, thêm dấu hỏi và tham số phân trang
            return f"{base_url}?{page_param}={page}"

    def crawl(self, start_urls: str, max_pages: int = 1, page_param: str = 'p', page_start: int = 1,
              get_detail: bool = None) -> List[Dict]:
        if get_detail is None:
            get_detail = self.enable_detail_crawl

        articles = []
        # Kiểm tra nếu start_urls là chuỗi, chuyển thành danh sách
        if isinstance(start_urls, str):
            start_urls = [start_urls]

        # Lặp qua các URL để crawl
        for url in start_urls:
            for page in range(page_start, page_start + max_pages):
                # Gọi _build_page_url để xây dựng URL cho mỗi trang
                page_url = self._build_page_url(url, page, page_param)

                logging.info(f"Crawling page {page}: {page_url}")

                # Fetch dữ liệu từ URL của trang phân trang
                html_content = self._fetch_page(page_url)
                if not html_content:
                    continue

                soup = BeautifulSoup(html_content, 'html.parser')
                article_items = self._extract_article_items(soup)

                # Xử lý các bài viết tìm thấy
                for item in tqdm(article_items, desc=f"Page {page}", leave=False):
                    article_data = self._extract_article_data(item,url)
                    if article_data:
                        if get_detail and 'url' in article_data:
                            detail = self._crawl_article_detail(article_data['url'])
                            if detail:
                                article_data.update(detail)
                        articles.append(article_data)
                        time.sleep(self.base_delay * 0.5)

        return articles

    def _safe_extract(self, element, selectors, attr=None, process=None):
        for selector in selectors:
            try:
                found = element.select_one(selector) if isinstance(selector, str) else element.find(*selector)
                if found:
                    if attr:
                        value = found.get(attr)
                    else:
                        value = found.get_text().strip() if hasattr(found, 'get_text') else found.strip()
                    if process and value:
                        return process(value)
                    return value
            except Exception:
                continue
        return None

    def _extract_article_items(self, soup: BeautifulSoup) -> list:
        return soup.select('article.item-news')

    def _extract_article_data(self, item, base_url: str) -> Optional[Dict]:
        """Trích xuất và làm sạch sơ bộ"""
        try:
            # Trích xuất URL bài viết
            url = self._safe_extract(item, ['a[href]'], attr='href')
            if not url:
                return None

            # Trích xuất tiêu đề bài viết
            title = self._safe_extract(item, ['h2.title-news'])

            return {
                'title': title.strip() if title else '',
                'url': urljoin(base_url, url),  # Sử dụng base_url để tạo URL đầy đủ
                'summary': self._safe_extract(item, ['p.description']),
                'publish_date': self._safe_extract(item, ['span.time']),
                'crawl_time': datetime.now().isoformat(),
            }
        except Exception as e:
            logging.error(f"Error in extracting article data: {str(e)}")
            self.error_counter['parse_failed'] += 1
            return None

    def _crawl_article_detail(self, url: str) -> Optional[Dict]:
        html = self._fetch_page(url)
        if not html:
            return None
        return self._extract_article_detail(BeautifulSoup(html, 'html.parser'))

    def _extract_article_detail(self, soup: BeautifulSoup) -> Dict:
        raise NotImplementedError("Lớp con phải triển khai phương thức này")

    def save_data(self, data: List[Dict], output_dir: str, source: str, **kwargs):
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if kwargs.get('json', True):
            json_path = output_dir / f"{source}_{timestamp}.json"
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logging.info(f"Saved data to {json_path}")

# Class con
class VNExpressCrawler(BaseCrawler):
    def _extract_article_detail(self, soup: BeautifulSoup, url: str) -> Dict:
        content = self._safe_extract(soup, ['article.fck_detail'])
        return {
            'content': content.strip() if content else '',
            'author': self._safe_extract(soup, ['p.author_mail']),
            'keywords': [tag.text.strip() for tag in soup.select('ul.list_tag a')[:3]],
        }

if __name__ == "__main__":
    crawler = VNExpressCrawler(base_delay=1.5)
    results = crawler.crawl(
        start_urls="https://vnexpress.net/giao-duc",
        max_pages=1,
        get_detail=True
    )
    crawler.save_data(
        results,
        output_dir="data/vnexpress_clean",
        source="vnexpress_edu",
        formats=['json', 'parquet']
    )