# Dash Lumino Components
![Publish release](https://github.com/VK/dash-lumino-components/workflows/Publish%20release/badge.svg)
[![PyPI](https://img.shields.io/pypi/v/dash-lumino-components?logo=pypi)](https://pypi.org/project/dash-lumino-components)
[![npm](https://img.shields.io/npm/v/dash_lumino_components.svg?logo=npm)](https://www.npmjs.com/package/dash_lumino_components)
[![Documentation](https://github.com/VK/dash-lumino-components/workflows/Documentation/badge.svg)](https://vk.github.io/dash-lumino-components)


This package integrates [Lumino Widgets](https://github.com/jupyterlab/lumino), the basis of [JupyterLab](https://github.com/jupyterlab/jupyterlab), into [Plotly's Dash](https://github.com/plotly/dash).

Create a multi-window dash app with just a few lines of code.
Check out the [examples](https://github.com/VK/dash-lumino-components/tree/master/examples):  
![multiplots example](https://raw.githubusercontent.com/VK/dash-lumino-components/master/examples/multiplots.gif)
```python
dlc.MenuBar(menus, id="main-menu"),
dlc.BoxPanel([
    dlc.SplitPanel([
        dlc.TabPanel([
            gapminderPlotsPanel,
            irisPlotsPanel,
            tipsPlotsPanel
        ], id='tab-panel-left'),
        dlc.DockPanel([], id="dock-panel")
    ], id="split-panel")
], id="box-panel", addToDom=True)
```



## Local Developement
1. Install npm packages
    ```
    $ npm install
    ```
    
2. Create a virtual env and activate.
    ```
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```
    $ pip install -r requirements.txt
    $ pip install -r tests/requirements.txt
    ```

4. Build your code
    ```
    $ npm run build
    ```    
