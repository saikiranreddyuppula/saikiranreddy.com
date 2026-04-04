import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const industries = [
    {
        name: "Ecommerce",
        number: "01",
        description: "Scalable platforms that handle millions of transactions with real-time inventory, dynamic pricing, and seamless checkout experiences.",
        tags: ["Payments", "Inventory", "Microservices"],
    },
    {
        name: "Cyber Security",
        number: "02",
        description: "Zero-trust architectures and threat detection systems that protect critical infrastructure at scale.",
        tags: ["Zero Trust", "Threat Detection", "Compliance"],
    },
    {
        name: "Healthcare",
        number: "03",
        description: "HIPAA-compliant systems for patient data management, telemedicine platforms, and clinical workflow automation.",
        tags: ["HIPAA", "EHR Systems", "Telemedicine"],
    },
    {
        name: "Hospitality",
        number: "04",
        description: "Real-time booking engines, guest experience platforms, and operational systems that delight at every touchpoint.",
        tags: ["Booking Engines", "Guest Experience", "PMS"],
    },
    {
        name: "Generative AI",
        number: "05",
        description: "ML pipelines, intelligent automation systems, and Generative AI-driven products from prototype to production at scale.",
        tags: ["ML Pipelines", "NLP", "Computer Vision"],
    },
    {
        name: "Manufacturing",
        number: "06",
        description: "IoT integration, supply chain optimization, and predictive maintenance systems for smart factories.",
        tags: ["IoT", "Supply Chain", "Predictive Maintenance"],
    }
];

interface CardProps {
    industry: typeof industries[0];
    index: number;
}

const IndustryCard = ({ industry, index }: CardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const rafRef = useRef<number>(0);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            setTilt({
                x: (y - 0.5) * -6,
                y: (x - 0.5) * 6,
            });
            setMousePos({ x: x * 100, y: y * 100 });
        });
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div className="ind-card-wrapper">
            <div
                ref={cardRef}
                className={`ind-card interactive ${isHovered ? 'is-hovered' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    '--tilt-x': `${tilt.x}deg`,
                    '--tilt-y': `${tilt.y}deg`,
                    '--mouse-x': `${mousePos.x}%`,
                    '--mouse-y': `${mousePos.y}%`,
                } as React.CSSProperties}
            >
                {/* Ambient glow behind card */}
                <div className="ind-card-glow" />

                {/* Glass surface */}
                <div className="ind-card-surface">
                    {/* White spotlight follows cursor */}
                    <div className="ind-card-spotlight" />

                    {/* Border */}
                    <div className="ind-card-border" />

                    {/* Content */}
                    <div className="ind-card-content">
                        <div className="ind-card-top">
                            <span className="ind-card-number">{industry.number}</span>
                            <div className="ind-card-arrow">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        </div>

                        {/* Large background number watermark */}
                        <div className="ind-card-watermark" aria-hidden="true">{industry.number}</div>

                        <div className="ind-card-body">
                            <h3 className="ind-card-name">{industry.name}</h3>
                            <p className="ind-card-desc">{industry.description}</p>
                        </div>

                        <div className="ind-card-footer">
                            <div className="ind-card-tags">
                                {industry.tags.map((tag, i) => (
                                    <span key={i} className="ind-card-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .ind-card-wrapper {
                    grid-column: span 1;
                }

                .ind-card {
                    position: relative;
                    height: 100%;
                    perspective: 800px;
                    cursor: pointer;
                }

                .ind-card-glow {
                    position: absolute;
                    inset: -2px;
                    border-radius: 16px;
                    background: radial-gradient(
                        500px circle at var(--mouse-x) var(--mouse-y),
                        rgba(255, 255, 255, 0.06),
                        transparent 50%
                    );
                    opacity: 0;
                    transition: opacity 0.6s ease;
                    z-index: 0;
                    filter: blur(30px);
                }

                .is-hovered .ind-card-glow {
                    opacity: 1;
                }

                .ind-card-surface {
                    position: relative;
                    height: 100%;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.015);
                    overflow: hidden;
                    transform-style: preserve-3d;
                    transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
                    transition: transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99),
                                background 0.5s ease;
                    will-change: transform;
                }

                .is-hovered .ind-card-surface {
                    background: rgba(255, 255, 255, 0.03);
                }

                .ind-card-spotlight {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        350px circle at var(--mouse-x) var(--mouse-y),
                        rgba(255, 255, 255, 0.05),
                        transparent 50%
                    );
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                    z-index: 1;
                }

                .is-hovered .ind-card-spotlight {
                    opacity: 1;
                }

                .ind-card-border {
                    position: absolute;
                    inset: 0;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: border-color 0.5s ease;
                    pointer-events: none;
                    z-index: 3;
                }

                .is-hovered .ind-card-border {
                    border-color: rgba(255, 255, 255, 0.12);
                }

                .ind-card-content {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    padding: 2rem;
                    min-height: 340px;
                }

                .ind-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }

                .ind-card-number {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    letter-spacing: 0.15em;
                    color: rgba(255, 255, 255, 0.25);
                    transition: color 0.4s ease;
                }

                .is-hovered .ind-card-number {
                    color: rgba(255, 255, 255, 0.6);
                }

                .ind-card-arrow {
                    color: rgba(255, 255, 255, 0.1);
                    transform: translate(-4px, 4px);
                    transition: color 0.4s ease, transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99);
                }

                .is-hovered .ind-card-arrow {
                    color: rgba(255, 255, 255, 0.5);
                    transform: translate(0, 0);
                }

                .ind-card-watermark {
                    position: absolute;
                    top: 50%;
                    right: 1.5rem;
                    transform: translateY(-50%);
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(7rem, 12vw, 11rem);
                    font-weight: 300;
                    line-height: 1;
                    color: rgba(255, 255, 255, 0.015);
                    pointer-events: none;
                    transition: color 0.6s ease;
                    z-index: 0;
                    user-select: none;
                }

                .is-hovered .ind-card-watermark {
                    color: rgba(255, 255, 255, 0.04);
                }

                .ind-card-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                }

                .ind-card-name {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(1.75rem, 2.8vw, 2.4rem);
                    font-weight: 300;
                    color: rgba(255, 255, 255, 0.55);
                    margin: 0 0 1rem;
                    line-height: 1.15;
                    letter-spacing: -0.01em;
                    transition: color 0.4s ease, letter-spacing 0.5s ease;
                }

                .is-hovered .ind-card-name {
                    color: #fff;
                    letter-spacing: 0.01em;
                }

                .ind-card-desc {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(0.9rem, 1.1vw, 1.05rem);
                    font-style: italic;
                    line-height: 1.7;
                    color: rgba(255, 255, 255, 0.15);
                    margin: 0;
                    max-width: 380px;
                    transform: translateY(8px);
                    opacity: 0;
                    transition: opacity 0.5s ease 0.05s, transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99) 0.05s, color 0.4s ease;
                }

                .is-hovered .ind-card-desc {
                    opacity: 1;
                    transform: translateY(0);
                    color: rgba(255, 255, 255, 0.4);
                }

                .ind-card-footer {
                    margin-top: 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .ind-card-tags {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .ind-card-tag {
                    font-family: var(--font-mono);
                    font-size: 0.6rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 0.3rem 0.65rem;
                    border-radius: 100px;
                    transition: border-color 0.4s ease, color 0.4s ease;
                    white-space: nowrap;
                }

                .is-hovered .ind-card-tag {
                    border-color: rgba(255, 255, 255, 0.15);
                    color: rgba(255, 255, 255, 0.4);
                }

                @media (max-width: 768px) {
                    .ind-card-content {
                        padding: 1.5rem;
                        min-height: 260px;
                    }

                    .ind-card-desc {
                        opacity: 1;
                        transform: translateY(0);
                        color: rgba(255, 255, 255, 0.3);
                    }

                    .ind-card-watermark {
                        font-size: 5rem;
                    }
                }
            `}</style>
        </div>
    );
};

const Industries = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Intersection observer for entrance
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Entrance animations
    useEffect(() => {
        if (!isVisible || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // Label entrance
            gsap.fromTo(
                '.ind-label',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            );

            // Title word-by-word reveal
            const titleWords = gsap.utils.toArray<HTMLElement>('.ind-title-word');
            titleWords.forEach((word, i) => {
                const inner = word.querySelector('.ind-title-word-inner');
                if (!inner) return;
                gsap.fromTo(
                    inner,
                    { y: '120%', rotateX: 25, opacity: 0 },
                    {
                        y: '0%',
                        rotateX: 0,
                        opacity: 1,
                        duration: 1,
                        delay: 0.15 + i * 0.06,
                        ease: 'power4.out',
                    }
                );
            });

            // Subtitle
            gsap.fromTo(
                '.ind-subtitle',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
            );

            // Cards stagger entrance with alternating vertical offset
            const cards = gsap.utils.toArray<HTMLElement>('.ind-card-wrapper');
            cards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 50 + (i % 2) * 20, scale: 0.97 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        delay: 0.4 + i * 0.08,
                        ease: 'power3.out',
                    }
                );
            });

            // Bottom line
            gsap.fromTo(
                '.ind-bottom-line',
                { scaleX: 0 },
                { scaleX: 1, duration: 1.2, delay: 1.0, ease: 'power3.inOut' }
            );

            // Counter
            gsap.fromTo(
                '.ind-counter',
                { opacity: 0 },
                { opacity: 1, duration: 0.6, delay: 1.4, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [isVisible]);

    // Parallax on title
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to('.ind-title', {
                y: -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const titleText = "Industries I've Transformed";
    const titleWords = titleText.split(' ');

    return (
        <section ref={containerRef} id="industries" className="ind-section">
            {/* Ambient white light orbs */}
            <div className="ind-ambient" aria-hidden="true">
                <div className="ind-orb ind-orb-1" />
                <div className="ind-orb ind-orb-2" />
            </div>

            <div className="ind-container">
                {/* Header */}
                <div className="ind-header">
                    <div className="ind-label">
                        <span className="ind-label-index">02</span>
                        <span className="ind-label-line" />
                        <span className="ind-label-text">Industries</span>
                    </div>

                    <h2 className="ind-title">
                        {titleWords.map((word, i) => (
                            <span key={i} className="ind-title-word">
                                <span className={`ind-title-word-inner ${i >= 2 ? 'ind-accent' : ''}`}>
                                    {word}
                                </span>
                            </span>
                        ))}
                    </h2>

                    <p className="ind-subtitle">
                        From startups to enterprise, architecting solutions that scale across verticals.
                    </p>
                </div>

                {/* Card Grid */}
                <div className="ind-grid">
                    {industries.map((industry, index) => (
                        <IndustryCard key={index} industry={industry} index={index} />
                    ))}
                </div>

                {/* Bottom */}
                <div className="ind-bottom">
                    <div className="ind-bottom-line" />
                    <div className="ind-counter">
                        <span className="ind-counter-label">Domains of expertise</span>
                        <span className="ind-counter-value">{String(industries.length).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .ind-section {
                    position: relative;
                    z-index: 1;
                    background: #000;
                    overflow: hidden;
                    min-height: 100vh;
                }

                /* Ambient white light — monochrome only */
                .ind-ambient {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
                }

                .ind-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                }

                .ind-orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.025), transparent 70%);
                    top: 5%;
                    left: -10%;
                    animation: ind-float-1 25s ease-in-out infinite;
                }

                .ind-orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.02), transparent 70%);
                    bottom: 0%;
                    right: -8%;
                    animation: ind-float-2 30s ease-in-out infinite;
                }

                @keyframes ind-float-1 {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -20px); }
                    66% { transform: translate(-15px, 15px); }
                }

                @keyframes ind-float-2 {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(-25px, 30px); }
                    66% { transform: translate(20px, -10px); }
                }

                .ind-container {
                    position: relative;
                    z-index: 1;
                    max-width: 1300px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 10rem 4rem 8rem;
                }

                /* Header */
                .ind-header {
                    margin-bottom: 5rem;
                }

                .ind-label {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    opacity: 0;
                }

                .ind-label-index {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    color: #fff;
                    letter-spacing: 0.1em;
                }

                .ind-label-line {
                    width: 40px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.3);
                }

                .ind-label-text {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.5);
                }

                /* Title */
                .ind-title {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(2.5rem, 5.5vw, 4.5rem);
                    font-weight: 300;
                    line-height: 1.15;
                    color: #fff;
                    margin: 0 0 1.5rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0 0.25em;
                    perspective: 600px;
                    will-change: transform;
                }

                .ind-title-word {
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: top;
                }

                .ind-title-word-inner {
                    display: inline-block;
                    will-change: transform, opacity;
                    transform-origin: bottom center;
                }

                .ind-accent {
                    color: rgba(255, 255, 255, 0.35);
                    font-style: italic;
                }

                .ind-subtitle {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(1rem, 1.3vw, 1.15rem);
                    font-style: italic;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.3);
                    margin: 0;
                    max-width: 550px;
                    opacity: 0;
                }

                /* Grid */
                .ind-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.25rem;
                    margin-bottom: 4rem;
                }

                /* Bottom */
                .ind-bottom {
                    padding-top: 0;
                }

                .ind-bottom-line {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
                    transform-origin: left center;
                    transform: scaleX(0);
                    margin-bottom: 1.5rem;
                }

                .ind-counter {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    opacity: 0;
                }

                .ind-counter-label {
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.2);
                }

                .ind-counter-value {
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    color: rgba(255, 255, 255, 0.35);
                }

                @media (max-width: 1024px) {
                    .ind-container {
                        padding: 7rem 2.5rem 6rem;
                    }

                    .ind-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }
                }

                @media (max-width: 768px) {
                    .ind-container {
                        padding: 5rem 1.25rem 4rem;
                    }

                    .ind-header {
                        margin-bottom: 3rem;
                    }

                    .ind-label {
                        margin-bottom: 1.5rem;
                    }

                    .ind-grid {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }

                    .ind-subtitle {
                        max-width: 100%;
                    }
                }
            `}</style>
        </section>
    );
};

export default Industries;
