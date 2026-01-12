<?php
	session_start();
	header('Content-Type: application/json');

	date_default_timezone_set('Europe/Prague');

	$dataFile = __DIR__ . '/../src/tickets.json';
	$tickets = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

	if (!is_array($tickets)){
		$tickets = [];
	}

	// Handle GET request - return tickets
	if ($_SERVER['REQUEST_METHOD'] === 'GET'){
		echo json_encode($tickets);
		exit;
	}

	// Handle POST requests
	if ($_SERVER['REQUEST_METHOD'] === 'POST'){
		if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']){
			http_response_code(403);
			echo json_encode(["error" => "Neautorizováno"]);
			exit;
		}

		$action = isset($_POST['action']) ? $_POST['action'] : '';

		if ($action === 'add'){
			$newTicket = [
				'id' => time(),
				'title' => $_POST['title'] ?? 'Bez názvu',
				'description' => $_POST['description'] ?? '',
				'created' => date('Y-m-d H:i:s'),
				'lastModified' => date('Y-m-d H:i:s')
			];
			$tickets[] = $newTicket;
		} elseif ($action === 'delete'){
			$ticketId = intval($_POST['id']);
			$tickets = array_filter($tickets, function ($ticket) use ($ticketId){
				return $ticket['id'] !== $ticketId;
			});
			$tickets = array_values($tickets);
		}

		file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
		echo json_encode($tickets);
		exit;
	}
?>
