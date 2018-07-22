import nexosisapi
from dateutil import date_parser
from config import AppConfig

def run_tip_prediction():
    appConfig = AppConfig()
    client = nexosisapi.Client(appConfig.nexosis_key)

    with open('/static/dist/tips.csv') as f:
        result = client.datasets.create_csv('prev-tips', f)

    session = client.sessions.create_forecast(
        'prev-tips', 'transactions',
        date_parser.parse('2017-01-22 00:00:00 -0:00'),
        date_parser.parse('2017-02-22 00:00:00 -0:00'))
    # after some time passes you can get results...
    results = client.sessions.get_results(session.session_id)
    return results
