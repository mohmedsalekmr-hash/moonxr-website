import os, glob, re
directory = r'c:\Users\salek\OneDrive\Desktop\VR_WEB\xr-landing\src'
files = glob.glob(os.path.join(directory, '**', '*.tsx'), recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'import\s+\{\s*CanvasBackground\s*\}\s+from\s+[^;]+;\n?', '', content)
    new_content = re.sub(r'<CanvasBackground\s*/>\s*\n?', '', new_content)
    new_content = re.sub(r'<div\s+className="[^"]*blur-\[[^"]*pointer-events-none[^"]*"\s*/>\s*\n?', '', new_content)
    new_content = re.sub(r'<div\s+className="[^"]*blur-3xl[^"]*rounded-full[^"]*"\s*/>\s*\n?', '', new_content)
    new_content = re.sub(r'<motion\.div\s+animate=\{\{\s*rotate:\s*360\s*\}\}\s+transition=\{\{\s*duration:\s*50,\s*repeat:\s*Infinity,\s*ease:\s*"linear"\s*\}\}\s+className="absolute w-\[50%\] aspect-square rounded-full bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 blur-3xl"\s*/>\s*\n?', '', new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
