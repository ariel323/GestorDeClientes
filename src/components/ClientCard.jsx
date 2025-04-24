import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MessageSquarePlus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ClientCard({
  client,
  onEdit,
  onDelete,
  onAddNote,
  selectedTags,
  showDetails,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6 border-b border-gray-100">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg font-semibold">
                {client.firstName?.[0]}
                {client.lastName?.[0]}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {client.firstName} {client.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {client.company || "Sin empresa"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddNote(client)}
              className="hover:bg-blue-50"
            >
              <MessageSquarePlus className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(client)}
              className="hover:bg-blue-50"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(client.id)}
              className="hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-700">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Teléfono:</span>
              <span className="text-gray-700">{client.phone}</span>
            </div>
          )}
          {client.dni && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">DNI:</span>
              <span className="text-gray-700">{client.dni}</span>
            </div>
          )}
          {client.taxId && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">CUIL:</span>
              <span className="text-gray-700">{client.taxId}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Dirección:</span>
              <span className="text-gray-700">{client.address}</span>
            </div>
          )}
          {client.location && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Ubicación:</span>
              <span className="text-gray-700">{client.location}</span>
            </div>
          )}
        </div>

        {/* Tags Section */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {client.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes Section */}
      {showDetails && client.notes && client.notes.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Historial de Notas ({client.notes.length})
          </h4>
          <div className="space-y-2">
            {client.notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white rounded-md shadow-sm border border-gray-100"
              >
                <p className="text-sm text-gray-600">{note.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(note.date), "d 'de' MMMM, yyyy HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
