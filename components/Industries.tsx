import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const industries = [
    {
        name: "Ecommerce",
        number: "01",
        description: "Scalable platforms that handle millions of transactions",
    },
    {
        name: "Cyber Security",
        number: "02",
        description: "Zero-trust architectures and threat detection systems",
    },
    {
        name: "Healthcare",
        number: "03",
        description: "HIPAA-compliant systems for patient data management",
    },
    {
        name: "Hospitality",
        number: "04",
        description: "Real-time booking engines and guest experiences",
    },
    {
        name: "Artificial Intelligence",
        number: "05",
        description: "ML pipelines and intelligent automation systems",
    },
    {
        name: "Manufacturing",
        number: "06",
        description: "IoT integration and supply chain optimization",
    }
];

interface CardProps {
    industry: typeof industries[0];
    index: number;
    isActive: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const IndustryCard = ({ industry, index, isActive, onMouseEnter, onMouseLeave }: CardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const bgNumberRef = useRef<HTMLSpanElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const borderRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const breatheAnimRef = useRef<gsap.core.Tween | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Active state animations - breathing glow, line draw, bg number spring
    useEffect(() => {
        if (!cardRef.current) return;
        const border = borderRef.current;
        const line = lineRef.current;
        const bgNum = bgNumberRef.current;
        const glow = glowRef.current;

        if (isActive) {
            // Breathing border glow
            if (border) {
                breatheAnimRef.current = gsap.to(border, {
                    borderColor: 'rgba(255, 255, 255, 0.45)',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.08), inset 0 0 30px rgba(255, 255, 255, 0.03)',
                    duration: 1.2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }

            // Line draw animation
            if (line) {
                gsap.fromTo(line,
                    { width: 0, opacity: 1 },
                    { width: 80, duration: 0.6, ease: 'power2.out' }
                );
            }

            // Background number spring scale
            if (bgNum) {
                gsap.to(bgNum, {
                    scale: 1.15,
                    x: -15,
                    y: -15,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)',
                    overwrite: true,
                });
            }

            // Glow fade in
            if (glow) {
                gsap.to(glow, { opacity: 1, duration: 0.3 });
            }
        } else {
            // Clean up breathing animation
            if (breatheAnimRef.current) {
                breatheAnimRef.current.kill();
                breatheAnimRef.current = null;
            }

            if (border) {
                gsap.to(border, {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: 'none',
                    duration: 0.4,
                    overwrite: true,
                });
            }

            if (line) {
                gsap.to(line, { width: 40, duration: 0.4, ease: 'power2.out' });
            }

            if (bgNum) {
                gsap.to(bgNum, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    overwrite: true,
                });
            }

            if (glow) {
                gsap.to(glow, { opacity: 0, duration: 0.3 });
            }
        }

        return () => {
            if (breatheAnimRef.current) {
                breatheAnimRef.current.kill();
                breatheAnimRef.current = null;
            }
        };
    }, [isActive]);

    return (
        <div
            ref={cardRef}
            className={`industry-card interactive ${isActive ? 'is-active' : ''}`}
            data-card-index={index}
            onMouseMove={handleMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
            } as React.CSSProperties}
        >
            <div className="card-bg"></div>
            <div ref={glowRef} className="card-glow"></div>
            <div className="card-light-ray" aria-hidden="true"></div>
            <div ref={borderRef} className="card-border"></div>

            <div ref={contentRef} className="card-content">
                <div className="card-header">
                    <span className="card-number card-parallax-item" data-parallax-speed="0.3">{industry.number}</span>
                </div>

                <h3 className="card-title card-parallax-item" data-parallax-speed="0.15">{industry.name}</h3>

                <p className="card-description card-parallax-item" data-parallax-speed="0.08">{industry.description}</p>

                <div ref={lineRef} className="card-line card-parallax-item" data-parallax-speed="0.05"></div>
            </div>

            <span ref={bgNumberRef} className="card-bg-number" data-parallax-speed="0.6">{industry.number}</span>

            <style jsx>{`
                .industry-card {
                    flex-shrink: 0;
                    width: clamp(300px, 28vw, 400px);
                    height: 50vh;
                    min-height: 380px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 2.5rem;
                    overflow: hidden;
                    cursor: pointer;
                    will-change: transform, opacity;
                }

                .card-bg {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        135deg,
                        rgba(20, 20, 20, 0.9) 0%,
                        rgba(10, 10, 10, 0.95) 100%
                    );
                    backdrop-filter: blur(20px);
                    transition: background 0.4s ease;
                }

                .industry-card.is-active .card-bg {
                    background: linear-gradient(
                        135deg,
                        rgba(40, 40, 40, 0.9) 0%,
                        rgba(15, 15, 15, 0.95) 100%
                    );
                }

                .card-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        500px circle at var(--mouse-x) var(--mouse-y),
                        rgba(255, 255, 255, 0.06),
                        transparent 40%
                    );
                    opacity: 0;
                    pointer-events: none;
                }

                .card-light-ray {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60%;
                    height: 120px;
                    background: linear-gradient(
                        180deg,
                        rgba(255, 250, 240, 0.06) 0%,
                        transparent 100%
                    );
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.6s ease;
                    z-index: 1;
                }

                .is-active .card-light-ray {
                    opacity: 1;
                }

                .card-border {
                    position: absolute;
                    inset: 0;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    pointer-events: none;
                }

                .card-content {
                    position: relative;
                    z-index: 2;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .card-header {
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-start;
                    margin-bottom: auto;
                }

                .card-number {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.4);
                    letter-spacing: 0.1em;
                }

                .card-title {
                    font-family: var(--font-display);
                    font-size: clamp(1.5rem, 2.5vw, 2rem);
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 1rem;
                    letter-spacing: -0.02em;
                    transition: color 0.3s;
                }

                .card-description {
                    font-family: var(--font-serif);
                    font-size: 0.95rem;
                    font-style: italic;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 0 0 2rem;
                    transition: color 0.3s;
                }

                .industry-card.is-active .card-description {
                    color: rgba(255, 255, 255, 0.6);
                }

                .card-line {
                    height: 1px;
                    width: 40px;
                    background: rgba(255, 255, 255, 0.4);
                }

                .industry-card.is-active .card-line {
                    background: #fff;
                }

                .card-bg-number {
                    position: absolute;
                    bottom: -2rem;
                    right: -1rem;
                    font-family: var(--font-display);
                    font-size: 10rem;
                    font-weight: 700;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
                    line-height: 1;
                    pointer-events: none;
                    will-change: transform;
                }

                .industry-card.is-active .card-bg-number {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

const Industries = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsHeaderVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const horizontal = horizontalRef.current;
        const container = containerRef.current;
        const header = headerRef.current;
        if (!horizontal || !container) return;

        const scrollWidth = horizontal.scrollWidth - window.innerWidth;

        const ctx = gsap.context(() => {
            // --- Main horizontal scroll ---
            gsap.to(horizontal, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: () => `+=${scrollWidth}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        if (progress > 0.75) {
                            const fadeProgress = (progress - 0.75) / 0.25;
                            container.style.opacity = String(1 - fadeProgress * 0.8);
                        } else {
                            container.style.opacity = '1';
                        }
                    }
                }
            });

            const cards = horizontal.querySelectorAll('.industry-card');

            // --- Parallax depth within cards ---
            // Background numbers and content items move at different rates
            cards.forEach((card) => {
                const bgNumber = card.querySelector('.card-bg-number');
                const parallaxItems = card.querySelectorAll('.card-parallax-item');

                if (bgNumber) {
                    const speed = parseFloat((bgNumber as HTMLElement).dataset.parallaxSpeed || '0.5');
                    gsap.to(bgNumber, {
                        y: () => -80 * speed,
                        x: () => -40 * speed,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top top',
                            end: () => `+=${scrollWidth}`,
                            scrub: 1,
                            invalidateOnRefresh: true,
                        }
                    });
                }

                parallaxItems.forEach((item) => {
                    const speed = parseFloat((item as HTMLElement).dataset.parallaxSpeed || '0.1');
                    gsap.to(item, {
                        y: () => -30 * speed,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top top',
                            end: () => `+=${scrollWidth}`,
                            scrub: 1,
                            invalidateOnRefresh: true,
                        }
                    });
                });
            });

            // --- Header word scatter/dissolve ---
            if (header) {
                // Wrap each word in the header title in a span for individual animation
                const titleEl = header.querySelector('.header-title');
                if (titleEl) {
                    const html = titleEl.innerHTML;
                    // Split by words but preserve <br /> and <span> tags
                    const processNode = (node: Node): string => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            const text = node.textContent || '';
                            return text.split(/(\s+)/).map(word => {
                                if (word.trim() === '') return word;
                                // Random scatter direction
                                const rx = (Math.random() - 0.5) * 120;
                                const ry = (Math.random() - 0.5) * 80;
                                return `<span class="scatter-word" data-rx="${rx}" data-ry="${ry}" style="display:inline-block;will-change:transform,opacity,filter;">${word}</span>`;
                            }).join('');
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            const el = node as Element;
                            if (el.tagName === 'BR') return '<br />';
                            const children = Array.from(el.childNodes).map(processNode).join('');
                            // Preserve the element but process its children
                            const attrs = Array.from(el.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
                            return `<${el.tagName.toLowerCase()} ${attrs}>${children}</${el.tagName.toLowerCase()}>`;
                        }
                        return '';
                    };

                    // Create a temp container to parse
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    titleEl.innerHTML = Array.from(temp.childNodes).map(processNode).join('');

                    // Animate scatter words
                    const scatterWords = titleEl.querySelectorAll('.scatter-word');
                    scatterWords.forEach((word) => {
                        const rx = parseFloat((word as HTMLElement).dataset.rx || '0');
                        const ry = parseFloat((word as HTMLElement).dataset.ry || '0');

                        gsap.to(word, {
                            x: rx,
                            y: ry,
                            opacity: 0,
                            filter: 'blur(8px)',
                            ease: 'power2.in',
                            scrollTrigger: {
                                trigger: container,
                                start: () => `top+=${scrollWidth * 0.2} top`,
                                end: () => `top+=${scrollWidth * 0.45} top`,
                                scrub: 1,
                            }
                        });
                    });

                    // Also scatter the label
                    const labelEl = header.querySelector('.header-label');
                    if (labelEl) {
                        gsap.to(labelEl, {
                            y: -40,
                            opacity: 0,
                            filter: 'blur(6px)',
                            ease: 'power2.in',
                            scrollTrigger: {
                                trigger: container,
                                start: () => `top+=${scrollWidth * 0.15} top`,
                                end: () => `top+=${scrollWidth * 0.35} top`,
                                scrub: 1,
                            }
                        });
                    }
                }
            }
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="industries-section">
            <div ref={headerRef} className={`industries-header ${isHeaderVisible ? 'is-visible' : ''}`}>
                <div className="header-label">
                    <span className="label-index">02</span>
                    <span className="label-line"></span>
                    <span className="label-text">Industries</span>
                </div>

                <h2 className="header-title">
                    From startups to enterprise,
                    <br />
                    <span className="text-accent">I architect solutions that scale.</span>
                </h2>
            </div>

            <div ref={horizontalRef} className="industries-scroll">
                {industries.map((industry, index) => (
                    <IndustryCard
                        key={index}
                        industry={industry}
                        index={index}
                        isActive={activeIndex === index}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    />
                ))}
            </div>

            <div className="industries-progress">
                <div className="progress-track">
                    <div className="progress-fill"></div>
                </div>
                <span className="progress-text">Scroll to explore</span>
            </div>

            <style jsx global>{`
                .industries-section {
                    height: 100vh;
                    overflow: hidden;
                    background: #000;
                    position: relative;
                    z-index: 1;
                    perspective: 1200px;
                }

                .pin-spacer {
                    z-index: 1 !important;
                }

                .industries-header {
                    position: absolute;
                    top: 10vh;
                    left: 4rem;
                    z-index: 10;
                    max-width: 700px;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }

                .industries-header.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .header-label {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .label-index {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: #fff;
                    letter-spacing: 0.1em;
                }

                .label-line {
                    width: 40px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.3);
                }

                .label-text {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.5);
                }

                .header-title {
                    font-family: var(--font-serif);
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 300;
                    line-height: 1.3;
                    color: #fff;
                    margin: 0;
                }

                .text-accent {
                    color: rgba(255, 255, 255, 0.6);
                    font-style: italic;
                }

                .industries-scroll {
                    display: flex;
                    height: 100vh;
                    padding-left: 4rem;
                    padding-top: 32vh;
                    gap: 2rem;
                    will-change: transform;
                    transform-style: preserve-3d;
                }

                .industries-scroll::after {
                    content: '';
                    flex-shrink: 0;
                    width: 15vw;
                }

                .industries-progress {
                    position: absolute;
                    bottom: 3rem;
                    left: 4rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    z-index: 10;
                }

                .progress-track {
                    width: 100px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.15);
                    position: relative;
                    overflow: hidden;
                }

                .progress-fill {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 30%;
                    background: rgba(255, 255, 255, 0.6);
                    animation: progressPulse 2s ease-in-out infinite;
                }

                @keyframes progressPulse {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(300%); }
                }

                .progress-text {
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.4);
                }

                @media (max-width: 768px) {
                    .industries-header {
                        left: 2rem;
                        right: 2rem;
                    }

                    .industries-scroll {
                        padding-left: 2rem;
                        padding-top: 35vh;
                        gap: 1.5rem;
                    }

                    .industries-progress {
                        left: 2rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Industries;
