"use client";

import { updateSubmissionStatus } from "../actions/taxActions";
import { useState } from "react";

export default function StatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    const result = await updateSubmissionStatus(id, newStatus);
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert("Erreur lors de la mise à jour");
    }
    setLoading(false);
  };

  return (
    <select 
      value={status}
      disabled={loading}
      aria-label="status"
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm border rounded-md p-1 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
    >
      <option value="En attente">En attente</option>
      <option value="En cours">En cours</option>
      <option value="Terminé">Terminé</option>
      <option value="Annulé">Annulé</option>
    </select>
  );
}