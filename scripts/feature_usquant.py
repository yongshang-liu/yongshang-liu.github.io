"""Keep the USQuant entry present after upstream website synchronization."""
import re
from pathlib import Path

root = Path('public')
section = '    <section id="projects"><div class="wrap"><div class="section-head reveal"><span class="num">02 / WHAT I BUILD</span><h2>USQuant</h2><p>A QuantConnect LEAN learning project with Python strategies, detailed Chinese guides, and a roadmap from data and backtesting to paper trading. Live trading is a future milestone and is not enabled.</p></div><div class="list"><article class="row"><span class="type">Project</span><h3>US equity research toolkit</h3><p>Public GitHub repository — explore the code and Chinese learning materials.</p><a class="cta" href="usquant-learning.html">中文学习中心 ↗</a></article></div></div></section>\n'
article = '<article class="row" id="usquant"><small>In progress</small><h3>USQuant</h3><p>Now built around QuantConnect LEAN: Python algorithms, detailed Chinese learning notes and a staged trading-system roadmap. The code repository and GitHub learning materials are publicly accessible. Current execution is offline backtesting.</p><a href="usquant-learning.html">中文学习中心 ↗</a></article>'
home = root / 'index.html'
html = home.read_text(encoding='utf-8')
# 更新我们维护的 USQuant 首页区块，避免继续展示迁移前的 C++ 引擎描述。
if 'id="projects"' in html:
    html = re.sub(r'<section id="projects">.*?</section>', lambda match: section.strip(), html, count=1, flags=re.S)
    home.write_text(html, encoding='utf-8')
else:
    if '</main>' not in html:
        raise SystemExit('Homepage main element changed upstream')
    home.write_text(html.replace('</main>', section + '\n</main>', 1), encoding='utf-8')
page = root / 'projects.html'
html = page.read_text(encoding='utf-8')
# 项目页以学习中心为入口；具体代码链接集中在学习中心中。
if 'id="usquant"' in html:
    html = re.sub(r'<article class="row" id="usquant">.*?</article>', lambda match: article, html, count=1, flags=re.S)
    page.write_text(html, encoding='utf-8')
else:
    marker = '<div class="list">'
    if marker not in html:
        raise SystemExit('Project list changed upstream')
    html = html.replace(marker, marker + '\n' + article, 1)
    html = html.replace('Repositories will be linked as soon as the first usable versions are ready.',
                        'Explore current work and planned projects. Repository access is indicated below.')
    page.write_text(html, encoding='utf-8')
