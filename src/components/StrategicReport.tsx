"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Globe2, Anchor, Cpu, Landmark, ChevronRight } from "lucide-react";
import { useState } from "react";

export function StrategicReport() {
  const { t, language } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    {
      id: "exec",
      icon: <FileText className="w-5 h-5" />,
      title: t("Executive Summary", "Résumé Analytique"),
      content: language === "en" ? (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <p className="text-xl text-white font-light">
            The convergence of spatial computing, accelerated digital infrastructure development, and sweeping demographic transitions has positioned the African continent—with a pronounced strategic emphasis on the Middle East and North Africa (MENA) and the Mediterranean littoral—as a critical, high-yield growth frontier for Virtual Reality (VR) and Augmented Reality (AR) technologies.
          </p>
          <p>
            Historically constrained by the narrow paradigm of consumer entertainment and gaming, the virtual reality ecosystem across this geography has rapidly matured into a sophisticated, enterprise-grade infrastructure layer. Sovereign governments, regional conglomerates, and private enterprises across the Mediterranean basin are increasingly leveraging immersive technologies to optimize and secure critical economic pillars, including maritime trade, real estate development, hospitality, and workforce upskilling.
          </p>
          <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl mt-8">
            <h4 className="text-cyan-400 font-bold mb-4">Key Investment Catalysts</h4>
            <ul className="space-y-3">
              <li className="flex items-start"><span className="text-cyan-400 mr-3">✓</span> Robust double-digit Compound Annual Growth Rates (CAGRs).</li>
              <li className="flex items-start"><span className="text-cyan-400 mr-3">✓</span> Sovereign wealth capital deployments & Digital Transformation blueprints (Morocco 2030, Digital Egypt).</li>
              <li className="flex items-start"><span className="text-cyan-400 mr-3">✓</span> Favorable state-sponsored tax incentives engineered to capture FDI.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <p className="text-xl text-white font-light">
            La convergence de l'informatique spatiale, du développement accéléré des infrastructures numériques et des transitions démographiques radicales a positionné le continent africain—avec une emphase stratégique sur la région MENA et le bassin méditerranéen—comme une frontière de croissance critique à haut rendement pour les technologies de Réalité Virtuelle (RV) et Augmentée (RA).
          </p>
          <p>
            Historiquement confiné au divertissement grand public, l'écosystème de la réalité virtuelle s'est rapidement transformé en une couche d'infrastructure d'entreprise sophistiquée. Les gouvernements souverains, les conglomérats et les entreprises privées exploitent de plus en plus les technologies immersives pour optimiser et sécuriser les piliers économiques critiques : commerce maritime, immobilier, hôtellerie et formation.
          </p>
          <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl mt-8">
            <h4 className="text-cyan-400 font-bold mb-4">Catalyseurs d'Investissement Clés</h4>
            <ul className="space-y-3">
              <li className="flex items-start"><span className="text-cyan-400 mr-3">✓</span> Des taux de croissance annuelle composés (TCAC) robustes à deux chiffres.</li>
              <li className="flex items-start"><span className="text-cyan-400 mr-3">✓</span> Déploiements de fonds souverains et plans de transformation (Maroc 2030, Égypte Numérique).</li>
              <li className="flex items-start"><span className="text-cyan-400 mr-3">✓</span> Incitations fiscales étatiques très favorables pour capter les IDE.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "macro",
      icon: <Globe2 className="w-5 h-5" />,
      title: t("Macroeconomic & Digital Infrastructure", "Contexte Macroéconomique et Infrastructure"),
      content: language === "en" ? (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <h3 className="text-2xl text-white font-display mb-4">The Mobile Economy & 5G</h3>
          <p>
            The mobile telecommunications industry serves as the primary engine for digital transformation. By 2030, mobile internet subscribers in the MENA region will reach 378 million (52% of the population). The rollout of 5G represents the central catalyst for enterprise-grade VR deployment, drastically reducing latency for real-time cloud rendering. Projections suggest 5G will account for 80% of all mobile connections in MENA by 2030.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="text-4xl font-bold text-gradient mb-2">31.6%</div>
              <p className="text-sm">Projected CAGR for the MEA VR Headset Market (2024-2030), scaling to $3.09B.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <div className="text-4xl font-bold text-gradient-gold mb-2">12.5%</div>
              <p className="text-sm">CAGR for the holistic MENA VR Ecosystem (Software, Cloud, Integration), reaching $1.44B by 2031.</p>
            </div>
          </div>

          <h3 className="text-2xl text-white font-display mb-4">Sovereign Digital Strategies</h3>
          <p>
            <strong>Morocco ("Digital Morocco 2030"):</strong> Targets expansion of digital exports to 40B MAD by 2030, generating 270,000 jobs through a sovereign hybrid cloud model.<br/><br/>
            <strong>Tunisia ("Startup Act"):</strong> Pioneering legal framework providing tax breaks and state-backed financing, successfully systematizing innovation.<br/><br/>
            <strong>Egypt ("Digital Egypt"):</strong> Focuses on smart city infrastructure ($220.6M by 2025) and sweeping tax incentives for small tech enterprises under Law No. 6 of 2025.
          </p>
        </div>
      ) : (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <h3 className="text-2xl text-white font-display mb-4">L'Économie Mobile et la 5G</h3>
          <p>
            D'ici 2030, les abonnés internet mobile dans la région MENA atteindront 378 millions (52% de la population). Le déploiement de la 5G est le catalyseur central du déploiement de la RV d'entreprise, réduisant drastiquement la latence. Les projections suggèrent que la 5G représentera 80% de toutes les connexions mobiles MENA d'ici 2030.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="glass-panel p-6 rounded-2xl">
              <div className="text-4xl font-bold text-gradient mb-2">31.6%</div>
              <p className="text-sm">TCAC projeté pour le marché des casques RV MEA (2024-2030), atteignant 3,09 milliards $.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <div className="text-4xl font-bold text-gradient-gold mb-2">12.5%</div>
              <p className="text-sm">TCAC pour l'écosystème global RV MENA (Logiciel, Cloud), atteignant 1,44 milliard $ en 2031.</p>
            </div>
          </div>

          <h3 className="text-2xl text-white font-display mb-4">Stratégies Numériques Souveraines</h3>
          <p>
            <strong>Maroc ("Digital Morocco 2030"):</strong> Vise 40 milliards de dirhams d'exportations numériques et 270 000 emplois via un cloud souverain hybride.<br/><br/>
            <strong>Tunisie ("Startup Act"):</strong> Cadre juridique pionnier offrant des allègements fiscaux et des financements garantis par l'État.<br/><br/>
            <strong>Égypte ("Digital Egypt"):</strong> Se concentre sur l'infrastructure des villes intelligentes (220,6 M$ d'ici 2025) et des exonérations fiscales massives (Loi n° 6 de 2025).
          </p>
        </div>
      )
    },
    {
      id: "applications",
      icon: <Anchor className="w-5 h-5" />,
      title: t("Strategic Applications", "Applications Stratégiques"),
      content: language === "en" ? (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <h3 className="text-xl text-white font-semibold">1. Maritime Trade & Port Operations</h3>
          <p>
            The Suez Canal Authority heavily invests in DNV-certified Class-A Full Mission Bridge Simulators (360° VR) to train pilots against severe weather and hydrodynamic forces without risking multi-billion dollar vessels. In Morocco, APM Terminals (Tangier) integrated VR into its HSSE training, subjecting dockworkers to simulated "Fatal 5" risks. Organizations deploying such VR training report a <strong>43% reduction in workplace injuries globally</strong>.
          </p>

          <h3 className="text-xl text-white font-semibold mt-8">2. Real Estate & PropTech</h3>
          <p>
            Pre-construction visualization enables borderless sales, crucial for capturing GCC and diaspora investment in Egypt and Morocco. Properties featuring interactive VR tours <strong>sell up to 32% faster</strong>, close 31% quicker, and increase lead generation by 49%.
          </p>

          <h3 className="text-xl text-white font-semibold mt-8">3. Tourism & Heritage Preservation</h3>
          <p>
            With Morocco targeting 26 million visitors by 2030 and Egypt targeting 30 million, VR serves as an upstream revenue funnel. Virtual tourism allows global audiences to "try-before-they-buy" luxury resorts and antiquities, severely diminishing the perceived risk of high-cost travel and accelerating booking conversions.
          </p>

          <h3 className="text-xl text-white font-semibold mt-8">4. EdTech & Workforce Upskilling</h3>
          <p>
            Addressing youth unemployment and structural educational deficits, the MENA EdTech ecosystem heavily skews toward workforce upskilling (50% of startups). VR virtualizes expensive laboratories and heavy machinery, democratizing technical training for the youth demographic across North Africa.
          </p>
        </div>
      ) : (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <h3 className="text-xl text-white font-semibold">1. Commerce Maritime & Opérations Portuaires</h3>
          <p>
            L'Autorité du Canal de Suez investit dans des simulateurs de classe A (VR 360°) pour former les pilotes face aux forces hydrodynamiques extrêmes. Au Maroc, APM Terminals (Tanger) utilise la RV pour la formation HSSE. Les organisations déployant ces formations RV signalent une <strong>réduction de 43% des accidents du travail</strong>.
          </p>

          <h3 className="text-xl text-white font-semibold mt-8">2. Immobilier & PropTech</h3>
          <p>
            La visualisation pré-construction permet des ventes sans frontières, cruciales pour capter l'investissement du CCG et de la diaspora. Les propriétés avec visites RV <strong>se vendent jusqu'à 32% plus vite</strong> et augmentent la génération de leads de 49%.
          </p>

          <h3 className="text-xl text-white font-semibold mt-8">3. Tourisme & Préservation du Patrimoine</h3>
          <p>
            Avec le Maroc visant 26 millions de visiteurs d'ici 2030 et l'Égypte 30 millions, la RV sert d'entonnoir de revenus en amont. Le tourisme virtuel permet un essai "try-before-you-buy", diminuant le risque perçu et accélérant les conversions de réservation.
          </p>

          <h3 className="text-xl text-white font-semibold mt-8">4. EdTech & Montée en Compétences</h3>
          <p>
            Pour lutter contre le chômage des jeunes, l'EdTech MENA se concentre sur la formation professionnelle. La RV virtualise les laboratoires coûteux et la machinerie lourde, démocratisant la formation technique pour la jeunesse d'Afrique du Nord.
          </p>
        </div>
      )
    },
    {
      id: "outsourcing",
      icon: <Cpu className="w-5 h-5" />,
      title: t("Tech Outsourcing & Ecosystem", "Écosystème et Sous-traitance"),
      content: language === "en" ? (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <p>
            North Africa has rapidly emerged as a highly competitive, next-generation IT nearshoring and BPO destination for spatial computing development, systematically capturing market share from legacy hubs in Asia.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Extreme Cost Arbitrage</h4>
              <p className="text-sm">Lower operational costs convert heavy fixed R&D expenses into flexible, variable expenses for global corporations.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Linguistic Alignment</h4>
              <p className="text-sm">Francophone, Arabophone, and Anglophone agility seamlessly services Europe, the Americas, and the Middle East.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Temporal Proximity</h4>
              <p className="text-sm">Overlapping GMT/CET time zones enable real-time synchronous collaboration with European headquarters.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Regional Hubs</h4>
              <p className="text-sm">Tunisia (1,450+ startups), Egypt (AUC Venture Lab), and Morocco (INOVAT WEB) offer deep pools of native 3D and AI engineering talent.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <p>
            L'Afrique du Nord émerge rapidement comme une destination BPO et de nearshoring IT ultra-compétitive de nouvelle génération pour l'informatique spatiale, captant des parts de marché des hubs asiatiques traditionnels.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Arbitrage des Coûts Extrême</h4>
              <p className="text-sm">Les faibles coûts d'exploitation convertissent les lourdes dépenses de R&D fixes en dépenses flexibles et variables.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Alignement Linguistique</h4>
              <p className="text-sm">L'agilité francophone, arabophone et anglophone dessert parfaitement l'Europe, les Amériques et le Moyen-Orient.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Proximité Temporelle</h4>
              <p className="text-sm">Les fuseaux horaires GMT/CET qui se chevauchent permettent une collaboration synchrone avec les sièges européens.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
              <h4 className="text-white font-bold mb-2">Hubs Régionaux</h4>
              <p className="text-sm">La Tunisie (1 450+ startups), l'Égypte et le Maroc offrent d'immenses viviers de talents natifs en ingénierie 3D et IA.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "investors",
      icon: <Landmark className="w-5 h-5" />,
      title: t("The Investor Playbook", "Le Guide de l'Investisseur"),
      content: language === "en" ? (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <h3 className="text-2xl text-white font-display mb-4">Incentives & Risk Mitigation</h3>
          <p>
            North African governments have systematically weaponized their national tax codes, offering some of the most aggressive fiscal incentives globally for technology investment:
          </p>
          <ul className="space-y-4 my-6">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4" />
              <div>
                <strong className="text-white">Moroccan Investment Charter:</strong> Offers a 20% subsidy on land acquisition, 5% on infrastructure, and a massive 20% subsidy offsetting workforce training expenses. Corporate income tax is reduced to 15% for the first five years.
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4" />
              <div>
                <strong className="text-white">Tunisia (Law n° 2016-71):</strong> Sweeping corporate tax exemptions during the initial four years, with guarantees to freely transfer profits and dividends abroad in foreign currency.
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4" />
              <div>
                <strong className="text-white">Egypt (Law No. 6 of 2025):</strong> Total exemptions from state development fees, stamp taxes, and dividend taxes for small enterprises, artificially extending the survival runway for local VR startups.
              </div>
            </li>
          </ul>
          
          <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl mt-8">
            <h4 className="text-red-400 font-bold mb-2">Due Diligence Considerations</h4>
            <p className="text-sm">
              Investors must navigate hardware affordability barriers for mass-consumer models, evolving data sovereignty mandates forcing localized cloud storage, and regional infrastructure parity (grid reliability for intensive cloud-rendered VR).
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-white/70 leading-relaxed">
          <h3 className="text-2xl text-white font-display mb-4">Incitations et Atténuation des Risques</h3>
          <p>
            Les gouvernements d'Afrique du Nord ont systématiquement optimisé leurs codes fiscaux, offrant certaines des incitations fiscales les plus agressives au monde pour l'investissement technologique :
          </p>
          <ul className="space-y-4 my-6">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4" />
              <div>
                <strong className="text-white">Charte d'Investissement Marocaine :</strong> Offre une subvention de 20% sur l'acquisition de terrains, 5% sur l'infrastructure et 20% pour la formation. Impôt sur les sociétés réduit à 15% les 5 premières années.
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4" />
              <div>
                <strong className="text-white">Tunisie (Loi n° 2016-71) :</strong> Exonérations massives de l'impôt sur les sociétés les 4 premières années, avec garantie de libre transfert des bénéfices et dividendes à l'étranger.
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4" />
              <div>
                <strong className="text-white">Égypte (Loi n° 6 de 2025) :</strong> Exonérations totales des frais de développement de l'État, des droits de timbre et des impôts sur les dividendes pour les petites entreprises.
              </div>
            </li>
          </ul>
          
          <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl mt-8">
            <h4 className="text-red-400 font-bold mb-2">Considérations de Due Diligence</h4>
            <p className="text-sm">
              Les investisseurs doivent prendre en compte les barrières d'abordabilité matérielle, l'évolution des mandats de souveraineté des données exigeant un stockage local, et la fiabilité du réseau électrique.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="strategic-dossier" className="py-24 relative z-10 bg-brand-dark overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
              {t("Strategic Intelligence", "Intelligence Stratégique")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
            {t("The VR Imperative in ", "L'Impératif de la RV en ")}<br className="hidden md:block"/>
            <span className="text-gradient">Mediterranean & Africa</span>
          </h2>
          <p className="text-white/60 max-w-2xl text-lg">
            {t(
              "Comprehensive analysis of macroeconomic drivers, technological innovations, and asymmetrical investment opportunities across the MENA region.",
              "Analyse complète des moteurs macroéconomiques, des innovations technologiques et des opportunités d'investissement asymétriques dans la région MENA."
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-2 sticky top-24">
            {chapters.map((chapter, idx) => (
              <button
                key={chapter.id}
                onClick={() => setActiveChapter(idx)}
                className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                  activeChapter === idx 
                    ? "bg-white/10 border border-white/20 shadow-lg" 
                    : "hover:bg-white/5 border border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${activeChapter === idx ? "text-cyan-400" : ""}`}>
                    {chapter.icon}
                  </div>
                  <span className={`font-semibold ${activeChapter === idx ? "text-white" : ""}`}>
                    {chapter.title}
                  </span>
                </div>
                {activeChapter === idx && (
                  <motion.div layoutId="active-indicator">
                    <ChevronRight className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-8 md:p-12 rounded-3xl"
              >
                <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-white/10">
                  <div className="p-3 bg-white/5 rounded-xl text-cyan-400">
                    {chapters[activeChapter].icon}
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white">
                    {chapters[activeChapter].title}
                  </h2>
                </div>
                
                {chapters[activeChapter].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
