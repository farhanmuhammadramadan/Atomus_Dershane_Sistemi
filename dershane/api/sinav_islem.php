<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php"; // Dosya api içinde olduğu için doğrudan erişir

$islem = $_GET['islem'] ?? null;
$data = json_decode(file_get_contents("php://input"), true);

if ($islem == 'listele') {
    try {
        $sql = "SELECT s.*, d.ders_adi 
                FROM sinavlar s 
                LEFT JOIN dersler d ON s.ders_id = d.ders_id 
                ORDER BY s.sinav_tarihi DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        echo json_encode(["status" => 200, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => $e->getMessage()]);
    }
} 
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $islemTipi = $data['islem'] ?? '';
    try {
        if ($islemTipi == 'ekle') {
            $sql = "INSERT INTO sinavlar (sinav_adi, ders_id, sinav_tarihi) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['sinav_adi'], $data['ders_id'], $data['sinav_tarihi']]);
            echo json_encode(["status" => 201, "message" => "Eklendi"]);
        } 
        else if ($islemTipi == 'guncelle') {
            $sql = "UPDATE sinavlar SET sinav_adi=?, ders_id=?, sinav_tarihi=? WHERE sinav_id=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['sinav_adi'], $data['ders_id'], $data['sinav_tarihi'], $data['sinav_id']]);
            echo json_encode(["status" => 200, "message" => "Güncellendi"]);
        }
        else if ($islemTipi == 'sil') {
            $sql = "DELETE FROM sinavlar WHERE sinav_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['sinav_id']]);
            echo json_encode(["status" => 200, "message" => "Silindi"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => $e->getMessage()]);
    }
}
?>