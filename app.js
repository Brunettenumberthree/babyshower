document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bgVideo");
  const soundBtn = document.getElementById("soundToggle");
  const enterBtn = document.querySelector(".enter");

  // Try to autoplay (muted is most reliable)
  // If autoplay fails for any reason, user can still click play via interaction.
  video?.play?.().catch(() => {});

  // Sound toggle: unmutes + ensures playback
  soundBtn?.addEventListener("click", async () => {
    if (!video) return;

    try {
      video.muted = false;
      video.volume = 0.9; // adjust
      await video.play();
      soundBtn.textContent = "Sound Off";
      soundBtn.dataset.on = "1";
    } catch (e) {
      // If something blocks, keep muted
      video.muted = true;
    }
  });

  // Toggle off if already on
  soundBtn?.addEventListener("click", () => {
    if (!video) return;
    const on = soundBtn.dataset.on === "1";
    if (on) {
      video.muted = true;
      soundBtn.dataset.on = "0";
      soundBtn.textContent = "Sound On";
    }
  });

  // Fade out + redirect
  function fadeOutVideo(ms = 600) {
    return new Promise((resolve) => {
      if (!video) return resolve();

      const start = performance.now();
      const startVol = video.muted ? 0 : (video.volume ?? 1);

      function step(t) {
        const p = Math.min((t - start) / ms, 1);

        // fade visual
        video.style.opacity = String(1 - p);

        // fade sound (if unmuted)
        if (!video.muted) video.volume = Math.max(startVol * (1 - p), 0);

        if (p < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  enterBtn?.addEventListener("click", async () => {
    enterBtn.disabled = true;
    enterBtn.style.opacity = "0.7";

    await fadeOutVideo(650);

    // stop video so sound doesn’t continue
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    }

    window.location.href = "details.html";
  });
});