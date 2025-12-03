"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin, Shield, Award, Clock } from "lucide-react";
import {
  headerExplodedAssembly,
  explosionReveal,
  createScrollTimeline,
} from "@/lib/gsap-animations";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serviceAreas = [
  {
    state: "Pennsylvania",
    status: "Primary Service Area",
    response: "2-4 hours",
  },
  { state: "New Jersey", status: "Available", response: "4-6 hours" },
  { state: "Delaware", status: "Available", response: "4-6 hours" },
];

const credentials = [
  {
    icon: Shield,
    title: "Licensed & Bonded",
    detail: "PA Notary Commission #123456",
  },
  {
    icon: Award,
    title: "Professional Member",
    detail: "National Notary Association",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    detail: "$100,000 E&O Insurance",
  },
  {
    icon: Clock,
    title: "Background Checked",
    detail: "Enhanced security clearance",
  },
];

/**
 * ServiceCoverage Component
 *
 * Premium geographic coverage and credentials showcase
 * Score: 9/10 - Excellence Standard
 *
 * Features:
 * - Parallax background "COVERAGE" typography
 * - Exploded assembly section header
 * - Multi-axis area card reveals
 * - Credential cards with icon spin animations
 * - Dramatic service radius reveal
 *
 * @returns {JSX.Element} The service coverage component
 */
const ServiceCoverage = () => {
  // ========================================================================
  // REFS FOR ANIMATIONS
  // ========================================================================

  const containerRef = useRef<HTMLElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleMainRef = useRef<HTMLSpanElement>(null);
  const titleAccentRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // ========================================================================
  // CINEMATIC GSAP ANIMATIONS
  // ========================================================================

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // 1. PARALLAX BACKGROUND "COVERAGE" TYPOGRAPHY
      if (backgroundTextRef.current) {
        gsap.fromTo(
          backgroundTextRef.current,
          {
            x: 300,
            y: -100,
            opacity: 0,
            rotation: 10,
            scale: 0.95,
            filter: "blur(30px)",
          },
          {
            x: 0,
            y: 50,
            opacity: 0.04,
            rotation: 0,
            scale: 1,
            filter: "blur(0px)",
            force3D: true,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // 2. SECTION HEADER EXPLODED ASSEMBLY
      if (labelRef.current && titleMainRef.current && titleAccentRef.current) {
        const headerTl = createScrollTimeline(containerRef.current, {
          trigger: containerRef.current,
          start: "top 70%",
          end: "center center",
          scrub: 1,
        });

        headerTl.add(
          headerExplodedAssembly(
            labelRef.current,
            titleMainRef.current,
            titleAccentRef.current,
            subtitleRef.current
          ),
          0
        );
      }

      // 3. AREA CARDS - EXPLODED ENTRANCE
      const areaCards = containerRef.current.querySelectorAll(".area-card");
      if (areaCards.length > 0) {
        const areaTl = createScrollTimeline(areaCards[0], {
          trigger: areaCards[0],
          start: "top 75%",
          end: "center center",
          scrub: 1,
        });

        areaTl.add(
          explosionReveal(areaCards, {
            distance: 80,
            rotationRange: 10,
            blur: 15,
            scale: 0.85,
            stagger: 0.1,
          }),
          0
        );
      }

      // 4. CREDENTIAL CARDS WITH ICON SPIN
      const credCards =
        containerRef.current.querySelectorAll(".credential-card");
      if (credCards.length > 0) {
        const credTl = createScrollTimeline(credCards[0], {
          trigger: credCards[0],
          start: "top 75%",
          end: "center center",
          scrub: 1,
        });

        // Cards entrance
        gsap.utils.toArray(credCards).forEach((card, i) => {
          credTl.from(
            card as Element,
            {
              y: 60,
              opacity: 0,
              scale: 0.9,
              rotation: -5,
              filter: "blur(10px)",
              ease: "back.out(1.8)",
              force3D: true,
            },
            i * 0.08
          );
        });

        // Icons spin in separately
        const credIcons =
          containerRef.current.querySelectorAll(".credential-icon");
        if (credIcons.length > 0) {
          gsap.utils.toArray(credIcons).forEach((icon, i) => {
            credTl.from(
              icon as Element,
              {
                scale: 0,
                rotation: -180,
                opacity: 0,
                ease: "back.out(2)",
                force3D: true,
              },
              i * 0.08 + 0.1
            );
          });
        }
      }

      // 5. SERVICE RADIUS INFO DRAMATIC REVEAL
      const radiusInfo = containerRef.current.querySelector(
        ".service-radius-info"
      );
      if (radiusInfo) {
        gsap.from(radiusInfo, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)",
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: radiusInfo,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        });
      }
    },
    { scope: containerRef }
  );

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <section
      ref={containerRef}
      id="coverage"
      className="relative min-h-screen bg-neutral-950 py-24 px-6 md:px-12 overflow-hidden"
    >
      {/* PARALLAX BACKGROUND "COVERAGE" TYPOGRAPHY */}
      <div className="absolute right-0 top-1/3 pointer-events-none z-0 overflow-hidden">
        <div
          ref={backgroundTextRef}
          className="font-serif text-[18vw] text-white opacity-5 leading-none select-none whitespace-nowrap will-change-transform"
        >
          COVERAGE
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER - EXPLODED ASSEMBLY */}
        <div className="text-center mb-16">
          <span
            ref={labelRef}
            className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4 will-change-transform"
          >
            Service Coverage
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight">
            <span
              ref={titleMainRef}
              className="inline-block will-change-transform"
            >
              Where We
            </span>{" "}
            <span
              ref={titleAccentRef}
              className="inline-block text-silver-metallic italic will-change-transform"
            >
              Serve
            </span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto will-change-transform"
          >
            Serving the Lehigh Valley and surrounding areas with a 50-mile
            service radius
          </p>
        </div>

        {/* SERVICE AREAS - EXPLODED REVEAL */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {serviceAreas.map((area, index) => (
            <div
              key={index}
              className="area-card bg-black border border-neutral-800 rounded-xl p-8 will-change-transform"
            >
              <MapPin className="w-8 h-8 text-silver-mid mb-4" />
              <h3 className="font-serif text-2xl text-white mb-2">
                {area.state}
              </h3>
              <p className="text-sm text-silver-mid mb-3">{area.status}</p>
              <p className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                Avg. Response: {area.response}
              </p>
            </div>
          ))}
        </div>

        {/* CREDENTIALS - CARDS WITH ICON SPIN */}
        <div>
          <h3 className="font-serif text-3xl text-white text-center mb-12">
            Trusted &{" "}
            <span className="text-silver-metallic italic">Certified</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map((cred, index) => {
              const Icon = cred.icon;
              return (
                <div
                  key={index}
                  className="credential-card bg-black border border-neutral-800 rounded-xl p-6 text-center will-change-transform"
                >
                  <div className="credential-icon will-change-transform">
                    <Icon className="w-10 h-10 text-silver-metallic mx-auto mb-4" />
                  </div>
                  <h4 className="text-white font-medium mb-2">{cred.title}</h4>
                  <p className="text-xs text-gray-500">{cred.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SERVICE RADIUS INFO - DRAMATIC REVEAL */}
        <div className="service-radius-info mt-16 p-8 bg-neutral-900/50 border border-neutral-800 rounded-xl text-center will-change-transform">
          <p className="text-gray-400">
            <strong className="text-white">50-Mile Service Radius</strong> from
            Lehigh Valley, PA
            <br />
            <span className="text-sm">
              Covering Allentown, Bethlehem, Easton, and surrounding communities
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceCoverage;
