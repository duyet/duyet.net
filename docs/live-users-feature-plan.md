# Live Users Feature - Implementation Plan

## Overview

Design and implement a real-time user tracking system showing live visitor
counts on the homepage with a detailed analytics dashboard at `/live`. The
system will classify users as humans, bots, or LLM agents and track
location/device information.

## Architecture

### Data Storage (Deno KV)

**Session Data Model:**

```typescript
interface LiveSession {
  id: string; // Unique session ID
  timestamp: number; // Session start time
  userType: "human" | "bot" | "llm";
  location: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device: {
    os: string;
    browser: string;
    deviceType: "desktop" | "mobile" | "tablet";
    userAgent: string;
  };
  pages: string[]; // Pages visited in session
  lastActivity: number; // Last activity timestamp
}
```

**KV Key Structure:**

- `["live_sessions", sessionId]` → LiveSession (TTL: 5 minutes)
- `["live_count", "total"]` → number (atomic counter)
- `["live_count", "by_type", userType]` → number (atomic counters)
- `["live_activity", timestamp]` → sessionId[] (TTL: 1 hour, for cleanup)

### User Type Detection

**Detection Strategy:**

1. **LLM Agents**: User-agent patterns (GPTBot, ClaudeBot, PerplexityBot, etc.)
2. **Bots**: Common crawler patterns + behavioral analysis
3. **Humans**: Default classification after bot/LLM exclusion

**Implementation:**

```typescript
// libs/user-detector.ts
enum UserType {
  HUMAN = "human",
  BOT = "bot",
  LLM = "llm",
}

function detectUserType(userAgent: string, headers: Headers): UserType;
function getLocationFromRequest(request: Request): Promise<LocationData>;
function getDeviceInfo(userAgent: string): DeviceInfo;
```

### Real-time Updates

**Approach**: Server-Sent Events (SSE)

- Endpoint: `/api/live-updates`
- Push updates every 10 seconds
- Use Deno KV watch API for change detection

## Implementation Plan

### Phase 1: Core Infrastructure (Day 1)

1. **Session Management System**
   - `libs/live-sessions.ts` - KV operations with TTL
   - Session creation, update, cleanup logic
   - Atomic counter operations

2. **User Detection Utilities**
   - `libs/user-detector.ts` - User-agent analysis
   - Location detection from IP/headers
   - Device/browser information extraction

### Phase 2: Data Collection (Day 1-2)

3. **Request Middleware**
   - Update `routes/[...redirect].tsx` to track sessions
   - Add session tracking to all major routes
   - Implement session ID generation and persistence

4. **Background Cleanup**
   - Periodic cleanup of expired sessions
   - Counter synchronization
   - Data consistency maintenance

### Phase 3: UI Components (Day 2)

5. **Homepage Badge**
   - `components/LiveUsersBadge.tsx` - Small counter display
   - Animated number updates
   - User type breakdown on hover

6. **Analytics Dashboard**
   - `routes/live/index.tsx` - Full analytics page
   - Real-time metrics display
   - User type distribution charts

### Phase 4: Real-time Features (Day 2-3)

7. **Server-Sent Events**
   - `routes/api/live-updates.ts` - SSE endpoint
   - `islands/LiveUpdates.tsx` - Client-side updates
   - Connection management and reconnection

8. **Interactive Map**
   - Location-based user distribution
   - Real-time location updates
   - Privacy-compliant location display

## Technical Specifications

### Performance Considerations

- **Session TTL**: 5 minutes (configurable)
- **Update Frequency**: 10 seconds for SSE
- **Cleanup Interval**: Every minute
- **KV Operation Limits**: Max 10 mutations per atomic operation

### Privacy & Security

- **No PII Storage**: Only aggregate location data
- **IP Address**: Not stored, only used for location lookup
- **User Agent**: Stored for classification, not tracking
- **Compliance**: GDPR-friendly anonymous analytics

### API Endpoints

```typescript
// GET /api/live-stats
interface LiveStats {
  total: number;
  byType: Record<UserType, number>;
  byLocation: Record<string, number>;
  trend: { timestamp: number; count: number }[];
}

// GET /api/live-updates (SSE)
interface LiveUpdate {
  type: "count" | "session_start" | "session_end";
  data: LiveStats | SessionEvent;
}
```

### Database Schema (KV)

```typescript
// Session storage with 5-minute TTL
["live_sessions", sessionId] → LiveSession

// Atomic counters
["live_count", "total"] → number
["live_count", "by_type", userType] → number  
["live_count", "by_location", country] → number

// Activity tracking (1-hour TTL)
["live_activity", Math.floor(timestamp/60000)] → sessionId[]

// Configuration
["live_config", "session_ttl"] → number (300000ms default)
["live_config", "update_interval"] → number (10000ms default)
```

## Testing Strategy

### Unit Tests

- User type detection accuracy
- Location parsing from headers
- KV atomic operations
- Session lifecycle management

### Integration Tests

- End-to-end session tracking
- SSE connection handling
- Counter synchronization
- TTL and cleanup operations

### Performance Tests

- Concurrent session handling
- KV operation throughput
- Memory usage monitoring
- SSE connection scaling

## Deployment Considerations

### Environment Variables

```bash
LIVE_TRACKING_ENABLED=true
SESSION_TTL_MS=300000
UPDATE_INTERVAL_MS=10000
GEOIP_API_KEY=<optional>
```

### Monitoring

- Session count metrics
- KV operation success rate
- SSE connection health
- User type distribution trends

### Rollout Plan

1. Deploy infrastructure (no UI)
2. Enable data collection (background)
3. Add homepage badge
4. Launch `/live` dashboard
5. Enable real-time updates

## Future Enhancements

- **Advanced Bot Detection**: Behavioral analysis beyond user-agent
- **Geographic Insights**: City-level mapping and time zone analysis
- **Session Replay**: Anonymous interaction patterns
- **Performance Impact**: Page load time correlation with live users
- **API Rate Limiting**: Protect against abuse
- **Historical Analytics**: Daily/weekly trends and patterns

## Estimated Timeline

- **Day 1**: Core infrastructure + data collection (Tasks 1-4)
- **Day 2**: UI components + basic dashboard (Tasks 5-6)
- **Day 3**: Real-time features + polish (Tasks 7-8)
- **Day 4**: Testing + deployment preparation

Total: **3-4 days** for full implementation
