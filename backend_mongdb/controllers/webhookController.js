const crypto = require('crypto');
const User = require('../models/user');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Resolve the user whose webhookSecret should be used for verification.
 * Priority: JWT (req.user) → query ?userId → fallback to first user.
 */
const resolveUser = async (req) => {
  const userId = req.user?.id || req.query.userId;

  if (userId) {
    if (userId.includes('@')) {
      const u = await User.findOne({ email: userId });
      if (u) return u;
    }
    try {
      const u = await User.findById(userId);
      if (u) return u;
    } catch (_) {}
  }

  // Fallback — for dev / single-tenant setups
  return User.findOne({});
};

/**
 * Compute HMAC-SHA256 hex digest of a buffer/string using the given secret.
 */
const computeHmac = (secret, payload) =>
  crypto.createHmac('sha256', secret).update(payload).digest('hex');

/**
 * Constant-time comparison to prevent timing attacks.
 */
const safeCompare = (a, b) => {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
};

// ── Hub Challenge (GET) ───────────────────────────────────────────────────────
// Used by Meta/Facebook, Stripe, GitHub and others to verify the endpoint.
// GET /api/webhook/verify?hub.mode=subscribe&hub.challenge=<token>&hub.verify_token=<vt>
// GET /api/webhook/verify?mode=subscribe&challenge=<token>&verify_token=<vt>

exports.handleChallenge = async (req, res) => {
  try {
    const user = await resolveUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const storedSecret = user.settings?.webhookSecret;
    if (!storedSecret) {
      return res.status(400).json({
        error: 'No webhook signing secret configured. Save one in Settings → API & Webhooks.'
      });
    }

    // Support both Meta-style (?hub.mode / hub.challenge / hub.verify_token)
    // and generic (?mode / challenge / verify_token)
    const mode          = req.query['hub.mode']          || req.query.mode;
    const challenge     = req.query['hub.challenge']     || req.query.challenge;
    const verifyToken   = req.query['hub.verify_token']  || req.query.verify_token;

    // If no challenge parameters are present, just confirm the endpoint is live.
    if (!challenge && !verifyToken) {
      return res.json({
        success: true,
        message : 'Webhook endpoint is active. Send ?hub.mode=subscribe&hub.challenge=<token>&hub.verify_token=<secret> to verify.',
        endpoint: `${process.env.BACKEND_URL || 'https://your-backend.render.com'}/api/webhook/verify`
      });
    }

    if (mode !== 'subscribe') {
      return res.status(400).json({ error: `hub.mode must be "subscribe", got "${mode}"` });
    }

    if (!safeCompare(verifyToken, storedSecret)) {
      console.warn(`[WEBHOOK] Challenge failed — verify_token mismatch for user ${user.email}`);
      return res.status(403).json({ error: 'Forbidden — verify_token does not match your webhook signing secret' });
    }

    console.log(`[WEBHOOK] ✅ Challenge verified for user ${user.email}`);
    // Meta expects the raw challenge string, not JSON.
    return res.status(200).send(challenge);
  } catch (err) {
    console.error('[WEBHOOK] handleChallenge error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Signature Verification Middleware ────────────────────────────────────────
// Called on POST /api/webhook/incoming before the main handler.
// Reads the raw body captured by the express.raw() middleware mounted in server.js.

exports.verifySignature = async (req, res, next) => {
  try {
    const user = await resolveUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const storedSecret = user.settings?.webhookSecret;
    if (!storedSecret) {
      return res.status(400).json({
        error: 'No webhook signing secret configured. Save one in Settings → API & Webhooks.'
      });
    }

    // Accept the signature from multiple common header formats:
    //   X-Vulpinix-Signature   → our own sender
    //   X-Hub-Signature-256    → Meta / GitHub
    //   Stripe-Signature       → Stripe (simplified, not full Stripe spec)
    const sigHeader =
      req.headers['x-vulpinix-signature'] ||
      req.headers['x-hub-signature-256']  ||
      req.headers['stripe-signature']     ||
      '';

    if (!sigHeader) {
      return res.status(401).json({
        error: 'Missing signature header. Expected X-Vulpinix-Signature or X-Hub-Signature-256.'
      });
    }

    // Signature may arrive as "sha256=<hex>" or bare "<hex>"
    const receivedHex = sigHeader.startsWith('sha256=')
      ? sigHeader.slice(7)
      : sigHeader;

    // The raw body buffer is attached by the rawBodyCapture middleware.
    const rawBody = req.rawBody;
    if (!rawBody) {
      return res.status(400).json({
        error: 'Could not read raw request body for signature verification.'
      });
    }

    const expectedHex = computeHmac(storedSecret, rawBody);

    if (!safeCompare(receivedHex, expectedHex)) {
      console.warn(`[WEBHOOK] ❌ Signature mismatch for user ${user.email}`);
      return res.status(401).json({ error: 'Signature verification failed — payload may have been tampered.' });
    }

    // Attach resolved user and secret for the downstream handler
    req.webhookUser   = user;
    req.webhookSecret = storedSecret;
    console.log(`[WEBHOOK] ✅ Signature verified for user ${user.email}`);
    next();
  } catch (err) {
    console.error('[WEBHOOK] verifySignature error:', err.message);
    res.status(500).json({ error: 'Internal server error during signature verification' });
  }
};

// ── Incoming Event Handler (POST) ────────────────────────────────────────────
// POST /api/webhook/incoming
// Requires verifySignature middleware to have passed.

exports.handleIncoming = async (req, res) => {
  try {
    const payload = req.body; // Already parsed JSON by this point
    const user    = req.webhookUser;

    const eventType = payload?.event || payload?.type || 'unknown';
    console.log(`[WEBHOOK] 📦 Event received: "${eventType}" for user ${user.email}`);

    // ── Event Dispatch ──────────────────────────────────────────────────────
    switch (eventType) {
      case 'campaign.published':
        console.log(`[WEBHOOK] Campaign published: ${payload.data?.campaignId}`);
        // TODO: trigger post-publish analytics, notify team, etc.
        break;

      case 'campaign.failed':
        console.log(`[WEBHOOK] Campaign failed: ${payload.data?.campaignId} — ${payload.data?.reason}`);
        // TODO: alert user, retry logic, etc.
        break;

      case 'campaign.scheduled':
        console.log(`[WEBHOOK] Campaign scheduled: ${payload.data?.campaignId} at ${payload.data?.scheduledAt}`);
        break;

      case 'social.connected':
        console.log(`[WEBHOOK] Social account connected: ${payload.data?.platform}`);
        break;

      case 'social.disconnected':
        console.log(`[WEBHOOK] Social account disconnected: ${payload.data?.platform}`);
        break;

      case 'user.updated':
        console.log(`[WEBHOOK] User profile updated for ${user.email}`);
        break;

      // External service events (e.g. Meta app webhook re-broadcast)
      case 'messages':
      case 'mention':
      case 'feed':
        console.log(`[WEBHOOK] Meta platform event "${eventType}" received.`);
        break;

      default:
        console.log(`[WEBHOOK] Unhandled event type: "${eventType}". Payload keys: ${Object.keys(payload || {}).join(', ')}`);
    }

    // Always acknowledge quickly (external services retry if they don't get 200)
    res.status(200).json({
      success   : true,
      received  : true,
      event     : eventType,
      timestamp : new Date().toISOString()
    });
  } catch (err) {
    console.error('[WEBHOOK] handleIncoming error:', err.message);
    res.status(500).json({ error: 'Internal server error while processing webhook event' });
  }
};

// ── Test Endpoint ─────────────────────────────────────────────────────────────
// POST /api/webhook/test  — Generate a properly-signed test payload for local dev.
// Requires ?userId=<id|email> or a valid JWT.

exports.sendTestEvent = async (req, res) => {
  try {
    const user = await resolveUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const storedSecret = user.settings?.webhookSecret;
    if (!storedSecret) {
      return res.status(400).json({
        error: 'No webhook signing secret configured.'
      });
    }

    const testPayload = JSON.stringify({
      event    : 'campaign.published',
      version  : '1.0',
      timestamp: new Date().toISOString(),
      data     : {
        campaignId : 'test_' + Math.random().toString(36).slice(2, 9),
        platform   : 'instagram',
        status     : 'published',
        message    : 'This is a Vulpinix test webhook event.'
      }
    });

    const signature = 'sha256=' + computeHmac(storedSecret, testPayload);

    res.json({
      success  : true,
      message  : 'Test event payload generated. Forward this to your webhook URL with the header below.',
      payload  : JSON.parse(testPayload),
      headers  : {
        'Content-Type'          : 'application/json',
        'X-Vulpinix-Signature'  : signature
      },
      curlExample: `curl -X POST "${user.settings?.webhookUrl || 'https://your-endpoint.com/webhooks'}" \\
  -H "Content-Type: application/json" \\
  -H "X-Vulpinix-Signature: ${signature}" \\
  -d '${testPayload}'`
    });
  } catch (err) {
    console.error('[WEBHOOK] sendTestEvent error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
