
// SEPET YÖNETİM SİSTEMİ 
// SEPETE ÜRÜN EKLEME FONKSİYONU (Ürün detay sayfalarında )
function sepeteEkle() {
  let h2El = document.querySelector("h2");
  let fiyatEl = document.querySelector(".fiyat");
  let adetEl = document.getElementById("adet");

  if (!h2El || !fiyatEl || !adetEl) return;

  let urunAdi = h2El.innerText;
  let fiyatText = fiyatEl.innerText;
  let fiyat = parseInt(fiyatText.replace("TL", "").trim());
  let adet = parseInt(adetEl.value);

  if (isNaN(adet) || adet < 1) {
    alert("Lütfen geçerli bir ürün adedi giriniz! 🧸");
    return;
  }

  let sepet = JSON.parse(localStorage.getItem("ilmekSepetim")) || [];
  let varOlanUrun = sepet.find((item) => item.ad === urunAdi);

  if (varOlanUrun) {
    varOlanUrun.adet += adet; 
  } else {
    let imgEl = document.querySelector(".urun-gorsel img");
    let urunGorsel = imgEl ? imgEl.src : "";
    sepet.push({
      ad: urunAdi,
      fiyat: fiyat,
      adet: adet,
      gorsel: urunGorsel,
    });
  }

  localStorage.setItem("ilmekSepetim", JSON.stringify(sepet));

  let mesajAlan = document.getElementById("mesaj");
  if (mesajAlan) {
    mesajAlan.innerHTML = adet + " adet ürün sepete eklendi! 👍";
  } else {
    alert("Ürün sepete eklendi! 👍");
  }

  adetEl.value = 1;
}

// SEPETİ EKRANA YAZDIRMA (sepet.html sayfası için)
function sepetiGoster() {
  let sepet = JSON.parse(localStorage.getItem("ilmekSepetim")) || [];
  let sepetBody = document.getElementById("sepetBody");
  let genelToplamAlan = document.getElementById("genelToplam");

  if (!sepetBody || !genelToplamAlan) return;

  sepetBody.innerHTML = "";
  let genelToplam = 0;

  if (sepet.length === 0) {
    
    sepetBody.innerHTML = "<tr><td colspan='6'>Sepetiniz henüz boş 🛒</td></tr>";
    genelToplamAlan.innerText = "Genel Toplam: 0 TL";
    return;
  }

  for (let i = 0; i < sepet.length; i++) {
    let urun = sepet[i];
    let urunToplam = urun.fiyat * urun.adet;
    genelToplam += urunToplam;

    
    sepetBody.innerHTML += `
      <tr>
        <td>
          <img src="${urun.gorsel}">
        </td>
        <td>${urun.ad}</td>
        <td>${urun.adet} Adet</td>
        <td>${urun.fiyat} TL</td>
        <td>${urunToplam} TL</td>
        <td>
          <button class="btn-incele btn-sil" data-index="${i}" style="padding: 4px 8px; width: auto; background-color: #e63946;">❌</button>
        </td>
      </tr>
    `;
  }

  genelToplamAlan.innerText = "Genel Toplam: " + genelToplam + " TL";

  
  let silButonlari = document.querySelectorAll(".btn-sil");
  silButonlari.forEach(buton => {
    buton.addEventListener("click", function() {
      let index = parseInt(this.getAttribute("data-index"));
      urunSil(index);
    });
  });
}

// TEK ÜRÜN SİLME
function urunSil(index) {
  let sepet = JSON.parse(localStorage.getItem("ilmekSepetim")) || [];
  sepet.splice(index, 1);
  localStorage.setItem("ilmekSepetim", JSON.stringify(sepet));
  sepetiGoster();
}

// SEPETİ TAMAMEN SİLME
function sepetiTemizle() {
  if (confirm("Sepetinizdeki tüm ürünleri temizlemek istediğinize emin misiniz?")) {
    localStorage.removeItem("ilmekSepetim");
    sepetiGoster();
  }
}

// ALIŞVERİŞ TAMAMLAMA
function alisverisTamamla() {
  let sepet = JSON.parse(localStorage.getItem("ilmekSepetim")) || [];

  if (sepet.length === 0) {
    alert("Sepet boş olduğu için işlem yapılamaz!");
  } else {
    alert("Teşekkürler! Siparişiniz alındı, ilmek ilmek örülmeye başlanıyor! 🧶🚀");
    localStorage.removeItem("ilmekSepetim");
    sepetiGoster();
  }
}


// 2. İLETİŞİM FORMU

function formuGonder(event) {
  event.preventDefault();
  let isimEl = document.getElementById("adSoyad");
  let isim = isimEl ? isimEl.value : "Ziyaretçi";
  alert("Teşekkürler " + isim + "! Mesajınız başarıyla ekibimize iletildi. 🚀");
  document.getElementById("iletisimFormu").reset();
}


// 3. 🐰 MİNİ OYUN - TAVŞAN VURMACA OYUNU (STABİL ESNA VERSİYONU)

let tavsanInterval = null;
let sayacInterval = null;
let oyunAktif = false;

function oyunuBaslat() {
  if (oyunAktif) return;
  oyunAktif = true;

  let skor = 0;
  let sure = 30;

  const skorEl = document.getElementById("skor");
  const sureEl = document.getElementById("sure");
  const kutular = document.querySelectorAll(".kutu");

  if (!skorEl || !sureEl || kutular.length === 0) return;

  skorEl.innerText = skor;
  sureEl.innerText = sure;

  clearInterval(tavsanInterval);
  clearInterval(sayacInterval);

  kutular.forEach(kutu => {
    kutu.innerText = ""; 
    
    kutu.onclick = () => {
      if (!oyunAktif) return; 

      if (kutu.innerText === "🐰") {
        skor++;
        skorEl.innerText = skor;
        kutu.innerText = ""; 
      }
    };
  });

  tavsanInterval = setInterval(() => {
    kutular.forEach(k => (k.innerText = ""));
    let random = Math.floor(Math.random() * kutular.length);
    kutular[random].innerText = "🐰";
  }, 600);

  sayacInterval = setInterval(() => {
    sure--;
    sureEl.innerText = sure;

    if (sure === 0) {
      clearInterval(tavsanInterval);
      clearInterval(sayacInterval);
      oyunAktif = false;

      kutular.forEach(k => {
        k.innerText = "";
        k.onclick = null; 
      });

      alert("Oyun bitti! Skor: " + skor);
      skor = 0;
      skorEl.innerText = skor;
    }
  }, 1000);
}


//  SAYFA YÜKLENDİĞİNDE ARKA PLANDA ÇALIŞACAK

document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Hamburger Menü Bağlantısı
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", function () {
      navMenu.classList.toggle("aktif");
    });
  }

  // 2. Yukarı Çık Buton Bağlantısı
  const yukariBtn = document.getElementById("yukariCikBtn");
  if (yukariBtn) {
    yukariBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 3. Sepet Sayfası Otomatik Yükleme Kontrolü
  if (document.getElementById("sepetBody")) {
    sepetiGoster();
  }

  // 4. Sepet Temizle Butonu 
  let btnTemizle = document.getElementById("btnSepetiTemizle");
  if (btnTemizle) {
    btnTemizle.addEventListener("click", sepetiTemizle);
  }

  // 5. Alışverişi Tamamla Butonu
  let btnTamamla = document.getElementById("btnAlisverisTamamla");
  if (btnTamamla) {
    btnTamamla.addEventListener("click", alisverisTamamla);
  }

  // 6. Detay Sayfası "Sepete Ekle" Butonu
  let btnSepeteEkle = document.getElementById("btnSepeteEkle");
  if (btnSepeteEkle) {
    btnSepeteEkle.addEventListener("click", sepeteEkle);
  }

  // 7. İletişim Formu Gönderim 
  let iletisimFormu = document.getElementById("iletisimFormu");
  if (iletisimFormu) {
    iletisimFormu.addEventListener("submit", formuGonder);
  }

  // 8. Oyun Sayfası Başlat Butonu
  let btnBaslat = document.getElementById("btnOyunuBaslat");
  if (btnBaslat) {
    btnBaslat.addEventListener("click", oyunuBaslat);
  }
});