//组件的管理类

var WinIndex = (function() {

    var WIndex = function () {
        var winIndex = 10100 ;
        this.getIndex = function() {
            return winIndex +=10;
        };
    };

    var instance;
    var singleton = {
        getInstance : function() {
            if (instance == undefined) {
                instance = new WIndex();
            }
            return instance;
        }
    };
    return singleton ;
})();