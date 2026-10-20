"""Present the SQL course as one text link after the toolkit grid."""
import re
from pathlib import Path


def compact(page):
    html = page.read_text(encoding='utf-8')
    html = re.sub(r'<a class="card" href="sql-learning\.html">.*?</a>', '', html, flags=re.S)
    html = re.sub(r'<article class="card"><small>Data management</small><h3>SQL &amp; Databases</h3>.*?</article>', '', html, flags=re.S)
    if 'id="sql-course-link"' not in html:
        marker = '</div></div></section>'
        if marker not in html:
            raise SystemExit('Toolkit section changed upstream')
        html = html.replace(marker, '</div><p id="sql-course-link"><a href="sql-learning.html" style="text-decoration:underline;text-underline-offset:4px">MySQL &amp; SQL Learning Hub ↗</a></p></div></section>', 1)
    html = '\n'.join(line.rstrip() for line in html.split('\n'))
    page.write_text(html, encoding='utf-8')

if __name__ == '__main__':
    compact(Path('public/coding-data.html'))
