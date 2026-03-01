/**
 * DecorativeAssets — Floating food SVGs scattered around the signup page.
 *
 * Some assets intentionally overlap the center card boundary.
 * All use pure CSS animations (floatSlow / floatMedium).
 * Responsive: half the assets are hidden on mobile.
 */

import leaf1 from '../assets/leaf1.svg';
import leaf2 from '../assets/leaf2.svg';
import cashew from '../assets/cashew.svg';
import badam from '../assets/badam.svg';
import chilly1 from '../assets/chilly1.svg';
import jalebi from '../assets/jalebi.svg';
import pistachio from '../assets/pistacchio.svg';
import kajukatli from '../assets/kajukatli.svg';
import halwa from '../assets/halwa.svg';
import rasgulla from '../assets/rasgulla.svg';

interface Asset {
    src: string;
    alt: string;
    /** Tailwind positioning + sizing classes */
    className: string;
    /** floatSlow | floatMedium */
    speed: 'slow' | 'medium';
    /** Extra animation-delay in ms */
    delay?: number;
}

const assets: Asset[] = [
    /* ── Always visible (md+) ─────────────────────────────────────── */
    {
        src: leaf1, alt: 'Leaf',
        className: 'top-[6%] left-[6%] w-24 md:w-28 opacity-35',
        speed: 'slow',
    },
    {
        src: cashew, alt: 'Cashew',
        className: 'top-[10%] right-[12%] w-12 md:w-16 opacity-30',
        speed: 'medium', delay: 800,
    },
    {
        src: jalebi, alt: 'Jalebi',
        className: 'bottom-[8%] right-[8%] w-20 md:w-24 opacity-30',
        speed: 'slow', delay: 400,
    },
    {
        src: pistachio, alt: 'Pistachio',
        className: 'bottom-[6%] left-[10%] w-12 md:w-14 opacity-30',
        speed: 'medium', delay: 1200,
    },

    /* ── Overlapping the card boundary (visible lg+) ──────────────── */
    {
        src: badam, alt: 'Badam',
        className: 'hidden lg:block top-[18%] right-[28%] w-14 opacity-30 z-30',
        speed: 'medium', delay: 600,
    },
    {
        src: halwa, alt: 'Halwa',
        className: 'hidden lg:block bottom-[16%] left-[26%] w-24 opacity-25 z-30',
        speed: 'slow', delay: 1000,
    },
    {
        src: chilly1, alt: 'Chilly',
        className: 'hidden lg:block top-[38%] left-[8%] w-16 opacity-25',
        speed: 'medium', delay: 200,
    },

    /* ── Deep background accents (visible xl+) ────────────────────── */
    {
        src: leaf2, alt: 'Leaf',
        className: 'hidden xl:block bottom-[22%] right-[5%] w-20 opacity-20 rotate-45',
        speed: 'slow', delay: 1400,
    },
    {
        src: kajukatli, alt: 'Kaju Katli',
        className: 'hidden xl:block top-[50%] right-[6%] w-18 opacity-20',
        speed: 'medium', delay: 900,
    },
    {
        src: rasgulla, alt: 'Rasgulla',
        className: 'hidden xl:block top-[8%] left-[30%] w-14 opacity-20',
        speed: 'slow', delay: 500,
    },
];

export default function DecorativeAssets() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            {assets.map((a, i) => (
                <img
                    key={i}
                    src={a.src}
                    alt=""
                    draggable={false}
                    className={`absolute select-none ${a.speed === 'slow' ? 'animate-float-slow' : 'animate-float-medium'} ${a.className}`}
                    style={a.delay ? { animationDelay: `${a.delay}ms` } : undefined}
                />
            ))}
        </div>
    );
}
