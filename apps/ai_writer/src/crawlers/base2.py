import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm
import time
from urllib.parse import urljoin
from typing import Optional, List, Dict
from datetime import datetime
import logging
import hashlib
from pathlib import Path
import json
import re


class BaseCrawler:
    def __init__(self, base_delay: float = 3.0, request_timeout: int = 15, max_retries: int = 3,
                 enable_detail_crawl: bool = True):
        self.base_delay = base_delay
        self.request_timeout = request_timeout
        self.max_retries = max_retries
        self.enable_detail_crawl = enable_detail_crawl
        self.cache = {}  # Simple cache to avoid duplicate processing
        self.proxies = None  # Proxy configuration
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
        """Cấu hình logging với xử lý lỗi đường dẫn"""
        try:
            log_dir = Path(__file__).parent / "logs"  # Dùng thư mục logs cùng cấp với file
            log_dir.mkdir(exist_ok=True, parents=True)  # Thêm parents=True để tạo cả thư mục cha

            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(levelname)s - %(message)s',
                handlers=[
                    logging.FileHandler(log_dir / 'crawler.log', encoding='utf-8'),
                    logging.StreamHandler()
                ]
            )
        except Exception as e:
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(levelname)s - %(message)s',
                handlers=[logging.StreamHandler()]  # Chỉ dùng console log nếu không tạo được file
            )
            logging.error(f"Cannot configure file logging: {str(e)}")

    def _get_cache_key(self, url: str) -> str:
        # Tạo một khóa duy nhất cho mỗi URL để quản lý cache
        return hashlib.md5(url.encode('utf-8')).hexdigest()

    def _fetch_page(self, url: str) -> Optional[str]:
        # Tải trang và kiểm tra cache để trách crawl lại trang cũ
        cache_key = self._get_cache_key(url)
        if cache_key in self.cache:
            logging.info(f"Using cached data for: {url}")
            return self.cache[cache_key]

        for attempt in range(self.max_retries):
            try:
                response = self.session.get(url, timeout=self.request_timeout, proxies=self.proxies)
                response.raise_for_status()
                self.cache[cache_key] = response.text  # Lưu vào cache
                return response.text
            except requests.exceptions.RequestException as e:
                if attempt < self.max_retries - 1:
                    time.sleep(self.base_delay * (attempt + 1))
                    continue
                logging.error(f"Request failed: {str(e)}")
                self.error_counter['request_failed'] += 1
                return None

    def _build_page_url(self, base_url: str, page: int, page_param: str) -> str:
        if '?' in base_url:
            return f"{base_url}&{page_param}={page}"
        else:
            return f"{base_url}?{page_param}={page}"

    def _safe_extract(self, element, selectors, attr=None):
        for selector in selectors:
            try:
                found = element.select_one(selector) if isinstance(selector, str) else element.find(*selector)
                if found:
                    if attr:
                        value = found.get(attr)
                    else:
                        value = found.get_text().strip() if hasattr(found, 'get_text') else found.strip()
                    return value
            except Exception:
                continue
        return None

    def clean_text(self, text: str, remove_html: bool = True) -> str:
        """
        Làm sạch văn bản thu được từ bài viết, loại bỏ HTML tags, ký tự đặc biệt và chuẩn hóa khoảng trắng.
        """
        if not text:
            return ""
        if remove_html:
            text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ.,!?;:-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def _load_url_history(self, path: str = 'url_history.json') -> set:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return set(json.load(f))
        except Exception:
            return set()

    def _save_url_history(self, history: set, path: str = 'url_history.json'):
        try:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(list(history), f, ensure_ascii=False, indent=2)
        except Exception as e:
            logging.error(f"Error saving URL history: {e}")

    def crawl(self, start_urls: str, max_pages: int = 1, page_param: str = 'p', page_start: int = 1) -> List[Dict]:
        """
        Crawl các bài viết từ các trang web. Đây là phương thức chung, lớp con cần phải triển khai các phương thức
        như `_extract_article_items`, `_extract_article_data`, và `_extract_article_detail` cho từng trang web cụ thể.
        """
        articles = []
        if isinstance(start_urls, str):
            start_urls = [start_urls]
        for url in start_urls:
            for page in range(page_start, page_start + max_pages):
                page_url = self._build_page_url(url, page, page_param)
                logging.info(f"Crawling page {page}: {page_url}")
                html_content = self._fetch_page(page_url)
                if not html_content:
                    continue
                soup = BeautifulSoup(html_content, 'html.parser')
                article_items = self._extract_article_items(soup)
                for item in tqdm(article_items, desc=f"Page {page}", leave=False):
                    article_data = self._extract_article_data(item, page_url)
                    if article_data:
                        if 'url' in article_data:
                            detail = self._crawl_article_detail(article_data['url'])
                            if detail:
                                article_data.update(detail)
                        articles.append(article_data)
                        time.sleep(self.base_delay * 0.5)
        return articles

    def save_data(self, data: List[Dict], output_dir: str, source: str, **kwargs):
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if kwargs.get('json', True):
            json_path = output_dir / f"{source}_{timestamp}.json"
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logging.info(f"Saved data to {json_path}")
        if kwargs.get('csv', False):
            csv_path = output_dir / f"{source}_{timestamp}.csv"
            pd.DataFrame(data).to_csv(csv_path, index=False, encoding='utf-8-sig')
            logging.info(f"Saved CSV: {csv_path}")
