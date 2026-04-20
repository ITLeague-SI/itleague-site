/* eslint-disable @next/next/no-img-element */

import { CodeBlock } from "./components/CodeBlock";
import { KyivClock } from "./components/KyivClock";
import {
  loadExperts,
  loadFaqs,
  loadHeroSlides,
  loadTestimonials,
} from "@/lib/content/loader";

const asset = (id: string) => `/api/figma-assets/${id}`;

const assets = {
  logo: asset("cbf7e2a1-ea71-4cfd-8269-c8cfb9f87010"),
  wordmark: asset("8ea2d415-a834-429e-b5c4-c31f8557a711"),
  arrowDark: asset("bf119f8a-29c2-4550-9672-56b69219d338"),
  arrowLight: asset("f7076055-8cfa-4dae-8c06-75ecaf354609"),
  grid: asset("a42716ae-7727-41dd-94af-04459865de42"),
  ctaGrid: asset("03a3c525-90dc-47e4-a9f4-de700c0fe356"),
  cup: asset("d7c294d6-d7bc-49ad-971b-2bf660fe1e85"),
  founders: [
    asset("7b4def25-514b-4ce7-9779-c25f7ae4267c"),
    asset("b26efb79-0a06-40d1-9372-e1c46fffb18a"),
  ],
  footerLogo: asset("46c0f0f9-0326-4754-8d8e-33029113e1f2"),
  instagram: asset("a84c3095-9e1c-41d6-8015-3dd26a94fa3f"),
  email: asset("73a41731-3c45-43d4-b572-aa41f4a59e6d"),
};

const features = [
  "Система оцінки талантів",
  "Рейтинги Backend-фахівців",
  "Реальні кейси, реальні задачі",
  "Змагання, а не навчання",
  "Турніри та сезони",
  "Інженерний підхід",
];

const levels = [
  ["01 Level", "Junior", "Почни з основ", "і спробуй систему", 1],
  ["02 Level", "Middle", "Відточуй навички", "та рости в рейтингу", 2],
  ["03 Level", "Senior", "Контролюй складність", "і доводь рівень", 3],
] as const;

const tariffs = [
  ["Free trial", "Безкоштовно", "", "Для старту та знайомства", "з системою", "Обрати free trial"],
  ["Basic", "₴1.900", "/3 міс", "Для старту та знайомства", "з системою", "Обрати basic"],
  ["Core", "₴5.500", "/3 міс", "Для активного росту", "та змагань", "Обрати core"],
  ["Pro", "₴19.900", "/3 міс", "Максимальні можливості", "для професіоналів", "Обрати pro"],
] as const;

const comparison = [
  ["Доступ до контенту", "частково", "✅", "✅", "✅"],
  ["Тренувальні турніри", "3", "9", "9", "9"],
  ["Рейтингові турніри", "1", "3", "3", "3"],
  ["Оцінка журі", "❌", "❌", "✅", "✅\nпріоритет"],
  ["Сезонні досягнення", "❌", "✅", "✅", "✅"],
  ["Промо робіт у соцмережах", "❌", "✅", "✅\nтопи", "✅\nпріоритет"],
  ["Доступ до ком'юніті", "обмежений\n(доступ до частини контенту)", "✅\n(можна спілкуватися, писати, обговорювати)", "✅\n(повний доступ + участь у щомісячних фідбек-сесіях)", "✅ VIP\n(закриті чати з менторами, пріоритет у Q&A, активності)"],
  ["Живі трансляції із розбором робіт", "❌", "✅\n(лише спостерігач)", "✅", "✅"],
  ["Щомісячна загальна фідбек-сесія з експертами", "❌", "❌", "✅", "✅"],
  ["Персональний review коду (архітектура + performance)", "❌", "❌", "❌", "🔥\nповний 1:1 review"],
  ["1:1 менторські сесії", "❌", "❌", "❌", "✅"],
  ["Early access до наступного сезону", "❌", "❌", "❌", "✅"],
  ["Переваги у викликах від компаній", "❌", "❌", "❌", "✅"],
  ["Сертифікат", "❌", "season pass", "учасник / топ-10\n→ із балами та місцем у рейтингу", "PRO\n+ рекомендація*"],
];

function Button({
  children,
  variant = "ghost",
}: {
  children: React.ReactNode;
  variant?: "primary" | "light" | "ghost";
}) {
  return (
    <a className={`button button-${variant}`} href="#prices">
      <span>{children}</span>
      {variant !== "primary" && (
        <img alt="" aria-hidden="true" src={variant === "light" ? assets.arrowDark : assets.arrowLight} />
      )}
    </a>
  );
}

function Shell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`section-shell ${className}`} id={id}>
      <div className="section-inner">{children}</div>
    </section>
  );
}

function Gallery({ photos, double = false }: { photos: string[]; double?: boolean }) {
  return (
    <div className="gallery">
      <div className="gallery-row">
        {photos.map((photo, index) => (
          <div className="gallery-photo" key={`${photo}-${index}`}>
            <img alt="" src={photo} />
          </div>
        ))}
      </div>
      {double && (
        <div className="gallery-row gallery-row-reverse">
          {[...photos].reverse().map((photo, index) => (
            <div className="gallery-photo" key={`${photo}-reverse-${index}`}>
              <img alt="" src={photo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function Home() {
  const [heroSlides, testimonials, experts, faqs] = await Promise.all([
    loadHeroSlides(),
    loadTestimonials(),
    loadExperts(),
    loadFaqs(),
  ]);

  const heroPhotos = heroSlides.map((s) => s.photo_url);
  const testimonialPhotos = testimonials
    .map((t) => t.photo_url)
    .filter((url): url is string => Boolean(url));
  const featuredTestimonial = testimonials[0];

  return (
    <main className="site">
      <header className="header">
        <input className="menu-checkbox" id="site-menu-toggle" type="checkbox" aria-label="Toggle navigation menu" />
        <a className="header-logo" href="#">
          <img alt="IT League" src={assets.logo} />
          <span>Backend</span>
        </a>
        <nav className="nav" aria-label="Основна навігація">
          <a href="#about">Про лігу</a>
          <a href="#prices">Пакети</a>
          <a href="#judges">Судді</a>
          <a href="#faq">FAQ</a>
        </nav>
        <label className="menu-toggle" htmlFor="site-menu-toggle" aria-label="Open menu">
          <span />
          <span />
          <span />
        </label>
        <a className="header-cta" href="#prices">
          <span>Стати учасником</span>
          <img alt="" aria-hidden="true" src={assets.arrowDark} />
        </a>
        <div className="mobile-nav-panel">
          <a href="#about">РџСЂРѕ Р»С–РіСѓ</a>
          <a href="#prices">РџР°РєРµС‚Рё</a>
          <a href="#judges">РЎСѓРґРґС–</a>
          <a href="#faq">FAQ</a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-meta">
            <CodeBlock lines={[["System status", "active"], ["Mode", "competitive"], ["Access", "open"]]} />
            <KyivClock />
          </div>
          <div className="hero-title">
            <img alt="IT League Backend" className="hero-wordmark" src={assets.wordmark} />
            <div className="badge">T Title</div>
            <h1>
              <span>Система</span>
              <span>Точність</span>
              <span>Складність</span>
            </h1>
            <p>
              В IT-League Backend ти ростеш, коли змагаєшся
              <br />
              Тут не вчать — тут перевіряють
            </p>
          </div>
          <Gallery photos={heroPhotos} />
          <p className="system-small">{"// System.feed.active"}</p>
        </div>
      </section>

      <Shell id="about" className="about">
        <div className="about-grid">
          <div className="panel about-copy">
            <CodeBlock tone="neutral" lines={[["Module", "core system"], ["Type", "competitive environment"], ["Purpose", "skill verification"]]} />
            <div>
              <h2>Інженерний спорт для Backend-фахівців</h2>
              <ul>
                <li>Система турнірів, рейтингів і сезонів</li>
                <li>Тут зростають через змагання, а не лекції</li>
                <li>Оцінка від практикуючих експертів галузі</li>
              </ul>
            </div>
          </div>
          <div className="panel illustration-panel">
            <div className="badge">I Illustration</div>
            <div className="loop">
              {["SOLVE", "RANK", "GROW", "REPEAT"].map((item) => (
                <span key={item}>{item}</span>
              ))}
              <div className="loop-core" />
            </div>
          </div>
        </div>
      </Shell>

      <Shell className="difference">
        <CodeBlock tone="blue" lines={[["Training mode", "off"], ["Verification", "on"], ["Progression", "ranking-based"]]} />
        <h2 className="center-title">
          Не курс
          <br />
          Не менторство
          <br />
          Це — ліга
        </h2>
        <div className="feature-wrap">
          <div className="badge">F Feature-cards</div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className={index === 0 ? "feature-card active" : "feature-card"} key={feature}>
                <span className="feature-icon" />
                <p>{feature}</p>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      <Shell className="levels-section">
        <CodeBlock lines={[["Entry level", "allowed"], ["Growth path", "adaptive"], ["Difficulty", "scalable"]]} />
        <h2>Одна ліга. Різні рівні</h2>
        <div className="levels">
          {levels.map(([level, title, line1, line2, bars]) => (
            <article className="level" key={level}>
              <div className="level-squares">
                {Array.from({ length: bars }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div>
                <p className="system-small">{level}</p>
                <h3>{title}</h3>
                <p>
                  {line1}
                  <br />
                  {line2}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Shell>

      <section className="mini-cta">
        <img alt="" aria-hidden="true" src={assets.grid} />
        <h2>
          Безкоштовно — щоб спробувати
          <br />
          Платно — щоб рости
        </h2>
        <div className="cta-buttons">
          <Button variant="primary">Прийняти виклик</Button>
          <Button>Спробувати безкоштовно</Button>
        </div>
      </section>

      <Shell id="judges" className="judges-section">
        <CodeBlock lines={[["Review process", "manual"], ["Judges", "industry experts"], ["Evaluation", "multi-layer"]]} />
        <h2>Експерти галузі</h2>
        <div className="judge-grid">
          {experts.map((expert, index) => (
            <article className="judge-card" key={`${expert.id}-${index}`}>
              <div className={index === 3 ? "judge-photo judge-photo-featured" : "judge-photo"}>
                {expert.photo_url && <img alt={expert.name} src={expert.photo_url} />}
                {index === 3 && <Button>Детальніше</Button>}
              </div>
              <h3>{expert.name}</h3>
              {expert.role && <p>{expert.role}</p>}
            </article>
          ))}
        </div>
      </Shell>

      <section className="prices" id="prices">
        <div className="prices-inner">
          <CodeBlock tone="blue" lines={[["Access tiers", "available"], ["Core tier", "extended system access"]]} />
          <h2>Обери свій рівень участі</h2>
          <div className="tariffs">
            {tariffs.map(([name, price, period, line1, line2, cta], index) => (
              <article className={index === 2 ? "tariff featured" : "tariff"} key={name}>
                <p className="tariff-name">{name}</p>
                <div>
                  <p className="price">
                    {price}
                    {period && <span>{period}</span>}
                  </p>
                  <p className="tariff-description">
                    {line1}
                    <br />
                    {line2}
                  </p>
                </div>
                <Button variant={index === 2 ? "light" : "ghost"}>{cta}</Button>
              </article>
            ))}
          </div>
          <div className="comparison" aria-label="Порівняння тарифів">
            <div className="comparison-row comparison-head">
              {["Можливість", "Безкоштовно", "Basic", "Core", "Pro"].map((cell) => (
                <div key={cell}>{cell}</div>
              ))}
            </div>
            {comparison.map((row) => (
              <div className="comparison-row" key={row[0]}>
                {row.map((cell, index) => (
                  <div className={index === 3 ? "core-cell" : ""} key={`${row[0]}-${index}`}>
                    {cell.split("\n").map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Shell className="growth">
        <CodeBlock tone="blue" lines={[["Flow type", "sequential"], ["Evaluation", "after each step"], ["Ranking update", "continuous"]]} />
        <h2>П&apos;ять кроків до росту</h2>
        <div className="growth-line">
          {["Реєстрація", "Вибір турніру", "Виконання задач", "Оцінка та рейтинг", "Зростання у лізі"].map((step, index) => (
            <article className="growth-step" key={step}>
              <h3>{step}</h3>
              <div className="growth-dot" />
              <p>{String(index + 1).padStart(2, "0")}</p>
            </article>
          ))}
        </div>
      </Shell>

      <Shell className="founders">
        <CodeBlock lines={[["System origin", "competitive practice"], ["Experience", "proven"], ["RIterations", "multiple seasons"]]} />
        <div className="founders-card">
          <h2>Засновники IT-League</h2>
          <div className="badge">F Founders</div>
          <div className="founder-photos">
            {assets.founders.map((photo) => (
              <img alt="" key={photo} src={photo} />
            ))}
            <span>&amp;</span>
          </div>
          <h3>Ігор Беспалов і Стас Малкін</h3>
          <p className="system-small">Co-founders</p>
        </div>
        <div className="founders-bottom">
          <p>Ми провели десятки турнірів для кількох десятків тисяч учасників. IT-League — еволюція цього досвіду у форматі інженерної ліги.</p>
          <div className="numbers">
            {[
              ["50+", "Турнірів"],
              ["10K+", "Учасників"],
              ["5", "Років"],
            ].map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      <Shell className="testimonials">
        <CodeBlock lines={[["Feedback source", "participants"], ["Verification", "post-competition"], ["Filtering", "minimal"]]} />
        <h2>Що кажуть учасники</h2>
        {testimonialPhotos.length > 0 && (
          <Gallery photos={testimonialPhotos} double />
        )}
        {featuredTestimonial && (
          <div className="quote">
            <button aria-label="Попередній відгук">‹</button>
            <blockquote>
              &quot;{featuredTestimonial.quote}&quot;
              <cite>
                <strong>{featuredTestimonial.author_name}</strong>
                {featuredTestimonial.author_role && (
                  <span>{featuredTestimonial.author_role}</span>
                )}
              </cite>
            </blockquote>
            <button aria-label="Наступний відгук">›</button>
          </div>
        )}
      </Shell>

      <Shell id="faq" className="faq-section">
        <CodeBlock lines={[["System clarity", "required"], ["Ambiguity", "reduced"], ["Rules", "transparent"]]} />
        <h2>Є питання</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.id} open={Boolean(faq.answer)}>
              <summary>{faq.question}</summary>
              {faq.answer && <p>{faq.answer}</p>}
            </details>
          ))}
        </div>
      </Shell>

      <section className="final-cta">
        <img alt="" aria-hidden="true" className="final-grid" src={assets.ctaGrid} />
        <div>
          <h2>Вхід у інженерну лігу починається тут</h2>
          <p>
            Приєднуйся до спільноти backend-розробників,
            <br />
            які зростають через змагання
          </p>
          <div className="cta-buttons">
            <Button variant="primary">Прийняти виклик</Button>
            <Button>Спробувати безкоштовно</Button>
          </div>
        </div>
        <img alt="" aria-hidden="true" className="cup" src={assets.cup} />
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo">
            <img alt="IT League" src={assets.footerLogo} />
            <span>Backend</span>
          </div>
          <div className="contacts">
            <a aria-label="Instagram" href="#">
              <img alt="" src={assets.instagram} />
            </a>
            <a aria-label="Email" href="mailto:hello@it-league.ua">
              <img alt="" src={assets.email} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 IT-League. Всі права захищено.</p>
          <p>{"// System.status: stable"}</p>
          <p>v1.0.0 — Kyiv, Ukraine</p>
        </div>
      </footer>
    </main>
  );
}
