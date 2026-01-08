/**
 * Attention Session Model
 * 
 * In-memory storage for hackathon simplicity.
 * In production, use a database (PostgreSQL, MongoDB, etc.)
 */

// In-memory Map to store sessions
// Key: sessionId, Value: session object
export const attentionSessions = new Map();

/**
 * Session structure:
 * {
 *   sessionId: string (UUID)
 *   userAddress: string (lowercase)
 *   taskId: string
 *   startedAt: number (timestamp)
 *   heartbeats: Array<{ timestamp: number, receivedAt: number }>
 *   ended: boolean
 *   endedAt?: number (timestamp, if ended)
 *   duration?: number (ms, if ended)
 * }
 */

/**
 * Cleanup old sessions (older than 24 hours)
 * Call this periodically to prevent memory leaks
 */
export function cleanupOldSessions() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  let cleaned = 0;
  for (const [sessionId, session] of attentionSessions.entries()) {
    if (now - session.startedAt > maxAge) {
      attentionSessions.delete(sessionId);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} old sessions`);
  }
}

// Run cleanup every hour
setInterval(cleanupOldSessions, 60 * 60 * 1000);
