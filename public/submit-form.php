<?php
/**
 * Free-trial form handler.
 * Accepts POST application/json or form-encoded with: name, email, phone.
 * Forwards a notification to the team inbox via PHP mail().
 *
 * Hosted on cPanel — uses the server's default sendmail. For higher
 * deliverability set SPF/DKIM on the leagueit.org domain.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://leagueit.org');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Accept either JSON body or classic form-encoded POST.
$raw = file_get_contents('php://input');
$input = [];
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
if (empty($input)) {
    $input = $_POST;
}

$name  = trim((string) ($input['name']  ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$phone = trim((string) ($input['phone'] ?? ''));

// Honeypot: if this field is populated it's a bot.
if (!empty($input['website'])) {
    echo json_encode(['ok' => true]); // pretend success, silently drop
    exit;
}

$errors = [];
if ($name === '' || mb_strlen($name) > 100) {
    $errors['name'] = "Введіть ім'я (до 100 символів)";
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Невірний формат email';
}
if ($phone === '' || !preg_match('/^[\d\+\-\(\)\s]{7,25}$/', $phone)) {
    $errors['phone'] = 'Невірний формат телефону';
}
if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// Strip CRLF from header-bound values to prevent injection.
$emailClean = preg_replace('/[\r\n]+/', ' ', $email);
$nameClean  = preg_replace('/[\r\n]+/', ' ', $name);

$to      = 'iobespalov@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode('[IT League] Нова заявка на free trial: ' . $nameClean) . '?=';
$bodyLines = [
    'Нова заявка на участь у free trial IT League Backend:',
    '',
    "Ім'я:    $nameClean",
    "Email:   $emailClean",
    "Телефон: $phone",
    '',
    'Час подачі: ' . date('Y-m-d H:i:s'),
    'IP:         ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    'User-Agent: ' . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'),
];
$body = implode("\r\n", $bodyLines);

$headers  = "From: IT League <noreply@leagueit.org>\r\n";
$headers .= "Reply-To: $emailClean\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = @mail($to, $subject, $body, $headers, '-f noreply@leagueit.org');

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Не вдалось відправити лист. Спробуйте пізніше або напишіть нам напряму.',
    ]);
}
