(function (thisObj) {
    var JSON;JSON||(JSON={}); (function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null"; e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+ "}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("", {"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();

    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");
    };

    var SCRIPT_NAME = "Subtitle Manager";
    var SCRIPT_VERSION = "1.2";

    function Script (thisObj) {
        var _this = this;
        _this.name = SCRIPT_NAME;
        _this.version = SCRIPT_VERSION;
        _this.thisObj = thisObj;
    }

    Script.prototype.init = function () {
        var _this = this;
        _this.createMainWindow();
        _this.populateMainWindow();
        _this.showMainWindow();
    };

    /*************************************************************************
     * User Interface Functions **********************************************
     *************************************************************************/
    Script.prototype.createMainWindow = function () {
        var _this = this;
        _this.win = (_this.thisObj instanceof Panel) ? this.thisObj : new Window("palette", _this.name, undefined, {resizeable: true});
        _this.win.alignChildren = ["left","top"];
        _this.win.orientation = "column";
    };

    Script.prototype.populateMainWindow = function () {
        var _this = this;

        var scriptInput = _this.win.add("edittext", [0, 0, 260, 260], "", {multiline: true});

        var buttonGroup = _this.win.add("group");
        buttonGroup.orientation = "row";

        var scriptButton = buttonGroup.add("button", undefined, "Script");
        scriptButton.onClick = function () {
            _this.exportScript(scriptInput.text);
        }

        var markersButton = buttonGroup.add("button", undefined, "Markers");
        markersButton.onClick = function () {
            _this.exportMarkers();
        }

        var exportButton = buttonGroup.add("button", undefined, "Export");
        exportButton.onClick = function () {
            _this.exportSubtitles();
        }

        _this.win.layout.layout(true);
    };

    Script.prototype.showMainWindow = function () {
        var _this = this;
        if (_this.win instanceof Window) {
            _this.win.show();
        } else {
            _this.win.layout.layout(true);
        }
    };

    Script.prototype.exportScript = function (txt) {
        try {
            var script = removeLineBreaks(txt);
                script = removeDoubleSpaces(script);
                script = script.split(" ");

            var newLineArrray = convertScriptToLineArray(script);
            var newFormattedArray = convertLineArrayToFormattedArray(newLineArrray);

            var folder = Folder.desktop;
            var file = new File(folder.toString() + "/Formatted Script.json");
                file.encoding = "UTF-8";
                file.open("W");
                file.write(JSON.stringify(newFormattedArray, undefined, 4));
                file.close();
            file.parent.execute();

            function removeLineBreaks(txt) {
                return txt.replace(/\n|\r/gi," ");
            }

            function removeDoubleSpaces(txt) {
                return txt.replace(/\s\s+/gi," ")
            }

            function lineEndsInPunctuation (line) {
                var c = line.slice(-1);
                return (c === "." || c === "!" || c === "?");
            }

            function convertLineArrayToFormattedArray (lineArray) {
                var lineArrayLength = lineArray.length;
                var formattedArray = [];
                var currentLine = "";
                var nextLine = "";
                for (var i = 0; i < lineArrayLength; i++) {
                    currentLine = lineArray[i];
                    if (lineEndsInPunctuation(currentLine) === true) {
                        formattedArray.push(currentLine);
                    } else {
                        nextLine = lineArray[i + 1];
                        formattedArray.push(currentLine + "\n" + nextLine);
                        i += 1;
                    }
                }
                return formattedArray;
            }

            function convertScriptToLineArray (scriptArray) {
                var scriptArrayLength = scriptArray.length;
                var lineArray = [];
                var currentLine = "";
                var currentWord = "";
                for (var i = 0; i < scriptArrayLength; i++) {
                    currentWord = scriptArray[i];
                    if ((currentLine.length + currentWord.length + 1) <= 35) {
                        currentLine += " " + currentWord;
                        if (lineEndsInPunctuation(currentLine) === true) {
                            lineArray.push(currentLine.trim());
                            currentLine = "";
                        }
                    } else {
                        lineArray.push(currentLine.trim());
                        currentLine = currentWord;
                    }
                }
                return lineArray;
            }
        } catch (err) {
            alert(err);
        }
    };

    Script.prototype.exportMarkers = function () {
        try {
            var markerArray = getMarkerTimes();
            var formattedArray = convertMarkerArrayToFormattedArray(markerArray);

            var folder = Folder.desktop;
            var file = new File(folder.toString() + "/Formatted Markers.json");
                file.encoding = "UTF-8";
                file.open("W");
                file.write(JSON.stringify(formattedArray, undefined, 4));
                file.close();
            file.parent.execute();

            function convertMarkerArrayToFormattedArray (markerArray) {
                var numMarkers = markerArray.length - 1;
                var formattedArray = [];
                var currentMarker = "";
                var nextMarker = "";
                for (var i = 0; i < numMarkers; i++) {
                    currentMarker = markerArray[i];
                    nextMarker = markerArray[i + 1];
                    formattedArray.push(currentMarker + " --> " + nextMarker);
                }
                return formattedArray;
            }

            function timeToTimecode (time) {
                var h = Math.floor(time / 3600);
                var m = Math.floor((time - (h * 3600)) / 60);
                var s = time - (h * 3600) - (m * 60);

                h = (h < 10) ? "0" + h : h;
                m = (m < 10) ? "0" + m : m;
                s = (s < 10) ? "0" + s : s;

                var timecode = h + ":" + m + ":" + s;
                var ms = timecode.substr(8);
                ms = (ms.length === 0) ? 0 : parseFloat(ms);

                return timecode.substr(0,8) + "," + ms.toFixed(3).substr(2);
            }

            function getMarkerTimes () {
                var comp = app.project.activeItem;
                var markers = comp.markerProperty;
                var numMarkers = markers.numKeys;
                var markerTimes = [];
                for (var m = 1; m <= numMarkers; m++) {
                    var time = markers.keyTime(m);
                    var timecode = timeToTimecode(time);
                    markerTimes.push(timecode);
                }
                var time = comp.duration;
                var timecode = timeToTimecode(time);
                markerTimes.push(timecode);
                return markerTimes;
            }
        } catch (err) {
            alert(err);
        }
    };

    Script.prototype.exportSubtitles = function () {
        try {
            var folder = Folder.desktop;
            var sFile = File.openDialog("Select a script file");
            sFile.open("r");
            var sData = JSON.parse(sFile.read());
            sFile.close();
            var mFile = File.openDialog("Select a marker file");
            mFile.open("r");
            var mData = JSON.parse(mFile.read());
            mFile.close();

            var subtitles = "";

            var sLength = sData.length;
            for (var i = 0; i < sLength; i++) {
                var subtitleLine = i + 1;
                var markerLine = mData[i];
                var scriptLine = sData[i];
                subtitles += subtitleLine + "\n" + markerLine + "\n" + scriptLine + "\n\n";
            }

            var file = new File(folder.toString() + "/Formatted Script.srt");
                file.encoding = "UTF-8";
                file.open("W");
                file.write(subtitles);
                file.close();
            file.parent.execute();
        } catch (err) {
            alert(err);
        }
    };

    /*************************************************************************
     * ***********************************************************************
     *************************************************************************/
    var script = new Script(thisObj);
        script.init();

})(this);