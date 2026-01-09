import ContactClient from "./ContactClient";
import { Metadata } from 'next';
import { Locale } from "@/i18n-config";

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const params = await props.params;

  return {
    title: 'Contact Us | Mongol Trail',
    description: 'Get in touch with Mongol Trail. We are here to answer your questions and help you plan your next adventure.',
    alternates: {
      canonical: `https://www.mongoltrail.com/${params.lang}/contact`,
      languages: {
        'mn': 'https://www.mongoltrail.com/mn/contact',
        'en': 'https://www.mongoltrail.com/en/contact',
        'ko': 'https://www.mongoltrail.com/ko/contact',
      }
    }
  };
}

export default function ContactPage() {
  return <ContactClient />;
}