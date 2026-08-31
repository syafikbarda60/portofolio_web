import os

folder = 'src/components/reactbits'
for f in os.listdir(folder):
    if f.endswith('.tsx') or f.endswith('.ts'):
        path = os.path.join(folder, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        if not content.startswith('"use client"') and not content.startswith("'use client'"):
            with open(path, 'w', encoding='utf-8') as file:
                file.write('"use client";\n\n' + content)
            print('Added use client to', f)
        else:
            print('Already has use client:', f)
