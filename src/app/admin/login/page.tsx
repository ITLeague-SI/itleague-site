import { loginAction } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;

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
          />
        </label>
        {error && (
          <p className="admin-login-error" role="alert">
            Неверный пароль. Попробуй ещё раз.
          </p>
        )}
        <button type="submit">Войти</button>
      </form>
    </main>
  );
}
