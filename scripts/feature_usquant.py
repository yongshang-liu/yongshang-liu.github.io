"""Keep the USQuant entry present after upstream website synchronization."""
from pathlib import Path

root = Path('public')
section = '    <section id="projects"><div class="wrap"><div class="section-head reveal"><span class="num">02 / WHAT I BUILD</span><h2>USQuant</h2><p>A Python, C++ and MySQL project for US equity data, backtesting, and paper-trading workflows, with SEC financial archives organized by year and quarter. In progress; live trading is disabled.</p></div><div class="list"><article class="row"><span class="type">Project</span><h3>US equity research toolkit</h3><p>Private GitHub repository — code access requires an invitation.</p><a class="cta" href="projects.html#usquant">View project ↗</a></article></div></div></section>\n'
article = '<article class="row" id="usquant"><small>In progress</small><h3>USQuant</h3><p>A Python, C++ and MySQL toolkit for US equity data, backtesting and paper-trading workflows. SEC financial archives are organized by year and quarter. Private repository: access is limited to the owner and invited collaborators; public visitors cannot browse the code. Live trading is disabled.</p><a href="https://github.com/yongshang-liu/usquant" target="_blank" rel="noopener noreferrer">GitHub · Private ↗</a></article>'
home = root / 'index.html'
html = home.read_text(encoding='utf-8')
if 'id="projects"' not in html:
    if '</main>' not in html:
        raise SystemExit('Homepage main element changed upstream')
    home.write_text(html.replace('</main>', section + '\n</main>', 1), encoding='utf-8')
page = root / 'projects.html'
html = page.read_text(encoding='utf-8')
if 'id="usquant"' not in html:
    marker = '<div class="list">'
    if marker not in html:
        raise SystemExit('Project list changed upstream')
    html = html.replace(marker, marker + '\n' + article, 1)
    html = html.replace('Repositories will be linked as soon as the first usable versions are ready.',
                        'Explore current work and planned projects. Repository access is indicated below.')
    page.write_text(html, encoding='utf-8')
