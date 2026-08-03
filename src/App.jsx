import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, FileText, ArrowRight, ShieldCheck, Sparkles, CheckCircle, Scale, Zap, Lock } from 'lucide-react';
import ContractWizard from './components/ContractWizard';

const contractTemplates = [
  // --- First 50 Templates ---
  { id: 'freelance-services', title: 'Freelance Services Agreement', category: 'Freelance', description: 'Work performed in exchange for a fee.', keywords: ['freelance services', 'fee', 'work performed', 'gigs'] },
  { id: 'consulting', title: 'Consulting Agreement', category: 'Business', description: 'Advice or specialist services for payment.', keywords: ['consulting', 'advisor', 'specialist services', 'expert advice'] },
  { id: 'independent-contractor', title: 'Independent Contractor Agreement', category: 'Freelance', description: 'Project-based work by a self-employed person.', keywords: ['contractor', 'self-employed', 'project work', 'freelancer'] },
  { id: 'statement-of-work', title: 'Statement of Work (SOW)', category: 'Business', description: 'Scope, deliverables, timeline, and price for a particular project.', keywords: ['sow', 'scope of work', 'deliverables', 'timeline', 'project price'] },
  { id: 'nda', title: 'Non-Disclosure Agreement (NDA)', category: 'Business', description: 'Protects confidential information shared between parties.', keywords: ['nda', 'confidentiality', 'secret', 'protect idea', 'privacy'] },
  { id: 'mutual-nda', title: 'Mutual NDA', category: 'Business', description: 'Both parties promise to protect each other’s confidential information.', keywords: ['mutual nda', 'two-way confidentiality', 'protect info'] },
  { id: 'confidentiality', title: 'Confidentiality Agreement', category: 'Business', description: 'Broader agreement covering confidential information during a relationship.', keywords: ['confidentiality agreement', 'secret agreement', 'relationship security'] },
  { id: 'non-solicitation', title: 'Non-Solicitation Agreement', category: 'HR', description: 'Limits attempts to recruit staff or solicit customers, subject to local rules.', keywords: ['non-solicitation', 'no poaching', 'recruit staff', 'solicit customers'] },
  { id: 'ip-assignment', title: 'Intellectual-Property Assignment Agreement', category: 'Legal', description: 'Transfers ownership of specified work or IP.', keywords: ['ip assignment', 'intellectual property', 'transfer ownership', 'copyright transfer'] },
  { id: 'copyright-licence', title: 'Copyright Licence Agreement', category: 'Legal', description: 'Permits defined use of a creative work without transferring ownership.', keywords: ['copyright licence', 'creative work', 'use permit', 'licensing media'] },
  { id: 'trademark-licence', title: 'Trademark Licence Agreement', category: 'Legal', description: 'Permits use of a brand name or logo under set conditions.', keywords: ['trademark licence', 'brand name', 'logo use', 'brand licensing'] },
  { id: 'photography-services', title: 'Photography Services Agreement', category: 'Creative', description: 'Photography services, payment, delivery, and image-use rights.', keywords: ['photography', 'photographer', 'photoshoot', 'image rights'] },
  { id: 'graphic-design', title: 'Graphic-Design Agreement', category: 'Creative', description: 'Design work, revisions, fees, and IP ownership.', keywords: ['graphic design', 'designer', 'logo design', 'revisions'] },
  { id: 'software-development', title: 'Software-Development Agreement', category: 'Tech', description: 'Coding work, acceptance criteria, payment, and IP provisions.', keywords: ['software development', 'coding', 'programmer', 'app build', 'tech contract'] },
  { id: 'website-development', title: 'Website-Development Agreement', category: 'Tech', description: 'Website scope, launch timing, fees, and maintenance.', keywords: ['website development', 'web designer', 'launch timing', 'maintenance'] },
  { id: 'marketing-services', title: 'Marketing-Services Agreement', category: 'Business', description: 'Advertising, social-media, or campaign services.', keywords: ['marketing services', 'advertising', 'social media', 'campaigns'] },
  { id: 'content-creation', title: 'Content-Creation Agreement', category: 'Creative', description: 'Blogs, video, podcasts, or other content deliverables.', keywords: ['content creation', 'blogs', 'video production', 'podcast'] },
  { id: 'influencer-collaboration', title: 'Influencer Collaboration Agreement', category: 'Marketing', description: 'Sponsored-content requirements, payment, and disclosures.', keywords: ['influencer', 'sponsor', 'social media post', 'brand deal'] },
  { id: 'translation', title: 'Translation Agreement', category: 'Services', description: 'Translation services and delivery requirements.', keywords: ['translation', 'translator', 'language services', 'document translation'] },
  { id: 'tutoring', title: 'Tutoring Agreement', category: 'Education', description: 'Tuition subject, sessions, fees, and cancellation policy.', keywords: ['tutoring', 'tutor', 'private lessons', 'tuition'] },
  { id: 'coaching', title: 'Coaching Agreement', category: 'Services', description: 'Personal, career, fitness, or business coaching terms.', keywords: ['coaching', 'career coach', 'fitness mentor', 'business mentor'] },
  { id: 'event-services', title: 'Event-Services Agreement', category: 'Events', description: 'Event planning, entertainment, catering, or related services.', keywords: ['event services', 'event planner', 'entertainment', 'party setup'] },
  { id: 'catering', title: 'Catering Agreement', category: 'Events', description: 'Menu, guest numbers, fees, payment dates, and cancellation terms.', keywords: ['catering', 'food service', 'menu', 'party food', 'event catering'] },
  { id: 'house-cleaning', title: 'House-Cleaning Agreement', category: 'Home', description: 'Cleaning frequency, services, access, and payment.', keywords: ['house cleaning', 'maid service', 'cleaner', 'home chores'] },
  { id: 'gardening-landscaping', title: 'Gardening or Landscaping Agreement', category: 'Home', description: 'Work scope, materials, schedule, and price.', keywords: ['gardening', 'landscaping', 'lawn care', 'yard work'] },
  { id: 'pet-sitting', title: 'Pet-Sitting Agreement', category: 'Home', description: 'Care instructions, dates, emergency authority, and fees.', keywords: ['pet sitting', 'pet sitter', 'animal care', 'watch dog/cat'] },
  { id: 'dog-walking', title: 'Dog-Walking Agreement', category: 'Home', description: 'Walking schedule, safety expectations, and payment.', keywords: ['dog walking', 'dog walker', 'walk pet', 'puppy exercise'] },
  { id: 'babysitting', title: 'Babysitting Agreement', category: 'Home', description: 'Care hours, pay, emergency contacts, and household rules.', keywords: ['babysitting', 'babysitter', 'childcare', 'kids care'] },
  { id: 'vehicle-sale', title: 'Vehicle-Sale Agreement', category: 'Private Sale', description: 'Sale of a privately owned vehicle, price, condition, and handover date.', keywords: ['vehicle sale', 'sell car', 'car purchase', 'auto sale'] },
  { id: 'sale-of-goods', title: 'Sale-of-Goods Agreement', category: 'Private Sale', description: 'Private sale of equipment, furniture, collectibles, etc.', keywords: ['sale of goods', 'sell items', 'furniture sale', 'private goods'] },
  { id: 'loan', title: 'Loan Agreement', category: 'Financial', description: 'Money lent between individuals, repayment schedule, and interest (if any).', keywords: ['loan agreement', 'lend money', 'borrow cash', 'repayment schedule'] },
  { id: 'promissory-note', title: 'Promissory Note', category: 'Financial', description: 'A borrower’s written promise to repay a specified sum.', keywords: ['promissory note', 'promise to pay', 'debt note', 'borrower promise'] },
  { id: 'repayment-plan', title: 'Repayment-Plan Agreement', category: 'Financial', description: 'Agreed instalments for an existing private debt.', keywords: ['repayment plan', 'debt installments', 'pay back money', 'settle debt'] },
  { id: 'gift', title: 'Gift Agreement', category: 'Legal', description: 'Records a voluntary gift and whether any conditions apply.', keywords: ['gift agreement', 'voluntary gift', 'transfer asset', 'donation'] },
  { id: 'expense-sharing', title: 'Expense-Sharing Agreement', category: 'Personal', description: 'How housemates, travel companions, or collaborators divide costs.', keywords: ['expense sharing', 'split costs', 'roommate bills', 'travel expenses'] },
  { id: 'roommate-household', title: 'Roommate/Household Agreement', category: 'Personal', description: 'Chores, bills, visitors, and house rules.', keywords: ['roommate agreement', 'household rules', 'shared apartment', 'chores'] },
  { id: 'short-term-accommodation', title: 'Short-Term Accommodation Agreement', category: 'Real Estate', description: 'Temporary stay arrangements, payment, and house rules.', keywords: ['short term accommodation', 'temporary stay', 'bnb rent', 'sublet'] },
  { id: 'equipment-loan', title: 'Equipment-Loan Agreement', category: 'Personal', description: 'Temporary loan of tools, cameras, instruments, or other property.', keywords: ['equipment loan', 'lend tools', 'borrow camera', 'instrument loan'] },
  { id: 'equipment-rental', title: 'Equipment-Rental Agreement', category: 'Business', description: 'Rental period, fee, deposit, condition, and return requirements.', keywords: ['equipment rental', 'rent gear', 'tool rental', 'deposit'] },
  { id: 'vehicle-use', title: 'Vehicle-Use Agreement', category: 'Personal', description: 'Permitted use of a privately owned vehicle and responsibility for costs.', keywords: ['vehicle use', 'borrow car', 'car sharing', 'driver responsibility'] },
  { id: 'storage', title: 'Storage Agreement', category: 'Real Estate', description: 'One person stores another’s belongings under agreed conditions.', keywords: ['storage agreement', 'store belongings', 'storage space', 'rent garage'] },
  { id: 'volunteer', title: 'Volunteer Agreement', category: 'HR', description: 'Sets expectations for unpaid voluntary work; it must not disguise employment.', keywords: ['volunteer agreement', 'unpaid work', 'volunteer terms', 'charity help'] },
  { id: 'collaboration', title: 'Collaboration Agreement', category: 'Business', description: 'Parties cooperate on a project and define responsibilities.', keywords: ['collaboration', 'cooperate', 'project partner', 'team up'] },
  { id: 'joint-project', title: 'Joint-Project Agreement', category: 'Business', description: 'Contributions, decision-making, costs, and ownership for a defined project.', keywords: ['joint project', 'shared venture', 'project contributions', 'co-ownership'] },
  { id: 'revenue-sharing', title: 'Revenue-Sharing Agreement', category: 'Financial', description: 'How specified income from a project will be split.', keywords: ['revenue sharing', 'split income', 'profit split', 'earnings share'] },
  { id: 'commission', title: 'Commission Agreement', category: 'Business', description: 'Commission payable for referrals, sales, or introductions.', keywords: ['commission', 'sales percentage', 'referral fee', 'sales bonus'] },
  { id: 'referral', title: 'Referral Agreement', category: 'Business', description: 'Payment or other terms for introducing customers or business opportunities.', keywords: ['referral agreement', 'introduce clients', 'lead generation fee'] },
  { id: 'small-dispute-settlement', title: 'Settlement Agreement for a Small Private Dispute', category: 'Legal', description: 'Documents a compromise and payment to resolve a claim.', keywords: ['settlement agreement', 'dispute resolution', 'private claim', 'compromise'] },
  { id: 'event-participation-consent', title: 'Consent/Release for Event Participation', category: 'Legal', description: 'Acknowledges risks and permissions, though it cannot waive every legal claim.', keywords: ['event participation', 'consent form', 'liability release', 'risk waiver'] },
  { id: 'mou-letter-of-intent', title: 'Letter of Intent / Memorandum of Understanding (MOU)', category: 'Business', description: 'Records proposed terms before a full agreement; specify which clauses are binding.', keywords: ['mou', 'memorandum of understanding', 'letter of intent', 'proposed terms'] },

  // --- Next 50 Templates ---
  { id: 'personal-training', title: 'Personal Training Agreement', category: 'Fitness', description: 'Fitness sessions, fees, cancellation rules, and health disclosures.', keywords: ['personal training', 'fitness sessions', 'gym trainer', 'workout terms'] },
  { id: 'music-lesson', title: 'Music Lesson Agreement', category: 'Education', description: 'Lesson schedule, payment, missed lessons, and equipment expectations.', keywords: ['music lesson', 'guitar tutor', 'piano lessons', 'music teacher'] },
  { id: 'dance-lesson', title: 'Dance Lesson Agreement', category: 'Education', description: 'Class or private-instruction terms and attendance rules.', keywords: ['dance lesson', 'dance class', 'private instruction', 'choreography'] },
  { id: 'language-teaching', title: 'Language Teaching Agreement', category: 'Education', description: 'Course content, lesson hours, fees, and cancellations.', keywords: ['language teaching', 'english tutor', 'spanish lessons', 'language classes'] },
  { id: 'music-performance', title: 'Music Performance Agreement', category: 'Creative', description: 'A musician’s performance date, venue, set length, and payment.', keywords: ['music performance', 'gig contract', 'musician booking', 'concert agreement'] },
  { id: 'dj-services', title: 'DJ Services Agreement', category: 'Events', description: 'Event requirements, equipment, payment, and cancellation terms.', keywords: ['dj services', 'disc jockey', 'party dj', 'event music'] },
  { id: 'wedding-supplier', title: 'Wedding Supplier Agreement', category: 'Events', description: 'Arrangements with a photographer, florist, entertainer, or similar supplier.', keywords: ['wedding supplier', 'florist contract', 'wedding vendors', 'event supplier'] },
  { id: 'venue-hire', title: 'Venue Hire Agreement', category: 'Real Estate', description: 'Private use of a venue, booking hours, deposit, and damage responsibilities.', keywords: ['venue hire', 'rent hall', 'event space booking', 'party venue'] },
  { id: 'speaker-engagement', title: 'Speaker Engagement Agreement', category: 'Business', description: 'A speaker’s topic, appearance date, expenses, and fee.', keywords: ['speaker engagement', 'keynote speaker', 'conference talk', 'guest speaker'] },
  { id: 'workshop-facilitation', title: 'Workshop Facilitation Agreement', category: 'Business', description: 'Terms for delivering a training workshop or seminar.', keywords: ['workshop facilitation', 'seminar contract', 'training session', 'facilitator'] },
  { id: 'research-collaboration', title: 'Research Collaboration Agreement', category: 'Tech', description: 'Contributions, data access, and ownership of project outputs.', keywords: ['research collaboration', 'academic study', 'data access', 'project outputs'] },
  { id: 'user-testing', title: 'User-Testing Agreement', category: 'Tech', description: 'Payment and confidentiality terms for testing a product or service.', keywords: ['user testing', 'product test', 'tester agreement', 'feedback session'] },
  { id: 'focus-group', title: 'Focus-Group Participation Agreement', category: 'Business', description: 'Participant obligations, incentives, and confidentiality.', keywords: ['focus group', 'market research', 'participant study', 'feedback group'] },
  { id: 'survey-participation', title: 'Survey Participation Agreement', category: 'Business', description: 'Terms for paid survey or research participation.', keywords: ['survey participation', 'paid survey', 'research questionnaire'] },
  { id: 'data-processing', title: 'Data-Processing Agreement', category: 'Legal', description: 'Defines how one party processes personal data for another.', keywords: ['data processing', 'dpa', 'gdpr compliance', 'personal data handling'] },
  { id: 'data-sharing', title: 'Data-Sharing Agreement', category: 'Legal', description: 'Sets permitted use, security, retention, and deletion rules for shared data.', keywords: ['data sharing', 'shared data security', 'data retention', 'transfer info'] },
  { id: 'website-terms-of-use', title: 'Website Terms of Use', category: 'Tech', description: 'Rules for people using a personal or business website.', keywords: ['website terms of use', 'terms and conditions', 'site rules', 'legal disclaimer'] },
  { id: 'online-community-rules', title: 'Online-Community Rules Agreement', category: 'Tech', description: 'Membership, conduct, moderation, and removal rules.', keywords: ['online community rules', 'forum guidelines', 'discord rules', 'moderation'] },
  { id: 'beta-testing', title: 'Beta-Testing Agreement', category: 'Tech', description: 'Early access to software, feedback expectations, and confidentiality.', keywords: ['beta testing', 'early access software', 'app trial', 'prototype test'] },
  { id: 'software-support', title: 'Software-Support Agreement', category: 'Tech', description: 'Helpdesk, maintenance, response times, and fees.', keywords: ['software support', 'maintenance agreement', 'helpdesk contract', 'IT support'] },
  { id: 'domain-name-transfer', title: 'Domain-Name Transfer Agreement', category: 'Tech', description: 'Transfers control of a web domain from one person to another.', keywords: ['domain transfer', 'website address sale', 'dns ownership', 'buy domain'] },
  { id: 'mobile-app-publishing', title: 'Mobile-App Publishing Agreement', category: 'Tech', description: 'Terms for publishing or promoting an app.', keywords: ['mobile app publishing', 'app store launch', 'publisher agreement'] },
  { id: 'podcast-guest-release', title: 'Podcast Guest Release', category: 'Creative', description: 'Permission to record, edit, publish, and distribute an interview.', keywords: ['podcast guest release', 'interview consent', 'audio recording rights'] },
  { id: 'video-appearance-release', title: 'Video Appearance Release', category: 'Creative', description: 'Consent to use a person’s recorded image and voice.', keywords: ['video appearance release', 'image consent', 'voice recording rights', 'film waiver'] },
  { id: 'model-release', title: 'Model Release', category: 'Creative', description: 'Permission to use photographs or footage of a model.', keywords: ['model release', 'photoshoot consent', 'image licensing', 'photography waiver'] },
  { id: 'location-release', title: 'Location Release', category: 'Creative', description: 'Permission to film, photograph, or record at private premises.', keywords: ['location release', 'filming permission', 'property shoot agreement'] },
  { id: 'artwork-commission', title: 'Artwork Commission Agreement', category: 'Creative', description: 'Commissioned art, price, revisions, delivery, and copyright terms.', keywords: ['artwork commission', 'custom painting', 'artist contract', 'commission art'] },
  { id: 'illustration-licence', title: 'Illustration Licence Agreement', category: 'Creative', description: 'Permission to use an illustration for specified purposes.', keywords: ['illustration licence', 'artwork use', 'drawing rights', 'graphic licensing'] },
  { id: 'book-editing', title: 'Book Editing Agreement', category: 'Creative', description: 'Editing scope, deadlines, fees, and confidentiality.', keywords: ['book editing', 'editor contract', 'proofreading', 'manuscript edit'] },
  { id: 'manuscript-review', title: 'Manuscript Review Agreement', category: 'Creative', description: 'Terms for reviewing written work and providing feedback.', keywords: ['manuscript review', 'beta reader', 'book critique', 'literary review'] },
  { id: 'publishing', title: 'Publishing Agreement', category: 'Creative', description: 'Permission for a publisher to print or distribute a work.', keywords: ['publishing agreement', 'book contract', 'publisher rights', 'distribution book'] },
  { id: 'book-distribution', title: 'Book Distribution Agreement', category: 'Business', description: 'How books or other products will be distributed and paid for.', keywords: ['book distribution', 'retail supply', 'distribute books', 'sales channel'] },
  { id: 'consignment', title: 'Consignment Agreement', category: 'Business', description: 'One person sells another person’s goods and remits an agreed share.', keywords: ['consignment agreement', 'sell on behalf', 'store consignment', 'goods resale'] },
  { id: 'reseller', title: 'Reseller Agreement', category: 'Business', description: 'One party is authorised to resell specified goods or services.', keywords: ['reseller agreement', 'authorized distributor', 'sell products', 'vendor partnership'] },
  { id: 'supplier', title: 'Supplier Agreement', category: 'Business', description: 'Supply of goods on agreed price, quality, delivery, and payment terms.', keywords: ['supplier agreement', 'vendor contract', 'goods supply', 'wholesale terms'] },
  { id: 'purchase-order', title: 'Purchase-Order Terms', category: 'Business', description: 'Terms applying to a particular purchase of goods or services.', keywords: ['purchase order terms', 'po conditions', 'buying agreement'] },
  { id: 'prototype-development', title: 'Prototype-Development Agreement', category: 'Tech', description: 'Design and creation of an early product version.', keywords: ['prototype development', 'product sample', 'mvp build', 'hardware prototype'] },
  { id: 'product-testing', title: 'Product-Testing Agreement', category: 'Business', description: 'Testing conditions, feedback, safety, and confidentiality.', keywords: ['product testing', 'trial contract', 'safety evaluation', 'goods test'] },
  { id: 'repair-services', title: 'Repair-Services Agreement', category: 'Home', description: 'Repair scope, estimate, materials, and payment.', keywords: ['repair services', 'fix appliance', 'mechanic agreement', 'maintenance work'] },
  { id: 'home-improvement', title: 'Home-Improvement Agreement', category: 'Home', description: 'Minor renovation, decorating, or repair work.', keywords: ['home improvement', 'renovation contract', 'remodeling', 'decorator agreement'] },
  { id: 'moving-services', title: 'Moving-Services Agreement', category: 'Home', description: 'Moving date, items, fees, insurance, and responsibility for damage.', keywords: ['moving services', 'movers contract', 'relocation agreement', 'haulers'] },
  { id: 'delivery-services', title: 'Delivery-Services Agreement', category: 'Business', description: 'Collection/delivery tasks, service area, charges, and timing.', keywords: ['delivery services', 'courier contract', 'shipping terms', 'transport agreement'] },
  { id: 'errand-running', title: 'Errand-Running Agreement', category: 'Home', description: 'Personal errands, permitted expenses, and payment.', keywords: ['errand running', 'personal assistant tasks', 'courier errands'] },
  { id: 'personal-assistant-services', title: 'Personal-Assistant Services Agreement', category: 'Home', description: 'Administrative support, hours, confidentiality, and fees.', keywords: ['personal assistant', 'pa contract', 'admin support', 'helper agreement'] },
  { id: 'virtual-assistant', title: 'Virtual-Assistant Agreement', category: 'Freelance', description: 'Remote administrative work, access controls, and payment terms.', keywords: ['virtual assistant', 'va contract', 'remote admin', 'online support'] },
  { id: 'house-sitting', title: 'House-Sitting Agreement', category: 'Home', description: 'Care of a home, dates, access, expenses, and responsibilities.', keywords: ['house sitting', 'house sitter', 'property watch', 'home care'] },
  { id: 'plant-care', title: 'Plant-Care Agreement', category: 'Home', description: 'Care of plants while the owner is away, including payment and instructions.', keywords: ['plant care', 'watering plants', 'gardener stay', 'botanical care'] },
  { id: 'shared-pet-ownership', title: 'Shared-Pet-Ownership Agreement', category: 'Personal', description: 'Costs, care schedule, decision-making, and what happens if the arrangement ends.', keywords: ['shared pet ownership', 'co-parent pet', 'dog custody', 'pet sharing'] },
  { id: 'private-parking-space', title: 'Private Parking-Space Licence Agreement', category: 'Real Estate', description: 'Permission to use a specific parking space; different from a property lease.', keywords: ['private parking space', 'parking spot rental', 'garage space licence'] },
  { id: 'hobby-group-club', title: 'Hobby-Group or Club Membership Agreement', category: 'Personal', description: 'Membership fees, conduct rules, activities, and removal process.', keywords: ['hobby group', 'club membership', 'society rules', 'association agreement'] }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedContract, setSelectedContract] = useState(null);

  const fuse = useMemo(() => {
    return new Fuse(contractTemplates, {
      keys: ['title', 'description', 'keywords', 'category'],
      threshold: 0.4,
    });
  }, []);

  const categories = useMemo(() => {
    return ['All', ...new Set(contractTemplates.map(t => t.category))];
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      if (selectedCategory === 'All') return contractTemplates;
      return contractTemplates.filter(t => t.category === selectedCategory);
    }
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [searchQuery, selectedCategory, fuse]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden">
      
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Professional Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setSelectedContract(null); setSearchQuery(''); }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">Universal Contract</span>
              <span className="text-xs text-blue-400 font-medium tracking-wide">Builder Suite (100 Templates)</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-300">
            <span className="flex items-center"><Zap className="w-4 h-4 text-amber-400 mr-1.5" /> Instant PDF Export</span>
            <span className="flex items-center"><Lock className="w-4 h-4 text-emerald-400 mr-1.5" /> Secure & Private</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10">
        {!selectedContract ? (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100 Professional Commercial & Personal Templates</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Draft Any Professional Contract in Seconds
              </h1>
              
              <p className="text-slate-400 text-lg sm:text-xl font-normal leading-relaxed">
                Search via random keywords or browse structured categories, customize clauses, add your brand logos, and generate export-ready agreements instantly.
              </p>

              {/* Advanced Search Bar Section */}
              <div className="pt-4">
                <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300 pointer-events-none" />
                  <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 shadow-inner">
                    <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search random keywords e.g., 'personal trainer', 'guitar lessons', 'loan agreement'..."
                      className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base font-medium"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-h-40 overflow-y-auto p-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => { setSelectedCategory(category); setSearchQuery(''); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        selectedCategory === category && !searchQuery
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Grid Section */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FileText className="w-5 h-5 text-blue-500 mr-2" /> Agreement Library
                </h2>
                <span className="text-xs text-slate-400 font-medium">Showing {filteredTemplates.length} templates</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedContract(template)}
                    className="group bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {template.category}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {template.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Fully Customizable
                      </span>
                      <button className="inline-flex items-center text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                        Build Now <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-base mb-4">No matching agreements found for "{searchQuery}".</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
                  >
                    Reset Search & View All
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Active Contract Wizard Container */
          <ContractWizard 
            template={selectedContract} 
            onBack={() => setSelectedContract(null)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Universal Contract Builder. Professional Legal Document Automation Suite.</p>
        </div>
      </footer>

    </div>
  );
}
