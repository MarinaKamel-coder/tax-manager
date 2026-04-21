import { 
  CalculatorIcon, 
  UserGroupIcon, 
  DocumentCheckIcon, 
  BriefcaseIcon 
} from "@heroicons/react/24/outline";

const services = [
  {
    title: "Impôts Particuliers",
    description: "Déclaration de revenus optimisée pour les salariés, retraités et étudiants. Nous maximisons vos remboursements.",
    icon: CalculatorIcon,
  },
  {
    title: "Travailleurs Autonomes",
    description: "Gestion des dépenses d'entreprise, calcul des acomptes provisionnels et optimisation fiscale pour freelances.",
    icon: UserGroupIcon,
  },
  {
    title: "États Financiers",
    description: "Préparation de bilans et d'états de résultats précis pour une vision claire de votre santé financière.",
    icon: DocumentCheckIcon,
  },
  {
    title: "Conseil Fiscal",
    description: "Planification stratégique pour réduire votre charge fiscale à long terme et préparer l'avenir.",
    icon: BriefcaseIcon,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Nos Services Professionnels
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Des solutions fiscales sur mesure pour simplifier votre comptabilité et optimiser vos déclarations.
          </p>
        </div>

        {/* Grille de services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section Appel à l'action */}
        <div className="mt-20 p-10 bg-blue-600 rounded-3xl text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Besoin d'une estimation personnalisée ?</h2>
          <p className="mb-8 opacity-90">Contactez-nous dès aujourd'hui pour discuter de votre dossier fiscal.</p>
        </div>
      </div>
    </div>
  );
}