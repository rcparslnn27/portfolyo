// Sayfa yüklendiğinde hafif kaydırma efekti ve kart animasyonları
document.addEventListener('DOMContentLoaded', () => {

  // Kaydırırken kartların ekrana yumuşak gelmesi (Intersection Observer)
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    observer.observe(card);
  });

  // Mouse hareketine göre arka plan ışıklarını hafifçe oynatma
  document.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.blob');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    blobs[0].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    blobs[1].style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
  });

});
