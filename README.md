# Dash Lumino Components

This package integrates [Lumino Widgets](https://github.com/jupyterlab/lumino), the basis of [JupyterLab](https://github.com/jupyterlab/jupyterlab), into [Plotly's Dash](https://github.com/plotly/dash).





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