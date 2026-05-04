export interface Partner {
  id: string;
  name: string;
  sector: string;
  country: string;
  flag: string;
  domain: string;
  description: {
    en: string;
    fr: string;
  };
  pricing: {
    en: string;
    fr: string;
  };
  opportunities: {
    en: string;
    fr: string;
  };
  headquarters?: string;
  foundedYear?: string;
  roiMetrics?: {
    en: string;
    fr: string;
  };
  compliance?: string;
}

export const partnersData: Partner[] = [
  {
    id: "pixaera",
    name: "Pixaera",
    sector: "Oil, Gas, and Energy Industry",
    country: "UK/USA",
    flag: "🇬🇧/🇺🇸",
    domain: "pixaera.com",
    headquarters: "London, UK",
    foundedYear: "2020",
    compliance: "OSHA & IOGP Rules",
    roiMetrics: {
      en: "100% SIF Prevention Focus | 45% Accident Reduction",
      fr: "Objectif 100% Prévention SIF | 45% Réduction d'accidents"
    },
    description: {
      en: "VR safety training focusing on Serious Injury and Fatality (SIF) prevention. Hardware-agnostic with offline mode.",
      fr: "Formation VR à la sécurité axée sur la prévention des blessures graves et mortelles. Indépendant du matériel avec mode hors ligne."
    },
    pricing: {
      en: "Enterprise SaaS model tailored to corporate volume.",
      fr: "Modèle SaaS d'entreprise adapté au volume."
    },
    opportunities: {
      en: "Affiliate/reseller program with 30% commission per sale. No setup fees.",
      fr: "Programme d'affiliation/revendeur avec 30% de commission par vente. Aucun frais d'installation."
    }
  },
  {
    id: "luminousxr",
    name: "Luminous XR",
    sector: "Oil, Gas, and Energy Industry",
    country: "UK",
    flag: "🇬🇧",
    domain: "luminousxr.com",
    headquarters: "Newcastle, UK",
    foundedYear: "2004",
    compliance: "Enterprise LMS Standard",
    roiMetrics: {
      en: "Rapid Content Creation | 50% Reduced Training Time",
      fr: "Création rapide de contenu | 50% Temps de formation réduit"
    },
    description: {
      en: "Immersive learning management and no-code creation platforms for enterprise clients (PORTAL and FLOW).",
      fr: "Plateformes de gestion de l'apprentissage immersif et de création sans code pour les entreprises (PORTAL et FLOW)."
    },
    pricing: {
      en: "SaaS subscription. Professional tier at $1,000/month.",
      fr: "Abonnement SaaS. Niveau professionnel à 1000 $/mois."
    },
    opportunities: {
      en: "$1,000 commission per signed client. Ready for MENA/African distributors.",
      fr: "Commission de 1000 $ par client signé. Prêt pour les distributeurs MENA/Afrique."
    }
  },
  {
    id: "sanlab",
    name: "SANLAB",
    sector: "Oil, Gas, and Energy Industry",
    country: "Turkey",
    flag: "🇹🇷",
    domain: "sanlab.com.tr",
    headquarters: "Istanbul, Turkey",
    foundedYear: "2009",
    compliance: "Heavy Machinery Safety Standards",
    roiMetrics: {
      en: "Advanced Muscle Memory | High Equipment Preservation",
      fr: "Mémoire musculaire avancée | Haute préservation des équipements"
    },
    description: {
      en: "Heavy-duty motion platforms and physical simulation technologies (6DOF, 3DOF, 2DOF).",
      fr: "Plateformes de mouvement robustes et technologies de simulation physique (6DOF, 3DOF, 2DOF)."
    },
    pricing: {
      en: "High CapEx hardware model dependent on payload and complexity.",
      fr: "Modèle matériel à dépenses en capital (CapEx) élevées selon la charge utile et la complexité."
    },
    opportunities: {
      en: "Exclusive distribution rights for regional distributors. Requires B2B tech sales background.",
      fr: "Droits de distribution exclusifs pour les distributeurs régionaux. Nécessite une expérience en ventes technologiques B2B."
    }
  },
  {
    id: "immersive-technologies",
    name: "Immersive Technologies",
    sector: "Mining and Resource Extraction",
    country: "Australia",
    flag: "🇦🇺",
    domain: "immersivetechnologies.com",
    headquarters: "Perth, Australia",
    foundedYear: "1993",
    compliance: "OEM Certified (Caterpillar/Komatsu)",
    roiMetrics: {
      en: "Lower Fuel Consumption | Optimized Maintenance",
      fr: "Baisse de consommation de carburant | Maintenance optimisée"
    },
    description: {
      en: "Global titan in mining simulation with exclusive OEM alliances (Caterpillar, Komatsu, Liebherr).",
      fr: "Titan mondial de la simulation minière avec des alliances OEM exclusives (Caterpillar, Komatsu, Liebherr)."
    },
    pricing: {
      en: "High CapEx. Massive scale operations.",
      fr: "CapEx élevé. Opérations à très grande échelle."
    },
    opportunities: {
      en: "Direct B2B/B2G channels. Requires high-level procurement access. Joint workforce development.",
      fr: "Canaux B2B/B2G directs. Nécessite un accès aux achats de haut niveau. Développement conjoint de la main-d'œuvre."
    }
  },
  {
    id: "thoroughtec",
    name: "ThoroughTec Simulation",
    sector: "Mining and Resource Extraction",
    country: "South Africa",
    flag: "🇿🇦",
    domain: "thoroughtec.com",
    headquarters: "Durban, South Africa",
    foundedYear: "1995",
    compliance: "Military-Standard Durability",
    roiMetrics: {
      en: "Low TCO | Rapid Remote Deployment",
      fr: "Faible coût total (TCO) | Déploiement à distance rapide"
    },
    description: {
      en: "Heavy-equipment simulators built to military-standard durability. Containerized systems for harsh environments.",
      fr: "Simulateurs d'équipement lourd conçus selon les normes de durabilité militaire. Systèmes conteneurisés pour environnements difficiles."
    },
    pricing: {
      en: "High CapEx but low Total Cost of Ownership via interchangeable cab architecture.",
      fr: "CapEx élevé mais faible coût total de possession via une architecture de cabine interchangeable."
    },
    opportunities: {
      en: "Partners with local heavy-equipment dealers to bundle simulators with mining equipment.",
      fr: "S'associe avec des concessionnaires locaux d'équipement lourd pour regrouper les simulateurs avec l'équipement minier."
    }
  },
  {
    id: "tecknotrove",
    name: "Tecknotrove Systems",
    sector: "Mining and Resource Extraction",
    country: "India",
    flag: "🇮🇳",
    domain: "tecknotrove.com",
    headquarters: "Mumbai, India",
    foundedYear: "2002",
    compliance: "Aviation & Defense Standard",
    roiMetrics: {
      en: "Highly Economical Scale | 75% Retention",
      fr: "Échelle très économique | 75% Rétention"
    },
    description: {
      en: "Asia's largest manufacturer of advanced training simulators. Convertible simulator kits.",
      fr: "Le plus grand fabricant asiatique de simulateurs de formation avancés. Kits de simulateurs convertibles."
    },
    pricing: {
      en: "Highly economical. VR simulator setups roughly $18,000 to $24,000 USD.",
      fr: "Très économique. Installations de simulateur VR environ 18 000 $ à 24 000 $ US."
    },
    opportunities: {
      en: "Prime, accessible target for a Mauritanian distributor to manage deployment and logistics.",
      fr: "Cible de choix et accessible pour un distributeur mauritanien pour gérer le déploiement et la logistique."
    }
  },
  {
    id: "vstep",
    name: "VSTEP",
    sector: "Fisheries and Maritime Navigation",
    country: "Netherlands",
    flag: "🇳🇱",
    domain: "vstepsimulation.com",
    headquarters: "Rotterdam, Netherlands",
    foundedYear: "2002",
    compliance: "Class A Maritime Standard",
    roiMetrics: {
      en: "Zero-Risk Collision Training | 100% Scenario Replication",
      fr: "Formation de collision à risque zéro | Réplication de scénario à 100%"
    },
    description: {
      en: "Leaders in maritime and safety simulation. NAUTIS software for desktop to Full Mission Bridge.",
      fr: "Leaders en simulation maritime et de sécurité. Logiciel NAUTIS pour ordinateur de bureau jusqu'à passerelle complète."
    },
    pricing: {
      en: "Highly flexible and tailored to desired investment level.",
      fr: "Très flexible et adapté au niveau d'investissement souhaité."
    },
    opportunities: {
      en: "Utilizes authorized resellers. Strong African presence and readiness for expansion.",
      fr: "Utilise des revendeurs agréés. Forte présence africaine et prêt pour l'expansion."
    }
  },
  {
    id: "morild",
    name: "Morild Interaktiv",
    sector: "Fisheries and Maritime Navigation",
    country: "Norway",
    flag: "🇳🇴",
    domain: "morildinteraktiv.no",
    headquarters: "Norway",
    foundedYear: "2013",
    compliance: "Pilot Organization Approved",
    roiMetrics: {
      en: "Minimal CapEx Risk | Multi-crew Efficiency",
      fr: "Risque CapEx minimal | Efficacité multi-équipage"
    },
    description: {
      en: "World's first VR ship simulator. Collaborative, multi-user training with digital avatars and hand tracking.",
      fr: "Premier simulateur de navire VR au monde. Formation collaborative multi-utilisateurs avec avatars numériques et suivi des mains."
    },
    pricing: {
      en: "Scalable subscription plans reducing CapEx. Requires only a gaming laptop and VR headset.",
      fr: "Plans d'abonnement évolutifs réduisant le CapEx. Nécessite uniquement un ordinateur portable de jeu et un casque VR."
    },
    opportunities: {
      en: "Operates via regional agents and collaborates with pilot organizations.",
      fr: "Opère via des agents régionaux et collabore avec des organisations de pilotes."
    }
  },
  {
    id: "force",
    name: "FORCE Technology",
    sector: "Fisheries and Maritime Navigation",
    country: "Denmark",
    flag: "🇩🇰",
    domain: "forcetechnology.com",
    headquarters: "Brøndby, Denmark",
    foundedYear: "1940",
    compliance: "Gov-approved RTO",
    roiMetrics: {
      en: "Zero Hardware Burden | Pre-construction Validation",
      fr: "Zéro charge matérielle | Validation pré-construction"
    },
    description: {
      en: "Government-approved RTO offering SimFlex XR remote cloud-based platform for maritime simulation.",
      fr: "RTO approuvé par le gouvernement offrant la plateforme cloud à distance SimFlex XR pour la simulation maritime."
    },
    pricing: {
      en: "SaaS / Cloud License model, shifting financial burden away from physical hardware.",
      fr: "Modèle de licence SaaS / Cloud, éloignant la charge financière du matériel physique."
    },
    opportunities: {
      en: "Integrator partnerships to set up remote simulation nodes.",
      fr: "Partenariats d'intégration pour mettre en place des nœuds de simulation à distance."
    }
  },
  {
    id: "nextworld",
    name: "Next World XR",
    sector: "Construction and Engineering",
    country: "Australia",
    flag: "🇦🇺",
    domain: "nextworldxr.com",
    headquarters: "Brisbane, Australia",
    foundedYear: "2018",
    compliance: "Safety Hazard Standards",
    roiMetrics: {
      en: "Focus Gap Identification | 45% Less Site Accidents",
      fr: "Identification des écarts de focus | 45% Moins d'accidents"
    },
    description: {
      en: "VR-native Learning Management System for safety courses with focus-tracking technology.",
      fr: "Système de gestion de l'apprentissage natif VR pour les cours de sécurité avec technologie de suivi de la concentration."
    },
    pricing: {
      en: "Flexible subscription plans based on user volume and monthly tokens.",
      fr: "Plans d'abonnement flexibles basés sur le volume d'utilisateurs et les jetons mensuels."
    },
    opportunities: {
      en: "Flex Partner Program with recurring revenue commissions from sales and renewals.",
      fr: "Programme Flex Partner avec des commissions de revenus récurrents sur les ventes et les renouvellements."
    }
  },
  {
    id: "irisvr",
    name: "IrisVR (Autodesk Workshop XR)",
    sector: "Construction and Engineering",
    country: "USA",
    flag: "🇺🇸",
    domain: "irisvr.com",
    headquarters: "USA",
    foundedYear: "2014",
    compliance: "Autodesk Architecture Standard",
    roiMetrics: {
      en: "1:1 Scale Pre-visualization | Elimination of Rework",
      fr: "Prévisualisation à l'échelle 1:1 | Élimination des retouches"
    },
    description: {
      en: "Converts 3D CAD/Revit files into walkable VR environments. Acquired by Autodesk.",
      fr: "Convertit les fichiers CAO/Revit 3D en environnements VR praticables. Acquis par Autodesk."
    },
    pricing: {
      en: "Transitioning into Autodesk Workshop XR enterprise bundles.",
      fr: "Transition vers les offres groupées d'entreprise Autodesk Workshop XR."
    },
    opportunities: {
      en: "Distribution falls strictly under the Autodesk channel partner ecosystem.",
      fr: "La distribution relève strictement de l'écosystème des partenaires Autodesk."
    }
  },
  {
    id: "360immersive",
    name: "360 Immersive",
    sector: "Construction and Engineering",
    country: "USA",
    flag: "🇺🇸",
    domain: "360immersive.com",
    headquarters: "Boise, Idaho, USA",
    foundedYear: "2001",
    compliance: "OSHA-compliant",
    roiMetrics: {
      en: "Microlearning Efficiency | 75% Information Retention",
      fr: "Efficacité du microlearning | 75% Rétention d'information"
    },
    description: {
      en: "OSHA-compliant VR training with gamified 20-minute microlearning modules.",
      fr: "Formation VR conforme à l'OSHA avec des modules de microapprentissage ludiques de 20 minutes."
    },
    pricing: {
      en: "Highly affordable SaaS. Plans start at $8.50/user/month or $99/month for 25 trainees.",
      fr: "SaaS très abordable. Plans à partir de 8,50 $/utilisateur/mois ou 99 $/mois pour 25 stagiaires."
    },
    opportunities: {
      en: "Lucrative B2B reseller program requiring local SCORM-compliant LMS and setup fee.",
      fr: "Programme revendeur B2B lucratif nécessitant un LMS local conforme à SCORM et des frais de configuration."
    }
  },
  {
    id: "avantis",
    name: "Avantis Education (ClassVR)",
    sector: "Technical and Vocational Education (TVET)",
    country: "UK",
    flag: "🇬🇧",
    domain: "avantiseducation.com",
    headquarters: "Gloucester, UK",
    foundedYear: "2000s",
    compliance: "Global EdTech Standard",
    roiMetrics: {
      en: "75% Student Engagement Boost | Scalable Deployment",
      fr: "Hausse d'engagement de 75% | Déploiement évolutif"
    },
    description: {
      en: "Unified hardware and software ecosystem of standalone VR headsets controlled via a teacher portal.",
      fr: "Écosystème matériel et logiciel unifié de casques VR autonomes contrôlés via un portail enseignant."
    },
    pricing: {
      en: "Affordable school bundles including hardware, charging carts, and software.",
      fr: "Offres scolaires abordables comprenant du matériel, des chariots de chargement et des logiciels."
    },
    opportunities: {
      en: "Avantis Assured program with Gold partner margins and marketing development funds.",
      fr: "Programme Avantis Assured avec des marges de partenaire Gold et des fonds de développement marketing."
    }
  },
  {
    id: "zspace",
    name: "zSpace",
    sector: "Technical and Vocational Education (TVET)",
    country: "USA",
    flag: "🇺🇸",
    domain: "zspace.com",
    headquarters: "San Jose, CA, USA",
    foundedYear: "2007",
    compliance: "STEM & CTE Standards",
    roiMetrics: {
      en: "Zero Motion Sickness | Deep CTE Skill Transfer",
      fr: "Zéro mal des transports | Transfert de compétences CTE profond"
    },
    description: {
      en: "Headset-free AR/VR stereoscopic laptops for deep STEM and CTE lab work.",
      fr: "Ordinateurs portables stéréoscopiques AR/VR sans casque pour les travaux pratiques approfondis en STEM et CTE."
    },
    pricing: {
      en: "Hardware CapEx model aligned with educational grants.",
      fr: "Modèle matériel CapEx aligné sur les subventions éducatives."
    },
    opportunities: {
      en: "International sales channel network. Highly receptive to new overseas distributors.",
      fr: "Réseau de canaux de vente internationaux. Très réceptif aux nouveaux distributeurs étrangers."
    }
  },
  {
    id: "victoryxr",
    name: "VictoryXR",
    sector: "Technical and Vocational Education (TVET)",
    country: "USA",
    flag: "🇺🇸",
    domain: "victoryxr.com",
    headquarters: "Davenport, Iowa, USA",
    foundedYear: "2016",
    compliance: "Higher Ed & K-12 Accreditations",
    roiMetrics: {
      en: "50% Reduced Infrastructure Cost | Infinite Lab Access",
      fr: "50% de réduction des coûts d'infrastructure | Accès infini au labo"
    },
    description: {
      en: "Global leader in educational VR, providing digital twin campuses and CTE modules with AI tutors.",
      fr: "Leader mondial de la réalité virtuelle éducative, proposant des campus virtuels et des modules CTE avec des tuteurs IA."
    },
    pricing: {
      en: "Turnkey bundles. K-12 Bronze: $9,600. Higher Ed Starter: $20,937. Digital Twin Campus: ~$101,876.",
      fr: "Offres clés en main. K-12 Bronze : 9600 $. Démarrage enseignement supérieur : 20 937 $. Campus numérique : ~101 876 $."
    },
    opportunities: {
      en: "Streamlined turnkey products ideal for tendering to the Mauritanian Ministry of Education.",
      fr: "Produits clés en main simplifiés idéaux pour répondre aux appels d'offres du ministère mauritanien de l'Éducation."
    }
  },
  {
    id: "avatar-medical",
    name: "Avatar Medical",
    sector: "Medicine and Healthcare",
    country: "France",
    flag: "🇫🇷",
    domain: "avatarmedical.ai",
    headquarters: "Paris, France",
    foundedYear: "2020",
    compliance: "FDA-Cleared & CE-Marked",
    roiMetrics: {
      en: "Real-time Patient Data Visualization | Error Reduction",
      fr: "Visualisation des données patient en temps réel | Réduction des erreurs"
    },
    description: {
      en: "Converts 2D MRI and CT scans into fully interactive 3D/VR spatial representations.",
      fr: "Convertit les examens IRM et scanner 2D en représentations spatiales 3D/VR entièrement interactives."
    },
    pricing: {
      en: "University/Hospital SaaS subscription model.",
      fr: "Modèle d'abonnement SaaS Université/Hôpital."
    },
    opportunities: {
      en: "Deep French academic roots provide immediate linguistic synergy for the Mauritanian market.",
      fr: "Les racines académiques françaises profondes offrent une synergie linguistique immédiate pour le marché mauritanien."
    }
  },
  {
    id: "fundamentalvr",
    name: "FundamentalVR",
    sector: "Medicine and Healthcare",
    country: "UK",
    flag: "🇬🇧",
    domain: "fundamentalvr.com",
    headquarters: "London, UK",
    foundedYear: "2012",
    compliance: "Clinical Grade Standards",
    roiMetrics: {
      en: "75% Cost Disruption vs Legacy | High Tactile Fidelity",
      fr: "75% Perturbation des coûts vs Héritage | Haute fidélité tactile"
    },
    description: {
      en: "HapticVR platform injecting physical tactile feedback into virtual surgery.",
      fr: "Plateforme HapticVR injectant un retour tactile physique dans la chirurgie virtuelle."
    },
    pricing: {
      en: "Disruptive pricing: ~$7,500 for hardware paired with $350/month SaaS subscription.",
      fr: "Tarification disruptive : ~7500 $ pour le matériel couplé à un abonnement SaaS de 350 $/mois."
    },
    opportunities: {
      en: "Scales via formal commercial distribution agreements. Actively seeking new geographic markets.",
      fr: "Évolue via des accords de distribution commerciale formels. Recherche active de nouveaux marchés."
    }
  },
  {
    id: "simx",
    name: "SimX",
    sector: "Medicine and Healthcare",
    country: "USA",
    flag: "🇺🇸",
    domain: "simxvr.com",
    headquarters: "San Francisco, CA",
    foundedYear: "2013",
    compliance: "Global Medical Simulation",
    roiMetrics: {
      en: "Infinite Repetition | 100% Collaborative Scalability",
      fr: "Répétition infinie | Évolutivité collaborative 100%"
    },
    description: {
      en: "Comprehensive VR medical simulation platform with multiplayer capabilities.",
      fr: "Plateforme complète de simulation médicale VR avec des capacités multijoueurs."
    },
    pricing: {
      en: "SaaS: $3,000/headset/year (Pro tier) or $100/student/year.",
      fr: "SaaS : 3000 $/casque/an (niveau Pro) ou 100 $/étudiant/an."
    },
    opportunities: {
      en: "International distributor program is highly accessible for Mauritanian representation.",
      fr: "Le programme de distribution international est très accessible pour la représentation mauritanienne."
    }
  }
];
