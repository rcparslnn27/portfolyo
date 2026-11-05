document.addEventListener("DOMContentLoaded", () => {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromCur");
  const toEl = document.getElementById("toCur");
  const swapBtn = document.getElementById("swapBtn");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");
  const errorEl = document.getElementById("errorMsg");
  const statusEl = document.getElementById("status");

  if (!amountEl || !fromEl || !toEl) return;

  const PARA_BIRIMLERI = {
    TRY: "Türk Lirası",
    USD: "ABD Doları",
    EUR: "Euro",
    GBP: "İngiliz Sterlini",
    CHF: "İsviçre Frangı",
    JPY: "Japon Yeni",
    CAD: "Kanada Doları",
    AUD: "Avustralya Doları",
    CNY: "Çin Yuanı",
    RUB: "Rus Rublesi",
    SAR: "Suudi Riyali",
    AED: "BAE Dirhemi",
    AZN: "Azerbaycan Manatı",
    KWD: "Kuveyt Dinarı",
    SEK: "İsveç Kronu",
    NOK: "Norveç Kronu",
    DKK: "Danimarka Kronu",
  };

  let kurlar = null; // 1 USD = x birim
  let guncelleme = "";

  // Seçenekleri doldur
  Object.entries(PARA_BIRIMLERI).forEach(([kod, ad]) => {
    fromEl.add(new Option(`${kod} - ${ad}`, kod));
    toEl.add(new Option(`${kod} - ${ad}`, kod));
  });
  fromEl.value = "USD";
  toEl.value = "TRY";

  // Kaynak 1: open.er-api.com
  async function kaynak1() {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) throw new Error("Kaynak 1 HTTP " + res.status);
    const veri = await res.json();
    if (veri.result !== "success") throw new Error("Kaynak 1 başarısız");
    return {
      rates: veri.rates,
      zaman: new Date(veri.time_last_update_utc),
    };
  }

  // Kaynak 2 (yedek): fawazahmed0 currency-api
  async function kaynak2() {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    );
    if (!res.ok) throw new Error("Kaynak 2 HTTP " + res.status);
    const veri = await res.json();
    const rates = {};
    Object.entries(veri.usd).forEach(([k, v]) => {
      rates[k.toUpperCase()] = v;
    });
    return { rates, zaman: new Date(veri.date) };
  }

  async function kurlariYukle() {
    errorEl.textContent = "";
    statusEl.textContent = "Kurlar yükleniyor...";

    let sonuc = null;
    try {
      sonuc = await kaynak1();
    } catch (e1) {
      console.warn(e1);
      try {
        sonuc = await kaynak2();
      } catch (e2) {
        console.error(e2);
      }
    }

    if (!sonuc) {
      errorEl.textContent = "Kurlar alınamadı. İnternet bağlantını kontrol edip sayfayı yenile.";
      statusEl.textContent = "";
      return;
    }

    kurlar = sonuc.rates;
    guncelleme = sonuc.zaman.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    statusEl.textContent = "Kur verisi son güncelleme: " + guncelleme;
    hesapla();
  }

  function formatSayi(n, maxFrac) {
    return n.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: maxFrac,
    });
  }

  function hesapla() {
    if (!kurlar) return;

    const miktar = parseFloat(amountEl.value);
    const from = fromEl.value;
    const to = toEl.value;

    if (!kurlar[from] || !kurlar[to]) {
      resultMain.textContent = "-";
      resultSub.textContent = "Bu para biriminin kuru bulunamadı.";
      return;
    }

    // 1 birim from kaç birim to
    const oran = kurlar[to] / kurlar[from];

    resultSub.textContent = `1 ${from} = ${formatSayi(oran, 4)} ${to}`;

    if (isNaN(miktar) || miktar < 0) {
      resultMain.textContent = "-";
      return;
    }

    resultMain.textContent = `${formatSayi(miktar * oran, 4)} ${to}`;
  }

  amountEl.addEventListener("input", hesapla);
  fromEl.addEventListener("change", hesapla);
  toEl.addEventListener("change", hesapla);

  swapBtn.addEventListener("click", () => {
    const gecici = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = gecici;
    hesapla();
  });

  kurlariYukle();
});
