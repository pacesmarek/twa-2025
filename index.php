<?php
	// Spusťte novou relaci nebo obnovte existující relaci
	session_start();

	// Definujte cestu k souboru JSON s tikety
	$dataFile = __DIR__ . '/src/tickets.json';

	// Načtěte existující tikety ze souboru JSON (pokud existuje), jinak inicializujte prázdné pole
	$tickets = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

	// Zajistěte, aby $tickets bylo vždy pole, abyste předešli chybám
	if (!is_array($tickets)){
		$tickets = [];
	}

	// Zpracování AJAX požadavků odeslaných metodou POST
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){

		// Zkontrolujte, zda je uživatel přihlášen (jednoduchá kontrola autentizace)
		if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']){
			http_response_code(403);

			// Vraťte "403 Zakázáno", pokud uživatel není přihlášen
			echo json_encode(["error" => "Neautorizováno"]);
			exit;
			// Zastavte další provádění
		}

		// Získejte požadovanou akci z požadavku POST
		$action = isset($_POST['action']) ? $_POST['action'] : '';

		// Zpracování přidání nového tiketu
		if ($action === 'add'){
			// Vytvořte nové pole tiketu
			$newTicket = [
				'id' => time(), // Použijte aktuální časové razítko jako jedinečné ID
				'title' => $_POST['title'] ?? 'Bez názvu', // Získejte název z formuláře, výchozí hodnota je 'Bez názvu'
				'description' => $_POST['description'] ?? '' // Získejte popis, výchozí hodnota je prázdná
			];
			$tickets[] = $newTicket;
			// Přidejte nový tiket do pole
		} elseif ($action === 'delete'){
			// Zpracování odstranění tiketu
			$ticketId = intval($_POST['id']);
			// Získejte ID tiketu z požadavku

			// Filtrování pole tiketu a odstranění tiketu s odpovídajícím ID
			$tickets = array_filter($tickets, function ($ticket) use ($ticketId){
				return $ticket['id'] !== $ticketId;
			});

			// Převzorkování pole po odstranění
			$tickets = array_values($tickets);
		}

		// Uložte aktualizovaný seznam tiketů zpět do souboru JSON
		file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));

		// Nastavte typ odpovědi na JSON a vraťte aktualizovaný seznam tiketů
		header('Content-Type: application/json');
		echo json_encode($tickets);
		exit;
		// Zastavte další provádění
	}

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="dist/style.css">
	<title>Homepage</title>
</head>

<body>
	<div class="container" x-data="ticketApp">
		<div class="row justify-content-center">
			<div class="col-md-4">
				<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] ): ?>
					<div class="d-flex align-items-center">
						<img src="https://avatar.iran.liara.run/public/boy" alt="Admin" width="30" height="30" class="mr-3">
						<p>Welcome, Admin! <a href="login.php?logout=true">Logout</a></p>
					</div>
				<?php else: ?>
					<a href="login.php">Login</a> to manage tickets.
				<?php endif; ?>

				<!-- Add Ticket Form -->
				<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
					<button x-show="!showForm" @click="showForm = true" class="btn btn--primary w-100 mt-3 mb-5">Add new ticket</button>

					<!--
						@submit: naslouchá události submit formuláře.
						.prevent: volá event.preventDefault(), takže nezpůsobí reload stránky.
						"addTicket": volá metodu addTicket definovanou v x-data.
					-->
					<form @submit.prevent="addTicket" class="addTicketForm" x-show="showForm">
						<div>
							<div class="mb-3">
								<label for="title">Title</label>
								<input type="text" id="title" x-model="newTitle" required>
							</div>
							<div>
								<label for="description">Description</label>
								<textarea id="description" x-model="newDescription" required></textarea>
							</div>
						</div>
						<button class="btn btn--primary" type="submit">Add Ticket</button>
					</form>
				<?php endif; ?>

				<!-- Ticket List -->
				<ul class="tickets">
					<template x-for="ticket in tickets" :key="ticket.id">
						<li class="tickets__item">
							<div>
								<div x-text="'#' + ticket.id"></div>
								<strong x-text="ticket.title"></strong>
								<p x-text="ticket.description"></p>
							</div>
							<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
								<a :href="'edit_ticket.php?id=' + ticket.id" class="btn btn--dark">Edit</a>
								<button @click="removeTicket(ticket.id)" class="btn btn--danger">Delete</button>
							<?php endif; ?>
						</li>
					</template>
				</ul>
			</div>
		</div>
	</div>
</div>

<script type="module" src="dist/main.js"></script>
</body>
</html>
