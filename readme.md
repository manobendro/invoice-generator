# Invoice Generator

A modern, professional invoice generator built with React, Vite, Tailwind CSS, and jsPDF. Create beautiful, customizable invoices in seconds without any authentication requirements.

![Invoice Generator](https://github.com/user-attachments/assets/c083493d-7e9a-433f-a841-0245695b373e)

## Features

### 🎨 Multiple Professional Templates
- **Modern Template** - Clean design with gradient headers
- **Classic Template** - Traditional professional layout
- **Minimal Template** - Simple, elegant design

### 📋 Comprehensive Invoice Fields
- **Company Information**: Logo upload, name, address, phone, email, website
- **Invoice Details**: Invoice number, date, due date, currency selection
- **Bill To**: Client name, address, email, phone
- **Line Items**: Dynamic items with description, quantity, rate, and auto-calculated amounts
- **Totals**: Subtotal, discount, shipping (with details), tax, and total
- **Additional Info**: Terms & conditions, payment instructions, notes, footer message

### 💡 Smart Features
- **Live Preview**: See your invoice update in real-time as you type
- **Dynamic Line Items**: Add/remove items on the fly
- **Auto Calculations**: Automatic subtotal and total calculations
- **Multi-Currency Support**: USD, EUR, GBP, INR, JPY, CAD, AUD
- **PDF Export**: High-quality PDF generation with your selected template
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Logo Upload**: Add your company logo to invoices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **PDF Generation**: jsPDF + html2canvas
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manobendro/invoice-generator.git
cd invoice-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Usage

1. **Select a Template**: Choose from Modern, Classic, or Minimal templates
2. **Fill Company Information**: Add your company details and logo
3. **Enter Invoice Details**: Invoice number, dates, and currency
4. **Add Client Information**: Enter your client's details
5. **Add Line Items**: Add products/services with quantities and rates
6. **Adjust Totals**: Set discount, shipping, and tax amounts
7. **Add Additional Information**: Include payment instructions, terms, notes
8. **Preview**: See your invoice in real-time
9. **Generate PDF**: Click "Generate PDF" to download

## Template Previews

### Modern Template
![Modern Template](https://github.com/user-attachments/assets/bb086411-623f-4bf0-9141-d8be067b668f)

### Classic Template
![Classic Template](https://github.com/user-attachments/assets/53bf74e8-eb4a-4ee5-80f6-c1ee1bd49b8b)

### Minimal Template
![Minimal Template](https://github.com/user-attachments/assets/80b716e8-8fde-4da8-94ee-1155148444d7)

## Deployment

### GitHub Pages
The project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Enable GitHub Pages in your repository settings
2. Set the source to "GitHub Actions"
3. Push to the `main` branch to trigger deployment

### Netlify or Vercel
Simply connect your repository and these platforms will automatically detect the Vite configuration.

## Project Structure

```
invoice-generator/
├── src/
│   ├── components/          # React components
│   │   ├── InvoiceForm.tsx
│   │   └── InvoicePreview.tsx
│   ├── templates/           # Invoice templates
│   │   ├── ModernTemplate.tsx
│   │   ├── ClassicTemplate.tsx
│   │   └── MinimalTemplate.tsx
│   ├── types/               # TypeScript types
│   │   └── invoice.ts
│   ├── utils/               # Utility functions
│   │   ├── currency.ts
│   │   └── pdfGenerator.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
└── dist/                    # Production build (generated)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
