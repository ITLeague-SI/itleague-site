import { loginAction } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string; next?: string; retry?: string }>;
};

function formatRetry(retrySec: number): string {
  if (retrySec >= 60) {
    const min = Math.ceil(retrySec / 60);
    return `${min} мин`;
  }
  return `${retrySec} с`;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, next, retry } = await searchParams;
  const retrySec = retry ? Math.max(0, parseInt(retry, 10) || 0) : 0;
  const isRateLimited = error === "rate";
  const isBadPassword = error === "1";

  return (
    <main className="admin-login">
      <form action={loginAction} className="admin-login-card">
        <h1>Вход в админку</h1>
        <p>Введите пароль администратора, чтобы продолжить.</p>
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <label>
          <span>Пароль</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            disabled={isRateLimited}
          />
        </label>
        {isBadPassword && (
          <p className="admin-login-error" role="alert">
            Неверный пароль. Попробуй ещё раз.
          </p>
        )}
        {isRateLimited && (
          <p className="admin-login-error" role="alert">
            Слишком много попыток. Повторите через {formatRetry(retrySec)}.
          </p>
        )}
        <button type="submit" disabled={isRateLimited}>
          Войти
        </button>
      </form>
    </main>
  );
}
