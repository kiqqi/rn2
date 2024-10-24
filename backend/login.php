<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";  
$username = "root";         
$password = "";            
$dbname = "mi_base_de_datos";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array("message" => "Error en la conexión con la base de datos")));
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user) && isset($data->email) && isset($data->password)) {
    $user = $conn->real_escape_string($data->user);
    $email = $conn->real_escape_string($data->email);
    $password = $conn->real_escape_string($data->password);

    $sql = "SELECT * FROM usuarios WHERE user='$user' AND email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            echo json_encode(array("message" => "Login exitoso"));
        } else {
            echo json_encode(array("message" => "Contraseña incorrecta"));
        }
    } else {
        echo json_encode(array("message" => "Usuario o email incorrectos"));
    }
} else {
    echo json_encode(array("message" => "Todos los campos son obligatorios"));
}

$conn->close();
?>