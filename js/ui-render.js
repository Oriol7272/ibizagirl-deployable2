// UI Render - Fixed
window.UIRender = {
    init: function() {
        console.log("UI Render initialized");
    },
    render: function(element, content) {
        if (element && content) {
            element.innerHTML = content;
        }
    }
};
