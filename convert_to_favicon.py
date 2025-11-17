#!/usr/bin/env python3
from PIL import Image
import os

# Ищем фото файл
image_sources = [
    "profile.jpg",
    "profile.png", 
    "avatar.jpg",
    "avatar.png",
    "photo.jpg",
    "photo.png",
    "assets/uploads/profile.jpg",
    "assets/uploads/profile.png",
    "assets/images/profile.jpg",
    "assets/images/profile.png",
]

# Попытаемся найти фото
found_image = None
for path in image_sources:
    if os.path.exists(path):
        found_image = path
        print(f"Найдено изображение: {path}")
        break

if not found_image:
    print("Фото не найдено. Пожалуйста, поместите фото в корневую папку проекта (profile.jpg или profile.png)")
    exit(1)

# Открываем и обрабатываем изображение
try:
    img = Image.open(found_image)
    
    # Конвертируем в RGB если нужно
    if img.mode == 'RGBA':
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Создаём favicon размеры
    sizes = [(32, 32), (64, 64), (128, 128), (256, 256)]
    
    # Сохраняем разные размеры
    for size in sizes:
        img_resized = img.resize(size, Image.Resampling.LANCZOS)
        filename = f"assets/icons/favicon-{size[0]}.png"
        img_resized.save(filename)
        print(f"Создан: {filename}")
    
    # Сохраняем основной favicon
    img_favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_favicon.save("assets/icons/favicon.png")
    print("Создан: assets/icons/favicon.png")
    
    # Конвертируем в ICO
    img_ico = img.resize((64, 64), Image.Resampling.LANCZOS)
    img_ico.save("assets/icons/favicon.ico")
    print("Создан: assets/icons/favicon.ico")
    
    print("\nУспешно! Favicon создан из вашей фотографии.")
    
except Exception as e:
    print(f"Ошибка: {e}")
    exit(1)
