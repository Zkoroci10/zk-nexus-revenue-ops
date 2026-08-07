import re
import unicodedata
import sys

portal_path = r'C:\Users\Dell\Documents\Projects ZK Nexus\portal.html'

with open(portal_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("--- TEST 1: UNICODE EMOJI SCANNER ---")
emoji_pattern = re.compile(
    "["
    "\U0001F300-\U0001F5FF"  # Misc Symbols and Pictographs
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F680-\U0001F6FF"  # Transport & Map Symbols
    "\U0001F700-\U0001F77F"  # Alchemical Symbols
    "\U0001F780-\U0001F7FF"  # Geometric Shapes Extended
    "\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
    "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
    "\U0001FA00-\U0001FA6F"  # Chess Symbols
    "\U0001FA70-\U0001FAFF"  # Symbols & Pictographs Extended-A
    "\U00002600-\U000026FF"  # Misc Symbols
    "\U00002700-\U000027BF"  # Dingbats
    "\U0001F1E6-\U0001F1FF"  # Flags
    "]+", flags=re.UNICODE
)

emojis_found = []
for line_idx, line in enumerate(content.splitlines(), start=1):
    matches = emoji_pattern.findall(line)
    if matches:
        emojis_found.append((line_idx, line, matches))

print(f"Total Emoji Matches Found: {len(emojis_found)}")
for line_no, line_str, m in emojis_found:
    print(f"  Line {line_no}: {m} in '{line_str.strip()[:60]}'")

# Also check for Symbol, Other (So) unicodedata category just in case
so_symbols = []
for line_idx, line in enumerate(content.splitlines(), start=1):
    for char in line:
        cat = unicodedata.category(char)
        if cat == 'So':
            so_symbols.append((line_idx, char, ord(char), unicodedata.name(char, 'UNKNOWN')))

print(f"Total Category 'So' (Symbol, Other) Found: {len(so_symbols)}")
for line_no, char, code, name in so_symbols:
    print(f"  Line {line_no}: U+{code:04X} ({char}) - {name}")

print("\n--- TEST 2: INLINE SVG ICONS AUDIT ---")
# Count <svg> tags
svg_tags = re.findall(r'<svg[^>]*>', content, re.IGNORECASE)
svg_closes = re.findall(r'</svg>', content, re.IGNORECASE)
print(f"Total <svg> elements: {len(svg_tags)} open, {len(svg_closes)} close")

# Check for img tags with broken icon paths or external images
img_tags = re.findall(r'<img[^>]*>', content, re.IGNORECASE)
print(f"Total <img> tags: {len(img_tags)}")
for img in img_tags:
    print(f"  Img Tag: {img}")

# Search for common UI icon locations to confirm SVG usage
icon_slots = [
    ("Retainer Client Select / Header Icon", r'header.*?<svg'),
    ("Retainer Status Badge Icon", r'retainer-badge.*?<svg'),
    ("DSR Calculator Title Icon", r'loan-calculator.*?<svg'),
    ("Buyer Dossiers Title Icon", r'dossiers-section.*?<svg'),
    ("Viewing Schedule Title Icon", r'schedule-section.*?<svg'),
    ("WhatsApp Action Buttons Icon", r'btn-whatsapp.*?<svg|wa\.me.*?<svg'),
    ("PDF Export Button Icon", r'btn-export.*?<svg|window\.print.*?<svg')
]

for slot_name, pattern in icon_slots:
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    print(f"  Slot '{slot_name}': {'FOUND INLINE SVG' if match else 'CHECK NEEDED'}")

print("\n--- TEST 3: @MEDIA PRINT STYLESHEET RULES AUDIT ---")
# Extract @media print block
media_print_match = re.search(r'@media\s+print\s*\{([^}]*\{[^}]*\}[^}]*)*\}', content, re.DOTALL | re.IGNORECASE)
if media_print_match:
    print("Found @media print block.")
    print("Content of @media print block:")
    print("="*40)
    print(media_print_match.group(0))
    print("="*40)
    
    # Check hidden elements (toolbar, filters, action buttons)
    hidden_check = re.search(r'(\.no-print|\.toolbar|\.filters|\.btn|\.action-buttons|button|header|form).*?display\s*:\s*none', media_print_match.group(0), re.IGNORECASE | re.DOTALL)
    print(f"  Hidden elements rule check (display: none): {'PASS' if hidden_check else 'FAIL/INSPECT'}")
    
    # Check background white rule (#ffffff or white)
    bg_white_check = re.search(r'(background|background-color)\s*:\s*(#ffffff|#fff|white)', media_print_match.group(0), re.IGNORECASE)
    print(f"  Print white background check (#ffffff): {'PASS' if bg_white_check else 'FAIL/INSPECT'}")
else:
    print("FAIL: @media print block NOT found!")
