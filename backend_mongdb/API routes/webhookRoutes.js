const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  handleChallenge,
  verifySignature,
  handleIncoming,
  sendTestEvent,
} = require('../controllers/webhookController');

// ── GET /api/webhook/verify ───────────────────────────────────────────────────
// Hub challenge endpoint — used by external services (Meta, GitHub, Stripe, etc.)
// to confirm your endpoint is live and that you own the secret.
//
// Usage (Meta-style):
//   ?hub.mode=subscribe&hub.challenge=<random_token>&hub.verify_token=<webhookSecret>
//
// Usage (generic):
//   ?mode=subscribe&challenge=<random_token>&verify_token=<webhookSecret>
//
// Without parameters → returns a JSON health confirmation.
router.get('/verify', handleChallenge);

// ── POST /api/webhook/incoming ────────────────────────────────────────────────
// Receives signed webhook events from external services or your own backend.
// Every request must include a valid HMAC-SHA256 signature header:
//
//   X-Vulpinix-Signature: sha256=<hex>   (our own sender)
//   X-Hub-Signature-256:  sha256=<hex>   (Meta / GitHub)
//
// Note: server.js mounts a raw-body capture middleware specifically for this
// path so the signature can be verified before the body is JSON-parsed.
router.post('/incoming', verifySignature, handleIncoming);

// ── POST /api/webhook/test ────────────────────────────────────────────────────
// Developer utility: returns a pre-signed test payload and the curl command
// you can run to simulate an incoming webhook event end-to-end.
// Requires authentication.
router.post('/test', requireAuth, sendTestEvent);

module.exports = router;
