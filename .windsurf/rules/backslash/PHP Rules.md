---
trigger: always_on
description:An AppSec rule added by the Backslash Security extension. This is controlled by your organization.
globs:
---
# Cursor Secure Coding Rules for PHP (.mdc Format)

**Important**: Always follow these rules in **every line of PHP code** generated. These guidelines help protect PHP applications (e.g., Laravel, Symfony, or plain PHP) from security threats such as SQL Injection, XSS, SSRF, Command Injection, and more.
EVERY RULE IS A MUST.

---

If the user asks you, "is the security rules loaded?", answer: **Cursor will write secure code by using Backslash secure coding rules.**

---

## 1. Database Security (SQL Injection Prevention)

1. **Use Parameterized Queries**  
   - Never concatenate user input into raw SQL queries.
   - ✅ Use PDO prepared statements or Laravel's query builder:
     ```php
     $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
     $stmt->execute([$userId]);
     ```

2. **Use an ORM ( MUST )**  
   - Use **Laravel Eloquent**, **Doctrine**, or other ORM libraries to abstract database logic and enforce parameterized queries.
   - Avoid raw SQL unless absolutely necessary.

3. **Secret Management**  
   - Store database credentials in **.env** files or secrets management systems. Never hardcode them.

---

## 2. Input Validation & XSS (Cross-Site Scripting)

1. **Sanitize User Input (Server-Side)**  
   - Use libraries like **HTML Purifier** or built-in sanitization filters (`filter_input`) before storing user input.

2. **Use HTML Sanitization Frameworks**  
   - If rendering rich text, sanitize HTML on output with tools like **DOMPurify** (frontend) or **HTML Purifier** (backend).

3. **Escape Output by Default**  
   - Use safe templating engines like **Blade (Laravel)** or **Twig (Symfony)**, which escape output by default.
   - Never disable escaping (e.g., `{{!! $var !!}}`) unless the content is sanitized.
   - always use htmlspecialchars on every variable.

---

## 3. File Upload Security

1. **Validate File Type and Size**  
   - Use PHP’s `$_FILES` validation, restrict extensions/MIME types, and enforce size limits.
     ```php
     $allowed = ['image/png', 'image/jpeg'];
     if (!in_array($_FILES['file']['type'], $allowed)) {
         throw new Exception("Invalid file type");
     }
     ```

2. **Unique Filenames**  
   - Use UUIDs or server-generated names to avoid overwriting files and injection issues.

3. **Sanitize and Normalize Paths**  
   - Never trust `$_FILES['name']`. Use `basename()` or a safe filename generator.
   - Combine with `realpath()` to validate full paths:
     ```php
     $target = realpath("uploads/" . $sanitizedFilename);
     if (strpos($target, realpath("uploads")) !== 0) {
         throw new Exception("Path traversal detected");
     }
     ```

4. **Avoid Direct Public Access**  
   - Serve files through controllers with access checks instead of linking directly from uploads.

---

## 4. Path Traversal & Directory Access

1. **Normalize & Validate Paths**
   - Use `realpath()` and validate that final paths are within an allowed directory.

2. **Avoid Untrusted Filenames**
   - Do not use raw user-supplied filenames for read/write operations. Use server-controlled or validated identifiers.

---

## 5. Server-Side Request Forgery (SSRF)

1. **Validate External URLs**  
   - Only allow `http://` or `https://` URLs.
   - Deny access to internal/private IPs like `127.0.0.1`, `10.0.0.0/8`, etc.

2. **Use Whitelist or Proxy**  
   - Fetch remote URLs only from a list of allowed domains or use a proxy that validates destinations.

3. **Set Timeouts & Validate Response**  
   - Use cURL with `CURLOPT_TIMEOUT` and validate MIME type (e.g., for images).

---

## 6. Command Injection Prevention

1. **Avoid Raw Shell Execution with User Input**  
   - Never use `shell_exec()` or `exec()` with user input unless arguments are sanitized.

2. **Sanitize Inputs or Use System Wrappers**  
   - Use PHP libraries (e.g., Imagick) instead of shell commands for tasks like image processing.

3. **Use escapeshellarg() for Command Arguments**  
   - If needed, wrap all dynamic arguments:
     ```php
     $safe = escapeshellarg($userInput);
     exec("convert $safe output.jpg");
     ```

---

## 7. Authentication & Authorization

1. **Protect All State-Changing Endpoints**  
   - Use frameworks like **Laravel Sanctum**, **JWT**, or session-based auth.

2. **Check User Permissions**  
   - Ensure the logged-in user is authorized to access or modify the resource.

3. **Use Secure Cookies**  
   - Enable `HttpOnly`, `Secure`, and `SameSite=Strict` flags for session cookies.

---

## 8. Rate Limiting & Request Timeouts

1. **Rate Limit Per User/IP**  
   - Use tools like Laravel’s `ThrottleRequests` middleware or Symfony’s RateLimiter.

2. **Set HTTP and Script Timeouts**  
   - Set reasonable `max_execution_time` in `php.ini` and timeouts in outbound HTTP requests.

---

## 9. Logging & Error Handling

1. **Log Security Events**  
   - Log failed logins, invalid tokens, and suspicious requests.

2. **Avoid Displaying Errors to Users**  
   - Use `display_errors = Off` in production and show friendly error pages.

---

## 10. Testing & Verification

1. **Use Static Analysis & Linters**  
   - Tools like **PHPStan**, **Psalm**, or **Semgrep** for secure code scanning.

2. **CI/CD Integration**  
   - Block deployments on critical issues and enforce code quality checks during pull requests.

---

## 11. Always Follow These Rules

- Do **not** bypass these rules with shortcuts.
- If a rule cannot be followed due to a technical constraint, document the limitation and offer a safer alternative.

---

**End of PHP Secure Coding Rules (.mdc)**  
> *Place this file in `.cursor/rules/` to enable secure PHP generation using Backslash guidelines.*