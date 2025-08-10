function id(arg){
    return document.getElementById(arg);
}

// To set local storage:
// To load local storage:
var canStorage = supports_html5_storage();
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}