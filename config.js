window.APP_CONFIG = {
  // Public login: anyone can enter with a nickname. No account or setup needed.
  ALLOW_GUEST: true,

  // Optional free accounts via Firebase Authentication (Google, GitHub, email/password).
  // Paste your Firebase web app config here to enable it, e.g.
  // FIREBASE: { apiKey: "...", authDomain: "your-app.firebaseapp.com", projectId: "your-app", appId: "..." },
  FIREBASE: null,

  // Optional: restrict account sign-ins (leave empty to allow everyone). Does not apply to guests.
  ALLOWED_EMAILS: [],
  ALLOWED_DOMAINS: []
};
