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
        productsFound: "products found"
      },
      // Cart
      cart: {
        title: "Shopping Cart",
        empty: "Your cart is empty",
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
        company: "Company",
        products: "Products",
        support: "Support",
        legal: "Legal",
        newsletter: "Newsletter",
        newsletterText: "Stay updated with our latest products and industry news",
        subscribe: "Subscribe",
        rights: "All rights reserved.",
        paymentMethods: "We Accept"
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
        productsFound: "produits trouvés"
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
        company: "Entreprise",
        products: "Produits",
        support: "Support",
        legal: "Légal",
        newsletter: "Newsletter",
        newsletterText: "Restez informé de nos derniers produits et actualités de l'industrie",
        subscribe: "S'abonner",
        rights: "Tous droits réservés.",
        paymentMethods: "Nous Acceptons"
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
        productsFound: "productos encontrados"
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
        company: "Empresa",
        products: "Productos",
        support: "Soporte",
        legal: "Legal",
        newsletter: "Boletín",
        newsletterText: "Manténgase actualizado con nuestros últimos productos y noticias de la industria",
        subscribe: "Suscribirse",
        rights: "Todos los derechos reservados.",
        paymentMethods: "Aceptamos"
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