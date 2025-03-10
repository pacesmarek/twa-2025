<?php
		session_start();
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
	<?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] ): ?>
	<p>Welcome, Admin! <a href="login.php?logout=true">Logout</a></p>
	<?php else: ?>
	<a href="login.php">Login</a> to manage tickets.
	<?php endif; ?>
</body>

</html>
