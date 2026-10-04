const chat = document.getElementById("chat");
const form = document.getElementById("form");
const texto = document.getElementById("texto");
const sugestoes = document.getElementById("sugestoes");

const historico = [];
const perfil = { etapa: 0, area: "" };

const carreiras = {
  programacao: {
    nome: "Desenvolvimento de software",
    palavras: ["program", "dev", "código", "codigo", "software", "site", "javascript", "python"],
    passos: [
      "Aprenda HTML, CSS e JavaScript até conseguir montar uma página sozinho.",
      "Faça 3 projetos pequenos e suba no GitHub (portfólio).",
      "Mostre os projetos em perfis e peça feedback de quem já trabalha na área."
    ],
  },
  dados: {
    nome: "Análise de dados",
    palavras: ["dado", "analis", "excel", "sql", "planilha", "dashboard"],
    passos: [
      "Aprenda Excel/Planilhas bem a fundo e depois SQL básico.",
      "Pegue uma base pública e responda perguntas reais com ela.",
      "Monte 2 análises explicadas de forma simples para o portfólio."
    ],
  },
  design: {
    nome: "Design",
    palavras: ["design", "figma", "visual", "ui", "ux", "logo"],
    passos: [
      "Aprenda os fundamentos: cores, tipografia e espaçamento.",
      "Treine refazendo telas de apps que você já usa (Figma tem plano grátis).",
      "Junte 3 trabalhos num portfólio, mostrando o raciocínio de cada um."
    ],
  },
  marketing: {
    nome: "Marketing digital",
    palavras: ["market", "venda", "rede social", "instagram", "anuncio", "anúncio", "conteudo", "conteúdo"],
    passos: [
      "Aprenda o básico de conteúdo e tráfego orgânico.",
      "Cuide de uma página de verdade (a sua, de um amigo, de um negócio pequeno).",
      "Registre resultados com números e use como prova de que sabe fazer."
    ],
  },
};

function detectarCarreira(txt) {
  for (const chave in carreiras) {
    if (carreiras[chave].palavras.some((p) => txt.includes(p))) return chave;
  }
  return null;
}

// Essa função FINGE ser a API. Recebe o histórico e devolve uma Promise com texto.
// Quando tiver uma chave funcionando, é aqui que entra o fetch.
async function responderMentor(historico) {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 900));
  const msg = historico[historico.length - 1].content.toLowerCase();

  if (msg.includes("recome")) {
    perfil.etapa = 1;
    perfil.area = "";
    return "Bora de novo! Qual área te chama mais atenção: programação, dados, design ou marketing?";
  }

  if (perfil.etapa === 0) {
    perfil.etapa = 1;
    return "Legal, vamos por partes. Qual área te chama mais atenção: programação, dados, design ou marketing?";
  }

  if (perfil.etapa === 1) {
    const c = detectarCarreira(msg);
    if (!c) return "Não consegui identificar a área. Tenta uma destas: programação, dados, design ou marketing.";
    perfil.area = c;
    perfil.etapa = 2;
    return `${carreiras[c].nome}, boa pra explorar. Você já tem alguma experiência ou tá começando do zero?`;
  }

  if (perfil.etapa === 2) {
    perfil.etapa = 3;
    return "Anotado. Quantas horas por semana você consegue estudar?";
  }

  if (perfil.etapa === 3) {
    perfil.etapa = 4;
    const c = carreiras[perfil.area];
    const passos = c.passos.map((p, i) => `${i + 1}. ${p}`).join("\n");
    return `Plano inicial pra ${c.nome}:\n\n${passos}\n\nO ritmo depende das suas horas, e o mais importante é ter coisa pra mostrar. Quer falar de currículo, entrevista ou salário?`;
  }

  if (msg.includes("curr")) return "Currículo: poucas linhas, foco no que você fez (projetos e resultados), e o link do portfólio bem visível. Evita enrolação.";
  if (msg.includes("entrev")) return "Entrevista: treine contar seus projetos em 1 minuto, explicando o problema, o que você fez e o que aprendeu. Pesquise a empresa antes.";
  if (msg.includes("sal")) return "Salário varia muito por cidade, empresa e nível. Pesquisa vagas reais em sites de emprego pra ter uma noção atual, em vez de confiar em número solto.";
  return "Posso falar de currículo, entrevista ou salário. Ou digita 'recomeçar' pra montar outro plano.";
}

function adicionarMsg(papel, conteudo) {
  const div = document.createElement("div");
  div.className = `msg ${papel}`;
  div.textContent = conteudo;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function adicionarDigitando() {
  const div = document.createElement("div");
  div.className = "msg assistant digitando";
  div.innerHTML = "<span></span><span></span><span></span>";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function atualizarSugestoes() {
  const opcoes = { 1: ["Programação", "Dados", "Design", "Marketing"], 4: ["Currículo", "Entrevista", "Salário", "Recomeçar"] };
  sugestoes.innerHTML = "";
  (opcoes[perfil.etapa] || []).forEach((t) => {
    const b = document.createElement("button");
    b.textContent = t;
    b.onclick = () => enviar(t);
    sugestoes.appendChild(b);
  });
}

async function enviar(msg) {
  adicionarMsg("user", msg);
  historico.push({ role: "user", content: msg });
  sugestoes.innerHTML = "";
  const digitando = adicionarDigitando();
  const resposta = await responderMentor(historico);
  digitando.remove();
  adicionarMsg("assistant", resposta);
  historico.push({ role: "assistant", content: resposta });
  atualizarSugestoes();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = texto.value.trim();
  if (!msg) return;
  texto.value = "";
  enviar(msg);
});

adicionarMsg("assistant", "Oi! Eu sou seu mentor de carreiras. Me conta: o que te trouxe aqui?");
