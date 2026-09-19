import { redirect } from "next/navigation";
import { APP_HOME } from "@/components/layout/nav";

/** `/app` → `/app/inbox`. التوجيه حسب الدور (STAFF → /app/tasks) يأتي في FOS-008. */
export default function AppIndexPage() {
  redirect(APP_HOME);
}
