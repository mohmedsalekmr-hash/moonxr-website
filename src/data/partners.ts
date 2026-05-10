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
    id: "uptale",
    name: "Uptale",
    sector: "Formation Professionnelle et Technique",
    country: "France",
    flag: "🇫🇷",
    domain: "uptale.io",
    headquarters: "Paris, France",
    foundedYear: "2017",
    compliance: "Natif/Offline",
    roiMetrics: {
      en: "100% Immersive Learning | Native Offline",
      fr: "100% Apprentissage Immersif | Hors Ligne Natif"
    },
    description: {
      en: "Immersive Learning SaaS platform with native offline mode and AI voice synthesis.",
      fr: "Plateforme SaaS d'Immersive Learning avec mode hors ligne natif et synthèse vocale IA."
    },
    pricing: {
      en: "Pro Plan from $17k/year (100 learners). Education pricing significantly lower ($5k-$10k).",
      fr: "Plan Pro dès 17 000 $/an (100 apprenants). Tarifs éducation réduits (5k€-10k€)."
    },
    opportunities: {
      en: "Formal reseller program with 20-35% margins. Ideal for INAP-FTP and SNIM mining sites.",
      fr: "Programme revendeur formel avec marges de 20 à 35 %. Idéal pour INAP-FTP et sites miniers SNIM."
    }
  },
  {
    id: "mimbus",
    name: "Mimbus",
    sector: "Formation Professionnelle et Technique",
    country: "France",
    flag: "🇫🇷",
    domain: "mimbus.com",
    headquarters: "Toulouse, France",
    foundedYear: "2011",
    compliance: "Software only",
    roiMetrics: {
      en: "70% Export Revenue | High Reseller Margin",
      fr: "70% CA à l'export | Haute marge revendeur"
    },
    description: {
      en: "VR modules for manual trades (BTP, mechanics, electricity, carpentry).",
      fr: "Modules VR pour les métiers manuels (BTP, mécanique, électricité, menuiserie)."
    },
    pricing: {
      en: "Software licensing model for Meta Quest standalone.",
      fr: "Modèle de licences logicielles pour Meta Quest autonome."
    },
    opportunities: {
      en: "Reseller margins of 25-30%. Direct alignment with INAP-FTP priorities.",
      fr: "Marges revendeur de 25 à 30 %. Alignement direct avec les priorités de l'INAP-FTP."
    }
  },
  {
    id: "immersivefactory",
    name: "Immersive Factory",
    sector: "Formation Professionnelle et Technique",
    country: "France",
    flag: "🇫🇷",
    domain: "immersivefactory.com",
    headquarters: "Paris, France",
    foundedYear: "2016",
    compliance: "HSE Standards",
    roiMetrics: {
      en: "Unlimited Access | Hardware Included",
      fr: "Accès illimité | Matériel inclus"
    },
    description: {
      en: "SafetyBox VR© providing preloaded HSE (Health, Safety, Environment) training catalogs.",
      fr: "SafetyBox VR© fournissant des catalogues de formation HSE (Santé, Sécurité, Environnement) préchargés."
    },
    pricing: {
      en: "~€5,500 – €7,500 per box/year including hardware and 12-month unlimited use.",
      fr: "~5 500 € – 7 500 € par box/an incluant le matériel et 12 mois d'utilisation illimitée."
    },
    opportunities: {
      en: "Essential HSE compliance tool for major mining and gas projects (SNIM, Kinross).",
      fr: "Outil essentiel de conformité HSE pour les projets miniers et gaziers (SNIM, Kinross)."
    }
  },
  {
    id: "hypnovr",
    name: "HypnoVR",
    sector: "Santé et VR Médicale",
    country: "France",
    flag: "🇫🇷",
    domain: "hypnovr.io",
    headquarters: "Strasbourg, France",
    foundedYear: "2016",
    compliance: "CE Class I Medical Device",
    roiMetrics: {
      en: "OPEX Friendly | Hardware Replaced",
      fr: "Favorable OPEX | Matériel remplacé"
    },
    description: {
      en: "Medical hypnosis VR software for pain and anxiety management.",
      fr: "Logiciel VR d'hypnose médicale pour la gestion de la douleur et de l'anxiété."
    },
    pricing: {
      en: "From €149/month including software, hardware, noise-canceling headphones, and tablet.",
      fr: "Dès 149 €/mois incluant logiciel, matériel, casque antibruit et tablette."
    },
    opportunities: {
      en: "Exclusive 24-month representation for Mauritania and Senegal. Ideal for CHU and private clinics.",
      fr: "Représentation exclusive de 24 mois pour la Mauritanie et le Sénégal. Idéal pour CHU et cliniques."
    }
  },
  {
    id: "simforhealth",
    name: "SimforHealth",
    sector: "Santé et VR Médicale",
    country: "France",
    flag: "🇫🇷",
    domain: "simforhealth.com",
    headquarters: "Bordeaux, France",
    foundedYear: "2008",
    compliance: "Clinical Simulation",
    roiMetrics: {
      en: "International Clinical Case Library",
      fr: "Bibliothèque internationale de cas cliniques"
    },
    description: {
      en: "MedicActiV platform offering a global library of virtual clinical cases.",
      fr: "Plateforme MedicActiV offrant une bibliothèque mondiale de cas cliniques virtuels."
    },
    pricing: {
      en: "Between €60 and €150 per learner per year for nursing skills collections.",
      fr: "Entre 60 € et 150 € par apprenant et par an pour la collection Compétences Infirmières."
    },
    opportunities: {
      en: "Perfect match for Mauritanian nursing curriculum and Medical Faculty.",
      fr: "Correspondance parfaite avec le cursus infirmier mauritanien et la Faculté de Médecine."
    }
  },
  {
    id: "lumeen",
    name: "Lumeen",
    sector: "Santé et VR Médicale",
    country: "France",
    flag: "🇫🇷",
    domain: "lumeen.com",
    headquarters: "Lyon, France",
    foundedYear: "2019",
    compliance: "Social & Medical standards",
    roiMetrics: {
      en: "150+ Experiences | Wellbeing Focus",
      fr: "150+ Expériences | Axé sur le bien-être"
    },
    description: {
      en: "VR solutions for pain/anxiety management and behavioral disorders in seniors.",
      fr: "Solutions VR pour la gestion de la douleur/anxiété et les troubles du comportement (séniors)."
    },
    pricing: {
      en: "From €160/month all-inclusive.",
      fr: "Dès 160 €/mois tout compris."
    },
    opportunities: {
      en: "Co-production of cultural content (Chinguetti, Banc d'Arguin) for their global library.",
      fr: "Co-production de contenus culturels (Chinguetti, Banc d'Arguin) pour leur bibliothèque mondiale."
    }
  },
  {
    id: "classvr",
    name: "ClassVR",
    sector: "Éducation des Enfants (6-16 Ans)",
    country: "UK",
    flag: "🇬🇧",
    domain: "classvr.com",
    headquarters: "Gloucester, UK",
    foundedYear: "2000s",
    compliance: "Eduverse Portal SaaS",
    roiMetrics: {
      en: "Avantis Assured Partner Program",
      fr: "Programme partenaire Avantis Assured"
    },
    description: {
      en: "Eduverse SaaS portal managing content and headsets in the classroom.",
      fr: "Portail SaaS Eduverse gérant le contenu et les casques en classe."
    },
    pricing: {
      en: "Structured school bundles with hardware and content.",
      fr: "Offres scolaires structurées avec matériel et contenu."
    },
    opportunities: {
      en: "West Africa is an open territory. Targeting elite schools (Lycée Théodore Monod).",
      fr: "L'Afrique de l'Ouest est un territoire ouvert. Cibler les écoles d'élite (Lycée Théodore Monod)."
    }
  },
  {
    id: "engagexr",
    name: "ENGAGE XR",
    sector: "Éducation des Enfants (6-16 Ans)",
    country: "Ireland",
    flag: "🇮🇪",
    domain: "engagevr.io",
    headquarters: "Waterford, Ireland",
    foundedYear: "2014",
    compliance: "Virtual Collaboration",
    roiMetrics: {
      en: "French Interface | English Content",
      fr: "Interface en Français | Contenu en Anglais"
    },
    description: {
      en: "Virtual classrooms and collaboration spaces.",
      fr: "Salles de classe virtuelles et espaces de collaboration."
    },
    pricing: {
      en: "~$130/user/year for the K-12 plan.",
      fr: "~130 $/utilisateur/an pour le plan K-12."
    },
    opportunities: {
      en: "Requires teachers to create their own content in French, despite French UI.",
      fr: "Nécessite que les enseignants créent leur propre contenu en français, malgré l'interface en français."
    }
  },
  {
    id: "mondlyvr",
    name: "Mondly VR",
    sector: "Éducation des Enfants (6-16 Ans)",
    country: "Romania",
    flag: "🇷🇴",
    domain: "mondly.com",
    headquarters: "Brasov, Romania",
    foundedYear: "2014",
    compliance: "Pearson Education",
    roiMetrics: {
      en: "Immersive Conversational Learning",
      fr: "Apprentissage conversationnel immersif"
    },
    description: {
      en: "Immersive conversational language learning, operating primarily as a B2B linguistic training tool.",
      fr: "Apprentissage des langues par la conversation immersive, outil B2B de formation linguistique."
    },
    pricing: {
      en: "Enterprise SaaS pricing tailored for corporate learning.",
      fr: "Tarification SaaS d'entreprise adaptée à l'apprentissage en entreprise."
    },
    opportunities: {
      en: "Targeting banks (BMCI), Telecoms (Mauritel), and oil operators needing English training.",
      fr: "Cible les banques (BMCI), Télécoms (Mauritel) et opérateurs pétroliers ayant des besoins en anglais."
    }
  },
  {
    id: "manheng",
    name: "Shanghai Manheng",
    sector: "Formation Professionnelle et Technique",
    country: "China",
    flag: "🇨🇳",
    domain: "ideaxr.com",
    headquarters: "Shanghai, China",
    compliance: "IdeaXR Engine",
    roiMetrics: {
      en: "Hardware Agnostic | Heavy Industry Focus",
      fr: "Agnostique au Matériel | Focus Industrie Lourde"
    },
    description: {
      en: "Powerful creation engine (IdeaXR) with an exhaustive library for mining, construction, and oil & gas.",
      fr: "Moteur de création puissant (IdeaXR) et bibliothèque exhaustive (mines, BTP, pétrole)."
    },
    pricing: {
      en: "IdeaXR Pro license from $4,200 – $8,500/year per seat. Content modules extra.",
      fr: "Licence IdeaXR Pro dès 4 200 – 8 500 $/an par poste. Modules de contenu en supplément."
    },
    opportunities: {
      en: "Co-development project required for French localization. Ideal for GTA gas and SNIM mining projects.",
      fr: "Projet de co-développement requis pour le français. Idéal pour les projets gaziers GTA et miniers SNIM."
    }
  },
  {
    id: "unidraw",
    name: "Beijing Unidraw",
    sector: "Santé et VR Médicale",
    country: "China",
    flag: "🇨🇳",
    domain: "unidrawvr.com",
    headquarters: "Beijing, China",
    compliance: "Little Giant Status",
    roiMetrics: {
      en: "National Lab Pedigree | Hardware-Light Software",
      fr: "Pedigree de Labo National | Logiciel Léger en Matériel"
    },
    description: {
      en: "Spin-off from the National VR Laboratory; a 'Little Giant' specializing in medical software simulation.",
      fr: "Spin-off du Laboratoire National de VR ; 'Petit Géant' spécialisé en simulation logicielle médicale."
    },
    pricing: {
      en: "Pure software shipping for tablets and headsets. Reduces heavy hardware costs.",
      fr: "Logiciel pur pour tablettes et casques. Réduit les coûts matériels lourds."
    },
    opportunities: {
      en: "English interface exists; French localization project needed. Perfect for Nouakchott Faculty of Medicine.",
      fr: "Interface en Anglais existante ; Projet de localisation en Français requis. Parfait pour la Faculté de Médecine de Nouakchott."
    }
  },
  {
    id: "netdragon",
    name: "NetDragon Websoft",
    sector: "Éducation des Enfants (6-16 Ans)",
    country: "China",
    flag: "🇨🇳",
    domain: "netdragon.com",
    headquarters: "Fuzhou, China",
    compliance: "UNESCO IITE Partner",
    roiMetrics: {
      en: "Massive Government Scale | Pop-up Classrooms",
      fr: "Échelle Gouvernementale | Classes Modulaires"
    },
    description: {
      en: "Global leader with massive African government contracts. Offers VR Mysticraft and Pop-Up Smart Classrooms.",
      fr: "Leader mondial avec des contrats gouvernementaux massifs en Afrique. Propose VR Mysticraft et Pop-Up Smart Classrooms."
    },
    pricing: {
      en: "Pop-Up Smart Classroom: modular class ready in hours, roughly $28,000 per unit.",
      fr: "Pop-Up Smart Classroom : classe modulaire prête en quelques heures, environ 28 000 $ l'unité."
    },
    opportunities: {
      en: "French already present in IP portfolio. Perfect for dispersed populations in Mauritania.",
      fr: "Français déjà présent dans le portfolio IP. Parfaitement adapté aux populations dispersées de la Mauritanie."
    }
  }
];
