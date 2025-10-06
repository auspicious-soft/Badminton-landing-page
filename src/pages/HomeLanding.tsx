import Hero from '../components/landingPage/Hero'
import HowItWorks from '../components/landingPage/HowItWorks'
import Features from '../components/landingPage/Features'
import AppShowcase from '../components/landingPage/AppShowcase'
import Testimonials from '../components/landingPage/Testimonials'
import FAQ from '../components/landingPage/FAQ'
import CancellationAndRefund from '../components/landingPage/CancellationAndRefund'

const HomeLanding = () => {
  return (
    <>
     <Hero />
      <HowItWorks />
      <Features />
      <AppShowcase />
      <Testimonials />
      <FAQ />
      </>
  )
}

export default HomeLanding