const API_KEY = "66084a2ed26206677c6eb72f52220236";

const alan = document.getElementById("alan");
const dosyaInput = document.getElementById("dosya");
const onizleme = document.getElementById("onizleme");
const yukleBtn = document.getElementById("yukle");
const durum = document.getElementById("durum");
const sonuc = document.getElementById("sonuc");
const linkInput = document.getElementById("link");
const kopyalaBtn = document.getElementById("kopyala");

let secilenDosya = null;

function dosyaSec(dosya) {
  if (!dosya || !dosya.type.startsWith("image/")) {
    durum.textContent = "Lütfen bir görsel seç.";
    return;
  }
  if (dosya.size > 32 * 1024 * 1024) {
    durum.textContent = "Dosya 32 MB'den büyük olamaz.";
    return;
  }
  secilenDosya = dosya;
  onizleme.src = URL.createObjectURL(dosya);
  onizleme.style.display = "inline-block";
  yukleBtn.disabled = false;
  sonuc.style.display = "none";
  durum.textContent = dosya.name;
}

alan.addEventListener("click", () => dosyaInput.click());
dosyaInput.addEventListener("change", () => dosyaSec(dosyaInput.files[0]));

alan.addEventListener("dragover", (e) => {
  e.preventDefault();
  alan.classList.add("uzerinde");
});
alan.addEventListener("dragleave", () => alan.classList.remove("uzerinde"));
alan.addEventListener("drop", (e) => {
  e.preventDefault();
  alan.classList.remove("uzerinde");
  dosyaSec(e.dataTransfer.files[0]);
});

// Ctrl+V ile yapıştırma
document.addEventListener("paste", (e) => {
  const dosya = [...e.clipboardData.files][0];
  if (dosya) dosyaSec(dosya);
});

yukleBtn.addEventListener("click", async () => {
  if (!secilenDosya) return;

  yukleBtn.disabled = true;
  durum.textContent = "Yükleniyor...";

  const form = new FormData();
  form.append("image", secilenDosya);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: form,
    });
    const veri = await res.json();

    if (!veri.success) throw new Error(veri.error?.message || "Yükleme başarısız");

    linkInput.value = veri.data.url;
    sonuc.style.display = "block";
    durum.textContent = "Hazır! ✅";
  } catch (err) {
    durum.textContent = "Hata: " + err.message;
  } finally {
    yukleBtn.disabled = false;
  }
});

kopyalaBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(linkInput.value);
  kopyalaBtn.textContent = "Kopyalandı ✓";
  setTimeout(() => (kopyalaBtn.textContent = "Kopyala"), 1500);
});
