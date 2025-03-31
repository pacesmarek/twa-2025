<?php
	session_start();

	$dataFile = __DIR__ . '/src/tickets.json';

	$tickets = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

	if (!is_array($tickets)) {
		$tickets = [];
	}

	// TODO (Add, Delete)
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
			http_response_code(403);
			echo json_encode(['error' => 'You are not authorized to add tickets.']);
			exit;
		}

		$action = isset($_POST['action']) ? $_POST['action'] : '';

		if ($action === 'add') {
			$newTicket = [
				'id' => time(),
				'title' => $_POST['title'] ?? 'Bez názvu',
				'description' =>  $_POST['description'] ?? 'Bez popisku',
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
	<link rel="stylesheet" href="dist/style.css">
	<title>Homepage</title>
</head>

<body>
	<div class="container" x-data="tiketApp">
		<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] ): ?>
			<img src="https://avatar.iran.liara.run/public/boy" alt="Admin" width="30" height="30">
			<p>Welcome, Admin! <a href="login.php?logout=true">Logout</a></p>
			<button x-show="!showForm" @click="showForm = true" class="btn btn--primary">Add new ticket</button>
		<?php else: ?>
			<a href="login.php">Login</a> to manage tickets.
		<?php endif; ?>


		<form @submit.prevent="addTicket" x-show="showForm">
			<div>
				<div>
					<label for="title">Title</label>
					<input type="text" id="title" x-model="newTitle" required>
				</div>
				<div>
					<label for="description">Description</label>
					<textarea id="description" x-model="newDescription" required></textarea>
				</div>
			</div>
			<button type="submit">Add Ticket</button>
		</form>

		<ul class="tickets">
			<template x-for="ticket in tickets" :key="ticket.id">
				<li class="tickets__item">
					<div>
						<strong x-text="ticket.title"></strong>
						<p x-text="ticket.description"></p>
					</div>
					<button @click="removeTicket(ticket.id)" class="btn">Delete</button>
				</li>
			</template>
		</ul>

	</div>

	<script type="module" src="dist/main.js"></script>
</body>

</html>
