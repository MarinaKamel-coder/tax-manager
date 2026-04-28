import { getDocumentsByClient } from "../../../../../actions/documentActions";
import ImageUploader from "../../../../../components/ImageUploader";
import DocumentList from "../../../../../components/DocumentList";

export default async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const { data: clientDocs } = await getDocumentsByClient(params.id);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📁 Documents du Client</h1>
      
      <div className="space-y-8">
        <ImageUploader clientId={params.id} isGeneral={false} />
        
        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4">Archives personnelles</h2>
          <DocumentList documents={clientDocs || []} isAdmin={true} />
        </div>
      </div>
    </div>
  );
}