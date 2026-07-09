from zipfile import ZipFile
from pathlib import Path
import re

docx_path = Path('question-source/thuvienhoclieu.com-Bai-tap-on-he-Toan-1-len-2-hay.docx')
output_path = Path('question-source/raw-text.txt')

with ZipFile(docx_path, 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

# Extract visible text between w:t tags and normalize whitespace.
texts = re.findall(r'<w:t[^>]*>(.*?)</w:t>', xml)
cleaned = []
for t in texts:
    cleaned.append(t.replace('\xa0', ' '))

lines = []
current = ''
for t in cleaned:
    if t.strip() == '':
        continue
    if t.endswith('\n'):
        current += t.strip()
        lines.append(current)
        current = ''
    else:
        if current:
            current += ' ' + t.strip()
        else:
            current = t.strip()
if current:
    lines.append(current)

with output_path.open('w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Wrote {len(lines)} lines to {output_path}')
print('\n'.join(lines[:120]))
