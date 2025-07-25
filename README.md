# Demo XLSX Export

A React + TypeScript application for configuring, estimating, and exporting team sprint data to Excel (XLSX) format. Built with Vite, Handsontable, React Hook Form, and Zod for schema validation.

## Features

- **Step-by-step Workflow**:  
  1. **Configuration**: Set up the number of months and sprints per month for your project.
  2. **Team Estimation**: Add, edit, and manage team positions, responsibilities, man-months, and sprint process assignments.
  3. **Preview & Export**: Visualize the estimation in a spreadsheet-like table and export the data to an Excel file.

- **Modern UI**:  
  Uses Shadcn UI, Tailwind CSS, and Handsontable for a responsive, interactive experience.

- **Type-safe Forms**:  
  All forms are validated with Zod and managed with React Hook Form.

- **Context-based State Management**:  
  Uses React Context to manage and share configuration and estimation state across steps.

- **Excel Export**:  
  Generates a styled XLSX file using `xlsx-js-style` and allows users to download it.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
# or
yarn build
```

### Lint

```bash
npm run lint
# or
yarn lint
```

## Project Structure

- `src/App.tsx` - Main app with step navigation and context providers.
- `src/feature/xlsx-preview/component/ConfigurationForm.tsx` - Project configuration step.
- `src/feature/xlsx-preview/component/TeamEstimationForm.tsx` - Team estimation step.
- `src/feature/xlsx-preview/component/PreviewTable.tsx` - Preview and export step.
- `src/feature/xlsx-preview/context/XlsxSettingsContext.tsx` - State and dispatch context for settings.
- `src/feature/xlsx-preview/schema/configXlxsDownloadSchema.tsx` - Zod schemas and types.
- `src/feature/xlsx-preview/utils/transformJsonDataToAoaXlxsData.ts` - Utility for transforming data for Excel export.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Handsontable](https://handsontable.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://www.ui.shadcn.com/)
- [xlsx-js-style](https://github.com/Siemienik/XToolSet/tree/main/packages/xlsx-js-style)

## License

This project is for demonstration purposes. See [LICENSE](LICENSE) if present.
