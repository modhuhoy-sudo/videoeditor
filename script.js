const container = document.getElementById('videoContainer');

fetch('videos.json')
  .then(res => res.json())
  .then(videos => {
    container.innerHTML = ''; // clear container

    let currentPlayer = null; // এইটা রাখবে চলমান ভিডিও
    let activePlayer = null;

   videos.forEach(video => {
  let videoId = '';
  let embedLink = '';

// YouTube short link
if(video.videoLink.includes('youtu.be/')) {
    videoId = video.videoLink.split('youtu.be/')[1].split('?')[0];
    embedLink = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
}

// YouTube normal link
else if(video.videoLink.includes('youtube.com/watch?v=')) {
    videoId = video.videoLink.split('v=')[1].split('&')[0];
    embedLink = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
}

// Vimeo link
else if(video.videoLink.includes('vimeo.com/')) {
    videoId = video.videoLink.split('vimeo.com/')[1].split('?')[0];
    embedLink = `https://player.vimeo.com/video/${videoId}`;
}

// Skip invalid links
else {
    return;
}

const videoDiv = document.createElement('div');
videoDiv.classList.add('video');

videoDiv.innerHTML = `
    <iframe
        id="video-${videoId}"
        src="${embedLink}"
        title="${video.title}"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
    </iframe>

    <h3>${video.title}</h3>
    <p>${video.description}</p>

    <div class="video-stats">
        <span>⭐ ${video.rating} Rating</span>
        <span class="views"><i class="fas fa-eye"></i> ${video.views} Views</span>
    </div>

    <div class="rating">
        <span data-value="1">&#9733;</span>
        <span data-value="2">&#9733;</span>
        <span data-value="3">&#9733;</span>
        <span data-value="4">&#9733;</span>
        <span data-value="5">&#9733;</span>
    </div>
`;

container.appendChild(videoDiv);

      // --- Star rating logic ---
      const stars = videoDiv.querySelectorAll('.rating span');
      let selectedRating = localStorage.getItem(videoId) || 0;

      stars.forEach(s => {
        if(s.dataset.value <= selectedRating) s.classList.add('selected');
      });

      stars.forEach(star => {
        star.addEventListener('mouseover', () => {
          stars.forEach(s => s.classList.toggle('hover', s.dataset.value <= star.dataset.value));
        });
        star.addEventListener('mouseout', () => {
          stars.forEach(s => s.classList.remove('hover'));
          stars.forEach(s => {
            if(s.dataset.value <= selectedRating) s.classList.add('selected');
          });
        });
        star.addEventListener('click', () => {
          selectedRating = star.dataset.value;
          stars.forEach(s => s.classList.toggle('selected', s.dataset.value <= selectedRating));
          localStorage.setItem(videoId, selectedRating);
        });
      });
    });

    // --- Only one video plays at a time ---
    const iframes = container.querySelectorAll('iframe');
    let players = [];

    // Load YouTube Iframe API
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = function() {
      iframes.forEach((iframe) => {
        const player = new YT.Player(iframe.id, {
          events: {
            'onStateChange': (event) => {
            if(event.data === YT.PlayerState.PLAYING) {

  if(activePlayer && activePlayer !== player){

    if(activePlayer.pauseVideo){
      activePlayer.pauseVideo();
    }

    if(activePlayer.pause){
      activePlayer.pause();
    }

  }

  activePlayer = player;
  currentPlayer = player;
}

document.querySelectorAll('iframe[src*="vimeo.com"]').forEach((iframe) => {

    const player = new Vimeo.Player(iframe);

    player.on('play', () => {

        document.querySelectorAll('iframe[src*="vimeo.com"]').forEach((otherIframe) => {

            if (otherIframe !== iframe) {
                const otherPlayer = new Vimeo.Player(otherIframe);
                otherPlayer.pause();
            }

        });

    });

});
              // stop হলে currentPlayer reset
              if(event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
                if(currentPlayer === player) currentPlayer = null;
              }
            }
          }
        });
        players.push(player);
      });
    }
  })
  .catch(err => console.error(err));

// Explode Text Animation
document.querySelectorAll('.explode-text').forEach(el=>{
    const text = el.textContent;
    el.textContent='';
    text.split('').forEach((char,idx)=>{
        const span = document.createElement('span');
        span.textContent = char===' '?' ':char;
        const x = (Math.random()*200-100)+'px';
        const y = (Math.random()*200-100)+'px';
        const r = (Math.random()*60-30)+'deg';
        span.style.setProperty('--x', x);
        span.style.setProperty('--y', y);
        span.style.setProperty('--r', r);
        span.style.animationDelay = `${0.05*idx}s`;
        el.appendChild(span);
    });
});

// Header Text Explode Animation
const headerH1 = document.querySelector('header h1');
const headerP = document.querySelector('header p');

function explodeText(element) {
    const text = element.textContent;
    element.textContent = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.setProperty('--i', index);
        element.appendChild(span);
    });
}

explodeText(headerH1);
explodeText(headerP);

function splitText(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', index);
            el.appendChild(span);
        });
    });
}

splitText('header h1.explode-text');
splitText('header p.explode-text');
const cursorRing = document.querySelector('.cursor-ring');
const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';

    requestAnimationFrame(animate);
}

animate();

// YouTube iframe-এর উপর mouse গেলে ring লুকাও
youtubeIframes.forEach(iframe => {
    iframe.addEventListener('mouseenter', () => {
        cursorRing.style.opacity = '0';
    });

    iframe.addEventListener('mouseleave', () => {
        cursorRing.style.opacity = '1';
    });
});

