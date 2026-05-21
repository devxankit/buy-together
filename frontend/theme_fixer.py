import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements mapping
    replacements = {
        'bg-[#0D9488]': 'bg-primary',
        'text-[#0D9488]': 'text-primary',
        'border-[#0D9488]': 'border-primary',
        'bg-white': 'bg-surface',
        'border-white': 'border-surface',
        'border-slate-50': 'border-line',
        'border-slate-100': 'border-line',
        'border-[#E2E8F0]': 'border-line',
        'bg-[#F8FAFC]': 'bg-surface-alt',
        'bg-[#F0FDF9]': 'bg-primary-soft',
        'bg-[#E6F4F2]': 'bg-primary-soft',
        'bg-[#E0F5F3]': 'bg-primary-soft',
        'text-[#94A3B8]': 'text-muted',
        'bg-slate-50': 'bg-surface-alt',
        'bg-slate-100': 'bg-surface-alt',
        'text-slate-400': 'text-muted',
        'text-slate-500': 'text-faint',
        'text-slate-600': 'text-faint',
        'text-slate-700': 'text-ink',
        'text-slate-800': 'text-ink',
        'text-[#0F172A]': 'text-ink',
        'text-[#1E293B]': 'text-ink',
        'shadow-teal-600/30': 'shadow-primary/30',
        'shadow-teal-500/30': 'shadow-primary/30',
        'accent-[#0D9488]': 'accent-primary',
        'shadow-slate-200/50': 'shadow-card'
    }

    new_content = content
    for old_str, new_str in replacements.items():
        new_content = new_content.replace(old_str, new_str)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

if __name__ == "__main__":
    search_dirs = [
        "src/pages/userMain/**/*.jsx",
        "src/pages/auth/**/*.jsx"
    ]
    
    for pattern in search_dirs:
        for file in glob.glob(pattern, recursive=True):
            replace_in_file(file)
