
# Popello Match - Geliştirici ve Yayınlama Rehberi

Bu dosya, projeyi sıfırdan bir Android uygulamasına (APK) dönüştürmeniz ve para kazanma sistemlerini (RevenueCat) kurmanız için hazırlanmış kapsamlı bir rehberdir.

---

## BÖLÜM 1: Web Sitesini Android Uygulamasına Çevirme

Bu proje, React ile yazılmış bir web sitesidir. Bunu telefona yüklenebilir bir uygulama (APK) yapmak için **Capacitor** adlı aracı kullanacağız.

### Gereksinimler (Bilgisayarınızda olması gerekenler)
1.  **Node.js:** (Zaten var varsayıyoruz).
2.  **Android Studio:** Google'ın resmi Android geliştirme programı. Ücretsiz indirin ve kurun.

### Adım Adım Kurulum

Projeyi indirdiğiniz klasörde bir terminal (komut satırı) açın ve sırasıyla şu komutları yazın:

#### 1. Capacitor Kurulumu
```bash
# Capacitor'u projeye ekle
npm install @capacitor/core @capacitor/cli @capacitor/android

# Projeyi başlat (com.ornek.popello kısmını kendinize göre değiştirin)
npx cap init "Popello Match" com.arcaneflux.popello
```

#### 2. Web Kodunu Derleme
React kodunu, telefonun anlayacağı basit HTML/JS dosyalarına çevirmeliyiz.
```bash
npm run build
```
*Önemli:* Bu işlem sonunda `dist` klasörü oluşacaktır. `capacitor.config.json` dosyasında `webDir: "dist"` yazdığından emin olun.

#### 3. Android Platformunu Ekleme
```bash
npx cap add android
```

#### 4. Kodu Eşitleme
Web kodunu Android klasörüne kopyalamak için:
```bash
npx cap sync
```

#### 5. Uygulamayı Açma
Bu komut Android Studio'yu açacaktır:
```bash
npx cap open android
```

Android Studio açıldığında telefonunuzu USB ile bağlayıp **"Play" (Yeşil üçgen)** tuşuna basarsanız oyun telefonunuzda çalışır!

---

## BÖLÜM 2: RevenueCat Nedir ve Nasıl Kurulur? (Basitleştirilmiş)

**RevenueCat Nedir?**
Google Play üzerinden satış yapmak (para kazanmak) teknik olarak çok zordur. Kod yazarken binlerce hata çıkabilir. **RevenueCat**, sizin yerinize Google ile konuşan bir "tercüman"dır. İşleri %90 kolaylaştırır.

**Süreç Şöyle İşler:**
1.  Sen Google Play Console'da ürünü oluşturursun (Örn: "100 Altın").
2.  RevenueCat'e bu ürünün kimliğini (ID) girersin.
3.  Oyunun içinden sadece "RevenueCat, şu paketi sat!" dersin.

### Adım Adım Kurulum

#### Adım 1: Google Play Console Ayarları
1.  Google Play Console hesabınıza girin.
2.  Uygulamanızı seçin ve soldaki menüden **Monetize > Products > In-app products** kısmına gidin.
3.  **Create product** deyin.
4.  **Product ID:** `remove_ads` (Bu ID çok önemli, koddakiyle aynı olmalı).
5.  Fiyatını belirleyin ve kaydedip "Activate" yapın.
6.  Aynı şekilde `coins_small` ve `coins_big` ürünlerini de oluşturun.

#### Adım 2: RevenueCat Hesabı
1.  [RevenueCat.com](https://www.revenuecat.com/) adresine gidip ücretsiz hesap açın.
2.  "Create New Project" deyin (Adına "Popello Match" diyebilirsiniz).
3.  Soldan **Project Settings > Apps** kısmına gelin ve "Android (Play Store)" seçin.
4.  Burada sizden **"Service Account Key JSON"** isteyecek. Bu dosya, RevenueCat'in Google hesabınıza erişip satışları doğrulamasını sağlar. (Bunun nasıl alınacağı RevenueCat sitesinde resimli anlatılır, Google Cloud Console'dan alınır).

#### Adım 3: Ürünleri Eşleştirme (Entitlements)
RevenueCat'in mantığı şudur: Kullanıcı bir "Hak" (Entitlement) satın alır.
1.  RevenueCat panelinde **Entitlements** kısmına gelin.
2.  Yeni bir Entitlement oluşturun. Adı: `pro_access` (Reklamsız sürüm için).
3.  Bu Entitlement'ın içine girip "Attach Product" deyin ve Google Play'de oluşturduğunuz `remove_ads` ürününü seçin.

#### Adım 4: Koda Entegrasyon
Şimdi kod tarafına (`platformService.ts`) geçiyoruz. Aşağıdaki gibi bir eklenti kurmanız gerekir:

```bash
npm install @revenuecat/purchases-capacitor
npx cap sync
```

Sonra `platformService.ts` içindeki `initializeStore` fonksiyonunu şöyle doldurursunuz:

```typescript
import { Purchases } from '@revenuecat/purchases-capacitor';

// ...

initializeStore: async () => {
  // RevenueCat'ten aldığın API Anahtarı (Public API Key)
  await Purchases.configure({ apiKey: "goog_senin_revenuecat_api_keyin" });
},

purchaseItem: async (sku) => {
  try {
     // RevenueCat'e "Bu paketi satın al" diyoruz
     const { customerInfo } = await Purchases.purchasePackage(sku);
     
     // Satın alma başarılı mı kontrol ediyoruz
     if (customerInfo.entitlements.active['pro_access']) {
        return { success: true };
     }
  } catch (e) {
     // Kullanıcı iptal etti vs.
  }
  return { success: false };
}
```

Bu kadar! Karmaşık Google kodları yerine sadece bu basit komutları kullanırsınız.

---

## BÖLÜM 3: Yayınlama (APK Çıktısı Alma)

Uygulamanız bitti, test ettiniz. Şimdi Google Play'e yüklemek için dosya oluşturacağız.

1.  Android Studio'da üst menüden **Build > Generate Signed Bundle / APK** seçin.
2.  **Android App Bundle (AAB)** seçin (Google Play artık APK yerine AAB istiyor).
3.  **Key Store Path** kısmında "Create new" deyin.
    *   Bu sizin dijital imzanızdır. Şifrelerini asla unutmayın! Kaybederseniz uygulamayı bir daha güncelleyemezsiniz.
4.  Şifreleri girin, ileri deyin.
5.  **Release** modunu seçin ve **Create** butonuna basın.
6.  Oluşan `.aab` dosyasını Google Play Console'a yükleyebilirsiniz!

---

## BÖLÜM 4: Google Play Games (Cloud Save) Kurulumu

Verilerin bulutta tutulması ve "Google Play ile Giriş Yap" özelliği için:

1.  **Google Play Console**'da **Play Games Services** kısmına gidin ve bir proje oluşturun.
2.  Terminalde şu eklentiyi kurun:
    ```bash
    npm install @capacitor-community/google-play-games
    npx cap sync
    ```
3.  `android/app/src/main/res/values/strings.xml` dosyasına Play Games App ID'nizi ekleyin.
4.  `platformService.ts` dosyasındaki yorum satırlarını açarak kodları aktif edin.
