// ---------------------------------------------------------------
  // LYRICS — timing skeleton generated from your uploaded audio
  // (energy/onset detection on The_1975_-_About_You__Official_.mp3)
  //
  // IMPORTANT: this is APPROXIMATE. Onset detection reacts to energy
  // rises in the mix generally, not vocals specifically, so a few
  // markers may land on instrumental hits rather than sung lines.
  // Two regions to double check by ear:
  //   - ~148s -> ~178s (30s gap, likely an instrumental break before
  //     the bridge — confirm nothing was missed there)
  //   - ~218s -> ~315s (a ~97s gap right before the final marker —
  //     this almost certainly needs to be split into several more
  //     lines for the last chorus repeats)
  //
  // Fill in `text` yourself with the real lyric line for each slot.
  // Add/remove/retime entries as needed once you listen through —
  // treat this as a first draft, not a final sync.
  // ---------------------------------------------------------------
  const LYRICS = [
    { time: 45,  text: "I know a place" },
    { time: 55,  text: "It's somewhere I go when I need to remember your face" },
    { time: 64.5,  text: "We get married in our heads" },
    { time: 75,  text: "Something to do while we try to recall how we met" },
    { time: 84.8,  text: "Do you think I have forgotten?" },
    { time: 89,  text: "Do you think I have forgotten?" },
    { time: 94,  text: "Do you think I have forgotten?" },
    { time: 98.8,  text: "About You?" },
    { time: 104.5,  text: "You and I (Don't let go)" },
    { time: 109,  text: "We're alive (Don't let go)" },
    { time: 114.8,  text: "With nothing to do, I could lay and just look in your eyes" },
    { time: 125,  text: "Wait (Don't let go)" },
    { time: 129,  text: "And pretend (Don't let go, oh)" },
    { time: 135,  text: "Hold on and hope that we'll find our way back in the end (In the end)" },
    
    { time: 144.8,  text: "Do you think I havе forgotten?" },
    { time: 149,  text: "Do you think I havе forgotten?" },
    { time: 154,  text: "Do you think I havе forgotten?" },
    { time: 159,  text: "About You?" },

    { time: 164.8,  text: "Do you think I havе forgotten?" },
    { time: 169,  text: "Do you think I havе forgotten?" },
    { time: 174,  text: "Do you think I havе forgotten?" },
    { time: 179,  text: "About You?" },


    { time: 185,  text: "And there was something about you that now I can't remember" },
    { time: 189,  text: "It's the same damn thing that made my heart surrender" },
    { time: 194,  text: "And I'll miss you on a train, I'll miss you in the mornin'" },
    { time: 199.8,  text: "I never know what to think about" },
    { time: 203.8,  text: "I think about you (Don't let go)" },
    { time: 209,  text: "About you (Don't let go)" },

    { time: 214,  text: "Do you think I have forgotten?" },
    { time: 219,  text: "About You? (Don't let go, oh)" },
    { time: 224,  text: "About You?" },
    { time: 229,  text: "About You?" },
    { time: 234,  text: "Do you think I have forgotten?" },
    { time: 239,  text: "About You? (Don't let go oh)" },


    
    
    
    
    
  ];
 
  const audio        = document.getElementById('audio');
  const playBtn       = document.getElementById('play-btn');
  const playIcon      = document.getElementById('play-icon');
  const scrubber       = document.getElementById('scrubber');
  const timeCurrent    = document.getElementById('time-current');
  const timeTotal      = document.getElementById('time-total');
  const loadBtn        = document.getElementById('load-btn');
  const fileInput       = document.getElementById('file-input');
  const volumeBtn       = document.getElementById('volume-btn');
  const volumeSlider    = document.getElementById('volume-slider');
  const lyricStack      = document.getElementById('lyric-stack');
  const emptyState      = document.getElementById('empty-state');
  const rail            = document.querySelector('.rail');
  const railFill        = document.getElementById('rail-fill');
  const bgImage         = document.getElementById('bg-image');
 
  const ICON_PLAY  = '<path d="M8 5v14l11-7z"/>';
  const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
 
  let lineEls = [];
  let tickEls = [];
  let currentIndex = -1;
  let rafId = null;
 
  function fmtTime(sec){
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
 
  function buildLyricDOM(){
    lyricStack.innerHTML = '';
    lineEls = LYRICS.map((l, i) => {
      const el = document.createElement('div');
      el.className = 'lyric-line';
      el.textContent = l.text;
      el.dataset.pos = 'hidden';
      lyricStack.appendChild(el);
      return el;
    });
  }
 
  function buildTicks(){
    tickEls.forEach(t => t.remove());
    tickEls = [];
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    LYRICS.forEach(l => {
      const t = document.createElement('div');
      t.className = 'rail-tick';
      const pct = Math.min(100, (l.time / audio.duration) * 100);
      t.style.top = `${8 + (pct * 0.84)}%`;
      rail.appendChild(t);
      tickEls.push(t);
    });
  }
 
  function updateLyrics(currentTime){
    let idx = -1;
    for (let i = 0; i < LYRICS.length; i++){
      if (currentTime >= LYRICS[i].time) idx = i;
      else break;
    }
    if (idx === currentIndex) {
      // still update relative positions in case of seek without index change
    }
    currentIndex = idx;
 
    lineEls.forEach((el, i) => {
      const rel = i - currentIndex;
      if (rel >= -2 && rel <= 2){
        const wasHidden = el.dataset.pos === 'hidden';
        el.dataset.pos = String(rel);
        if (rel === 0 && wasHidden){
          el.classList.remove('pop');
          void el.offsetWidth; // reflow to restart animation
          el.classList.add('pop');
        }
      } else {
        el.dataset.pos = 'hidden';
      }
    });
 
    tickEls.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
  }
 
  function loop(){
    if (!audio.paused && !audio.ended){
      updateLyrics(audio.currentTime);
      scrubber.value = audio.currentTime;
      timeCurrent.textContent = fmtTime(audio.currentTime);
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      railFill.style.height = `${Math.min(100, pct * 0.84)}%`;
      rafId = requestAnimationFrame(loop);
    }
  }
 
  function play(){
    audio.play();
    playIcon.innerHTML = ICON_PAUSE;
    playBtn.setAttribute('aria-label', 'Pause');
    bgImage.classList.add('visible');
    rafId = requestAnimationFrame(loop);
  }
 
  function pause(){
    audio.pause();
    playIcon.innerHTML = ICON_PLAY;
    playBtn.setAttribute('aria-label', 'Play');
    if (rafId) cancelAnimationFrame(rafId);
  }
 
  playBtn.addEventListener('click', () => {
    if (audio.paused) play(); else pause();
  });
 
  scrubber.addEventListener('input', () => {
    audio.currentTime = scrubber.value;
    updateLyrics(audio.currentTime);
    timeCurrent.textContent = fmtTime(audio.currentTime);
  });
 
  audio.addEventListener('ended', () => {
    pause();
  });
 
  audio.addEventListener('loadedmetadata', () => {
    scrubber.max = audio.duration;
    timeTotal.textContent = fmtTime(audio.duration);
    buildTicks();
    playBtn.disabled = false;
    scrubber.disabled = false;
    updateLyrics(0);
  });
 
  loadBtn.addEventListener('click', () => fileInput.click());
 
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    audio.src = url;
    emptyState.style.display = 'none';
    buildLyricDOM();
    loadBtn.textContent = file.name.length > 22
      ? file.name.slice(0, 19) + '…'
      : file.name;
  });
 
  // ---------------------------------------------------------------
  // Volume
  // ---------------------------------------------------------------
  let lastVolume = 1;
  audio.volume = 1;
 
  function setVolumeUI(vol){
    volumeSlider.value = vol;
    const isMuted = vol === 0;
    volumeBtn.classList.toggle('muted', isMuted);
    volumeBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
  }
 
  volumeSlider.addEventListener('input', () => {
    const vol = parseFloat(volumeSlider.value);
    audio.volume = vol;
    if (vol > 0) lastVolume = vol;
    setVolumeUI(vol);
  });
 
  volumeBtn.addEventListener('click', () => {
    if (audio.volume > 0){
      lastVolume = audio.volume;
      audio.volume = 0;
    } else {
      audio.volume = lastVolume || 1;
    }
    setVolumeUI(audio.volume);
  });
 
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== fileInput && audio.src){
      e.preventDefault();
      if (audio.paused) play(); else pause();
    }
  });