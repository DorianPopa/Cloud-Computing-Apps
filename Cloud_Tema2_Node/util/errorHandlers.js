module.exports.error = (res, error = 'Internal Server Error', statusCode = 500) => {
    addHeaders(res);

    res.statusCode = statusCode;

    res.end(JSON.stringify({
        status: 'fail',
        error
    }, null, 3));
};

module.exports.success = (res, data = null) => {
    addHeaders(res);

    res.statusCode = 200;

    res.end(JSON.stringify({
        status: 'success',
        data
    }, null, 3));
};

module.exports.created = (res, data = null) => {
    addHeaders(res);

    res.statusCode = 201;
    res.end(JSON.stringify({
        status: 'created',
        data
    }, null, 3));
}

const addHeaders = (res) => {
    return res.setHeader('Content-Type', 'application/json');
}