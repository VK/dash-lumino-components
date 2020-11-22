import dash_lumino_components as dlc
import dash
from dash.dependencies import Input, Output, State, MATCH
import dash_html_components as html
import dash_core_components as dcc
import dash_bootstrap_components as dbc


external_stylesheets = [
    'http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
]

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)


menus = [dlc.Menu(id="openMenu", title="Widgets", children=[
    dlc.Command(id="com:openwidget", label="Open", icon="fa fa-plus"),
    dlc.Separator(),
    dlc.Menu(id="extraMenu", title="Extra", children=[
        dlc.Command(id="com:closeall", label="Close All", icon="fa fa-minus"),
    ])
])]

app.layout = html.Div([
    dlc.MenuBar(id='menuBar', children=menus)
])



if __name__ == '__main__':
    app.run_server(debug=True)
