<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php";

try {
    $sql = "SELECT * FROM siniflar ORDER BY sinif_id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => 200, "data" => $classes]);
} catch (PDOException $e) {
    echo json_encode(["status" => 500, "message" => $e->getMessage()]);
}
?>