import type { SeasonPlan } from "@/lib/content";
import { seasonPlans } from "@/lib/content";

const TOTAL_WEEKS = 12;
/** Rating tournaments fall on these week numbers (3 per season). */
const RATING_WEEKS = new Set([4, 8, 12]);

/**
 * "Перший сезон IT LEAGUE — 12 тижнів суперництва" — visualises the
 * 12-week season for each tariff (Starter / Basic / Core / Pro).
 * Inactive weeks for the Starter tier render dimmed.
 *
 * Figma node 3:3 in the pop-up file.
 */
export function SeasonProgression() {
  return (
    <section className="season-progression">
      <div className="season-progression-heading">
        <h2>Перший сезон IT LEAGUE — 12 тижнів суперництва</h2>
        <p>Кожен рейтинговий турнір формує позицію в загальному рейтингу</p>
      </div>

      <div className="season-progression-grid" role="list">
        {seasonPlans.map((plan) => (
          <PlanColumn key={plan.id} plan={plan} />
        ))}
      </div>

      <p className="season-progression-footer">
        <BoltIcon />
        <span>Рейтинг оновлюється після кожного рейтингового турніру</span>
      </p>
    </section>
  );
}

function PlanColumn({ plan }: { plan: SeasonPlan }) {
  return (
    <article className="season-plan" role="listitem">
      {plan.badge && (
        <span
          className={`season-plan-badge season-plan-badge-${plan.badge}`}
          aria-hidden="true"
        >
          {plan.badge === "diamond" ? "◆" : "★"}
        </span>
      )}

      <div className="season-plan-header">
        <h3>{plan.name}</h3>
      </div>

      <ul className="season-plan-weeks" aria-label={`${plan.name} тижні`}>
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((week) => {
          const isRating = RATING_WEEKS.has(week);
          const isActive = week <= plan.activeUntilWeek;
          return (
            <li
              key={week}
              className={[
                "season-plan-week",
                isRating ? "season-plan-week-rating" : "season-plan-week-training",
                isActive ? "" : "season-plan-week-inactive",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="season-plan-week-label">Тиждень {week}</span>
              <span className="season-plan-week-icons" aria-hidden="true">
                {isRating ? <TrophyIcon /> : <TargetIcon />}
                {isRating && <span className="season-plan-week-dot" />}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="season-plan-stats">
        <StatRow icon={<TargetIcon />} label="Тренувальні" value={plan.stats.training} />
        <StatRow icon={<TrophyIcon />} label="Рейтингові" value={plan.stats.rating} />
        <StatRow icon={<EyeIcon />} label="Judge оцінка" value={plan.stats.judges} />
        <StatRow icon={<UsersIcon />} label="Community" value={plan.stats.community} />
        {plan.stats.feedback !== undefined && plan.stats.feedback !== "—" && (
          <StatRow
            icon={<ChatIcon />}
            label="Feedback"
            value={plan.stats.feedback}
            highlight={plan.stats.feedback === "Priority"}
          />
        )}
        {plan.stats.mentoring && (
          <StatRow
            icon={<MentorIcon />}
            label="1:1 Mentoring"
            value={plan.stats.mentoring}
            highlight
          />
        )}
      </dl>
    </article>
  );
}

function StatRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className={`season-plan-stat${highlight ? " is-highlight" : ""}`}>
      <span className="season-plan-stat-label">
        <span className="season-plan-stat-icon" aria-hidden="true">
          {icon}
        </span>
        <span>{label}</span>
      </span>
      <dd className="season-plan-stat-value">{value}</dd>
    </div>
  );
}

/* ----------------------------- inline icons ---------------------- */

function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M4.083 1.75h5.834v2.917A2.917 2.917 0 0 1 7 7.583a2.917 2.917 0 0 1-2.917-2.916V1.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M2.333 2.917h1.75M9.917 2.917h1.75M5.833 7.583h2.334M5.25 7.583v2.334h3.5V7.583M4.083 10.5h5.834v1.75H4.083z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M0.875 7s2.188-4.083 6.125-4.083S13.125 7 13.125 7s-2.188 4.083-6.125 4.083S0.875 7 0.875 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="5.25" cy="4.667" r="2.042" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M1.458 12.25a3.792 3.792 0 0 1 7.584 0M9.917 3.208a2.042 2.042 0 0 1 0 3.917M12.542 12.25a3.792 3.792 0 0 0-2.625-3.617"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M12.25 8.167A1.167 1.167 0 0 1 11.083 9.333H3.5l-2.333 2.334V2.917A1.167 1.167 0 0 1 2.333 1.75h8.75a1.167 1.167 0 0 1 1.167 1.167v5.25Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MentorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1.75v1.75M7 12.25v-1.75M2.917 5.833l1.225 1.225M9.858 9.858l1.225 1.225M1.75 7h1.75M10.5 7h1.75M2.917 11.083l1.225-1.225M9.858 4.142l1.225-1.225"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="7" r="2.333" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m9.333 1.333-6 8.667h4l-.667 4.667 6-8.667H8.667L9.333 1.333Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
