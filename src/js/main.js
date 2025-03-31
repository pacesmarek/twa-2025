// Importuje Alpine.js, minimalistický JavaScriptový framework pro deklarativní práci s UI
import Alpine from "alpinejs";

// Připojí Alpine.js k objektu `window`, aby byl globálně dostupný
window.Alpine = Alpine;

// Poslouchá událost inicializace Alpine.js
document.addEventListener("alpine:init", () => {
	// Definuje novou Alpine.js datovou komponentu s názvem "ticketApp"
	Alpine.data("ticketApp", () => ({
		showForm: false,
		tickets: [], // Pole pro ukládání dat o tiketech
		newTitle: "", // Ukládá nový název tiketu z inputu
		newDescription: "", // Ukládá nový popis tiketu z inputu
		errorMessage: "", // Ukládá chybové zprávy pro zpětnou vazbu v UI

		/**
		 * Lifecycle hook: Spustí se při inicializaci komponenty
		 */
		init() {
			this.loadTickets(); // Načte existující tikety z JSON souboru
		},

		/**
		 * Načítá data o tiketech z `tickets.json` a aktualizuje pole `tickets`
		 */
		loadTickets() {
			fetch("/src/tickets.json") // Načte data o tiketech z lokálního JSON souboru
				.then((response) => response.json()) // Převádí odpověď na JSON
				.then((data) => (this.tickets = data)); // Ukládá data o tiketech do stavu komponenty
		},

		/**
		 * Odesílá požadavek na přidání nového tiketu
		 * Požadavek je odeslán na `index.php` metodou POST
		 */
		addTicket() {
			fetch("/index.php", {
				method: "POST", // Odesílá data jako POST požadavek
				headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Nejběžnější způsob, jakým HTML formuláře posílají data na server
				body: new URLSearchParams({ // URLSearchParams je třída v JavaScriptu, která umožňuje snadnou práci s parametry v URL (např. ?id=123&name=John)
					action: "add", // Specifikuje akci na serveru
					title: this.newTitle, // Odesílá název tiketu
					description: this.newDescription, // Odesílá popis tiketu
				}),
			})
			.then((response) => {
				if (response.status === 403) {
					// Kontroluje, zda uživatel není autorizován
					this.errorMessage = "Pro přidání tiketů se musíte přihlásit."; // Zobrazuje chybovou zprávu
					return;
				}
				return response.json(); // Převádí odpověď na JSON
			})
			.then((data) => {
				if (data) {
					this.tickets = data; // Aktualizuje seznam tiketů s novými daty
					this.newTitle = ""; // Vymaže inputy po úspěšném přidání
					this.newDescription = "";
				}
			});
		},

		/**
		 * Odesílá požadavek na smazání tiketu podle ID
		 * Požadavek je odeslán na `index.php` s akcí `delete`
		 */
		removeTicket(id) {
			fetch("/index.php", {
				method: "POST", // Odesílá POST požadavek
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					action: "delete", // Specifikuje akci smazání
					id: id, // Odesílá ID tiketu, který má být smazán
				}),
			})
			.then((response) => response.json()) // Převádí odpověď na JSON
			.then((data) => (this.tickets = data)); // Aktualizuje seznam tiketů po smazání
		},
	}));
});

// Spustí Alpine.js pro inicializaci komponent
Alpine.start();
