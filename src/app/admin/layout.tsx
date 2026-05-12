import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth/guard";
import { logoutAction } from "./login/actions";

const NAV: Array<{ href: string; label: string }> = [
  { href: "/admin", label: "Главная" },
  { href: "/admin/faqs", label: "Вопрос–ответ" },
  { href: "/admin/testimonials", label: "Отзывы" },
  { href: "/admin/hero-slides", label: "Слайдер" },
  { href: "/admin/experts", label: "Эксперты" },
  { href: "/admin/pricing-tiers", label: "Тарифы" },
  { href: "/admin/pricing-features", label: "Фичи тарифов" },
];

function isLoginPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdminLoggedIn();
  const pathname = (await headers()).get("x-pathname");
  const onLoginPage = isLoginPath(pathname);

  if (!loggedIn) {
    if (!onLoginPage) {
      const next = pathname ?? "/admin";
      redirect(`/admin/login?next=${encodeURIComponent(next)}`);
    }
    return <div className="admin-shell-bare">{children}</div>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div className="admin-brand">
          <span className="admin-brand-dot" />
          <span>ITLeague · Админка</span>
        </div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="admin-logout">
          <button type="submit">Выйти</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
