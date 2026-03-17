import type { Context } from "https://edge.netlify.com";

const PASSWORD = "ckmobility2026";
const COOKIE_NAME = "site_auth";
const COOKIE_VALUE = "authenticated";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);

  // Handle login form submission
  if (request.method === "POST" && url.pathname === "/__auth") {
    const formData = await request.formData();
    const password = formData.get("password");

    if (password === PASSWORD) {
      const headers = new Headers({ Location: "/" });
      headers.append(
        "Set-Cookie",
        `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
      );
      return new Response(null, { status: 302, headers });
    }

    // Wrong password — show form again with error
    return new Response(loginPage(true), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Check auth cookie
  const cookie = request.headers.get("cookie") || "";
  const isAuthenticated = cookie
    .split(";")
    .some(
      (c) =>
        c.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`
    );

  if (isAuthenticated) {
    return context.next();
  }

  // Not authenticated — show login page
  return new Response(loginPage(false), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function loginPage(error: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Required</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #333;
    }
    .login-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 380px;
    }
    h1 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    p.subtitle {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    input[type="password"] {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus {
      border-color: #0070f3;
    }
    .error {
      color: #e00;
      font-size: 0.8125rem;
      margin-top: 0.5rem;
    }
    button {
      width: 100%;
      margin-top: 1.25rem;
      padding: 0.625rem;
      background: #0070f3;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #005bb5; }
  </style>
</head>
<body>
  <div class="login-card">
    <h1>Password Required</h1>
    <p class="subtitle">Enter the password to view this site.</p>
    <form method="POST" action="/__auth">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autofocus />
      ${error ? '<p class="error">Incorrect password. Please try again.</p>' : ""}
      <button type="submit">Submit</button>
    </form>
  </div>
</body>
</html>`;
}

export const config = {
  path: "/*",
};
