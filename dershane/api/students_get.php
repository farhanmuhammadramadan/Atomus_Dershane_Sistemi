<?php
// JSON formatında yanıt vereceğimizi ve Türkçe karakter desteğini bildiriyoruz
header("Content-Type: application/json; charset=UTF-8");

// Veritabanı bağlantı dosyasını dahil ediyoruz
include "connect.php";

try {
    // SQL sorgusu: ogrenciler tablosundaki tüm verileri ID'ye göre tersten getir
    // Böylece yeni eklenen öğrenci listenin en üstünde görünür.
    $sql = "SELECT ogrenci_id, ad, soyad, telefon, kayit_tarihi FROM ogrenciler ORDER BY ogrenci_id DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Tüm verileri bir dizi (array) olarak çekiyoruz
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Eğer öğrenci varsa listeyi, yoksa boş dizi döner
    http_response_code(200);
    echo json_encode([
        "status" => 200,
        "data" => $students
    ]);

} catch (PDOException $e) {
    // Veritabanı hatası oluşursa
    http_response_code(500); 
    echo json_encode([
        "status" => 500,
        "message" => "Verileri çekerken hata oluştu: " . $e->getMessage()
    ]);
}
?>