// lighthouserc.js — Lighthouse CI configuration
// Enforces performance, accessibility, and best-practice scores

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 2,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance
        'categories:performance': ['warn', { minScore: 0.85 }],
        // Accessibility — strict
        'categories:accessibility': ['error', { minScore: 0.90 }],
        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        // SEO
        'categories:seo': ['warn', { minScore: 0.80 }],
        // Specific audits
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],
        'uses-responsive-images': 'off',
        'uses-optimized-images': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
