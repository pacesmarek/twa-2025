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
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>

    <?php if (isset($error)): ?>
        <p style="color: red;"><?php echo $error; ?></p>
    <?php endif; ?>

    <form method="POST">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
</body>
</html>