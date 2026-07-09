import pandas as pd
import os
import re
from typing import List, Dict, Optional
from urllib.parse import quote_plus

# Constants
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_CSV = os.path.join(BASE_DIR, "data", "products.csv")
PRICE_HISTORY_CSV = os.path.join(BASE_DIR, "data", "price_history.csv")

# In-memory cache for web search results (so we can retrieve them by product_id)
_web_results_cache: Dict[int, Dict] = {}

class WebSearchService:
    """Service to fetch real product data using DuckDuckGo and generate comparison links."""

    @staticmethod
    def extract_price(text: str) -> tuple:
        """Extract price from text, returns (display_price, numeric_price)."""
        patterns = [
            (r"₹\s?([\d,]+(?:\.\d{2})?)", "₹"),
            (r"Rs\.?\s?([\d,]+(?:\.\d{2})?)", "₹"),
            (r"INR\s?([\d,]+(?:\.\d{2})?)", "₹"),
            (r"(?:price|cost|mrp|offer|at)\s*:?\s*₹?\s*([\d,]+)", "₹"),
        ]

        all_prices = []
        for pattern, symbol in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                price_str = match.replace(",", "")
                try:
                    numeric = float(price_str)
                    if 500 < numeric < 10000000:
                        all_prices.append((f"{symbol}{numeric:,.0f}", numeric))
                except (ValueError, AttributeError):
                    pass

        if all_prices:
            all_prices.sort(key=lambda x: x[1])
            return all_prices[0]
        return ("Check Price", 0)

    @staticmethod
    def detect_seller(url: str, title: str = "") -> str:
        """Detect seller/marketplace from URL."""
        url_lower = url.lower() if url else ""
        title_lower = title.lower() if title else ""

        sellers = {
            "amazon.in": "Amazon India",
            "flipkart.com": "Flipkart",
            "croma.com": "Croma",
            "reliancedigital": "Reliance Digital",
            "vijaysales": "Vijay Sales",
            "tatacliq": "Tata CLiQ",
            "jiomart": "JioMart",
            "meesho": "Meesho",
            "snapdeal": "Snapdeal",
            "poorvika": "Poorvika",
            "91mobiles": "91Mobiles",
            "smartprix": "Smartprix",
            "pricebaba": "PriceBaba",
            "gadgets360": "Gadgets 360",
            "digit.in": "Digit",
            "mysmartprice": "MySmartPrice",
        }

        for key, name in sellers.items():
            if key in url_lower or key in title_lower:
                return name
        return "Online Store"

    @staticmethod
    def is_good_result(url: str, title: str = "") -> bool:
        """Check if URL is from a useful Indian shopping/price site. VERY STRICT filtering."""
        url_lower = url.lower() if url else ""

        # FIRST: Block ANY non-English characters in title (Chinese, Japanese, Korean, etc.)
        if title:
            # Check for CJK characters (Chinese, Japanese, Korean)
            for char in title:
                code = ord(char)
                # CJK Unified Ideographs and extensions
                if (0x4E00 <= code <= 0x9FFF or  # CJK Unified
                    0x3400 <= code <= 0x4DBF or  # CJK Extension A
                    0x3000 <= code <= 0x303F or  # CJK Punctuation
                    0x3040 <= code <= 0x309F or  # Hiragana
                    0x30A0 <= code <= 0x30FF or  # Katakana
                    0xAC00 <= code <= 0xD7AF):   # Korean Hangul
                    return False

        # STRICT EXCLUDE - Block all non-Indian sites
        excluded = [
            # Social media
            "youtube.com", "facebook.com", "twitter.com", "instagram.com",
            "pinterest.com", "linkedin.com", "tiktok.com",
            # Reference sites
            "wikipedia.org", "reddit.com", "quora.com", "stackoverflow.com",
            # US/International e-commerce (not .in)
            "amazon.com", "ebay.com", "walmart.com", "bestbuy.com", "newegg.com",
            "target.com", "costco.com",
            # Chinese sites - BLOCK ALL
            "alibaba.com", "aliexpress.com", "taobao.com", "jd.com", "tmall.com",
            "1688.com", "made-in-china.com", "dhgate.com", "banggood.com",
            "zhihu.com", "baidu.com", "weibo.com", "qq.com", "163.com",
            "bilibili.com", "douyin.com", "xiaohongshu.com", "sohu.com",
            ".cn", ".hk", ".tw",  # Block Chinese/HK/Taiwan domains
            "hkepc",  # Hong Kong PC site
            # German/European
            "hifi-forum.de", "android-hilfe.de", "idealo.de", "geizhals", ".de",
            # Generic blocked
            "google.com", "bing.com", "yahoo.com", "duckduckgo.com",
            "login", "signin", "signup", "account", "auth",
            "gmail.com", "mail.", "support.",
        ]

        for ex in excluded:
            if ex in url_lower:
                return False

        # STRICT INCLUDE - ONLY allow known Indian e-commerce/price comparison sites
        indian_shopping_sites = [
            # Major Indian e-commerce - MUST have .in or be known Indian site
            "amazon.in", "flipkart.com", "myntra.com", "ajio.com",
            "croma.com", "reliancedigital.in", "vijaysales.com",
            "tatacliq.com", "jiomart.com", "meesho.com", "snapdeal.com",
            "poorvika.com", "paytmmall.com", "shopclues.com",
            # Brand stores India
            "mi.com/in", "store.samsung.com/in", "oneplus.in", "apple.com/in",
            "boat-lifestyle.com", "realme.com/in",
            # Price comparison India
            "91mobiles.com", "smartprix.com", "pricebaba.com", "mysmartprice.com",
            "gadgets360.com", "pricedekho.com", "pricehistory.app",
            "compareindia.news18.com", "price.ind.in",
            # Tech news India (with prices)
            "digit.in", "techradar.com", "gsmarena.com",
            "beebom.com", "techpp.com", "fonearena.com",
            "indiashopps.com", "pricee.com",
        ]

        for domain in indian_shopping_sites:
            if domain in url_lower:
                return True

        # Allow .in domains (Indian)
        if ".in/" in url_lower or url_lower.endswith(".in"):
            return True

        return False  # STRICT: Reject everything else

    @staticmethod
    def get_product_image(query: str) -> str:
        """Get a product image URL using DuckDuckGo image search."""
        from ddgs import DDGS
        try:
            with DDGS() as ddgs:
                # Search for product image
                images = list(ddgs.images(f"{query} product", region="in-en", max_results=1))
                if images:
                    return images[0].get('image', '')
        except Exception as e:
            print(f"[Image Search] Error: {e}")
        return ""

    @staticmethod
    def search_duckduckgo(query: str) -> List[Dict]:
        """Search using DuckDuckGo (ddgs) for Indian product results with direct product links."""
        from ddgs import DDGS

        results = []
        seen_urls = set()

        # Get one product image for the query (to avoid too many image requests)
        query_image = ""
        try:
            with DDGS() as ddgs:
                images = list(ddgs.images(f"{query} product", region="in-en", max_results=3))
                if images:
                    query_image = images[0].get('image', '')
        except:
            pass

        try:
            with DDGS() as ddgs:
                # Targeted search queries to get DIRECT product pages with prices
                search_queries = [
                    f"site:amazon.in {query}",  # Direct Amazon India products
                    f"site:flipkart.com {query}",  # Direct Flipkart products
                    f"{query} buy online india ₹",  # General with price indicator
                    f"{query} price amazon.in flipkart",  # Price comparison
                ]

                for sq in search_queries:
                    try:
                        ddgs_results = list(ddgs.text(sq, region="in-en", max_results=10))

                        for r in ddgs_results:
                            url = r.get('href', '')
                            title = r.get('title', '')
                            body = r.get('body', '')

                            # Skip duplicates
                            if url in seen_urls:
                                continue

                            # Skip bad domains (pass title for language check)
                            if not WebSearchService.is_good_result(url, title):
                                continue

                            seen_urls.add(url)

                            # Extract price from title and body
                            combined_text = f"{title} {body}"
                            price_display, price_numeric = WebSearchService.extract_price(combined_text)

                            # Detect seller
                            seller = WebSearchService.detect_seller(url, title)

                            # Clean up title - remove site suffix like "- Amazon.in"
                            clean_title = title
                            for suffix in [' - Amazon.in', ' | Amazon.in', ' - Flipkart.com', ' | Flipkart',
                                         ' - Flipkart', ' - Croma', ' | Croma', ' - Buy Online']:
                                clean_title = clean_title.replace(suffix, '')
                            clean_title = clean_title[:120] if clean_title else f"{query.title()} Product"

                            results.append({
                                "name": clean_title,
                                "seller": seller,
                                "live_price": price_display,
                                "numeric_price": price_numeric,
                                "source_url": url,
                                "description": body[:200] if body else f"View on {seller}",
                                "is_indian": ".in" in url.lower() or seller != "Online Store",
                                "is_real_time": True,
                                "image_url": query_image  # Add product image
                            })

                            if len(results) >= 15:
                                break

                    except Exception as e:
                        print(f"[DuckDuckGo] Inner search error: {e}")
                        continue

                    if len(results) >= 12:
                        break

        except Exception as e:
            print(f"[DuckDuckGo] Search error: {e}")

        return results

    @staticmethod
    def generate_retailer_results(query: str) -> List[Dict]:
        """Generate direct links to major Indian retailers for price comparison."""
        encoded = quote_plus(query)

        # Major Indian e-commerce sites with direct search links
        retailers = [
            {
                "name": f"{query.title()} - Shop on Flipkart",
                "seller": "Flipkart",
                "source_url": f"https://www.flipkart.com/search?q={encoded}",
                "description": f"Search for {query} on Flipkart - India's leading online shopping destination"
            },
            {
                "name": f"{query.title()} - Shop on Amazon India",
                "seller": "Amazon India",
                "source_url": f"https://www.amazon.in/s?k={encoded}",
                "description": f"Find {query} on Amazon.in with fast delivery options"
            },
            {
                "name": f"{query.title()} - Shop on Croma",
                "seller": "Croma",
                "source_url": f"https://www.croma.com/searchB?q={encoded}",
                "description": f"Browse {query} at Croma - Electronics & Appliances specialist"
            },
            {
                "name": f"{query.title()} - Shop on Reliance Digital",
                "seller": "Reliance Digital",
                "source_url": f"https://www.reliancedigital.in/search?q={encoded}",
                "description": f"Check {query} prices at Reliance Digital stores"
            },
            {
                "name": f"{query.title()} - Shop on Vijay Sales",
                "seller": "Vijay Sales",
                "source_url": f"https://www.vijaysales.com/search/{encoded}",
                "description": f"Find {query} at Vijay Sales - Trusted electronics retailer"
            },
            {
                "name": f"{query.title()} - Compare on 91Mobiles",
                "seller": "91Mobiles",
                "source_url": f"https://www.91mobiles.com/search.php?s={encoded}",
                "description": f"Compare {query} prices across retailers on 91Mobiles"
            },
            {
                "name": f"{query.title()} - Compare on Smartprix",
                "seller": "Smartprix",
                "source_url": f"https://www.smartprix.com/products/?q={encoded}",
                "description": f"Find best {query} deals with Smartprix price comparison"
            },
        ]

        results = []
        for retailer in retailers:
            results.append({
                "name": retailer["name"],
                "seller": retailer["seller"],
                "live_price": "View Price",
                "numeric_price": 0,
                "source_url": retailer["source_url"],
                "description": retailer["description"],
                "is_indian": True,
                "is_real_time": True
            })

        return results

    @staticmethod
    def search_live(query: str) -> List[Dict]:
        """Fetch real-time product results from multiple sources."""
        all_results = []

        print(f"[WebSearch] Searching for: {query}")

        # 1. Try DuckDuckGo search first
        try:
            ddg_results = WebSearchService.search_duckduckgo(query)
            all_results.extend(ddg_results)
            print(f"[WebSearch] DuckDuckGo: Found {len(ddg_results)} results")
        except Exception as e:
            print(f"[WebSearch] DuckDuckGo failed: {e}")

        # 2. Add direct retailer links (always useful for comparison)
        retailer_results = WebSearchService.generate_retailer_results(query)

        # Merge: Add retailer results only if we don't have results from that seller already
        existing_sellers = {r.get('seller', '').lower() for r in all_results}
        for rr in retailer_results:
            if rr['seller'].lower() not in existing_sellers:
                all_results.append(rr)

        # 3. Sort: Results with prices first (sorted by price), then "View Price" results
        priced_results = [r for r in all_results if r.get('numeric_price', 0) > 0]
        unpriced_results = [r for r in all_results if r.get('numeric_price', 0) == 0]

        priced_results.sort(key=lambda x: x.get('numeric_price', float('inf')))

        all_results = priced_results + unpriced_results

        # 4. Assign product IDs and cache
        for i, result in enumerate(all_results):
            result["product_id"] = 9000 + i
            result["category"] = result.get("category", "Web Result")
            result["brand"] = result.get("brand", result.get("seller", "Online"))
            if not result.get("description"):
                result["description"] = f"View on {result.get('seller', 'retailer')}"
            _web_results_cache[result["product_id"]] = result

        print(f"[WebSearch] Total results: {len(all_results)}")
        return all_results

def load_products() -> pd.DataFrame:
    """Load the product catalog."""
    if not os.path.exists(PRODUCTS_CSV):
        return pd.DataFrame(columns=["product_id", "name", "category", "brand", "description"])
    return pd.read_csv(PRODUCTS_CSV)

def load_price_history() -> pd.DataFrame:
    """Load the historical price data."""
    if not os.path.exists(PRICE_HISTORY_CSV):
        return pd.DataFrame(columns=["product_id", "product", "seller", "city", "date", "price", "demand", "festival", "stock", "volatility"])
    df = pd.read_csv(PRICE_HISTORY_CSV)
    df['date'] = pd.to_datetime(df['date'])
    return df

def search_products(query: str, include_web: bool = True) -> List[Dict]:
    """Search products - ALWAYS use web search for real-time results with direct product links."""

    # ALWAYS do web search first to get real product links with prices
    if include_web and query:
        results = WebSearchService.search_live(query)
        if results:
            return results

    # Fallback to local CSV if web search fails
    results = []
    df = load_products()
    price_df = load_price_history()

    if query:
        query_words = query.lower().split()
        mask = pd.Series([True] * len(df))
        for word in query_words:
            word_mask = (
                df['name'].str.lower().str.contains(word, na=False) |
                df['category'].str.lower().str.contains(word, na=False) |
                df['brand'].str.lower().str.contains(word, na=False) |
                df['description'].str.lower().str.contains(word, na=False)
            )
            mask = mask & word_mask

        matched_products = df[mask]

        for _, product in matched_products.iterrows():
            product_id = product['product_id']
            product_prices = price_df[price_df['product_id'] == product_id]

            if not product_prices.empty:
                latest_prices = product_prices.sort_values('date').groupby('seller').tail(1)

                for _, price_row in latest_prices.iterrows():
                    results.append({
                        "product_id": int(product_id * 100 + len(results)),
                        "original_product_id": int(product_id),
                        "name": product['name'],
                        "category": product['category'],
                        "brand": product['brand'],
                        "description": product['description'],
                        "seller": price_row['seller'],
                        "live_price": f"₹{int(price_row['price']):,}",
                        "numeric_price": float(price_row['price']),
                        "city": price_row['city'],
                        "source_url": _get_retailer_url(price_row['seller'], product['name']),
                        "is_real_time": False,
                        "is_indian": True
                    })

    results.sort(key=lambda x: (x.get('numeric_price', 0) == 0, x.get('numeric_price', float('inf'))))

    for result in results:
        _web_results_cache[result['product_id']] = result

    return results

def _get_retailer_url(seller: str, product_name: str) -> str:
    """Generate retailer URL for the product."""
    encoded_name = product_name.replace(' ', '+')
    seller_lower = seller.lower()

    if 'amazon' in seller_lower:
        return f"https://www.amazon.in/s?k={encoded_name}"
    elif 'flipkart' in seller_lower:
        return f"https://www.flipkart.com/search?q={encoded_name}"
    elif 'croma' in seller_lower:
        return f"https://www.croma.com/searchB?q={encoded_name}"
    elif 'reliance' in seller_lower:
        return f"https://www.reliancedigital.in/search?q={encoded_name}"
    elif 'vijay' in seller_lower:
        return f"https://www.vijaysales.com/search/{encoded_name}"
    elif 'meesho' in seller_lower:
        return f"https://www.meesho.com/search?q={encoded_name}"
    elif 'mi store' in seller_lower:
        return f"https://www.mi.com/in/search?keyword={encoded_name}"
    elif 'samsung' in seller_lower:
        return f"https://www.samsung.com/in/search/?searchvalue={encoded_name}"
    elif 'oneplus' in seller_lower:
        return f"https://www.oneplus.in/search?keyword={encoded_name}"
    else:
        return f"https://www.google.co.in/search?q={encoded_name}+{seller}+price"

def get_product_details(product_id: int) -> Optional[Dict]:
    """Get details for a specific product."""
    # Check cache first (for search results with seller info)
    if product_id in _web_results_cache:
        return _web_results_cache[product_id]

    if product_id >= 9000:
        return {"product_id": product_id, "name": "Web Result Product", "is_real_time": True}

    # Handle new product ID scheme (original_id * 100 + index)
    original_product_id = product_id // 100 if product_id >= 100 else product_id

    df = load_products()
    product = df[df['product_id'] == original_product_id]
    if product.empty:
        # Try direct lookup
        product = df[df['product_id'] == product_id]
        if product.empty:
            return None

    result = product.iloc[0].to_dict()
    result['product_id'] = product_id  # Keep the requested ID
    return result

def get_product_prices(product_id: int, city: Optional[str] = None) -> List[Dict]:
    """Get all current/latest prices for a product across sellers."""
    # Check cache first (for search results with seller info)
    if product_id in _web_results_cache:
        cached = _web_results_cache[product_id]
        price = cached.get('numeric_price', 999)
        seller = cached.get('seller', 'Online Store')
        return [{"product_id": product_id, "seller": seller, "price": price, "city": cached.get('city', 'Online')}]

    if product_id >= 9000:
        return [{"product_id": product_id, "seller": "Online Store", "price": 999, "city": "Online"}]

    # Handle new product ID scheme (original_id * 100 + index)
    original_product_id = product_id // 100 if product_id >= 100 else product_id

    df = load_price_history()
    product_prices = df[df['product_id'] == original_product_id]

    # Fallback to direct lookup
    if product_prices.empty:
        product_prices = df[df['product_id'] == product_id]

    if city:
        product_prices = product_prices[product_prices['city'].str.contains(city, case=False)]

    # Get the latest price for each (seller, city) combination
    latest_prices = product_prices.sort_values('date').groupby(['seller', 'city']).tail(1)

    return latest_prices.to_dict(orient="records")

def get_historical_trends(product_id: int) -> List[Dict]:
    """Get price history for charting."""
    if product_id >= 9000:
        # Simulate a small history for web results based on a random walk
        import numpy as np
        dates = pd.date_range(end=pd.Timestamp.now(), periods=10).strftime('%Y-%m-%d').tolist()
        return [{"date": d, "price": 499 + np.random.randint(-20, 20)} for d in dates]

    df = load_price_history()
    return df[df['product_id'] == product_id].sort_values('date').to_dict(orient="records")
