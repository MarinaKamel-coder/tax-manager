import { getGeneralDocuments } from "../../../actions/documentActions";
import ImageUploader from "../../../components/ImageUploader";
import DocumentList from "../../../components/DocumentList";

export default async function GeneralResourcesPage() {
  const { data: generalDocs } = await getGeneralDocuments();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Ressources Générales
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ces documents seront visibles par tous les clients connectés.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche : Ajouter */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Ajouter un guide</h2>
            <ImageUploader isGeneral={true} />
          </div>
        </div>

        {/* Colonne de droite : Liste et Gestion */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            Documents en ligne ({generalDocs?.length || 0})
          </h2>
          
          {generalDocs && generalDocs.length > 0 ? (
            <DocumentList documents={generalDocs} isAdmin={true} />
          ) : (
            <div className="text-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-500 italic">Aucun document général n'a été publié pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}