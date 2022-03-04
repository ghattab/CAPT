    /*
    handles the file upload for tree creation
    */
    var fileContents=[] ;
    var fileString=[];
    var selectedTreeName;
    var selectedItem;

    

    document.getElementById('fileInput').addEventListener('change', uploadFile, false);
    function uploadFile(e) {
        var allFiles = e.target.files;
        for (var i = 0; i < allFiles.length; i++) {
            var reader = new FileReader();
            getContentCallback();
            reader.onload = function(e) {
                fileContents.push(e.target.result);
            };
            reader.readAsText(allFiles[i]);
            return fileContents;
        };
    };

    /*
    callback function to get the file content
     */
    function getContentCallback() {
        fileString = fileContents;
        return fileString;
    }


    
    document.getElementById('treeSelection').addEventListener('change', selectedTreeName);

    var selectedItem2=document.getElementById('treeSelection');
    function selectedTreeName(e){

        selectedItem2=e.target.value;
        selectedItem=selectedItem2;
        getSelectedTreeCallback();
        alert("Selected Tree : "+ selectedItem);
        return selectedItem;

    }
   

    function getSelectedTreeCallback(){
        selectedTreeName=selectedItem2;
        return selectedTreeName;

    }

    document.getElementById('treeSelection').addEventListener('change', selectedTreeName);


    /*handles the select all button */
    d3.select("#select_all").on("click", selectAllElements);
    function selectAllElements(){
        selectedElements = d3.select("#tree_display").selectAll('g.node').attr("class", "node node-tagged");
        d3.select("#tree_display").selectAll('g.internal-node').attr("class", "internal-node node-tagged");
        d3.select("#tree_display").selectAll('path.branch').attr("class", "branch branch-tagged");
        //console.log(selectedElements);
        return selectedElements;
    }

    d3.select("#createTree").on("click", createTreeFromSelectedTreeData);
 

    /*
    handles the reading of the integrated data
     */
    var archaeaTree1;
    d3.text("data/c__Methanomicrobia.nwk", function (error, data){
        if (error) throw error;
        archaeaTree1=data;
    });

    var archaeaTree2;
    d3.text("data/p__Hadarchaeota.nwk", function (error, data){
        if (error) throw error;
        archaeaTree2=data;
    });

    var bacteriaTree1;
    d3.text("data/f__Actinomycetaceae.nwk", function (error, data){
        if (error) throw error;
        bacteriaTree1=data;
    });

    var bacteriaTree2;
    d3.text("data/f__Shewanellaceae.nwk", function (error, data){
        if (error) throw error;
        bacteriaTree2=data;
    });


    d3.dsv(';')("data/archaea.csv", function(error, data) {
        if (error) throw error;
        taxonomyDataArchaea=data;
    });

    d3.dsv(';')("data/bacteria.csv", function(error, data) {
        if (error) throw error;
        taxonomyDataBacteria=data;
    });

    

    