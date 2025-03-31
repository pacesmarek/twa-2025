import Alpine from 'alpinejs';

window.Alpine = Alpine;

document.addEventListener("alpine:init", () => {
	Alpine.data('tiketApp', () => ({
		showForm: false,
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
		},
	
		addTicket() {
			fetch('/index.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					action: 'add',
					title: this.newTitle,
					description: this.newDescription
				}),
			})
			.then((response) => {
				if (response.status === 403) {
					this.errorMessage = 'You are not authorized to add tickets.';
					return;
				}
				return response.json();
			})
			.then((data) => {
				if (data) {
					this.tickets = data;
					this.newTitle = '';
					this.newDescription = '';
				}
			});
		},
        removeTicket(id) {
            fetch("/index.php", {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
					action: 'delete',
					id: id,
				}),
            })
            .then((response) => response.json())
            .then((data) => (this.tickets = data));
        }
	}));
});

Alpine.start();
