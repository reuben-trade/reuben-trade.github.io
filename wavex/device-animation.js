(() => {
  const video = document.querySelector('#device-animation');
  const button = document.querySelector('.animation-toggle');
  if (!video || !button) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reducedMotion.matches;
  let visible = true;
  let failed = false;
  video.muted = true;
  video.autoplay = !userPaused;
  button.hidden = false;

  function updateLabel() {
    button.textContent = video.paused ? 'Play animation' : 'Pause animation';
  }

  async function play() {
    if (failed || userPaused || !visible || document.hidden) return;
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    try {
      await video.play();
    } catch {
      // Autoplay can be blocked by browser or power-saving settings.
      // The original poster and play button stay available.
    }
    updateLabel();
  }

  button.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) video.pause();
    else play();
  });
  video.addEventListener('play', updateLabel);
  video.addEventListener('pause', updateLabel);
  video.addEventListener('error', () => {
    failed = true;
    button.hidden = true;
    video.removeAttribute('src');
    video.load();
  });
  reducedMotion.addEventListener('change', event => {
    userPaused = event.matches;
    video.autoplay = !userPaused;
    if (userPaused) video.pause();
    else play();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else play();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) play();
      else video.pause();
    }, {threshold: 0.05}).observe(video);
  } else {
    play();
  }
  updateLabel();
})();
