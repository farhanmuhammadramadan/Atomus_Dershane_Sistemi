<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

// Gerekli veriler var mı kontrol et
if (!empty($data["ogretmen_id"])) {
    try {
        $sql = "UPDATE ogretmenler 
                SET ad = :ad, 
                    soyad = :soyad, 
                    brans_id = :brans, 
                    telefon = :tel 
                WHERE ogretmen_id = :id";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            ":ad"    => $data["ad"],
            ":soyad" => $data["soyad"],
            ":brans" => $data["brans_id"],
            ":tel"   => $data["telefon"],
            ":id"    => $data["ogretmen_id"]
        ]);

        echo json_encode(["status" => 200, "message" => "Başarıyla güncellendi!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 400, "message" => "ID eksik!"]);
}
?>