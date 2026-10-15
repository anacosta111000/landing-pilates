import { useEffect, useRef, useState } from "react";
import "./styles.css";

/* ---------- Config ---------- */
const WHATSAPP = "5521999999999"; // código do país + DDD + número, só dígitos
const HERO_IMG = ""; // ex.: "/hero.jpg" (coloque a foto na pasta public/). Vazio = mostra a coluna animada.

/* ---------- Ícones (SVG) ---------- */
const Icon = ({ children, size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ICONS = {
  spine: (
    <Icon>
      <rect x="9" y="2" width="6" height="4" rx="2" />
      <rect x="8" y="8" width="8" height="4" rx="2" />
      <rect x="9" y="14" width="6" height="4" rx="2" />
      <path d="M12 20v2" />
    </Icon>
  ),
  leaf: (
    <Icon>
      <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z" />
      <path d="M5 19 14 10" />
    </Icon>
  ),
  balance: (
    <Icon>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21h14M12 10v11" />
    </Icon>
  ),
  mat: (
    <Icon>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M7 12h10" />
    </Icon>
  ),
  reformer: (
    <Icon>
      <path d="M3 16h18M5 16v4M19 16v4" />
      <rect x="8" y="11" width="8" height="5" rx="1" />
      <path d="M3 12h3" />
    </Icon>
  ),
  mom: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </Icon>
  ),
};

function Lotus({ className = "" }) {
  return (
    <svg className={`lotus ${className}`} viewBox="0 0 120 80" fill="none" stroke="currentColor"
      strokeWidth="1.2" aria-hidden="true">
      <path d="M60 72C44 62 40 40 60 12c20 28 16 50 0 60z" />
      <path d="M60 72C38 70 22 54 20 34c22 2 36 16 40 38z" />
      <path d="M60 72c22-2 38-18 40-38-22 2-36 16-40 38z" />
      <path d="M60 72C30 76 10 66 4 50c20-4 40 4 56 22z" />
      <path d="M60 72c30 4 50-6 56-22-20-4-40 4-56 22z" />
    </svg>
  );
}

/* ---------- Hooks ---------- */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return y;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/* ---------- Componentes ---------- */
function Reveal({ delay = 0, className = "", children }) {
  const [ref, seen] = useInView(0.15);
  return (
    <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "" }) {
  const [ref, seen] = useInView(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf, t0;
    const step = (t) => {
      t0 = t0 ?? t;
      const p = Math.min((t - t0) / 1400, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// Coluna que começa torta, se alinha ao carregar e ondula de leve conforme a rolagem
function Spine({ scrollY }) {
  const [aligned, setAligned] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAligned(true), 350);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="spine" aria-hidden="true">
      {Array.from({ length: 18 }, (_, n) => {
        const x = aligned ? Math.sin(n * 0.6 + scrollY / 110) * 10 : Math.sin(n * 0.7) * 38;
        return (
          <i key={n} className={n % 3 === 0 ? "alt" : ""}
            style={{ width: 56 - n * 1.6, transform: `translateX(${x}px)`, transitionDelay: `${n * 40}ms` }} />
        );
      })}
    </div>
  );
}

// Esfera de respiração: 4s inspirando, 4s expirando
function Breath() {
  const [inhale, setInhale] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setInhale((v) => !v), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="breath">
      <div className="orb" />
      <p className="breath-text">{inhale ? "Inspire" : "Expire"}</p>
    </div>
  );
}

/* ---------- Dados ---------- */
const BENEFITS = [
  { icon: "spine", title: "Postura e dor nas costas", text: "Fortalecemos o centro do corpo para aliviar a sobrecarga na coluna." },
  { icon: "leaf", title: "Força sem impacto", text: "Exercícios leves para as articulações, com carga ajustada a cada aluno." },
  { icon: "balance", title: "Flexibilidade e equilíbrio", text: "Mais amplitude de movimento para o dia a dia e para outros esportes." },
];

const CLASSES = [
  { id: "solo", icon: "mat", name: "Pilates de solo", time: "50 min",
    text: "Exercícios no colchonete, com bolas e elásticos. Ótimo para começar.",
    points: ["Ideal para iniciantes", "Foco em postura e respiração", "Você aprende a repetir alguns exercícios em casa"] },
  { id: "aparelhos", icon: "reformer", name: "Pilates com aparelhos", time: "50 min",
    text: "Reformer, Cadillac e Chair para trabalhar força e controle com resistência de molas.",
    points: ["Carga ajustável ao seu nível", "Mais apoio para quem tem limitações", "Resultados de força mais rápidos"] },
  { id: "gestantes", icon: "mom", name: "Pilates para gestantes", time: "45 min",
    text: "Turma com liberação médica, focada em respiração, postura e mobilidade.",
    points: ["Exige liberação do obstetra", "Prepara o corpo para o parto", "Alivia dores lombares da gestação"] },
];

const PERIODS = [
  { name: "Manhã", days: "seg a sex", times: ["7h", "8h", "9h", "10h"] },
  { name: "Tarde", days: "seg a sex", times: ["14h", "15h", "16h"] },
  { name: "Noite", days: "seg a sex", times: ["18h", "19h", "20h"] },
  { name: "Sábado", days: "sábado", times: ["8h", "9h"] },
];

const STATS = [
  { to: 300, suffix: "+", label: "alunos já treinaram aqui" },
  { to: 6, suffix: " anos", label: "de estúdio" },
  { to: 4, suffix: "", label: "alunos por turma, no máximo" },
];

/* ---------- Página ---------- */
export default function App() {
  const scrollY = useScrollY();
  const [classId, setClassId] = useState("solo");
  const [periodIdx, setPeriodIdx] = useState(0);
  const [slot, setSlot] = useState("");
  const [nome, setNome] = useState("");

  const current = CLASSES.find((c) => c.id === classId);
  const period = PERIODS[periodIdx];

  const chooseSlot = (time) => {
    setSlot(`${period.name} (${period.days}), ${time}`);
    document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" });
  };

  const submit = (e) => {
    e.preventDefault();
    const msg = `Olá! Meu nome é ${nome.trim()} e gostaria de agendar uma aula experimental${slot ? `, de preferência: ${slot}` : ""}.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  return (
    <>
      <header className={scrollY > 10 ? "scrolled" : ""}>
        <div className="wrap">
          <a className="logo" href="#">Studio Prumo</a>
          <a className="btn small" href="#agendar">Agendar aula</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <Lotus className="lotus-hero" />
          <div className="wrap hero-grid">
            <div>
              <h1>Mova-se com mais controle e menos dor.</h1>
              <p className="lead">
                Pilates em turmas de até 4 pessoas, com instrutora ao seu lado em todo o treino.
                Sua primeira aula é por nossa conta.
              </p>
              <a className="btn" href="#agendar">Quero minha aula experimental</a>
              <p className="note">Sem compromisso. Venha de roupa confortável, nós cuidamos do resto.</p>
            </div>
            <div className="hero-visual">
              {HERO_IMG ? (
                <img className="arch" src={HERO_IMG} alt="Aluna fazendo pilates no estúdio" />
              ) : (
                <>
                  <Spine scrollY={scrollY} />
                  <p className="spine-label">Prumo: o eixo que sustenta o movimento.</p>
                </>
              )}
            </div>
          </div>
          <dl className="wrap stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt><CountUp to={s.to} suffix={s.suffix} /></dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <div className="wrap">
            <h2>Para quem passa o dia sentado, em pé ou correndo.</h2>
            <p>O pilates trabalha o corpo todo, no seu ritmo. Serve para quem está começando e para quem já treina.</p>
            <div className="benefits">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 120}>
                  <span className="badge">{ICONS[b.icon]}</span>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="dark" id="aulas">
          <Lotus className="lotus-dark" />
          <div className="wrap">
            <h2>Nossas aulas</h2>
            <p>Toda turma começa com uma avaliação rápida, para a instrutora ajustar os exercícios ao seu corpo.</p>
            <div className="tabs" role="tablist" aria-label="Tipos de aula">
              {CLASSES.map((c) => (
                <button key={c.id} role="tab" aria-selected={c.id === classId}
                  className={c.id === classId ? "tab on" : "tab"} onClick={() => setClassId(c.id)}>
                  {ICONS[c.icon]}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
            <div className="panel" key={current.id} role="tabpanel">
              <div>
                <h3>{current.name} <small>{current.time}</small></h3>
                <p>{current.text}</p>
              </div>
              <ul>
                {current.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="lav">
          <div className="wrap split">
            <div>
              <h2>Respire antes de começar.</h2>
              <p>Toda aula começa assim: três minutos de respiração para soltar o corpo e focar no movimento. Acompanhe o ritmo.</p>
              <Breath />
            </div>
            <div className="quotes">
              <Reveal>
                <blockquote>
                  "Em um mês, a dor no ombro que me acompanhava no trabalho diminuiu bastante."
                  <footer>Mariana, aluna desde 2024 (depoimento fictício)</footer>
                </blockquote>
              </Reveal>
              <Reveal delay={150}>
                <blockquote>
                  "As turmas são pequenas e a instrutora corrige cada detalhe. Me sinto segura treinando."
                  <footer>Carlos, aluno desde 2025 (depoimento fictício)</footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="horarios">
          <div className="wrap">
            <h2>Escolha seu horário</h2>
            <p>Clique em um horário para levá-lo ao pedido de aula experimental.</p>
            <div className="tabs light" role="tablist" aria-label="Períodos">
              {PERIODS.map((p, i) => (
                <button key={p.name} role="tab" aria-selected={i === periodIdx}
                  className={i === periodIdx ? "tab on" : "tab"} onClick={() => setPeriodIdx(i)}>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
            <p className="days">{period.days}</p>
            <div className="chips">
              {period.times.map((t) => (
                <button key={t} className="chip" onClick={() => chooseSlot(t)}>{t}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="booking" id="agendar">
          <div className="wrap">
            <h2>Agende sua aula experimental</h2>
            <p>Preencha o nome e continue a conversa pelo WhatsApp. Respondemos no mesmo dia.</p>
            <form onSubmit={submit}>
              <label>
                Seu nome
                <input value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" />
              </label>
              <p className="slot">
                {slot ? <>Horário escolhido: <strong>{slot}</strong></> : "Nenhum horário escolhido ainda (opcional)."}
              </p>
              <button className="btn" type="submit">Enviar pelo WhatsApp</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="wrap">
          <div>Studio Prumo Pilates<br />Rua das Palmeiras, 120, Centro (endereço fictício)</div>
          <div>Projeto de demonstração criado para portfólio.</div>
        </div>
      </footer>
    </>
  );
}
