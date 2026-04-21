import Link from 'next/link';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  MapPinIcon 
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-16 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Section 1: Brand & Bio (Largeur 5/12) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-blue-100 group-hover:rotate-3 transition-transform cursor-default">
                FM
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
                  FADY <span className="text-blue-600">MIKHAIL</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                  Expertise Comptable
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Spécialiste en fiscalité pour particuliers et entreprises. 
              Votre partenaire de confiance pour des déclarations précises et une optimisation fiscale rigoureuse à Longueuil et partout sur la Rive-Sud.
            </p>
          </div>

          {/* Section 2: Contact (Largeur 4/12) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
            <div className="space-y-3">
              <a href="tel:5145550123" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition text-sm">
                <PhoneIcon className="h-5 w-5 text-blue-500/70" />
                (514) 662-6037
              </a>
              <a href="mailto:fadyesssam@yahoo.com" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition text-sm">
                <EnvelopeIcon className="h-5 w-5 text-blue-500/70" />
                fadyesssam@yahoo.com
              </a>
              <div className="flex items-start gap-3 text-slate-600 text-sm pt-2 border-t border-slate-200/60 mt-4">
                <ClockIcon className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p><span className="font-semibold text-slate-800">Lun-Ven:</span> 18h00 — 23h00</p>
                  <p><span className="font-semibold text-slate-800">Sam-Dim:</span> 10h00 — 23h00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Liens (Largeur 3/12) */}
          <div className="md:col-span-3">
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/nos-services" className="text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">
                  Nos Services
                </Link>
              </li>
              <li>
                <Link href="/annonces" className="text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">
                  Actualités Fiscales
                </Link>
              </li>
              <li>
                <Link href="/demande" className="text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block font-medium">
                  Soumettre un dossier
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Bureau Comptable Fady Mikhail. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-black text-slate-300 uppercase tracking-tighter">
            <MapPinIcon className="h-3 w-3" />
            Longueuil • Rive-Sud • Grand Montréal
          </div>
        </div>
      </div>
    </footer>
  );
}