import HeroSection from '../../Components/sections/HeroSection'
import AboutSection from '../../Components/sections/AboutSection'
import PortfolioSection from '../../Components/sections/PortfolioSection'
import PhotoStrip from '../../Components/sections/PhotoStrip'
import ServicesSection from '../../Components/sections/ServicesSection'
import TestimonialsSection from '../../Components/sections/TestimonialsSection'
import ContactSection from '../../Components/sections/ContactSection'
import { Helmet } from 'react-helmet-async'
import { useSettings } from '../../hooks/useSettings'

export default function HomePage() {
    const { settings } = useSettings()
    const name = settings.photographer_name || 'Photography'

    return (
        <>
            <Helmet>
                <title>{name} | Wedding & Portrait Photography</title>
                <meta name="description" content={settings.tagline || 'Professional wedding and portrait photography'} />
                <meta property="og:title" content={`${name} | Photography`} />
                <meta property="og:description" content={settings.tagline || ''} />
            </Helmet>

            <HeroSection />
            <AboutSection />
            <PortfolioSection />
            <PhotoStrip />
            <ServicesSection />
            <TestimonialsSection />
            <ContactSection />
        </>
    )
}