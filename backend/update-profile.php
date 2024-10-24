<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "myloginapp";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$profile_image = null;

if (isset($_FILES['profile_image'])) {
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["profile_image"]["name"]);
    if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $target_file)) {
        $profile_image = $target_file;
    }
}

$sql = "UPDATE users SET name='$name', phone='$phone', address='$address', profile_image='$profile_image' WHERE email='$email'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating profile']);
}

$conn->close();
?>
