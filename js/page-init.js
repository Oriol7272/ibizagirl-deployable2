// Page Init - Fixed
window.PageInit = {
    ready: false,
    init: function() {
        console.log("Page initializing...");
        this.ready = true;
    }
};

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.PageInit.init();
});
