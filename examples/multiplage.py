from dash import Dash
import dash_lumino_components as dlc
from dash import Input, Output, ALL, html



# common style
external_stylesheets = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
]


menus = [
    dlc.Menu([
        dlc.Command(id={"type": "changePage", "url": "/page1"}, label="Page 1", icon="fa fa-1"),
        dlc.Command(id={"type": "changePage", "url": "/page2"}, label="Page 2", icon="fa fa-2"),
    ], id="openMenu", title="Widgets")]


# Create first Dash app
app = Dash(__name__, url_base_pathname='/page1/', external_stylesheets=external_stylesheets)
app.layout = html.Div([
    dlc.MenuBar(menus, 'menuBar'),
    dlc.BoxPanel([ ], id="boxPanel", addToDom=True)
])


# Create second Dash app
app2 = Dash(__name__, server=app.server, url_base_pathname='/page2/', external_stylesheets=external_stylesheets)
app2.layout = html.Div([
    dlc.MenuBar(menus, 'menuBar'),
    dlc.BoxPanel([ ], id="boxPanel", addToDom=True)
])



for a in [app, app2]:
    a.clientside_callback(
        """
        function(buttons) {

            ctx = window.dash_clientside.callback_context;
        
            try {
                // Extract the triggered input
                triggered_input = JSON.parse(ctx.triggered[0].prop_id.replace(".n_called", "")).url;

                console.log(triggered_input);
                window.location.href = triggered_input;
            } catch (error) {}

            return [];
        }
        """,
        Output('boxPanel', 'children'),
        Input({"type": "changePage", "url": ALL}, "n_called")
    )

# Run the Flask server
if __name__ == '__main__':
    app.run_server(debug=True)