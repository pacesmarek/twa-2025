	<?php
	session_start();
	$dataFile = __DIR__ . '/src/php/tickets.json';

	// Read existing tickets
	$tickets = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

	if (!is_array($tickets)) {
			$tickets = [];
	}

	// Handle AJAX Requests
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
					http_response_code(403);
					echo json_encode(["error" => "Unauthorized"]);
					exit;
			}

			$action = isset($_POST['action']) ? $_POST['action'] : '';

			if ($action === 'add') {
					$newTicket = [
							'id' => time(),
							'title' => $_POST['title'] ?? 'Untitled',
							'description' => $_POST['description'] ?? ''
					];
					$tickets[] = $newTicket;
			} elseif ($action === 'delete') {
					$ticketId = intval($_POST['id']);
					$tickets = array_filter($tickets, function ($ticket) use ($ticketId) {
							return $ticket['id'] !== $ticketId;
					});
					$tickets = array_values($tickets);
			}

			file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));

			header('Content-Type: application/json');
			echo json_encode($tickets);
			exit;
	}
	?>

	<!DOCTYPE html>
	<html lang="en">

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Ticket System</title>
		<link rel="stylesheet" href="/dist/style.css">
		<script type="module" src="/dist/main.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
	</head>

	<body>
		<div class="container" x-data="ticketApp">
			<h1>Ticket System</h1>

			<!-- Show login/logout -->
			<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
			<p>Welcome, Admin! <a href="login.php?logout=true">Logout</a></p>
			<?php else: ?>
			<p><a href="login.php">Login</a> to manage tickets.</p>
			<?php endif; ?>

			<!-- Show Add Ticket Form Only if Logged In -->
			<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
			<form @submit.prevent="addTicket">
				<input type="text" x-model="newTitle" placeholder="Title" required>
				<input type="text" x-model="newDescription" placeholder="Description" required>
				<button type="submit">Add Ticket</button>
			</form>
			<?php endif; ?>

			<!-- Ticket List -->
			<ul>
				<template x-for="ticket in tickets" :key="ticket.id">
					<li>
						<div>
							<strong x-text="ticket.title"></strong>
							<p x-text="ticket.description"></p>
						</div>
						<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
							<button @click="removeTicket(ticket.id)">Delete</button>
						<?php endif; ?>
					</li>
				</template>
			</ul>
		</div>
	</body>

	</html>