import { Metadata } from 'next';
import { Locale } from "@/i18n-config";
import { getDictionary } from '@/get-dictionary';
import CustomTripClient from './CustomTripClient';

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const params = await props.params;

    return {
        title: 'Custom Trip Inquiry | Mongol Trail',
        description: 'Create your bespoke Mongolia adventure with our 1-on-1 travel consultants. Custom itineraries tailored to your interests.',
        alternates: {
            canonical: `https://www.mongoltrail.com/${params.lang}/custom-trip`,
            languages: {
                'mn': 'https://www.mongoltrail.com/mn/custom-trip',
                'en': 'https://www.mongoltrail.com/en/custom-trip',
                'ko': 'https://www.mongoltrail.com/ko/custom-trip',
            }
        }
    };
}

export default async function CustomTripPage(props: { params: Promise<{ lang: Locale }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);

    return <CustomTripClient dictionary={dict.customTrip} />;
}
