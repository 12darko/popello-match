---
description: Otomatik GitHub commit ve push
---

# Güzel - Otomatik GitHub Güncelleme

Bu workflow, kodun otomatik olarak GitHub'a commit ve push edilmesini sağlar.

## Adımlar:

1. Mevcut değişiklikleri kontrol et
```bash
git status
```

// turbo
2. Tüm değişiklikleri stage'e ekle
```bash
git add .
```

// turbo
3. Commit yap (timestamp ile)
```bash
git commit -m "Auto update: $(date '+%Y-%m-%d %H:%M:%S')"
```

// turbo
4. GitHub'a push et
```bash
git push
```

✅ Kod GitHub'da güncellendi!
