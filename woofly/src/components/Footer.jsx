/* Mobile optimizations for Footer */
@media (max-width: 640px) {
  /* Smooth scrolling for the page */
  html {
    scroll-padding-bottom: 4rem; /* Height of mobile navigation */
  }
  
  /* Better tap targets for mobile navigation */
  .Footer nav a {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Active state feedback */
  .Footer nav a:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
  
  /* Prevent text selection on navigation items */
  .Footer nav span {
    user-select: none;
  }
  
  /* Adjust for very small screens */
  @media (max-width: 360px) {
    .Footer nav {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }
    
    .Footer nav a {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }
    
    .Footer nav span {
      font-size: 0.7rem;
    }
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .Footer nav {
    background-color: var(--color-card);
    border-color: var(--color-border);
  }
}

/* Accessibility improvements */
.Footer nav a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Smooth transitions for interactive elements */
.Footer nav a {
  transition: all 0.2s ease;
}
