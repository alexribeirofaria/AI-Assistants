import os, pathlib, re, sys

# Paths from skill rules
SRC_ROOT = pathlib.Path('python-app')
TARGET_ROOT = pathlib.Path('angular-app/src/app/core')

# Mapping of DDD layers
LAYERS = ['domain', 'application', 'infrastructure', 'presentation']

def camel_case(name: str) -> str:
    # simple conversion: snake_case to PascalCase
    return ''.join(part.title() for part in name.split('_'))

def ensure_dir(path: pathlib.Path):
    path.mkdir(parents=True, exist_ok=True)

def convert_file(py_path: pathlib.Path):
    # Determine relative path inside src root
    rel = py_path.relative_to(SRC_ROOT)
    parts = rel.parts
    if parts[0] not in LAYERS:
        # skip files not in a DDD layer (e.g., __init__.py, top‑level scripts)
        return
    layer = parts[0]
    # Build target directories preserving sub‑folders after the layer
    target_dir = TARGET_ROOT / layer / pathlib.Path(*parts[1:-1])
    ensure_dir(target_dir)
    stem = py_path.stem  # filename without extension
    class_name = camel_case(stem)
    ts_path = target_dir / f"{stem}.ts"
    spec_path = target_dir / f"{stem}.spec.ts"
    # Write placeholder TypeScript class
    ts_content = f"""// Auto‑generated from {py_path}
export class {class_name} {{
  // TODO: implement conversion logic
}}
"""
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    # Write a basic spec file
    spec_content = f"""import {{ {class_name} }} from './{stem}';

describe('{class_name}', () => {{
  it('should be instantiated', () => {{
    const instance = new {class_name}();
    expect(instance).toBeTruthy();
  }});
}});
"""
    with open(spec_path, 'w', encoding='utf-8') as f:
        f.write(spec_content)

def main():
    for root, _, files in os.walk(SRC_ROOT):
        for file in files:
            if file.endswith('.py'):
                convert_file(pathlib.Path(root) / file)

if __name__ == '__main__':
    main()
