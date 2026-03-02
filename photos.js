const WORKER_URL = "https://baby-shower-gallery.ximena-eli-babyshower.workers.dev"; 

let swiper;

async function loadGallery() {
  const status = document.getElementById("galleryStatus");
  const slides = document.getElementById("photoSlides");

  try {
    status.textContent = "Fetching latest photos…";

    const res = await fetch(WORKER_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Gallery fetch failed");

    const data = await res.json();
    const images = data.images || [];

    // newest-first is already handled by your Worker sorting
    slides.innerHTML = images.map(img => `
      <div class="swiper-slide">
        <img src="${img.url}" alt="${img.name}">
      </div>
    `).join("");

    if (!swiper) {
      swiper = new Swiper(".photoSwiper", {
        effect: "fade",
        fadeEffect: { crossFade: true },
        loop: images.length > 1,
        speed: 650,
        autoplay: {
          delay: 4200,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
    } else {
      // Update existing swiper without resetting to first slide
      swiper.update();
    }

    status.textContent = images.length
      ? `Showing ${images.length} photos (auto-refresh every 30 seconds).`
      : "No photos yet — be the first to upload!";
  } catch (e) {
    console.error(e);
    if (status) status.textContent = "Couldn’t load gallery right now.";
  }
}

// initial load
loadGallery();

// auto refresh every 30 seconds
setInterval(loadGallery, 30_000);