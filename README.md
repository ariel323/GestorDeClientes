# Gestor de Clientes

A modern client management system built with React and Tailwind CSS that helps you manage your clients efficiently.

## Features

- 👥 Client Management
  - Add, edit, and delete clients
  - Store comprehensive client information
  - Tag-based organization
  - Note-taking functionality

- 📊 Analytics Dashboard
  - Visual representation of client data
  - Tag distribution analysis
  - Client activity metrics

- 🔍 Advanced Search & Filtering
  - Search by name, email, or company
  - Filter by tags
  - Dynamic result updates

- 📁 Data Import/Export
  - Excel file import support
  - Excel export functionality
  - Data persistence with localStorage

## Tech Stack

- **Frontend Framework:** React
- **Styling:** Tailwind CSS + Shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Excel Handling:** XLSX.js
- **Date Handling:** date-fns

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd gestor-de-cliente
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Adding a New Client
1. Click on "Agregar Cliente"
2. Fill in the required information
3. Add relevant tags
4. Click "Guardar Cliente"

### Managing Clients
- Use the search bar to find specific clients
- Filter clients by tags
- Add notes to keep track of interactions
- Edit or delete clients as needed

### Data Import/Export
- Use the "Importar Excel" button to import client data
- Use the "Exportar Excel" button to download client data

## Project Structure

```
src/
  ├── components/
  │   ├── ClientCard.jsx
  │   ├── ClientAnalytics.jsx
  │   └── ui/
  ├── lib/
  │   └── utils.js
  └── App.jsx
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Shadcn/ui for the beautiful UI components
- Tailwind CSS for the utility-first CSS framework
- React community for the amazing ecosystem
