<?php
session_start();

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    die("You are not authorized to view this page.");
}

$dataFile = __DIR__ . '/src/tickets.json';

$tickets = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

// Získat ID ticketu z URL (GET parametr)
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// var_dump($id);

$ticket = null;

// Nalezne ticket podle ID
foreach ($tickets as $t) {
    if ((int)$t['id'] === $id) {
        $ticket = $t;
        break;
    }
}

// var_dump($ticket);
// echo json_encode($ticket, JSON_PRETTY_PRINT);

// TODO Odeslání formuláře s novými hodnotami (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newTitle = $_POST['title'] ?? '';
    $newDescription = $_POST['description'] ?? '';

    foreach ($tickets as &$t) {
        if ((int)$t['id'] === $id) {
            $t['title'] = $newTitle;
            $t['description'] = $newDescription;
            break;
        }
    }

	file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));

    header('Location: index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="dist/style.css">
    <title>Edit Ticket</title>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-sm-6">
                <h1>Edit Ticket #<?= $ticket['id'] ?></h1>

                <form method="POST">
                    <input type="text" name="title" value="<?= $ticket['title'] ?>" required>
                    <textarea name="description" required><?= $ticket['description'] ?></textarea>
                    <button type="submit" class="btn btn--primary">Save</button>
                </form>
            </div>
        </div>
    </div>
    
</body>
</html>