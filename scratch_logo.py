import urllib.request
import re

try:
    req = urllib.request.Request(
        'https://www.unidraw.com/index.php',
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        logos = re.findall(r'src="([^"]*logo[^"]*)"', html, re.IGNORECASE)
        imgs = re.findall(r'<img[^>]+src="([^">]+)"', html, re.IGNORECASE)
        print("Logos found:", logos)
        print("All images found:", imgs)
except Exception as e:
    print(e)
