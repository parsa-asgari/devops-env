import Header from '@/components/header'
import Hero from '@/components/hero'
import ImageCarousel from '@/components/image-carousel'
import Footer from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ImageCarousel />
      </main>
      <Footer />
    </div>
  )
}

