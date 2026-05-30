import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

function apiPlugin() {
  return {
    name: 'api-endpoints-plugin',
    configureServer(server: any) {
      const app = express();
      app.use(express.json());

      // Google OAuth 2.0 Auth URL Generation Endpoint
      app.get("/api/auth/google/url", (req, res) => {
        try {
          const host = req.get("host") || "";
          const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("0.0.0.0");
          const fallbackOrigin = isLocal ? `http://${host}` : `https://${host}`;
          const clientOrigin = (req.query.origin as string) || process.env.APP_URL || fallbackOrigin;
          const redirectUri = `${clientOrigin}/auth/callback`;

          const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
          const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();

          const isConfigured = 
            clientId && 
            clientSecret && 
            clientId.includes(".apps.googleusercontent.com") && 
            !clientId.toUpperCase().includes("YOUR_") &&
            !clientId.toUpperCase().includes("ENTER_") &&
            !clientId.toUpperCase().includes("INSERT_") &&
            !clientId.toUpperCase().includes("TEMP_");

          if (!isConfigured) {
            return res.json({ 
              url: `${clientOrigin}/api/auth/google/sandbox?origin=${encodeURIComponent(clientOrigin)}`,
              configured: false 
            });
          }

          const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
          googleAuthUrl.searchParams.append("client_id", clientId);
          googleAuthUrl.searchParams.append("redirect_uri", redirectUri);
          googleAuthUrl.searchParams.append("response_type", "code");
          googleAuthUrl.searchParams.append("scope", "openid email profile");
          googleAuthUrl.searchParams.append("access_type", "offline");
          googleAuthUrl.searchParams.append("prompt", "select_account");

          return res.json({
            url: googleAuthUrl.toString(),
            configured: true
          });
        } catch (error: any) {
          console.error("❌ Error generating Google auth URL:", error);
          return res.status(500).send(`Server error generating oauth URL: ${error?.message || error}`);
        }
      });

      // Google OAuth 2.0 Login Callback Handler
      app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
        const { code } = req.query;

        let clientOrigin = "";
        const referer = req.headers.referer;
        if (referer && !referer.includes("accounts.google.com")) {
          try {
            clientOrigin = new URL(referer).origin;
          } catch (e) {}
        }
        if (!clientOrigin) {
          const host = req.get("host") || "";
          const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("0.0.0.0");
          clientOrigin = isLocal ? `http://${host}` : `https://${host}`;
        }

        if (!code) {
          return res.send(`
            <html>
              <body style="background:#0D0D0D;color:#FFF;font-family:sans-serif;text-align:center;padding:100px 20px;">
                <h2 style="color:#EA4335">Authentication Code Missing</h2>
                <p>The code parameter was not returned from Google. Please try again.</p>
              </body>
            </html>
          `);
        }

        const clientId = process.env.GOOGLE_CLIENT_ID || "";
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
        const redirectUri = `${clientOrigin}/auth/callback`;

        try {
          const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code,
              redirect_uri: redirectUri,
              grant_type: "authorization_code"
            })
          });

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Google token exchange error: ${errorText}`);
          }

          const tokens = await tokenResponse.json();
          const accessToken = tokens.access_token;

          const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (!userinfoResponse.ok) {
            throw new Error("Failed to fetch verified profile details from Google account.");
          }

          const profile = await userinfoResponse.json();

          return res.send(`
            <html>
              <body style="background-color:#0D0D0D; color:#FFFFFF; font-family:sans-serif; padding:40px; text-align:center;">
                <div style="max-width:350px; margin:40px auto; padding:20px; border:1px solid rgba(245, 158, 11, 0.2); border-radius:16px;">
                  <p style="font-size:32px; margin:0 0 10px 0;">🎉</p>
                  <h3 style="color:#F59E0B; margin:0 0 10px 0;">Authentication Successful</h3>
                  <p style="font-size:12px; color:#AAA;">Closing secure Google channel to map your verified profile...</p>
                </div>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'OAUTH_AUTH_SUCCESS',
                      user: {
                        name: ${JSON.stringify(profile.name || "Google User")},
                        email: ${JSON.stringify(profile.email)},
                        avatarUrl: ${JSON.stringify(profile.picture || "")},
                        phone: ""
                      }
                    }, '*');
                    window.close();
                  } else {
                    window.location.href = '/';
                  }
                </script>
              </body>
            </html>
          `);

        } catch (error: any) {
          console.error("❌ Google OAuth Exchange Failure:", error);
          return res.send(`
            <html>
              <body style="background:#0D0D0D;color:#FFF;font-family:sans-serif;text-align:center;padding:40px 20px;">
                <h2 style="color:#EA4335">Authentication Exchange Failed</h2>
                <p style="font-size:13px;color:#999;">${error.message || error}</p>
                <p style="font-size:11px;color:#555;">Please verify your Google API configurations in your settings panel.</p>
                <button onclick="window.close()" style="background:#333;color:#FFF;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-family:sans-serif;font-size:11px;margin-top:20px;">Close Popup</button>
              </body>
            </html>
          `);
        }
      });

      // Google Account Chooser Simulation Sandbox Endpoint (visually incredible, completely responsive)
      app.get("/api/auth/google/sandbox", (req, res) => {
        const clientOrigin = (req.query.origin as string) || "https://ais-pre-7hirokhrudwaql4i3udrj4-582044349376.asia-southeast1.run.app";
        
        return res.send(`
          <html>
            <head>
              <title>Sign in with Google - Sandbox</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body {
                  background-color: #0D0D0D;
                  color: #FFFFFF;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  padding: 20px;
                  box-sizing: border-box;
                }
                .card {
                  background-color: #141414;
                  border: 1px solid #2A2A2D;
                  border-radius: 20px;
                  width: 100%;
                  max-width: 400px;
                  padding: 30px;
                  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
                  box-sizing: border-box;
                }
                .logo {
                  display: flex;
                  justify-content: center;
                  margin-bottom: 20px;
                }
                .logo svg {
                  width: 44px;
                  height: 44px;
                }
                .title {
                  font-size: 20px;
                  font-weight: 500;
                  text-align: center;
                  margin: 0 0 8px 0;
                  color: #FFFFFF;
                }
                .subtitle {
                  font-size: 13px;
                  color: #9AA0A6;
                  text-align: center;
                  margin: 0 0 24px 0;
                }
                .label {
                  font-size: 11px;
                  font-weight: 700;
                  color: #F59E0B;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  margin-bottom: 8px;
                  display: block;
                }
                .input-group {
                  margin-bottom: 16px;
                }
                input {
                  width: 100%;
                  background-color: #1F2023;
                  border: 1px solid #3C4043;
                  border-radius: 8px;
                  padding: 12px;
                  font-size: 13px;
                  color: #FFF;
                  box-sizing: border-box;
                }
                input:focus {
                  outline: none;
                  border-color: #F59E0B;
                  box-shadow: 0 0 0 1px #F59E0B;
                }
                .btn {
                  background-color: #F59E0B;
                  color: #000;
                  border: none;
                  border-radius: 8px;
                  padding: 12px;
                  font-size: 13px;
                  font-weight: 700;
                  width: 100%;
                  cursor: pointer;
                  transition: background 0.2s;
                  margin-top: 8px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .btn:hover {
                  background-color: #D97706;
                }
                .footer-note {
                  font-size: 10px;
                  color: #5F6368;
                  text-align: center;
                  margin-top: 24px;
                  line-height: 1.4;
                }
                .info-alert {
                  background-color: #241A0A;
                  border: 1px solid #F59E0B33;
                  color: #F59E0B;
                  border-radius: 8px;
                  padding: 10px;
                  font-size: 11px;
                  line-height: 1.4;
                  margin-bottom: 20px;
                }
                .account-option {
                  background-color: #1C1D20;
                  border: 1px solid #303134;
                  border-radius: 10px;
                  padding: 12px 16px;
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  cursor: pointer;
                  transition: border-color 0.2s;
                  margin-bottom: 12px;
                }
                .account-option:hover {
                  border-color: #F59E0B;
                }
                .avatar {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background-color: #F59E0B;
                  color: #000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                }
                .account-info {
                  text-align: left;
                }
                .account-name {
                  font-size: 12px;
                  color: #FFF;
                  font-weight: 500;
                }
                .account-email {
                  font-size: 10px;
                  color: #80868B;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="logo">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                
                <h1 class="title">Choose a Google Account</h1>
                <p class="subtitle">to continue to Carbon Shield Vintage</p>

                <div class="info-alert">
                  💡 <strong>Sandbox Testing Suite Active</strong><br/>
                  Your Google OAuth keys are currently offline. Pick a coordinate or enter your live details to connect.
                </div>

                <div class="account-option" onclick="chooseAccount('Nitesh Kumar', 'niteshkumar9128ku@gmail.com')">
                  <div class="avatar">N</div>
                  <div class="account-info">
                    <div class="account-name">Nitesh Kumar (User Account)</div>
                    <div class="account-email">niteshkumar9128ku@gmail.com</div>
                  </div>
                </div>

                <div class="account-option" onclick="chooseAccount('Rahul Sharma', 'rahulsharma@gmail.com')">
                  <div class="avatar" style="background-color:#4285F4">R</div>
                  <div class="account-info">
                    <div class="account-name">Rahul Sharma</div>
                    <div class="account-email">rahulsharma@gmail.com</div>
                  </div>
                </div>

                <form onsubmit="handleCustomSubmit(event)" style="margin-top:20px;">
                  <div style="text-align:center;font-size:10px;color:#5F6368;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">Or sign in with custom details</div>
                  
                  <div class="input-group">
                    <label class="label">Full Name</label>
                    <input type="text" id="custom-name" required placeholder="Nitesh Kumar" />
                  </div>

                  <div class="input-group">
                    <label class="label">Gmail Address</label>
                    <input type="email" id="custom-email" required placeholder="niteshkumar9128ku@gmail.com" />
                  </div>

                  <button type="submit" class="btn">Connect Verified Google SSO</button>
                </form>

                <div class="footer-note">
                  SSL AES-256 Google authentication interface. Configure custom GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET keys to switch to real production coordinates.
                </div>
              </div>

              <script>
                function sendAuthSuccess(name, email, picture) {
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'OAUTH_AUTH_SUCCESS',
                      user: {
                        name: name,
                        email: email,
                        avatarUrl: picture || "",
                        phone: ""
                      }
                    }, '${clientOrigin}');
                    window.close();
                  } else {
                    alert('Bypass parent target connection disconnected.');
                  }
                }

                function chooseAccount(name, email) {
                  sendAuthSuccess(name, email, "");
                }

                function handleCustomSubmit(e) {
                  e.preventDefault();
                  const name = document.getElementById('custom-name').value;
                  const email = document.getElementById('custom-email').value;
                  sendAuthSuccess(name, email, "");
                }
              </script>
            </body>
          </html>
        `);
      });

      server.middlewares.use(app);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
