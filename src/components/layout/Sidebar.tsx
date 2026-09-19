import { AppNav } from "./AppNav";

/** القائمة الجانبية الثابتة لسطح المكتب؛ مخفية دون `md` حيث يحل Drawer محلها. */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-e border-foreground/10 bg-background md:flex">
      <div className="px-5 py-4 text-lg font-semibold tracking-tight">Fontain OS</div>
      <AppNav />
    </aside>
  );
}
