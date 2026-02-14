// Request Logger Middleware
// Request loglama middleware'i
// Request logging middleware

/**
 * Request Logger Middleware
 * Gelen tüm request'leri loglar
 * Logs all incoming requests
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();
    
    // Request bilgilerini logla
    // Log request information
    console.log('\n📨 Gelen İstek:');
    console.log(`   Method: ${req.method}`);
    console.log(`   Path: ${req.originalUrl}`);
    console.log(`   IP: ${req.ip}`);
    console.log(`   Time: ${new Date().toISOString()}`);

    // Body varsa logla (hassas bilgileri gizle)
    // Log body if exists (hide sensitive info)
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        // Hassas alanları gizle / Hide sensitive fields
        if (sanitizedBody.password) sanitizedBody.password = '***';
        if (sanitizedBody.apiKey) sanitizedBody.apiKey = '***';
        
        console.log('   Body:', JSON.stringify(sanitizedBody, null, 2));
    }

    // Response bittiğinde süreyi logla
    // Log duration when response finishes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`✅ Yanıt gönderildi: ${res.statusCode} (${duration}ms)`);
    });

    next();
}

/**
 * Development Logger Middleware (sadece development modda çalışır)
 * Development Logger Middleware (only runs in development mode)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function devLogger(req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 DEV MODE - Request Headers:', req.headers);
        console.log('🔧 DEV MODE - Query Params:', req.query);
    }
    next();
}

module.exports = {
    requestLogger,
    devLogger
};
