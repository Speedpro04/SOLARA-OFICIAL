import os
import re

directory = r"c:\SOLARA-CONNECT-OFICIAL\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original_content = content

    # Exclude lines with 50% or 100% or var(--radius) if we don't want to break circles
    # But wait, let's just use regex to replace all numeric borders (with or without px)
    # matching: borderRadius: 12, borderRadius: '12px', border-radius: 12px;

    # Replace borderRadius: <number>
    content = re.sub(r"borderRadius:\s*\d+,?", lambda m: "borderRadius: 2" + ("," if "," in m.group(0) else ""), content)
    
    # Replace borderRadius: '<number>px'
    content = re.sub(r"borderRadius:\s*'\d+px',?", lambda m: "borderRadius: 2" + ("," if "," in m.group(0) else ""), content)

    # Replace border-radius: <number>px
    content = re.sub(r"border-radius:\s*\d+px", "border-radius: 2px", content)
    
    # Replace borderRadius: iconSize * 0.3 or similar? Maybe skip for now unless it's a fixed number.

    if content != original_content:
        print(f"Updated {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            process_file(os.path.join(root, file))

print("Done")
