import LangSwitcher from "./LangSwitcher";
import Links from "./NavLinks";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header className="fixed inset-0 bottom-auto z-10 h-(--header-height) bg-header shadow-[0_2px_0_rgba(0,0,0,0.1)]">
      <nav className="max-w-7xl mx-auto h-full flex justify-between gap-4">
        <Links />
        <div className="flex items-center gap-2 py-2">
          <LangSwitcher />
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
