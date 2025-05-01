# Smart Route Finder

Bu proje, Leaflet.js kullanarak bir harita üzerinde iki nokta arasındaki en kısa yolu Dijkstra algoritması ile bulur ve görsel olarak gösterir.

## Özellikler

- Haritada düğümleri ve kenarları gösterir.
- Kullanıcı tıklamasıyla başlangıç ve bitiş düğümleri seçilir.
- Dijkstra algoritması ile en kısa yol bulunur.
- Yol çizimi ve toplam mesafe bilgisi görüntülenir.
- Reset butonuyla seçim sıfırlanabilir.

## Kullanılan Teknolojiler

- HTML, CSS, JavaScript
- Leaflet.js
- Dijkstra Algoritması

## Dosya Yapısı

smart-route-finder/
├── index.html       # Ana HTML sayfası
├── style.css        # Stil dosyası
├── script.js        # Harita ve kullanıcı etkileşimi yönetimi
├── dijkstra.js      # Dijkstra algoritmasının implementasyonu
├── graph-data.json  # Düğüm ve kenar verileri
├── README.md        # Kurulum ve kullanım kılavuzu
