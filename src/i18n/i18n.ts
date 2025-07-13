import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        products: "Products",
        catalog: "Catalog",
        about: "About Us",
        contact: "Contact",
        certifications: "Certifications",
        faq: "FAQ",
        cart: "Cart",
        login: "Login",
        logout: "Logout",
        account: "My Account",
        admin: "Admin"
      },
      // Home page
      home: {
        title: "Professional Refrigerant Solutions",
        subtitle: "EPA-Approved Refrigerants for HVAC Professionals",
        description: "Leading supplier of premium refrigerants with fast shipping, competitive pricing, and expert support.",
        getQuote: "Get Quote",
        viewProducts: "View Products",
        features: {
          epaCompliant: "EPA Compliant",
          fastShipping: "Fast Shipping",
          expertSupport: "Expert Support",
          bulkPricing: "Bulk Pricing"
        },
        hero: {
          badge: "EPA Certified & Compliant",
          title: "Professional Grade<br />Refrigerants",
          description: "Your trusted partner for wholesale refrigerant distribution. We provide premium quality refrigerants, expert technical support, and reliable delivery to HVAC professionals across North America.",
          shopRefrigerants: "Shop Refrigerants",
          getBulkQuote: "Get Bulk Pricing Quote"
        },
        stats: {
          products: "Products Available",
          support: "Customer Support",
          shipping: "Fast Shipping",
          certified: "Certified"
        },
        sections: {
          leadingDistributor: "Leading Refrigerant Wholesale Distributor",
          trustedBy: "Trusted by thousands of HVAC professionals across North America",
          premierQuality: "Premier Quality & Service Excellence",
          qualityDescription: "FrigidFlow stands as North America's premier wholesale refrigerant distributor, serving HVAC professionals, contractors, and industrial facilities with the highest quality refrigerants and unmatched technical expertise. Since our founding, we've built a reputation for reliability, compliance, and innovation in the refrigeration industry.",
          comprehensiveInventory: "Comprehensive Refrigerant Inventory",
          inventoryDescription: "Our comprehensive inventory includes next-generation low-GWP refrigerants that meet the most stringent EPA regulations and environmental standards. Every product in our catalog undergoes rigorous quality testing to ensure optimal performance and purity levels that exceed industry benchmarks.",
          industryExpertise: "Industry Expertise",
          expertiseDescription: "With decades of combined experience, our certified technicians understand the complexities of refrigerant selection, system compatibility, and regulatory compliance. We provide comprehensive technical support, helping you navigate EPA Section 608 requirements, proper handling procedures, and optimal storage solutions.",
          nationwideDistribution: "Nationwide Distribution",
          distributionDescription: "Our strategically located distribution centers across North America ensure rapid delivery to any location. Whether you need emergency refrigerant supply for critical repairs or scheduled deliveries for large-scale projects, our logistics network guarantees reliable, on-time service.",
          qualityAssurance: "Uncompromising Quality Assurance",
          qualityAssuranceDescription1: "Quality assurance is paramount in everything we do. Our state-of-the-art testing facility conducts purity analysis, moisture content verification, and contaminant screening on every batch. This meticulous attention to detail ensures that when you choose FrigidFlow refrigerants, you're getting products that perform consistently and reliably in the field.",
          qualityAssuranceDescription2: "We understand that HVAC professionals need more than just products – they need a partner who understands their business challenges. That's why we offer flexible payment terms, bulk pricing options, and customized delivery schedules that align with your project timelines and cash flow requirements.",
          environmentalStewardship: "Environmental Stewardship",
          environmentalDescription: "Environmental responsibility drives our operations. We maintain comprehensive recycling programs for used refrigerants, partner with certified reclamation facilities, and continuously invest in cleaner, more sustainable refrigerant technologies. Our commitment to environmental stewardship helps our customers meet their sustainability goals while maintaining operational efficiency.",
          emergencySupport: "24/7 Emergency Support",
          emergencyDescription: "System failures don't wait for business hours. Our emergency response team is available around the clock to provide urgent refrigerant supply and technical guidance. When critical systems are down, count on FrigidFlow to get you back up and running quickly.",
          innovation: "Innovation & Future-Ready Solutions",
          innovationDescription: "Looking ahead, FrigidFlow continues to innovate and expand our service offerings. We're investing in advanced inventory management systems, enhanced logistics capabilities, and emerging refrigerant technologies that will define the future of HVAC and refrigeration. When you partner with FrigidFlow, you're not just buying refrigerants – you're gaining a strategic advantage in an evolving industry.",
          cta: "Ready to experience the FrigidFlow difference? Contact our team today for personalized refrigerant solutions that keep your business running efficiently."
        }
      },
      // Products
      products: {
        title: "Professional Refrigerant Catalog",
        searchPlaceholder: "Search by refrigerant name, SKU, or application...",
        sortBy: "Sort by",
        viewMode: "View Mode",
        filters: "Filters",
        categories: {
          all: "All Categories",
          hfc: "HFC Refrigerants",
          hfo: "HFO Refrigerants",
          natural: "Natural Refrigerants",
          automotive: "Automotive",
          commercial: "Commercial HVAC",
          industrial: "Industrial"
        },
        sort: {
          name: "Name A-Z",
          price: "Price Low to High",
          category: "Category"
        },
        viewDetails: "View Details & Quote",
        outOfStock: "Out of Stock",
        inStock: "In Stock",
        fastShip: "Fast Ship",
        epa: "EPA",
        applications: "Applications",
        perCylinder: "per cylinder",
        productsFound: "products found",
        heroDescription: "Browse our comprehensive selection of EPA-approved refrigerants. Available in bulk quantities for professional HVAC, automotive, and industrial applications.",
        noProducts: "No products found matching your criteria.",
        clearFilters: "Clear Filters",
        refrigerant: "Refrigerant"
      },
      // About page
      about: {
        title: "About Alper Refrigerants",
        subtitle: "EPA-certified wholesale refrigerant distributor serving HVAC contractors across North America since 2010",
        epaCertified: "EPA Certified",
        ahriMember: "AHRI Member",
        isoCertified: "ISO Certified",
        ourMission: "Our Mission",
        missionDescription1: "Founded in 2010, Alper Refrigerants was established to provide HVAC contractors and technicians with reliable wholesale refrigerant solutions. Our mission is to deliver EPA-compliant, laboratory-tested refrigerants including R-410A, R-134a, and R-1234yf at competitive bulk pricing.",
        missionDescription2: "Today, we serve over 5,000 HVAC professionals across the United States and Canada. Every refrigerant cylinder meets stringent AHRI purity standards and ships with complete certification documentation for regulatory compliance.",
        stats: {
          yearsExperience: "Years Experience",
          customersServed: "Customers Served",
          purityRating: "Purity Rating"
        },
        commitmentToQuality: "Our Commitment to Quality",
        qualityDescription: "EPA certification, AHRI compliance, and proven expertise serving HVAC professionals",
        epaCertification: "EPA Certification",
        epaCertificationDescription: "Fully licensed EPA Section 608 certified distributor with DOT hazmat transportation permits. All refrigerants meet federal purity standards and regulatory compliance requirements.",
        qualityAssurance: "Quality Assurance",
        qualityAssuranceDescription: "Every batch is laboratory tested for 99.8% purity rating. ISO 9001:2015 quality management ensures consistent product performance and complete traceability documentation.",
        technicalExpertise: "Technical Expertise",
        technicalExpertiseDescription: "Our EPA-certified technicians provide expert guidance on refrigerant selection, handling procedures, and regulatory compliance for commercial and residential HVAC applications.",
        meetOurTeam: "Meet Our Team",
        teamDescription: "The experts behind your refrigerant solutions",
        loadingTeam: "Loading team members...",
        founderCeo: "Founder & CEO",
        operationsDirector: "Operations Director",
        technicalSpecialist: "Technical Specialist",
        johnAlperBio: "With over 20 years in the HVAC industry, John founded Alper Refrigerants with a vision to provide unmatched quality and service to HVAC professionals.",
        sarahMartinezBio: "Sarah oversees our distribution network and ensures every order meets our rigorous quality standards before reaching our customers.",
        mikeChenBio: "EPA certified with 15+ years of experience, Mike provides technical support and helps customers choose the right refrigerant for their specific applications.",
        whyChooseUs: "Why HVAC Contractors Trust Alper Refrigerants",
        whyChooseDescription: "Certified quality, competitive wholesale pricing, and reliable nationwide shipping",
        epaSection608: "EPA Section 608 Certified",
        epaSection608Description: "Fully licensed refrigerant distributor with EPA certification and DOT hazmat permits for safe transport across North America.",
        purityGuarantee: "99.8% Purity Guarantee",
        purityGuaranteeDescription: "Laboratory-tested refrigerants meeting AHRI standards with complete certification documentation for regulatory compliance.",
        technicalSupportTeam: "Technical Support Team",
        technicalSupportDescription: "EPA-certified specialists provide expert guidance on refrigerant selection and regulatory compliance for your applications.",
        competitivePricing: "Competitive Bulk Pricing",
        competitivePricingDescription: "Wholesale pricing for contractors with volume discounts and dedicated account management for large orders."
      },
      // Cart
      cart: {
        title: "Shopping Cart",
        empty: {
          title: "Your Cart is Empty",
          description: "Start shopping for refrigerants and add them to your cart.",
          browseProducts: "Browse Products"
        },
        emptyDescription: "Add some items to your cart before checking out.",
        continueShopping: "Continue Shopping",
        proceedToCheckout: "Proceed to Checkout",
        subtotal: "Subtotal",
        shipping: "Shipping",
        tax: "Tax",
        total: "Total",
        free: "Free",
        calculatedAtCheckout: "Calculated at checkout",
        epaNotice: "All refrigerants require EPA 608 certification for purchase. You will need to provide certification during checkout."
      },
      // Checkout
      checkout: {
        title: "Checkout",
        customerInfo: "Customer Information",
        shippingAddress: "Shipping Address",
        paymentMethod: "Payment Method",
        orderNotes: "Order Notes",
        orderSummary: "Order Summary",
        legalAcknowledgment: "Legal Acknowledgment",
        legalNotice: "Please Acknowledge",
        legalStatement: "I read and agreed the statement.",
        complianceText: "I confirm that I am buying these refrigerant cylinders either to resell them or to have them installed by an EPA-certified technician. I promise to follow all relevant local, state, and federal laws regarding their purchase, possession, and resale, and affirm that I am legally allowed to do so.",
        mustAgree: "You must acknowledge the legal statement to continue.",
        fields: {
          fullName: "Full Name",
          email: "Email",
          streetAddress: "Street Address",
          city: "City",
          state: "State",
          zipCode: "ZIP Code",
          country: "Country",
          notes: "Enter any special instructions..."
        },
        payment: {
          creditCard: "Credit Card",
          bankWire: "Bank Wire Transfer",
          check: "Company Check",
          cardholderName: "Cardholder Name",
          cardNumber: "Card Number (Last 4 digits)",
          expiryDate: "Expiry Date",
          phoneForCard: "Phone for Card Processing",
          billingAddress: "Billing Address",
          creditCardNotice: "We will call you to process your credit card payment securely over the phone.",
          bankWireNotice: "Payment must be received within 7 business days. Include your order number in the wire transfer reference."
        },
        placeOrder: "Place Order",
        processing: "Processing...",
        freeShipping: "🎉 Free shipping on orders over $500!"
      },
      // Footer
      footer: {
        companyName: "Alper Refrigerants",
        companyTagline: "Premium Refrigerant Solutions",
        companyDescription: "Your trusted partner for wholesale refrigerant distribution. Serving HVAC professionals across North America with EPA-certified refrigerants and expert technical support.",
        epaCertified: "EPA Certified",
        ahriMember: "AHRI Member",
        quickLinks: "Quick Links",
        productCatalog: "Product Catalog",
        shippingCalculator: "Shipping Calculator",
        myAccount: "My Account",
        customerSupport: "Customer Support",
        epaCompliance: "EPA Compliance",
        certifications: "Certifications",
        faq: "FAQ",
        productCategories: "Product Categories",
        hfcRefrigerants: "HFC Refrigerants",
        hfoRefrigerants: "HFO Refrigerants",
        naturalRefrigerants: "Natural Refrigerants",
        automotive: "Automotive",
        commercialHvac: "Commercial HVAC",
        industrial: "Industrial",
        contactInformation: "Contact Information",
        distributionCenters: "Distribution Centers",
        businessHours: "Business Hours",
        monFri: "Monday - Friday: 7:00 AM - 6:00 PM EST",
        saturday: "Saturday: 8:00 AM - 2:00 PM EST",
        weAccept: "We Accept",
        copyright: "© {{year}} Alper Refrigerants. All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        cookiePolicy: "Cookie Policy",
        sitemap: "Sitemap"
      },
      // Contact
      contact: {
        pageTitle: "Contact Alper Refrigerants | Get Wholesale Refrigerant Pricing Quote",
        pageDescription: "Contact EPA-certified refrigerant experts for wholesale pricing on R-410A, R-134a, R-1234yf. Bulk quotes for HVAC contractors with 24/7 emergency support.",
        heroTitle: "Contact Our Refrigerant Experts",
        heroDescription: "Need wholesale pricing on R-410A, R-134a, or R-1234yf? Our EPA-certified team provides expert guidance and competitive bulk quotes for HVAC contractors.",
        getInTouch: "Get In Touch",
        formTitle: "Get Your Refrigerant Quote",
        formDescription: "Submit your requirements below and our EPA-certified team will provide competitive wholesale pricing within 4 hours.",
        fullName: "Full Name",
        emailAddress: "Email Address",
        subject: "Subject",
        message: "Message",
        sendMessage: "Send Message",
        sending: "Sending..."
      },
      // Common
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        add: "Add",
        remove: "Remove",
        back: "Back",
        next: "Next",
        previous: "Previous",
        close: "Close",
        search: "Search",
        filter: "Filter",
        clear: "Clear",
        reset: "Reset",
        submit: "Submit"
      }
    }
  },
  fr: {
    translation: {
      // Navigation
      nav: {
        home: "Accueil",
        products: "Produits",
        catalog: "Catalogue",
        about: "À Propos",
        contact: "Contact",
        certifications: "Certifications",
        faq: "FAQ",
        cart: "Panier",
        login: "Connexion",
        logout: "Déconnexion",
        account: "Mon Compte",
        admin: "Admin"
      },
      // Home page
      home: {
        title: "Solutions Professionnelles de Réfrigérants",
        subtitle: "Réfrigérants Approuvés EPA pour Professionnels CVC",
        description: "Fournisseur leader de réfrigérants premium avec livraison rapide, prix compétitifs et support expert.",
        getQuote: "Obtenir un Devis",
        viewProducts: "Voir les Produits",
        features: {
          epaCompliant: "Conforme EPA",
          fastShipping: "Livraison Rapide",
          expertSupport: "Support Expert",
          bulkPricing: "Prix de Gros"
        },
        hero: {
          badge: "Certifié et Conforme EPA",
          title: "Réfrigérants de<br />Qualité Professionnelle",
          description: "Votre partenaire de confiance pour la distribution en gros de réfrigérants. Nous fournissons des réfrigérants de qualité supérieure, un support technique expert et une livraison fiable aux professionnels CVC d'Amérique du Nord.",
          shopRefrigerants: "Acheter des Réfrigérants",
          getBulkQuote: "Obtenir un Devis de Prix en Gros"
        },
        stats: {
          products: "Produits Disponibles",
          support: "Support Client",
          shipping: "Livraison Rapide",
          certified: "Certifié"
        },
        sections: {
          leadingDistributor: "Distributeur de Réfrigérants en Gros Leader",
          trustedBy: "Fait confiance par des milliers de professionnels CVC à travers l'Amérique du Nord",
          premierQuality: "Excellence de Qualité et de Service Premier",
          qualityDescription: "FrigidFlow se positionne comme le premier distributeur en gros de réfrigérants d'Amérique du Nord, servant les professionnels CVC, entrepreneurs et installations industrielles avec les réfrigérants de la plus haute qualité et une expertise technique inégalée. Depuis notre fondation, nous avons bâti une réputation de fiabilité, conformité et innovation dans l'industrie de la réfrigération.",
          comprehensiveInventory: "Inventaire Complet de Réfrigérants",
          inventoryDescription: "Notre inventaire complet comprend des réfrigérants de nouvelle génération à faible GWP qui répondent aux réglementations EPA les plus strictes et aux normes environnementales. Chaque produit de notre catalogue subit des tests de qualité rigoureux pour assurer une performance optimale et des niveaux de pureté qui dépassent les références de l'industrie.",
          industryExpertise: "Expertise de l'Industrie",
          expertiseDescription: "Avec des décennies d'expérience combinée, nos techniciens certifiés comprennent les complexités de la sélection de réfrigérants, la compatibilité des systèmes et la conformité réglementaire. Nous fournissons un support technique complet, vous aidant à naviguer les exigences EPA Section 608, les procédures de manipulation appropriées et les solutions de stockage optimales.",
          nationwideDistribution: "Distribution Nationale",
          distributionDescription: "Nos centres de distribution stratégiquement situés à travers l'Amérique du Nord assurent une livraison rapide à n'importe quel endroit. Que vous ayez besoin d'un approvisionnement d'urgence en réfrigérant pour des réparations critiques ou de livraisons programmées pour des projets à grande échelle, notre réseau logistique garantit un service fiable et ponctuel.",
          qualityAssurance: "Assurance Qualité Sans Compromis",
          qualityAssuranceDescription1: "L'assurance qualité est primordiale dans tout ce que nous faisons. Notre installation de test de pointe effectue l'analyse de pureté, la vérification du contenu d'humidité et le dépistage de contaminants sur chaque lot. Cette attention méticuleuse aux détails assure que lorsque vous choisissez les réfrigérants FrigidFlow, vous obtenez des produits qui performent de manière cohérente et fiable sur le terrain.",
          qualityAssuranceDescription2: "Nous comprenons que les professionnels CVC ont besoin de plus que des produits - ils ont besoin d'un partenaire qui comprend leurs défis commerciaux. C'est pourquoi nous offrons des conditions de paiement flexibles, des options de prix en gros et des horaires de livraison personnalisés qui s'alignent avec vos échéanciers de projet et exigences de flux de trésorerie.",
          environmentalStewardship: "Intendance Environnementale",
          environmentalDescription: "La responsabilité environnementale guide nos opérations. Nous maintenons des programmes de recyclage complets pour les réfrigérants usagés, nous nous associons avec des installations de récupération certifiées, et nous investissons continuellement dans des technologies de réfrigérants plus propres et plus durables. Notre engagement envers l'intendance environnementale aide nos clients à atteindre leurs objectifs de durabilité tout en maintenant l'efficacité opérationnelle.",
          emergencySupport: "Support d'Urgence 24/7",
          emergencyDescription: "Les pannes de système n'attendent pas les heures d'affaires. Notre équipe de réponse d'urgence est disponible 24 heures sur 24 pour fournir un approvisionnement urgent en réfrigérant et des conseils techniques. Quand les systèmes critiques sont en panne, comptez sur FrigidFlow pour vous remettre en marche rapidement.",
          innovation: "Innovation et Solutions Prêtes pour l'Avenir",
          innovationDescription: "En regardant vers l'avenir, FrigidFlow continue d'innover et d'élargir nos offres de services. Nous investissons dans des systèmes avancés de gestion d'inventaire, des capacités logistiques améliorées et des technologies de réfrigérants émergentes qui définiront l'avenir du CVC et de la réfrigération. Quand vous vous associez avec FrigidFlow, vous n'achetez pas seulement des réfrigérants - vous obtenez un avantage stratégique dans une industrie en évolution.",
          cta: "Prêt à vivre la différence FrigidFlow ? Contactez notre équipe aujourd'hui pour des solutions de réfrigérants personnalisées qui maintiennent votre entreprise en fonctionnement efficace."
        }
      },
      // Products
      products: {
        title: "Catalogue de Réfrigérants Professionnels",
        searchPlaceholder: "Rechercher par nom de réfrigérant, SKU ou application...",
        sortBy: "Trier par",
        viewMode: "Mode d'Affichage",
        filters: "Filtres",
        categories: {
          all: "Toutes les Catégories",
          hfc: "Réfrigérants HFC",
          hfo: "Réfrigérants HFO",
          natural: "Réfrigérants Naturels",
          automotive: "Automobile",
          commercial: "CVC Commercial",
          industrial: "Industriel"
        },
        sort: {
          name: "Nom A-Z",
          price: "Prix Croissant",
          category: "Catégorie"
        },
        viewDetails: "Voir les Détails et Devis",
        outOfStock: "Rupture de Stock",
        inStock: "En Stock",
        fastShip: "Livraison Rapide",
        epa: "EPA",
        applications: "Applications",
        perCylinder: "par cylindre",
        productsFound: "produits trouvés",
        heroDescription: "Parcourez notre sélection complète de réfrigérants approuvés EPA. Disponibles en quantités en gros pour applications professionnelles CVC, automobiles et industrielles.",
        noProducts: "Aucun produit trouvé correspondant à vos critères.",
        clearFilters: "Effacer les Filtres",
        refrigerant: "Réfrigérant"
      },
      // About page
      about: {
        title: "À Propos d'Alper Refrigerants",
        subtitle: "Distributeur de réfrigérants en gros certifié EPA servant les entrepreneurs CVC à travers l'Amérique du Nord depuis 2010",
        epaCertified: "Certifié EPA",
        ahriMember: "Membre AHRI",
        isoCertified: "Certifié ISO",
        ourMission: "Notre Mission",
        missionDescription1: "Fondé en 2010, Alper Refrigerants a été établi pour fournir aux entrepreneurs et techniciens CVC des solutions de réfrigérants en gros fiables. Notre mission est de livrer des réfrigérants conformes EPA, testés en laboratoire incluant R-410A, R-134a et R-1234yf à des prix de gros compétitifs.",
        missionDescription2: "Aujourd'hui, nous servons plus de 5 000 professionnels CVC à travers les États-Unis et le Canada. Chaque cylindre de réfrigérant répond aux normes de pureté AHRI strictes et est expédié avec une documentation de certification complète pour la conformité réglementaire.",
        stats: {
          yearsExperience: "Années d'Expérience",
          customersServed: "Clients Servis",
          purityRating: "Taux de Pureté"
        },
        commitmentToQuality: "Notre Engagement envers la Qualité",
        qualityDescription: "Certification EPA, conformité AHRI et expertise prouvée servant les professionnels CVC",
        epaCertification: "Certification EPA",
        epaCertificationDescription: "Distributeur certifié EPA Section 608 entièrement licencié avec permis de transport de matières dangereuses DOT. Tous les réfrigérants répondent aux normes de pureté fédérales et aux exigences de conformité réglementaire.",
        qualityAssurance: "Assurance Qualité",
        qualityAssuranceDescription: "Chaque lot est testé en laboratoire pour un taux de pureté de 99,8%. La gestion de qualité ISO 9001:2015 assure une performance de produit cohérente et une documentation de traçabilité complète.",
        technicalExpertise: "Expertise Technique",
        technicalExpertiseDescription: "Nos techniciens certifiés EPA fournissent des conseils experts sur la sélection de réfrigérants, les procédures de manipulation et la conformité réglementaire pour les applications CVC commerciales et résidentielles.",
        meetOurTeam: "Rencontrez Notre Équipe",
        teamDescription: "Les experts derrière vos solutions de réfrigérants",
        loadingTeam: "Chargement des membres de l'équipe...",
        founderCeo: "Fondateur et PDG",
        operationsDirector: "Directeur des Opérations",
        technicalSpecialist: "Spécialiste Technique",
        johnAlperBio: "Avec plus de 20 ans dans l'industrie CVC, John a fondé Alper Refrigerants avec une vision de fournir une qualité et un service inégalés aux professionnels CVC.",
        sarahMartinezBio: "Sarah supervise notre réseau de distribution et s'assure que chaque commande répond à nos normes de qualité rigoureuses avant d'atteindre nos clients.",
        mikeChenBio: "Certifié EPA avec plus de 15 ans d'expérience, Mike fournit un support technique et aide les clients à choisir le bon réfrigérant pour leurs applications spécifiques.",
        whyChooseUs: "Pourquoi les Entrepreneurs CVC Font Confiance à Alper Refrigerants",
        whyChooseDescription: "Qualité certifiée, prix de gros compétitifs et expédition fiable à l'échelle nationale",
        epaSection608: "Certifié EPA Section 608",
        epaSection608Description: "Distributeur de réfrigérants entièrement licencié avec certification EPA et permis de matières dangereuses DOT pour un transport sûr à travers l'Amérique du Nord.",
        purityGuarantee: "Garantie de Pureté 99,8%",
        purityGuaranteeDescription: "Réfrigérants testés en laboratoire répondant aux normes AHRI avec documentation de certification complète pour la conformité réglementaire.",
        technicalSupportTeam: "Équipe de Support Technique",
        technicalSupportDescription: "Les spécialistes certifiés EPA fournissent des conseils experts sur la sélection de réfrigérants et la conformité réglementaire pour vos applications.",
        competitivePricing: "Prix de Gros Compétitifs",
        competitivePricingDescription: "Prix de gros pour entrepreneurs avec remises de volume et gestion de compte dédiée pour les grosses commandes."
      },
      // Cart
      cart: {
        title: "Panier d'Achat",
        empty: "Votre panier est vide",
        emptyDescription: "Ajoutez des articles à votre panier avant de passer commande.",
        continueShopping: "Continuer les Achats",
        proceedToCheckout: "Procéder au Paiement",
        subtotal: "Sous-total",
        shipping: "Livraison",
        tax: "Taxe",
        total: "Total",
        free: "Gratuit",
        calculatedAtCheckout: "Calculé lors du paiement",
        epaNotice: "Tous les réfrigérants nécessitent une certification EPA 608 pour l'achat. Vous devrez fournir la certification lors du paiement."
      },
      // Checkout
      checkout: {
        title: "Paiement",
        customerInfo: "Informations Client",
        shippingAddress: "Adresse de Livraison",
        paymentMethod: "Méthode de Paiement",
        orderNotes: "Notes de Commande",
        orderSummary: "Résumé de Commande",
        legalAcknowledgment: "Reconnaissance Légale",
        legalNotice: "Veuillez Reconnaître",
        legalStatement: "J'ai lu et accepté la déclaration.",
        complianceText: "Je confirme que j'achète ces cylindres de réfrigérant soit pour les revendre, soit pour les faire installer par un technicien certifié EPA. Je promets de suivre toutes les lois locales, étatiques et fédérales pertinentes concernant leur achat, possession et revente, et j'affirme que j'ai légalement le droit de le faire.",
        mustAgree: "Vous devez reconnaître la déclaration légale pour continuer.",
        fields: {
          fullName: "Nom Complet",
          email: "Email",
          streetAddress: "Adresse Rue",
          city: "Ville",
          state: "État",
          zipCode: "Code Postal",
          country: "Pays",
          notes: "Entrez des instructions spéciales..."
        },
        payment: {
          creditCard: "Carte de Crédit",
          bankWire: "Virement Bancaire",
          check: "Chèque d'Entreprise",
          cardholderName: "Nom du Titulaire",
          cardNumber: "Numéro de Carte (4 derniers chiffres)",
          expiryDate: "Date d'Expiration",
          phoneForCard: "Téléphone pour Traitement de Carte",
          billingAddress: "Adresse de Facturation",
          creditCardNotice: "Nous vous appellerons pour traiter votre paiement par carte de crédit en toute sécurité par téléphone.",
          bankWireNotice: "Le paiement doit être reçu dans les 7 jours ouvrables. Incluez votre numéro de commande dans la référence du virement."
        },
        placeOrder: "Passer Commande",
        processing: "Traitement...",
        freeShipping: "🎉 Livraison gratuite sur les commandes de plus de 500$!"
      },
      // Footer
      footer: {
        companyName: "Alper Refrigerants",
        companyTagline: "Solutions de Réfrigérant Premium",
        companyDescription: "Votre partenaire de confiance pour la distribution en gros de réfrigérants. Servir les professionnels CVC à travers l'Amérique du Nord avec des réfrigérants certifiés EPA et un support technique expert.",
        epaCertified: "Certifié EPA",
        ahriMember: "Membre AHRI",
        quickLinks: "Liens Rapides",
        productCatalog: "Catalogue de Produits",
        shippingCalculator: "Calculateur de Livraison",
        myAccount: "Mon Compte",
        customerSupport: "Support Client",
        epaCompliance: "Conformité EPA",
        certifications: "Certifications",
        faq: "FAQ",
        productCategories: "Catégories de Produits",
        hfcRefrigerants: "Réfrigérants HFC",
        hfoRefrigerants: "Réfrigérants HFO",
        naturalRefrigerants: "Réfrigérants Naturels",
        automotive: "Automobile",
        commercialHvac: "CVC Commercial",
        industrial: "Industriel",
        contactInformation: "Informations de Contact",
        distributionCenters: "Centres de Distribution",
        businessHours: "Heures d'Ouverture",
        monFri: "Lundi - Vendredi: 7h00 - 18h00 EST",
        saturday: "Samedi: 8h00 - 14h00 EST",
        weAccept: "Nous Acceptons",
        copyright: "© {{year}} Alper Refrigerants. Tous droits réservés.",
        privacyPolicy: "Politique de Confidentialité",
        termsOfService: "Conditions d'Utilisation",
        cookiePolicy: "Politique des Cookies",
        sitemap: "Plan du Site"
      },
      // Common
      common: {
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
        cancel: "Annuler",
        save: "Sauvegarder",
        edit: "Modifier",
        delete: "Supprimer",
        add: "Ajouter",
        remove: "Retirer",
        back: "Retour",
        next: "Suivant",
        previous: "Précédent",
        close: "Fermer",
        search: "Rechercher",
        filter: "Filtrer",
        clear: "Effacer",
        reset: "Réinitialiser",
        submit: "Soumettre"
      }
    }
  },
  es: {
    translation: {
      // Navigation
      nav: {
        home: "Inicio",
        products: "Productos",
        catalog: "Catálogo",
        about: "Acerca de",
        contact: "Contacto",
        certifications: "Certificaciones",
        faq: "FAQ",
        cart: "Carrito",
        login: "Iniciar Sesión",
        logout: "Cerrar Sesión",
        account: "Mi Cuenta",
        admin: "Admin"
      },
      // Home page
      home: {
        title: "Soluciones Profesionales de Refrigerantes",
        subtitle: "Refrigerantes Aprobados por EPA para Profesionales HVAC",
        description: "Proveedor líder de refrigerantes premium con envío rápido, precios competitivos y soporte experto.",
        getQuote: "Obtener Cotización",
        viewProducts: "Ver Productos",
        features: {
          epaCompliant: "Cumple EPA",
          fastShipping: "Envío Rápido",
          expertSupport: "Soporte Experto",
          bulkPricing: "Precios al Por Mayor"
        },
        hero: {
          badge: "Certificado y Cumple EPA",
          title: "Refrigerantes de<br />Grado Profesional",
          description: "Su socio de confianza para la distribución al por mayor de refrigerantes. Proporcionamos refrigerantes de calidad premium, soporte técnico experto y entrega confiable a profesionales HVAC en América del Norte.",
          shopRefrigerants: "Comprar Refrigerantes",
          getBulkQuote: "Obtener Cotización de Precios al Por Mayor"
        },
        stats: {
          products: "Productos Disponibles",
          support: "Soporte al Cliente",
          shipping: "Envío Rápido",
          certified: "Certificado"
        },
        sections: {
          leadingDistributor: "Distribuidor Mayorista de Refrigerantes Líder",
          trustedBy: "Confiado por miles de profesionales HVAC en América del Norte",
          premierQuality: "Excelencia en Calidad y Servicio Premier",
          qualityDescription: "FrigidFlow se posiciona como el principal distribuidor mayorista de refrigerantes de América del Norte, sirviendo a profesionales HVAC, contratistas e instalaciones industriales con los refrigerantes de la más alta calidad y experiencia técnica inigualable. Desde nuestra fundación, hemos construido una reputación de confiabilidad, cumplimiento e innovación en la industria de refrigeración.",
          comprehensiveInventory: "Inventario Integral de Refrigerantes",
          inventoryDescription: "Nuestro inventario integral incluye refrigerantes de nueva generación de bajo GWP que cumplen con las regulaciones EPA más estrictas y estándares ambientales. Cada producto en nuestro catálogo se somete a pruebas de calidad rigurosas para asegurar rendimiento óptimo y niveles de pureza que superan los benchmarks de la industria.",
          industryExpertise: "Experiencia en la Industria",
          expertiseDescription: "Con décadas de experiencia combinada, nuestros técnicos certificados entienden las complejidades de la selección de refrigerantes, compatibilidad de sistemas y cumplimiento regulatorio. Proporcionamos soporte técnico integral, ayudándole a navegar los requisitos EPA Sección 608, procedimientos de manejo apropiados y soluciones de almacenamiento óptimas.",
          nationwideDistribution: "Distribución Nacional",
          distributionDescription: "Nuestros centros de distribución estratégicamente ubicados en América del Norte aseguran entrega rápida a cualquier ubicación. Ya sea que necesite suministro de emergencia de refrigerante para reparaciones críticas o entregas programadas para proyectos a gran escala, nuestra red logística garantiza servicio confiable y puntual.",
          qualityAssurance: "Aseguramiento de Calidad Sin Compromisos",
          qualityAssuranceDescription1: "El aseguramiento de calidad es primordial en todo lo que hacemos. Nuestra instalación de pruebas de última generación conduce análisis de pureza, verificación de contenido de humedad y detección de contaminantes en cada lote. Esta atención meticulosa al detalle asegura que cuando elige refrigerantes FrigidFlow, está obteniendo productos que funcionan consistente y confiablemente en el campo.",
          qualityAssuranceDescription2: "Entendemos que los profesionales HVAC necesitan más que solo productos - necesitan un socio que entienda sus desafíos comerciales. Por eso ofrecemos términos de pago flexibles, opciones de precios al por mayor y horarios de entrega personalizados que se alinean con sus cronogramas de proyecto y requisitos de flujo de efectivo.",
          environmentalStewardship: "Administración Ambiental",
          environmentalDescription: "La responsabilidad ambiental impulsa nuestras operaciones. Mantenemos programas de reciclaje integrales para refrigerantes usados, nos asociamos con instalaciones de recuperación certificadas e invertimos continuamente en tecnologías de refrigerantes más limpias y sostenibles. Nuestro compromiso con la administración ambiental ayuda a nuestros clientes a cumplir sus objetivos de sostenibilidad mientras mantienen la eficiencia operacional.",
          emergencySupport: "Soporte de Emergencia 24/7",
          emergencyDescription: "Las fallas de sistema no esperan horarios comerciales. Nuestro equipo de respuesta de emergencia está disponible las 24 horas para proporcionar suministro urgente de refrigerante y orientación técnica. Cuando los sistemas críticos están fuera de servicio, cuente con FrigidFlow para ponerlo en funcionamiento rápidamente.",
          innovation: "Innovación y Soluciones Listas para el Futuro",
          innovationDescription: "Mirando hacia adelante, FrigidFlow continúa innovando y expandiendo nuestras ofertas de servicios. Estamos invirtiendo en sistemas avanzados de gestión de inventario, capacidades logísticas mejoradas y tecnologías emergentes de refrigerantes que definirán el futuro de HVAC y refrigeración. Cuando se asocia con FrigidFlow, no solo está comprando refrigerantes - está ganando una ventaja estratégica en una industria en evolución.",
          cta: "¿Listo para experimentar la diferencia FrigidFlow? Contacte a nuestro equipo hoy para soluciones de refrigerantes personalizadas que mantengan su negocio funcionando eficientemente."
        }
      },
      // Products
      products: {
        title: "Catálogo de Refrigerantes Profesionales",
        searchPlaceholder: "Buscar por nombre de refrigerante, SKU o aplicación...",
        sortBy: "Ordenar por",
        viewMode: "Modo de Vista",
        filters: "Filtros",
        categories: {
          all: "Todas las Categorías",
          hfc: "Refrigerantes HFC",
          hfo: "Refrigerantes HFO",
          natural: "Refrigerantes Naturales",
          automotive: "Automotriz",
          commercial: "HVAC Comercial",
          industrial: "Industrial"
        },
        sort: {
          name: "Nombre A-Z",
          price: "Precio Menor a Mayor",
          category: "Categoría"
        },
        viewDetails: "Ver Detalles y Cotización",
        outOfStock: "Agotado",
        inStock: "En Stock",
        fastShip: "Envío Rápido",
        epa: "EPA",
        applications: "Aplicaciones",
        perCylinder: "por cilindro",
        productsFound: "productos encontrados",
        heroDescription: "Navegue nuestra selección integral de refrigerantes aprobados por EPA. Disponibles en cantidades al por mayor para aplicaciones profesionales HVAC, automotrices e industriales.",
        noProducts: "No se encontraron productos que coincidan con sus criterios.",
        clearFilters: "Limpiar Filtros",
        refrigerant: "Refrigerante"
      },
      // About page
      about: {
        title: "Acerca de Alper Refrigerants",
        subtitle: "Distribuidor mayorista de refrigerantes certificado por EPA sirviendo contratistas HVAC en América del Norte desde 2010",
        epaCertified: "Certificado EPA",
        ahriMember: "Miembro AHRI",
        isoCertified: "Certificado ISO",
        ourMission: "Nuestra Misión",
        missionDescription1: "Fundado en 2010, Alper Refrigerants fue establecido para proporcionar a contratistas y técnicos HVAC soluciones de refrigerantes mayoristas confiables. Nuestra misión es entregar refrigerantes compatibles con EPA, probados en laboratorio incluyendo R-410A, R-134a y R-1234yf a precios mayoristas competitivos.",
        missionDescription2: "Hoy, servimos a más de 5,000 profesionales HVAC en Estados Unidos y Canadá. Cada cilindro de refrigerante cumple con estrictos estándares de pureza AHRI y se envía con documentación de certificación completa para cumplimiento regulatorio.",
        stats: {
          yearsExperience: "Años de Experiencia",
          customersServed: "Clientes Atendidos",
          purityRating: "Clasificación de Pureza"
        },
        commitmentToQuality: "Nuestro Compromiso con la Calidad",
        qualityDescription: "Certificación EPA, cumplimiento AHRI y experiencia probada sirviendo profesionales HVAC",
        epaCertification: "Certificación EPA",
        epaCertificationDescription: "Distribuidor certificado EPA Sección 608 completamente licenciado con permisos de transporte de materiales peligrosos DOT. Todos los refrigerantes cumplen estándares federales de pureza y requisitos de cumplimiento regulatorio.",
        qualityAssurance: "Aseguramiento de Calidad",
        qualityAssuranceDescription: "Cada lote es probado en laboratorio para una clasificación de pureza del 99.8%. La gestión de calidad ISO 9001:2015 asegura rendimiento consistente del producto y documentación completa de trazabilidad.",
        technicalExpertise: "Experiencia Técnica",
        technicalExpertiseDescription: "Nuestros técnicos certificados por EPA proporcionan orientación experta sobre selección de refrigerantes, procedimientos de manejo y cumplimiento regulatorio para aplicaciones HVAC comerciales y residenciales.",
        meetOurTeam: "Conozca Nuestro Equipo",
        teamDescription: "Los expertos detrás de sus soluciones de refrigerantes",
        loadingTeam: "Cargando miembros del equipo...",
        founderCeo: "Fundador y CEO",
        operationsDirector: "Director de Operaciones",
        technicalSpecialist: "Especialista Técnico",
        johnAlperBio: "Con más de 20 años en la industria HVAC, John fundó Alper Refrigerants con una visión de proporcionar calidad y servicio inigualables a profesionales HVAC.",
        sarahMartinezBio: "Sarah supervisa nuestra red de distribución y asegura que cada pedido cumpla con nuestros rigurosos estándares de calidad antes de llegar a nuestros clientes.",
        mikeChenBio: "Certificado EPA con más de 15 años de experiencia, Mike proporciona soporte técnico y ayuda a los clientes a elegir el refrigerante correcto para sus aplicaciones específicas.",
        whyChooseUs: "Por Qué los Contratistas HVAC Confían en Alper Refrigerants",
        whyChooseDescription: "Calidad certificada, precios mayoristas competitivos y envío confiable a nivel nacional",
        epaSection608: "Certificado EPA Sección 608",
        epaSection608Description: "Distribuidor de refrigerantes completamente licenciado con certificación EPA y permisos de materiales peligrosos DOT para transporte seguro en América del Norte.",
        purityGuarantee: "Garantía de Pureza 99.8%",
        purityGuaranteeDescription: "Refrigerantes probados en laboratorio que cumplen estándares AHRI con documentación completa de certificación para cumplimiento regulatorio.",
        technicalSupportTeam: "Equipo de Soporte Técnico",
        technicalSupportDescription: "Especialistas certificados por EPA proporcionan orientación experta sobre selección de refrigerantes y cumplimiento regulatorio para sus aplicaciones.",
        competitivePricing: "Precios Mayoristas Competitivos",
        competitivePricingDescription: "Precios mayoristas para contratistas con descuentos por volumen y gestión de cuenta dedicada para pedidos grandes."
      },
      // Cart
      cart: {
        title: "Carrito de Compras",
        empty: "Tu carrito está vacío",
        emptyDescription: "Agrega algunos artículos a tu carrito antes de proceder al pago.",
        continueShopping: "Continuar Comprando",
        proceedToCheckout: "Proceder al Pago",
        subtotal: "Subtotal",
        shipping: "Envío",
        tax: "Impuesto",
        total: "Total",
        free: "Gratis",
        calculatedAtCheckout: "Calculado en el pago",
        epaNotice: "Todos los refrigerantes requieren certificación EPA 608 para la compra. Deberá proporcionar la certificación durante el pago."
      },
      // Checkout
      checkout: {
        title: "Pago",
        customerInfo: "Información del Cliente",
        shippingAddress: "Dirección de Envío",
        paymentMethod: "Método de Pago",
        orderNotes: "Notas del Pedido",
        orderSummary: "Resumen del Pedido",
        legalAcknowledgment: "Reconocimiento Legal",
        legalNotice: "Por Favor Reconozca",
        legalStatement: "He leído y acepto la declaración.",
        complianceText: "Confirmo que estoy comprando estos cilindros de refrigerante ya sea para revenderlos o para que sean instalados por un técnico certificado por la EPA. Prometo seguir todas las leyes locales, estatales y federales relevantes con respecto a su compra, posesión y reventa, y afirmo que tengo el derecho legal de hacerlo.",
        mustAgree: "Debe reconocer la declaración legal para continuar.",
        fields: {
          fullName: "Nombre Completo",
          email: "Email",
          streetAddress: "Dirección",
          city: "Ciudad",
          state: "Estado",
          zipCode: "Código Postal",
          country: "País",
          notes: "Ingrese instrucciones especiales..."
        },
        payment: {
          creditCard: "Tarjeta de Crédito",
          bankWire: "Transferencia Bancaria",
          check: "Cheque de Empresa",
          cardholderName: "Nombre del Titular",
          cardNumber: "Número de Tarjeta (últimos 4 dígitos)",
          expiryDate: "Fecha de Vencimiento",
          phoneForCard: "Teléfono para Procesamiento de Tarjeta",
          billingAddress: "Dirección de Facturación",
          creditCardNotice: "Le llamaremos para procesar su pago con tarjeta de crédito de forma segura por teléfono.",
          bankWireNotice: "El pago debe recibirse dentro de 7 días hábiles. Incluya su número de pedido en la referencia de la transferencia."
        },
        placeOrder: "Realizar Pedido",
        processing: "Procesando...",
        freeShipping: "🎉 ¡Envío gratis en pedidos de más de $500!"
      },
      // Footer
      footer: {
        companyName: "Alper Refrigerants",
        companyTagline: "Soluciones de Refrigerante Premium",
        companyDescription: "Su socio de confianza para la distribución mayorista de refrigerantes. Sirviendo a profesionales HVAC en América del Norte con refrigerantes certificados por EPA y soporte técnico experto.",
        epaCertified: "Certificado EPA",
        ahriMember: "Miembro AHRI",
        quickLinks: "Enlaces Rápidos",
        productCatalog: "Catálogo de Productos",
        shippingCalculator: "Calculadora de Envío",
        myAccount: "Mi Cuenta",
        customerSupport: "Soporte al Cliente",
        epaCompliance: "Cumplimiento EPA",
        certifications: "Certificaciones",
        faq: "FAQ",
        productCategories: "Categorías de Productos",
        hfcRefrigerants: "Refrigerantes HFC",
        hfoRefrigerants: "Refrigerantes HFO",
        naturalRefrigerants: "Refrigerantes Naturales",
        automotive: "Automotriz",
        commercialHvac: "HVAC Comercial",
        industrial: "Industrial",
        contactInformation: "Información de Contacto",
        distributionCenters: "Centros de Distribución",
        businessHours: "Horario Comercial",
        monFri: "Lunes - Viernes: 7:00 AM - 6:00 PM EST",
        saturday: "Sábado: 8:00 AM - 2:00 PM EST",
        weAccept: "Aceptamos",
        copyright: "© {{year}} Alper Refrigerants. Todos los derechos reservados.",
        privacyPolicy: "Política de Privacidad",
        termsOfService: "Términos de Servicio",
        cookiePolicy: "Política de Cookies",
        sitemap: "Mapa del Sitio"
      },
      // Common
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        cancel: "Cancelar",
        save: "Guardar",
        edit: "Editar",
        delete: "Eliminar",
        add: "Agregar",
        remove: "Quitar",
        back: "Atrás",
        next: "Siguiente",
        previous: "Anterior",
        close: "Cerrar",
        search: "Buscar",
        filter: "Filtrar",
        clear: "Limpiar",
        reset: "Restablecer",
        submit: "Enviar"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;