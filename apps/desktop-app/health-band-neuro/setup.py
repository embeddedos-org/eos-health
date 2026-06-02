from setuptools import setup, find_packages
setup(name="healthband-desktop", version="1.8.0",
      packages=find_packages(where="src"), package_dir={"":"src"},
      install_requires=["numpy","scipy"])
