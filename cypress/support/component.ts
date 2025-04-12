// Import commands.js using ES2015 syntax:
import './commands'

// Import global styles
import '../../src/styles/globals.css'

// Augment the Cypress namespace to include custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here
    }
  }
} 