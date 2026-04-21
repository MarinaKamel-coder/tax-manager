"use client"; 

import { deleteClient } from "../actions/adminActions";

export default function DeleteClientButton({ clientId, clientName }: { clientId: string, clientName: string }) {
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement le client "${clientName}" ? Cette action est irréversible.`
    );

    if (isConfirmed) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-semibold"
    >
      Supprimer
    </button>
  );
}