// Error Handler Middleware
// Hata yönetimi middleware'i
// Error handling middleware

/**
 * Global Error Handler Middleware
 * Tüm hataları yakalar ve uygun HTTP yanıtını döndürür
 * Catches all errors and returns appropriate HTTP response
 * 
 * @param {Error} err - Hata objesi / Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorHandler(err, req, res, next) {
    console.error('\n❌ HATA YAKALANDI:');
    console.error('Mesaj:', err.message);
    console.error('Stack:', err.stack);

    // Hata tiplerine göre uygun status code belirle
    // Determine appropriate status code based on error type
    let statusCode = 500;
    let errorType = 'INTERNAL_SERVER_ERROR';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorType = 'VALIDATION_ERROR';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        errorType = 'NOT_FOUND';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        errorType = 'UNAUTHORIZED';
    } else if (err.message.includes('AI API')) {
        statusCode = 503;
        errorType = 'AI_SERVICE_UNAVAILABLE';
    } else if (err.message.includes('database') || err.message.includes('JSON')) {
        statusCode = 500;
        errorType = 'DATABASE_ERROR';
    }

    // Yanıt döndür
    // Return response
    res.status(statusCode).json({
        mesaj: 'Bir hata oluştu.',
        hata: errorType,
        detay: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

/**
 * 404 Not Found Handler Middleware
 * Tanımlanmamış route'lar için 404 döndürür
 * Returns 404 for undefined routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        mesaj: 'İstenen kaynak bulunamadı.',
        hata: 'NOT_FOUND',
        path: req.originalUrl,
        method: req.method
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
