<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php";

$method = $_SERVER['REQUEST_METHOD'];
$islem = isset($_GET['islem']) ? $_GET['islem'] : '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['islem']) ? $data['islem'] : '';

    if ($action === 'ekle') {
        try {
            $sql = "INSERT INTO notlar (ogrenci_id, sinav_id, puan) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['ogrenci_id'], $data['sinav_id'], $data['puan']]);
            echo json_encode(["status" => 201, "message" => "Not başarıyla kaydedildi."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
        }
    } 
    elseif ($action === 'guncelle') {
        try {
            $sql = "UPDATE notlar SET ogrenci_id = ?, sinav_id = ?, puan = ? WHERE not_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['ogrenci_id'], $data['sinav_id'], $data['puan'], $data['not_id']]);
            echo json_encode(["status" => 200, "message" => "Not başarıyla güncellendi."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
        }
    } 
    elseif ($action === 'sil') {
        try {
            $sql = "DELETE FROM notlar WHERE not_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['not_id']]);
            echo json_encode(["status" => 200, "message" => "Not silindi."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
        }
    }
} 
elseif ($method === 'GET' && $islem === 'listele') {
    try {
        // Öğrenci adı, sınav adı ve ders adını birleştiren JOIN sorgusu
        $sql = "SELECT n.*, o.ad, o.soyad, s.sinav_adi, s.sinav_tarihi 
                FROM notlar n 
                JOIN ogrenciler o ON n.ogrenci_id = o.ogrenci_id 
                JOIN sinavlar s ON n.sinav_id = s.sinav_id 
                ORDER BY n.not_id DESC";
        $stmt = $pdo->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => 200, "data" => $data]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => $e->getMessage()]);
    }
}
?>