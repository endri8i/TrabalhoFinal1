const http = require("http");

const PORT = process.env.PORT || 3000;
const SITE_NAME = process.env.NOME_SITE || "MangaVerse";

const mangas = [
  { title: "Berserk", genre: "Fantasia sombria", year: "1989", description: "Uma jornada intensa em um mundo medieval marcado por conflitos, ambição e escolhas difíceis.", tag: "DARK FANTASY", color: "#6d2630" },
  { title: "Vagabond", genre: "Histórico", year: "1998", description: "A trajetória de um espadachim em busca de força, propósito e compreensão de si mesmo.", tag: "HISTÓRICO", color: "#9a6b3f" },
  { title: "Monster", genre: "Suspense", year: "1994", description: "Um médico se vê envolvido em uma investigação que coloca em dúvida a natureza do bem e do mal.", tag: "SUSPENSE", color: "#536b62" },
  { title: "Vinland Saga", genre: "Aventura histórica", year: "2005", description: "Uma história de vikings, vingança, amadurecimento e procura por uma terra de paz.", tag: "AVENTURA", color: "#54758b" },
  { title: "One Piece", genre: "Aventura", year: "1997", description: "Um jovem pirata parte pelos mares com sua tripulação em busca do maior tesouro do mundo.", tag: "AVENTURA", color: "#b17a35" },
  { title: "Bleach", genre: "Ação e fantasia", year: "2001", description: "Um estudante ganha poderes extraordinários e passa a proteger o mundo de espíritos perigosos.", tag: "SOBRENATURAL", color: "#53618e" },
  { title: "Chainsaw Man", genre: "Ação e sobrenatural", year: "2018", description: "Em um mundo cheio de demônios, um jovem tenta construir uma vida melhor enquanto enfrenta perigos.", tag: "AÇÃO", color: "#a33b32" },
  { title: "Jujutsu Kaisen", genre: "Ação e sobrenatural", year: "2018", description: "Estudantes enfrentam maldições e descobrem os riscos de um universo oculto.", tag: "SOBRENATURAL", color: "#66517d" },
  { title: "Death Note", genre: "Suspense psicológico", year: "2003", description: "Um caderno misterioso coloca um estudante em uma disputa intelectual de consequências enormes.", tag: "PSICOLÓGICO", color: "#55545f" },
  { title: "Sakamoto Days", genre: "Ação e comédia", year: "2020", description: "Um antigo assassino tenta levar uma vida tranquila, mas seu passado insiste em alcançá-lo.", tag: "AÇÃO & COMÉDIA", color: "#65805a" }
];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');
:root{--bg:#101010;--panel:#191919;--panel2:#202020;--text:#f4f0e9;--muted:#aaa49d;--red:#e3423b;--line:#333}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:'DM Sans',Arial,sans-serif}
a{color:inherit;text-decoration:none}.wrap{width:min(1120px,calc(100% - 40px));margin:auto}
header{border-bottom:1px solid var(--line);background:#111;position:sticky;top:0;z-index:5}
.nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{font-family:'Oswald',sans-serif;font-size:27px;letter-spacing:1px}.logo span{color:var(--red)}
nav{display:flex;gap:26px;align-items:center}nav a{font-size:14px;color:#c8c3bc}nav a:hover,nav a.active{color:white}
.nav-cta,.button{display:inline-block;background:var(--red);color:white;padding:12px 18px;border-radius:4px;font-weight:700;font-size:13px;letter-spacing:.3px}
.hero{padding:82px 0 76px;background:radial-gradient(ellipse at 82% 30%,#55201f 0,transparent 34%),linear-gradient(115deg,#171717,#101010 65%)}
.eyebrow{color:#f06b63;font-size:11px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase}
h1,h2,h3{font-family:'Oswald',Impact,sans-serif;text-transform:uppercase;margin:0;line-height:1.05}
.hero h1{font-size:clamp(48px,8vw,88px);max-width:720px;margin:18px 0}.hero h1 span{color:var(--red)}
.hero p{color:#c0bbb4;line-height:1.8;max-width:570px;margin:0 0 26px}
.section{padding:58px 0}.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:25px}
.section-head h2{font-size:34px}.section-head p{color:var(--muted);font-size:13px;margin:8px 0 0}
.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}
.card{background:var(--panel);border:1px solid #292929;border-radius:7px;overflow:hidden;transition:transform .2s,border-color .2s}
.card:hover{transform:translateY(-4px);border-color:#7e3935}
.cover{height:190px;padding:15px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(145deg,var(--cover),#171717 85%);position:relative;overflow:hidden}
.cover:after{content:"";position:absolute;width:150px;height:150px;border:1px solid #ffffff35;border-radius:50%;right:-45px;bottom:-55px;box-shadow:0 0 0 18px #ffffff0b,0 0 0 38px #ffffff08}
.cover small{font-size:9px;letter-spacing:2px;color:#ffffffb8;z-index:1}.cover strong{font-family:'Oswald',sans-serif;font-size:27px;line-height:1;text-transform:uppercase;max-width:95%;z-index:1;text-shadow:0 2px 8px #0008}
.card-info{padding:14px}.genre{font-size:10px;color:#f07870;text-transform:uppercase;letter-spacing:1px;font-weight:700}.card-info p{font-size:12px;line-height:1.6;color:var(--muted);margin:8px 0 0}
.banner{padding:30px;background:var(--panel);border-left:3px solid var(--red);display:flex;align-items:center;justify-content:space-between;gap:20px}
.banner h2{font-size:29px}.banner p{color:var(--muted);font-size:13px;line-height:1.6;margin:8px 0 0}
.page-intro{padding:55px 0 35px}.page-intro h1{font-size:54px;margin:12px 0}.page-intro p{color:var(--muted);line-height:1.7;max-width:650px}
.searchbar{display:flex;gap:10px;margin:25px 0}.searchbar input,.contact-form input,.contact-form textarea{width:100%;background:#1b1b1b;border:1px solid #393939;color:white;border-radius:4px;padding:14px;font:inherit;outline:none}.searchbar input:focus,.contact-form input:focus,.contact-form textarea:focus{border-color:var(--red)}
.searchbar input{max-width:420px}.empty{color:var(--muted);padding:25px 0}
.contact-layout{display:grid;grid-template-columns:1fr 1.2fr;gap:35px}.contact-panel{background:var(--panel);padding:25px;border:1px solid var(--line);border-radius:6px}.contact-panel h2{font-size:28px;margin-bottom:14px}.contact-panel p{color:var(--muted);line-height:1.8;font-size:14px}
.contact-form{display:grid;gap:13px}.contact-form label{font-size:12px;color:#d8d2ca}.contact-form textarea{min-height:130px;resize:vertical}.note{font-size:11px!important;color:#8e8982!important}
footer{border-top:1px solid var(--line);padding:25px 0;color:#89837c;font-size:12px;margin-top:45px}.footer-inner{display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap}
@media(max-width:900px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.nav{padding:15px 0;align-items:flex-start;flex-direction:column}.nav nav{gap:16px;flex-wrap:wrap}.nav-cta{display:none}.hero{padding:58px 0}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cover{height:160px}.contact-layout{grid-template-columns:1fr}.section-head{align-items:flex-start;flex-direction:column}.banner{align-items:flex-start;flex-direction:column}}
`;

function header(active) {
  return `<header><div class="wrap nav"><a class="logo" href="/">${SITE_NAME}<span>.</span></a><nav>
    <a class="${active === "home" ? "active" : ""}" href="/">Início</a>
    <a class="${active === "catalogo" ? "active" : ""}" href="/catalogo">Catálogo</a>
    <a class="${active === "contato" ? "active" : ""}" href="/contato">Contato</a>
    </nav><a class="nav-cta" href="/catalogo">EXPLORAR MANGÁS ↗</a></div></header>`;
}

function footer() {
  return `<footer><div class="wrap footer-inner"><span>© ${new Date().getFullYear()} ${SITE_NAME}. Projeto acadêmico.</span><span>Feito para quem vive boas histórias.</span></div></footer>`;
}

function mangaCard(m) {
  return `<article class="card" data-title="${m.title.toLowerCase()}" data-genre="${m.genre.toLowerCase()}">
    <div class="cover" style="--cover:${m.color}"><small>${m.tag}</small><strong>${m.title}</strong></div>
    <div class="card-info"><span class="genre">${m.genre}</span><p>${m.description}</p></div>
  </article>`;
}

function layout(active, content) {
  return `<!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="MangaVerse: explore um catálogo digital de mangás."><title>${SITE_NAME}</title><style>${styles}</style></head><body>
  ${header(active)}${content}${footer()}</body></html>`;
}

function homePage() {
  const featured = mangas.slice(0, 5).map(mangaCard).join("");
  return layout("home", `<main><section class="hero"><div class="wrap"><span class="eyebrow">SEU PRÓXIMO UNIVERSO COMEÇA AQUI</span>
    <h1>HISTÓRIAS QUE<br>VÃO ALÉM <span>DAS PÁGINAS.</span></h1>
    <p>Explore mundos, conheça personagens inesquecíveis e descubra sua próxima leitura. O MangaVerse reúne histórias para todos os tipos de leitores.</p>
    <a class="button" href="/catalogo">VER CATÁLOGO COMPLETO ↗</a></div></section>
    <section class="section wrap"><div class="section-head"><div><span class="eyebrow">UMA SELEÇÃO ESPECIAL</span><h2>EM DESTAQUE</h2><p>Algumas histórias para começar sua jornada.</p></div><a class="button" href="/catalogo">TODOS OS TÍTULOS</a></div>
    <div class="grid">${featured}</div></section>
    <section class="wrap"><div class="banner"><div><h2>QUAL SERÁ SUA PRÓXIMA LEITURA?</h2><p>Há dez universos esperando para serem explorados no nosso catálogo.</p></div><a class="button" href="/catalogo">EXPLORAR AGORA ↗</a></div></section></main>`);
}

function catalogPage() {
  return layout("catalogo", `<main class="wrap"><section class="page-intro"><span class="eyebrow">EXPLORE NOVOS UNIVERSOS</span><h1>CATÁLOGO DE MANGÁS</h1>
    <p>Uma seleção de obras de diferentes gêneros. Pesquise pelo título ou pelo gênero e encontre uma história para chamar de sua.</p>
    <div class="searchbar"><input id="search" type="search" placeholder="Pesquisar mangá ou gênero..." aria-label="Pesquisar mangá ou gênero"></div>
    <p id="count" class="note">Exibindo ${mangas.length} títulos.</p></section>
    <section class="section" style="padding-top:10px"><div class="grid" id="catalog-grid">${mangas.map(mangaCard).join("")}</div><p class="empty" id="empty" hidden>Nenhum mangá encontrado. Tente outra pesquisa.</p></section></main>
    <script>
      const search = document.getElementById("search");
      const cards = [...document.querySelectorAll("#catalog-grid .card")];
      const count = document.getElementById("count");
      const empty = document.getElementById("empty");
      search.addEventListener("input", () => {
        const term = search.value.toLowerCase().trim();
        let visible = 0;
        cards.forEach(card => {
          const match = card.dataset.title.includes(term) || card.dataset.genre.includes(term);
          card.hidden = !match;
          if (match) visible++;
        });
        count.textContent = "Exibindo " + visible + " de " + cards.length + " títulos.";
        empty.hidden = visible !== 0;
      });
    </script>`);
}

function contactPage() {
  return layout("contato", `<main class="wrap"><section class="page-intro"><span class="eyebrow">FALE COM A GENTE</span><h1>CONTATO</h1>
    <p>Tem uma sugestão de mangá, encontrou algum problema ou quer deixar uma mensagem? Este espaço é para você.</p></section>
    <section class="contact-layout section" style="padding-top:10px"><div class="contact-panel"><h2>VAMOS CONVERSAR?</h2>
      <p>O MangaVerse é um projeto desenvolvido para a atividade de Computação em Nuvem para Web II. A proposta é apresentar um catálogo simples, organizado e agradável para fãs de mangás.</p>
      <p><strong>Projeto:</strong> MangaVerse<br><strong>Categoria:</strong> Catálogo digital de mangás<br><strong>Tecnologia:</strong> Node.js</p>
      <p class="note">Este formulário é demonstrativo e não envia dados para um servidor.</p></div>
      <div class="contact-panel"><h2>ENVIE UMA MENSAGEM</h2><form class="contact-form" id="contact-form">
        <label for="name">Nome</label><input id="name" name="name" required placeholder="Seu nome">
        <label for="email">E-mail</label><input id="email" name="email" type="email" required placeholder="seuemail@exemplo.com">
        <label for="message">Mensagem</label><textarea id="message" name="message" required placeholder="Escreva sua mensagem..."></textarea>
        <button class="button" type="submit" style="border:0;cursor:pointer">ENVIAR MENSAGEM ↗</button>
        <p id="form-note" class="note" aria-live="polite"></p></form></div></section></main>
    <script>
      document.getElementById("contact-form").addEventListener("submit", event => {
        event.preventDefault();
        document.getElementById("form-note").textContent = "Mensagem registrada apenas nesta demonstração. Obrigado pelo contato!";
        event.target.reset();
      });
    </script>`);
}

const server = http.createServer((req, res) => {
  const path = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;
  console.log(`[${new Date().toISOString()}] Acesso recebido: ${req.method} ${path}`);
  if (path === "/" || path === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(homePage());
  }
  if (path === "/catalogo") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(catalogPage());
  }
  if (path === "/contato") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(contactPage());
  }
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(layout("", `<main class="wrap page-intro"><span class="eyebrow">ERRO 404</span><h1>PÁGINA NÃO ENCONTRADA</h1><p>Essa página não faz parte do nosso catálogo.</p><a class="button" href="/">VOLTAR AO INÍCIO</a></main>`));
});

server.listen(PORT, () => console.log(`${SITE_NAME} ativo na porta ${PORT}`));
