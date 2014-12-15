from setuptools import setup

version = '1.1.dev0'

long_description = '\n\n'.join([
    open('README.rst').read(),
    open('CREDITS.rst').read(),
    open('CHANGES.rst').read(),
    ])

install_requires = [
    'Django >= 1.4, < 1.7',
    'django-extensions',
    'django-nose',
    'lizard-ui >= 4.0b5',
    'lizard-map',
    #'pyproj',
    'requests',
    'translations',
    ],

tests_require = [
    'nose',
    'coverage',
    'mock',
    ]

setup(name='lizard-elevationprofile',
      version=version,
      description="Draw a line in the map to get an elevation profile",
      long_description=long_description,
      # Get strings from http://www.python.org/pypi?%3Aaction=list_classifiers
      classifiers=['Programming Language :: Python',
                   'Framework :: Django',
                   ],
      keywords=[],
      author='Arjen Vrielink',
      author_email='arjen.vrielink@nelen-schuurmans.nl',
      url='',
      license='GPL',
      packages=['lizard_elevationprofile'],
      include_package_data=True,
      zip_safe=False,
      install_requires=install_requires,
      tests_require=tests_require,
      extras_require={'test': tests_require},
      entry_points={
          'console_scripts': [
          ]},
      )
