import dash
from dash import Input, Output, State, html, dcc
import dash_lumino_components as dlc
import dash_bootstrap_components as dbc
import plotly.express as px
import random
import json

df_iris = px.data.iris()
df_gapminder = px.data.gapminder()
df_tips = px.data.tips()

# use font-awesome for icons and boostrap for main style
external_stylesheets = [
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
]
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)


# create a "close all" and a "close random" menu item
menus = [
    dlc.Menu([
        dlc.Command(id="com:closeAll", label="Close All",
                    icon="fa fa-window-restore"),
        dlc.Command(id="com:closeRandom", label="Close Random",
                    icon="fa fa-window-maximize"),
    ], id="openMenu", title="Widgets")]

# define all plots available
widgetCalls = [
    # some gapminder plots
    {
        "id": "gapminder-sunburst",
        "df_type": "gapminder",
        "text": "Life Expectation",
        "df": df_gapminder,
        "dfTrafos": lambda x: x.query("year == 2007"),
        "plotter": px.sunburst,
        "plotParams": {"path": ['continent', 'country'], "values":'pop', "color":'lifeExp', "hover_data":['iso_alpha'], "title": "Life Expectation"},
        "widgetParams": {"title": "Gapminder", "icon": "fa fa-globe", "caption": "Life Expectation"}
    },
    {
        "id": "gapminder-treemap",
        "df_type": "gapminder",
        "text": "Life Expectation Tree",
        "df": df_gapminder,
        "dfTrafos": lambda x: x.query("year == 2007"),
        "plotter": px.treemap,
        "plotParams": {"path": [px.Constant('world'), 'continent', 'country'], "values":'pop', "color":'lifeExp', "hover_data":['iso_alpha'], "title": "Life Expectation"},
        "widgetParams": {"title": "Gapminder", "icon": "fa fa-globe", "caption": "Life Expectation Tree"}
    },
    {
        "id": "gapminder-choropleth",
        "df_type": "gapminder",
        "text": "Life Expectation Map",
        "df": df_gapminder,
        "dfTrafos": lambda x: x,
        "plotter": px.choropleth,
        "plotParams": {"locations": "iso_alpha",  "color": 'lifeExp', "hover_name": "country", "animation_frame": "year", "range_color": [20, 80]},
        "widgetParams": {"title": "Gapminder", "icon": "fa fa-globe", "caption": "Life Expectation Map"}
    },

    # some plots based on iris data
    {
        "id": "iris-scattermatrix",
        "df_type": "iris",
        "text": "Scatter Matrix",
        "df": df_iris,
        "dfTrafos": lambda x: x,
        "plotter": px.scatter_matrix,
        "plotParams": dict(dimensions=["sepal_width", "sepal_length", "petal_width", "petal_length"], color="species"),
        "widgetParams": {"title": "Iris", "icon": "fa fa-leaf", "caption":  "Scatter Matrix"}
    },
    {
        "id": "iris-parallel_coordinates",
        "df_type": "iris",
        "text": "Parallel coordinates",
        "df": df_iris,
        "dfTrafos": lambda x: x,
        "plotter": px.parallel_coordinates,
        "plotParams": dict(color="species_id", labels={"species_id": "Species",
                                                       "sepal_width": "Sepal Width", "sepal_length": "Sepal Length",
                                                       "petal_width": "Petal Width", "petal_length": "Petal Length", },
                           color_continuous_scale=px.colors.diverging.Tealrose, color_continuous_midpoint=2),
        "widgetParams": {"title": "Iris", "icon": "fa fa-leaf", "caption": "Parallel coordinates"}
    },
    {
        "id": "iris-density_contour",
        "df_type": "iris",
        "text": "Density contour plot",
        "df": df_iris,
        "dfTrafos": lambda x: x,
        "plotter": px.density_contour,
        "plotParams": dict(color="species", x="sepal_width", y="sepal_length", marginal_x="box", marginal_y="histogram"),
        "widgetParams": {"title": "Iris", "icon": "fa fa-leaf", "caption": "Density contour plot"}
    },

    # some plots based on tip data
    {
        "id": "tips-parallel_categories",
        "df_type": "tips",
        "text": "Parallel categories",
        "df": df_tips,
        "dfTrafos": lambda x: x,
        "plotter": px.parallel_categories,
        "plotParams": dict(color="size", color_continuous_scale=px.colors.sequential.Inferno),
        "widgetParams": {"title": "Tips", "icon": "fa fa-money", "caption": "Parallel categories"}
    },
    {
        "id": "tips-histogram",
        "df_type": "tips",
        "text": "Total bill histogram",
        "df": df_tips,
        "dfTrafos": lambda x: x,
        "plotter": px.histogram,
        "plotParams": dict(x="total_bill", y="tip", color="sex", marginal="rug", hover_data=df_tips.columns),
        "widgetParams": {"title": "Tips", "icon": "fa fa-money", "caption": "Total bill histogram"}
    },
    {
        "id": "tips-box",
        "df_type": "tips",
        "text": "Total bill box plot",
        "df": df_tips,
        "dfTrafos": lambda x: x,
        "plotter": px.box,
        "plotParams": dict(x="day", y="total_bill", color="smoker", notched=True),
        "widgetParams": {"title": "Tips", "icon": "fa fa-money", "caption": "Total bill box plot"}
    }
]

# create a function to make a boostrap button based on the plot definitions


def getWidgetOpenButton(data):
    return dbc.Button(data["text"], style={"width": "100%"}, id=data["id"]+"-button", className="mb-1")


# create the panels for the left tabbar
gapminderPlotsPanel = dlc.Panel([
    html.H3("Gapminder Plots"),
    html.P(["All plots are based on the ", html.A(
        "gapminder dataset", href="https://www.gapminder.org/data/"), "."]),
    *[getWidgetOpenButton(d) for d in widgetCalls if d["df_type"] == "gapminder"]
], id="gapminder-plots-panel", label="Gapminder", icon="fa fa-globe")

irisPlotsPanel = dlc.Panel([
    html.H3("Iris Plots"),
    html.P(["All plots are based on the ", html.A("iris dataset",
                                                  href="https://en.wikipedia.org/wiki/Iris_flower_data_set"), "."]),
    *[getWidgetOpenButton(d) for d in widgetCalls if d["df_type"] == "iris"]
], id="iris-plots-panel", label="Iris", icon="fa fa-leaf")

tipsPlotsPanel = dlc.Panel([
    html.H3("Tips Plots"),
    html.P(["All plots are based on the ", html.A("tips dataset",
                                                  href="https://vincentarelbundock.github.io/Rdatasets/doc/reshape2/tips.html"), "."]),
    *[getWidgetOpenButton(d) for d in widgetCalls if d["df_type"] == "tips"]
], id="tips-plots-panel", label="Tips", icon="fa fa-money")


configPanel = dlc.Panel([
    html.H3("Dock panel layout"),
    html.Pre("", id="config-json")
], id="config-panel", label="Layout", icon="fa fa-gear")

# create the main layout of the app
app.layout = html.Div([
    dlc.MenuBar(menus, id="main-menu"),
    dlc.BoxPanel([
        dlc.SplitPanel([
            dlc.TabPanel([
                gapminderPlotsPanel,
                irisPlotsPanel,
                tipsPlotsPanel,
                configPanel,
            ],
                id='tab-panel-left',
                tabPlacement="left",
                allowDeselect=True,
                currentIndex=2,
                width=300
            ),
            dlc.DockPanel([], id="dock-panel")
        ], id="split-panel")], id="box-panel", addToDom=True)
])

# a single callback creates different the different plot widgets
@app.callback([
        Output('dock-panel', 'children'),
        Output('config-json', 'children'),
    ],
    [
        *[Input(w["id"]+"-button", "n_clicks") for w in widgetCalls],
        Input("com:closeAll", "n_called"),
        Input("com:closeRandom", "n_called"),
        Input('dock-panel', 'widgetEvent')
    ],
    [State('dock-panel', 'children')])
def handle_widget(*argv):

    # the last argument is the current state of the dock-panel
    widgets = argv[-1]

    # the second last is the widget event
    event = argv[-2]

    # remove all closed widgets
    widgets = [w for w in widgets if not(
        "props" in w and "deleted" in w["props"] and w["props"]["deleted"])]

    # get which component made the callback
    ctx = dash.callback_context

    # check which widget needs to be created
    matching_widget_call = [w for w in widgetCalls if ctx.triggered[0]["prop_id"].startswith(w["id"])]

    # create the widget 
    if len(matching_widget_call) > 0:
        params = matching_widget_call[0]
        fig = params["plotter"](params["dfTrafos"](
            params["df"]), **params["plotParams"])
        new_widget = dlc.Widget(
            dcc.Graph(figure=fig,
                      style={"width": "100%", "height": "100%"}),
            id=params["id"]+"-widget-" + str(ctx.triggered[0]["value"]),
            **params["widgetParams"])
        widgets.append(            new_widget        )

    # close all widgets
    if "prop_id" in ctx.triggered[0] and ctx.triggered[0]["prop_id"] == "com:closeAll.n_called":
        widgets = []

    # close a random widget
    if "prop_id" in ctx.triggered[0] and ctx.triggered[0]["prop_id"] == "com:closeRandom.n_called" and len(widgets) > 0:
        del_idx = random.randint(0, len(widgets)-1)
        del widgets[del_idx]

    status = {
        "event": event,
        "open": [
            w["props"]["id"] for w in widgets if "props" in w and "id" in w["props"]
        ]
    }

    return widgets, json.dumps(status, indent=2)

#start the app
if __name__ == '__main__':
    app.run_server(debug=True)
