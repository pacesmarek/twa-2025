<?php
// Spuštění session kvůli ověření přihlášení uživatele
session_start();

// Ověření, zda je uživatel přihlášen – jinak přístup zamítnut
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
	die("Unauthorized access.");
}

// Cesta k JSON souboru s tickety
$dataFile = __DIR__ . '/src/tickets.json';

// Načtení existujících ticketů z JSON souboru (nebo prázdné pole, pokud soubor neexistuje)
$tickets = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

// Získání ID ticketu z URL (GET parametr)
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$ticket = null;

// Vyhledání konkrétního ticketu podle ID
foreach ($tickets as $t) {
	if ((int)$t['id'] === $id) {
		$ticket = $t;
		break;
	}
}

// Pokud ticket nenalezen, zobrazí chybovou hlášku a ukončí skript
if (!$ticket) {
	die("Ticket not found.");
}

// Zpracování POST požadavku při odeslání formuláře
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// Načtení nových dat z formuláře
	$newTitle = $_POST['title'] ?? '';
	$newDescription = $_POST['description'] ?? '';

	// Aktualizace příslušného ticketu v poli
	foreach ($tickets as &$t) {
		if ((int)$t['id'] === $id) {
			$t['title'] = $newTitle;
			$t['description'] = $newDescription;
			break;
		}
	}

	// Uložení změn zpět do JSON souboru
	file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));

	header("Location: index.php");
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
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-4">
				<!-- HTML část: Formulář pro editaci ticketu -->
				<h1>Edit Ticket #<?= htmlspecialchars($ticket['id']) ?></h1>

				<form method="POST">
					<input class="mb-3" type="text" name="title" value="<?= htmlspecialchars($ticket['title']) ?>" required>
					<textarea class="mb-3" name="description" rows="6" cols="50" required><?= htmlspecialchars($ticket['description']) ?></textarea>
					<button class="btn btn--primary mt-3" type="submit">Save Changes</button>
				</form>
			</div>
		</div>
	</div>
</body>
