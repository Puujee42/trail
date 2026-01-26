import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function RewardsPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{dictionary.rewards.title}</h1>
      <p>{dictionary.rewards.description}</p>
    </div>
  );
}
