import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Director } from "@/components/site/Director";
import { Diagnostic } from "@/components/site/Diagnostic";
import { MagnoIA } from "@/components/site/MagnoIA";
import { Projects } from "@/components/site/Projects";
import { Blog } from "@/components/site/Blog";
import { Contact } from "@/components/site/Contact";
import { Footer, WhatsAppFloat } from "@/components/site/Footer";

const TITLE = "MagnoCorp | Consultoría Empresarial, Marketing e Inteligencia Artificial";
const DESCRIPTION =
  "MagnoCorp es una consultoría empresarial especializada en desarrollo comercial, marketing digital, inteligencia artificial, procesos y crecimiento empresarial en Mazatlán y Durango.";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "MagnoCorp",
      slogan: "Impulsándote a ser grande",
      description: DESCRIPTION,
      url: "https://www.magnocorp.com.mx",
      email: "juan.hdz0429@gmail.com",
      telephone: "+52-669-932-6296",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mazatlán",
        addressRegion: "Sinaloa",
        addressCountry: "MX",
      },
      founder: { "@type": "Person", name: "Juan Hernández", jobTitle: "Director General" },
    },
    {
      "@type": "ProfessionalService",
      name: "MagnoCorp",
      description: DESCRIPTION,
      url: "https://www.magnocorp.com.mx",
      telephone: "+52-669-932-6296",
      areaServed: ["Mazatlán, Sinaloa", "Durango"],
      serviceType: [
        "Consultoría empresarial",
        "Desarrollo comercial",
        "Marketing digital",
        "Inteligencia Artificial",
        "Procesos administrativos",
        "Capacitación empresarial",
        "Desarrollo de aplicaciones",
      ],
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_MX" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://magnocorp.online" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(STRUCTURED_DATA) }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Director />
        <Diagnostic />
        <MagnoIA />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
