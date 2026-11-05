document.addEventListener("DOMContentLoaded", () => {
  const miktarEl = document.getElementById("miktar");
  const kaynakEl = document.getElementById("kaynak");
  const hedefEl = document.getElementById("hedef");
  const degistirBtn = document.getElementById("degistir");
  const sonucDegerEl = document.getElementById("sonucDeger");
  const kurBilgisiEl = document.getElementById("kurBilgisi");
  const durumEl = document.getElementById("durum");

  let kurlar = {};

  async function kurlariGetir(bazPara) {
    durumEl.textContent = "Güncel kurlar çekiliyor...";
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/" + bazPara);
      const data = await res.json();

      if (data.result === "success") {
        kurlar = data.rates;
        durumEl.textContent = "Güncel kurlar yüklendi ✅";
        hesapla();
      } else {
        throw new Error("Veri alınamadı");
      }
    } catch (err) {
      durumEl.textContent = "Hata: Kurlar alınamadı!";
      console.error(err);
    }
  }

  function hesapla() {
    const miktar = parseFloat(miktarEl.value);
    const kaynak = kaynakEl.value;
    const hedef = hedefEl.value;

    if (isNaN(miktar) || miktar <= 0) {
      sonucDegerEl.textContent = "0.00 " + hedef;
      return;
    }

    if (kurlar[hedef]) {
      const oran = kurlar[hedef];
      const sonuc = miktar * oran;

      sonucDegerEl.textContent = sonuc.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + hedef;
      kurBilgisiEl.textContent = `1 ${kaynak} = ${oran.toFixed(4)} ${hedef}`;
    }
  }

  miktarEl.addEventListener("input", hesapla);
  
  kaynakEl.addEventListener("change", () => {
    kurlariGetir(kaynakEl.value);
  });

  hedefEl.addEventListener("change", hesapla);

  degistirBtn.addEventListener("click", () => {
    const temp = kaynakEl.value;
    kaynakEl.value = hedefEl.value;
    hedefEl.value = temp;
    kurlariGetir(kaynakEl.value);
  });

  // Sayfa açıldığında ilk baz para birimine göre kurları çek
  kurlariGetir(kaynakEl.value);
});
