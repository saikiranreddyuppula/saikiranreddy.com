import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Components - static imports for above-the-fold
import SmoothScroll from "../components/SmoothScroll";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import CustomCursor from "../components/CustomCursor";

// Lazy-loaded below-the-fold components
const About = dynamic(() => import("../components/About"), { ssr: false });
const Industries = dynamic(() => import("../components/Industries"), { ssr: false });
const MountainSection = dynamic(() => import("../components/MountainScene"), { ssr: false });
const Contact = dynamic(() => import("../components/Contact"), { ssr: false });

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoaderFinish = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Sai Kiran Reddy | Solution Architect & Engineer</title>
        <meta
          name="description"
          content="Portfolio of Sai Kiran Reddy - A Solution Architect and Software Engineer specializing in scalable systems, cloud architecture, and digital transformation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Sai Kiran Reddy | Solution Architect & Engineer"
        />
        <meta
          property="og:description"
          content="Architecting digital solutions that transform complexity into clarity."
        />
        <meta property="og:type" content="website" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Preconnect to fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      {/* Loader */}
      {loading && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            inset: 0,
            background: "#000",
          }}
        >
          {mounted && <Loader onFinish={handleLoaderFinish} />}
        </div>
      )}

      {/* Main Content */}
      <CustomCursor />

      {/* Transition overlay — subtle dark fade instead of white flash */}
      <div
        className="hero-flash"
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          opacity: 0,
          zIndex: 50,
          pointerEvents: "none",
          visibility: "hidden",
        }}
      />
      <div className={`app-content ${loading ? "app-content--hidden" : ""}`}>
        <SmoothScroll>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Industries />
            <MountainSection />
            <Contact />
          </main>
        </SmoothScroll>
      </div>
    </>
  );
};

export default Home;
