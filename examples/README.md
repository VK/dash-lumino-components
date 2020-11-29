# Examples


## multiplots.py
A dash app with a **MenuBar**, **TabPanel** and a main **DockPanel**.
All widgets in the dock can be placed as needed and are filled with dynamic plots:
<img src="https://raw.githubusercontent.com/VK/dash-lumino-components/master/examples/multiplots.gif" width="100%" style="border: 1px solid #ccc; box-shadow: 0 5px 10px #00000066"/>
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