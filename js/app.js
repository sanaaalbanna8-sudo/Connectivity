const $app = document.getElementById("app");

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function findTerm(key) {
  return GLOSSARY.find((x) => x.en === key) || GLOSSARY.find((x) => x.en.startsWith(key));
}

function speakBtn(text) {
  return `<button type="button" class="speak-btn" data-speak="${esc(text)}" title="استمع للنطق" aria-label="استمع: ${esc(text)}">🔊</button>`;
}

function en(key) {
  const g = findTerm(key);
  if (!g) return `<span class="tw-en ltr"><b>${esc(key)}</b></span>`;
  return `<span class="tw-en ltr">${speakBtn(g.say || g.en)}<b>${esc(g.en)}</b></span>`;
}

function speakEnglish(text) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.88;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find((x) => /^en(-|_)/i.test(x.lang) && /GB|UK|British/i.test(x.name + x.lang))
    || voices.find((x) => /^en(-|_)/i.test(x.lang));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function vocab(keys) {
  const chips = keys.map((k) => {
    const g = findTerm(k);
    if (!g) return "";
    return `<span class="vocab-chip"><span class="tw-en ltr">${speakBtn(g.say)}<span class="vocab-en">${esc(g.en)}</span></span><span class="vocab-ar">${esc(g.ar.split(":")[0])}</span></span>`;
  }).join("");
  return `<aside class="vocab-strip"><div class="vocab-chips">${chips}</div></aside>`;
}

function graphic(svg, cap) {
  return `<figure class="graphic">${svg}<figcaption>${cap}</figcaption></figure>`;
}

function photo(src, cap) {
  return `<figure class="photo"><img src="${esc(src)}" alt="${esc(cap)}" /><figcaption>${esc(cap)}</figcaption></figure>`;
}

function hero(src, tag, title, text) {
  return `<figure class="hero-art"><img src="${esc(src)}" alt="${esc(title)}" /><div class="hero-art-overlay"><span class="tag">${esc(tag)}</span><h2>${esc(title)}</h2><p>${esc(text)}</p></div></figure>`;
}

function officer(html) {
  return `<aside class="officer"><p class="who">قرار موظف تكنولوجيا المعلومات</p>${html}</aside>`;
}

function quizBlock(item, i) {
  return `<article class="quiz-card" data-correct="${item.correct}">
    <strong>${i + 1}. ${esc(item.q)}</strong>
    <div class="quiz-opts">${item.opts.map((o) => `<button type="button">${esc(o)}</button>`).join("")}</div>
    <div class="feedback">${esc(item.why)}</div>
  </article>`;
}

function pathIndex(id) {
  return PATH.findIndex((p) => p.id === id);
}

function groupLabel(g) {
  return {
    connect: "الاتصال",
    networks: "الشبكات",
    tx: "نقل البيانات",
    online: "الأنظمة عبر الإنترنت",
    emerging: "التقنيات الناشئة",
  }[g] || "";
}

function lessonChrome(id) {
  const i = pathIndex(id);
  if (i < 0) return "";
  return `
    <div class="lesson-bar">
      <span class="meta">${esc(groupLabel(PATH[i].group))} · ${i + 1} / ${PATH.length}</span>
      ${i > 0 ? `<a class="ghost" href="#/${PATH[i - 1].id}">→ السابق</a>` : ""}
      ${i < PATH.length - 1 ? `<a href="#/${PATH[i + 1].id}">التالي ←</a>` : `<a href="#/decide">قرار ←</a>`}
    </div>`;
}

function pager(id) {
  const i = pathIndex(id);
  if (i < 0) return "";
  const prev = PATH[i - 1];
  const next = PATH[i + 1];
  return `<nav class="pager">
    ${prev ? `<a class="ghost" href="#/${prev.id}">→ ${esc(prev.short)}</a>` : `<span></span>`}
    ${next ? `<a href="#/${next.id}">${esc(next.short)} ←</a>` : `<a href="#/decide">قرار ←</a>`}
  </nav>`;
}

function groupNav(group, active) {
  const list = GROUPS[group] || [];
  return `<nav class="subnav">${list.map((t) =>
    `<a class="${t.id === active ? "active" : ""}" href="#/${t.id}">${esc(t.short)}</a>`
  ).join("")}</nav>`;
}

function reveal(q, a) {
  return `<div class="discuss"><strong>${q}</strong><div class="reveal"><button type="button" data-reveal>أظهر التفكير</button><div class="answer">${a}</div></div></div>`;
}

const SVG = {
  connect: `<svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="540" y="40" width="160" height="90" rx="14" fill="#1c2a44"/><text x="620" y="80" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">نظام التشغيل</text><text x="620" y="104" text-anchor="middle" fill="#c9d3e0" font-size="12" font-family="Cairo,sans-serif">OS</text>
    <rect x="280" y="40" width="160" height="90" rx="14" fill="#0f7a74"/><text x="360" y="80" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">التطبيقات</text><text x="360" y="104" text-anchor="middle" fill="#e8faf7" font-size="12" font-family="Cairo,sans-serif">Apps</text>
    <rect x="20" y="40" width="160" height="90" rx="14" fill="#c43c28"/><text x="100" y="80" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">الأنظمة</text><text x="100" y="104" text-anchor="middle" fill="#ffe8e4" font-size="12" font-family="Cairo,sans-serif">Systems</text>
    <path d="M180 85h100M440 85h100" stroke="#c49a2a" stroke-width="6"/>
  </svg>`,
  wired: `<svg viewBox="0 0 720 180" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="16" y="28" width="130" height="124" rx="14" fill="#0f7a74"/><text x="81" y="78" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">USB</text><text x="81" y="104" text-anchor="middle" fill="#e8faf7" font-size="11" font-family="Cairo,sans-serif">127 جهازًا</text>
    <rect x="156" y="28" width="130" height="124" rx="14" fill="#1c2a44"/><text x="221" y="78" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">Ethernet</text><text x="221" y="104" text-anchor="middle" fill="#c9d3e0" font-size="11" font-family="Cairo,sans-serif">شبكة LAN</text>
    <rect x="296" y="28" width="130" height="124" rx="14" fill="#c43c28"/><text x="361" y="78" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">Fibre</text><text x="361" y="104" text-anchor="middle" fill="#ffe8e4" font-size="11" font-family="Cairo,sans-serif">ضوء · مسافة</text>
    <rect x="436" y="28" width="130" height="124" rx="14" fill="#c49a2a"/><text x="501" y="78" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">HDMI</text><text x="501" y="104" text-anchor="middle" fill="#fff" font-size="11" font-family="Cairo,sans-serif">صوت + صورة</text>
    <rect x="576" y="28" width="128" height="124" rx="14" fill="#5c6574"/><text x="640" y="78" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">DVI</text><text x="640" y="104" text-anchor="middle" fill="#e8edf3" font-size="11" font-family="Cairo,sans-serif">شاشة رقمية</text>
  </svg>`,
  wireless: `<svg viewBox="0 0 720 180" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="16" y="28" width="130" height="124" rx="14" fill="#0f7a74"/><text x="81" y="78" text-anchor="middle" fill="#fff" font-size="14" font-family="Cairo,sans-serif">Bluetooth</text><text x="81" y="104" text-anchor="middle" fill="#e8faf7" font-size="11" font-family="Cairo,sans-serif">≈ 100 م</text>
    <rect x="156" y="28" width="130" height="124" rx="14" fill="#1c2a44"/><text x="221" y="78" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">Wi-Fi</text><text x="221" y="104" text-anchor="middle" fill="#c9d3e0" font-size="11" font-family="Cairo,sans-serif">شبكة / إنترنت</text>
    <rect x="296" y="28" width="130" height="124" rx="14" fill="#c43c28"/><text x="361" y="78" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">NFC</text><text x="361" y="104" text-anchor="middle" fill="#ffe8e4" font-size="11" font-family="Cairo,sans-serif">قريب جدًا</text>
    <rect x="436" y="28" width="130" height="124" rx="14" fill="#c49a2a"/><text x="501" y="78" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">IR</text><text x="501" y="104" text-anchor="middle" fill="#fff" font-size="11" font-family="Cairo,sans-serif">ريموت</text>
    <rect x="576" y="28" width="128" height="124" rx="14" fill="#5c6574"/><text x="640" y="78" text-anchor="middle" fill="#fff" font-size="14" font-family="Cairo,sans-serif">Cellular</text><text x="640" y="104" text-anchor="middle" fill="#e8edf3" font-size="11" font-family="Cairo,sans-serif">3G/4G/5G</text>
  </svg>`,
  nets: `<svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg" role="img">
    <circle cx="90" cy="95" r="58" fill="#0f7a74"/><text x="90" y="90" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">PAN</text><text x="90" y="112" text-anchor="middle" fill="#e8faf7" font-size="11" font-family="Cairo,sans-serif">شخص</text>
    <circle cx="230" cy="95" r="70" fill="#1c2a44"/><text x="230" y="90" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">LAN</text><text x="230" y="112" text-anchor="middle" fill="#c9d3e0" font-size="11" font-family="Cairo,sans-serif">مبنى</text>
    <circle cx="400" cy="95" r="84" fill="#c43c28"/><text x="400" y="90" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">WAN</text><text x="400" y="112" text-anchor="middle" fill="#ffe8e4" font-size="11" font-family="Cairo,sans-serif">مدن / عالم</text>
    <rect x="520" y="40" width="180" height="110" rx="16" fill="#c49a2a"/><text x="610" y="88" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">Internet</text><text x="610" y="112" text-anchor="middle" fill="#fff" font-size="11" font-family="Cairo,sans-serif">مجموعة WAN</text>
  </svg>`,
  parts: `<svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="20" y="35" width="150" height="100" rx="14" fill="#5c6574"/><text x="95" y="92" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">الإنترنت</text>
    <rect x="200" y="28" width="150" height="114" rx="14" fill="#0f7a74"/><text x="275" y="80" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">Router</text><text x="275" y="104" text-anchor="middle" fill="#e8faf7" font-size="12" font-family="Cairo,sans-serif">توجيه</text>
    <rect x="380" y="28" width="150" height="114" rx="14" fill="#1c2a44"/><text x="455" y="80" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">Switch</text><text x="455" y="104" text-anchor="middle" fill="#c9d3e0" font-size="12" font-family="Cairo,sans-serif">أجهزة سلكية</text>
    <rect x="560" y="28" width="140" height="114" rx="14" fill="#c43c28"/><text x="630" y="80" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">WAP</text><text x="630" y="104" text-anchor="middle" fill="#ffe8e4" font-size="12" font-family="Cairo,sans-serif">أجهزة لاسلكية</text>
  </svg>`,
  mail: `<svg viewBox="0 0 720 160" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="20" y="35" width="150" height="90" rx="14" fill="#1c2a44"/><text x="95" y="75" text-anchor="middle" fill="#fff" font-size="14" font-family="Cairo,sans-serif">أنت</text><text x="95" y="98" text-anchor="middle" fill="#c9d3e0" font-size="12" font-family="Cairo,sans-serif">عميل البريد</text>
    <rect x="210" y="20" width="140" height="55" rx="12" fill="#0f7a74"/><text x="280" y="54" text-anchor="middle" fill="#fff" font-size="14" font-family="Cairo,sans-serif">SMTP إرسال</text>
    <rect x="210" y="88" width="140" height="55" rx="12" fill="#c49a2a"/><text x="280" y="122" text-anchor="middle" fill="#fff" font-size="13" font-family="Cairo,sans-serif">POP3 / IMAP4</text>
    <rect x="390" y="35" width="150" height="90" rx="14" fill="#c43c28"/><text x="465" y="75" text-anchor="middle" fill="#fff" font-size="14" font-family="Cairo,sans-serif">الخادم</text><text x="465" y="98" text-anchor="middle" fill="#ffe8e4" font-size="12" font-family="Cairo,sans-serif">Mail server</text>
    <rect x="570" y="35" width="130" height="90" rx="14" fill="#5c6574"/><text x="635" y="88" text-anchor="middle" fill="#fff" font-size="14" font-family="Cairo,sans-serif">المستلم</text>
  </svg>`,
  https: `<svg viewBox="0 0 720 150" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="30" y="30" width="280" height="90" rx="14" fill="#b1332c"/><text x="170" y="72" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">http://</text><text x="170" y="96" text-anchor="middle" fill="#ffe8e4" font-size="13" font-family="Cairo,sans-serif">نص واضح · خطر</text>
    <rect x="410" y="30" width="280" height="90" rx="14" fill="#1f7a45"/><text x="550" y="72" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">https:// 🔒</text><text x="550" y="96" text-anchor="middle" fill="#e8faf7" font-size="13" font-family="Cairo,sans-serif">SSL/TLS · آمن</text>
  </svg>`,
  compress: `<svg viewBox="0 0 720 160" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="20" y="28" width="330" height="108" rx="14" fill="#c43c28"/><text x="185" y="72" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">Lossy بفاقد</text><text x="185" y="100" text-anchor="middle" fill="#ffe8e4" font-size="13" font-family="Cairo,sans-serif">JPEG · MP3 · MP4</text>
    <rect x="370" y="28" width="330" height="108" rx="14" fill="#0f7a74"/><text x="535" y="72" text-anchor="middle" fill="#fff" font-size="18" font-family="Cairo,sans-serif">Lossless بلا فاقد</text><text x="535" y="100" text-anchor="middle" fill="#e8faf7" font-size="13" font-family="Cairo,sans-serif">PNG · GIF · ZIP · FLAC</text>
  </svg>`,
  vpn: `<svg viewBox="0 0 720 150" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="20" y="40" width="160" height="70" rx="14" fill="#1c2a44"/><text x="100" y="82" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">منزل / سفر</text>
    <rect x="220" y="28" width="280" height="94" rx="16" fill="#0f7a74"/><text x="360" y="70" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">نفق VPN مشفّر</text><text x="360" y="94" text-anchor="middle" fill="#e8faf7" font-size="12" font-family="Cairo,sans-serif">عبر الإنترنت العام</text>
    <rect x="540" y="40" width="160" height="70" rx="14" fill="#c43c28"/><text x="620" y="82" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">LAN المكتب</text>
  </svg>`,
};

function renderHome() {
  $app.innerHTML = `
    ${hero("img/hero-it-officer.png", "البنية الأساسية", "اختيار نوع الاتصال", "USB أو إيثرنت أو ألياف أو واي فاي أو VPN — حسب احتياج الشخص أو المؤسسة.")}
    <h1>إمكانية الاتصال والشبكات والأنظمة عبر الإنترنت</h1>
    <article class="scene">
      <p>لا توجد تقنية «الأفضل دائمًا». الأنسب ما يلبّي السرعة والأمان والتكلفة والتنقّل والتوافق في الموقف نفسه.</p>
    </article>
    <div class="path">
      <a href="#/connect"><span class="num">1</span><strong>الاتصال</strong><span class="path-mean">سلكي · لاسلكي · أثر على الأداء</span><small>USB · Ethernet · Fibre · HDMI · Wi-Fi · NFC</small></a>
      <a href="#/networks"><span class="num">2</span><strong>الشبكات</strong><span class="path-mean">أنواع · اختيار · مكونات</span><small>PAN · LAN · WAN · VPN · Internet</small></a>
      <a href="#/protocols"><span class="num">3</span><strong>نقل البيانات</strong><span class="path-mean">بروتوكولات · أمن · ضغط</span><small>HTTP · HTTPS · TCP/IP · Lossy</small></a>
      <a href="#/online"><span class="num">4</span><strong>الأنظمة عبر الإنترنت</strong><span class="path-mean">سحابة · عمل عن بُعد</span><small>Cloud · VPN · Remote desktop</small></a>
      <a href="#/emerging"><span class="num">5</span><strong>التقنيات الناشئة</strong><span class="path-mean">أجهزة · شبكات · نمذجة</span><small>5G · IoT · AR · VR · ML</small></a>
      <a href="#/decide"><span class="num">6</span><strong>قرار البنية التحتية</strong><span class="path-mean">مخزن · مستشفى · استوديو · شرطة</span><small>PAN · LAN · WAN · VPN</small></a>
    </div>
    ${vocab(["connectivity", "bandwidth", "LAN", "VPN", "cloud computing"])}
  `;
}

function renderConnect() {
  $app.innerHTML = `
    ${lessonChrome("connect")}
    ${groupNav("connect", "connect")}
    <p class="kicker">إمكانية الاتصال · Connectivity</p>
    <h1>ما هي إمكانية الاتصال؟</h1>
    <div class="def">
      <strong>${en("connectivity")} Connectivity</strong>
      القدرة على معالجة البيانات الرقمية من خلال توصيل نظام التشغيل بالتطبيقات والأنظمة ومع بعضها البعض.
    </div>
    ${graphic(SVG.connect, "الاتصال ليس «كابلًا» فقط: نظام التشغيل ↔ التطبيقات ↔ الأنظمة الأخرى.")}
    <p class="lead">قديمًا كانت الكابلات على المكاتب والأرض تربط الحواسيب والطابعات والماسحات ب<b>الخادم</b>. اليوم نتوقع أن يكتشف الهاتف ${en("Wi-Fi")} تلقائيًا، وإن لزم نختار الشبكة وندخل كود الأمان.</p>
    ${photo("img/wireless-devices.png", "أجهزة اليوم تتزامن لاسلكيًا: هاتف، لابتوب، سماعات، موجّه واي فاي.")}
    <div class="grid grid-2">
      <article class="panel">
        <h3>لماذا نحتاج الاتصال داخل النظام؟</h3>
        <p>الملحقات الطرفية ${en("peripheral")} تؤدي الإدخال والإخراج: طابعة، لوحة مفاتيح، فأرة، كاميرا ويب، مكبرات، شاشات.</p>
      </article>
      <article class="term">
        <strong>${en("bandwidth")} النطاق الترددي</strong>
        المقدار المتاح من قدرة نقل البيانات. كلّما زاد، أمكن تنزيل/رفع كمية أكبر في الزمن نفسه.
      </article>
    </div>
    <div class="scene">
      <strong>مثال من حياتك</strong>
      <p>تملك هاتفًا ولابتوبًا وتلفزيونًا ذكيًا، لكن الملفات والصور وجهات الاتصال في مكان واحد. عادةً يحقق ذلك ${en("cloud storage")} بالمزامنة ${en("sync")}.</p>
      <p class="punch">الاتصال الجيد = أجهزة متعددة، بيانات واحدة، وصول من أي مكان متصل.</p>
    </div>
    ${officer("<p>قبل أن تشتري «أسرع إنترنت»، اسأل: ما الأجهزة التي يجب أن تتكلم مع بعضها؟ طرفيات على المكتب؟ موظفون يتحركون؟ بيانات حساسة؟</p>")}
    ${vocab(["connectivity", "bandwidth", "wired", "wireless", "peripheral"])}
    ${pager("connect")}
  `;
}

function renderWired() {
  $app.innerHTML = `
    ${lessonChrome("wired")}
    ${groupNav("connect", "wired")}
    <p class="kicker">طرق سلكية · Wired</p>
    <h1>كيف نربط الأجهزة بكابل؟</h1>
    <p class="lead">${en("wired")} اتصال دائم بمكوّنات النظام عبر كابلات مخصصة. المباني الحديثة تُصمَّم أحيانًا والكابلات مدمجة في الجدران للحواسيب والخوادم غير المتنقلة.</p>
    ${photo("img/wired-cables.png", "من اليسار لليمين في المشهد الحقيقي: USB، HDMI، إيثرنت، وألياف تضيء بالضوء.")}
    ${graphic(SVG.wired, "USB · Ethernet · Fibre · HDMI · DVI")}
    <div class="grid grid-2">
      <article class="abbr"><div class="en ltr">${speakBtn("U S B")}<span>USB</span></div><div class="full">Universal Serial Bus</div><div class="ar">الأكثر انتشارًا اليوم. ثنائي الاتجاه (يرسل ويستقبل). منفذ واحد حتى <b>127</b> جهازًا. ميزة كبرى: قد يزوّد الطرفيات <b>بالطاقة</b>.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("Ethernet")}<span>Ethernet</span></div><div class="full">إيثرنت</div><div class="ar">نظام لتوصيل عدد من الحواسيب لتشكيل ${en("LAN")} شبكة منطقة محلية. أساس الشبكات السلكية في الشركات.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("fibre optic")}<span>Fibre optic</span></div><div class="full">ألياف ضوئية</div><div class="ar">خيوط زجاج سيليكا شفافة تنقل البيانات <b>بالضوء</b>. نطاق أعلى ومسافات أطول من النحاس، لذلك حلّت محله بسرعة في العمود الفقري.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("H D M I")}<span>HDMI</span></div><div class="full">High-Definition Multimedia Interface</div><div class="ar">موصل رقمي رئيس للحاسوب وأنظمة الترفيه: صورة وصوت معًا.</div></article>
    </div>
    <article class="abbr"><div class="en ltr">${speakBtn("D V I")}<span>DVI</span></div><div class="full">Digital Visual Interface</div><div class="ar">موصل رقمي للشاشات. HDMI و DVI هما الموصلان الرقميان الرئيسان للحاسوب وأنظمة الترفيه.</div></article>
    <div class="compare">
      <div class="yes"><strong>لماذا ما زالت الشركات تحب السلكي؟</strong><p>سرعة أفضل، موثوقية أعلى، وفي بعض الحالات أمان أكبر من اللاسلكي.</p></div>
      <div class="no"><strong>عيب</strong><p>كابلات متناثرة = خطر صحة وسلامة. بعض المباني قبل أواخر 2000 بلا كابلات مدمجة فما زالت الأسلاك ظاهرة.</p></div>
    </div>
    ${officer("<p>للمكاتب الثابتة والخوادم: إيثرنت أو ألياف. للطرفيات اليومية: USB. للشاشات/السينما: HDMI أو DVI. لا تضع أليافًا غالية حيث يكفي USB لفأرة!</p>")}
    ${vocab(["USB", "Ethernet", "fibre optic", "HDMI", "DVI"])}
    ${pager("wired")}
  `;
}

function renderWireless() {
  $app.innerHTML = `
    ${lessonChrome("wireless")}
    ${groupNav("connect", "wireless")}
    <p class="kicker">طرق لاسلكية · Wireless</p>
    <h1>بلا أسلاك… لكن ليست كلها متشابهة</h1>
    ${graphic(SVG.wireless, "خمسة عوالم لاسلكية: مدى مختلف، غرض مختلف، أمان مختلف.")}
    <div class="grid grid-2">
      <article class="measure"><div class="ico">🎧</div><div><strong>${en("Bluetooth")} بلوتوث</strong>غالبًا للفأرة ولوحة المفاتيح والسماعات. المدى حوالي <b>100 متر</b>.</div></article>
      <article class="measure"><div class="ico">📶</div><div><strong>${en("Wi-Fi")} واي فاي</strong>الاتصال بشبكة المؤسسة أو بالإنترنت. يمكن مشاركة إنترنت الهاتف بـ ${en("tethering")}.</div></article>
      <article class="measure"><div class="ico">📲</div><div><strong>${en("NFC")} اتصال قريب المدى</strong>جهازان من مسافة قريبة جدًا. مثال: ${en("AirDrop")} على iPhone.</div></article>
      <article class="measure"><div class="ico">📺</div><div><strong>${en("IR")} أشعة تحت حمراء</strong>أجهزة التحكم عن بُعد للتلفزيونات الذكية ومستقبلات مثل Sky / Virgin / FreeView.</div></article>
    </div>
    <article class="panel">
      <h3>${en("cellular")} الشبكات المحمولة / الخلوية</h3>
      <p>شبكة لاسلكية في طرفيها. الأرض تُقسَم إلى <b>خلايا</b>، تخدم كل خلية محطة إرسال واستقبال ثابتة (غالبًا ثلاث محطات). الأجيال: ${en("3G")} ثم ${en("4G")} ثم ${en("5G")}.</p>
      <p class="ex">4G ساعدت على تطبيقات متعددة وتجربة أسرع. 5G أسرع وأكثر استقرارًا وأمانًا، لكن التوفر والتكلفة يعتمدان على موقعك.</p>
    </article>
    ${photo("img/warehouse-wifi.png", "المخزن: موظف يتحرك — واي فاي أنسب من كابل على العربة.")}
    ${officer("<p>لاسلكي للتنقّل (مخزن، سرير مريض، ضيوف). سلكي عندما تريد ثباتًا وسرعة وأمانًا أعلى (شركات، بنوك، تحرير فيديو). لا تقل «لاسلكي أحدث إذن أفضل».</p>")}
    ${vocab(["Bluetooth", "Wi-Fi", "NFC", "IR", "cellular", "5G", "tethering"])}
    ${pager("wireless")}
  `;
}

function renderNeeds() {
  $app.innerHTML = `
    ${lessonChrome("needs")}
    ${groupNav("connect", "needs")}
    <p class="kicker">الاحتياجات · الآثار · الأداء</p>
    <h1>كيف تختار نوع الاتصال؟</h1>
    <p class="lead">الميزات تلبّي أفرادًا ومؤسسات بشكل مختلف. النطاق العريض واسع… لكن ليس للجميع: مناطق بلا خدمة، قيود نطاق، أو تكلفة لا تُطاق.</p>
    <div class="grid grid-3">
      <article class="card"><img src="img/warehouse-wifi.png" alt="" style="border-radius:12px;margin-bottom:10px;height:120px;width:100%;object-fit:cover"/><strong>مخزن</strong><small>تنقّل مستمر → ${en("Wi-Fi")}</small></article>
      <article class="card"><img src="img/hospital-tablet.png" alt="" style="border-radius:12px;margin-bottom:10px;height:120px;width:100%;object-fit:cover"/><strong>مستشفى</strong><small>لوحي عند السرير → لاسلكي + أمان مشدد</small></article>
      <article class="card"><img src="img/studio-fibre.png" alt="" style="border-radius:12px;margin-bottom:10px;height:120px;width:100%;object-fit:cover"/><strong>استوديو</strong><small>فيديو 4K → ${en("fibre optic")} إلى المكتب</small></article>
    </div>
    <h2>آثار الاختيار</h2>
    <ul class="ticks">
      <li>الألياف و4G/5G جعلت البث أسرع وأوثق — لكن ليست متاحة جغرافيًا للجميع وتكلفتها أعلى.</li>
      <li>الكابل ما زال مفيدًا حيث النطاق محدود، ويثبّت التلفزيون الذكي والصوت المحيطي.</li>
      <li>العمل عن بُعد زاد الطلب على اتصال موثوق بين المكاتب والعالم.</li>
      <li>كابلات متناثرة: قضية ${en("health and safety")}.</li>
    </ul>
    <div class="case">
      <strong>مرسيدس بنز</strong>
      <p>السيارة تجمع بيانات أداء عن بُعد، يحللها المعالج، ويُبلَّغ السائق. الشركة قد تجدول الصيانة قبل تهالك القطعة. الاتصال هنا = إنتاجية وتشخيص أسرع.</p>
    </div>
    <div class="case">
      <strong>بورصة لندن · أداء النظام</strong>
      <p>تغيير أنواع الاتصال رفع وصول العملاء من <b>2 ميغابت</b> إلى <b>10 جيجابت</b>. في التداول، ملي ثانية عبر الأطلسي قد تغيّر الربح. البنوك والصحة والحكومة تحتاج أسرع نطاق عريض متوافر: حاليًا الألياف.</p>
    </div>
    <article class="warn">
      <strong>${en("EMI")} تداخل كهرومغناطيسي</strong>
      عمليات صناعية قد تفسد النحاس. هنا تكلفة الألياف <b>ضرورية</b> لمنع فقدان البيانات وتدهور الشبكة — حتى لو بدت «غالية بلا مبرر».
    </article>
    ${officer("<p>رتّب القرار: 1) هل المستخدم يتحرك؟ 2) ما حساسية البيانات؟ 3) ما حجم الملفات؟ 4) هل هناك تداخل؟ 5) ما الميزانية مقابل خسائر التعطل؟ معظم الشركات تختار نحاسًا كحل وسط — الاستثناءات أعلاه تبرّر الغالي.</p>")}
    ${reveal("لماذا قد تخسر شركة مالًا إذا اختارت واي فاي رخيصًا لفيديو 4K؟", "الملفات الضخمة تحتاج نطاقًا وثباتًا. الواي فاي يتأثر بالجدران والمستخدمين؛ زمن الاستجابة يرتفع فيتعطّل التحرير. الاستوديو الإبداعي يحتاج أليافًا إلى أجهزة التحرير.")}
    ${vocab(["fibre optic", "EMI", "bandwidth", "Wi-Fi"])}
    ${pager("needs")}
  `;
}

function renderNetworks() {
  $app.innerHTML = `
    ${lessonChrome("networks")}
    ${groupNav("networks", "networks")}
    <p class="kicker">الشبكات</p>
    <h1>من هاتفك إلى العالم</h1>
    <p class="lead">الشبكة = أجهزة متصلة لتشارك البيانات. النوع يحدده <b>المدى</b> و<b>من يملك الروابط</b> و<b>الغرض</b>.</p>
    ${graphic(SVG.nets, "اتسع النطاق: PAN شخص → LAN مبنى → WAN مدن → الإنترنت مجموعة شبكات واسعة.")}
    <div class="scale">
      <div class="step"><b>PAN</b><span>شخصي</span></div>
      <div class="step"><b>LAN</b><span>محلي</span></div>
      <div class="step"><b>WAN</b><span>واسع</span></div>
      <div class="step"><b>VPN</b><span>خاص ظاهري</span></div>
      <div class="step"><b>Internet</b><span>العالم</span></div>
    </div>
    <div class="grid grid-2">
      <article class="abbr"><div class="en ltr">${speakBtn("P A N")}<span>PAN</span></div><div class="full">Personal Area Network</div><div class="ar">لاسلكية بين أجهزة الفرد: هاتف، لابتوب، طابعة، سيارة. الغرض: مزامنة شخصية أو تجارية صغيرة.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("L A N")}<span>LAN</span></div><div class="full">Local Area Network</div><div class="ar">منطقة صغيرة أو مبنى. المؤسسة <b>تملك</b> الكابلات والبنية. مثال: مكتبان وحاسوبان + إنترنت في مكتب واحد.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("W A N")}<span>WAN</span></div><div class="full">Wide Area Network</div><div class="ar">أوسع من LAN وقد تكون عالمية. الإنترنت مجموعة WAN. البنية عادة لمزوّد اتصالات (اشتراك). قديمًا صوت فقط، الآن بيانات أيضًا. الشرطة تفضّلها أحيانًا لأنها مستقلة وأأمن من السحابة.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("V P N")}<span>VPN</span></div><div class="full">Virtual Private Network</div><div class="ar">توسيع الأعمال بانقطاع بسيط: إنترنت يربط أجهزة بعيدة <b>بأمان</b>. مثالية لموظفين عن بُعد في مدن أو دول.</div></article>
    </div>
    <article class="term"><strong>${en("Internet")} الإنترنت</strong>ليست شبكة واحدة تملكها شركة، بل مجموعة شبكات واسعة مترابطة عالميًا.</article>
    ${officer("<p>اسأل دائمًا: كم يتسع النطاق الجغرافي؟ هل نملك الكابلات أم نستأجرها؟ هل نحتاج نفقًا آمنًا فوق الإنترنت العام؟ PAN للفرد، LAN للمبنى، WAN للمدن، VPN للبعيد الآمن.</p>")}
    ${reveal("لماذا قد تفضّل جهة أمنية شبكة WAN على سحابة عامة؟", "WAN يمكن جعلها قائمة بذاتها وأأمن. السحابة طرف ثالث. الجهات الحساسة تفضّل السيطرة والاستقلال.")}
    ${vocab(["PAN", "LAN", "WAN", "VPN", "Internet"])}
    ${pager("networks")}
  `;
}

function renderFactors() {
  $app.innerHTML = `
    ${lessonChrome("factors")}
    ${groupNav("networks", "factors")}
    <p class="kicker">عوامل اختيار الشبكة</p>
    <h1>قائمة الموظف قبل التوقيع على العقد</h1>
    <p class="lead">كما تختار نظام تكنولوجيا معلومات، تختار الشبكة بعوامل مترابطة.</p>
    <div class="grid grid-2">
      <article class="panel"><strong>تجربة المستخدم</strong>
        <ul class="ticks">
          <li><b>سهولة الاستخدام:</b> الاتصال التلقائي أفضل من كلمات مرور معقّدة. الناس يبقون على مزوّد الجوال المألوف.</li>
          <li><b>الأداء:</b> استوديو فيديو ≠ متجر صغير. تنزيل كثيف → 4G/5G أو ألياف. استخدام نادر → 3G قد يكفي وأرخص.</li>
          <li><b>التوافر:</b> ألياف وواي فاي ليسا في كل منطقة ريفية.</li>
          <li><b>إمكانية الوصول:</b> الوصول للبيانات من خادم أو ${en("intranet")} / ${en("extranet")}، وملاءمة ذوي الإعاقة.</li>
        </ul>
      </article>
      <article class="panel"><strong>الاحتياج والمواصفات</strong>
        <p>عائلة تتشارك شبكة ≠ شركة بمواقع عالمية. مكتب تصميم/سينما يطلب مواصفات أعلى من مكتب إداري. سرعة الاتصال والسعة وقدرة ${en("CPU")} تختلف حسب المهمة.</p>
      </article>
      <article class="panel"><strong>${en("connectivity")} الاتصال</strong>
        <p>توافر الخدمة، قوة الإشارة، عرض النطاق المحتمل، المصداقية/الموثوقية. شركة بمبيعات عالمية تحتاج استقرارًا عاليًا وحجم خوادم مناسبًا.</p>
      </article>
      <article class="panel"><strong>تكلفة · كفاءة · توافق</strong>
        <p>مواصفات أعلى = تكلفة أعلى. الكفاءة: الألياف تنزّل أكثر في الزمن نفسه. التوافق: تنسيق تفهمه كل الأجهزة. عامل جودة على خط إنتاج → لا ألياف في يده بل لاسلكي. محلل بيانات ضخمة → لا واي فاي لأن البيانات يجب أن تكون فورية وبلا أخطاء.</p>
      </article>
      <article class="panel"><strong>التنفيذ Implementation</strong>
        <ul class="ticks">
          <li><b>جداول زمنية:</b> معرض مؤقت → واي فاي في دقائق. مكتب دائم → كابلات أيام.</li>
          <li><b>اختبار:</b> اعتماد بمعايير دولية في الشركات. حتى في البيت اختبر سرعة التنزيل.</li>
          <li><b>${en("downtime")}:</b> خطّط للتعطل ليلًا أو على مراحل حتى لا تخسر الشركة مالًا.</li>
        </ul>
      </article>
      <article class="panel"><strong>إنتاجية وأمان</strong>
        <p>إنتاجية = سرعة معالجة + جودة نتيجة − تعطل. الأمان: لا تشارك كلمات المرور، ${en("encryption")} للبيانات الحساسة. مثال: اختراق TalkTalk 2015. سياسة المدرسة قد تمنع الإنترانت خارج الموقع.</p>
      </article>
    </div>
    <div class="def"><strong>${en("intranet")} إنترانت</strong> موقع الشبكة المحلية للمستخدمين الداخليين فقط.<br /><strong>${en("extranet")} إكسترانت</strong> إنترانت يُفتح لمستخدمين خارجيين مصرّح لهم.</div>
    ${officer("<p>رتّب أولوياتك حسب السيناريو: مستشفى → أمان ثم وصول. معرض موسمي → سرعة التنفيذ. بنك → أداء + أمان + حد أدنى للتعطل. لا تنسخ اختيار المدرسة لمنزل العائلة.</p>")}
    ${vocab(["intranet", "extranet", "downtime", "encryption", "CPU"])}
    ${pager("factors")}
  `;
}

function renderParts() {
  $app.innerHTML = `
    ${lessonChrome("parts")}
    ${groupNav("networks", "parts")}
    <p class="kicker">مكونات الشبكة</p>
    <h1>أربعة أجهزة تغيّر أداء النظام</h1>
    ${graphic(SVG.parts, "الإنترنت يدخل عبر الموجّه، ثم المحوّل للأجهزة السلكية، ونقطة الوصول للاسلكية.")}
    <div class="grid grid-2">
      <article class="measure"><div class="ico">🌐</div><div><strong>${en("router")} جهاز التوجيه</strong>يربط الشبكات بالإنترنت (واي فاي أو نطاق عريض). الأداء غير متسق: المسافة من أقرب خادم تبادلي، والجدران بينك وبين الراوتر تخفض السرعة.</div></article>
      <article class="measure"><div class="ico">🔀</div><div><strong>${en("switch")} المحوّل</strong>واجهة بين إرسال البيانات واستقبالها. كلّما زاد عدد الأجهزة المتصلة زاد التأثير المحتمل في الأداء.</div></article>
      <article class="measure"><div class="ico">🔌</div><div><strong>كابلات ${en("Ethernet")}</strong>اتصال مباشر من الراوتر — شبكة سلكية ${en("LAN")}. محدودة بطول الكابل، لكنها غالبًا أثبت من الواي فاي.</div></article>
      <article class="measure"><div class="ico">📡</div><div><strong>${en("WAP")} نقطة الوصول اللاسلكية</strong>توصل أجهزة الواي فاي بشبكة سلكية. تخدم كثيرين معًا، وتتأثر بعدد المستخدمين والتنزيلات والطقس والترددات اللاسلكية.</div></article>
    </div>
    <div class="compare">
      <div class="yes"><strong>منزل</strong><p>تعطل المحوّل مزعج. جدار حماية بسيط يكفي غالبًا. لا حاجة لأجهزة احتياطية غالية.</p></div>
      <div class="no"><strong>شركة / مركز اتصال</strong><p>تعطل المحوّل الأساسي = آلاف بلا عمل وعملاء بلا اتصال. تحتاج مرونة، أجهزة احتياطية، وجدار حماية يسجّل الهجمات ويتتبع.</p></div>
    </div>
    ${officer("<p>لا تشترِ راوترًا منزليًا لشبكة مؤسسة. والعكس: لا تبالغ في معدات مراكز البيانات لشقة. حجم المخاطر يحدد المكوّن.</p>")}
    ${vocab(["router", "switch", "WAP", "Ethernet", "LAN"])}
    ${pager("parts")}
  `;
}

function renderProtocols() {
  $app.innerHTML = `
    ${lessonChrome("protocols")}
    ${groupNav("tx", "protocols")}
    <p class="kicker">البروتوكولات</p>
    <h1>البروتوكول = لغة الاتفاق</h1>
    <div class="def"><strong>${en("protocol")}</strong> مجموعة قواعد: كيف يبدأ الإرسال، كيف تُرمَّز البيانات، وكيف ينتهي. مثل: مرحبًا → جمل → إلى اللقاء. المعايير الدولية تجعل أجهزة مصنّعين مختلفين تعمل معًا.</div>
    ${graphic(SVG.mail, "البريد: SMTP للخروج، POP3 أو IMAP4 للدخول من الخادم.")}
    <h2>بريد إلكتروني</h2>
    <div class="table-wrap"><table class="data">
      <thead><tr><th>الاختصار</th><th>الاسم الكامل</th><th>ماذا يفعل؟</th></tr></thead>
      <tbody>
        <tr><td class="en-cell ltr">SMTP</td><td>Simple Mail Transfer Protocol</td><td>إرسال البريد إلى الخادم (من عميل أو خادم آخر)</td></tr>
        <tr><td class="en-cell ltr">POP3</td><td>Post Office Protocol 3</td><td>استرداد البريد إلى Outlook / Thunderbird (غالبًا تنزيل)</td></tr>
        <tr><td class="en-cell ltr">IMAP4</td><td>Internet Message Access Protocol 4</td><td>الوصول للبريد على الخادم <b>دون إزالته</b> — مناسب لعدة أجهزة</td></tr>
      </tbody>
    </table></div>
    <article class="term"><strong>${en("TCP/IP")}</strong> ${en("IP")} يسلّم إلى العنوان. ${en("TCP")} ينظّم البيانات للنقل الآمن بين الخادم والعميل ويحافظ على <b>تكامل البيانات</b>.</article>
    <h2>صوت وفيديو عبر الإنترنت</h2>
    <p>${en("VoIP")} يمرّر المكالمات عبر شبكة IP بدل خط الهاتف — توفير مالي. أمثلة: Skype، Teams، FaceTime، Hangouts. بروتوكولات قياسية: ${en("SIP")} بدء الجلسة و ${en("RTP")} النقل اللحظي. انتبه: FaceTime غالبًا بين أجهزة Apple فقط (توافق).</p>
    <h2>ملفات وصفحات</h2>
    <div class="grid grid-2">
      <article class="abbr"><div class="en ltr">${speakBtn("F T P")}<span>FTP</span></div><div class="full">File Transfer Protocol</div><div class="ar">قواعد رفع/تنزيل الملفات من خادم بعد تسجيل الدخول.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("H T T P")}<span>HTTP</span></div><div class="full">Hypertext Transfer Protocol</div><div class="ar">المتصفح يطلب بـ GET مثل <span class="ltr">GET /index.html HTTP/1.0</span>. 200 نجاح، 404 غير موجود.</div></article>
    </div>
    ${graphic(SVG.https, "أضف s: HTTPS يستخدم SSL أو TLS وتشفير المفتاح العام — ضروري للمصارف والبيانات الحساسة.")}
    ${officer("<p>للعمل على جوال + لابتوب: IMAP4 لا POP3 حتى لا يختفي البريد من جهاز. لأي صفحة بنك أو تسجيل دخول: ارفض http بلا قفل. لنقل ملفات كبيرة بين خوادم: FTP (أو بدائل آمنة في الواقع المهني).</p>")}
    ${vocab(["protocol", "SMTP", "POP3", "IMAP4", "TCP/IP", "VoIP", "FTP", "HTTP", "HTTPS"])}
    ${pager("protocols")}
  `;
}

function renderTx() {
  $app.innerHTML = `
    ${lessonChrome("tx")}
    ${groupNav("tx", "tx")}
    <p class="kicker">أمن النقل · النطاق الترددي · زمن الاستجابة</p>
    <h1>البيانات في الطريق… من يسمع؟ ومن ينتظر؟</h1>
    <div class="case">
      <strong>Equifax 2017</strong>
      <p>سُرقت بيانات مئات الملايين من وكالة تقارير ائتمانية. الرسالة: الوعي يزيد، والمخترقون يبحثون عن طريق جديد.</p>
    </div>
    <h2>اعتبارات أمنية عند النقل</h2>
    <ul class="ticks">
      <li>ابدأ من <b>المادي</b>: لا تفعّل منافذ شبكة في مناطق عامة (تنصت بسيط).</li>
      <li>الألياف أصعب في التنصت من النحاس.</li>
      <li>خارج شبكة الشركة فالأمن ليس بيدك — البريد يُرسل كنص واضح وقد يقرأه أي خادم في الطريق.</li>
      <li>شبكات مثل البريد الحكومي الآمن GSi تعطي ضمانًا أعلى.</li>
      <li>شهادات رقمية و ${en("PGP")} للتشفير عند الحاجة.</li>
    </ul>
    <h2>${en("bandwidth")} مقابل ${en("latency")}</h2>
    <div class="grid grid-2">
      <article class="yes" style="padding:16px;border-radius:20px;border:1px solid var(--line)"><strong>النطاق الترددي</strong><p>سعة حمل البيانات. تُقاس بـ ${en("Mbps")} مثلًا 10 ميغابت/ث نظريًا = 10 ميغابت كل ثانية. يؤثر في تنزيل/بث الفيديو.</p></article>
      <article class="no" style="padding:16px;border-radius:20px;border:1px solid var(--line)"><strong>زمن الاستجابة</strong><p>«التأخير». ${en("ping")} = ذهاب حزمة ICMP وعودتها بالمللي ثانية. كلّما انخفض كان أفضل. عالٍ = حركة اللعبة تظهر متأخرة.</p></article>
    </div>
    <article class="panel">
      <h3>ما الذي يغيّر النطاق وزمن الاستجابة؟</h3>
      <div class="pill-row">
        <span class="pill">نوع الاتصال</span>
        <span class="pill">عدد المستخدمين</span>
        <span class="pill">البروتوكول</span>
        <span class="pill">المسافة من الخادم</span>
        <span class="pill">تحويل الإشارة</span>
        <span class="pill">وقت اليوم</span>
        <span class="pill">حجم البيانات</span>
        <span class="pill">سلكي عادة أسرع</span>
      </div>
    </article>
    <div class="warn">
      <strong>أثر على الأداء والاستخدام</strong>
      الشركات الدولية قد تنقل كميات كبيرة في ساعات انخفاض الطلب. زمن استجابة مرتفع يكلّف مالًا وخسارة أعمال. مثال: طائرة تعتمد على اتصال لحظي مع المراقبة الجوية — التأخير قد يعني كارثة.
    </div>
    <div class="case">
      <strong>مرصد ماونا كيا وتلسكوب هابل</strong>
      <p>تلسكوبات على بركان ناءٍ تنقل بيانات فلكية (هابل نحو 140 غيغابت أسبوعيًا). الاتصال بين التلسكوب والمرصد والعلماء يعتمد على توافق البرمجيات. عوامل البث: طقس قاسٍ، رياح، ثلج، تشويه الغلاف الجوي، والمسافة. لموقع بعيد ببيانات ضخمة: روابط عالية النطاق مع ضغط وتوافق ترميز، وأقمار صناعية حيث لا ألياف.</p>
    </div>
    ${officer("<p>إذا اشتكى المستخدمون من «الإنترنت بطيء» فرّق: هل السعة ضيقة (نطاق) أم التأخير عالٍ (ping)؟ حلول مختلفة: ترقية الخط، تقليل المستخدمين على نفس النقطة، تقريب الخادم، أو ضغط الملفات.</p>")}
    ${vocab(["bandwidth", "latency", "ping", "Mbps", "encryption", "PGP"])}
    ${pager("tx")}
  `;
}

function renderCompress() {
  $app.innerHTML = `
    ${lessonChrome("compress")}
    ${groupNav("tx", "compress")}
    <p class="kicker">الضغط · Compression · الترميز Codec</p>
    <h1>ملفات أصغر… هل نفقد شيئًا؟</h1>
    <p class="lead">الضغط يقلل المساحة والنطاق عند الإرسال. ${en("bit")} أصغر وحدة: 0 أو 1.</p>
    ${graphic(SVG.compress, "سؤال الموظف: هل يجوز فقدان تفاصيل، أم يجب استعادة الملف حرفًا بحرف؟")}
    <div class="compare">
      <div class="no">
        <strong>${en("lossy")} ضغط بفاقد</strong>
        <p>يُزيل بيانات. الصورة JPEG أقل جودة من RAW. MP3 يحذف أصواتًا شبه غير مسموعة — لذلك بعض عشاق الموسيقى لا يحبونه. MP4 يضم صوتًا وفيديو وصورًا ونصوصًا.</p>
        <p>أيضًا: WMA و AAC (روّجته Apple وتُعدّ أفضل من MP3).</p>
      </div>
      <div class="yes">
        <strong>${en("lossless")} ضغط بلا فاقد</strong>
        <p>يقلّل عدد البتات دون حذف المعلومات المهمة. فك الضغط يعيد الملف كما كان. أمثلة: ${en("ZIP")}، ${en("PNG")}، ${en("GIF")}، ${en("FLAC")}، Windows Media Lossless.</p>
      </div>
    </div>
    <article class="term">
      <strong>${en("codec")} برنامج الترميز</strong>
      جهاز أو برنامج يرمّز أو يفك ترميز تدفق رقمي. قد يضغط أو يرمّز فقط. الملفات المرمّزة تُنقَل أسرع وتأخذ مساحة أقل — لهذا تخزّن الهواتف مئات المقاطع.
      <p class="ex">الأثر الأخطر: <b>التوافق</b>. يجب أن يستطيع المستلم فك الترميز. خطأ في برنامج الترميز = لا صورة ولا صوت.</p>
    </article>
    ${officer("<p>صور موقع ويب: JPEG مقبول. شعار شفاف أو رسم يجب ألا يتشوّه: PNG. أرشيف مستندات رسمية: ZIP بلا فاقد. أغنية للبث: MP3/AAC. أرشيف استوديو موسيقى: FLAC. فيديو للواتساب: MP4 بفاقد بعد موافقة الجودة.</p>")}
    ${reveal("هل يمكن تحويل JPEG إلى PNG لاستعادة الجودة الأصلية؟", "لا. البيانات أُزيلت. التحويل لتنسيق بلا فاقد لا يُرجع ما حُذف. ابدأ من الأصل غير المضغوط إن احتجت جودة.")}
    ${vocab(["lossy", "lossless", "codec", "JPEG", "MP3", "MP4", "PNG", "ZIP", "FLAC", "bit"])}
    ${pager("compress")}
  `;
}

function renderOnline() {
  $app.innerHTML = `
    ${lessonChrome("online")}
    ${groupNav("online", "online")}
    <p class="kicker">الأنظمة عبر الإنترنت</p>
    <h1>سحابة للملفات… وسحابة للعقل الحاسوبي</h1>
    ${photo("img/cloud-sync.png", "التخزين السحابي: الصورة نفسها على الهاتف واللابتوب والتلفزيون — إن وُجد إنترنت.")}
    <div class="grid grid-2">
      <article class="panel">
        <h3>${en("cloud storage")} تخزين سحابي</h3>
        <p>خادم افتراضي لمساحة الملفات (Google / Microsoft / Apple). خوادم مرتبطة تعطي سعة كبيرة. حلّ لمرفقات الإيميل الثقيلة: ترفع على Dropbox أو Google Docs وتشارك رابطًا.</p>
        <p><b>شخصي:</b> نسخ احتياطي لجهات الاتصال والصور، مشاركة ألبوم مناسبة برابط.<br /><b>مهني:</b> وصول الموظّف المسافر للملفات، وإنفاق حكومي سحابي متزايد (مثل المملكة المتحدة).</p>
      </article>
      <article class="panel">
        <h3>${en("cloud computing")} حوسبة سحابية</h3>
        <p>برامج وموارد ومعلومات <b>عند الطلب</b> عبر الشبكة. لا تثبّت كل شيء على الجهاز. مزوّد الخدمة يتولى التحديث والنسخ الاحتياطي والأمن أحيانًا.</p>
        <p><b>شخصي:</b> مستندات جوجل، Office 365 باشتراك — أو تطبيقات مجانية محدودة تحتاج أمنًا ذاتيًا.<br /><b>مهني:</b> Azure و AWS يوسّعان القدرة ديناميكيًا (جمعة سوداء) وتدفع مقابل ما تستهلك. تعاون لحظي على مستند واحد.</p>
      </article>
    </div>
    <div class="compare">
      <div class="yes"><strong>متى الحوسبة السحابية؟</strong><p>سجل حضور أسبوعي يراه الجميع فورًا ويحدّثه الكل.</p></div>
      <div class="no"><strong>متى الطريقة التقليدية؟</strong><p>كتاب مدرسي يحتاج سيطرة نسخة واحدة — رفع وتعليق لا تحرير جماعي بلا ضوابط.</p></div>
    </div>
    <h2>آثار على الأفراد</h2>
    <ul class="ticks">
      <li>مزامنة أجهزة متعددة: تقويم واحد على البيت والعمل والجوال.</li>
      <li>مساحة مجانية محدودة ثم اشتراك. Gmail/Docs غالبًا يكفيان شخصيًا.</li>
      <li>بلا إنترنت = بلا بيانات. معلومات مالية تحتاج وقاية حتى لو مشفّرة.</li>
    </ul>
    <h2>آثار على المؤسسات</h2>
    <ul class="ticks">
      <li>سعة مرنة، تكلفة أقل من شراء كل الرخص والخوادم، تركيز على العمل لا على الصيانة.</li>
      <li>شركة ناشئة تستضيف على AWS حسب الاستهلاك دون شراء خوادم قوية مقدمًا.</li>
      <li>سياسات: استخدام مهني فقط، خطة تعطل، ما لا يُرفع للسحابة (مالية/حكومية)، وأين تُخزَّن الملفات الحساسة.</li>
    </ul>
    ${officer("<p>تخزين ≠ حوسبة. هل نحتاج مساحة أم برامج؟ تعاون لحظي أم سيطرة نسخة؟ وما الذي يُمنع رفعه؟</p>")}
    ${vocab(["cloud storage", "cloud computing"])}
    ${pager("online")}
  `;
}

function renderRemote() {
  $app.innerHTML = `
    ${lessonChrome("remote")}
    ${groupNav("online", "remote")}
    <p class="kicker">العمل عن بُعد</p>
    <h1>كيف يعمل الموظف كأنه في المكتب؟</h1>
    ${photo("img/remote-vpn.png", "المنزل يتصل بالمكتب عبر نفق — هذا جوهر VPN.")}
    ${graphic(SVG.vpn, "الجهاز البعيد يصبح جزءًا من LAN عبر نفق مشفّر فوق الإنترنت العام.")}
    <div class="grid grid-2">
      <article class="panel">
        <h3>${en("VPN")}</h3>
        <p>الخوادم التي تصل إليها <b>مادية</b> وليست سحابة. تحتاج إنترنتًا؛ بلا اتصال ترى فقط ملفات أوفلاين. أمثلة مزوّدين: ExpressVPN، IPVanish، VyprVPN، CentreStack.</p>
        <p class="ex">لا تعطي تعاون التحرير الجماعي الذي تعطيه الحوسبة السحابية، لكنها تفتح ملفات المكتب من البيت أو الطريق.</p>
      </article>
      <article class="panel">
        <h3>${en("remote desktop")} سطح المكتب البعيد</h3>
        <p>شخص مصرّح يرى شاشتك ويصلح أو يدرّب. Windows فيه أداة مدمجة. مجانًا: TeamViewer، VNC، Chrome Remote Desktop.</p>
        <p class="ex">إصلاح بلا شحن الجهاز أسابيع. مثال: Digital Eagles في بنك باركليز.</p>
      </article>
    </div>
    <div class="warn">لا تعطِ التحكم إلا لمن تثق به. الإذن أولًا دائمًا.</div>
    ${officer("<p>موظف يحتاج ملفات المكتب الداخلية → VPN. فني يصلح إعداد واي فاي لعميل → سطح مكتب بعيد. فريق يكتب عرضًا معًا → حوسبة سحابية. ثلاث أدوات، ثلاثة أغراض.</p>")}
    ${vocab(["VPN", "remote desktop", "LAN"])}
    ${pager("remote")}
  `;
}

function renderOnlineChoose() {
  $app.innerHTML = `
    ${lessonChrome("online-choose")}
    ${groupNav("online", "online-choose")}
    <p class="kicker">اختيار الأنظمة عبر الإنترنت</p>
    <h1>خمسة فلاتر قبل الاشتراك</h1>
    <div class="grid grid-2">
      <article class="measure"><div class="ico">🔒</div><div><strong>الأمان</strong>انتهاك قد يحدث أثناء النقل أو التخزين. ${en("URL")} الذي يبدأ بـ <span class="ltr">https</span> والقفل = أأمن. ${en("VPN")} يضع الموظف داخل LAN خلف جدار الحماية رغم أنه بعيد. البروتوكولات تختلف في درجة الأمن.</div></article>
      <article class="measure"><div class="ico">💷</div><div><strong>التكلفة</strong>دفع تدريجي وعقود قصيرة تجذب الشركات الصغيرة. أضف: خط إنترنت سريع، اسم نطاق مثل mybusiness.com، وباقات بيانات للموظفين المتنقلين — صعب التنبؤ بها.</div></article>
      <article class="measure"><div class="ico">👆</div><div><strong>سهولة الاستخدام</strong>إن لم يكن بديهيًا فلن يُستخدم. تطبيقات الويب يجب أن تكون متجاوبة: تتكيّف مع الجوال والشاشة الصغيرة.</div></article>
      <article class="measure"><div class="ico">✨</div><div><strong>الميزات</strong>أمن أولًا، ثم جودة الدعم الفني، سعة التخزين، تكاليف بدء منخفضة، والقدرة على رفع/خفض مستوى الخدمة.</div></article>
    </div>
    <article class="panel">
      <h3>${en("connectivity")} للوصول إلى السحابة</h3>
      <p>بلا إنترنت مستقر لا سحابة. الخيارات الشائعة: ${en("ADSL")}، ${en("FTTC")}، ${en("FTTP")}، نطاق عبر الأقمار الصناعية، ونطاق محمول. اختر حسب الاستقرار والتوافر في منطقتك.</p>
    </article>
    ${officer("<p>قائمة شراء سريعة: هل العنوان https؟ هل هناك خطة تعطل؟ هل الواجهة تعمل على جوال الموظف؟ هل نقدر نزيد السعة غدًا دون شراء خادم؟ هل الخط في المنطقة يحمل هذا الحمل؟</p>")}
    ${vocab(["URL", "VPN", "ADSL", "FTTC", "FTTP"])}
    ${pager("online-choose")}
  `;
}

function renderEmerging() {
  $app.innerHTML = `
    ${lessonChrome("emerging")}
    <p class="kicker">التقنيات الناشئة</p>
    <h1>جديد… لكن له ثمن على المؤسسة وأصحاب المصلحة</h1>
    <p class="lead">هاتفك أقدر حوسبيًا من صاروخ أبولو 11. ${en("early adopter")} يسارع للشراء. المؤسسة يجب أن ترى: التوفر الدائم، البيانات الضخمة، المواد الخام، البيئة، البنية التحتية، التكلفة، وضغط «كن أول من يملك».</p>
    ${photo("img/iot-smart.png", "أجهزة رقمية متصلة: هاتف، ساعة نشاط، منزل يستجيب من بعيد.")}
    <h2>تطورات الأجهزة</h2>
    <div class="grid grid-3">
      <article class="card"><strong>هواتف ذكية</strong><small>معلومات هائلة، لكن تكلفة جهاز + اتصال + تأمين، وخطر وصول غير مصرّح لبيانات العمل.</small></article>
      <article class="card"><strong>متتبعات النشاط</strong><small>شركات تتتبع التمارين عن بُعد. انتهاكات: بيانات صحية تُباع أو تُستهدف بالإعلانات.</small></article>
      <article class="card"><strong>حوسبة محمولة</strong><small>مكاتب أقل + ${en("VPN")}. عيب: البريد يصل خارج الدوام فيضغط الحياة. ميزة: رد أسرع في الطوارئ.</small></article>
    </div>
    <h2>شبكات واتصال</h2>
    <div class="grid grid-2">
      <article class="panel"><strong>${en("4G")} → ${en("5G")}</strong><p>5G قد تبلغ 100 ضعف 4G مع زمن انتقال منخفض: بيانات أكبر، مبيعات وتصنيع أسرع، صيانة أرخص. الآثار: تكلفة عالية، ضغط «كن متاحًا دائمًا»، بصمة كربونية، وحواجز المباني على الإشارة.</p></article>
      <article class="panel"><strong>${en("IoT")} إنترنت الأشياء</strong><p>ربط أجهزة الحوسبة: أتمتة منزل ومبنى وأمن، سيارات دون سائق، حافلات بتوقيت أدق. استثمار كبير… ومخاوف أمن بيانات أكبر.</p></article>
      <article class="panel"><strong>${en("virtualisation")}</strong><p>نسخة افتراضية من جهاز/مورد. تقلل عدد الحواسيب وطاقة التشغيل (جزء من السحابة). التنفيذ غالٍ وفيه مخاطر أمنية.</p></article>
      <article class="panel"><strong>${en("containerisation")}</strong><p>عزل تطبيقات تستخدم نظام تشغيل المضيف (لا نسخة OS كاملة). IBM: عزل يحدّ انتشار برمجيات خبيثة بين الحاويات، مع صلاحيات تمنع الدخول غير المرغوب.</p></article>
    </div>
    ${photo("img/ar-vr.png", "نمذجة البيانات: واقع معزز فوق العالم، أو واقع افتراضي يغمرك بالكامل.")}
    <h2>نمذجة واستجواب بيانات</h2>
    <div class="grid grid-2">
      <article class="abbr"><div class="en ltr">${speakBtn("A R")}<span>AR</span></div><div class="full">Augmented Reality</div><div class="ar">صورة حاسوبية فوق رؤيتك للعالم الحقيقي (مثل المجسمات في أفلام حرب النجوم).</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("V R")}<span>VR</span></div><div class="full">Virtual Reality</div><div class="ar">انغماس في عالم حاسوبي: قفز مظلي، تدريب سلامة، علاج قلق ورهاب في بيئة آمنة.</div></article>
      <article class="abbr"><div class="en ltr">${speakBtn("M L")}<span>ML</span></div><div class="full">Machine Learning</div><div class="ar">خوارزميات ونماذج إحصائية تنفّذ مهمة دون تعليمات صريحة لكل خطوة. معظم تطبيقات ${en("AI")} تتضمن تعلمًا آليًا، لكنهما ليسا الشيء نفسه. أمثلة AI: تشخيص طبي وتعرّف كلام.</div></article>
      <article class="panel"><strong>تخزين البيانات / مستودع البيانات</strong><p>نظام تقارير وتحليل لذكاء الأعمال: جمع بيانات المنافسين أو إنفاق المستهلكين وتفضيلاتهم.</p></article>
    </div>
    ${officer("<p>قبل تبنّي 5G أو IoT أو VR اسأل أصحاب المصلحة: من يدفع؟ من بياناته تُجمع؟ هل الموظفون مضطرون أن يكونوا متصلين ليلًا؟ ما الأثر البيئي؟ التقنية الناشئة ليست حيادية — قرّر بوعي.</p>")}
    ${vocab(["5G", "IoT", "virtualisation", "containerisation", "AR", "VR", "ML", "AI", "early adopter"])}
    ${pager("emerging")}
  `;
}

function renderDecide() {
  $app.innerHTML = `
    <p class="kicker">قرار</p>
    <h1>موظف تكنولوجيا المعلومات</h1>
    <p class="lead">الموقف يحدد البنية: ما يلبّي الاحتياج غير ما يبدو أحدث أو أرخص.</p>
    ${SCENARIOS.map((s, i) => `
      <section class="case" style="margin-top:18px">
        <p class="kicker">سيناريو ${i + 1}</p>
        <h2>${esc(s.title)}</h2>
        <figure class="photo"><img src="${esc(s.img)}" alt="${esc(s.title)}" /><figcaption>${esc(s.brief)}</figcaption></figure>
        <p><strong>${esc(s.q)}</strong></p>
        <div class="grid grid-3" data-scenario="${esc(s.id)}">
          ${s.options.map((o, j) => `<button type="button" class="pick" data-rank="${o.rank}" data-why="${esc(o.why)}"><strong>${esc(o.t)}</strong><small>${esc(o.d)}</small></button>`).join("")}
        </div>
        <div class="pick-result" id="res-${esc(s.id)}"></div>
      </section>
    `).join("")}
    <nav class="pager"><a class="ghost" href="#/emerging">→ التقنيات الناشئة</a><a href="#/glossary">المصطلحات ←</a></nav>
  `;
}

function renderGlossary() {
  const groups = [...new Set(GLOSSARY.map((g) => g.group))];
  $app.innerHTML = `
    <p class="kicker">مصطلحات</p>
    <h1>كل اختصار ومعناه</h1>
    <p class="lead">ابحث بالإنجليزي أو بالعربي.</p>
    <input class="search" id="gsearch" type="search" placeholder="مثال: VPN أو ألياف أو HTTPS" />
    <div id="glist">
      ${groups.map((gr) => `
        <h2>${esc(gr)}</h2>
        <div class="grid grid-2">
          ${GLOSSARY.filter((x) => x.group === gr).map((x) => `
            <article class="abbr" data-q="${esc((x.en + " " + x.full + " " + x.ar).toLowerCase())}">
              <div class="en ltr">${speakBtn(x.say)}<span>${esc(x.en)}</span></div>
              <div class="full">${esc(x.full)}</div>
              <div class="ar">${esc(x.ar)}</div>
            </article>
          `).join("")}
        </div>
      `).join("")}
    </div>
    <nav class="pager"><a class="ghost" href="#/decide">→ قرار</a><a href="#/quiz">اختبر ←</a></nav>
  `;
}

function renderQuiz() {
  $app.innerHTML = `
    <p class="kicker">تحقق</p>
    <h1>10 أسئلة</h1>
    <p class="lead">اختر ثم يظهر التفسير وعدد الإجابات الصحيحة.</p>
    <div class="score" id="score">الإجابات الصحيحة: 0 / ${QUIZ.length}</div>
    ${QUIZ.map((q, i) => quizBlock(q, i)).join("")}
    <nav class="pager"><a class="ghost" href="#/glossary">→ القاموس</a><a href="#/">العودة للبداية ←</a></nav>
  `;
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const id = hash.split("/").filter(Boolean)[0] || "home";
  const item = PATH.find((p) => p.id === id);
  let nav = item ? item.nav : id;
  if (id === "home") nav = "home";
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === nav);
  });
  const pages = {
    home: renderHome,
    connect: renderConnect,
    wired: renderWired,
    wireless: renderWireless,
    needs: renderNeeds,
    networks: renderNetworks,
    factors: renderFactors,
    parts: renderParts,
    protocols: renderProtocols,
    tx: renderTx,
    compress: renderCompress,
    online: renderOnline,
    remote: renderRemote,
    "online-choose": renderOnlineChoose,
    emerging: renderEmerging,
    decide: renderDecide,
    glossary: renderGlossary,
    quiz: renderQuiz,
  };
  (pages[id] || renderHome)();
  window.scrollTo(0, 0);
  bindInteractions();
}

function bindInteractions() {
  document.querySelectorAll("[data-speak]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll(".speak-btn.playing").forEach((b) => b.classList.remove("playing"));
      btn.classList.add("playing");
      speakEnglish(btn.dataset.speak);
      setTimeout(() => btn.classList.remove("playing"), 1200);
    });
  });
  document.querySelectorAll("[data-reveal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = btn.parentElement.querySelector(".answer");
      if (box) box.classList.toggle("on");
    });
  });
  document.querySelectorAll(".quiz-card").forEach((card) => {
    const correct = Number(card.dataset.correct);
    const feedback = card.querySelector(".feedback");
    card.querySelectorAll(".quiz-opts button").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        if (card.dataset.done) return;
        card.dataset.done = "1";
        card.querySelectorAll(".quiz-opts button").forEach((b) => { b.disabled = true; });
        if (i === correct) {
          btn.classList.add("correct");
          card.dataset.ok = "1";
        } else {
          btn.classList.add("wrong");
          const right = card.querySelectorAll(".quiz-opts button")[correct];
          if (right) right.classList.add("correct");
        }
        if (feedback) feedback.classList.add("on");
        const score = document.getElementById("score");
        if (score) {
          const ok = document.querySelectorAll(".quiz-card[data-ok='1']").length;
          score.textContent = `الإجابات الصحيحة: ${ok} / ${QUIZ.length}`;
        }
      });
    });
  });
  document.querySelectorAll("[data-scenario]").forEach((grid) => {
    const id = grid.dataset.scenario;
    const box = document.getElementById("res-" + id);
    grid.querySelectorAll(".pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".pick").forEach((b) => {
          b.classList.remove("chosen-good", "chosen-ok", "chosen-bad");
          b.disabled = true;
        });
        btn.classList.add("chosen-" + btn.dataset.rank);
        const label = { good: "اختيار يطابق احتياج السيناريو", ok: "ممكن… لكنه ليس الأنسب وحدَه", bad: "لا يلبّي الاحتياج الأساسي" };
        if (box) {
          box.classList.add("on");
          box.innerHTML = `<strong>${label[btn.dataset.rank]}</strong><p>${btn.dataset.why}</p>`;
        }
      });
    });
  });
  const gsearch = document.getElementById("gsearch");
  if (gsearch) {
    gsearch.addEventListener("input", () => {
      const q = gsearch.value.trim().toLowerCase();
      document.querySelectorAll("#glist .abbr").forEach((el) => {
        el.style.display = !q || el.dataset.q.includes(q) ? "" : "none";
      });
    });
  }
}

document.getElementById("theme-btn")?.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "" : "dark";
  document.documentElement.setAttribute("data-theme", cur);
  localStorage.setItem("u1-theme", cur);
});
if (localStorage.getItem("u1-theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

window.addEventListener("hashchange", route);
if (window.speechSynthesis) window.speechSynthesis.getVoices();
route();
