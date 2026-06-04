<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php"; // api klasörünün içindeki connect.php'yi kullanır

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["ders_adi"]) && !empty($data["ogretmen_id"])) {
    try {
        $sql = "INSERT INTO dersler (ders_adi, ogretmen_id) VALUES (:ad, :ogrt_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":ad"      => $data["ders_adi"],
            ":ogrt_id" => $data["ogretmen_id"]
        ]);

        echo json_encode(["status" => 201, "message" => "Ders başarıyla kaydedildi!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => "Veritabanı hatası: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 400, "message" => "Lütfen tüm alanları doldurun!"]);
}
?>