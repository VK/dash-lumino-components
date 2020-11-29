import json
import os
from setuptools import setup


with open('package.json') as f:
    package = json.load(f)

package_name = package["name"].replace(" ", "_").replace("-", "_")

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name=package_name,
    url="https://github.com/VK/dash-lumino-components",
    version=package["version"],
    author=package['author'],
    packages=[package_name],
    include_package_data=True,
    license=package['license'],
    description=package.get('description', package_name),
    long_description= long_description,
    long_description_content_type="text/markdown",    
    install_requires=["dash"],
    classifiers = [
        'Framework :: Dash',
    ],    
)
