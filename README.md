# Todo Dashboard 📝

A modern, feature-rich todo list web application with beautiful charts and analytics. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Modern UI Design**: Clean interface with warm purple and orange color scheme
- **Dark Mode Toggle**: Seamless switching between light and dark themes
- **Task Priority System**: Organize tasks by Low, Medium, and High priority
- **Category Support**: Group tasks with custom categories
- **Activity Heatmap**: GitHub-style heatmap showing daily task completion
- **Analytics Charts**: 
  - Priority distribution (doughnut chart)
  - 7-day completion trend (bar chart)
- **Statistics Dashboard**: Track total, completed, pending tasks, and streak
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Local Storage**: Your data persists between sessions

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## 🎯 Usage

1. **Add Tasks**: Use the input field to create new tasks with priority levels
2. **Manage Tasks**: Check off completed tasks, edit text, or delete items
3. **Filter Tasks**: Use the dropdown filters to view specific task types
4. **Track Progress**: Monitor your productivity with the charts and heatmap
5. **Dark Mode**: Toggle between light and dark themes using the button in the header

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Storage**: Browser LocalStorage

## 📊 Analytics Features

### Activity Heatmap
- GitHub-style contribution graph
- Shows daily task completion over the past year
- Color intensity indicates task completion frequency

### Priority Distribution Chart
- Doughnut chart showing task breakdown by priority
- Visual representation of workload distribution

### Completion Trend
- 7-day bar chart tracking daily completions
- Helps identify productive patterns

### Statistics Cards
- Total tasks created
- Completed vs pending tasks
- Current completion streak
- Today's completed tasks

## 🎨 Design Features

- **Color Scheme**: Warm purples and oranges with clean whites
- **Animations**: Smooth transitions and hover effects
- **Glass Morphism**: Modern backdrop blur effects
- **Gradient Buttons**: Eye-catching call-to-action elements
- **Responsive Grid**: Adapts to any screen size

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with dark mode toggle
│   ├── StatsCards.tsx  # Statistics overview cards
│   ├── TodoInput.tsx   # Task input form
│   ├── TodoList.tsx    # Task list with filters
│   ├── Charts.tsx      # Analytics charts
│   └── Heatmap.tsx     # Activity heatmap
├── hooks/              # Custom React hooks
│   └── useTodos.ts     # Todo state management
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 📱 Mobile Support

The app is fully responsive and provides an excellent experience on:
- Desktop computers
- Tablets
- Mobile phones

## 🌙 Dark Mode

Toggle between light and dark themes with a single click. The app remembers your preference and applies it automatically on future visits.

## 💾 Data Persistence

All your tasks and settings are saved in your browser's local storage, so you won't lose your data when you close the browser.

## 🤝 Contributing

Feel free to submit issues and feature requests!

## 📄 License

This project is open source and available under the MIT License.

---

Made with ❤️ for productivity enthusiasts
