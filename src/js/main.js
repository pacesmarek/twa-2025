import Alpine from 'alpinejs';

window.Alpine = Alpine;

document.addEventListener("alpine:init", () => {
    Alpine.data('tiketApp', () => ({
        tickets: [],
        newTitle: '',
        newDescription: '',
        errorMessage: '',

        init() {
            this.loadTickets();
        },

        loadTickets() {
            fetch('/src/tickets.json')
            .then(response => response.json())
            .then((data) => (this.tickets = data));
        }
    }));
});

Alpine.start();
