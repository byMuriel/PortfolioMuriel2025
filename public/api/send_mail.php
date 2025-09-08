<?php
// public/api/send_mail.php

// CORS (ajusta tu dominio de producción)
header('Access-Control-Allow-Origin: https://tudominio.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../vendor/autoload.php'; // <-- ruta a vendor

// --------- Config SMTP (ajusta con tu proveedor) ----------
$SMTP_HOST = 'smtp.tudominio.com';
$SMTP_USER = 'no-reply@tudominio.com';
$SMTP_PASS = 'TU_PASSWORD';
$SMTP_PORT = 587; // 465 si usas SMTPS
$FROM_EMAIL = 'no-reply@tudominio.com';
$FROM_NAME  = 'Portfolio ContactApp';
$TO_EMAIL   = 'contact@murielvitale.com'; // destino final
// ----------------------------------------------------------

// Valida body JSON
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
  exit;
}

$message = trim($data['message'] ?? '');
$sender  = trim($data['sender'] ?? ''); // opcional: correo del visitante

if ($message === '') {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Empty message']);
  exit;
}

// Saneado básico
$cleanMsg = strip_tags($message);
$cleanMsg = mb_substr($cleanMsg, 0, 5000); // limita tamaño
$cleanSender = filter_var($sender, FILTER_VALIDATE_EMAIL) ? $sender : 'no-reply@visitor.local';

// Construye contenido
$subject = 'Nuevo mensaje desde ContactApp';
$bodyHtml = "<h3>Nuevo mensaje</h3>
<p><strong>De:</strong> {$cleanSender}</p>
<p><strong>Mensaje:</strong></p>
<p style='white-space:pre-wrap'>{$cleanMsg}</p>
<hr>
<p>IP: {$_SERVER['REMOTE_ADDR']} | UA: ".htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? '')."</p>";

$bodyText = "Nuevo mensaje\nDe: {$cleanSender}\n\nMensaje:\n{$cleanMsg}\n";

// Envía
$mail = new PHPMailer(true);
try {
  $mail->isSMTP();
  $mail->Host       = $SMTP_HOST;
  $mail->SMTPAuth   = true;
  $mail->Username   = $SMTP_USER;
  $mail->Password   = $SMTP_PASS;
  $mail->Port       = $SMTP_PORT;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // o PHPMailer::ENCRYPTION_SMTPS

  $mail->CharSet = 'UTF-8';
  $mail->setFrom($FROM_EMAIL, $FROM_NAME);
  $mail->addAddress($TO_EMAIL);
  // si el visitante dejó su correo, puedes poner Reply-To:
  if (filter_var($sender, FILTER_VALIDATE_EMAIL)) {
    $mail->addReplyTo($sender);
  }

  $mail->isHTML(true);
  $mail->Subject = $subject;
  $mail->Body    = $bodyHtml;
  $mail->AltBody = $bodyText;

  $mail->send();
  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $mail->ErrorInfo]);
}
