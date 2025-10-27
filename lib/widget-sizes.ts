// Widget type to default size mapping based on content requirements
export const WIDGET_DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  // Chart widgets - need space for graphs
  analytics: { width: 480, height: 360 },
  trending: { width: 480, height: 360 },
  performance: { width: 480, height: 360 },
  revenue: { width: 480, height: 380 },
  
  // Square chart widgets
  distribution: { width: 400, height: 400 },
  
  // Calendar - needs space for grid
  calendar: { width: 420, height: 380 },
  
  // Grid layout widgets
  users: { width: 360, height: 320 },
  health: { width: 360, height: 320 },
  
  // List widgets - tall and narrow for lists
  messages: { width: 360, height: 300 },
  email: { width: 360, height: 300 },
  tasks: { width: 360, height: 280 },
  notifications: { width: 360, height: 240 },
  documents: { width: 360, height: 280 },
  favorites: { width: 360, height: 240 },
  ideas: { width: 360, height: 280 },
  
  // Projects - needs space for progress bars
  projects: { width: 380, height: 320 },
  
  // Compact widgets
  timer: { width: 320, height: 260 },
  settings: { width: 340, height: 260 },
  goals: { width: 400, height: 280 },
  
  // Music
  playlist: { width: 360, height: 280 },
};

export const DEFAULT_SIZE = { width: 350, height: 300 };

