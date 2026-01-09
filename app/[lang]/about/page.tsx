import AboutClient from "./AboutClient";
import { Metadata } from 'next';
import { Locale } from "@/i18n-config";

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const params = await props.params;

  return {
    title: 'About Us | Mongol Trail',
    description: 'Learn more about Mongol Trail, our professional team, and our mission to provide safe, comfortable, and honest travel experiences in Mongolia and Europe.',
    alternates: {
      canonical: `https://www.mongoltrail.com/${params.lang}/about`,
      languages: {
        'mn': 'https://www.mongoltrail.com/mn/about',
        'en': 'https://www.mongoltrail.com/en/about',
        'ko': 'https://www.mongoltrail.com/ko/about',
      }
    }
  };
}

export default function AboutPage() {
  return <AboutClient />;
}