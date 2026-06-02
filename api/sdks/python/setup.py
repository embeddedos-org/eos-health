from setuptools import setup, find_packages

setup(
    name="eos-health",
    version="1.0.0",
    description="Official Python SDK for the EoS Health Developer API",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="EoS Health",
    author_email="api@eoshealth.io",
    url="https://developers.eoshealth.io",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=["requests>=2.28.0"],
    extras_require={
        "async": ["httpx>=0.24.0"],
        "dev": ["pytest", "pytest-mock", "responses"],
    },
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Scientific/Engineering :: Medical Science Apps.",
    ],
    keywords="health wearable api eos ecg hrv spo2 glucose",
    project_urls={
        "Documentation": "https://developers.eoshealth.io/docs",
        "API Reference": "https://developers.eoshealth.io/api",
        "GitHub": "https://github.com/embeddedos-org/eos-health",
    },
)
