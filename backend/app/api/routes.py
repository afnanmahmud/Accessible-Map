from app.api import bp

@bp.route('/test')
def test():
    return {'message': 'API is working'}
