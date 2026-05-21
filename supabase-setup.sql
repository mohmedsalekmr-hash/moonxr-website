-- =========================================================================
-- MoonXR Database Setup Script
-- Paste this entire script into your Supabase SQL Editor (SQL Editor -> New Query)
-- =========================================================================

-- 1. DROP EXISTING TABLES IF THEY EXIST (for clean installations)
drop table if exists provider_users cascade;
drop table if exists providers cascade;

-- 2. CREATE PROVIDERS TABLE
create table providers (
  id text primary key,
  name text not null,
  sector text not null,
  country text not null,
  flag text not null,
  domain text not null,
  description_en text not null,
  description_fr text not null,
  pricing_en text not null,
  pricing_fr text not null,
  opportunities_en text not null,
  opportunities_fr text not null,
  headquarters text,
  founded_year text,
  roi_metrics_en text,
  roi_metrics_fr text,
  compliance text,
  logo_url text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- 3. CREATE PROVIDER USERS TABLE
create table provider_users (
  id uuid primary key default gen_random_uuid(),
  provider_id text references providers(id) on delete cascade not null,
  name text not null,
  email text not null,
  role text not null default 'Learner', -- Admin, Trainer, Learner
  status text not null default 'Active', -- Active, Suspended
  created_at timestamptz default now()
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
alter table providers enable row level security;
alter table provider_users enable row level security;

-- 5. DEFINE SECURITY POLICIES (Allow public read, restrict writes to authenticated admins)
-- Note: In Supabase, if you don't use Supabase Auth for public forms, we can allow public write or 
-- restrict read/write using service role/anon key. For simplicity and public viewing:
-- Anyone can view providers
create policy "Allow public read access on providers" 
  on providers for select 
  using (true);

-- Anyone can view provider users
create policy "Allow public read access on provider_users" 
  on provider_users for select 
  using (true);

-- Authenticated/Full access for Admin modifications (Using service-role or simple public access for anonymous inserts, 
-- but in our actions.ts we will use service role key or public anon insert). 
-- For ease of setup, we'll allow all operations for Select, and restrict insert/update/delete to service role
-- OR for a simple showcase, we can allow ALL operations so the admin panel works perfectly.
-- Let's make it fully administrative:
create policy "Allow all operations on providers" 
  on providers for all 
  using (true)
  with check (true);

create policy "Allow all operations on provider_users" 
  on provider_users for all 
  using (true)
  with check (true);


-- 6. INSERT SEED DATA FOR THE 12 GLOBAL PROVIDERS
insert into providers (
  id, name, sector, country, flag, domain, headquarters, founded_year, compliance,
  roi_metrics_en, roi_metrics_fr,
  description_en, description_fr,
  pricing_en, pricing_fr,
  opportunities_en, opportunities_fr
) values 
(
  'uptale', 'Uptale', 'Formation Professionnelle et Technique', 'France', '🇫🇷', 'uptale.io', 'Paris, France', '2017', 'Natif/Offline',
  '100% Immersive Learning | Native Offline', '100% Apprentissage Immersif | Hors Ligne Natif',
  'Immersive Learning SaaS platform with native offline mode and AI voice synthesis.', 'Plateforme SaaS d''Immersive Learning avec mode hors ligne natif et synthèse vocale IA.',
  'Pro Plan from $17k/year (100 learners). Education pricing significantly lower ($5k-$10k).', 'Plan Pro dès 17 000 $/an (100 apprenants). Tarifs éducation réduits (5k€-10k€).',
  'Formal reseller program with 20-35% margins. Ideal for INAP-FTP and SNIM mining sites.', 'Programme revendeur formel avec marges de 20 à 35 %. Idéal pour INAP-FTP et sites miniers SNIM.'
),
(
  'mimbus', 'Mimbus', 'Formation Professionnelle et Technique', 'France', '🇫🇷', 'mimbus.com', 'Toulouse, France', '2011', 'Software only',
  '70% Export Revenue | High Reseller Margin', '70% CA à l''export | Haute marge revendeur',
  'VR modules for manual trades (BTP, mechanics, electricity, carpentry).', 'Modules VR pour les métiers manuels (BTP, mécanique, électricité, menuiserie).',
  'Software licensing model for Meta Quest standalone.', 'Modèle de licences logicielles pour Meta Quest autonome.',
  'Reseller margins of 25-30%. Direct alignment with INAP-FTP priorities.', 'Marges revendeur de 25 à 30 %. Alignement direct avec les priorités de l''INAP-FTP.'
),
(
  'immersivefactory', 'Immersive Factory', 'Formation Professionnelle et Technique', 'France', '🇫🇷', 'immersivefactory.com', 'Paris, France', '2016', 'HSE Standards',
  'Unlimited Access | Hardware Included', 'Accès illimité | Matériel inclus',
  'SafetyBox VR© providing preloaded HSE (Health, Safety, Environment) training catalogs.', 'SafetyBox VR© fournissant des catalogues de formation HSE (Santé, Sécurité, Environnement) préchargés.',
  '~€5,500 – €7,500 per box/year including hardware and 12-month unlimited use.', '~5 500 € – 7 500 € par box/an incluant le matériel et 12 mois d''utilisation illimitée.',
  'Essential HSE compliance tool for major mining and gas projects (SNIM, Kinross).', 'Outil essentiel de conformité HSE pour les projets miniers et gaziers (SNIM, Kinross).'
),
(
  'hypnovr', 'HypnoVR', 'Santé et VR Médicale', 'France', '🇫🇷', 'hypnovr.io', 'Strasbourg, France', '2016', 'CE Class I Medical Device',
  'OPEX Friendly | Hardware Replaced', 'Favorable OPEX | Matériel remplacé',
  'Medical hypnosis VR software for pain and anxiety management.', 'Logiciel VR d''hypnose médicale pour la gestion de la douleur et de l''anxiété.',
  'From €149/month including software, hardware, noise-canceling headphones, and tablet.', 'Dès 149 €/mois incluant logiciel, matériel, casque antibruit et tablette.',
  'Exclusive 24-month representation for Mauritania and Senegal. Ideal for CHU and private clinics.', 'Représentation exclusive de 24 mois pour la Mauritanie et le Sénégal. Idéal pour CHU et cliniques.'
),
(
  'simforhealth', 'SimforHealth', 'Santé et VR Médicale', 'France', '🇫🇷', 'simforhealth.com', 'Bordeaux, France', '2008', 'Clinical Simulation',
  'International Clinical Case Library', 'Bibliothèque internationale de cas cliniques',
  'MedicActiV platform offering a global library of virtual clinical cases.', 'Plateforme MedicActiV offrant une bibliothèque mondiale de cas cliniques virtuels.',
  'Between €60 and €150 per learner per year for nursing skills collections.', 'Entre 60 € et 150 € par apprenant et par an pour la collection Compétences Infirmières.',
  'Perfect match for Mauritanian nursing curriculum and Medical Faculty.', 'Correspondance parfaite avec le cursus infirmier mauritanien et la Faculté de Médecine.'
),
(
  'lumeen', 'Lumeen', 'Santé et VR Médicale', 'France', '🇫🇷', 'lumeen.com', 'Lyon, France', '2019', 'Social & Medical standards',
  '150+ Experiences | Wellbeing Focus', '150+ Expériences | Axé sur le bien-être',
  'VR solutions for pain/anxiety management and behavioral disorders in seniors.', 'Solutions VR pour la gestion de la douleur/anxiété et les troubles du comportement (séniors).',
  'From €160/month all-inclusive.', 'Dès 160 €/mois tout compris.',
  'Co-production of cultural content (Chinguetti, Banc d''Arguin) for their global library.', 'Co-production de contenus culturels (Chinguetti, Banc d''Arguin) pour leur bibliothèque mondiale.'
),
(
  'classvr', 'ClassVR', 'Éducation des Enfants (6-16 Ans)', 'UK', '🇬🇧', 'classvr.com', 'Gloucester, UK', '2000s', 'Eduverse Portal SaaS',
  'Avantis Assured Partner Program', 'Programme partenaire Avantis Assured',
  'Eduverse SaaS portal managing content and headsets in the classroom.', 'Portail SaaS Eduverse gérant le contenu et les casques en classe.',
  'Structured school bundles with hardware and content.', 'Offres scolaires structurées avec matériel et contenu.',
  'West Africa is an open territory. Targeting elite schools (Lycée Théodore Monod).', 'L''Afrique de l''Est est un territoire ouvert. Cibler les écoles d''élite (Lycée Théodore Monod).'
),
(
  'engagexr', 'ENGAGE XR', 'Éducation des Enfants (6-16 Ans)', 'Ireland', '🇮🇪', 'engagevr.io', 'Waterford, Ireland', '2014', 'Virtual Collaboration',
  'French Interface | English Content', 'Interface en Français | Contenu en Anglais',
  'Virtual classrooms and collaboration spaces.', 'Salles de classe virtuelles et espaces de collaboration.',
  '~$130/user/year for the K-12 plan.', '~130 $/utilisateur/an pour le plan K-12.',
  'Requires teachers to create their own content in French, despite French UI.', 'Nécessite que les enseignants créent leur propre contenu en français, malgré l''interface en français.'
),
(
  'mondlyvr', 'Mondly VR', 'Éducation des Enfants (6-16 Ans)', 'Romania', '🇷🇴', 'mondly.com', 'Brasov, Romania', '2014', 'Pearson Education',
  'Immersive Conversational Learning', 'Apprentissage conversationnel immersif',
  'Immersive conversational language learning, operating primarily as a B2B linguistic training tool.', 'Apprentissage des langues par la conversation immersive, outil B2B de formation linguistique.',
  'Enterprise SaaS pricing tailored for corporate learning.', 'Tarification SaaS d''entreprise adaptée à l''apprentissage en entreprise.',
  'Targeting banks (BMCI), Telecoms (Mauritel), and oil operators needing English training.', 'Cible les banques (BMCI), Télécoms (Mauritel) et opérateurs pétroliers ayant des besoins en anglais.'
),
(
  'manheng', 'Shanghai Manheng', 'Formation Professionnelle et Technique', 'China', '🇨🇳', 'www.gdi.com.cn', 'Shanghai, China', '2000s', 'IdeaXR Engine',
  'Hardware Agnostic | Heavy Industry Focus', 'Agnostique au Matériel | Focus Industrie Lourde',
  'Powerful creation engine (IdeaXR) with an exhaustive library for mining, construction, and oil & gas.', 'Moteur de création puissant (IdeaXR) et bibliothèque exhaustive (mines, BTP, pétrole).',
  'IdeaXR Pro license from $4,200 – $8,500/year per seat. Content modules extra.', 'Licence IdeaXR Pro dès 4 200 – 8 500 $/an par poste. Modules de contenu en supplément.',
  'Co-development project required for French localization. Ideal for GTA gas and SNIM mining projects.', 'Projet de co-développement requis pour le français. Idéal pour les projets gaziers GTA et miniers SNIM.'
),
(
  'unidraw', 'Beijing Unidraw', 'Santé et VR Médicale', 'China', '🇨🇳', 'www.unidraw.com', 'Beijing, China', '2010s', 'Little Giant Status',
  'National Lab Pedigree | Hardware-Light Software', 'Pedigree de Labo National | Logiciel Léger en Matériel',
  'Spin-off from the National VR Laboratory; a ''Little Giant'' specializing in medical software simulation.', 'Spin-off du Laboratoire National de VR ; ''Petit Géant'' spécialisé en simulation logicielle médicale.',
  'Pure software shipping for tablets and headsets. Reduces heavy hardware costs.', 'Logiciel pur pour tablettes et casques. Réduit les coûts matériels lourds.',
  'English interface exists; French localization project needed. Perfect for Nouakchott Faculty of Medicine.', 'Interface en Anglais existante ; Projet de localisation en Français requis. Parfait pour la Faculté de Médecine de Nouakchott.'
),
(
  'netdragon', 'NetDragon Websoft', 'Éducation des Enfants (6-16 Ans)', 'China', '🇨🇳', 'netdragon.com', 'Fuzhou, China', '1999', 'UNESCO IITE Partner',
  'Massive Government Scale | Pop-up Classrooms', 'Échelle Gouvernementale | Classes Modulaires',
  'Global leader with massive African government contracts. Offers VR Mysticraft and Pop-Up Smart Classrooms.', 'Leader mondial avec des contrats gouvernementaux massifs en Afrique. Propose VR Mysticraft et Pop-Up Smart Classrooms.',
  'Pop-Up Smart Classroom: modular class ready in hours, roughly $28,000 per unit.', 'Pop-Up Smart Classroom : classe modulaire prête en quelques heures, environ 28 000 $ l''unité.',
  'French already present in IP portfolio. Perfect for dispersed populations in Mauritania.', 'Français déjà présent dans le portfolio IP. Parfaitement adapté aux populations dispersées de la Mauritanie.'
);

-- 7. INSERT SOME TEST USERS FOR THE PROVIDERS
insert into provider_users (provider_id, name, email, role, status) values
('uptale', 'Jean Dupont', 'jean.dupont@uptale.io', 'Admin', 'Active'),
('uptale', 'Marie Martin', 'marie.martin@uptale.io', 'Trainer', 'Active'),
('mimbus', 'Pierre Durand', 'pierre.durand@mimbus.com', 'Trainer', 'Active'),
('hypnovr', 'Dr. Sarah Aloui', 'sarah.aloui@hypnovr.io', 'Admin', 'Active'),
('engagexr', 'Prof. Kane Oumar', 'kane.oumar@engagevr.io', 'Trainer', 'Active');
