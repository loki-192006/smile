import os

file_path = r'd:\smile\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'unpkg.com/@phosphor-icons/web' not in content:
    content = content.replace('</head>', '  <script src="https://unpkg.com/@phosphor-icons/web"></script>\n</head>')

replacements = {
    '💬': '<i class="ph-light ph-whatsapp-logo"></i>',
    '💄': '<i class="ph-light ph-paint-brush"></i>',
    '✂️': '<i class="ph-light ph-scissors"></i>',
    '🌸': '<i class="ph-light ph-flower-lotus"></i>',
    '👗': '<i class="ph-light ph-dress"></i>',
    '💖': '<i class="ph-light ph-heart"></i>',
    '👰': '<i class="ph-light ph-crown"></i>',
    '⭐': '<i class="ph-light ph-star"></i>',
    '✅': '<i class="ph-light ph-check-circle"></i>',
    '💍': '<i class="ph-light ph-gem"></i>',
    '🌟': '<i class="ph-light ph-shooting-star"></i>',
    '💎': '<i class="ph-light ph-diamond"></i>',
    '✨': '<i class="ph-light ph-sparkle"></i>',
    '💇': '<i class="ph-light ph-scissors"></i>',
    '🌿': '<i class="ph-light ph-leaf"></i>',
    '🧴': '<i class="ph-light ph-drop"></i>',
    '🧵': '<i class="ph-light ph-needle"></i>',
    '🤍': '<i class="ph-light ph-heart"></i>',
    '💜': '<i class="ph-light ph-heart"></i>',
    '👩‍🎨': '<i class="ph-light ph-palette"></i>',
    '👑': '<i class="ph-light ph-crown"></i>',
    '🎯': '<i class="ph-light ph-target"></i>',
    '💰': '<i class="ph-light ph-wallet"></i>',
    '📅': '<i class="ph-light ph-calendar"></i>',
    '🎁': '<i class="ph-light ph-gift"></i>',
    '📞': '<i class="ph-light ph-phone"></i>',
    '📍': '<i class="ph-light ph-map-pin"></i>',
    '🕐': '<i class="ph-light ph-clock"></i>',
    '🗺️': '<i class="ph-light ph-map-trifold"></i>',
    '📷': '<i class="ph-light ph-instagram-logo"></i>',
    '👍': '<i class="ph-light ph-facebook-logo"></i>',
    '✦': '<i class="ph-light ph-sparkle"></i>'
}

for emoji, tag in replacements.items():
    content = content.replace(emoji, tag)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Emojis replaced!')
