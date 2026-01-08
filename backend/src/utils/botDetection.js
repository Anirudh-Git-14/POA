/**
 * Bot Detection Utilities
 * 
 * Simple heuristics to detect bot-like behavior
 * Hackathon-level implementation - can be enhanced for production
 */

/**
 * Validate minimum attention duration
 * @param {Object} session - Attention session
 * @returns {boolean} True if duration is valid
 */
export function validateAttentionDuration(session) {
  // For development/testing we default to 10 seconds so it's easy to verify the flow
  // In production, override MIN_ATTENTION_TIME in the environment (e.g. 300000 for 5 minutes)
  const minDuration = parseInt(process.env.MIN_ATTENTION_TIME || "10000"); // 10 seconds
  const duration = Date.now() - session.startedAt;
  return duration >= minDuration;
}

/**
 * Detect bot-like behavior patterns
 * @param {Object} session - Attention session
 * @returns {number} Bot score (0-1, higher = more bot-like)
 */
export function detectBotBehavior(session) {
  let botScore = 0;
  const heartbeats = session.heartbeats;

  // Not enough heartbeats (should have at least one per 30 seconds)
  const expectedHeartbeats = Math.floor((Date.now() - session.startedAt) / 30000);
  if (heartbeats.length < expectedHeartbeats * 0.5) {
    botScore += 0.3; // Suspiciously few heartbeats
  }

  // Check heartbeat regularity
  if (heartbeats.length > 1) {
    const intervals = [];
    for (let i = 1; i < heartbeats.length; i++) {
      const interval = heartbeats[i].timestamp - heartbeats[i - 1].timestamp;
      intervals.push(interval);
    }

    // Too regular (exactly 30 seconds every time) = bot
    const tooRegular = intervals.every((interval) => Math.abs(interval - 30000) < 1000);
    if (tooRegular && intervals.length > 3) {
      botScore += 0.4; // Suspiciously regular
    }

    // Too irregular (wildly varying) = bot
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > avgInterval * 0.5 && intervals.length > 3) {
      botScore += 0.2; // Suspiciously irregular
    }
  }

  // Session too short
  const duration = Date.now() - session.startedAt;
  const minDuration = parseInt(process.env.MIN_ATTENTION_TIME || "10000");
  if (duration < minDuration) {
    botScore += 0.3;
  }

  // No heartbeats at all = very suspicious
  if (heartbeats.length === 0) {
    botScore += 0.5;
  }

  return Math.min(botScore, 1.0); // Cap at 1.0
}
