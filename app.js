const NS = 'http://www.w3.org/2000/svg';
const decor = document.getElementById('decor');
const BASE_Y = 438;   // punto donde nacen los tallos
const GROW = 3.2;     // segundos que tardan en crecer los tallos


/* ---------- 4. Botón "Ver Regalo": chispas de corazón + tu contenido ---------- */
const giftBtn = document.getElementById('giftBtn');
const giftContent = document.getElementById('giftContent');
const sparkColors = ['#ff3d6e', '#ff6b9d', '#ff1744', '#ffb3c6', '#ffffff'];
let giftOpened = false;

giftBtn.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;
    startFlowersAnimation();
    calculateHeartsByWidth();
    recalculateHeartByResizeWindow();
    playBgSong();
    escribirConSaltos();

  // Las chispas salen desde el centro del botón
  const r = giftBtn.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

  for (let i = 0; i < 40; i++) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.textContent = '❤';
    spark.style.color = sparkColors[i % sparkColors.length];
    spark.style.fontSize = (12 + Math.random() * 22) + 'px';
    document.body.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;

    gsap.timeline({ onComplete: () => spark.remove() })
      .fromTo(spark,
        { x: cx, y: cy, xPercent: -50, yPercent: -50, scale: 0, opacity: 1, filter: 'blur(0px)' },
        { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist - 40,
          rotation: (Math.random() - .5) * 120, scale: .8 + Math.random() * 1.2,
          duration: 2.5, ease: 'power3.out' })
      // desaparecen difuminándose
      .to(spark, { opacity: 0, filter: 'blur(10px)', duration: 3.5, ease: 'power1.in' }, .5 + Math.random() * .5);
  }

  // El texto inicial se difumina y aparece tu div
  gsap.timeline()
    .to('.content', { autoAlpha: 0, filter: 'blur(10px)', duration: 2.8, delay: .2 })
    .add(() => { giftContent.hidden = false; })
    .fromTo('.gift-box',
      { autoAlpha: 0, y: 20, filter: 'blur(12px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.5, clearProps: 'filter' });
});

/* ---------- 5. Corazones de fondo ---------- */
document.addEventListener("DOMContentLoaded", () => {
});

const recalculateHeartByResizeWindow = () => {
    window.addEventListener("resize", () => {
        calculateHeartsByWidth();
    });
}


const calculateHeartsByWidth = () => {
    const heartsContainer = document.getElementById("heartsContainer");
    heartsContainer.innerHTML = '';
    
    const screenWidth = window.innerWidth;

    const numberOfHearts = Math.floor(screenWidth / 50); 

    for (let i = 0; i < numberOfHearts; i++) {
        const span = document.createElement("span");
        
        const randomSpeed = Math.floor(Math.random() *30) + 10;
        span.style.setProperty('--i', randomSpeed);

        span.style.left = `${Math.random() * 30}%`;

        heartsContainer.appendChild(span);
    }
}

const startFlowersAnimation = () => {
    document.querySelector('svg#svg').style.display = 'block';
    /* ---------- 1. Dibujar hojas, flores, capullos y puntos ---------- */
    // Cada pieza se dibuja con su base en (0,0) para poder escalarla desde ahí.
    function add(shape, cls, x, y, rot, s, fill) {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('transform', `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
        const u = document.createElementNS(NS, 'use');
        u.setAttribute('href', '#' + shape);
        u.setAttribute('class', cls);
        u.dataset.y = y;
        if (fill) u.setAttribute('fill', fill);
        g.appendChild(u);
        decor.appendChild(g);
    }

    const leafColors = ['#1fa24a', '#2ecc71', '#138a3c', '#a6d608'];
    const leaves = [
        [251,430,200,1.3],[207,415,160,1.1],[178,408,-25,.9],[120,390,195,1.1],[89,372,-20,.9],
        [62,330,195,1],[58,310,-30,.8],[60,260,200,1],[77,200,205,.9],[92,175,-30,.8],
        [109,145,200,.8],[126,102,-40,.9],[135,82,215,.8],[138,38,-70,1.3],
        [193,400,-15,.7],[164,368,200,.8],[126,295,195,.8],[138,215,200,.7],[144,150,205,.65],
        [71,360,140,.6],[178,340,-10,.5]
    ];
    leaves.forEach(([x, y, r, s], i) => add('leafShape', 'leaf', x, y, r, s, leafColors[i % 4]));

    [[115,132,25,.85],[57,278,-12,.9]].forEach(([x, y, r, s]) => add('flowerShape', 'flower', x, y, r, s));
    [[150,122,15,.55],[54,364,-40,.5],[203,332,20,.45]].forEach(([x, y, r, s]) => add('budShape', 'bud', x, y, r, s));

    [[86,215,'#fff'],[74,245,'#ff3d5a'],[135,195,'#fff'],[120,310,'#ff3d5a'],[45,340,'#ff3d5a']]
    .forEach(([cx, cy, fill]) => {
        const c = document.createElementNS(NS, 'circle');
        Object.entries({ cx, cy, r: 2.6, fill, class: 'dot' }).forEach(([k, v]) => c.setAttribute(k, v));
        c.dataset.y = cy;
        decor.appendChild(c);
    });

    const left = document.getElementById('half');
    const right = left.cloneNode(true);
    right.removeAttribute('id');
    right.querySelector('#decor').removeAttribute('id');
    right.setAttribute('transform', 'translate(560 0) scale(-1 1)');
    left.after(right);

    const all = sel => [...document.querySelectorAll(sel)];
    const stems = all('.stem'), lv = all('.leaf'), fl = all('.flower'), bd = all('.bud'), dt = all('.dot');

    const heightDelay = el => ((BASE_Y - el.dataset.y) / 400) * GROW * 0.85;

    gsap.set([lv, fl, bd], { scale: 0, transformOrigin: '0px 0px' });
    gsap.set(dt, { scale: 0, transformOrigin: '50% 50%' });
    stems.forEach(p => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
    });

    const tl = gsap.timeline();
    tl.from('.title',    { autoAlpha: 0, y: 20, duration: 1 })
    .from('.subtitle', { autoAlpha: 0, y: 20, duration: 1 }, '-=.5')
    .from('.btn',      { autoAlpha: 0, scale: .6, duration: .8, ease: 'back.out(2)' }, '-=.5')
    .to(stems, { strokeDashoffset: 0, duration: GROW, ease: 'power1.inOut' }, '-=.2')
    .to(lv, { scale: 1, duration: .9, ease: 'back.out(1.7)', delay: (i, el) => heightDelay(el) }, '<')
    .to(bd, { scale: 1, duration: 1,  ease: 'back.out(2)',   delay: (i, el) => heightDelay(el) + .3 }, '<')
    .to(dt, { scale: 1, duration: .6, ease: 'back.out(3)',   delay: (i, el) => heightDelay(el) + .2 }, '<')
    .to(fl, { scale: 1, duration: 1.6, ease: 'elastic.out(1,.6)', delay: (i, el) => heightDelay(el) + .4 }, '<')
    .add(() => {
        gsap.fromTo([fl, bd], { rotation: -3 }, {
        rotation: 3, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
        stagger: { each: .15, from: 'start' }
        });
    });
}

const playBgSong = () => {
    const audioSong = document.querySelector("#bg-song");
    audioSong.play();
}

const elemento = document.getElementById("typed-text");

// El texto puede tener saltos de línea naturales (enter)
const fraseCompleta = `
Eres la persona más maravillosa que he conocido,
y cada día a tu lado descubro una razón nueva
para agradecerle a la vida por coincidir contigo.
Contigo entendí que los lugares favoritos no son un sitio,
sino la persona con la que compartes cada momento;
eres mi refugio favorito, mi paz y
la casualidad más bonita de toda mi vida
`;

let indice = 0;

function escribirConSaltos() {
  if (indice < fraseCompleta.length) {
    // Agrega letra por letra, respetando los \n
    elemento.textContent += fraseCompleta.charAt(indice);
    indice++;
    
    // Puedes ajustar la velocidad (ej. 50ms por carácter)
    setTimeout(escribirConSaltos, 50);
  } else {
    // Opcional: quitar el cursor al terminar de escribir
    elemento.style.borderRight = "none";
  }
}