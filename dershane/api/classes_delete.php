<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["sinif_id"])) {
    try {
        $sql = "DELETE FROM siniflar WHERE sinif_id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([":id" => $data["sinif_id"]]);

        echo json_encode(["status" => 200, "message" => "Sınıf silindi."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => $e->getMessage()]);
    }
}
?>