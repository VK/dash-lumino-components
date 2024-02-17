import dash_lumino_components as dlc
import dash
from dash import Input, Output, State, MATCH, ALL, html, dcc
from dash.exceptions import PreventUpdate
import dash_bootstrap_components as dbc
import random
import json


external_stylesheets = [
    'http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
]

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)


def get_test_div(widgetid):
    return html.Div([
        html.Label('Simple Widget'),
        dcc.Input(id={"type": 'my-input', "widget": widgetid},
                  value='initial value', type='text'),
        html.Br(),
        html.Div(id={"type": 'my-output', "widget": widgetid}),
    ])


@app.callback(
    Output(component_id={'type': 'my-output',
                         'widget': MATCH}, component_property='children'),
    [Input(component_id={'type': 'my-input',
                         'widget': MATCH}, component_property='value')]
)
def update_output_div(input_value):
    return 'Output: {}'.format(input_value)


menus = [
    dlc.Menu([
        dlc.Command(id={"type": "com:widget", "type": "open"},
                    label="Open", icon="fa fa-plus"),
        dlc.Separator(),
        dlc.Menu([
            dlc.Command(id={"type": "com:widget", "type": "closeall"}, label="Close All",
                        icon="fa fa-minus"),
            dlc.Command(id={"type": "com:widget", "type": "closeone"}, label="Close One",
                        icon="fa fa-minus"),
        ], id="extraMenu", title="Extra"
        )
    ], id="openMenu", title="Widgets")]

app.layout = html.Div([
    dlc.MenuBar(menus, 'menuBar'),
    dlc.BoxPanel([
        dlc.SplitPanel([
            dlc.TabPanel(
                [
                    dlc.Panel(id="tab-A", children=html.Div([
                        dbc.Button("Open Plot", id="button2",
                                   style={"width": "100%"}),
                    ]), label="Plots", icon="fa fa-bar-chart"),
                    dlc.Panel(id="tab-B", children=html.Div("Dummy Panel B"),
                              label="", icon="fa fa-plus"),
                    dlc.Panel(
                        id="tab-C", children=html.Div([
                            dbc.Button("Stacked", id="stacked-layout-btn", style={"width": "100%", "marginBottom": "1em"}),
                            dbc.Button("Vertical", id="vertical-layout-btn", style={"width": "100%", "marginBottom": "1em"}),
                            dbc.Button("Horizontal", id="horizontal-layout-btn", style={"width": "100%"}),

                            html.H5("Latest Event:"),
                            html.Div("events", id="widgetEvent-output"),

                            html.H5("Current Layout:"),
                            html.Div("layout", id="widgetEvent-layout")

                        ]), label="Layout"),
                ],
                id='tab-panel-left',
                tabPlacement="left",
                allowDeselect=True),

            dlc.DockPanel([
                dlc.Widget(
                    "test", id="initial-widget", title="Hallo", icon="fa fa-folder-open", closable=True, caption="akjdlfjkasdlkfjsajdf"
                ),
                dlc.Widget(
                    "test", id="initial-widget2", title="Hallo", icon="fa fa-folder-open", closable=True, caption="akjdlfjkasdlkfjsajdf"
                )
            ], id="dock-panel", ),

            dlc.TabPanel(
                [
                    dlc.Panel(id="tab-D", children=html.Div([

                        html.Div("start", id="tab-D-output")
                    ]), label="Plots", icon="fa fa-bar-chart")
                ],
                id='tab-panel-right',
                tabPlacement="right",
                allowDeselect=True)

        ], id="splitPanel")
    ], "boxPanel", addToDom=True)
])


@app.callback(Output('tab-panel-right', 'currentIndex'),  Input('button2', 'n_clicks'))
def extra_click(n_clicks):
    # if n_clicks:
    #    return html.Div("clicked: #" + str(n_clicks), style={"background": "#f99"})
    # return "Click me"
    return 0 if n_clicks else -1


@app.callback(Output('tab-D-output', 'children'),  Input('tab-panel-left', 'currentIndex'))
def extra_click(index):
    # if n_clicks:
    #    return html.Div("clicked: #" + str(n_clicks), style={"background": "#f99"})
    # return "Click me"
    return "tabindex: " + str(index)


@app.callback(Output('dock-panel', 'children'), [
    Input({"type": "com:widget", "type": ALL}, "n_called")
], [State('dock-panel', 'children')])
def open_widget(menubutton, widgets):

    open_value = len(widgets)

    widgets = [w for w in widgets if not(
        "props" in w and "deleted" in w["props"] and w["props"]["deleted"])]

    ctx = dash.callback_context
    print("triggered", ctx.triggered)

    if "prop_id" in ctx.triggered[0] and ctx.triggered[0]["prop_id"] == '{"type":"open"}.n_called':
        if open_value is not None:
            new_widget = dlc.Widget(id="newWidget-"+str(open_value), title="Test Widget " +
                                    str(open_value), icon="fa fa-folder-open", children=[get_test_div("testwidget" + str(open_value))])
            return [*widgets, new_widget]

    if "prop_id" in ctx.triggered[0] and ctx.triggered[0]["prop_id"] == '{"type":"closeall"}.n_called':
        return []

    if "prop_id" in ctx.triggered[0] and ctx.triggered[0]["prop_id"] == '{"type":"closeone"}.n_called' and len(widgets) > 0:
        del_idx = random.randint(0, len(widgets)-1)
        print("delete at index: {}".format(del_idx))
        del widgets[del_idx]
        print(widgets)
        return widgets

    return widgets

@app.callback(
        Output('widgetEvent-output', 'children'),
        Input('dock-panel', 'widgetEvent')
)
def widgetEvent(event):
    return json.dumps(event)


@app.callback(
    Output('dock-panel', 'layout'),
    Input('stacked-layout-btn', 'n_clicks'),
    Input('horizontal-layout-btn', 'n_clicks'),
    Input('vertical-layout-btn', 'n_clicks')
)
def update_layout(stacked, horizontal, vertical):

    ctx = dash.callback_context
    print("triggered", ctx.triggered)

    if "stacked" in ctx.triggered[0]["prop_id"]:
        return {"main": {"type": "tab-area", "widgets": ["initial-widget2", "initial-widget"], "currentIndex": 1}}
    if "horizontal" in ctx.triggered[0]["prop_id"]:
        return {"main": {"type": "split-area", "orientation": "horizontal", "children": [{"type": "tab-area", "widgets": ["initial-widget2"], "currentIndex": 0}, {"type": "tab-area", "widgets": ["initial-widget"], "currentIndex": 0}], "sizes": [0.5, 0.5]}}
    if "vertical" in ctx.triggered[0]["prop_id"]:
        return {"main": {"type": "split-area", "orientation": "vertical", "children": [{"type": "tab-area", "widgets": ["initial-widget2"], "currentIndex": 0}, {"type": "tab-area", "widgets": ["initial-widget"], "currentIndex": 0}], "sizes": [0.5, 0.5]}}

    raise PreventUpdate

@app.callback(
        Output('widgetEvent-layout', 'children'),
        Input('dock-panel', 'layout')
)
def widgetEvent(layout):
    print(layout)
    return json.dumps(layout)

if __name__ == '__main__':
    app.run_server(debug=True)
