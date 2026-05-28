import {
  experts,
  faqs,
  galleryRow1,
  galleryRow2,
  heroSlides,
  pricingFeatures,
  pricingTiers,
  testimonials,
} from "@/lib/content";
import { figmaAsset as asset } from "@/lib/figma-asset";
import { AboutLoop } from "./components/AboutLoop";
import { AssetImage } from "./components/AssetImage";
import { CodeBlock } from "./components/CodeBlock";
import { ExpertCard } from "./components/ExpertCard";
import { FreeTrialButton } from "./components/FreeTrialButton";
import { GrowthSteps } from "./components/GrowthSteps";
import { KyivClock } from "./components/KyivClock";
import { MobileMenu } from "./components/MobileMenu";
import { PaymentSuccessBanner } from "./components/PaymentSuccessBanner";
import { SeasonProgression } from "./components/SeasonProgression";
import { TestimonialsCarousel } from "./components/TestimonialsCarousel";

const navItems = [
  { href: "#about", label: "Про лігу" },
  { href: "#prices", label: "Пакети" },
  { href: "#judges", label: "Судді" },
  { href: "#faq", label: "FAQ" },
];

const assets = {
  logo: asset("cbf7e2a1-ea71-4cfd-8269-c8cfb9f87010"),
  logoMark: asset("b3c4d5e6-header-logo-mark"),
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
  { label: "Система оцінки талантів",    icon: asset("e1a2b3c4-feat-medal-one-icon") },
  { label: "Рейтинги Backend-фахівців",  icon: asset("e2b3c4d5-feat-ranking-icon")   },
  { label: "Реальні кейси, реальні задачі", icon: asset("e3c4d5e6-feat-computer-icon") },
  { label: "Змагання, а не навчання",    icon: asset("e4d5e6f7-feat-arena-icon")     },
  { label: "Турніри та сезони",          icon: asset("e5e6f7a8-feat-trophy-icon")    },
  { label: "Інженерний підхід",          icon: asset("e6f7a8b9-feat-people-icon")    },
];

const levels = [
  ["01 Level", "Junior", "Почни з основ", "і спробуй систему", 1],
  ["02 Level", "Middle", "Відточуй навички", "та рости в рейтингу", 2],
  ["03 Level", "Senior", "Контролюй складність", "і доводь рівень", 3],
] as const;

function Button({
  children,
  variant = "ghost",
  href = "#prices",
}: {
  children: React.ReactNode;
  variant?: "primary" | "light" | "ghost";
  href?: string;
}) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  return (
    <a
      className={`button button-${variant}`}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <span>{children}</span>
      {variant !== "primary" && (
        <AssetImage
          ariaHidden
          width={16}
          height={16}
          src={variant === "light" ? assets.arrowDark : assets.arrowLight}
        />
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

function Gallery({
  photos,
  photosRow2,
  double = false,
}: {
  photos: string[];
  photosRow2?: string[];
  double?: boolean;
}) {
  // Duplicate items so the seamless marquee loop works (animate -50% → back to 0)
  const row1 = [...photos, ...photos];
  // If a dedicated second-row set is provided, use it; otherwise mirror the first row.
  const row2Source = photosRow2 && photosRow2.length > 0 ? photosRow2 : [...photos].reverse();
  const row2 = [...row2Source, ...row2Source];

  return (
    <div className="gallery">
      <div className="gallery-row" aria-hidden="true">
        {row1.map((photo, index) => (
          <div className="gallery-photo" key={`r1-${photo}-${index}`}>
            <AssetImage src={photo} sizes="228px" />
          </div>
        ))}
      </div>
      {double && (
        <div className="gallery-row gallery-row-reverse" aria-hidden="true">
          {row2.map((photo, index) => (
            <div className="gallery-photo" key={`r2-${photo}-${index}`}>
              <AssetImage src={photo} sizes="228px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const heroPhotos = heroSlides.map((s) => s.photo_url);

  return (
    <main className="site">
      <PaymentSuccessBanner />
      <header className="header">
        <a className="header-logo" href="#">
          <AssetImage src={assets.logo} alt="IT League" width={154} height={24} priority />
          <span>Backend</span>
        </a>
        {/* Compact 24×24 mark shown on tablet/mobile in place of the wordmark. */}
        <a className="header-logo-mark" href="#" aria-label="IT League">
          <AssetImage src={assets.logoMark} alt="" ariaHidden width={24} height={24} />
        </a>
        <nav className="nav" aria-label="Основна навігація">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <MobileMenu items={navItems} />
        <a className="header-cta" href="#prices">
          <span>Стати учасником</span>
          <AssetImage ariaHidden src={assets.arrowDark} width={16} height={16} />
        </a>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-meta">
            <CodeBlock lines={[["System status", "active"], ["Mode", "competitive"], ["Access", "open"]]} />
            <KyivClock />
          </div>
          <div className="hero-title">
            <h1 className="hero-headline">
              <span className="sr-only">
                IT League Backend — інженерний спорт для backend-фахівців. Система. Точність. Складність.
              </span>
              <AssetImage
                ariaHidden
                className="hero-wordmark"
                src={assets.wordmark}
                width={243}
                height={26}
                priority
              />
              <span className="hero-tagline" aria-hidden="true">
                <span>Система</span>
                <span>Точність</span>
                <span>Складність</span>
              </span>
            </h1>
            <p>В IT-League Backend ти ростеш, коли змагаєшся.</p>
            <p>Тут не вчать — тут перевіряють.</p>
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
            <AboutLoop />
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
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.label}>
                <AssetImage
                  src={feature.icon}
                  alt=""
                  ariaHidden
                  width={48}
                  height={48}
                  className="feature-icon"
                />
                <p>{feature.label}</p>
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
                  <svg
                    key={index}
                    className="level-square"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    aria-hidden="true"
                  >
                    {/* Both icons use <path/> so SVG renders them through
                        identical anti-aliasing logic — keeps the stroke
                        colour visually consistent between plain & notched. */}
                    <path
                      d={
                        index === 0
                          ? /* Notched square — cut at TOP-RIGHT to match
                               Figma node 23:237 (Junior). */
                            "M0.5 0.5 H31 L47.5 16.5 V47.5 H0.5 Z"
                          : /* Plain bordered square. */
                            "M0.5 0.5 H47.5 V47.5 H0.5 Z"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinejoin="miter"
                    />
                  </svg>
                ))}
              </div>
              <div className="level-description">
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
        {/* Decorative absolute-positioned grid texture; keep raw <img> to preserve absolute inset CSS. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" aria-hidden="true" src={assets.grid} loading="lazy" decoding="async" />
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
            <ExpertCard key={`${expert.id}-${index}`} expert={expert} />
          ))}
        </div>
      </Shell>

      <section className="prices" id="prices">
        <div className="prices-inner">
          <CodeBlock tone="blue" lines={[["Access tiers", "available"], ["Core tier", "extended system access"]]} />
          <h2>Обери свій рівень участі</h2>
          <div className="tariffs">
            {pricingTiers.map((tier, index) => (
              <article
                className={index === 2 ? "tariff featured" : "tariff"}
                key={tier.id}
              >
                <p className="tariff-name">{tier.name}</p>
                <div>
                  <p className="price">
                    {tier.price}
                    {tier.period && <span>{tier.period}</span>}
                  </p>
                  <p className="tariff-description">
                    {tier.description_top}
                    {tier.description_bottom && (
                      <>
                        <br />
                        {tier.description_bottom}
                      </>
                    )}
                  </p>
                </div>
                {tier.paymentUrl ? (
                  <Button
                    variant={index === 2 ? "light" : "ghost"}
                    href={tier.paymentUrl}
                  >
                    {tier.cta_label}
                  </Button>
                ) : (
                  /* Free trial — open a popup form instead of redirecting. */
                  <FreeTrialButton
                    variant={index === 2 ? "light" : "ghost"}
                    arrowSrc={
                      index === 2 ? assets.arrowDark : assets.arrowLight
                    }
                    label={tier.cta_label}
                  />
                )}
              </article>
            ))}
          </div>
          <div className="comparison" aria-label="Порівняння тарифів">
            <div className="comparison-row comparison-head">
              {["Можливість", "Безкоштовно", "Basic", "Core", "Pro"].map((cell) => (
                <div key={cell}>{cell}</div>
              ))}
            </div>
            {pricingFeatures.map((feature) => {
              const cells: Array<{ key: string; value: string; core: boolean }> = [
                { key: "label", value: feature.label, core: false },
                { key: "free", value: feature.value_free, core: false },
                { key: "basic", value: feature.value_basic, core: false },
                { key: "core", value: feature.value_core, core: true },
                { key: "pro", value: feature.value_pro, core: false },
              ];
              return (
                <div className="comparison-row" key={feature.id}>
                  {cells.map((cell) => (
                    <div
                      key={cell.key}
                      className={cell.core ? "core-cell" : ""}
                    >
                      {cell.value.split("\n").map((line, i) => (
                        <span key={i}>{line}</span>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Shell className="growth">
        <CodeBlock tone="blue" lines={[["Flow type", "sequential"], ["Evaluation", "after each step"], ["Ranking update", "continuous"]]} />
        <div className="growth-body">
          <h2>П&apos;ять кроків до росту</h2>
          <GrowthSteps />
        </div>
      </Shell>

      <Shell className="season">
        <SeasonProgression />
      </Shell>

      <Shell className="founders">
        <CodeBlock lines={[["System origin", "competitive practice"], ["Experience", "proven"], ["Iterations", "multiple seasons"]]} />
        <div className="founders-card">
          <h2>Засновники IT-League</h2>
          <div className="founder-photos">
            {assets.founders.map((photo) => (
              <div className="founder-photo" key={photo}>
                <AssetImage
                  ariaHidden
                  src={photo}
                  sizes="(max-width: 768px) 50vw, 320px"
                />
              </div>
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
        {galleryRow1.length > 0 && (
          <Gallery photos={galleryRow1} photosRow2={galleryRow2} double />
        )}
        <TestimonialsCarousel items={testimonials} />
      </Shell>

      <Shell id="faq" className="faq-section">
        <CodeBlock lines={[["System clarity", "required"], ["Ambiguity", "reduced"], ["Rules", "transparent"]]} />
        <h2>Є питання</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.id}>
              <summary>{faq.question}</summary>
              {faq.answer && <p>{faq.answer}</p>}
            </details>
          ))}
        </div>
      </Shell>

      <section className="final-cta">
        {/* Decorative absolute-positioned grid texture; keep raw <img> to preserve absolute inset CSS. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" aria-hidden="true" className="final-grid" src={assets.ctaGrid} loading="lazy" decoding="async" />
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
        <AssetImage
          ariaHidden
          className="cup"
          src={assets.cup}
          width={434}
          height={447}
        />
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo">
            <AssetImage src={assets.footerLogo} alt="IT League" width={154} height={24} />
            <span>Backend</span>
          </div>
          <div className="contacts">
            <a aria-label="Instagram" href="#">
              <AssetImage ariaHidden src={assets.instagram} width={24} height={24} />
            </a>
            <a aria-label="Email" href="mailto:hello@it-league.ua">
              <AssetImage ariaHidden src={assets.email} width={24} height={24} />
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
