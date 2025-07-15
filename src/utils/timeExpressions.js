
export function toCronExpression(interval) {
  switch (interval) {
    case '1m': return '*/1 * * * *'
    case '2m': return '*/2 * * * *'
    case '5m': return '*/5 * * * *'
    case '10m': return '*/10 * * * *'
    case '15m': return '*/15 * * * *'
    case '30m': return '*/30 * * * *'
    case '1h': return '0 * * * *'
    case '2h': return '0 */2 * * *'
    
    default: return '*/1 * * * *'
  }
}

export function toCookieExpression(interval) {
  switch (interval) {
    case '30s':  return 30 * 1000;                  // 30 seconds
    case '1m':   return 1 * 60 * 1000;              // 1 minute
    case '1m15s': return (1 * 60 + 15) * 1000;      // 1 min + 15 sec = 75,000 ms
    case '5m':   return 5 * 60 * 1000;              // 5 minutes
    case '15m':  return 15 * 60 * 1000;             // 15 minutes
    case '30m':  return 30 * 60 * 1000;             // 30 minutes
    case '1h':   return 1 * 60 * 60 * 1000;         // 1 hour
    case '3h':   return 3 * 60 * 60 * 1000;
    case '12h':  return 12 * 60 * 60 * 1000;
    case '24h':  return 24 * 60 * 60 * 1000;
    case '25h':  return (24 + 1) * 60 * 60 * 1000;
    case '2d':   return 2 * 24 * 60 * 60 * 1000;
    case '7d':   return 7 * 24 * 60 * 60 * 1000;     // 1 week
    case '30d':  return 30 * 24 * 60 * 60 * 1000;    // ~1 month
    case '90d':  return 90 * 24 * 60 * 60 * 1000;    // ~3 months
    case '1y':   return 365 * 24 * 60 * 60 * 1000;   // 1 year

    default:
      return 24 * 60 * 60 * 1000;
  }
}
