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

interface RowProps {
    industry: typeof industries[0];
    index: number;
    isExpanded: boolean;
    onEnter: () => void;
    onLeave: () => void;
}

const IndustryRow = ({ industry, index, isExpanded, onEnter, onLeave }: RowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [mouseX, setMouseX] = useState(0);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!rowRef.current) return;
        const rect = rowRef.current.getBoundingClientRect();
        setMouseX(((e.clientX - rect.left) / rect.width) * 100);
    }, []);

    useEffect(() => {
        const desc = descRef.current;
        const line = lineRef.current;
        const tags = tagsRef.current;
        const glow = glowRef.current;
        if (!desc || !line || !tags || !glow) return;

        if (isExpanded) {
            gsap.to(desc, {
                height: 'auto',
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
            });
            gsap.to(tags, {
                height: 'auto',
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.1,
                ease: 'power3.out',
            });
            gsap.to(line, {
                scaleX: 1,
                duration: 0.8,
                ease: 'power3.inOut',
            });
            gsap.to(glow, {
                opacity: 1,
                duration: 0.4,
            });
        } else {
            gsap.to(desc, {
                height: 0,
                opacity: 0,
                y: 10,
                duration: 0.4,
                ease: 'power2.inOut',
            });
            gsap.to(tags, {
                height: 0,
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.inOut',
            });
            gsap.to(line, {
                scaleX: 0,
                duration: 0.5,
                ease: 'power2.inOut',
            });
            gsap.to(glow, {
                opacity: 0,
                duration: 0.3,
            });
        }
    }, [isExpanded]);

    return (
        <div
            ref={rowRef}
            className={`industry-row interactive ${isExpanded ? 'is-expanded' : ''}`}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mouseX}%` } as React.CSSProperties}
        >
            {/* Hover glow that follows mouse horizontally */}
            <div ref={glowRef} className="row-glow" />

            {/* Top border accent line */}
            <div ref={lineRef} className="row-accent-line" />

            <div className="row-inner">
                <div className="row-main">
                    <span className="row-number">{industry.number}</span>
                    <h3 className="row-name">{industry.name}</h3>
                    <span className="row-expand-indicator">
                        <span className={`expand-line expand-h ${isExpanded ? 'active' : ''}`} />
                        <span className={`expand-line expand-v ${isExpanded ? 'active' : ''}`} />
                    </span>
                </div>

                <div ref={descRef} className="row-description-wrap">
                    <p className="row-description">{industry.description}</p>
                </div>

                <div ref={tagsRef} className="row-tags-wrap">
                    <div className="row-tags">
                        {industry.tags.map((tag, i) => (
                            <span key={i} className="row-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .industry-row {
                    position: relative;
                    cursor: pointer;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
                    transition: background 0.4s ease;
                    overflow: hidden;
                }

                .industry-row:first-child {
                    border-top: 1px solid rgba(255, 255, 255, 0.07);
                }

                .row-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        600px ellipse at var(--mouse-x) 50%,
                        rgba(255, 255, 255, 0.03),
                        transparent 70%
                    );
                    opacity: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .row-accent-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
                    transform: scaleX(0);
                    transform-origin: center;
                    z-index: 2;
                }

                .row-inner {
                    position: relative;
                    z-index: 1;
                    padding: 2.5rem 0;
                }

                .row-main {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .row-number {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.3);
                    letter-spacing: 0.1em;
                    min-width: 2rem;
                    transition: color 0.4s ease;
                }

                .is-expanded .row-number {
                    color: rgba(255, 255, 255, 0.7);
                }

                .row-name {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(2rem, 4.5vw, 4rem);
                    font-weight: 300;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                    flex: 1;
                    line-height: 1.2;
                    transition: color 0.4s ease, letter-spacing 0.4s ease;
                    letter-spacing: -0.01em;
                }

                .is-expanded .row-name {
                    color: #fff;
                    letter-spacing: 0.02em;
                }

                .row-expand-indicator {
                    position: relative;
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                }

                .expand-line {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.4);
                    transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1), background 0.4s ease;
                }

                .expand-h {
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    transform: translateY(-50%);
                }

                .expand-v {
                    top: 0;
                    left: 50%;
                    width: 1px;
                    height: 100%;
                    transform: translateX(-50%) scaleY(1);
                }

                .expand-v.active {
                    transform: translateX(-50%) scaleY(0);
                }

                .is-expanded .expand-line {
                    background: rgba(255, 255, 255, 0.7);
                }

                .row-description-wrap {
                    height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transform: translateY(10px);
                }

                .row-description {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(1rem, 1.3vw, 1.15rem);
                    font-style: italic;
                    line-height: 1.7;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                    padding: 1.5rem 0 0 4rem;
                    max-width: 600px;
                }

                .row-tags-wrap {
                    height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transform: translateY(10px);
                }

                .row-tags {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1.25rem 0 0.5rem 4rem;
                    flex-wrap: wrap;
                }

                .row-tag {
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.35);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.4rem 0.85rem;
                    transition: border-color 0.3s ease, color 0.3s ease;
                }

                .is-expanded .row-tag {
                    border-color: rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.5);
                }

                @media (max-width: 768px) {
                    .row-inner {
                        padding: 1.75rem 0;
                    }

                    .row-main {
                        gap: 1.25rem;
                    }

                    .row-description {
                        padding-left: 3.25rem;
                    }

                    .row-tags {
                        padding-left: 3.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

const Industries = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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
            { threshold: 0.1 }
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
                '.industries-label',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            );

            // Title word-by-word reveal
            const titleWords = gsap.utils.toArray<HTMLElement>('.title-word');
            titleWords.forEach((word, i) => {
                const inner = word.querySelector('.title-word-inner');
                if (!inner) return;
                gsap.fromTo(
                    inner,
                    { y: '110%', rotateX: 20, opacity: 0 },
                    {
                        y: '0%',
                        rotateX: 0,
                        opacity: 1,
                        duration: 0.8,
                        delay: 0.2 + i * 0.08,
                        ease: 'power4.out',
                    }
                );
            });

            // Rows stagger entrance
            const rows = gsap.utils.toArray<HTMLElement>('.industry-row');
            gsap.fromTo(
                rows,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.08,
                    delay: 0.5,
                    ease: 'power3.out',
                }
            );

            // Counter reveal
            gsap.fromTo(
                '.industries-counter',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 1.0,
                    ease: 'power2.out',
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [isVisible]);

    // Parallax scroll effect on the title
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to('.industries-title', {
                y: -60,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const titleText = "From startups to enterprise, I architect solutions that scale.";
    const titleWords = titleText.split(' ');

    return (
        <section ref={containerRef} id="industries" className="industries-section">
            <div className="industries-container">
                {/* Header */}
                <div className="industries-header">
                    <div className="industries-label">
                        <span className="label-index">02</span>
                        <span className="label-line"></span>
                        <span className="label-text">Industries</span>
                    </div>

                    <h2 className="industries-title">
                        {titleWords.map((word, i) => (
                            <span key={i} className="title-word">
                                <span className={`title-word-inner ${i >= 6 ? 'text-accent' : ''}`}>
                                    {word}
                                </span>
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Industry List */}
                <div ref={listRef} className="industries-list">
                    {industries.map((industry, index) => (
                        <IndustryRow
                            key={index}
                            industry={industry}
                            index={index}
                            isExpanded={expandedIndex === index}
                            onEnter={() => setExpandedIndex(index)}
                            onLeave={() => setExpandedIndex(null)}
                        />
                    ))}
                </div>

                {/* Bottom counter */}
                <div className="industries-counter">
                    <span className="counter-label">Domains of expertise</span>
                    <span className="counter-number">
                        {expandedIndex !== null
                            ? `${String(expandedIndex + 1).padStart(2, '0')} / ${String(industries.length).padStart(2, '0')}`
                            : String(industries.length).padStart(2, '0')
                        }
                    </span>
                </div>
            </div>

            <style jsx global>{`
                .industries-section {
                    position: relative;
                    z-index: 1;
                    background: #000;
                    overflow: hidden;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                }

                .industries-container {
                    max-width: 1200px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 8rem 4rem 6rem;
                }

                /* Header */
                .industries-header {
                    margin-bottom: 5rem;
                }

                .industries-label {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    opacity: 0;
                }

                .industries-label .label-index {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: #fff;
                    letter-spacing: 0.1em;
                }

                .industries-label .label-line {
                    width: 40px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.3);
                }

                .industries-label .label-text {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.5);
                }

                /* Title */
                .industries-title {
                    font-family: 'Cormorant Garamond', var(--font-serif);
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 300;
                    line-height: 1.3;
                    color: #fff;
                    margin: 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0 0.3em;
                    perspective: 600px;
                    will-change: transform;
                }

                .title-word {
                    display: inline-block;
                    overflow: hidden;
                    vertical-align: top;
                }

                .title-word-inner {
                    display: inline-block;
                    will-change: transform, opacity;
                    transform-origin: bottom center;
                }

                .industries-title .text-accent {
                    color: rgba(255, 255, 255, 0.5);
                    font-style: italic;
                }

                /* List */
                .industries-list {
                    margin-bottom: 4rem;
                }

                /* Counter */
                .industries-counter {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    opacity: 0;
                    padding-top: 2rem;
                }

                .counter-label {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.3);
                }

                .counter-number {
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    letter-spacing: 0.1em;
                    color: rgba(255, 255, 255, 0.5);
                    transition: all 0.3s ease;
                }

                @media (max-width: 1024px) {
                    .industries-container {
                        padding: 6rem 2.5rem 5rem;
                    }
                }

                @media (max-width: 768px) {
                    .industries-container {
                        padding: 5rem 1.5rem 4rem;
                    }

                    .industries-header {
                        margin-bottom: 3rem;
                    }

                    .industries-label {
                        margin-bottom: 1.5rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Industries;
