/**
 * Admin IP Whitelist Middleware
 *
 * In production: set ADMIN_ALLOWED_IPS=your.public.ip in .env
 * In dev: set ADMIN_ALLOWED_IPS=any (no restriction)
 *
 * How to find your public IP:
 *   Visit https://whatismyipaddress.com/ then set:
 *   ADMIN_ALLOWED_IPS=your.ip.here
 */
module.exports = (req, res, next) => {
  const allowed = process.env.ADMIN_ALLOWED_IPS || 'any';

  // Skip restriction in dev mode or if 'any'
  if (allowed === 'any' || process.env.NODE_ENV !== 'production') {
    return next();
  }

  const allowedList = allowed.split(',').map(ip => ip.trim());

  // Get real client IP (handle proxies/Nginx/CloudFlare)
  const clientIp =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    '';

  // Strip IPv6 prefix if present (::ffff:x.x.x.x → x.x.x.x)
  const normalizedIp = clientIp.replace(/^::ffff:/, '');

  if (!allowedList.includes(normalizedIp) && !allowedList.includes(clientIp)) {
    console.warn(`🚫 Blocked admin access attempt from IP: ${normalizedIp}`);
    return res.status(403).json({
      error: 'Access denied.',
    });
  }

  next();
};
