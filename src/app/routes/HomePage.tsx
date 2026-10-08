import React, { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ImageContainer } from '../../components/media/ImageContainer';
import {
  Camera,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  User,
  MapPin,
  Clock,
  Send,
  Layers,
  Award,
  BookCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<{ title: string; subtitle?: string; description: string; scope: string } | null>(null);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<{ src: string; title: string; category: string } | null>(null);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);

  // Photography Services Presentation Data
  const servicesList = [
    {
      id: 'graduation',
      title: 'Graduation Photography',
      subtitle: 'Portrait sessions & ceremony coverage',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      description: 'Commemorating academic achievements with classic, high-resolution portraiture and outdoor campus sessions.',
      scope: 'Includes individual cap-and-gown portraits, family group portraits, and full digital gallery delivery in future milestones.',
    },
    {
      id: 'wedding',
      title: 'Wedding & Event Storytelling',
      subtitle: 'Cinematic wedding & milestone coverage',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      description: 'Documenting timeless emotional moments, key ceremonies, and celebration highlights with editorial finesse.',
      scope: 'Includes full-day event coverage, bride and groom portraiture, and private proofing galleries.',
    },
    {
      id: 'portrait',
      title: 'Outdoor & Lifestyle Portraits',
      subtitle: 'Natural light personal portraiture',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      description: 'Tailored personal portraits in natural outdoor settings, focusing on genuine expressions and creative composition.',
      scope: 'Includes location selection guidance, pose coaching, and high-resolution retouched assets.',
    },
    {
      id: 'events',
      title: 'Birthday & Special Occasions',
      subtitle: 'Milestone party & private event coverage',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant event photography capturing party atmosphere, decor details, guest interactions, and key highlights.',
      scope: 'Includes candid event coverage, group photos, and digital image delivery.',
    },
    {
      id: 'product',
      title: 'Product & Brand Imagery',
      subtitle: 'Commercial & e-commerce photography',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      description: 'Clean, professional studio and lifestyle imagery for local business products, menus, and online storefronts.',
      scope: 'Includes studio lighting setups, clean background isolated shots, and web-optimized exports.',
    },
    {
      id: 'retouching',
      title: 'Photo Editing & Retouching',
      subtitle: 'Post-processing & color grading',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
      description: 'Professional post-processing enhancing color balance, skin retouching, background cleanup, and tone curves.',
      scope: 'Includes RAW asset processing, selective color adjustments, and archival master preparation.',
    },
  ];

  // Portfolio Preview Data
  const portfolioPreview = [
    {
      id: 'p1',
      category: 'Portraits',
      title: 'Studio Lighting Portrait',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '3:2' as const,
    },
    {
      id: 'p2',
      category: 'Weddings',
      title: 'Ceremony Ring Exchange',
      src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '1:1' as const,
    },
    {
      id: 'p3',
      category: 'Graduation',
      title: 'Academic Success Celebration',
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '3:2' as const,
    },
    {
      id: 'p4',
      category: 'Events',
      title: 'Evening Celebration Lights',
      src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '16:9' as const,
    },
    {
      id: 'p5',
      category: 'Portraits',
      title: 'Golden Hour Natural Light',
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '1:1' as const,
    },
    {
      id: 'p6',
      category: 'Product Photography',
      title: 'Commercial Camera Gear Showcase',
      src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      aspectRatio: '3:2' as const,
    },
  ];

  // Learning Topics Data
  const learningTopics = [
    {
      title: 'Camera Operations & Controls',
      description: 'Master manual controls, shutter actuation, focus modes, and lens selection for various photography genres.',
      tag: 'Fundamentals',
    },
    {
      title: 'The Exposure Triangle',
      description: 'Gain a deep understanding of Aperture (f-stop), Shutter Speed, and ISO to control exposure and motion blur.',
      tag: 'Core Technique',
    },
    {
      title: 'Creative Composition Rules',
      description: 'Learn how to compose captivating shots using the rule of thirds, leading lines, framing, and negative space.',
      tag: 'Artistry',
    },
    {
      title: 'Natural & Artificial Lighting',
      description: 'Understand daylight directions, diffusers, golden hour timing, and basic off-camera flash setups.',
      tag: 'Lighting',
    },
    {
      title: 'Portraiture & Subject Posing',
      description: 'Practical techniques for guiding subjects, building rapport, and capturing authentic human emotion.',
      tag: 'People Skills',
    },
    {
      title: 'Photo Editing & RAW Workflows',
      description: 'Introduction to post-processing software, color balance, RAW file development, and export preparation.',
      tag: 'Post-Processing',
    },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* SECTION 1: HERO SECTION */}
      <section id="home" className="relative bg-navy text-white py-16 sm:py-24 overflow-hidden border-b-2 border-navy-950">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cream/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4 stroke-[2.5]" />}>
                  Photography Platform Concept
                </Badge>
                <Badge variant="cream" size="md">
                  Milestone 001 Foundation
                </Badge>
              </div>

              <h1 className="text-display font-display font-bold leading-tight tracking-tight text-white">
                Photography. <br />
                <span className="text-sage">Experience.</span> Learning.
              </h1>

              <p className="text-body-lg text-white font-medium leading-relaxed max-w-2xl">
                A professional photography platform connecting clients with quality photography services while helping aspiring photographers develop practical skills.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a href="#portfolio">
                  <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}>
                    View Portfolio
                  </Button>
                </a>
                <a href="#learning">
                  <Button className="btn-outline-hero" size="lg">
                    Explore Learning
                  </Button>
                </a>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-small font-semibold text-white/90 border-t border-navy-800">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage" /> Professional Services
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage" /> Client Session Inquiries
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage" /> Practical Education
                </span>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative rounded-frame overflow-hidden border-2 border-sage shadow-elevated group">
                <ImageContainer
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80"
                  alt="FrameLearn photography camera lens showcase"
                  aspectRatio="4:3"
                  className="rounded-none border-none shadow-none"
                  showOverlay
                  overlayText="FrameLearn Photography Ecosystem"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-800 p-4 rounded-frame border border-sage/30 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sage flex items-center justify-center text-navy font-bold">
                    <Camera className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-small font-bold text-white">Capture</span>
                    <span className="text-caption text-white/80 font-medium">Services & Portfolio</span>
                  </div>
                </div>
                <div className="bg-navy-800 p-4 rounded-frame border border-sage/30 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-navy font-bold">
                    <BookOpen className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-small font-bold text-white">Learn</span>
                    <span className="text-caption text-white/80 font-medium">Practical Skills</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 2: CORE VALUE PROPOSITION (THREE PILLARS) */}
      <section className="py-4">
        <Container size="lg" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Core Product Pillars"
            title="The Three Pillars of FrameLearn"
            subtitle="Bridging client photography needs with structured educational development under one coherent platform."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: CAPTURE */}
            <Card className="flex flex-col justify-between p-8 bg-white border-2 border-sage-300 hover:border-navy transition-all group">
              <CardHeader className="p-0 mb-4">
                <div className="w-14 h-14 rounded-frame bg-navy flex items-center justify-center text-cream font-bold shadow-subtle mb-4 group-hover:bg-sage group-hover:text-navy transition-colors">
                  <Camera className="w-7 h-7 stroke-[2.5]" />
                </div>
                <CardTitle className="text-h2">1. CAPTURE</CardTitle>
                <Badge variant="navy" className="w-fit mt-1">Professional Services</Badge>
              </CardHeader>
              <CardContent className="p-0 text-body font-medium text-navy-950 leading-relaxed mb-6">
                High-quality photography services for portraits, events, graduations, products, and special occasions crafted with technical excellence.
              </CardContent>
              <div className="pt-4 border-t border-sage-200">
                <a href="#services" className="inline-flex items-center gap-2 text-small font-bold text-navy hover:text-sage transition-colors">
                  <span>Explore Services Scope</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </Card>

            {/* Pillar 2: CONNECT */}
            <Card className="flex flex-col justify-between p-8 bg-white border-2 border-sage-300 hover:border-navy transition-all group">
              <CardHeader className="p-0 mb-4">
                <div className="w-14 h-14 rounded-frame bg-sage flex items-center justify-center text-navy font-bold shadow-subtle mb-4 group-hover:bg-navy group-hover:text-cream transition-colors">
                  <Calendar className="w-7 h-7 stroke-[2.5]" />
                </div>
                <CardTitle className="text-h2">2. CONNECT</CardTitle>
                <Badge variant="sage" className="w-fit mt-1">Client Session Journey</Badge>
              </CardHeader>
              <CardContent className="p-0 text-body font-medium text-navy-950 leading-relaxed mb-6">
                A future client interaction journey allowing users to discover service packages, communicate requirements, and request session bookings.
              </CardContent>
              <div className="pt-4 border-t border-sage-200">
                <a href="#about" className="inline-flex items-center gap-2 text-small font-bold text-navy hover:text-sage transition-colors">
                  <span>Learn Project Vision</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </Card>

            {/* Pillar 3: LEARN */}
            <Card className="flex flex-col justify-between p-8 bg-white border-2 border-sage-300 hover:border-navy transition-all group">
              <CardHeader className="p-0 mb-4">
                <div className="w-14 h-14 rounded-frame bg-cream border-2 border-navy-800 flex items-center justify-center text-navy font-bold shadow-subtle mb-4 group-hover:bg-navy group-hover:text-cream transition-colors">
                  <BookOpen className="w-7 h-7 stroke-[2.5]" />
                </div>
                <CardTitle className="text-h2">3. LEARN</CardTitle>
                <Badge variant="cream" className="w-fit mt-1">Practical Education</Badge>
              </CardHeader>
              <CardContent className="p-0 text-body font-medium text-navy-950 leading-relaxed mb-6">
                Hands-on photography education covering camera operations, exposure fundamentals, composition, lighting setups, and editing workflows.
              </CardContent>
              <div className="pt-4 border-t border-sage-200">
                <a href="#learning" className="inline-flex items-center gap-2 text-small font-bold text-navy hover:text-sage transition-colors">
                  <span>View Educational Topics</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* SECTION 3: PHOTOGRAPHY SERVICES PREVIEW SECTION */}
      <section id="services" className="py-8 bg-cream/60 border-y-2 border-sage-300">
        <Container size="lg" className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Photography Offerings Preview"
              title="Professional Photography Services"
              subtitle="Explore the photography service categories designed for the FrameLearn platform."
              className="mb-0"
            />
            <Badge variant="navy" size="md" className="w-fit">
              Presentation Preview • Milestone 001 Scope
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service) => (
              <Card key={service.id} className="flex flex-col justify-between bg-white border-2 border-sage-300 hover:shadow-elevated transition-all">
                <div>
                  <ImageContainer
                    src={service.image}
                    alt={service.title}
                    aspectRatio="3:2"
                    className="rounded-b-none border-none border-b-2 border-sage-300"
                  />
                  <CardHeader>
                    <CardTitle className="text-h3">{service.title}</CardTitle>
                    <CardSubtitle>{service.subtitle}</CardSubtitle>
                  </CardHeader>
                  <CardContent className="text-small text-navy-950 font-medium leading-relaxed">
                    {service.description}
                  </CardContent>
                </div>
                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setSelectedService(service)}
                  >
                    Explore Service Scope
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 4: PORTFOLIO PREVIEW */}
      <section id="portfolio" className="py-4">
        <Container size="lg" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Visual Portfolio Preview"
            title="Curated Photography Showcase"
            subtitle="Demonstrating how photography assets will be presented within the FrameLearn portfolio lightbox engine."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioPreview.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => setSelectedPortfolioImage(item)}>
                <ImageContainer
                  src={item.src}
                  alt={item.title}
                  aspectRatio={item.aspectRatio}
                  showOverlay
                  overlayText={`View Lightbox: ${item.title}`}
                  caption={`${item.category} • ${item.title}`}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 5: PHOTOGRAPHY LEARNING SECTION */}
      <section id="learning" className="py-12 bg-navy text-white rounded-frame border-2 border-navy-950 shadow-elevated">
        <Container size="lg" className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <Badge variant="sage" size="md" className="w-fit" icon={<BookOpen className="w-4 h-4 stroke-[2.5]" />}>
                Educational Ecosystem
              </Badge>
              <h2 className="text-h1 font-display font-bold text-white tracking-tight">
                Practical Photography Education
              </h2>
              <p className="text-body-lg text-white/90 font-medium leading-relaxed">
                Empowering aspiring photographers with practical, hands-on knowledge covering technical controls, artistic composition, and post-processing.
              </p>
            </div>
            <Badge variant="cream" size="md" className="w-fit">
              Learning Hub Preview
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningTopics.map((topic, index) => (
              <div key={index} className="bg-navy-800 p-6 rounded-frame border border-sage/30 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-navy font-bold text-small">
                      0{index + 1}
                    </span>
                    <Badge variant="cream" size="sm">
                      {topic.tag}
                    </Badge>
                  </div>
                  <h3 className="text-h3 font-display font-bold text-white">{topic.title}</h3>
                  <p className="text-small text-white/85 font-medium leading-relaxed">
                    {topic.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-navy-700/60 flex items-center justify-between text-caption font-bold text-sage">
                  <span>Module Scope Defined</span>
                  <BookCheck className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 6: WHY FRAMELEARN? DIFFERENTIATION */}
      <section className="py-4">
        <Container size="lg" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Platform Differentiation"
            title="Why FrameLearn?"
            subtitle="A cohesive photography ecosystem designed for professional quality and skills advancement."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-frame border-2 border-sage-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-frame bg-sage/20 text-navy font-bold flex items-center justify-center">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-h3 font-display font-bold text-navy">Learn by Doing</h3>
              <p className="text-body font-medium text-navy-950 leading-relaxed">
                Practical, hands-on photography guidance grounded in real-world shooting scenarios rather than purely theoretical instruction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-frame border-2 border-sage-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-frame bg-sage/20 text-navy font-bold flex items-center justify-center">
                <Camera className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-h3 font-display font-bold text-navy">Professional Experience</h3>
              <p className="text-body font-medium text-navy-950 leading-relaxed">
                Built on authentic photography standards, equipment expertise, and dedicated client service values.
              </p>
            </div>

            <div className="bg-white p-8 rounded-frame border-2 border-sage-300 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-frame bg-sage/20 text-navy font-bold flex items-center justify-center">
                <Layers className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-h3 font-display font-bold text-navy">One Photography Ecosystem</h3>
              <p className="text-body font-medium text-navy-950 leading-relaxed">
                Unifying photography service discovery, client engagement, and educational resources under one modern platform.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 7: ABOUT FRAMELEARN */}
      <section id="about" className="py-12 bg-cream/80 border-y-2 border-sage-300">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <Badge variant="navy" size="sm" className="w-fit">
                About The Project Vision
              </Badge>
              <h2 className="text-h1 font-display font-bold text-navy tracking-tight">
                Bridging Photography Practice & Education
              </h2>
              <p className="text-body-lg font-medium text-navy-950 leading-relaxed">
                FrameLearn is a final-year BSc Information Technology Education project created to serve an independent professional photographer in Ghana.
              </p>
              <p className="text-body font-medium text-navy-900 leading-relaxed">
                The platform is designed to provide clients with an elegant way to explore photography packages and request session bookings, while simultaneously offering structured educational resources to aspiring photographers developing their craft.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a href="#contact">
                  <Button variant="primary" size="md">
                    Get in Touch
                  </Button>
                </a>
                <a href="#design-system">
                  <Button variant="outline" size="md">
                    Review Architecture Docs
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-8 rounded-frame border-2 border-sage-300 shadow-subtle flex flex-col gap-4">
              <h3 className="text-h3 font-display font-bold text-navy">Development Team</h3>
              <ul className="space-y-3 text-body font-medium text-navy-950">
                <li className="flex flex-col">
                  <span className="font-bold text-navy">1. Ismail Ibrahim Mensah</span>
                  <span className="text-small text-navy-800">Lead Developer & System Architect</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-bold text-navy">2. Arafat Nabuku Jansu</span>
                  <span className="text-small text-navy-800">Documentation & Testing Lead</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-bold text-navy">3. Janet Antwi</span>
                  <span className="text-small text-navy-800">UI/UX & Brand Identity Lead</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 8: CONTACT PREVIEW */}
      <section id="contact" className="py-4">
        <Container size="lg" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Get in Touch"
            title="Connect with FrameLearn"
            subtitle="Reach out regarding photography service inquiries or educational workshop information."
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-navy font-bold shrink-0">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-small font-bold text-navy">Email Inquiry</span>
                  <span className="text-body font-medium text-navy-950">info@framelearn.edu.gh</span>
                  <span className="text-caption text-navy-800 mt-1">Project Contact Channel</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-navy font-bold shrink-0 border border-navy-800">
                  <MapPin className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-small font-bold text-navy">Location</span>
                  <span className="text-body font-medium text-navy-950">Kumasi / Accra, Ghana</span>
                  <span className="text-caption text-navy-800 mt-1">Independent Studio & Workshops</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-frame border-2 border-sage-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-small font-bold text-navy">Response Hours</span>
                  <span className="text-body font-medium text-navy-950">Monday - Friday: 8:00 AM - 5:00 PM</span>
                  <span className="text-caption text-navy-800 mt-1">Milestone 001 Inquiry Preview</span>
                </div>
              </div>
            </div>

            {/* Contact Form Preview (Non-Functional) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-frame border-2 border-sage-300 shadow-subtle flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-display font-bold text-navy">Send an Inquiry (Preview)</h3>
                <Badge variant="sage" size="sm">Milestone 001 Form</Badge>
              </div>

              {contactFormSubmitted ? (
                <div className="p-6 bg-cream rounded-frame border-2 border-sage-400 text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-navy stroke-[2.5]" />
                  <h4 className="text-h3 font-bold text-navy">Inquiry Preview Received</h4>
                  <p className="text-body font-medium text-navy-950 max-w-md">
                    Thank you for testing the contact form preview. Live message dispatching will be activated in future milestones.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setContactFormSubmitted(false)}>
                    Reset Form Preview
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactFormSubmitted(true);
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="e.g. Ismail Mensah"
                      required
                      leftIcon={<User className="w-4 h-4 text-navy-800 stroke-[2.5]" />}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="e.g. ismail@example.com"
                      required
                      leftIcon={<Mail className="w-4 h-4 text-navy-800 stroke-[2.5]" />}
                    />
                  </div>
                  <Textarea
                    label="Inquiry / Workshop Note"
                    placeholder="Provide details about your session inquiry or learning interest..."
                    rows={4}
                    required
                  />
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-caption font-bold text-navy-800">* Milestone 001 Non-Functional Form</span>
                    <Button type="submit" variant="primary" rightIcon={<Send className="w-4 h-4 stroke-[2.5]" />}>
                      Submit Inquiry Preview
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICE SCOPE MODAL PREVIEW */}
      <Modal
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title || 'Service Details'}
        description={selectedService?.subtitle}
        footer={
          <Button variant="primary" onClick={() => setSelectedService(null)}>
            Close Preview
          </Button>
        }
      >
        <div className="flex flex-col gap-4 text-navy-950 font-medium">
          <p className="text-body-lg leading-relaxed">{selectedService?.description}</p>
          <div className="p-4 bg-cream rounded-frame border-2 border-navy-800 flex flex-col gap-1">
            <span className="text-caption font-bold text-navy">Service Scope Summary</span>
            <p className="text-small font-semibold text-navy-950">{selectedService?.scope}</p>
          </div>
          <p className="text-caption font-bold text-navy-800 italic">
            * Presentation-only preview. Live booking schedule and session pricing will be enabled in Milestone 004.
          </p>
        </div>
      </Modal>

      {/* PORTFOLIO LIGHTBOX MODAL PREVIEW */}
      <Modal
        isOpen={Boolean(selectedPortfolioImage)}
        onClose={() => setSelectedPortfolioImage(null)}
        title={selectedPortfolioImage?.title || 'Portfolio Image Preview'}
        description={`Category: ${selectedPortfolioImage?.category}`}
        size="lg"
        footer={
          <Button variant="primary" onClick={() => setSelectedPortfolioImage(null)}>
            Close Lightbox
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          {selectedPortfolioImage && (
            <ImageContainer
              src={selectedPortfolioImage.src}
              alt={selectedPortfolioImage.title}
              aspectRatio="3:2"
              caption={`Category: ${selectedPortfolioImage.category} — ${selectedPortfolioImage.title}`}
            />
          )}
          <p className="text-caption font-bold text-navy-800 italic text-center">
            * Milestone 001 Lightbox Preview. Full gallery delivery & proofing will be enabled in Milestone 005.
          </p>
        </div>
      </Modal>
    </div>
  );
};
