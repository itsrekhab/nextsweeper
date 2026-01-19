import { Locale } from "@/app/_constants/constants";
import messages from "@/messages/en.json";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

declare module "next-intl" {
  interface AppConfig {
    // ...
    Locale: Locale;
    Messages: typeof messages;
  }
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = (store.get("locale")?.value || "en") as Locale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
