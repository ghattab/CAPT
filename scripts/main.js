
    var taxonomyDataArchaea;
    var taxonomyDataBacteria;
    var selectedElements = [];

    //set color for icicle view
    const colorForIcicles= d3.scale.linear()
        .domain([0,1,2,3,4,5,6])
        .range([ "#2171b5", "#4292c6","#6baed6", "#9ecae1", "#c6dbef","#eff3ff","#ffffff"]); 

    /*
    sorts given data based on its taxon category
    */
    function sortByTaxonName(jsonArr, taxonName){
        let sortedData=d3.nest()
            .key(function (d) {
                if (taxonName === "species") {
                    return d.species;
                }
                if (taxonName === "genus") {
                    return d.genus;
                }
                if (taxonName === "family") {
                    return d.family;
                }
                if (taxonName === "order") {
                    return d.order;
                }
                if (taxonName === "class") {
                    return d.class;
                }
                if (taxonName === "phylum") {
                    return d.phylum;
                }
                if (taxonName === "domain") {
                    return d.domain;
                }
            })
            .entries(jsonArr);
        return sortedData;
    }

    /*
    helper function for the createJsonHierarchyBetweenTwoRanks
     */
    function createLowerRankChildElement(lowerRankArray, j, lowerRankingRoot) {
        let childLowerRanking = {};
        childLowerRanking.name = lowerRankArray[j].key;
        childLowerRanking.size = lowerRankArray[j].values.length;
        lowerRankingRoot.push(childLowerRanking);
    }

    /*
    creates a hierarchy between two given taxa categories as array
     */
    function createJsonHierarchyBetweenTwoRanks(higherRankArray, lowerRankArray, higherRankTaxonName) {
        let higherRankingRoot=[];
        for (let i=0; i<higherRankArray.length; i++) {
            var lowerRankingRoot=[];
            for (let j=0; j<lowerRankArray.length; j++) {
                if (higherRankTaxonName === "genus") {
                    if (higherRankArray[i].key === lowerRankArray[j].values[0].genus) {
                        let childLowerRanking = {};
                        childLowerRanking.name = lowerRankArray[j].key;
                        childLowerRanking.id = lowerRankArray[j].values[0].id;
                        childLowerRanking.size=lowerRankArray[j].values.length;
                        lowerRankingRoot.push(childLowerRanking);
                    }
                }

                if (higherRankTaxonName === "family") {
                    if (higherRankArray[i].key === lowerRankArray[j].values[0].family) {
                        createLowerRankChildElement(lowerRankArray, j, lowerRankingRoot);
                    }
                }
                if (higherRankTaxonName === "order") {
                    if (higherRankArray[i].key === lowerRankArray[j].values[0].order) {
                        createLowerRankChildElement(lowerRankArray, j, lowerRankingRoot);
                    }
                }
                if (higherRankTaxonName === "class") {
                    if (higherRankArray[i].key === lowerRankArray[j].values[0].class) {
                        createLowerRankChildElement(lowerRankArray, j, lowerRankingRoot);
                    }
                }
                if (higherRankTaxonName === "phylum") {
                    if (higherRankArray[i].key === lowerRankArray[j].values[0].phylum) {
                        createLowerRankChildElement(lowerRankArray, j, lowerRankingRoot);
                    }
                }
                if (higherRankTaxonName === "domain") {
                    if (higherRankArray[i].key === lowerRankArray[j].values[0].domain) {
                        createLowerRankChildElement(lowerRankArray, j, lowerRankingRoot);

                    }
                }
            }
            var childHigherRanking={};
            childHigherRanking.name=higherRankArray[i].key;
            childHigherRanking.size=higherRankArray[i].values.length;
            childHigherRanking.children=lowerRankingRoot;
            higherRankingRoot.push(childHigherRanking);
        }
        return higherRankingRoot;
    }


    /*
    passes children of lower rank to the higher rank array
     */
    function passLowerRankAsChildren(higherRankArr, lowerRankArr){
        for (let i=0; i<higherRankArr.length; i++) {
            for (let j = 0; j < higherRankArr[i].children.length; j++) {
                for (let k = 0; k < lowerRankArr.length; k++) {
                    if (higherRankArr[i].children[j].name === lowerRankArr[k].name) {
                        higherRankArr[i].children[j]=lowerRankArr[k];
                    }
                }
            }
        }
        return higherRankArr;
    }

    /*
    creates a complete grouped json object from domain to species based on taxon.
     */
    function createHierarchicalStructureFromAllTaxa(){
        let genusTaxon=createJsonHierarchyBetweenTwoRanks(sortByTaxonName(taxonomyArray, "genus"),
            sortByTaxonName(taxonomyArray,"species"),
            "genus");

        let familyTaxon=createJsonHierarchyBetweenTwoRanks(sortByTaxonName(taxonomyArray, "family"),
            sortByTaxonName(taxonomyArray,"genus"),
            "family");
        passLowerRankAsChildren(familyTaxon, genusTaxon);

        let orderTaxon=createJsonHierarchyBetweenTwoRanks(sortByTaxonName(taxonomyArray, "order"),
            sortByTaxonName(taxonomyArray,"family"),
            "order");
        passLowerRankAsChildren(orderTaxon,familyTaxon);

        let classTaxon=createJsonHierarchyBetweenTwoRanks(sortByTaxonName(taxonomyArray, "class"),
            sortByTaxonName(taxonomyArray,"order"),
            "class");
        passLowerRankAsChildren(classTaxon,orderTaxon);

        let phylumTaxon=createJsonHierarchyBetweenTwoRanks(sortByTaxonName(taxonomyArray, "phylum"),
            sortByTaxonName(taxonomyArray,"class"),
            "phylum");
        passLowerRankAsChildren(phylumTaxon,classTaxon);

        let domainTaxon=createJsonHierarchyBetweenTwoRanks(sortByTaxonName(taxonomyArray, "domain"),
            sortByTaxonName(taxonomyArray,"phylum"),
            "domain");

        return passLowerRankAsChildren(domainTaxon,phylumTaxon);
    }   
   
    /*
    creates array from selected elements of the tree view
    and looks for these elements in the taxonomy data.
     */
    function getSelectedDomainAndItem() {
        taxonomyArray=[];
        selectedDomainArray=[];
        var selectedElements = [];
        var listElements = document.getElementById("domainSelection");
        var selectedElement = listElements.options[listElements.selectedIndex].text;
        if (selectedElement === "Select Domain") {
            alert("Selection is not done, Please select a domain");
        }
        else {
            if (selectedElement.indexOf("Bacteria")!==-1) {
                selectedDomainArray=taxonomyDataBacteria;
            }
            if (selectedElement.indexOf("Archaea")!==-1) {
                selectedDomainArray=taxonomyDataArchaea;
            }

            if (selectedElements.length !== 0) {
                for (var i = 0; i < selectedElements[0].length; i++) {
                    let element = selectedElements[0][i].textContent;
                    for (var j = 0; j < selectedDomainArray.length; j++) {
                        if ((selectedDomainArray[j].id).indexOf(element) !== -1 && element.length>=4) {
                            taxonomyArray.push(selectedDomainArray[j]);
                        }
                    }
                }
            }
            else {
                //for selected branches process match with the csv data based on identification number of species
                var selectedElements = d3.select("#tree_display").selectAll('g.node.node-tagged');
                for (var i = 0; i < selectedElements[0].length; i++) {
                    let element = selectedElements[0][i].textContent;
                    for (var j = 0; j < selectedDomainArray.length; j++) {
                        if ((selectedDomainArray[j].id).indexOf(element) !== -1 && element.length>=4) {
                            //console.log(selectedDomainArray[j])
                            taxonomyArray.push(selectedDomainArray[j]);
                        }
                    }
                }
            }

            if (taxonomyArray.length===0 ) {
                alert("Selected Domain could not matched with the tree!" + "\nPlease check your domain or tree selection");
                return;
            }
            //console.log(taxonomyArray)
            return taxonomyArray;
        }
    }


    /*
    appends scaled svg to the icicle container
     */
    function appendSvgScaled(scaleWidth, scaleHeight) {
        let svg = d3.select("#containerIcicle").append("svg")
            .attr("id", "icicle")
            .attr("class", "icicleView")
            .attr("viewBox", '0 0 ' + scaleWidth + ' ' + scaleHeight)
            .style("font", "15px")
            .style("font-family", "Sans-Serif");
        return svg;
    }


    /*
    creates partition of the icicle views
     */
    function createPartitionForIcicle(width, height) {
        var partition = d3.layout.partition()
            .size([width, height])
            .value(function (d) {
                return d.size;
            });
        return partition;
    }

    /*
    creates icicle from the hierarchically ordered data
    */
    function createIcicle(){

        removeElements();
        getSelectedDomainAndItem();
        let data=createHierarchicalStructureFromAllTaxa();
        const margin = {
            top: 10,
            right: 130,
            bottom:200,
            left: 50
        };

        let scaleWidth=2000;
        let scaleHeight=1500;

        let width=2000 - margin.right - margin.left;
        let height = 1500 - margin.top - margin.bottom;

        //append svg
        var svg = appendSvgScaled(scaleWidth, scaleHeight);

        //create partition
        var partition = createPartitionForIcicle(width, height);

        var nodesIcicle = partition.nodes(data[0]);

        //create rectangles
        createRectForIcicles(svg, nodesIcicle)
            .attr("height", function (d) {
                //adjust the screen space of rect for the lowest rank
                if (d.name.indexOf("s__") !== -1) {
                    return 30;
                } else {
                    return d.dy;
                }
            })
            .attr("id2", function (d) {
                if (d.name.indexOf("s__") !== -1) {
                    return d.id;
                } else {
                    return 0;
                }
            })
            .attr("size", function (d) {
                return d.size;
            })
            .on("click", createSubIcicle);

        //set the position of svg
        svg.attr("transform", "translate( " + margin.left + "," + margin.top + ")");


        //create tooltip div
        var toolTipDiv = d3.select("body").append("toolTipDiv")
            .attr("class", "tooltip")
            .style("display", "none");

        //add text context
        createLabelForIcicle(svg, nodesIcicle)
            .style("font-size", "14px")
            .attr("id2", function (d) {
                if (d.name.indexOf("s__") !== -1) {
                    return d.id;
                } else {
                    return 0;
                }
            })
            .attr("transform", function (d) {
                if (d.name.indexOf("g__") !== -1 || d.name.indexOf("f__") !== -1) {
                    //label the genus and family taxon vertically
                    return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 20) + ")rotate(90)";
                }
                //push the label text out of the rectangle area of species
                if (d.name.indexOf("s__") !== -1) {
                    return "translate(" + (d.x + d.dx / 2) + "," + (d.y + 32) + ")rotate(45)";

                } else {
                    //label all other categories horizontally
                    return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")";
                }
            })
            //when mouse cursor over a label
            .on("mouseover", function (d) {
                toolTipDiv.transition()
                    .duration(50)
                    .style("opacity", 1);
                d3.select(this).transition()
                    .duration('50')
                    .style('fill', '#b56521');
                //put elements in tooltip
                toolTipDiv.html('<b>name : </b>' + d3.select(this)[0][0].__data__.name + '<br>' +
                    '<b>id : </b>' + d3.select(this)[0][0].__data__.id + '<br>' +
                    '<b>size : </b> ' + d3.select(this)[0][0].__data__.size)
                    .style("left", (d3.event.pageX - 200) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
                toolTipDiv.attr("width", 200)
                    .attr("height", 70)
                    .style("opacity", 0)
                    .style("border", "solid")
                    .style("display", "block")
                    .style("stroke", "black");

                //transition just for the species to show the selected elements in phylogenetic tree view
                if ((d3.select(this)[0][0].id).indexOf("s__") !== -1) {
                    let nodeValue = d3.select(this)[0][0].attributes[3].nodeValue;
                    var stringNodeValue = nodeValue.split(/(\s+)/);
                    for (j = 0; j < d3.select("#tree_display").selectAll('g.node.node-tagged')[0].length; j++) {
                        let element = d3.select("#tree_display").selectAll('g.node.node-tagged')[0][j].textContent;
                        if ((element.indexOf(stringNodeValue[0]) !== -1) === true) {
                            var indexOfSelectedElement = j;
                        }
                    }
                    //filter the element based on index
                    d3.select("#tree_display").selectAll('g.node.node-tagged').filter(function (d, i) {
                        return i === indexOfSelectedElement;
                    }).transition()
                        .duration(50)
                        .style("fill", "#b56521");
                }
            })
            //when mouse cursor is removed from a label
            .on("mouseout", function (d) {
                toolTipDiv.transition()
                    .duration(50)
                    .style("opacity", 0);
                d3.select(this).transition()
                    .duration('50')
                    .style('fill', 'black');
                d3.select("#tree_display").selectAll('g.node.node-tagged').transition()
                    .duration(50)
                    .style("fill", function (d) {
                        return d.color;
                    });
            });

        //appends export button after the view is created
        d3.select("#buttonsContainer")
            .select("#buttonsIcicle").append("downloadIcicle")
            .attr("id", "download")
            .attr("class", "buttonsRight")
            .text("Export")
            .on("click", downloadIcicle);
    }

    /*
    filters the taxonomic rankings of selected element
     */
    function speciesClick(speciesName) {
        if (speciesName.indexOf("s__") !== -1) {
            var speciesArray = [];
            for (let i = 0; i < taxonomyArray.length; i++) {
                if (taxonomyArray[i].species === speciesName)
                    speciesArray = taxonomyArray[i];
            }

            var speciesChildren = [];
            var speciesChild = {};
            speciesChild.name = speciesName;
            speciesChild.size = 1;
            speciesChildren.push(speciesChild);

            var genusChildren = [];
            var genusChild = {};
            genusChild.name = speciesArray.genus;
            genusChild.children = speciesChildren;
            genusChildren.push(genusChild);



            var familyChildren = [];
            var familyChild = {};
            familyChild.name = speciesArray.family;
            familyChild.children = genusChildren;
            familyChildren.push(familyChild);


            var orderChildren = [];
            var orderChild = {};
            orderChild.name = speciesArray.order;
            orderChild.children = familyChildren;
            orderChildren.push(orderChild)

            var classChildren = [];
            var classChild = {};
            classChild.name = speciesArray.class;
            classChild.children = orderChildren;
            classChildren.push(classChild);

            var phylumChildren = [];
            var phylumChild = {};
            phylumChild.name = speciesArray.phylum;
            phylumChild.children = classChildren;
            phylumChildren.push(phylumChild);

            var domainChildren = [];
            var domainChild = {};
            domainChild.name = speciesArray.domain;
            domainChild.children = phylumChildren;
            domainChildren.push(domainChild);
            return domainChildren;
        }

    } 
    function genusClick(genusName) {
        if (genusName.indexOf("g__") !== -1) {
            let genusArray = [];
            for (let i = 0; i < taxonomyArray.length; i++) {
                if (taxonomyArray[i].genus === genusName)

                    genusArray = taxonomyArray[i];
            }

            let genusElements = [];
            let childElementGenus = {};
            childElementGenus.name = genusName;
            childElementGenus.size = 1;
            genusElements.push(childElementGenus);

            let familyElements = [];
            let childElementFamily = {};
            childElementFamily.name = genusArray.family;
            childElementFamily.children=genusElements;
            familyElements.push(childElementFamily);

            let orderElements = [];
            let childElementOrder = {};
            childElementOrder.name = genusArray.order;
            childElementOrder.children=familyElements;
            orderElements.push(childElementOrder);

            let classElements = [];
            let childElementClass = {};
            childElementClass.name = genusArray.class;
            childElementClass.children = orderElements;
            classElements.push(childElementClass);

            let phylumChildren = [];
            let phylumChild = {};
            phylumChild.name = genusArray.phylum;
            phylumChild.children = classElements;
            phylumChildren.push(phylumChild);

            let domainChildren = [];
            let domainChild = {};
            domainChild.name = genusArray.domain;
            domainChild.children = phylumChildren;
            domainChildren.push(domainChild);
            return domainChildren;

        }
    } 
    function familyClick(familyName) {
        if (familyName.indexOf("f__") !== -1) {
            let familyArray = [];
            for (let i = 0; i < taxonomyArray.length; i++) {
                if (taxonomyArray[i].family === familyName)

                    familyArray = taxonomyArray[i];
            }

            let familyElements = [];
            let childElementFamily = {};
            childElementFamily.name = familyName;
            childElementFamily.size = 1;
            familyElements.push(childElementFamily);

            let orderElements = [];
            let childElementOrder = {};
            childElementOrder.name = familyArray.order;
            childElementOrder.children=familyElements;
            orderElements.push(childElementOrder);

            let classElements = [];
            let childElementClass = {};
            childElementClass.name = familyArray.class;
            childElementClass.children = orderElements;
            classElements.push(childElementClass);

            let phylumChildren = [];
            let phylumChild = {};
            phylumChild.name = familyArray.phylum;
            phylumChild.children = classElements;
            phylumChildren.push(phylumChild);

            let domainChildren = [];
            let domainChild = {};
            domainChild.name = familyArray.domain;
            domainChild.children = phylumChildren;
            domainChildren.push(domainChild);
            return domainChildren;

        }
    } 
    function orderClick(orderName) {
        if (orderName.indexOf("o__")!==-1) {
            let orderArray=[];
            for (let i=0; i<taxonomyArray.length; i++){
                if (taxonomyArray[i].order===orderName)

                    orderArray=taxonomyArray[i];
            }

            let orderElements=[];
            let childElementOrder={};
            childElementOrder.name=orderName;
            childElementOrder.size=1;
            orderElements.push(childElementOrder);

            let classElements=[];
            let childElementClass={};
            childElementClass.name=orderArray.class;
            childElementClass.children=orderElements;
            classElements.push(childElementClass);

            let phylumChildren=[];
            let phylumChild={};
            phylumChild.name=orderArray.phylum;
            phylumChild.children=classElements;
            phylumChildren.push(phylumChild);

            let domainChildren=[];
            let domainChild={};
            domainChild.name=orderArray.domain;
            domainChild.children=phylumChildren;
            domainChildren.push(domainChild);
            return domainChildren;

        }

    }
    function classClick(className) {
        if (className.indexOf("c__")!==-1) {
            let classArray=[];
            for (let i=0; i<taxonomyArray.length; i++){
                if (taxonomyArray[i].class===className)

                    classArray=taxonomyArray[i];
            }

            let classElements=[];
            let childElementClass={};
            childElementClass.name=className;
            childElementClass.size=1;
            classElements.push(childElementClass);

            let phylumChildren=[];
            let phylumChild={};
            phylumChild.name=classArray.phylum;
            phylumChild.children=classElements;
            phylumChildren.push(phylumChild);

            let domainChildren=[];
            let domainChild={};
            domainChild.name=classArray.domain;
            domainChild.children=phylumChildren;
            domainChildren.push(domainChild);
            return domainChildren;

        }

    } 
    function phylumClick(phylumName) {
        // you click on domain, the text includes prefix d__
        if (phylumName.indexOf("p__")!==-1) {
            let phylumArray=[];
            for (let i=0; i<taxonomyArray.length; i++){
                if (taxonomyArray[i].phylum===phylumName)

                    phylumArray=taxonomyArray[i];
            }

            let phylumElements=[];
            let childElementPhylum={};
            childElementPhylum.name=phylumName;
            childElementPhylum.size=1;
            phylumElements.push(childElementPhylum);

            let domainChildren=[];
            let domainChild={};
            domainChild.name=phylumArray.domain;
            domainChild.children=phylumElements;
            domainChildren.push(domainChild);
            return domainChildren;

        }
    }
    function domainClick(domainName) {
        if (domainName.indexOf("d__")!==-1 || domainName.indexOf("d_")!==-1  ) {
            let domainElements=[];
            let childElementdomain={};
            childElementdomain.name=domainName;
            domainElements.push(childElementdomain);
            return domainElements;
        }
    }

    /*
    appends unscaled svg to the icicle container
     */
    function appendSvgUnscaled(width, height, name) {
        return d3.select("#containerIcicle").append("svg")
            .attr("id", name)
            .attr("width", width)
            .attr("height", height)
            .attr("transform", " translate(50,30)")
            .style("font", "15px sans-serif");
    }

    /*
    appends rectangles to the nodes of an svg
     */
    function createRectForIcicles(svg, nodes) {
        return svg.selectAll(".node")
            .data(nodes)
            .enter().append("rect")
            .attr("class", "rectangles")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("width", function (d) {
                return d.dx;
            })
            .attr("id", function (d) {
                return d.name;
            })
            .style("fill", function (d) {
                return colorForIcicles(d.depth);
            })
            .style("stroke", "#4a4545");
    } 
    
    /*
    creates text label for the rectangular areas
     */
    function createLabelForIcicle(svg, nodes) {
        return svg.selectAll(".label")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("id", function(d) {
                return d.name;})
            .attr("dy", ".33em")
            .style("font-family", "sans-serif")
            .style("font-weight", "normal")
            .text(function (d) {
                return d.name;
            });
    } 

    /*
    creates subIcicle view
     */
    function createSubIcicle() {
        removeElements();
        //append export button
        d3.select("#buttonsIcicle").append("downloadSubIcicle")
            .attr("id", "download2")
            .attr("class", "buttonsRight")
            .text("Export")
            .on("click", downloadSubIcicle);

        let width = 450 ;
        let height = 500 ;


        //create svg
        let svg = appendSvgUnscaled(width, height, "subIcicle");

        //create partition
        let partition = createPartitionForIcicle(width, height);

        var rect=d3.select(this);
        var name=rect[0][0].id;

        if (domainClick(name)) {
            var arrDomain=domainClick(name);
            var nodes=partition.nodes(arrDomain[0]);
        }
        else if(phylumClick(name)) {
            var arrPhylum=phylumClick(name);
            var nodes=partition.nodes(arrPhylum[0]);
        }
        else if(classClick(name)) {
            var arrClass=classClick(name);
            var nodes=partition.nodes(arrClass[0]);
        }
        else if(orderClick(name)) {
            var arrOrder=orderClick(name);
            var nodes=partition.nodes(arrOrder[0]);
        }
        else if(familyClick(name)) {
            var arrFamily=familyClick(name);
            var nodes=partition.nodes(arrFamily[0]);
        }
        else if(genusClick(name)) {
            var arrGenus=genusClick(name);
            var nodes=partition.nodes(arrGenus[0]);
        }
        else {
            var arrSpecies=speciesClick(name);
            var nodes = partition.nodes(arrSpecies[0]);
        }

        //create rectangles
        createRectForIcicles(svg, nodes)
            .attr("height", function(d) { return d.dy; })
            .on("click", subIcicleClick);


        //add text content
        createLabelForIcicle(svg,nodes)
            .style("font-size", "12px")
            .attr("transform", function(d) { return "translate(" + (d.x + d.dx/3 ) + "," + (d.y + d.dy/2 ) + ")"; });


    }
 
    
    /*
    creates icicle if subIcicle is clicked
     */
    function subIcicleClick(){
        createIcicle();
    } 




    var tree = d3.layout.phylotree()


    /* creates Default Tree */
   /*  function getDefaultTreeCallback(){
        var defaultTree;
        d3.text("data/p__Hadarchaeota.nwk", function (error, data){
            if (error) throw error;
            defaultTree=data;
            return createTreeView(defaultTree);
        });
    }
    getDefaultTreeCallback() */


   

    document.addEventListener('readystatechange', event => {
        // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
        if (event.target.readyState === "complete") {
            function getDefaultTreeCallback(){
                var defaultTree;
                d3.text("data/p__Hadarchaeota.nwk", function (error, data){
                    if (error) throw error;
                    defaultTree=data;
                    return createTreeView(defaultTree);
                });   
            }
            getDefaultTreeCallback()
        }
    })

    var checkGet 

    $(window).on('load', function() {

        //console.log('Everything loaded')
        setTimeout (function() {

            function defaultIcicle(){
                var pathDefault = d3.select("#tree_display").selectAll('path.branch')
                pathDefault.each(function(d, i){
                    if (i <= 17){
                        d3.select(this)
                        .attr("class", "branch branch-tagged")
                    }    
                    })
                pathDefault.each(function(d, i){
                    if(i <= 7){
                        d3.select(this)
                        .classed("branch-tagged", false)
                    }
                })
    
                var defaultElements = d3.select("#tree_display").selectAll('g.node')
    
                var elements = defaultElements.each(function(d, i){
                    if (i <= 5){
                        d3.select(this)
                            .attr('class', 'node node-tagged')                       
                    }
                })
    
                var elementsOnpageload
                elementsOnpageload = elements[0].splice(0,6)
                //console.log(elementsOnpageload)
                return elementsOnpageload
    
            }
    
            checkGet = defaultIcicle()
            //console.log(checkGet)
            function getDefaultIcicle(){
                defaultTaxaArray = [];
                defaultDomainArray = [];
    
                defaultDomainArray=taxonomyDataArchaea;
    
                for (var i = 0; i < checkGet.length; i++) {
                    let element = checkGet[i].textContent;
                    for (var j = 0; j < defaultDomainArray.length; j++) {
                        if ((defaultDomainArray[j].id).indexOf(element) !== -1 && element.length>=4) {
                            //console.log(selectedDomainArray[j])
                            defaultTaxaArray.push(defaultDomainArray[j]);
                        }
                    }
                }
                //console.log(defaultTaxaArray)
                return defaultTaxaArray
    
            }
            getDefaultIcicle()
    
            createIcicle(getDefaultIcicle())

        }, 1000)
    })

 
    /*
    creates Tree from an uploaded file.
     */
    function createTreeFromUploadedData() {
        removeElements();
        var treeStringArray = getContentCallback();
        var lenghtOfTheArray=treeStringArray.length;
        var treeString=treeStringArray[lenghtOfTheArray-1];

        if (typeof treeString==='undefined' || !treeString) {
            alert("No Tree is specified, please upload a tree");
        }
        else
        {
            tree.svg(d3.select("#tree_display"))
                .radial(false);

                //toolBar()
            

            tree((treeString))
                .layout();
            d3.select("#icicle").remove();
        }
        $('#treeSelection').val('None');
        

        d3.select("#createTaxonomy").on("click", createIcicle);

    }


    /*
    creates tree from selected tree element in the database or from an uploaded tree data.
     */
    function createTreeFromSelectedTreeData(){
        var treeStringSelected;
        if (selectedTreeName.length!==0) {
            if (getSelectedTreeCallback() === "c_Methanomicrobia") {
                treeStringSelected = archaeaTree1;
                return createTreeView(treeStringSelected);

            }
            if (getSelectedTreeCallback() === "p_Hadarchaeota") {
                treeStringSelected = archaeaTree2;
                return createTreeView(treeStringSelected);

            }
            if (getSelectedTreeCallback() === "f__Actinomycetaceae") {
                treeStringSelected = bacteriaTree1;
                return createTreeView(treeStringSelected);

            }
            if (getSelectedTreeCallback() === "f__Shewanellaceae") {
                treeStringSelected = bacteriaTree2;
                return createTreeView(treeStringSelected);
            }

        }

        var uploadedData=getContentCallback();
        if (uploadedData.length!==0 || uploadedData[uploadedData.length-1]!=='undefined') {
            return createTreeFromUploadedData();
        }
    }

    /*
    removes the elements that are not relevant for the selected view.
     */
    function removeElements() {
        d3.select("#icicle").remove();
        d3.select("#subIcicle").remove();
        d3.select("#download").remove();
        d3.select("#download2").remove();
    }


    function sort_nodes (asc) {
        tree.traverse_and_compute (function (n) {
                var d = 1;
                if (n.children && n.children.length) {
                    d += d3.max (n.children, function (d) { return d["count_depth"];});
                }
                n["count_depth"] = d;
            }); 
            tree.resort_children (function (a,b) {
                return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
            });
    }
      

    function createTreeView(name) {
        removeElements();
        tree.svg(d3.select("#tree_display"))
        .radial(false);

        toolBar()

        tree((name))
            .layout();


        d3.select("#createTaxonomy").on("click", createIcicle);
        selectedTreeName="";
    } 

   
    function toolBar(){
        $(".phylotree-align-toggler").on ("change", function (e) {
            if ($(this).is(':checked')) {
                if (tree.align_tips ($(this).data ("align") == "right")) {
                    tree.placenodes().update ();
                }
            }
        });

        $ ("[data-direction]").on ("click", function (e) {
            var which_function = $(this).data ("direction") == 'vertical' ? tree.spacing_x : tree.spacing_y;
            which_function (which_function () + (+ $(this).data ("amount"))).update();
        }); 

       $("#sort_original").on ("click", function (e) {
            tree.resort_children (function (a,b) {
                return a["original_child_order"] - b["original_child_order"];
            });
        });

        $("#sort_ascending").on ("click", function (e) {
            sort_nodes (true);
        });
        
        $("#sort_descending").on ("click", function (e) {
            sort_nodes (false);
        });

    } 
    /*Toggle toolbar */
    function toggleBtn() {
        var toggleButton = document.getElementById('toggleBTN');
        var x = document.getElementById("toolBar");
        if (x.style.display === "block") {
          x.style.display = "none";
          toggleButton.innerHTML = 'Show Toolbar';
        } else {
          x.style.display = "block";
          toggleButton.innerHTML = 'Hide Toolbar';
        }
    } 




    /*
    downloads svg
     */
    function downloadSvg(svgToExport) {
        svgToExport.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        let exportDataFromSvg = svgToExport.outerHTML;
        let preface = '<?xml version="1.0" standalone="no"?>\r\n';
        let svgBlob = new Blob([preface, exportDataFromSvg], {type: "image/svg+xml;charset=utf-8"});
        let svgUrl = URL.createObjectURL(svgBlob);
        let linkForDownload = document.createElement("a");
        linkForDownload.href = svgUrl;
        linkForDownload.download = "image";
        document.body.appendChild(linkForDownload);
        linkForDownload.click();
        document.body.removeChild(linkForDownload);
    }
    /*
    downloads the Icicle View
     */
    function downloadIcicle() {
        let svgToExport = document.getElementById("icicle");
        downloadSvg(svgToExport);
    } 
    /*
    downloads the SubIcicle View
     */
    function downloadSubIcicle() {
        let svgToExport = document.getElementById("subIcicle");
        downloadSvg(svgToExport);
    }

    