# Context Aware Phylogenetic Trees (CAPT)
An interactive web tool to provide taxonomic context for a given phylogenetic tree.


![](/img/feature.png)


## Features
* upload tree data to the pyhlogenetic tree visualization
* select a tree from the integrated samples
* select a region of interest (ROI) over the phylogenetic tree
* select a domain for the taxonomy view
* visualize the taxonomic context of the ROI with an icicle
* tooltip over the icicle view.
* download resulting icicle as .svg file.


## Source Code
|Script|Description| 
|---|---|
|[scripts/](scripts)| the javascript codes required to deploy the web tool
|[data/](data)| the taxonomy database and the data used for the integrated sample data
|[scripts/d3-body.js](scripts/d3-body.js)| the javascript code that reads the integrated and uploaded data
|[index.html](index.html)| the source libraries and the code script that handle format and structure of the web tool
|[scripts/main.js](scripts/main.js)| the javascript core for the icicle creation and all interactive functionalities
|[scripts/phylotree.js](./scripts/phylotree.js)| the phylotree.js library that creates the phylogenetic tree view 
|[styles/style.css](./styles/style.css)| CSS sheets to style and format phyolgeny and icicle

## Dependencies
This is a web based software. It is implemented using HTML, JavaScript, and CSS. 

The integrated libraries:

|Library|Version|
|---|---|
|bootstrap|3.3.5|
|d3|3|
|highlight.js|9.12.0|
|jquery|3.6.0|
|phylotree.js|n.a|
|underscore.js|1.8.3|

The creation of the phylogenetic tree view is possible thanks to the phylotree.js library.
> Shank, Stephen D., Steven Weaver, and Sergei L. Kosakovsky Pond. "phylotree. js-a JavaScript library for application development and interactive data visualization in phylogenetics." BMC bioinformatics 19.1 (2018): 1-5, https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-018-2283-2


## Data sets
The taxonomy data integrated into the tool includes the complete taxonomy for bacteria and archaea.
It is retrieved from the Genome Taxonomy Database (GTDB). 

The integrated phylogenetic tree data are also retrieved from GTDB.
From the provided reference phylogenetic tree data of GTDB two small samples are extracted for each domain.
The class Methanomicrobia and the phylum Hadarchaeota are retrieved from the reference tree of Archaea.
The family Actinomycetaceae and Schwanellacea are extracted from the reference tree of Bacteria.
This totals four data sets.


## Citation

If you use this software, please consider citing the following paper:
```
TBD
```


## License

Licensed under the MIT Licence,([LICENSE](./LICENSE))
```
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
```
