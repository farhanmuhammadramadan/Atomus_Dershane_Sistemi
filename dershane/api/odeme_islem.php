<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php"; // Veritabanı bağlantı dosyanızın adı doğru olmalı

$method = $_SERVER['REQUEST_METHOD'];
$islem = isset($_GET['islem']) ? $_GET['islem'] : '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['islem']) ? $data['islem'] : '';

    if ($action === 'ekle') {
        try {
            $sql = "INSERT INTO odemeler (ogrenci_id, miktar, odeme_tarihi, odeme_turu) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['ogrenci_id'], $data['miktar'], $data['odeme_tarihi'], $data['odeme_turu']]);
            echo json_encode(["status" => 201, "message" => "Ödeme başarıyla kaydedildi."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => 500, "message" => "Veritabanı Hatası: " . $e->getMessage()]);
        }
    } 
    elseif ($action === 'sil') {
        try {
            $sql = "DELETE FROM odemeler WHERE odeme_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['odeme_id']]);
            echo json_encode(["status" => 200, "message" => "Ödeme iptal edildi."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
        }
    }
} 
elseif ($method === 'GET' && $islem === 'listele') {
    try {
        // Öğrenci tablosuyla JOIN yaparak isimleri de alıyoruz
        $sql = "SELECT o.*, ogr.ad, ogr.soyad FROM odemeler o 
                JOIN ogrenciler ogr ON o.ogrenci_id = ogr.ogrenci_id 
                ORDER BY o.odeme_id DESC";
        $stmt = $pdo->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => 200, "data" => $data]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => $e->getMessage()]);
    }
}
?>