import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ClientCard } from "@/components/ClientCard";
import { ClientAnalytics } from "@/components/ClientAnalytics";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Upload,
  Download,
  BarChart2,
  Tags,
  MessageSquarePlus,
} from "lucide-react";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

const AVAILABLE_TAGS = ["Nuevo", "Activo", "Inactivo"];

function App() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [newClient, setNewClient] = useState({
    company: "",
    address: "",
    province: "",
    taxId: "",
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    dni: "",
    location: "",
    tags: [],
    notes: [],
  });
  const [editingClient, setEditingClient] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [selectedClientForNote, setSelectedClientForNote] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = () => {
    if (!newClient.firstName || !newClient.email) {
      toast({
        title: "Error",
        description: "First name and email are required fields",
        variant: "destructive",
      });
      return;
    }

    const clientToAdd = {
      ...newClient,
      id: Date.now(),
    };

    setClients((prevClients) => [...prevClients, clientToAdd]);
    setNewClient({
      company: "",
      address: "",
      province: "",
      taxId: "",
      phone: "",
      email: "",
      firstName: "",
      lastName: "",
      dni: "",
      location: "",
      tags: [],
      notes: [],
    });

    // Cerrar el diálogo
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Client added successfully",
    });
  };

  const handleEditClient = () => {
    if (!editingClient.firstName || !editingClient.email) {
      toast({
        title: "Error",
        description: "First name and email are required fields",
        variant: "destructive",
      });
      return;
    }

    setClients(
      clients.map((client) =>
        client.id === editingClient.id ? editingClient : client
      )
    );

    // Cerrar el diálogo
    setEditingClient(null);

    toast({
      title: "Success",
      description: "Client updated successfully",
    });
  };

  const handleDeleteClient = (id) => {
    setClients(clients.filter((client) => client.id !== id));
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado exitosamente",
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedClientForNote) {
      toast({
        title: "Error",
        description: "La nota no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    const updatedClients = clients.map((client) => {
      if (client.id === selectedClientForNote.id) {
        const newNoteObj = {
          id: Date.now(),
          content: newNote.trim(),
          date: new Date().toISOString(),
        };
        return {
          ...client,
          notes: [...(client.notes || []), newNoteObj],
        };
      }
      return client;
    });

    setClients(updatedClients);
    setNewNote("");
    setSelectedClientForNote(null);
    toast({
      title: "Éxito",
      description: "Nota agregada correctamente",
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const newClients = jsonData.map((row) => ({
          id: Date.now() + Math.random(),
          firstName: row.firstName || row.FirstName || "",
          lastName: row.lastName || row.LastName || "",
          email: row.email || row.Email || "",
          phone: row.phone || row.Phone || "",
          company: row.company || row.Company || "",
          address: row.address || row.Address || "",
          province: row.province || row.Province || "",
          taxId: row.taxId || row.TaxId || row.CUIL || "",
          dni: row.dni || row.DNI || "",
          location: row.location || row.Location || "",
          // Convertir string de tags a array
          tags: row.tags ? row.tags.split(",").map((tag) => tag.trim()) : [],
          notes: row.notes
            ? row.notes.split(";").map((note) => ({
                id: Date.now() + Math.random(),
                content: note.trim(),
                date: new Date().toISOString(),
              }))
            : [],
        }));

        setClients((prevClients) => [...prevClients, ...newClients]);
        toast({
          title: "Datos importados",
          description: `Se importaron ${newClients.length} clientes exitosamente`,
        });
      } catch (error) {
        console.error("Error al importar:", error);
        toast({
          title: "Error",
          description: "Error al procesar el archivo Excel",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = null;
  };

  const handleExportToExcel = () => {
    const clientsToExport = clients.map((client) => ({
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
      address: client.address || "",
      province: client.province || "",
      taxId: client.taxId || "",
      dni: client.dni || "",
      location: client.location || "",
      tags: client.tags ? client.tags.join(", ") : "",
      notes: client.notes
        ? client.notes
            .map(
              (note) =>
                `${note.content} (${new Date(note.date).toLocaleDateString()})`
            )
            .join("; ")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(clientsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "clientes.xlsx");
  };

  const toggleTag = (tag, client) => {
    const updatedClient = { ...client };
    if (!updatedClient.tags) updatedClient.tags = [];

    const tagIndex = updatedClient.tags.indexOf(tag);
    if (tagIndex === -1) {
      updatedClient.tags.push(tag);
    } else {
      updatedClient.tags.splice(tagIndex, 1);
    }

    if (editingClient) {
      setEditingClient(updatedClient);
    } else {
      setNewClient(updatedClient);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTags.length === 0 ||
        (client.tags && client.tags.some((tag) => selectedTags.includes(tag))))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600">
            Administra los datos de tus clientes de forma eficiente
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                {showAnalytics ? "Ocultar Análisis" : "Mostrar Análisis"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
              >
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar Excel
              </Button>
              <Button
                variant="outline"
                onClick={handleExportToExcel}
                disabled={clients.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg mx-auto overflow-y-auto max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                    <DialogDescription>
                      Ingresa los datos del nuevo cliente
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          className="w-full"
                          value={newClient.firstName}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          className="w-full"
                          value={newClient.lastName}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          className="w-full"
                          type="email"
                          value={newClient.email}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Celular</Label>
                        <Input
                          id="phone"
                          className="w-full"
                          value={newClient.phone}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          className="w-full"
                          value={newClient.company}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              company: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Direccion</Label>
                        <Input
                          id="address"
                          className="w-full"
                          value={newClient.address}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="province">Provincia</Label>
                        <Input
                          id="province"
                          className="w-full"
                          value={newClient.province}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              province: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="taxId">CUIL</Label>
                        <Input
                          id="taxId"
                          className="w-full"
                          value={newClient.taxId}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              taxId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                          id="dni"
                          className="w-full"
                          value={newClient.dni}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              dni: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">ubicación</Label>
                        <Input
                          id="location"
                          className="w-full"
                          value={newClient.location}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_TAGS.map((tag) => (
                            <Button
                              key={tag}
                              variant="outline"
                              size="sm"
                              className={cn(
                                "rounded-full",
                                newClient.tags?.includes(tag) &&
                                  "bg-blue-100 text-blue-800"
                              )}
                              onClick={() =>
                                setNewClient((prev) => ({
                                  ...prev,
                                  tags: prev.tags.includes(tag)
                                    ? prev.tags.filter((t) => t !== tag)
                                    : [...prev.tags, tag],
                                }))
                              }
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddClient}>Guardar Cliente</Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-6">
            <Label className="mb-2 block">Filtrar por etiquetas</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-full",
                    selectedTags.includes(tag) && "bg-blue-100 text-blue-800"
                  )}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {showAnalytics && clients.length > 0 && (
            <div className="mb-8">
              <ClientAnalytics clients={clients} />
            </div>
          )}

          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={setEditingClient}
                onDelete={handleDeleteClient}
                onAddNote={setSelectedClientForNote}
                selectedTags={selectedTags}
                showDetails={showDetails}
              />
            ))}
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron clientes
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedClientForNote}
        onOpenChange={() => setSelectedClientForNote(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nota</DialogTitle>
            <DialogDescription>
              Agregar nota para {selectedClientForNote?.firstName}{" "}
              {selectedClientForNote?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note">Nota</Label>
              <Input
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe tu nota aquí..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedClientForNote(null)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddNote}>Guardar Nota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingClient}
        onOpenChange={() => setEditingClient(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica los datos del cliente
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    value={editingClient.name}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingClient.email}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={editingClient.phone}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-company">Empresa</Label>
                  <Input
                    id="edit-company"
                    value={editingClient.company}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dni">DNI</Label>
                  <Input
                    id="edit-dni"
                    type="text"
                    value={editingClient.dni}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        dni: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Ubicación</Label>
                  <Input
                    id="edit-location"
                    type="text"
                    value={editingClient.location}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Etiquetas</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full",
                          editingClient.tags?.includes(tag) &&
                            "bg-blue-100 text-blue-800"
                        )}
                        onClick={() => toggleTag(tag, editingClient)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEditClient}>Guardar Cambios</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
// Export the App component as default
// This allows the component to be imported and used in other files
// without needing to specify the name of the component

export default App;
