// BeachGirl.pics - Utilities and Helper Functions
// Common utilities for content management
const beachGirlUtils = {
    formatPrice: (price) => `€${price.toFixed(2)}`,
    isNew: () => Math.random() > 0.7,
    generateId: () => Math.random().toString(36).substr(2, 9)
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { beachGirlUtils };
}