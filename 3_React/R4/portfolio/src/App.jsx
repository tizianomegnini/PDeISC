import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Achievements from "./components/Achievements";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { usePortfolioData } from "./hooks/usePortfolioData";

/**
 * App
 * ---
 * Componente raíz: obtiene todos los datos del portfolio con el hook
 * usePortfolioData (Supabase si está configurado, si no datos locales)
 * y arma la página de una sola sección tras otra.
 */
export default function App() {
  const { data, loading } = usePortfolioData();

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skillGroups={data.skillGroups} />
        <Experience experience={data.experience} />
        <Achievements achievements={data.achievements} />
        <Projects projects={data.projects} loading={loading} />
        <Contact email={data.profile.email} />
      </main>
      <Footer profile={data.profile} />
    </>
  );
}
