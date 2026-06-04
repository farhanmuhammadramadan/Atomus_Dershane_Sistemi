<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php"; // Veritabanı bağlantısı

// Gelen JSON verisini al
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['ders_id'])) {
    try {
        $sql = "DELETE FROM dersler WHERE ders_id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $data['ders_id'], PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => 200, "message" => "Ders başarıyla silindi."]);
        } else {
            echo json_encode(["status" => 404, "message" => "Ders bulunamadı veya zaten silinmiş."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => "Veritabanı hatası: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 400, "message" => "Geçersiz ID."]);
}
?>