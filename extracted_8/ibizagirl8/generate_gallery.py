#!/usr/bin/env python3
"""
Generador automático de gallery.json para IbizaGirl.pics
Escanea las carpetas y genera el archivo de configuración
"""

import os
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

# ===== CONFIGURACIÓN =====
BASE_PATH = "public/assets"

# Carpetas del proyecto
FOLDERS = {
    "censored": "censored",           # Imágenes censuradas (thumbnails izquierda)
    "censored_videos": "censored-videos",  # Videos censurados (thumbnails derecha)
    "full_images": "full",            # Imágenes sin censura (contenido premium)
    "full_videos": "videos",          # Videos sin censura (contenido premium)
    "thumbnails": "thumbnails"        # Thumbnails opcionales
}

# Extensiones válidas
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
VIDEO_EXTENSIONS = {'.mp4', '.webm', '.ogg', '.mov', '.avi'}

# Datos para generar contenido realista
IBIZA_LOCATIONS = [
    "Es Vedrà Beach",
    "Cala Comte",
    "Blue Marlin Beach Club",
    "Pacha Ibiza",
    "Ushuaïa Beach Hotel",
    "Cala Salada",
    "Sa Caleta",
    "Dalt Vila",
    "Benirràs Beach",
    "O Beach Club",
    "Amnesia Ibiza",
    "DC10",
    "Las Salinas Beach",
    "Nikki Beach",
    "Formentera",
    "Cala Bassa",
    "Playa d'en Bossa",
    "Ocean Beach Club",
    "Café del Mar",
    "Es Cavallet Beach"
]

CONTENT_TITLES = [
    "Sunset Paradise",
    "Beach Vibes",
    "Island Life",
    "Summer Dreams",
    "Golden Hour",
    "Pool Party",
    "Yacht Days",
    "Night Out",
    "Beach Club",
    "Private Session",
    "Exclusive Content",
    "Behind The Scenes",
    "VIP Access",
    "Premium Moments",
    "Ibiza Nights",
    "Luxury Lifestyle",
    "Paradise Found",
    "Crystal Waters",
    "Mediterranean Beauty",
    "Secret Location"
]

def scan_folder(folder_path):
    """Escanea una carpeta y retorna lista de archivos con su tipo"""
    files = []
    if os.path.exists(folder_path):
        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)
            if os.path.isfile(file_path):
                ext = Path(file).suffix.lower()
                if ext in IMAGE_EXTENSIONS:
                    files.append({"name": file, "type": "image", "path": file_path})
                elif ext in VIDEO_EXTENSIONS:
                    files.append({"name": file, "type": "video", "path": file_path})
    return files

def generate_title(index, type):
    """Genera un título único y atractivo"""
    base_title = random.choice(CONTENT_TITLES)
    return f"{base_title} #{index + 1}"

def generate_duration():
    """Genera duración aleatoria para videos"""
    minutes = random.randint(0, 15)
    seconds = random.randint(0, 59)
    return f"{minutes}:{seconds:02d}"

def generate_stats():
    """Genera estadísticas aleatorias realistas"""
    views = random.randint(500, 50000)
    likes_ratio = random.uniform(0.05, 0.20)  # 5-20% de likes
    return {
        "views": views,
        "likes": int(views * likes_ratio),
        "shares": random.randint(10, 500)
    }

def generate_date(index, total):
    """Genera fechas distribuidas en los últimos 2 meses"""
    days_ago = int((index / total) * 60) if total > 0 else random.randint(0, 60)
    date = datetime.now() - timedelta(days=days_ago)
    return date.strftime("%Y-%m-%d")

def match_files():
    """Empareja archivos censurados con sus versiones completas"""
    print("📂 Escaneando carpetas...")
    
    # Escanear todas las carpetas
    censored_images = scan_folder(os.path.join(BASE_PATH, FOLDERS["censored"]))
    censored_videos = scan_folder(os.path.join(BASE_PATH, FOLDERS["censored_videos"]))
    full_images = scan_folder(os.path.join(BASE_PATH, FOLDERS["full_images"]))
    full_videos = scan_folder(os.path.join(BASE_PATH, FOLDERS["full_videos"]))
    thumbnails = scan_folder(os.path.join(BASE_PATH, FOLDERS["thumbnails"]))
    
    print(f"✅ Encontrados:")
    print(f"   - {len(censored_images)} imágenes censuradas")
    print(f"   - {len(censored_videos)} videos censurados")
    print(f"   - {len(full_images)} imágenes completas")
    print(f"   - {len(full_videos)} videos completos")
    
    gallery_items = []
    item_id = 1
    
    # Procesar IMÁGENES
    print("\n🖼️ Procesando imágenes...")
    for i, censored_img in enumerate(censored_images):
        base_name = Path(censored_img["name"]).stem
        
        # Buscar versión completa
        full_match = None
        for full_img in full_images:
            if Path(full_img["name"]).stem == base_name:
                full_match = full_img
                break
        
        # Si no hay match, usar la censurada como full también
        if not full_match:
            full_match = censored_img
        
        # Buscar thumbnail si existe
        thumb_match = None
        for thumb in thumbnails:
            if Path(thumb["name"]).stem == base_name:
                thumb_match = thumb
                break
        
        # Crear item de galería
        item = {
            "id": item_id,
            "type": "image",
            "title": generate_title(i, "image"),
            "description": f"Exclusive content from {random.choice(IBIZA_LOCATIONS)}",
            "thumbnail": f"{BASE_PATH}/{FOLDERS['thumbnails']}/{thumb_match['name']}" if thumb_match 
                       else f"{BASE_PATH}/{FOLDERS['censored']}/{censored_img['name']}",
            "censored": f"{BASE_PATH}/{FOLDERS['censored']}/{censored_img['name']}",
            "full": f"{BASE_PATH}/{FOLDERS['full_images']}/{full_match['name']}",
            "date": generate_date(i, len(censored_images)),
            "location": random.choice(IBIZA_LOCATIONS),
            "views": random.randint(1000, 25000),
            "isPremium": True,
            "isLocked": True
        }
        
        gallery_items.append(item)
        item_id += 1
    
    # Procesar VIDEOS
    print("🎬 Procesando videos...")
    for i, censored_vid in enumerate(censored_videos):
        base_name = Path(censored_vid["name"]).stem
        
        # Buscar versión completa
        full_match = None
        for full_vid in full_videos:
            if Path(full_vid["name"]).stem == base_name:
                full_match = full_vid
                break
        
        # Si no hay match, usar el censurado como full
        if not full_match:
            full_match = censored_vid
        
        # Buscar thumbnail
        thumb_match = None
        for thumb in thumbnails:
            if base_name in thumb["name"] or thumb["name"].startswith(base_name):
                thumb_match = thumb
                break
        
        # Para videos, generar thumbnail del primer frame si no existe
        thumbnail_path = f"{BASE_PATH}/{FOLDERS['thumbnails']}/{thumb_match['name']}" if thumb_match else None
        
        # Si no hay thumbnail, usar una imagen placeholder o el video mismo
        if not thumbnail_path:
            # Buscar si hay alguna imagen con nombre similar en censored
            for img in censored_images:
                if base_name in img["name"]:
                    thumbnail_path = f"{BASE_PATH}/{FOLDERS['censored']}/{img['name']}"
                    break
            
            if not thumbnail_path:
                # Usar el video censurado como thumbnail (el navegador mostrará el primer frame)
                thumbnail_path = f"{BASE_PATH}/{FOLDERS['censored_videos']}/{censored_vid['name']}"
        
        # Crear item de galería
        item = {
            "id": item_id,
            "type": "video",
            "title": generate_title(i, "video"),
            "description": f"Exclusive video from {random.choice(IBIZA_LOCATIONS)}",
            "thumbnail": thumbnail_path,
            "censored": f"{BASE_PATH}/{FOLDERS['censored_videos']}/{censored_vid['name']}",
            "full": f"{BASE_PATH}/{FOLDERS['full_videos']}/{full_match['name']}",
            "duration": generate_duration(),
            "date": generate_date(i, len(censored_videos)),
            "location": random.choice(IBIZA_LOCATIONS),
            "views": random.randint(2000, 50000),
            "isPremium": True,
            "isLocked": True
        }
        
        gallery_items.append(item)
        item_id += 1
    
    # Ordenar por fecha (más recientes primero)
    gallery_items.sort(key=lambda x: x['date'], reverse=True)
    
    return gallery_items

def save_gallery_json(items, filename="gallery.json"):
    """Guarda el archivo gallery.json"""
    # Hacer backup si existe
    if os.path.exists(filename):
        backup_name = f"{filename}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.rename(filename, backup_name)
        print(f"📁 Backup creado: {backup_name}")
    
    # Guardar nuevo archivo
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Archivo {filename} generado exitosamente!")

def create_folder_structure():
    """Crea la estructura de carpetas si no existe"""
    print("🔧 Verificando estructura de carpetas...")
    
    created = False
    for folder_key, folder_name in FOLDERS.items():
        folder_path = os.path.join(BASE_PATH, folder_name)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path, exist_ok=True)
            print(f"   📁 Creada: {folder_path}")
            created = True
        else:
            print(f"   ✓ Existe: {folder_path}")
    
    if created:
        print("\n⚠️ Se han creado carpetas vacías. Añade tus archivos y ejecuta el script de nuevo.")
        return False
    return True

def print_summary(items):
    """Imprime resumen de la galería generada"""
    images = [i for i in items if i['type'] == 'image']
    videos = [i for i in items if i['type'] == 'video']
    
    print("\n" + "="*50)
    print("📊 RESUMEN DE LA GALERÍA")
    print("="*50)
    print(f"📸 Total de imágenes: {len(images)}")
    print(f"🎬 Total de videos: {len(videos)}")
    print(f"📦 Total de items: {len(items)}")
    print(f"💎 Contenido premium: {len([i for i in items if i.get('isPremium', False)])}")
    print("="*50)
    
    if len(items) > 0:
        print("\n🎯 Primeros 5 items:")
        for item in items[:5]:
            emoji = "🎬" if item['type'] == 'video' else "📸"
            print(f"   {emoji} [{item['id']}] {item['title']}")

def main():
    """Función principal"""
    print("="*50)
    print("🚀 GENERADOR DE GALERÍA - IbizaGirl.pics")
    print("="*50)
    
    # Verificar/crear estructura de carpetas
    if not create_folder_structure():
        return
    
    # Procesar archivos
    gallery_items = match_files()
    
    if not gallery_items:
        print("\n⚠️ No se encontraron archivos para procesar.")
        print("   Asegúrate de tener archivos en las carpetas:")
        print(f"   - {BASE_PATH}/{FOLDERS['censored']} (imágenes censuradas)")
        print(f"   - {BASE_PATH}/{FOLDERS['censored_videos']} (videos censurados)")
        return
    
    # Guardar JSON
    save_gallery_json(gallery_items)
    
    # Mostrar resumen
    print_summary(gallery_items)
    
    print("\n✨ ¡Proceso completado!")
    print("   Abre index.html en tu navegador para ver la galería")
    print("\n💡 Tip: Para mejor experiencia, usa un servidor web local:")
    print("   python3 -m http.server 8000")
    print("   Luego abre: http://localhost:8000")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Proceso cancelado por el usuario")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("   Verifica que estés ejecutando el script desde la raíz del proyecto")
