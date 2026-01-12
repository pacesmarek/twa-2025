<?php
	session_start();

	$validUser = "admin";
	$validPass = "admin";

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$username = $_POST["username"] ?? '';
		$password = $_POST["password"] ?? '';

		if ($username === $validUser && $password === $validPass) {
			$_SESSION['logged_in'] = true;
			header("Location: index.php");
			exit;
		} else {
			$error = "Invalid username or password.";
		}
	}

	// Logout functionality
	if (isset($_GET['logout'])) {
		session_destroy();
		header("Location: login.php");
		exit;
	}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="dist/style.css">
	<title>Login</title>
</head>

<body>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-12 col-md-6">
				<h2>Login</h2>

				<?php if (isset($error)): ?>
				<p style="color: red;"><?php echo $error; ?></p>
				<?php endif; ?>

				<div class="card card--bordered">
					<form method="POST">
						<label for="username">Username</label>
						<input class="mb-3" type="text" id="username" name="username" required>

						<label for="password">Password</label>
						<input class="mb-3" type="password" id="password" name="password" required>

						<button class="btn btn--primary" type="submit">Login</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</body>

</html>
