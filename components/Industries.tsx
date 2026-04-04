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
        description: "ML pipelines, intelligent automation systems, and AI-driven products from prototype to production at scale.",
        tags: ["ML Pipelines", "NLP", "Computer Vision"],
    },
    {
        name: "Manufacturing",
        number: "06",
        description: "IoT integration, supply chain optimization, and predictive maintenance systems for smart factories.",
        tags: ["IoT", "Supply Chain", "Predictive Maintenance"],
    }
];

interface RowProps {
    industry: typeof industries[0];
    index: number;
    isActive: boolean;
    onEnter: () => void;
    onLeave: () => void;
}

const IndustryRow = ({ industry, index, isActive, onEnter, onLeave }: RowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const [mouseX, setMouseX] = useState(50);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!rowRef.current) return;
        const rect = rowRef.current.getBoundingClientRect();
        setMouseX(((e.clientX - rect.left) / rect.width) * 100);
    }, []);

    useEffect(() => {
        const desc = descRef.current;
        const tags = tagsRef.current;
        if (!desc || !tags) return;

        if (isActive) {
            // Description wipes in via clip-path
            gsap.to(desc, {
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
                duration: 0.6,
                delay: 0.1,
                ease: 'power3.out',
            });
            // Tags stagger in
            gsap.to(tags, {
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
                duration: 0.5,
                delay: 0.25,
                ease: 'power3.out',
            });
        } else {
            gsap.to(desc, {
                clipPath: 'inset(0% 100% 0% 0%)',
                opacity: 0,
                duration: 0.35,
                ease: 'power2.inOut',
            });
            gsap.to(tags, {
                clipPath: 'inset(0% 100% 0% 0%)',
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
            });
        }
    }, [isActive]);

    return (
        <div
            ref={rowRef}
            className={`ind-row interactive ${isActive ? 'is-active' : ''}`}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseMove={handleMouseMove}
            data-index={index}
            style={{ '--mouse-x': `${mouseX}%` } as React.CSSProperties}
        >
            {/* Cursor-following light pool */}
            <div className="ind-row-light" />

            {/* Rule line glow — illuminates from cursor position */}
            <div className="ind-row-rule-glow" />

            {/* Ghost number — massive, behind everything */}
            <div className="ind-row-ghost" aria-hidden="true">{industry.number}</div>

            {/* Main row content */}
            <div className="ind-row-content">
                <div className="ind-row-head">
                    <span className="ind-row-number">{industry.number}</span>
                    <h3 className="ind-row-name">
                        {industry.name.split('').map((char, i) => (
                            <span key={i} className="ind-char" style={{ transitionDelay: `${i * 0.015}s` }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h3>
                    <div className="ind-row-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M7 17L17 7M17 7H9M17 7V15" />
                        </svg>
                    </div>
                </div>

                {/* Description — clip-path reveal */}
                <div ref={descRef} className="ind-row-desc-wrap">
                    <p className="ind-row-desc">{industry.description}</p>
                </div>

                {/* Tags — clip-path reveal */}
                <div ref={tagsRef} className="ind-row-tags-wrap">
                    <div className="ind-row-tags">
                        {industry.tags.map((tag, i) => (
                            <span key={i} className="ind-row-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom rule line */}
            <div className="ind-row-rule" />

            <style jsx>{`
                .ind-row {
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                }

                /* Cursor-following light pool */
                .ind-row-light {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        600px ellipse at var(--mouse-x) 50%,
                        rgba(255, 255, 255, 0.04),
                        transparent 60%
                    );
                    opacity: 0;
                    pointer-events: none;
                    z-index: 0;
                    transition: opacity 0.5s ease;
                }

                .is-active .ind-row-light {
                    opacity: 1;
                }

                /* Rule line glow — brightens near cursor */
                .ind-row-rule-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: radial-gradient(
                        300px ellipse at var(--mouse-x) 50%,
                        rgba(255, 255, 255, 0.4),
                        transparent 70%
                    );
                    opacity: 0;
                    pointer-events: none;
                    z-index: 5;
                    transition: opacity 0.4s ease;
                }

                .is-active .ind-row-rule-glow {
                    opacity: 1;
                }

                /* Ghost number */
                .ind-row-ghost {
                    position: absolute;
                    right: -2%;
                    top: 50%;
                    transform: translateY(-50%);
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(8rem, 18vw, 16rem);
                    font-weight: 300;
                    line-height: 1;
                    color: rgba(255, 255, 255, 0.0);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                    transition: color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    letter-spacing: -0.05em;
                }

                .is-active .ind-row-ghost {
                    color: rgba(255, 255, 255, 0.03);
                }

                /* Content */
                .ind-row-content {
                    position: relative;
                    z-index: 2;
                    padding: 2.75rem 0;
                }

                .ind-row-head {
                    display: flex;
                    align-items: baseline;
                    gap: 2.5rem;
                }

                .ind-row-number {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    letter-spacing: 0.15em;
                    color: rgba(255, 255, 255, 0.2);
                    min-width: 2.5rem;
                    transition: color 0.5s ease;
                    padding-top: 0.3rem;
                }

                .is-active .ind-row-number {
                    color: rgba(255, 255, 255, 0.6);
                }

                .ind-row-name {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(2.5rem, 6vw, 5.5rem);
                    font-weight: 300;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 0;
                    flex: 1;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    transition: text-shadow 0.6s ease;
                    display: flex;
                    flex-wrap: wrap;
                }

                .is-active .ind-row-name {
                    text-shadow: 0 0 60px rgba(255, 255, 255, 0.15),
                                 0 0 120px rgba(255, 255, 255, 0.05);
                }

                /* Per-character color transition */
                .ind-char {
                    display: inline-block;
                    color: rgba(255, 255, 255, 0.4);
                    transition: color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .is-active .ind-char {
                    color: #fff;
                    transform: translateY(-1px);
                }

                .ind-row-arrow {
                    color: rgba(255, 255, 255, 0.08);
                    transform: translate(-8px, 8px) rotate(0deg);
                    transition: color 0.5s ease,
                                transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    flex-shrink: 0;
                    align-self: center;
                }

                .is-active .ind-row-arrow {
                    color: rgba(255, 255, 255, 0.4);
                    transform: translate(0, 0) rotate(0deg);
                }

                /* Description */
                .ind-row-desc-wrap {
                    clip-path: inset(0% 100% 0% 0%);
                    opacity: 0;
                    overflow: hidden;
                }

                .ind-row-desc {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(1rem, 1.4vw, 1.2rem);
                    font-style: italic;
                    line-height: 1.7;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 0;
                    padding: 1.25rem 0 0 5rem;
                    max-width: 600px;
                }

                /* Tags */
                .ind-row-tags-wrap {
                    clip-path: inset(0% 100% 0% 0%);
                    opacity: 0;
                    overflow: hidden;
                }

                .ind-row-tags {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1.25rem 0 0.5rem 5rem;
                    flex-wrap: wrap;
                }

                .ind-row-tag {
                    font-family: var(--font-mono);
                    font-size: 0.6rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 0.35rem 0.75rem;
                    border-radius: 0;
                    transition: border-color 0.4s ease, color 0.4s ease;
                }

                .is-active .ind-row-tag {
                    border-color: rgba(255, 255, 255, 0.18);
                    color: rgba(255, 255, 255, 0.45);
                }

                /* Rule line */
                .ind-row-rule {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.06);
                    transform-origin: left center;
                }

                @media (max-width: 768px) {
                    .ind-row-content {
                        padding: 2rem 0;
                    }

                    .ind-row-head {
                        gap: 1.25rem;
                    }

                    .ind-row-desc {
                        padding-left: 3.75rem;
                    }

                    .ind-row-tags {
                        padding-left: 3.75rem;
                    }

                    .ind-row-ghost {
                        font-size: 6rem;
                        right: -5%;
                    }
                }
            `}</style>
        </div>
    );
};

const Industries = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
            { threshold: 0.08 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Entrance animations — orchestrated sequence
    useEffect(() => {
        if (!isVisible || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // 1. Label slides in
            gsap.fromTo(
                '.ind-label',
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
            );

            // 2. Title lines reveal with clip-path (like About section)
            const titleLines = gsap.utils.toArray<HTMLElement>('.ind-title-line');
            titleLines.forEach((line, i) => {
                gsap.fromTo(
                    line,
                    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        opacity: 1,
                        duration: 0.9,
                        delay: 0.2 + i * 0.15,
                        ease: 'power3.out',
                    }
                );
            });

            // 3. Rule lines draw themselves in — staggered with scroll
            const rules = gsap.utils.toArray<HTMLElement>('.ind-row-rule');
            rules.forEach((rule, i) => {
                gsap.fromTo(
                    rule,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 1,
                        delay: 0.5 + i * 0.08,
                        ease: 'power3.inOut',
                    }
                );
            });

            // 4. Rows fade up in sequence
            const rows = gsap.utils.toArray<HTMLElement>('.ind-row');
            rows.forEach((row, i) => {
                gsap.fromTo(
                    row.querySelector('.ind-row-content'),
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.6 + i * 0.1,
                        ease: 'power3.out',
                    }
                );
            });

            // 5. Counter
            gsap.fromTo(
                '.ind-counter',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.6, delay: 1.4, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [isVisible]);

    // Scroll-driven parallax: ghost numbers drift at different rate
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Title parallax
            gsap.to('.ind-title', {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });

            // Ghost numbers parallax — each drifts independently
            const ghosts = gsap.utils.toArray<HTMLElement>('.ind-row-ghost');
            ghosts.forEach((ghost, i) => {
                gsap.to(ghost, {
                    y: -30 - (i * 8),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: ghost.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2,
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="industries" className="ind-section">
            <div className="ind-container">
                {/* Header */}
                <div className="ind-header">
                    <div className="ind-label">
                        <span className="ind-label-index">02</span>
                        <span className="ind-label-line" />
                        <span className="ind-label-text">Industries</span>
                    </div>

                    <h2 className="ind-title">
                        <span className="ind-title-line">
                            From startups to enterprise,
                        </span>
                        <span className="ind-title-line">
                            I architect solutions{' '}
                            <em className="ind-title-accent">that scale.</em>
                        </span>
                    </h2>
                </div>

                {/* First rule line */}
                <div className="ind-row-rule ind-rule-first" />

                {/* Industry Rows */}
                <div className="ind-list">
                    {industries.map((industry, index) => (
                        <IndustryRow
                            key={index}
                            industry={industry}
                            index={index}
                            isActive={activeIndex === index}
                            onEnter={() => setActiveIndex(index)}
                            onLeave={() => setActiveIndex(null)}
                        />
                    ))}
                </div>

                {/* Counter */}
                <div className="ind-counter">
                    <span className="ind-counter-label">Domains of expertise</span>
                    <span className="ind-counter-value">
                        {activeIndex !== null
                            ? `${String(activeIndex + 1).padStart(2, '0')} / ${String(industries.length).padStart(2, '0')}`
                            : String(industries.length).padStart(2, '0')
                        }
                    </span>
                </div>
            </div>

            <style jsx global>{`
                .ind-section {
                    position: relative;
                    z-index: 1;
                    background: #000;
                    overflow: hidden;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                }

                .ind-container {
                    max-width: 1300px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 10rem 4rem 8rem;
                }

                /* ---- Header ---- */
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

                /* ---- Title ---- */
                .ind-title {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    font-weight: 300;
                    line-height: 1.3;
                    color: #fff;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    will-change: transform;
                }

                .ind-title-line {
                    display: block;
                    clip-path: inset(100% 0% 0% 0%);
                    opacity: 0;
                    will-change: clip-path, opacity;
                }

                .ind-title-accent {
                    color: rgba(255, 255, 255, 0.4);
                    font-style: italic;
                }

                /* ---- List ---- */
                .ind-list {
                    margin-bottom: 3rem;
                }

                .ind-rule-first {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.06);
                    transform-origin: left center;
                    margin-bottom: 0;
                }

                /* ---- Counter ---- */
                .ind-counter {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    opacity: 0;
                    padding-top: 2rem;
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
                    font-size: 0.85rem;
                    letter-spacing: 0.1em;
                    color: rgba(255, 255, 255, 0.4);
                    transition: all 0.3s ease;
                }

                @media (max-width: 1024px) {
                    .ind-container {
                        padding: 7rem 2.5rem 6rem;
                    }
                }

                @media (max-width: 768px) {
                    .ind-container {
                        padding: 5rem 1.5rem 4rem;
                    }

                    .ind-header {
                        margin-bottom: 3rem;
                    }

                    .ind-label {
                        margin-bottom: 1.5rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Industries;
