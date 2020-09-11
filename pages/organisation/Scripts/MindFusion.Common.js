(function(dependencies, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(dependencies, definition);
    else return definition();
}([], function() {
    var MsAjaxImpl = {
        registerNamespace: function(a) {
            Type.registerNamespace(a)
        },
        registerClass: function(type, typeName, baseType, interfaceTypes) {
            if (baseType == "Control") {
                baseType = Sys.UI.Control
            }
            if (Sys.__registeredTypes && Sys.__registeredTypes[typeName]) {
                Sys.__registeredTypes[typeName] = false
            } else {
                if (window.__registeredTypes && window.__registeredTypes[typeName]) {
                    window.__registeredTypes[typeName] = false
                }
            }
            var prms = [typeName];
            if (baseType !== undefined) {
                prms.push(baseType);
                if (interfaceTypes) {
                    if (typeof interfaceTypes == "string") {
                        try {
                            interfaceTypes = eval(interfaceTypes);
                            prms.push(interfaceTypes)
                        } catch (err) {}
                    } else {
                        prms.push(interfaceTypes)
                    }
                }
            }
            Type.prototype.registerClass.apply(type, prms)
        },
        registerDisposableObject: function(a) {
            Sys.Application.registerDisposableObject(a)
        },
        initializeBase: function(c, b, a) {
            c.initializeBase(b, a)
        },
        callBaseMethod: function(d, b, c, a) {
            return d.callBaseMethod(b, c, a)
        },
        isInstanceOfType: function(b, a) {
            return b.isInstanceOfType(a)
        },
        parseType: function(a) {
            return Type.parse(a)
        },
        inheritsFrom: function(a, b) {
            return a.inheritsFrom(b)
        },
        createControl: function(e, d, c, b, a) {
            return Sys.Component.create(e, d, c, b, a)
        },
        findControl: function(b, a) {
            return Sys.Application.findComponent(b, a)
        },
        addHandler: function(a, b, c) {
            a.eventHandlers.addHandler(b, c)
        },
        getHandler: function(a, b) {
            return a.eventHandlers.getHandler(b)
        },
        removeHandler: function(a, b, c) {
            if (!a) {
                return
            }
            if (a.eventHandlers) {
                a.eventHandlers.removeHandler(b, c)
            } else {
                if (a._events) {
                    $removeHandler(a, b, c)
                }
            }
        },
        eventHandlerList: function() {
            return new Sys.EventHandlerList()
        },
        addHandlers: function(c, b, d, a) {
            $addHandlers(c, b)
        },
        clearHandlers: function(a) {
            $clearHandlers(a)
        },
        createDelegate: function(a, b) {
            return Function.createDelegate(a, b)
        },
        createCallback: function(b, a) {
            return Function.createCallback(b, a)
        },
        getBounds: function(a) {
            var b = Sys.UI.DomElement.getBounds(a);
            return new MindFusion.Drawing.Rect(b.x, b.y, b.width, b.height)
        },
        fromJson: function(a) {
            return Sys.Serialization.JavaScriptSerializer.deserialize(a)
        },
        toJson: function(a) {
            return Sys.Serialization.JavaScriptSerializer.serialize(a)
        },
        ajaxRequest: function(b, a, d, e) {
            var c = new XMLHttpRequest();
            thisObj = b;
            c.onreadystatechange = function() {
                if (c.readyState == 4 && c.status == 200) {
                    var f = mflayer.fromJson(mflayer.fromJson(c.responseText).d);
                    e.apply(b, [f])
                }
            };
            c.open("POST", a);
            c.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            c.send(d)
        }
    };
    var JQueryImpl = {
        registerNamespace: function(e) {
            var a = window;
            var f = e.split(".");
            for (var c = 0; c < f.length; c++) {
                var b = f[c];
                var d = a[b];
                if (!d) {
                    d = a[b] = {}
                }
                a = d
            }
        },
        registerClass: function(d, a, e, f) {
            if (e == "Control") {
                e = MindFusion.Dom.Control
            }
            d.prototype.constructor = d;
            d.__typeName = a;
            if (e) {
                d.__baseType = e;
                for (var c in e.prototype) {
                    var b = e.prototype[c];
                    if (!d.prototype[c]) {
                        d.prototype[c] = b
                    }
                }
            }
        },
        registerDisposableObject: function(a) {
            $(window).on("unload", function() {
                a.dispose()
            })
        },
        initializeBase: function(c, b, a) {
            var d = c.__baseType;
            if (d) {
                if (!a) {
                    d.apply(b)
                } else {
                    d.apply(b, a)
                }
            }
        },
        callBaseMethod: function(e, c, d, b) {
            var f = e.__baseType;
            if (f) {
                var a = f.prototype[d];
                if (a) {
                    if (!b) {
                        return a.apply(c)
                    } else {
                        return a.apply(c, b)
                    }
                }
            }
        },
        isInstanceOfType: function(b, a) {
            if (!a) {
                return false
            }
            if (a instanceof b) {
                return true
            }
            var c = a.constructor.__baseType;
            while (c) {
                if (c === b) {
                    return true
                }
                c = c.__baseType
            }
            return false
        },
        parseType: function(typeName) {
            if (!typeName) {
                return null
            }
            var fn = eval(typeName);
            if (typeof(fn) == "function") {
                return fn
            }
        },
        inheritsFrom: function(a, c) {
            var b = a.__baseType;
            while (b) {
                if (b === c) {
                    return true
                }
                b = b.__baseType
            }
            return false
        },
        createControl: function(e, d, c, b, a) {
            var f = new e(a, d);
            f._element = a;
            this.registerDisposableObject(f);
            $(a).data("MindFusion", f);
            f.initialize();
            return f
        },
        findControl: function(c, b) {
            var a;
            if (b) {
                a = $(b).children("#" + c)
            } else {
                a = $("#" + c)
            }
            if (a) {
                return a.data("MindFusion")
            }
            return null
        },
        getEvent: function(a, b, c) {
            if (a.eventHandlers[b] == undefined) {
                if (!c) {
                    return null
                }
                a.eventHandlers[b] = []
            }
            return a.eventHandlers[b]
        },
        addHandler: function(a, b, c) {
            if (!a.eventHandlers) {
                a.eventHandlers = this.eventHandlerList()
            }
            var d = this.getEvent(a, b, true);
            d.push(c)
        },
        getHandler: function(a, b) {
            var c = this.getEvent(a, b);
            if (!c || (c.length === 0)) {
                return null
            }
            return function(f, d) {
                var e = c.length;
                while (e--) {
                    c[e](f, d)
                }
            }
        },
        removeHandler: function(a, b, d) {
            if (!a) {
                return
            }
            if (a.eventHandlers) {
                var e = this.getEvent(a, b);
                if (!e) {
                    return
                }
                var c = e.indexOf(d);
                if (c > -1) {
                    e.splice(c, 1)
                }
            } else {
                $(a).unbind(b, d)
            }
        },
        eventHandlerList: function() {
            return new MindFusion.Collections.Dictionary()
        },
        addHandlers: function(c, b, f, a) {
            for (var d in b) {
                $(c).bind(d, b[d])
            }
        },
        clearHandlers: function(a) {
            $(a).unbind()
        },
        createDelegate: function(a, b) {
            return $.proxy(b, a)
        },
        createCallback: function(b, a) {
            return function() {
                var c = arguments.length;
                if (c > 0) {
                    var d = [];
                    for (var e = 0; e < c; e++) {
                        d[e] = arguments[e]
                    }
                    d[c] = a;
                    return $.proxy(b.apply(this, d), a)
                }
                return $.proxy(b, a)
            }
        },
        getBounds: function(e) {
            var b = $(e).offset();
            var d = $.fn.jquery;
            var a = d.split(".");
            if ((a[0] == 1 && a[1] < 9)) {
                var f = parseFloat($.css(document.body, "borderTopWidth")) || 0;
                var c = parseFloat($.css(document.body, "borderLeftWidth")) || 0;
                b.top += f;
                b.left += c
            }
            return new MindFusion.Drawing.Rect(b.left, b.top, $(e).width(), $(e).height())
        },
        fromJson: function(a) {
            if (JSON) {
                return JSON.parse(a)
            } else {
                throw new Error("JSON is undefined.")
            }
        },
        toJson: function(a) {
            if (JSON) {
                return JSON.stringify(a)
            } else {
                throw new Error("JSON is undefined.")
            }
        },
        ajaxRequest: function(b, a, c, d) {
            $.ajax({
                type: "POST",
                url: a,
                data: c,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                context: b,
                success: function(f) {
                    var e = mflayer.fromJson(f.d);
                    d.apply(this, [e])
                },
                error: function() {
                    alert("Ajax error")
                }
            })
        }
    };
    var StandAloneImpl = {
        registerNamespace: function(e) {
            var a = window;
            var f = e.split(".");
            for (var c = 0; c < f.length; c++) {
                var b = f[c];
                var d = a[b];
                if (!d) {
                    d = a[b] = {}
                }
                a = d
            }
        },
        registerClass: function(d, a, e, f) {
            if (e == "Control") {
                e = MindFusion.Dom.Control
            }
            d.prototype.constructor = d;
            d.__typeName = a;
            if (e) {
                d.__baseType = e;
                for (var c in e.prototype) {
                    var b = e.prototype[c];
                    if (!d.prototype[c]) {
                        d.prototype[c] = b
                    }
                }
            }
        },
        registerDisposableObject: function(a) {
            window.addEventListener("unload", function() {
                a.dispose()
            })
        },
        initializeBase: function(c, b, a) {
            var d = c.__baseType;
            if (d) {
                if (!a) {
                    d.apply(b)
                } else {
                    d.apply(b, a)
                }
            }
        },
        callBaseMethod: function(e, c, d, b) {
            var f = e.__baseType;
            if (f) {
                var a = f.prototype[d];
                if (a) {
                    if (!b) {
                        return a.apply(c)
                    } else {
                        return a.apply(c, b)
                    }
                }
            }
        },
        isInstanceOfType: function(b, a) {
            if (!a) {
                return false
            }
            if (a instanceof b) {
                return true
            }
            var c = a.constructor.__baseType;
            while (c) {
                if (c === b) {
                    return true
                }
                c = c.__baseType
            }
            return false
        },
        parseType: function(typeName) {
            if (!typeName) {
                return null
            }
            var fn = eval(typeName);
            if (typeof(fn) == "function") {
                return fn
            }
        },
        inheritsFrom: function(a, c) {
            var b = a.__baseType;
            while (b) {
                if (b === c) {
                    return true
                }
                b = b.__baseType
            }
            return false
        },
        createControl: function(e, d, c, b, a) {
            if (!this.MindFusionControls) {
                this.MindFusionControls = new MindFusion.Collections.Dictionary()
            }
            var f = new e(a, d);
            f._element = a;
            this.registerDisposableObject(f);
            this.MindFusionControls.set(a.id, f);
            f.initialize();
            return f
        },
        findControl: function(e, b) {
            var a = document.getElementById(e);
            if (a) {
                try {
                    var d = this.MindFusionControls.get(a.id);
                    return d
                } catch (c) {
                    return null
                }
            }
            return null
        },
        getEvent: function(a, b, c) {
            if (a.eventHandlers[b] == undefined) {
                if (!c) {
                    return null
                }
                a.eventHandlers[b] = []
            }
            return a.eventHandlers[b]
        },
        addHandler: function(a, b, c) {
            if (!a.eventHandlers) {
                a.eventHandlers = this.eventHandlerList()
            }
            var d = this.getEvent(a, b, true);
            d.push(c)
        },
        getHandler: function(a, b) {
            var c = this.getEvent(a, b);
            if (!c || (c.length === 0)) {
                return null
            }
            return function(f, d) {
                var e = c.length;
                while (e--) {
                    c[e](f, d)
                }
            }
        },
        removeHandler: function(a, b, d) {
            if (!a) {
                return
            }
            if (a.eventHandlers) {
                var e = this.getEvent(a, b);
                if (!e) {
                    return
                }
                var c = e.indexOf(d);
                if (c > -1) {
                    e.splice(c, 1)
                }
            } else {
                a.removeEventListener(b, d)
            }
        },
        eventHandlerList: function() {
            return new MindFusion.Collections.Dictionary()
        },
        addHandlers: function(c, b, f, a) {
            for (var d in b) {
                c.addEventListener(d, b[d])
            }
        },
        clearHandlers: function(a) {
            for (var b in a.eventHandlers) {
                a.removeEventListener(a.eventHandlers[b], a.eventHandlers[b])
            }
        },
        createDelegate: function(a, c) {
            var b = function() {
                return c.apply(a, arguments)
            };
            return b
        },
        createCallback: function(c, a) {
            var b = this;
            return function() {
                var d = arguments.length;
                if (d > 0) {
                    var e = [];
                    for (var f = 0; f < d; f++) {
                        e[f] = arguments[f]
                    }
                    e[d] = a;
                    return b.createDelegate(a, c.apply(this, e))
                }
                return b.createDelegate(a, c)
            }
        },
        getBounds: function(b) {
            var d = b.getBoundingClientRect();
            var e = b.ownerDocument.documentElement;
            var c = b.ownerDocument.body;
            var a = Math.round(d.left) + (e.scrollLeft || c.scrollLeft);
            var f = Math.round(d.top) + (e.scrollTop || c.scrollTop);
            return new MindFusion.Drawing.Rect(a, f, d.width, d.height)
        },
        fromJson: function(a) {
            if (JSON) {
                return JSON.parse(a)
            } else {
                throw new Error("JSON is undefined.")
            }
        },
        toJson: function(a) {
            if (JSON) {
                return JSON.stringify(a)
            } else {
                throw new Error("JSON is undefined.")
            }
        },
        ajaxRequest: function(b, a, d, e) {
            var c = new XMLHttpRequest();
            thisObj = b;
            c.onreadystatechange = function() {
                if (c.readyState == 4 && c.status == 200) {
                    var f = mflayer.fromJson(mflayer.fromJson(c.responseText).d);
                    e.apply(b, [f])
                }
            };
            c.open("POST", a);
            c.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            c.send(d)
        }
    };
    if (typeof $break == "undefined") {
        $break = {}
    }
    if (typeof MindFusionImpl == "undefined") {
        MindFusionImpl = "StandAlone"
    }
    var checkImplementation = function(a) {
        for (var b in MsAjaxImpl) {
            if (MsAjaxImpl[b] instanceof Function) {
                if (a[b] == undefined || !(a[b] instanceof Function)) {
                    throw new Error("Abstract layer implementation does not implement interface member " + b)
                }
            }
        }
        return true
    };
    if (MindFusionImpl == "MsAjax") {
        mflayer = MsAjaxImpl
    } else {
        if (MindFusionImpl == "JQuery") {
            mflayer = JQueryImpl
        } else {
            if (MindFusionImpl == "StandAlone") {
                mflayer = StandAloneImpl
            } else {
                if (MindFusionImpl instanceof Object) {
                    if (checkImplementation(MindFusionImpl)) {
                        mflayer = MindFusionImpl
                    }
                } else {
                    if (typeof MindFusionImpl == "string") {
                        var impl = eval(MindFusionImpl);
                        if (checkImplementation(impl)) {
                            mflayer = impl
                        }
                    }
                }
            }
        }
    }
    mflayer.registerNamespace("MindFusion");
    MindFusion.AbstractionLayer = mflayer;
    MindFusion.registerNamespace = function(a) {
        MindFusion.AbstractionLayer.registerNamespace(a)
    };
    MindFusion.registerClass = function(b, a, c, d) {
        MindFusion.AbstractionLayer.registerClass(b, a, c, d)
    };
    MindFusion.find = function(a) {
        return MindFusion.AbstractionLayer.findControl(a)
    };
    MindFusion.registerNamespace("MindFusion.Dom");
    (function(a) {
        var b = a.Control = function(c) {
            this._element = c
        };
        b.prototype = {
            dispose: function() {},
            get_element: function() {
                return this._element
            }
        };
        MindFusion.registerClass(b, "MindFusion.Dom.Control")
    })(MindFusion.Dom);
    if (!MindFusion.EventArgs || !MindFusion.EventArgs.__typeName) {
        MindFusion.EventArgs = function() {
            mflayer.initializeBase(MindFusion.EventArgs, this)
        };
        MindFusion.EventArgs.prototype = {};
        MindFusion.registerClass(MindFusion.EventArgs, "MindFusion.EventArgs");
        MindFusion.EventArgs.Empty = new MindFusion.EventArgs()
    }
    if (!MindFusion.CancelEventArgs || !MindFusion.CancelEventArgs.__typeName) {
        MindFusion.CancelEventArgs = function() {
            mflayer.initializeBase(MindFusion.CancelEventArgs, this)
        };
        MindFusion.CancelEventArgs.prototype = {
            get_cancel: function() {
                return this._cancel
            },
            set_cancel: function(a) {
                this._cancel = a
            }
        };
        MindFusion.registerClass(MindFusion.CancelEventArgs, "MindFusion.CancelEventArgs", MindFusion.EventArgs)
    }
    if (!MindFusion.Builder || !MindFusion.Builder.__typeName) {
        MindFusion.Builder = function(c, b, a) {
            mflayer.initializeBase(MindFusion.Builder, this);
            this.prototypeClass = c;
            this.diagram = b;
            this.instance = a;
            this.generate()
        };
        MindFusion.Builder.prototype = {
            generate: function() {
                var d = Object.keys(this.prototypeClass);
                d = d.filter(function(g) {
                    return MindFusion.Builder.isGetSetter(d, g)
                });
                var a = {};
                for (var c in d) {
                    var b = d[c].split("get")[1];
                    var f = b.charAt(0).toLowerCase() + b.slice(1);
                    var e = "var propName = '" + f + "' + 'Value'; var prop2Name = '" + f + "' + 'Assigned'; var funcName = 'set' + '" + b + "'; this[propName] = value; this[prop2Name] = true; if (this.instance != null) 	this.instance[funcName](value); return this;";
                    this[f] = new Function("value", e);
                    if (f == "font") {
                        e = "var propName = '" + f + "' + 'Value'; var prop2Name = '" + f + "' + 'Assigned'; var funcName = 'set' + '" + b + "'; if (arguments.length == 2) { value = new MindFusion.Drawing.Font(name, size); }else value = arguments[0]; this[propName] = value; this[prop2Name] = true; if (this.instance != null) 	this.instance[funcName](value); return this;";
                        this[f] = new Function("name", "size", e)
                    }
                    if (f == "brush") {
                        e = "var propName = '" + f + "' + 'Value'; var prop2Name = '" + f + "' + 'Assigned'; var funcName = 'set' + '" + b + "'; if (arguments.length == 3) { value = {type:'LinearGradientBrush', color1:color1, color2: color2, angle:coord1};}else if (arguments.length == 4) { value = {type:'RadialGradientBrush', color1:color1, color2: color2, radius1: coord1, radius2: coord2};}else value = arguments[0]; this[propName] = value; this[prop2Name] = true; if (this.instance != null) 	this.instance[funcName](value); return this;";
                        this[f] = new Function("color1", "color2", "coord1", "coord2", e)
                    }
                }
            },
            create: function() {
                var b = this.prototypeClass.getType();
                var e = mflayer.parseType(b);
                if (!e) {
                    return null
                }
                var h = new e(this.diagram);
                var a = Object.keys(this);
                a = a.filter(function(i) {
                    return MindFusion.Builder.isAssignment(a, i)
                });
                for (var d in a) {
                    var c = a[d].split("Assigned")[0];
                    var g = this[c + "Value"];
                    var f = "set" + c.charAt(0).toUpperCase() + c.slice(1);
                    if (h[f]) {
                        h[f](g)
                    }
                }
                return h
            },
            setInstance: function(b) {
                this.instance = b;
                var a = Object.keys(this);
                a = a.filter(function(e) {
                    return MindFusion.Builder.isAssignment(a, e)
                });
                for (var d in a) {
                    var c = a[d].split("Assigned")[0];
                    delete this[a[d]];
                    delete this[c + "Value"]
                }
            }
        };
        MindFusion.Builder.isGetSetter = function(c, b) {
            if (b.indexOf("get") !== 0) {
                return false
            }
            var a = b.split("get")[1];
            var d = "set" + a;
            return c.indexOf(d) > -1
        };
        MindFusion.Builder.isAssignment = function(c, b) {
            if (b.indexOf("Assigned") == -1) {
                return false
            }
            var a = b.split("Assigned")[0];
            var d = a + "Value";
            return c.indexOf(d) > -1
        };
        MindFusion.registerClass(MindFusion.Builder, "MindFusion.Builder")
    }
    MindFusion.registerNamespace("MindFusion.Collections");
    (function(b) {
        var a = b.ArrayList = function() {
            var d = new Array();
            var c = b.Utilities;
            d.indexOf = c.indexOf;
            d.remove = c.remove;
            d.contains = c.contains;
            d.any = c.any;
            d.all = c.all;
            d.forEach = c.forEach;
            d.forReverse = c.forReverse;
            return d
        };
        a.indexOf = function(d, c) {
            return d.indexOf(c)
        };
        a.add = function(d, c) {
            d.push(c)
        };
        a.insert = function(e, c, d) {
            e.splice(c, 0, d)
        };
        a.remove = function(e, d) {
            var c = e.indexOf(d);
            if (c > -1) {
                e.splice(c, 1);
                return true
            }
            return false
        };
        a.removeAt = function(d, c) {
            if (c > -1) {
                d.splice(c, 1);
                return true
            }
            return false
        };
        a.contains = function(d, c) {
            return d.indexOf(c) > -1
        };
        a.forEach = function(h, g, c) {
            for (var f = 0, d = h.length; f < d; f++) {
                var e = h[f];
                if (typeof(e) !== "undefined") {
                    g.call(c, e, f, h)
                }
            }
        };
        a.clone = function(c) {
            return c.slice(0)
        };
        a.addRange = function(f, d) {
            for (var e = 0, c = d.length; e < c; e++) {
                f.push(d[e])
            }
        }
    })(MindFusion.Collections);
    (function(b) {
        var a = b.Dictionary = function() {
            this.table = new b.HashTable()
        };
        a.prototype.set = function(c, e) {
            var d = this.table.get(c);
            if (d == null) {
                d = this.table.add(c)
            }
            d.value = e
        };
        a.prototype.get = function(c) {
            var d = this.table.get(c);
            if (d != null) {
                return d.value
            }
            throw new Error("Cannot find key " + c)
        };
        a.prototype.contains = function(c) {
            return this.table.contains(c)
        };
        a.prototype.remove = function(c) {
            return this.table.remove(c)
        };
        a.prototype.getCount = function() {
            return this.table.count
        };
        a.prototype.forEach = function(c, d) {
            this.table.forEach(function(e) {
                c.call(d, e.key, e.value)
            })
        };
        a.prototype.forEachValue = function(c, d) {
            this.table.forEach(function(e) {
                c.call(d, e.value)
            })
        };
        a.prototype.forEachKey = function(c, d) {
            this.table.forEach(function(e) {
                c.call(d, e.key)
            })
        };
        a.prototype.keys = function() {
            var c = new Array();
            this.forEachKey(function(d) {
                c.push(d)
            });
            return c
        };
        MindFusion.registerClass(a, "MindFusion.Collections.Dictionary")
    })(MindFusion.Collections);
    (function(b) {
        var a = b.Grid = function(c, d) {
            this.clear();
            if (c > 0 && d > 0) {
                this.resize(c, d)
            }
        };
        a.prototype = {
            clone: function() {
                var g = new a(this.columns, this.rows);
                for (var f = 0; f < this.columns; f++) {
                    for (var e = 0; e < this.rows; e++) {
                        var d = this.get(f, e);
                        if (d) {
                            if (d.clone) {
                                g.set(f, e, d.clone())
                            } else {
                                g.set(f, e, d)
                            }
                        }
                    }
                }
                return g
            },
            get: function(c, d) {
                return this.data[c][d]
            },
            set: function(c, e, d) {
                this.data[c][e] = d
            },
            clear: function() {
                this.data = [];
                this.columns = 0;
                this.rows = 0
            },
            resize: function(d, e) {
                this.columns = d;
                this.rows = e;
                this.data.length = d;
                for (var c = 0; c < d; c++) {
                    if (!this.data[c]) {
                        this.data[c] = []
                    }
                    this.data[c].length = e
                }
            },
            deleteColumn: function(c) {
                this.data.splice(c, 1);
                this.columns--
            },
            insertColumn: function(c) {
                this.data.splice(c, 0, []);
                this.columns++;
                this.data[c].length = this.rows
            },
            deleteRow: function(d) {
                for (var c = 0; c < this.columns; c++) {
                    this.data[c].splice(d, 1)
                }
                this.rows--
            },
            insertRow: function(d) {
                for (var c = 0; c < this.columns; c++) {
                    this.data[c].splice(d, 0, null)
                }
                this.rows++
            }
        };
        MindFusion.registerClass(a, "MindFusion.Collections.Grid")
    })(MindFusion.Collections);
    (function(a) {
        var b = a.HashTable = function() {
            this.buckets = new Array();
            this.size = 100;
            this.count = 0
        };
        b.prototype.add = function(c) {
            this.count++;
            var e = this.bucket(c);
            var d = {
                key: c
            };
            e.push(d);
            return d
        };
        b.prototype.get = function(d) {
            var e = this.bucket(d);
            var c = this.indexInBucket(d, e);
            if (c == -1) {
                return null
            }
            return e[c]
        };
        b.prototype.contains = function(c) {
            var d = this.get(c);
            return d != null
        };
        b.prototype.remove = function(d) {
            var f = this.bucket(d);
            var c = this.indexInBucket(d, f);
            if (c == -1) {
                return null
            }
            this.count--;
            var e = f[c];
            f.splice(c, 1);
            return e
        };
        b.prototype.forEach = function(e) {
            for (var c = 0; c < this.buckets.length; ++c) {
                var f = this.buckets[c];
                if (f == undefined) {
                    continue
                }
                for (var d = 0; d < f.length; ++d) {
                    e(f[d])
                }
            }
        };
        b.prototype.bucket = function(d) {
            var c = this.hashCode(d) % this.size;
            var e = this.buckets[c];
            if (e === undefined) {
                e = new Array();
                this.buckets[c] = e
            }
            return e
        };
        b.prototype.indexInBucket = function(d, f) {
            for (var c = 0; c < f.length; ++c) {
                var e = f[c];
                if (e.key === d) {
                    return c
                }
            }
            return -1
        };
        b.prototype.hashCode = function(c) {
            if (typeof c == "number") {
                return c & c
            }
            if (typeof c == "string") {
                return this.hashString(c)
            }
            if (typeof c == "object") {
                return this.objectId(c)
            }
            throw new Error("Key type not supported.")
        };
        b.prototype.hashString = function(e) {
            var f = 0;
            if (e.length == 0) {
                return f
            }
            for (var c = 0; c < e.length; c++) {
                var d = e.charCodeAt(c);
                f = ((f << 5) - f) + d;
                f = f & f
            }
            return Math.abs(f)
        };
        b.prototype.objectId = function(c) {
            var d = c._mf_autoId;
            if (d === undefined) {
                d = b.objectIdCounter++;
                c._mf_autoId = d
            }
            return d
        };
        b.objectIdCounter = 0;
        MindFusion.registerClass(b, "MindFusion.Collections.HashTable")
    })(MindFusion.Collections);
    (function(a) {
        var b = a.ItemEventArgs = function(c) {
            mflayer.initializeBase(b, this);
            this._item = c
        };
        b.prototype.get_item = function() {
            return this._item
        };
        MindFusion.registerClass(b, "MindFusion.Collections.ItemEventArgs", MindFusion.EventArgs)
    })(MindFusion.Collections);
    (function(c) {
        var b = MindFusion.Collections.ArrayList;
        var a = c.ObservableCollection = function() {
            mflayer.initializeBase(a, this);
            this.eventHandlers = new mflayer.EventHandlerList()
        };
        a.prototype.add = function(f) {
            b.add(this, f);
            var e = mflayer.getHandler(this, "itemAdded");
            var d = new MindFusion.Collections.ItemEventArgs(f);
            e(this, d)
        };
        a.prototype.add_itemAdded = function(d) {
            mflayer.addHandler(this, "itemAdded", d)
        };
        a.prototype.remove_itemAdded = function(d) {
            mflayer.removeHandler(this, "itemAdded", d)
        };
        MindFusion.registerClass(a, "MindFusion.Collections.ObservableCollection", Array)
    })(MindFusion.Collections);
    (function(b) {
        var a = b.PriorityQueue = function(c) {
            this.heap = [null];
            this.size = 0;
            this.compareFunction = c
        };
        a.prototype = {
            add: function(c) {
                this.heap.push(null);
                this.heap[++this.size] = c;
                this.fixUp(this.size)
            },
            popMin: function() {
                this.swap(1, this.size);
                this.fixDown(1, this.size - 1);
                return this.heap[this.size--]
            },
            changePriority: function(d) {
                var c = this.heap.indexOf(d);
                this.fixUp(c);
                this.fixDown(c, this.size)
            },
            swap: function(e, c) {
                var d = this.heap[e];
                this.heap[e] = this.heap[c];
                this.heap[c] = d
            },
            fixUp: function(c) {
                while (c > 1 && this.more(Math.floor(c / 2), c)) {
                    this.swap(c, Math.floor(c / 2));
                    c = Math.floor(c / 2)
                }
            },
            fixDown: function(c, e) {
                while (2 * c <= e) {
                    var d = 2 * c;
                    if (d < e && this.more(d, d + 1)) {
                        d++
                    }
                    if (!this.more(c, d)) {
                        break
                    }
                    this.swap(c, d);
                    c = d
                }
            },
            empty: function() {
                return this.size == 0
            },
            more: function(d, c) {
                if (this.compareFunction) {
                    return this.compareFunction(this.heap[d], this.heap[c]) > 0
                }
                return this.heap[d] > this.heap[c]
            }
        };
        MindFusion.registerClass(a, "MindFusion.Collections.PriorityQueue")
    })(MindFusion.Collections);
    (function(b) {
        var a = b.Queue = function() {
            this.head = null;
            this.tail = null;
            this.size = 0
        };
        a.prototype.enqueue = function(d) {
            var c = {
                value: d,
                next: null
            };
            if (this.head == null) {
                this.head = c;
                this.tail = this.head
            } else {
                this.tail.next = c;
                this.tail = this.tail.next
            }
            this.size++
        };
        a.prototype.dequeue = function() {
            if (this.size < 1) {
                throw new Error("Queue is empty.")
            }
            var c = this.head.value;
            this.head = this.head.next;
            this.size--;
            return c
        };
        a.prototype.getSize = function() {
            return this.size
        };
        MindFusion.registerClass(a, "MindFusion.Collections.Queue")
    })(MindFusion.Collections);
    (function(b) {
        var a = b.Set = function() {
            this.table = new b.HashTable()
        };
        a.prototype.add = function(c) {
            var d = this.table.get(c);
            if (d == null) {
                d = this.table.add(c)
            }
        };
        a.prototype.contains = function(c) {
            return this.table.contains(c)
        };
        a.prototype.remove = function(c) {
            var d = this.table.remove(c);
            if (d) {
                return true
            }
            return false
        };
        a.prototype.getCount = function() {
            return this.table.count
        };
        a.prototype.forEach = function(c, d) {
            this.table.forEach(function(e) {
                c.call(d, e.key)
            })
        };
        MindFusion.registerClass(a, "MindFusion.Collections.Set")
    })(MindFusion.Collections);
    MindFusion.Collections.Utilities = {
        indexOf: function(b) {
            for (var a = 0; a < this.length; ++a) {
                if (this[a] === b) {
                    return a
                }
            }
            return -1
        },
        remove: function(b) {
            var a = this.indexOf(b);
            if (a > -1) {
                this.splice(a, 1)
            }
        },
        contains: function(a) {
            return this.indexOf(a) > -1
        },
        any: function(a, c) {
            for (var b = 0; b < this.length; ++b) {
                if (a.call(c, this[b])) {
                    return this[b]
                }
            }
            return null
        },
        all: function(b, d) {
            var a = [];
            for (var c = 0; c < this.length; ++c) {
                if (b.call(d, this[c])) {
                    a.push(this[c])
                }
            }
            return a
        },
        forEach: function(b, c) {
            for (var a = 0; a < this.length; ++a) {
                if (b.call(c, this[a]) === $break) {
                    break
                }
            }
        },
        forReverse: function(b, c) {
            for (var a = this.length - 1; a >= 0; a--) {
                if (b.call(c, this[a]) === $break) {
                    break
                }
            }
        },
        mapTo: function(c, e, b) {
            for (var a = 0, d = c.length; a < d; a++) {
                e.push(b(c[a]))
            }
        }
    };
    MindFusion.registerNamespace("MindFusion.Geometry");
    (function(a) {
        a.cartesianToPolar = function(c, b) {
            if (c === b) {
                return {
                    a: 0,
                    r: 0
                }
            }
            var f = b.x - c.x;
            var e = b.y - c.y;
            var g = a.distance(c, b);
            var d = Math.atan(-e / f);
            if (f < 0) {
                d += Math.PI
            }
            return {
                a: d,
                r: g
            }
        };
        a.cartesianToPolarDegrees = function(c, b) {
            var d = a.cartesianToPolar(c, b);
            d.a = a.radianToDegree(d.a);
            return d
        };
        a.polarToCartesian = function(b, c) {
            if (c.r == 0) {
                return b
            }
            return {
                x: b.x + Math.cos(c.a) * c.r,
                y: b.y - Math.sin(c.a) * c.r
            }
        };
        a.polarToCartesianDegrees = function(b, c) {
            var d = {
                a: a.degreeToRadian(c.a),
                r: c.r
            };
            return a.polarToCartesian(b, d)
        };
        a.rotatePoint = function(b, c, e) {
            var d = a.cartesianToPolar(c, b);
            d.a += e;
            return a.polarToCartesian(c, d)
        };
        a.distance = function(e, d) {
            var c = e.x - d.x;
            var b = e.y - d.y;
            return Math.sqrt(c * c + b * b)
        };
        a.radianToDegree = function(b) {
            return b * 180 / Math.PI
        };
        a.degreeToRadian = function(b) {
            return b * Math.PI / 180
        };
        a.polylineIntersectsRect = function(q, p) {
            var o = MindFusion.Drawing.Point;
            for (var k = 0, g = q.length; k < g; k++) {
                if (p.containsPoint(q[k])) {
                    return true
                }
            }
            var m = [];
            m.push(new o(p.x, p.y));
            m.push(new o(p.right(), p.y));
            m.push(new o(p.right(), p.bottom()));
            m.push(new o(p.x, p.bottom()));
            for (var k = 0, f = q.length - 1; k < f; ++k) {
                for (var h = 0; h < 4; ++h) {
                    var c = q[k];
                    var b = q[k + 1];
                    var e = m[h];
                    var d = m[(h + 1) % 4];
                    if (MindFusion.Diagramming.Utils.intersect(c, b, e, d)) {
                        return true
                    }
                }
            }
            return false
        };
        a.polylinesIntersect = function(h, e) {
            for (var k = 0; k < h.length - 1; k++) {
                var c = h[k];
                var b = h[k + 1];
                for (var g = 0; g < e.length - 1; g++) {
                    var f = e[g];
                    var d = e[g + 1];
                    if (MindFusion.Diagramming.Utils.intersect(c, b, f, d)) {
                        return true
                    }
                }
            }
            return false
        };
        a.getEllipseIntr = function(w, n, m) {
            var s = m.clone();
            var l = MindFusion.Drawing.Rect;
            var t = l.fromLTRB(n.x, n.y, m.x, m.y);
            var v = n.x;
            var f = n.y;
            var u = m.x;
            var d = m.y;
            if (Math.abs(v - u) > 0.0001) {
                var g = (w.left() + w.right()) / 2;
                var e = (w.top() + w.bottom()) / 2;
                var k = (w.right() - w.left()) / 2;
                var j = (w.bottom() - w.top()) / 2;
                var E = (f - d) / (v - u);
                var z = (v * d - u * f) / (v - u);
                var r = j * j + E * E * k * k;
                var q = 2 * E * (z - e) * k * k - 2 * g * j * j;
                var p = j * j * g * g + k * k * (z - e) * (z - e) - k * k * j * j;
                var y, x, i, h;
                var o = Math.sqrt(q * q - 4 * r * p);
                y = (-q + o) / (2 * r);
                x = (-q - o) / (2 * r);
                i = E * y + z;
                h = E * x + z;
                if (f == d) {
                    i = h = f
                }
                s.x = y;
                s.y = i;
                if (s.x >= t.left() && s.x <= t.right() && s.y >= t.top() && s.y <= t.bottom()) {
                    return s
                }
                s.x = x;
                s.y = h;
                if (s.x >= t.left() && s.x <= t.right() && s.y >= t.top() && s.y <= t.bottom()) {
                    return s
                }
            } else {
                var g = (w.left() + w.right()) / 2;
                var e = (w.top() + w.bottom()) / 2;
                var k = (w.right() - w.left()) / 2;
                var j = (w.bottom() - w.top()) / 2;
                var c = v;
                var i = e - Math.sqrt((1 - (c - g) * (c - g) / (k * k)) * j * j);
                var h = e + Math.sqrt((1 - (c - g) * (c - g) / (k * k)) * j * j);
                s.x = c;
                s.y = i;
                if (s.x >= t.left() && s.x <= t.right() && s.y >= t.top() && s.y <= t.bottom()) {
                    return s
                }
                s.x = c;
                s.y = h;
                if (s.x >= t.left() && s.x <= t.right() && s.y >= t.top() && s.y <= t.bottom()) {
                    return s
                }
            }
            return s
        };
        a.calcAngle = function(f, d, c, b) {
            var g = Math.atan2(f.y - d.y, f.x - d.x);
            var e = Math.atan2(c.y - b.y, c.x - b.x);
            g = 180 * g / Math.PI;
            e = 180 * e / Math.PI;
            var h = g - e;
            if (h < -180) {
                h = 360 + h
            }
            if (h > 180) {
                h = h - 360
            }
            return h
        }
    })(MindFusion.Geometry);
    (function(a) {
        var c = MindFusion.Collections.ArrayList;
        var d = a.Circle = function(e, g, f) {
            this.x = e;
            this.y = g;
            this.r = f
        };
        d.fromPoints = function(m) {
            if (m.length == 2) {
                return fromTwoPoints(m[0], m[1])
            }
            if (m.length == 3) {
                return fromThreePoints(m[0], m[1], m[2])
            }
            var h = {
                x: 0,
                y: Number.MAX_VALUE
            };
            c.forEach(m, function(n) {
                if (n.y < h.y) {
                    h = n
                }
            });
            var i = Number.MAX_VALUE;
            var g = null;
            c.forEach(m, function(n) {
                if (h == n) {
                    return
                }
                var o = {
                    x: n.x,
                    y: h.y
                };
                var p = b(h, n, o);
                if (p < i) {
                    i = p;
                    g = n
                }
            });
            var l = new MindFusion.Collections.Set();
            while (true) {
                i = Number.MAX_VALUE;
                var e = null;
                c.forEach(m, function(n) {
                    if (h == n || g == n || l.contains(n)) {
                        return
                    }
                    var o = b(n, h, g);
                    if (o < i) {
                        i = o;
                        e = n
                    }
                });
                var f = i;
                var j = b(h, g, e);
                var k = Math.PI - f - j;
                if (f < Math.PI / 2 && j < Math.PI / 2 && k < Math.PI / 2) {
                    return d.fromThreePoints(h, g, e)
                }
                if (f >= Math.PI / 2) {
                    return d.fromTwoPoints(h, g)
                }
                if (j >= Math.PI / 2) {
                    l.add(h);
                    h = e
                } else {
                    if (k >= Math.PI / 2) {
                        l.add(g);
                        g = e
                    } else {
                        return null
                    }
                }
            }
        };
        d.fromThreePoints = function(s, q, o) {
            if (s.x == q.x) {
                var v = o;
                o = q;
                q = v
            } else {
                if (o.x == q.x) {
                    var v = s;
                    s = q;
                    q = v
                }
            }
            var h = s.x;
            var m = s.y;
            var g = q.x;
            var k = q.y;
            var f = o.x;
            var i = o.y;
            var p = (k - m) / (g - h);
            var n = (i - k) / (f - g);
            if (n == p) {
                return null
            }
            var l = (p * n * (m - i) + n * (h + g) - p * (g + f)) / (2 * (n - p));
            var j = p != 0 ? -(l - (h + g) / 2) / p + (m + k) / 2 : -(l - (g + f) / 2) / n + (k + i) / 2;
            var w = l - h;
            var u = j - m;
            var e = Math.sqrt(w * w + u * u);
            return new d(l, j, e)
        };
        d.fromTwoPoints = function(j, i) {
            var e = (j.x + i.x) / 2;
            var k = (j.y + i.y) / 2;
            var g = e - j.x;
            var f = k - j.y;
            var h = Math.sqrt(g * g + f * f);
            return new d(e, k, h)
        };

        function b(i, g, f) {
            if (g.x == f.x && g.y == f.y) {
                return 0
            }
            var j = a.distance(i, g);
            var h = a.distance(i, f);
            var e = a.distance(g, f);
            return Math.acos((j * j + h * h - e * e) / (2 * j * h))
        }
        a.distance = function(h, g) {
            var f = h.x - g.x;
            var e = h.y - g.y;
            return Math.sqrt(f * f + e * e)
        };
        MindFusion.registerClass(d, "MindFusion.Geometry.Circle")
    })(MindFusion.Geometry);
    MindFusion.registerNamespace("MindFusion.Drawing");
    (function(a) {
        a.Visibility = {
            Hidden: 0,
            Collapsed: 1,
            Visible: 2
        };
        a.LayoutAlignment = {
            Near: 0,
            Center: 1,
            Far: 2,
            Stretch: 3
        };
        a.DashStyle = {
            Solid: 0,
            Dash: 1,
            Dot: 2,
            DashDot: 3,
            DashDotDot: 4,
            Custom: 5,
            apply: function(b, c) {
                if (!b.setLineDash) {
                    return
                }
                var d = 2 / b._mf_scale;
                if (c == 1) {
                    b.setLineDash([4 * d, d])
                } else {
                    if (c == 2) {
                        b.setLineDash([d, d])
                    } else {
                        if (c == 3) {
                            b.setLineDash([4 * d, d, d, d])
                        } else {
                            if (c == 4) {
                                b.setLineDash([4 * d, d, d, d, d, d])
                            } else {
                                b.setLineDash([])
                            }
                        }
                    }
                }
            }
        };
        a.ImageAlign = {
            Center: 0,
            Fit: 1,
            Stretch: 2,
            Tile: 3,
            TopLeft: 4,
            BottomLeft: 5,
            TopRight: 6,
            BottomRight: 7,
            TopCenter: 8,
            BottomCenter: 9,
            MiddleLeft: 10,
            MiddleRight: 11
        };
        a.FontStyle = {
            Regular: 0,
            Bold: 1,
            Italic: 2,
            Underline: 4
        }
    })(MindFusion.Drawing);
    (function(b) {
        var a = b.Thickness = function(f, e, d, c) {
            this.left = f;
            this.top = e;
            this.right = d;
            this.bottom = c
        };
        a.prototype = {
            applyTo: function(e) {
                var d = e.width - this.width();
                if (d > 0) {
                    e.x += this.left;
                    e.width = d
                }
                var c = e.height - this.height();
                if (c > 0) {
                    e.y += this.top;
                    e.height = c
                }
            },
            addToRect: function(c) {
                c.x -= this.left;
                c.y -= this.top;
                c.width += this.width();
                c.height += this.height()
            },
            width: function() {
                return this.right + this.left
            },
            height: function() {
                return this.bottom + this.top
            }
        };
        a.copy = function(c) {
            return new a(c.left, c.top, c.right, c.bottom)
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Thickness")
    })(MindFusion.Drawing);
    (function(b) {
        var a = b.Size = function(d, c) {
            this.width = d;
            this.height = c
        };
        a.prototype = {
            empty: function() {
                return (this.width === 0 && this.height === 0)
            }
        };
        a.copy = function(c) {
            return new a(c.width, c.height)
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Size")
    })(MindFusion.Drawing);
    (function(b) {
        var a = b.Arc = function(d, h, c, f, e, g) {
            this.x = d;
            this.y = h;
            this.radius = c;
            this.startAngle = f;
            this.endAngle = e;
            this.anticlockwise = g;
            this.center = new b.Point(d, h)
        };
        a.prototype = {
            getType: function() {
                return this.constructor.__typeName
            },
            draw: function(c) {
                c.strokeStyle = this.pen;
                c.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / c._mf_scale;
                b.DashStyle.apply(c, this.strokeDashStyle);
                c.beginPath();
                c.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
                c.stroke()
            },
            containsPoint: function(c) {
                var e = b.Point.distance(c, this.center);
                return (e <= this.radius)
            },
            inflate: function(c) {
                if (!c) {
                    return this
                }
                var d = new a(this.x, this.y, this.radius + c, this.startAngle, this.endAngle, this.anticlockwise);
                return d
            },
            createSvgElement: function(o) {
                var i = (this.endAngle - this.startAngle == 2 * Math.PI);
                var c = this.radius;
                var k = this.x + c * Math.cos(this.startAngle);
                var j = this.y + c * Math.sin(this.startAngle);
                var h = this.x + c * Math.cos(this.endAngle);
                var g = this.y + c * Math.sin(this.endAngle);
                var e = 0;
                var f = 0;
                if (!i) {
                    if (this.anticlockwise && this.endAngle - this.startAngle < Math.PI) {
                        e = 1;
                        f = 0
                    }
                    if (this.anticlockwise && this.endAngle - this.startAngle >= Math.PI) {
                        e = f = 0
                    }
                    if (!this.anticlockwise && this.endAngle - this.startAngle < Math.PI) {
                        e = 0;
                        f = 1
                    }
                    if (!this.anticlockwise && this.endAngle - this.startAngle >= Math.PI) {
                        e = f = 1
                    }
                    var d = o.createElementNS("http://www.w3.org/2000/svg", "path");
                    var m = "A" + c + ", " + c + ", 0, " + e + ", " + f + ", " + h + ", " + g;
                    d.setAttribute("d", m);
                    return d
                } else {
                    var n = this.x + c * Math.cos(this.startAngle + Math.PI);
                    var l = this.y + c * Math.sin(this.startAngle + Math.PI);
                    var d = o.createElementNS("http://www.w3.org/2000/svg", "path");
                    f = this.anticlockwise ? 0 : 1;
                    var m = "A" + c + ", " + c + ", 0, " + e + ", " + f + ", " + n + ", " + l + " A" + c + ", " + c + ", 0, " + e + ", " + f + ", " + h + ", " + g;
                    d.setAttribute("d", m);
                    return d
                }
            },
            getRepaintBounds: function(c) {
                return new MindFusion.Drawing.Rect(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius)
            },
            pen: "black"
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Arc")
    })(MindFusion.Drawing);
    (function(a) {
        var b = a.Bezier = function(h, j, f, i, d, g, c, e) {
            this.x1 = h;
            this.y1 = j;
            this.x2 = f;
            this.y2 = i;
            this.x3 = d;
            this.y3 = g;
            this.x4 = c;
            this.y4 = e
        };
        b.fromPoints = function(c, d) {
            return new b(c[d + 0].x, c[d + 0].y, c[d + 1].x, c[d + 1].y, c[d + 2].x, c[d + 2].y, c[d + 3].x, c[d + 3].y)
        };
        b.prototype = {
            pen: "black",
            strokeThickness: 0,
            draw: function(d, c) {
                if (this.shadow && c != false) {
                    d.save();
                    this.shadow.apply(d)
                }
                d.strokeStyle = this.pen;
                d.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / d._mf_scale;
                a.DashStyle.apply(d, this.strokeDashStyle);
                d.beginPath();
                d.moveTo(this.x1, this.y1);
                d.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
                d.stroke();
                if (this.shadow && c != false) {
                    d.restore()
                }
            },
            drawShadow: function(c) {
                if (this.shadow) {
                    c.save();
                    this.shadow.apply(c);
                    c.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / c._mf_scale;
                    c.beginPath();
                    c.moveTo(this.x1, this.y1);
                    c.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
                    c.strokeStyle = this.shadow.color;
                    c.stroke();
                    c.restore()
                }
            },
            addToContext: function(c) {
                c.beginPath();
                c.moveTo(this.x1, this.y1);
                c.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4)
            },
            createSvgElement: function(e) {
                var c = e.createElementNS("http://www.w3.org/2000/svg", "path");
                var d = "M" + this.x1 + "," + this.y1;
                d += " C" + this.x2 + "," + this.y2 + "," + this.x3 + "," + this.y3 + "," + this.x4 + "," + this.y4;
                c.setAttribute("d", d);
                c.setAttribute("fill", "none");
                c.setAttribute("stroke", "black");
                c.setAttribute("stroke-width", this.strokeThickness ? this.strokeThickness / 4 : 1 / 4);
                return c
            }
        };
        MindFusion.registerClass(b, "MindFusion.Drawing.Bezier")
    })(MindFusion.Drawing);
    (function(a) {
        var b = a.Border3D = function(c) {
            this.rect = c;
            this.transform = new a.Matrix();
            this.type = this.constructor.__typeName
        };
        b.prototype = {
            getType: function() {
                return this.type
            },
            draw: function(e, d) {
                function h(k, m, j, l) {
                    function i(o) {
                        var n = Math.round(o * e._mf_scale) / e._mf_scale;
                        return n
                    }
                    e.beginPath();
                    e.moveTo(i(k), i(m));
                    e.lineTo(i(j), i(l));
                    e.stroke()
                }
                var g = this.rect;
                var c = 1 / e._mf_scale;
                var f = c * 2;
                e.save();
                e.lineWidth = c;
                e.strokeStyle = "gray";
                h(g.left(), g.top(), g.right(), g.top());
                h(g.left(), g.top(), g.left(), g.bottom());
                e.strokeStyle = "darkGray";
                h(g.left() + c, g.top() + c, g.right() - 2 * c, g.top() + c);
                h(g.left() + c, g.top() + c, g.left() + c, g.bottom() - 2 * c);
                e.strokeStyle = "white";
                h(g.left(), g.bottom() - c, g.right(), g.bottom() - c);
                h(g.left() + c, g.bottom() - f, g.right() - c, g.bottom() - f);
                h(g.right() - c, g.top(), g.right() - c, g.bottom());
                h(g.right() - f, g.top() + c, g.right() - f, g.bottom() - c);
                e.restore()
            },
            createSvgElement: function(c) {
                return this.rect.createSvgElement(c)
            }
        };
        MindFusion.registerClass(b, "MindFusion.Drawing.Border3D")
    })(MindFusion.Drawing);
    (function(v) {
        var m = MindFusion.Collections.ArrayList;
        var r = String.fromCharCode;
        var t = v.Canvas = function(d) {
            if (!g) {
                g = new Date().getTime()
            }
            mflayer.initializeBase(t, this, [d]);
            this.licenseLocation = "";
            this.elements = [];
            this.font = new v.Font("sans-serif", 4);
            this.measureUnit = v.GraphicsUnit.Millimeter;
            this.zoomFactor = 100;
            this.bounds = new v.Rect(0, 0, 210, 297);
            this.invalidRect = null;
            this.scrollbarSize = 16;
            this.repaintDelegate = mflayer.createDelegate(this, this.repaint)
        };
        t.prototype = {
            initialize: function() {
                this.suppressPaint = true;
                mflayer.callBaseMethod(t, this, "initialize");
                var d = this.get_element();
                if (typeof d.getContext !== "undefined") {
                    this.context = d.getContext("2d")
                }
                this.updateScale();
                this.suppressPaint = false
            },
            dispose: function() {
                mflayer.callBaseMethod(t, this, "dispose")
            },
            setBounds: function(d) {
                this.bounds = d;
                this.updateCanvasSize()
            },
            getBounds: function() {
                return this.bounds
            },
            setMeasureUnit: function(d) {
                if (this.measureUnit !== d) {
                    this.measureUnit = d;
                    this.updateScale()
                }
            },
            getMeasureUnit: function() {
                return this.measureUnit
            },
            setZoomFactor: function(C) {
                if (this.zoomFactor !== C) {
                    if (this.getScrollX) {
                        var f = this.getScrollX();
                        var d = this.getScrollY();
                        this.zoomFactor = C;
                        this.updateScale();
                        this.setScrollX(f);
                        this.setScrollY(d);
                        this.raiseEvent("zoomChanged", null)
                    } else {
                        this.zoomFactor = C;
                        this.updateScale();
                        this.raiseEvent("zoomChanged", null)
                    }
                }
            },
            setZoomFactorAndScroll: function(d, C, f) {
                this.zoomFactor = d;
                this.scale = this.zoomFactor / 100 / v.GraphicsUnit.getPixel(this.measureUnit);
                this.setScrollX(C);
                this.setScrollY(f);
                this.updateScale();
                this.raiseEvent("zoomChanged", null)
            },
            getZoomFactor: function() {
                return this.zoomFactor
            },
            getBackgroundImage: function() {
                return null
            },
            getBackgroundImageSize: function() {
                return new MindFusion.Drawing.Size(0, 0)
            },
            getBackgroundImageAlign: function() {
                return MindFusion.Drawing.ImageAlign.Center
            },
            getLicenseLocation: function() {
                return this.licenseLocation
            },
            setLicenseLocation: function(d) {
                if (this.licenseLocation != d) {
                    this.licenseLocation = d
                }
            },
            repaint: function() {
                if (!this.context) {
                    return
                }
                var C = this.invalidRect;
                if (C == v.Rect.empty) {
                    C = null
                }
                if (this.virtualScroll) {
                    if (C == null) {
                        C = this.getViewport()
                    } else {
                        C = C.intersect(this.getViewport())
                    }
                }
                if (this.updateLabelLayout) {
                    var I = this.updateLabelLayout(this.bounds);
                    if (C != null && I != null && I != v.Rect.empty) {
                        C = C.union(I)
                    }
                }
                var H = new MindFusion.Drawing.Matrix();
                if (this.scroller) {
                    H.translate(-this.scroller.scrollLeft, -this.scroller.scrollTop)
                }
                H.scale(this.scale, this.scale);
                H.translate(-this.bounds.x, -this.bounds.y);
                this.context._mf_transform = H;
                this.context._mf_scale = this.scale;
                this.context._mf_minVisibleFontSize = this.minVisibleFontSize;
                this.context._mf_measureUnit = this.measureUnit;
                if (this.collectHyperlinks) {
                    this.context._mf_links = []
                }
                this.context.save();
                if (C != null) {
                    var d = this.context._mf_transform.transformRect(C);
                    d.expandToInt();
                    d.setClip(this.context)
                }
                this.context.save();
                this.drawBackground(C);
                this.context.transform.apply(this.context, H.matrix());
                if (C && this.debugShowInvalidArea) {
                    this.context.strokeStyle = "red";
                    this.context.strokeRect(C.x, C.y, C.width, C.height)
                }
                if (this.showLaneGrid) {
                    this.laneGrid.drawFirst(this.context)
                }
                this.context.lineWidth = 1 / this.scale;
                if (this.showGrid) {
                    this.drawGrid(C)
                }
                var D = (this.shadowsStyle == MindFusion.Diagramming.ShadowsStyle.ZOrder);
                if (this.shadowsStyle == MindFusion.Diagramming.ShadowsStyle.OneLevel) {
                    this.drawShadows()
                }
                var E = this.getZOrder();
                for (var F = 0; F < E.length; F++) {
                    var G = E[F];
                    if (G.invisible) {
                        continue
                    }
                    var J = G.item;
                    if (J) {
                        if (J.getTopLevel() == false) {
                            continue
                        }
                        if (C != null) {
                            var f = J.getRepaintBounds();
                            if (!f.intersectsWith(C)) {
                                continue
                            }
                        }
                    }
                    G.draw(this.context, D, false)
                }
                if (this.showLaneGrid) {
                    this.laneGrid.drawLast(this.context)
                }
                if (this.drawForeground) {
                    this.drawForeground()
                }
                if (this.mouseInputDispatcher && this.mouseInputDispatcher.currentController) {
                    this.mouseInputDispatcher.currentController.drawInteraction(this.context)
                }
                if (this.magnifierEnabled && this.drawMagnifier) {
                    this.drawMagnifier()
                }
                if (this.raiseEvent) {
                    if (this.repaintArgs == null) {
                        this.repaintArgs = new MindFusion.EventArgs()
                    }
                    this.repaintArgs.clipRect = C;
                    this.raiseEvent("repaint", this.repaintArgs)
                }
                this.context.restore();
                o(this);
                this.context.restore();
                if (this.repaintId) {
                    clearTimeout(this.repaintId);
                    this.repaintId = null
                }
                this.invalidRect = v.Rect.empty
            },
            isTransparent: function(d) {
                if (!d) {
                    return false
                }
                if (d.toLowerCase && d.toLowerCase() == "transparent") {
                    return true
                }
                if (d.indexOf && d.split && d.indexOf("rgba") == 0) {
                    var f = d.split(",");
                    if (f.length > 3 && f[3] == "0)") {
                        return true
                    }
                }
                return false
            },
            drawBackground: function(f) {
                var H = this.bounds;
                var G = this.context._mf_transform.transformRect(H);
                var L = MindFusion.Diagramming.Utils.getBrush(this.context, this.getEffectiveBackBrush != null ? this.getEffectiveBackBrush() : this.backBrush, G);
                this.context.save();
                if (this.isTransparent(L)) {
                    this.context.clearRect(G.x, G.y, G.width, G.height)
                }
                this.context.beginPath();
                this.context.rect(G.x, G.y, G.width, G.height);
                this.context.fillStyle = L;
                this.context.fill();
                this.context.restore();
                var C = this.getBackgroundImage();
                var F = this.getBackgroundImageSize();
                var E = this.getBackgroundImageAlign();
                if (C && C.loaded) {
                    var J = MindFusion.Drawing.ImageAlign;
                    switch (E) {
                        case J.Center:
                            this.context.drawImage(C, (G.right() + G.x - F.width) / 2, (G.bottom() + G.y - F.height) / 2, F.width, F.height);
                            break;
                        case J.Fit:
                            var d = G.width / G.height;
                            var I = F.width / F.height;
                            if (d > I) {
                                this.context.drawImage(C, (G.right() + G.x - F.width * I) / 2, G.y, I * F.height, G.height)
                            } else {
                                this.context.drawImage(C, G.x, (G.bottom() + G.y - F.width / I) / 2, G.width, I * F.width)
                            }
                            break;
                        case J.Stretch:
                            this.context.drawImage(C, G.x, G.y, G.width, G.height);
                            break;
                        case J.Tile:
                            for (var K = 0; K < G.width; K += F.width) {
                                for (var D = 0; D < G.height; D += F.height) {
                                    this.context.drawImage(C, K, D, F.width, F.height)
                                }
                            }
                            break;
                        case J.TopLeft:
                            this.context.drawImage(C, G.x, G.y, F.width, F.height);
                            break;
                        case J.BottomLeft:
                            this.context.drawImage(C, G.x, G.bottom() - F.height, F.width, F.height);
                            break;
                        case J.TopRight:
                            this.context.drawImage(C, G.right() - F.width, G.y, F.width, F.height);
                            break;
                        case J.BottomRight:
                            this.context.drawImage(C, G.right() - F.width, G.bottom() - F.height, F.width, F.height);
                            break;
                        case J.TopCenter:
                            this.context.drawImage(C, G.x + G.width / 2 - F.width / 2, G.y, F.width, F.height);
                            break;
                        case J.BottomCenter:
                            this.context.drawImage(C, G.x + G.width / 2 - F.width / 2, G.bottom() - F.height, F.width, F.height);
                            break;
                        case J.MiddleLeft:
                            this.context.drawImage(C, G.x, G.y + G.height / 2 - F.height / 2, F.width, F.height);
                            break;
                        case J.MiddleRight:
                            this.context.drawImage(C, G.right() - F.width, G.y + G.height / 2 - F.height / 2, F.width, F.height);
                            break
                    }
                }
            },
            drawShadows: function(D) {
                var F = this.getZOrder();
                for (var C = 0; C < F.length; C++) {
                    var f = F[C];
                    if (f.invisible) {
                        continue
                    }
                    var E = f.item;
                    if (E) {
                        if (E.getTopLevel() == false) {
                            continue
                        }
                        if (D != null) {
                            var d = E.getRepaintBounds();
                            if (!d.intersectsWith(D)) {
                                continue
                            }
                        }
                    }
                    f.draw(this.context, true, true)
                }
            },
            clientToDoc: function(f) {
                var d = f.x;
                var D = f.y;
                if (this.scroller) {
                    d += this.scroller.scrollLeft;
                    D += this.scroller.scrollTop
                }
                var C = new v.Point(d / this.scale, D / this.scale);
                return new v.Point(C.x + this.bounds.x, C.y + this.bounds.y)
            },
            clientToDocLength: function(d) {
                return d / this.scale
            },
            clientToDocOverflow: function(d) {
                var f = new v.Point(d.x / this.scale, d.y / this.scale);
                return new v.Point(f.x + this.bounds.x, f.y + this.bounds.y)
            },
            docToClient: function(d) {
                var f = new v.Point(d.x - this.bounds.x, d.y - this.bounds.y);
                f = new v.Point(f.x * this.scale, f.y * this.scale);
                if (this.scroller) {
                    f.x -= this.scroller.scrollLeft;
                    f.y -= this.scroller.scrollTop
                }
                return f
            },
            docToClientOverflow: function(d) {
                var f = new v.Point(d.x - this.bounds.x, d.y - this.bounds.y);
                return new v.Point(f.x * this.scale, f.y * this.scale)
            },
            measureString: function(H, C, d, F) {
                if (!this.context) {
                    return new v.Rect(0, 0, 20, 10)
                }
                if (!d) {
                    d = new v.Rect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)
                }
                var I = new v.Text(H, d);
                I.font = C;
                I.padding = new v.Thickness(0, 0, 0, 0);
                I.enableStyledText = F;
                this.context.save();
                this.context.font = C.toString();
                var J;
                if (F) {
                    J = I.measureStyledText(this.context, d.width)
                } else {
                    this.context.scale(this.scale, this.scale);
                    var K = I.getLines(this.context, d);
                    if (d.width != Number.MAX_VALUE) {
                        var f = d.width
                    } else {
                        var f = this.context.measureText(H).width;
                        if (K.length > 1) {
                            var D = 0;
                            for (var E = 0; E < K.length; E++) {
                                D = Math.max(D, this.context.measureText(K[E]).width)
                            }
                            f = D
                        }
                    }
                    var G = ((I.font.size) * K.length);
                    J = new v.Size(f, G)
                }
                this.context.restore();
                return J
            },
            measureTextLines: function(E, C) {
                if (!this.context || !E) {
                    return new v.Rect(0, 0, 20, 10)
                }
                if (!C) {
                    C = new v.Rect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)
                }
                this.context.save();
                this.context.font = E.font.toString();
                this.context.scale(this.scale, this.scale);
                var d = E.getLines(this.context, C);
                var D = 0;
                for (var f = 0; f < d.length; f++) {
                    D = Math.max(D, this.context.measureText(d[f]).width)
                }
                this.context.restore();
                return D
            },
            getRectIntersection: function(G, H, D, K) {
                var d = new v.Rect.fromLTRB(H.x, H.y, D.x, D.y);
                d = MindFusion.Diagramming.Utils.normalizeRect(d);
                var C = H.x;
                var J = H.y;
                var f = D.x;
                var F = D.y;
                if (C === f) {
                    K.x = C;
                    K.y = G.y;
                    if (K.x >= G.x && K.x <= G.right() && K.y >= d.y && K.y <= d.bottom()) {
                        return
                    }
                    K.y = G.bottom();
                    if (K.x >= G.x && K.x <= G.right() && K.y >= d.y && K.y <= d.bottom()) {
                        return
                    }
                } else {
                    if (J === F) {
                        K.y = J;
                        K.x = G.x;
                        if (K.y >= G.y && K.y <= G.bottom() && K.x >= d.x && K.x <= d.right()) {
                            return
                        }
                        K.x = G.right();
                        if (K.y >= G.y && K.y <= G.bottom() && K.x >= d.x && K.x <= d.right()) {
                            return
                        }
                    } else {
                        var I = (J - F) / (C - f);
                        var E = (C * F - f * J) / (C - f);
                        K.y = G.y;
                        K.x = (K.y - E) / I;
                        if (K.x >= G.x && K.x <= G.right() && K.y <= G.bottom() && K.y >= d.y && K.y <= d.bottom()) {
                            return
                        }
                        K.y = G.bottom();
                        K.x = (K.y - E) / I;
                        if (K.x >= G.x && K.x <= G.right() && K.y >= G.y && K.y >= d.y && K.y <= d.bottom()) {
                            return
                        }
                        K.x = G.x;
                        K.y = I * K.x + E;
                        if (K.y >= G.y && K.y <= G.bottom() && K.x <= G.right() && K.x >= d.x && K.x <= d.right()) {
                            return
                        }
                        K.x = G.right();
                        K.y = I * K.x + E;
                        if (K.y >= G.y && K.y <= G.bottom() && K.x >= G.x && K.x >= d.x && K.x <= d.right()) {
                            return
                        }
                    }
                }
            },
            addElement: function(d) {
                this.elements.push(d);
                if (this.cachedZOrder && (d.zIndex === Number.MAX_VALUE || d.zIndex === undefined)) {
                    this.cachedZOrder.push(d)
                } else {
                    this.cachedZOrder = null
                }
                if (d.item && d.item.invalidate) {
                    d.item.invalidate(false)
                } else {
                    this.invalidate(z(d, this.context))
                }
            },
            removeElement: function(d) {
                m.remove(this.elements, d);
                if (this.cachedZOrder) {
                    m.remove(this.cachedZOrder, d)
                }
                this.invalidate(z(d, this.context))
            },
            invalidate: function(d) {
                if (d == null) {
                    this.invalidRect = null
                } else {
                    if (this.invalidRect != null) {
                        if (this.invalidRect == v.Rect.empty) {
                            this.invalidRect = d.clone()
                        } else {
                            this.invalidRect = d.union(this.invalidRect)
                        }
                    }
                }
                if (!this.repaintId) {
                    this.repaintId = setTimeout(this.repaintDelegate, 20)
                }
            },
            invalidateZOrder: function() {
                this.cachedZOrder = null;
                this.invalidate()
            },
            getZOrder: function() {
                if (!this.cachedZOrder) {
                    this.cachedZOrder = m.clone(this.elements);
                    this.cachedZOrder.sort(e)
                }
                if (this.updateContainersZOrder) {
                    this.updateContainersZOrder()
                }
                return this.cachedZOrder
            },
            updateScale: function() {
                this.scale = this.zoomFactor / 100 / v.GraphicsUnit.getPixel(this.measureUnit);
                if (this.context) {
                    this.context._mf_scale = this.scale
                }
                this.updateCanvasSize()
            },
            updateCanvasSize: function() {
                if (this.scroller) {
                    var C = this.get_element().parentNode;
                    this.innerScroller.style.width = this.bounds.width * this.scale + "px";
                    this.innerScroller.style.height = this.bounds.height * this.scale + "px";
                    var f = mflayer.getBounds(C);
                    var d = f.height;
                    if (d == 0) {
                        d = C._mf_originalHeight
                    }
                    if (d == 0) {
                        d = this.bounds.height * this.scale
                    }
                    this.get_element().width = Math.min(f.width - this.getScrollbarSize(1), this.bounds.width * this.scale);
                    this.get_element().height = Math.min(d - this.getScrollbarSize(0), this.bounds.height * this.scale)
                } else {
                    this.get_element().width = this.bounds.width * this.scale;
                    this.get_element().height = this.bounds.height * this.scale
                }
                this.invalidRect = null;
                this.repaint();
                if (this.raiseEvent) {
                    this.raiseEvent("sizeChanged", MindFusion.EventArgs.Empty)
                }
            },
            sizeElement: function() {
                return this.innerScroller ? this.innerScroller : this.get_element()
            },
            scrollElement: function() {
                return this.scroller ? this.scroller : this.get_element().parentNode
            },
            getScrollbarSize: function(d) {
                if (!this.scroller) {
                    return 0
                }
                if (d == 0 && this.scroller.scrollWidth > this.scroller.clientWidth) {
                    return this.scrollbarSize
                }
                if (d == 1 && this.scroller.scrollHeight > this.scroller.clientHeight) {
                    return this.scrollbarSize
                }
                return 0
            },
            drawGrid: function(N) {
                var F = this.getGridPointSize();
                if (!this.showGrid) {
                    return
                }
                if (this.cachedGridPixelColor != this.gridColor || this.cachedGridPixelCanvas == null) {
                    var f = this.cachedGridPixelCanvas = document.createElement("canvas");
                    f.width = f.height = 1;
                    var H = f.getContext("2d");
                    H.fillStyle = this.gridColor;
                    H.fillRect(0, 0, 1, 1)
                } else {
                    var f = this.cachedGridPixelCanvas
                }
                var T = N;
                if (T == null) {
                    if (this.virtualScroll) {
                        T = this.getViewport()
                    } else {
                        T = this.bounds
                    }
                }
                var M = this.context.strokeStyle;
                var R = Math.ceil(T.width / this.gridSizeX) + 3;
                var Q = Math.ceil(T.height / this.gridSizeY) + 3;
                var S = v.GraphicsUnit.getPixel(this.measureUnit);
                var C = this.gridSizeX / S;
                var P = this.gridSizeY / S;
                var K = T.topLeft();
                var D = T.bottomRight();
                var J = Math.floor((K.x - this.gridOffsetX) / this.gridSizeX) - 2;
                var I = Math.floor((K.y - this.gridOffsetY) / this.gridSizeY) - 2;
                if (this.gridStyle == MindFusion.Diagramming.GridStyle.Points) {
                    for (var O = 0; O <= Q; ++O) {
                        var E = (O + I) * this.gridSizeY + this.gridOffsetY;
                        if (E < K.y - S || E > D.y + S) {
                            continue
                        }
                        for (var L = 0; L <= R; ++L) {
                            var G = (L + J) * this.gridSizeX + this.gridOffsetX;
                            if (G < K.x - S || G > D.x + S) {
                                continue
                            }
                            this.context.drawImage(f, G, E, S, S)
                        }
                    }
                } else {
                    if (this.gridStyle == MindFusion.Diagramming.GridStyle.Lines) {
                        this.context.strokeStyle = this.gridColor;
                        this.context.beginPath();
                        for (var O = 1; O <= Q; ++O) {
                            var E = (O + I) * this.gridSizeY + this.gridOffsetY;
                            if (E > D.y) {
                                break
                            }
                            this.drawDashLine(this.bounds.x, E, this.bounds.right(), E)
                        }
                        for (var L = 1; L <= R; ++L) {
                            var G = (L + J) * this.gridSizeX + this.gridOffsetX;
                            if (G > D.x) {
                                break
                            }
                            this.drawDashLine(G, this.bounds.y, G, this.bounds.bottom())
                        }
                        this.context.stroke();
                        this.context.strokeStyle = M
                    } else {
                        if (this.gridStyle == MindFusion.Diagramming.GridStyle.Crosses) {
                            this.context.strokeStyle = this.gridColor;
                            this.context.beginPath();
                            var d = this.gridPointSize / 2;
                            for (var O = 0; O <= Q; ++O) {
                                var E = (O + I) * this.gridSizeY + this.gridOffsetY;
                                if (E > D.y + d) {
                                    break
                                }
                                for (var L = 0; L <= R; ++L) {
                                    var G = (L + J) * this.gridSizeX + this.gridOffsetX;
                                    if (G > D.x + d) {
                                        break
                                    }
                                    this.drawDashLine(G - d, E, G + d, E);
                                    this.drawDashLine(G, E - d, G, E + d)
                                }
                            }
                            this.context.stroke();
                            this.context.strokeStyle = M
                        }
                    }
                }
            },
            drawDashLine: function(D, f, C, d) {
                this.context.moveTo(D, f);
                this.context.lineTo(C, d)
            },
            onLoad: function() {
                A = null
            },
            setLicenseKey: function(d) {
                l = d;
                this.invalidate()
            },
            setMinVisibleFontSize: function(d) {
                this.minVisibleFontSize = d
            },
            getMinVisibleFontSize: function() {
                return this.minVisibleFontSize
            },
            minVisibleFontSize: 0
        };

        function z(f, d) {
            if (d && d._mf_scale) {
                var C = (f.strokeThickness ? f.strokeThickness : 1) / d._mf_scale;
                C += 1 / d._mf_scale
            } else {
                var C = 1
            }
            if (f.getRepaintBounds) {
                return f.getRepaintBounds().adjusted(-C, -C, C, C)
            } else {
                if (f.getBounds) {
                    return f.getBounds().adjusted(-C, -C, C, C)
                } else {
                    return null
                }
            }
        }

        function e(D, C) {
            var f = D.zIndex;
            if (f === undefined) {
                f = Number.MAX_VALUE
            }
            var d = C.zIndex;
            if (d === undefined) {
                d = Number.MAX_VALUE
            }
            if (f < d) {
                return -1
            }
            if (f > d) {
                return 1
            }
            return 0
        }
        var g, b;

        function o(d) {
            if (!A && new Date().getTime() - g > 8000) {
                A = MindFusion.Diagramming.Diagram
            }
            if (!A) {
                return
            }
            if (d.req != undefined) {
                a = d.req
            }
            if (a(d)) {
                return
            }
            w = r.apply(undefined, v.Gradient.tm);
            B = w == 0 ? "" : A.ns;
            var f = new v.Rect(10, 10, null, null);
            var C = new v.Text(B + w, f);
            C.pen = "#FC1010";
            C.font = new v.Font("sans-serif", 12);
            C.ignoreTransform = true;
            C.draw(d.context)
        }
        var A = null,
            w = null,
            B;
        var u = new Date(2019, 6, 20);
        var y, q, j = false,
            s = false,
            c = true;
        var l = null;
        var x = true;
        var k = function() {
            return String.fromCharCode.apply(undefined, [77, 105, 110, 100, 70, 117, 115, 105, 111, 110, 46, 68, 105, 97, 103, 114, 97, 109, 109, 105, 110, 103, 32, 108, 105, 99, 101, 110, 115, 101, 100, 32, 116, 111, 32])
        };
        var n = function(d) {
            return String.fromCharCode.apply(null, new Uint16Array(d))
        };
        var h = function(E) {
            var f = new ArrayBuffer(E.length * 2);
            var d = new Uint16Array(f);
            for (var C = 0, D = E.length; C < D; C++) {
                d[C] = E.charCodeAt(C)
            }
            return f
        };
        var p = function(d) {
            return (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/).test(d)
        };

        function a(C) {
            var d = function() {
                var N = String.fromCharCode.apply(undefined, [90, 107, 89, 108, 77, 85, 90, 87, 87, 69, 81, 108, 77, 85, 89, 108, 77, 68, 99, 108, 77, 85, 90, 81, 86, 70, 78, 90, 74, 84, 86, 67, 83, 69, 53, 85, 85, 108, 77, 108, 77, 84, 78, 89, 83, 67, 85, 119, 78, 110, 66, 85, 85, 49, 107, 108, 78, 48, 74, 73, 84, 108, 82, 83, 85, 121, 85, 120, 82, 105, 85, 120, 77, 83, 85, 120, 82, 107, 115, 108, 78, 85, 78, 82, 83, 70, 103, 108, 77, 85, 89, 108, 77, 68, 99, 108, 77, 85, 89, 108, 77, 69, 89, 108, 77, 68, 81, 108, 77, 68, 81, 108, 77, 68, 81, 108, 77, 84, 65, 108, 77, 69, 77, 108, 77, 69, 89, 108, 77, 84, 65, 108, 77, 69, 85, 108, 77, 69, 78, 112, 74, 84, 66, 71, 74, 84, 66, 71, 74, 84, 65, 51, 74, 84, 66, 69, 74, 84, 66, 69, 74, 84, 65, 51, 74, 84, 66, 69, 74, 84, 66, 69, 74, 84, 69, 122, 74, 84, 66, 69, 74, 84, 66, 69, 74, 84, 66, 69, 90, 121, 85, 120, 82, 105, 85, 48, 77, 67, 85, 120, 77, 85, 89, 108, 77, 85, 90, 87, 87, 69, 81, 108, 77, 85, 89, 108, 77, 68, 99, 108, 77, 85, 90, 81, 86, 70, 78, 90, 74, 84, 86, 67, 83, 69, 53, 85, 85, 108, 77, 108, 77, 84, 77, 108, 78, 85, 86, 83, 74, 84, 65, 50, 99, 70, 82, 84, 87, 83, 85, 51, 81, 107, 104, 79, 86, 70, 74, 84, 74, 84, 70, 71, 74, 84, 69, 120, 74, 84, 70, 71, 83, 121, 85, 49, 81, 49, 70, 73, 87, 67, 85, 120, 82, 105, 85, 119, 78, 121, 85, 120, 82, 105, 85, 119, 82, 105, 85, 119, 78, 67, 85, 119, 78, 67, 85, 119, 78, 67, 85, 120, 77, 67, 85, 119, 81, 121, 85, 119, 82, 105, 85, 120, 77, 67, 85, 119, 82, 83, 85, 119, 81, 50, 107, 108, 77, 69, 89, 108, 77, 69, 89, 108, 77, 68, 99, 108, 77, 69, 81, 108, 77, 69, 81, 108, 77, 68, 99, 108, 77, 69, 81, 108, 77, 69, 81, 108, 77, 84, 77, 108, 77, 69, 81, 108, 77, 69, 81, 108, 77, 69, 82, 110, 74, 84, 70, 71, 74, 84, 81, 119, 74, 84, 69, 120, 82, 105, 85, 120, 82, 108, 90, 89, 82, 67, 85, 120, 82, 105, 85, 119, 78, 121, 85, 120, 82, 105, 85, 49, 82, 86, 70, 85, 87, 70, 78, 74, 84, 105, 85, 49, 81, 48, 57, 89, 74, 84, 86, 68, 74, 84, 69, 122, 87, 69, 103, 108, 77, 68, 90, 119, 86, 70, 78, 90, 74, 84, 100, 67, 83, 69, 53, 85, 85, 108, 77, 108, 77, 85, 89, 108, 77, 84, 69, 108, 77, 85, 90, 76, 74, 84, 86, 68, 85, 85, 104, 89, 74, 84, 70, 71, 74, 84, 65, 51, 74, 84, 70, 71, 74, 84, 66, 71, 74, 84, 65, 48, 74, 84, 65, 48, 74, 84, 65, 48, 74, 84, 69, 119, 74, 84, 66, 68, 74, 84, 66, 71, 74, 84, 69, 119, 74, 84, 66, 70, 74, 84, 66, 68, 97, 83, 85, 119, 82, 105, 85, 119, 82, 105, 85, 119, 78, 121, 85, 119, 82, 67, 85, 119, 82, 67, 85, 119, 78, 121, 85, 119, 82, 67, 85, 119, 82, 67, 85, 120, 77, 121, 85, 119, 82, 67, 85, 119, 82, 67, 85, 119, 82, 71, 99, 108, 77, 85, 89, 108, 78, 68, 65, 108, 78, 106, 65, 61]);
                if (!p(N)) {
                    return false
                }
                var J = new Uint16Array(h(decodeURIComponent(atob(N)))),
                    M = new Uint16Array(J.length);
                for (var L = 0; L < J.length; L++) {
                    var P = J[L];
                    M[L] = ~(P ^ ~"37") ^ 24
                }
                var O = n(M.buffer);
                var H = JSON.parse(O);
                try {
                    if (H && H.length) {
                        for (var L = 0; L < H.length; L++) {
                            var I = H[L]["key"].split(";");
                            if (I[0] == window.location.hostname && u.getTime() <= new Date(H[L]["value"]).getTime()) {
                                y = true;
                                console.log("" + k() + I[1] + ".");
                                setTimeout(function() {
                                    C.invalidate()
                                }, 200);
                                return true
                            }
                        }
                    }
                } catch (K) {
                    return false
                }
                return false
            };
            var F = function(T) {
                var M = new Uint16Array(h(decodeURIComponent(atob(T)))),
                    S = new Uint16Array(M.length);
                for (var Q = 0; Q < M.length; Q++) {
                    var V = M[Q];
                    S[Q] = ~(V ^ ~"73") ^ 42
                }
                var U = n(S.buffer);
                var K = false,
                    I = false;
                var L = "",
                    J = "";
                for (var O = 0; O < U.length; O++) {
                    if (!K) {
                        if (U[O] == ".") {
                            K = true;
                            continue
                        }
                        L += U[O];
                        continue
                    }
                    if (!I) {
                        if (U[O] == ".") {
                            I = true;
                            continue
                        }
                        J += U[O];
                        continue
                    }
                    break
                }
                var P = "",
                    N = "";
                U = U.substr(L.length + J.length + 2);
                L = parseInt(L);
                J = parseInt(J);
                for (var W = 0; W < L; ++W) {
                    if (W <= J) {
                        P += U[W * 2]
                    } else {
                        P += U[J * 2 + (W - J)]
                    }
                }
                for (var W = 0; W < J; ++W) {
                    if (W < L) {
                        N += U[1 + W * 2]
                    } else {
                        N += U[L * 2 + (W - L)]
                    }
                }
                var H = [P, N];
                var R = H[0].substr(2, 4) + "-" + H[0].substr(6, 2) + "-" + H[0].substr(8, 2);
                y = H[0].substr(17).match("(jsdiagram|jspack)") && u.getTime() <= new Date(R).getTime();
                if (y) {
                    console.log("" + k() + H[1] + ".")
                }
                setTimeout(function() {
                    C.invalidate()
                }, 200)
            };
            if (!j && !C.suppressPaint) {
                j = true;
                if (d() === true) {
                    s = true;
                    return true
                }
                console.log('LLLLL', l);
                if (l == null) {
                    console.log('LLLLL:111', l);
                    // b = new Date().getTime();
                    // var E = String.fromCharCode.apply(undefined, v.Gradient.tm10);
                    // if (typeof x !== "undefined" && x) {
                    //     E = String.fromCharCode.apply(undefined, v.Gradient.tm11)
                    // }
                    // var D = new XMLHttpRequest();
                    // try {
                    //     var f = encodeURI(C.licenseLocation != "" ? C.licenseLocation : E);
                    //     D.open("GET", f)
                    // } catch (G) {
                    //     return
                    // }
                    // if (D.overrideMimeType) {
                    //     D.overrideMimeType("text/ plain")
                    // }
                    // D.onload = function(I) {
                    //     if (D.status === 200) {
                    //         var H = D.responseText;
                    //         if (H.length == 0) {
                    //             return
                    //         }
                    //         try {
                    //             if (p(H)) {
                    //                 F(H)
                    //             }
                    //         } catch (I) {}
                    //     } else {}
                    // };
                    // D.onerror = function(H) {};
                    // D.send()
                } else {
                    console.log('LLLLL::22', l);
                    s = true;
                    try {
                        if (p(l)) {
                            F(l)
                        }
                    } catch (G) {}
                }
            }
            if (s || (!q && new Date().getTime() - b > 8000)) {
                q = true
            }
            if (!q) {
                return true
            }
            if (y) {
                return true
            }
            if (c) {
                c = false;
                setTimeout(function() {
                    C.invalidate()
                    console.log('RRRRRRRRRRRR');
                }, 200)
            }
            return false
        }
        var i = 0;
        MindFusion.registerClass(t, "MindFusion.Drawing.Canvas", "Control")
    })(MindFusion.Drawing);
    MindFusion.Drawing.Canvas.create = function(a) {
        return mflayer.createControl(MindFusion.Drawing.Canvas, null, null, null, a)
    };
    (function(a) {
        var b = a.CardinalSpline = function(c, e, d) {
            if (e == null) {
                e = this.symmetricPoint(c[1], c[0])
            }
            if (d == null) {
                d = this.symmetricPoint(c[c.length - 2], c[c.length - 1])
            }
            this.splinePoints = c.slice();
            this.splinePoints.unshift(e);
            this.splinePoints.push(d);
            this.splinePoints = this.CatmullRomToBezier(this.splinePoints, 0.5)
        };
        b.prototype = {
            pen: "black",
            strokeThickness: 0,
            symmetricPoint: function(d, c) {
                var g = new a.Point(0, 0);
                var f = d.x - c.x;
                var e = d.y - c.y;
                g.x = c.x - f;
                g.y = c.y - e;
                return g
            },
            CatmullRomToBezier: function(q, k) {
                var c = a.Vector;
                var o = [];
                var w = 0.00001;
                var j = 1;
                var h = q.length - 2;
                for (var r = j; r < h; ++r) {
                    var n = (r + 1) % q.length;
                    var s = (n + 1) % q.length;
                    var t = r - 1 < 0 ? q.length - 1 : r - 1;
                    var g = q[t];
                    var f = q[r];
                    var e = q[n];
                    var d = q[s];
                    var x = c.sub(f, g).length();
                    var v = c.sub(e, f).length();
                    var u = c.sub(d, e).length();
                    var m, l;
                    if (Math.abs(x) < w) {
                        m = f
                    } else {
                        m = c.multiplyScalar(e, Math.pow(x, 2 * k));
                        m = c.sub(m, c.multiplyScalar(g, Math.pow(v, 2 * k)));
                        m = c.add(m, c.multiplyScalar(f, (2 * Math.pow(x, 2 * k) + 3 * Math.pow(x, k) * Math.pow(v, k) + Math.pow(v, 2 * k))));
                        m = c.multiplyScalar(m, 1 / (3 * Math.pow(x, k) * (Math.pow(x, k) + Math.pow(v, k)))).toPoint()
                    }
                    if (Math.abs(u) < w) {
                        l = e
                    } else {
                        l = c.multiplyScalar(f, Math.pow(u, 2 * k));
                        l = c.sub(l, c.multiplyScalar(d, Math.pow(v, 2 * k)));
                        l = c.add(l, c.multiplyScalar(e, (2 * Math.pow(u, 2 * k) + 3 * Math.pow(u, k) * Math.pow(v, k) + Math.pow(v, 2 * k))));
                        l = c.multiplyScalar(l, 1 / (3 * Math.pow(u, k) * (Math.pow(u, k) + Math.pow(v, k)))).toPoint()
                    }
                    if (r == j) {
                        o.push(f)
                    }
                    o.push(m);
                    o.push(l);
                    o.push(e)
                }
                return o
            },
            draw: function(e, c) {
                if (this.shadow && c != false) {
                    e.save();
                    this.shadow.apply(e)
                }
                e.strokeStyle = this.pen;
                e.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / e._mf_scale;
                a.DashStyle.apply(e, this.strokeDashStyle);
                e.beginPath();
                var f = this.splinePoints;
                e.moveTo(f[0].x, f[0].y);
                for (var d = 0; d < f.length - 1; d += 3) {
                    e.bezierCurveTo(f[d + 1].x, f[d + 1].y, f[d + 2].x, f[d + 2].y, f[d + 3].x, f[d + 3].y)
                }
                e.stroke();
                if (this.shadow && c != false) {
                    e.restore()
                }
            },
            drawShadow: function(d) {
                if (this.shadow) {
                    d.save();
                    this.shadow.apply(d);
                    d.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / d._mf_scale;
                    d.beginPath();
                    var e = this.splinePoints;
                    d.moveTo(e[0].x, e[0].y);
                    for (var c = 0; c < e.length - 1; c += 3) {
                        d.bezierCurveTo(e[c + 1].x, e[c + 1].y, e[c + 2].x, e[c + 2].y, e[c + 3].x, e[c + 3].y)
                    }
                    d.strokeStyle = this.shadow.color;
                    d.stroke();
                    d.restore()
                }
            },
            addToContext: function(d) {
                d.beginPath();
                var e = this.splinePoints;
                d.moveTo(e[0].x, e[0].y);
                for (var c = 0; c < e.length - 1; c += 3) {
                    d.bezierCurveTo(e[c + 1].x, e[c + 1].y, e[c + 2].x, e[c + 2].y, e[c + 3].x, e[c + 3].y)
                }
            },
            createSvgElement: function(g) {
                var d = g.createElementNS("http://www.w3.org/2000/svg", "path");
                var e = this.splinePoints;
                var f = "M" + e[0].x + "," + e[0].y;
                for (var c = 0; c < e.length - 1; c += 3) {
                    f += " C" + e[c + 1].x + "," + e[c + 1].y + "," + e[c + 2].x + "," + e[c + 2].y + "," + e[c + 3].x + "," + e[c + 3].y
                }
                d.setAttribute("d", f);
                d.setAttribute("fill", "none");
                d.setAttribute("stroke", "black");
                d.setAttribute("stroke-width", this.strokeThickness ? this.strokeThickness / 4 : 1 / 4);
                return d
            }
        };
        MindFusion.registerClass(b, "MindFusion.Drawing.CardinalSpline")
    })(MindFusion.Drawing);
    (function(b) {
        var a = b.Component = function() {};
        a.prototype = {
            arrange: function(c, f, d, e) {
                this.x = c;
                this.y = f;
                this.actualWidth = d;
                this.actualHeight = e
            },
            effectiveMeasuredWidth: function() {
                return (this.width != null) ? this.width : this.desiredWidth
            },
            effectiveMeasuredHeight: function() {
                return (this.height != null) ? this.height : this.desiredHeight
            },
            add: function(d, c) {
                if (d == null) {
                    return c
                }
                if (c == null) {
                    return d
                }
                return d + c
            },
            max: function(d, c) {
                if (d == null) {
                    return c
                }
                if (c == null) {
                    return d
                }
                return Math.max(d, c)
            },
            hitTest: function(c) {
                if (c.x < this.x || c.x > this.x + this.actualWidth || c.y < this.y || c.y > this.y + this.actualHeight) {
                    return null
                }
                return this
            },
            createSvgElement: function(c) {
                return null
            },
            visibility: b.Visibility.Visible
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Component")
    })(MindFusion.Drawing);
    (function(b) {
        var a = b.Container = function(c, d) {
            mflayer.initializeBase(a, this);
            this.x = c;
            this.y = d;
            this.content = []
        };
        a.prototype = {
            draw: function(d, c, f) {
                var e = d._mf_itemRef;
                if (this.item) {
                    d._mf_itemRef = this.item
                }
                if (this.invalidParent) {
                    this.invalidParent.updateCanvasElements();
                    this.invalidParent = null
                }
                if (this.x || this.y || this.clip || this.rotationAngle) {
                    d.save();
                    var g;
                    if (this.x !== undefined) {
                        d.translate(this.x, this.y);
                        g = d._mf_transform.clone();
                        d._mf_transform.translate(this.x, this.y)
                    }
                    if (this.rotationAngle) {
                        d.save();
                        d.translate(this.pivot.x, this.pivot.y);
                        d.rotate(this.rotationAngle * Math.PI / 180);
                        d.translate(-this.pivot.x, -this.pivot.y)
                    }
                    if (this.clip) {
                        if (mflayer.isInstanceOfType(MindFusion.Drawing.Rect, this.clip)) {
                            d.beginPath();
                            this.clip.drawPath(d);
                            d.clip()
                        } else {
                            if (mflayer.isInstanceOfType(MindFusion.Drawing.Path, this.clip)) {
                                this.clip.addToContext(d, false);
                                d.clip()
                            }
                        }
                    }
                    this.drawChildren(d, c, f);
                    if (this.rotationAngle) {
                        d.restore()
                    }
                    if (this.drawCallback) {
                        this.drawCallback(d, c, f)
                    }
                    if (g) {
                        d._mf_transform = g
                    }
                    d.restore()
                } else {
                    this.drawChildren(d, c, f);
                    if (this.drawCallback) {
                        this.drawCallback(d, c, f)
                    }
                }
                d._mf_itemRef = e
            },
            drawChildren: function(f, c, g) {
                for (var e = 0; e < this.content.length; e++) {
                    var h = this.content[e];
                    var d = h.visibility;
                    if (typeof d == "undefined") {
                        d = b.Visibility.Visible
                    }
                    if (d == b.Visibility.Visible) {
                        if (g && h.drawShadow) {
                            h.drawShadow(f)
                        } else {
                            h.draw(f, c)
                        }
                    }
                }
            },
            createSvgElement: function(m) {
                var l = m.createElementNS("http://www.w3.org/2000/svg", "g");
                if (this.x || this.y || this.rotationAngle) {
                    var e = "";
                    if (this.x || this.y) {
                        e = "translate(" + this.x + " " + this.y + ")"
                    }
                    if (this.rotationAngle) {
                        e += " rotate(" + this.rotationAngle + " " + this.pivot.x + " " + this.pivot.y + ")"
                    }
                    l.setAttribute("transform", e)
                }
                if (this.clip) {
                    var d = "clip" + ++m._mf_clipCounter;
                    var f = m.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                    f.setAttribute("id", d);
                    m._mf_defsElement.appendChild(f);
                    var c = this.clip.createSvgElement(m);
                    f.appendChild(c);
                    l.setAttribute("clip-path", "url(#" + d + ")")
                }
                var k = true;
                for (var j = 0; j < this.content.length; j++) {
                    if (this.content[j].createSvgElement) {
                        var h = this.content[j].createSvgElement(m);
                        if (h != null) {
                            l.appendChild(h);
                            k = false
                        }
                    }
                }
                if (k) {
                    return null
                }
                return l
            }
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Container", b.Component)
    })(MindFusion.Drawing);
    MindFusion.Drawing.DistanceToSegment = function(e, d, c) {
        this.p = e;
        this.a = d;
        this.b = c
    };
    MindFusion.Drawing.DistanceToSegment.prototype = {
        distanceToSegment: function() {
            return Math.sqrt(this.distanceToSegmentSquared())
        },
        distanceToSegmentSquared: function() {
            if (this.a === this.b) {
                return this.distanceSq(this.p, this.a)
            }
            var c = this.b.x - this.a.x;
            var b = this.b.y - this.a.y;
            var a = (this.p.x - this.a.x) * c + (this.p.y - this.a.y) * b;
            if (a < 0) {
                return this.distanceSq(this.a, this.p)
            }
            a = (this.b.x - this.p.x) * c + (this.b.y - this.p.y) * b;
            if (a < 0) {
                return this.distanceSq(this.b, this.p)
            }
            return this.distanceToLineSquared(this.p, this.a, this.b)
        },
        distanceSq: function(b, a) {
            return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)
        },
        distanceToLineSquared: function(h, e, c) {
            if (e === c) {
                return this.distanceSq(h, e)
            }
            var f = c.x - e.x;
            var d = c.y - e.y;
            var g = (h.y - e.y) * f - (h.x - e.x) * d;
            return g * g / (f * f + d * d)
        }
    };
    MindFusion.registerClass(MindFusion.Drawing.DistanceToSegment, "MindFusion.Drawing.DistanceToSegment");
    (function(b) {
        var a = b.Ellipse = function(d, g, e, c) {
            if (arguments.length == 1) {
                var f = d;
                d = f.x;
                g = f.y;
                e = f.width;
                c = f.height
            }
            this.x = d;
            this.y = g;
            this.width = e;
            this.height = c;
            this.transform = new b.Matrix()
        };
        a.prototype = {
            clone: function() {
                return new a(this.x, this.y, this.width, this.height)
            },
            draw: function(e) {
                e.save();
                e.transform.apply(e, this.transform.matrix());
                e.fillStyle = MindFusion.Diagramming.Utils.getBrush(e, this.brush, this.getBounds());
                e.strokeStyle = this.pen;
                e.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / e._mf_scale;
                b.DashStyle.apply(e, this.strokeDashStyle);
                var c = this.x;
                var i = this.y;
                var d = this.width;
                var f = this.height;
                var g = 0.5522848;
                ox = (d / 2) * g, oy = (f / 2) * g, xe = c + d, ye = i + f, xm = c + d / 2, ym = i + f / 2;
                e.beginPath();
                e.moveTo(c, ym);
                e.bezierCurveTo(c, ym - oy, xm - ox, i, xm, i);
                e.bezierCurveTo(xm + ox, i, xe, ym - oy, xe, ym);
                e.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                e.bezierCurveTo(xm - ox, ye, c, ym + oy, c, ym);
                e.closePath();
                e.fill();
                e.stroke();
                e.restore()
            },
            getBounds: function(c) {
                return new MindFusion.Drawing.Rect(this.x, this.y, this.width, this.height)
            },
            toString: function() {
                return this.x + ", " + this.y + ", " + this.width + ", " + this.height
            },
            createSvgElement: function(g) {
                var c = this.x + this.width / 2;
                var h = this.y + this.height / 2;
                var f = this.width / 2;
                var e = this.height / 2;
                var d = g.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                if (this.transform) {
                    d.setAttribute("transform", this.transform.svgMatrix())
                }
                d.setAttribute("cx", c);
                d.setAttribute("cy", h);
                d.setAttribute("rx", f);
                d.setAttribute("ry", e);
                return d
            },
            transform: null,
            pen: "black",
            brush: "transparent"
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Ellipse")
    })(MindFusion.Drawing);
    (function(a) {
        var b = a.Font = function(d, f, e, c, g) {
            this.name = d;
            this.size = f;
            this.bold = e;
            this.italic = c;
            this.underline = g
        };
        b.prototype.toString = function(e) {
            var d = this.size;
            if (e) {
                d *= e
            }
            var c = "";
            if (this.bold) {
                c += "bold "
            }
            if (this.italic) {
                c += "italic "
            }
            c += d + "px " + this.name;
            return c
        };
        b.copy = function(c) {
            return new b(c.name, c.size, c.bold, c.italic, c.underline)
        };
        b.defaultFont = new b("sans-serif", 3);
        MindFusion.registerClass(b, "MindFusion.Drawing.Font")
    })(MindFusion.Drawing);
    MindFusion.Drawing.Gradient = function(c, b, a) {
        this.color1 = c;
        this.color2 = b;
        this.angle = a
    };
    MindFusion.Drawing.Gradient.tm = [32, 102, 111, 114, 32, 74, 97, 118, 97, 83, 99, 114, 105, 112, 116, 44, 32, 116, 114, 105, 97, 108, 32, 118, 101, 114, 115, 105, 111, 110];
    MindFusion.Drawing.Gradient.tm2 = [32, 102, 111, 114, 32, 65, 83, 80, 46, 78, 69, 84, 32, 77, 86, 67, 44, 32, 116, 114, 105, 97, 108, 32, 118, 101, 114, 115, 105, 111, 110];
    MindFusion.Drawing.Gradient.tm3 = [32, 102, 111, 114, 32, 65, 83, 80, 46, 78, 69, 84, 44, 32, 116, 114, 105, 97, 108, 32, 118, 101, 114, 115, 105, 111, 110];
    MindFusion.Drawing.Gradient.tm4 = [32, 102, 111, 114, 32, 65, 83, 80, 46, 78, 69, 84, 44, 32, 118, 53, 46, 52, 46, 49, 32, 98, 101, 116, 97];
    MindFusion.Drawing.Gradient.tm5 = [32, 102, 111, 114, 32, 74, 97, 118, 97, 83, 99, 114, 105, 112, 116, 44, 32, 86, 50, 46, 51, 46, 49, 32, 98, 101, 116, 97];
    MindFusion.Drawing.Gradient.tm6 = [32, 102, 111, 114, 32, 65, 83, 80, 46, 78, 69, 84, 32, 77, 86, 67, 44, 32, 49, 46, 55, 32, 98, 101, 116, 97, 32];
    MindFusion.Drawing.Gradient.tm10 = [100, 105, 97, 103, 114, 97, 109, 95, 108, 105, 99, 46, 116, 120, 116];
    MindFusion.Drawing.Gradient.tm11 = [112, 97, 99, 107, 95, 108, 105, 99, 46, 116, 120, 116];
    MindFusion.registerClass(MindFusion.Drawing.Gradient, "MindFusion.Drawing.Gradient");
    MindFusion.Drawing.GraphicsUnit = {
        World: 0,
        Display: 1,
        Pixel: 2,
        Point: 3,
        Inch: 4,
        Document: 5,
        Millimeter: 6,
        WpfPoint: 7,
        Percent: 8,
        Centimeter: 9,
        unitsPerInch: function(a) {
            switch (a) {
                case this.Display:
                    return 100;
                case this.Document:
                    return 300;
                case this.Inch:
                    return 1;
                case this.Millimeter:
                    return 25.4;
                case this.Point:
                    return 72;
                case this.Pixel:
                    return 96;
                case this.WpfPoint:
                    return 96;
                case this.Centimeter:
                    return 2.54
            }
            return 1
        },
        convert: function(a, b, c) {
            return a * this.unitsPerInch(c) / this.unitsPerInch(b)
        },
        getPixel: function(a) {
            return this.convert(1, this.Pixel, a)
        },
        getMillimeter: function(a) {
            return this.convert(1, this.Millimeter, a)
        },
        getStandardDivisions: function(a) {
            if (a == this.Inch) {
                return 8
            }
            return 10
        }
    };
    (function(a) {
        a.Image = function(b) {
            this.loaded = false;
            this.image = new Image();
            this.bounds = b;
            this.transform = new a.Matrix();
            this.clipPath = new a.Path();
            this.type = this.constructor.__typeName;
            this.svg = false;
            this.imageAlign = a.ImageAlign.Fit
        };
        a.Image.prototype = {
            getType: function() {
                return this.type
            },
            setBounds: function(c, d) {
                this.bounds = c;
                var b = new a.Matrix();
                if (d !== 0) {
                    b.rotateAt(d, this.bounds.x + this.bounds.width / 2, this.bounds.y + this.bounds.height / 2)
                }
                this.rotationAngle = d;
                this.transform = b
            },
            getBounds: function() {
                return this.bounds
            },
            draw: function(e) {
                if (this.image == null) {
                    return
                }
                if (this.image.src !== "" && this.loaded) {
                    if (!this.clipPath.empty()) {
                        e.save();
                        this.clipPath.addToContext(e);
                        e.restore();
                        e.save();
                        e.clip()
                    }
                    var g = a.GraphicsUnit.getPixel(e._mf_measureUnit);
                    var b = this.svg ? {
                        x: this.bounds.width * g,
                        y: this.bounds.height * g
                    } : {
                        x: this.image.width * g,
                        y: this.image.height * g
                    };
                    var d = this.getImageRect(this.bounds, b);
                    e.save();
                    if (this.svg) {
                        var f = this.applyDiagramTransform(e, d);
                        e.setTransform(1, 0, 0, 1, 0, 0);
                        var c = new a.Matrix();
                        if (this.rotationAngle !== 0) {
                            c.rotateAt(this.rotationAngle, f.x + f.width / 2, f.y + f.height / 2)
                        }
                        e.transform.apply(e, c.matrix());
                        e.drawImage(this.image, f.x, f.y, f.width, f.height)
                    } else {
                        e.transform.apply(e, this.transform.matrix());
                        e.drawImage(this.image, d.x, d.y, d.width, d.height)
                    }
                    e.restore();
                    if (!this.clipPath.empty()) {
                        e.restore()
                    }
                }
            },
            applyDiagramTransform: function(d, c) {
                var e = c.clone();
                var b = d._mf_transform;
                var f = e.topLeft();
                b.transformPoint(f);
                e.x = f.x;
                e.y = f.y;
                e.width *= d._mf_scale;
                e.height *= d._mf_scale;
                return e
            },
            measure: function(d, c) {
                var e = a.GraphicsUnit;
                var b = a.Component.context;
                this.desiredWidth = this.image.width ? e.convert(this.image.width, e.Pixel, b.measureUnit) : null;
                this.desiredHeight = this.image.height ? e.convert(this.image.height, e.Pixel, b.measureUnit) : null
            },
            effectiveMeasuredWidth: function() {
                return this.desiredWidth
            },
            effectiveMeasuredHeight: function() {
                return this.desiredHeight
            },
            getImageRect: function(m, g) {
                var b = this.imageAlign;
                var l = 0,
                    e = 0,
                    n = g.x,
                    f = g.y,
                    i = m;
                switch (b) {
                    case a.ImageAlign.TopLeft:
                        l = i.left();
                        e = i.top();
                        break;
                    case a.ImageAlign.BottomLeft:
                        l = i.left();
                        e = i.bottom() - f;
                        break;
                    case a.ImageAlign.TopRight:
                        l = i.right() - n;
                        e = i.top();
                        break;
                    case a.ImageAlign.BottomRight:
                        l = i.right() - n;
                        e = i.bottom() - f;
                        break;
                    case a.ImageAlign.Center:
                        l = (i.right() + i.left() - n) / 2;
                        e = (i.bottom() + i.top() - f) / 2;
                        break;
                    case a.ImageAlign.TopCenter:
                        l = i.x + i.width / 2 - n / 2;
                        e = i.y;
                        break;
                    case a.ImageAlign.BottomCenter:
                        l = i.x + i.width / 2 - n / 2;
                        e = i.bottom() - f;
                        break;
                    case a.ImageAlign.MiddleLeft:
                        l = i.x;
                        e = i.y + i.height / 2 - f / 2;
                        break;
                    case a.ImageAlign.MiddleRight:
                        l = i.right() - n;
                        e = i.y + i.height / 2 - f / 2;
                        break;
                    case a.ImageAlign.Fit:
                        var d = i.height;
                        var j = i.width;
                        if (d == 0) {
                            break
                        }
                        var k = j / d;
                        var c = n / f;
                        if (k > c) {
                            f = d;
                            n = (c * f);
                            e = i.top();
                            l = (i.right() + i.left() - n) / 2
                        } else {
                            n = j;
                            if (c == 0) {
                                break
                            }
                            f = (n / c);
                            l = i.left();
                            e = (i.bottom() + i.top() - f) / 2
                        }
                        break;
                    case a.ImageAlign.Stretch:
                        n = i.right() - i.left();
                        f = i.bottom() - i.top();
                        l = i.left();
                        e = i.top();
                        break;
                    case a.ImageAlign.Tile:
                        l = i.left();
                        e = i.top();
                        break
                }
                return new a.Rect(l, e, n, f)
            },
            getDefaultProperty: function() {
                return this.image.src
            },
            setDefaultProperty: function(b) {
                this.image.src = b
            },
            getDefaultValue: function() {
                return ""
            },
            createSvgElement: function(e) {
                var b = e.createElementNS("http://www.w3.org/2000/svg", "image");
                b.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.image.src);
                var c = {
                    x: this.image.width,
                    y: this.image.height
                };
                var d = this.getImageRect(this.bounds, c);
                b.setAttribute("x", d.x + "px");
                b.setAttribute("y", d.y + "px");
                b.setAttribute("width", d.width + "px");
                b.setAttribute("height", d.height + "px");
                if (this.transform) {
                    b.setAttribute("transform", this.transform.svgMatrix())
                }
                return b
            },
            bounds: null,
            transform: null,
            image: null,
            horizontalAlignment: a.LayoutAlignment.Stretch,
            verticalAlignment: a.LayoutAlignment.Stretch
        };
        MindFusion.registerClass(a.Image, "MindFusion.Drawing.Image")
    })(MindFusion.Drawing);
    (function(a) {
        var b = a.Line = function(d, f, c, e) {
            this.x1 = d;
            this.y1 = f;
            this.x2 = c;
            this.y2 = e;
            this.transform = new a.Matrix();
            this.pen = "black";
            this.strokeThickness = 0
        };
        b.prototype = {
            draw: function(d, c) {
                if (this.clipPath && !this.clipPath.empty()) {
                    this.clipPath.addToContext(d);
                    d.save();
                    d.clip()
                }
                if (this.shadow && c != false) {
                    d.save();
                    this.shadow.apply(d)
                }
                d.strokeStyle = this.pen;
                d.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / d._mf_scale;
                a.DashStyle.apply(d, this.strokeDashStyle);
                d.beginPath();
                d.moveTo(this.x1, this.y1);
                d.lineTo(this.x2, this.y2);
                d.stroke();
                if (this.shadow && c != false) {
                    d.restore()
                }
                if (this.clipPath && !this.clipPath.empty()) {
                    d.restore()
                }
            },
            drawShadow: function(c) {
                if (this.shadow) {
                    c.save();
                    this.shadow.apply(c);
                    c.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / c._mf_scale;
                    c.beginPath();
                    c.moveTo(this.x1, this.y1);
                    c.lineTo(this.x2, this.y2);
                    c.strokeStyle = this.shadow.color;
                    c.stroke();
                    c.restore()
                }
            },
            setBounds: function(d, c) {
                this.x1 = d.x;
                this.y1 = d.y;
                this.x2 = c.x;
                this.y2 = c.y
            },
            setPen: function(c) {
                this.pen = c
            },
            createSvgElement: function(d) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "line");
                if (this.transform) {
                    c.setAttribute("transform", this.transform.svgMatrix())
                }
                c.setAttribute("x1", this.x1);
                c.setAttribute("x2", this.x2);
                c.setAttribute("y1", this.y1);
                c.setAttribute("y2", this.y2);
                if (this.pen) {
                    c.setAttribute("stroke", this.pen)
                }
                c.setAttribute("stroke-width", this.strokeThickness ? this.strokeThickness / 4 : 1 / 4);
                return c
            }
        };
        MindFusion.registerClass(b, "MindFusion.Drawing.Line")
    })(MindFusion.Drawing);
    MindFusion.Drawing.Matrix = function() {
        this.elements = [];
        this.elements[0] = 1;
        this.elements[1] = 0;
        this.elements[2] = 0;
        this.elements[3] = 1;
        this.elements[4] = 0;
        this.elements[5] = 0
    };
    MindFusion.Drawing.Matrix.fromValues = function(b) {
        var a = new MindFusion.Drawing.Matrix();
        a.elements = b;
        return a
    };
    MindFusion.Drawing.Matrix.prototype = {
        matrix: function() {
            return this.elements
        },
        isIdentity: function() {
            if (this.elements[0] == 1 && this.elements[1] == 0 && this.elements[2] == 0 && this.elements[3] == 1 && this.elements[4] == 0 && this.elements[5] == 0) {
                return true
            }
            return false
        },
        clone: function() {
            var a = new MindFusion.Drawing.Matrix();
            a.elements = this.elements.slice(0);
            return a
        },
        translate: function(a, b) {
            this.elements[4] += this.elements[0] * a + this.elements[2] * b;
            this.elements[5] += this.elements[1] * a + this.elements[3] * b
        },
        scale: function(b, a) {
            this.elements[0] *= b;
            this.elements[1] *= b;
            this.elements[2] *= a;
            this.elements[3] *= a
        },
        scaleAtCenter: function(e, c, b) {
            var a = b.x + b.width / 2;
            var d = b.y + b.height / 2;
            this.translate(a, d);
            this.scale(e, c);
            this.translate(-a, -d)
        },
        rotate: function(j) {
            j = (j * Math.PI) / 180;
            var g = Math.sin(j).toFixed(3);
            var h = Math.cos(j).toFixed(3);
            var f = this.elements[0];
            var e = this.elements[1];
            var k = this.elements[2];
            var i = this.elements[3];
            this.elements[0] = f * h - e * g;
            this.elements[1] = f * g + e * h;
            this.elements[2] = k * h - i * g;
            this.elements[3] = k * g + i * h
        },
        rotateAt: function(e, l, i) {
            if (l instanceof MindFusion.Drawing.Point) {
                i = l.y;
                l = l.x
            }
            e = e * Math.PI / 180;
            this.translate(l, i);
            var h = Math.sin(e).toFixed(3);
            var m = Math.cos(e).toFixed(3);
            var k = this.elements[0];
            var j = this.elements[1];
            var g = this.elements[2];
            var f = this.elements[3];
            this.elements[0] = k * m - j * h;
            this.elements[1] = k * h + j * m;
            this.elements[2] = g * m - f * h;
            this.elements[3] = g * h + f * m;
            this.translate(-l, -i)
        },
        invert: function() {
            var b = this.elements[0] * (this.elements[3] * 1 - this.elements[5] * 0) - this.elements[1] * (this.elements[2] * 1 - 0 * this.elements[4]) + 0 * (this.elements[2] * this.elements[5] - this.elements[3] * this.elements[4]);
            var c = 1 / b;
            var a = new MindFusion.Drawing.Matrix();
            a.elements[0] = (this.elements[3] * 1 - this.elements[5] * 0) * c;
            a.elements[1] = (this.elements[4] * this.elements[5] - this.elements[1] * 1) * c;
            a.elements[2] = (0 * this.elements[4] - this.elements[2] * 1) * c;
            a.elements[3] = (this.elements[0] * 1 - 0 * this.elements[4]) * c;
            a.elements[4] = (this.elements[2] * this.elements[5] - this.elements[4] * this.elements[3]) * c;
            a.elements[5] = (this.elements[4] * this.elements[1] - this.elements[0] * this.elements[5]) * c;
            return a
        },
        transformPoint: function(b) {
            var a = b.x;
            var c = b.y;
            b.x = this.elements[0] * a + this.elements[2] * c + this.elements[4];
            b.y = this.elements[1] * a + this.elements[3] * c + this.elements[5]
        },
        transformPoints: function(b) {
            for (var a = 0; a < b.length; a++) {
                this.transformPoint(b[a])
            }
        },
        transformRect: function(b) {
            var a = b.getCornerPoints();
            this.transformPoints(a);
            return MindFusion.Drawing.Rect.boundingRect(a)
        },
        svgMatrix: function() {
            var a = "matrix(";
            for (var b = 0; b < this.elements.length; b++) {
                a += this.elements[b];
                if (b < this.elements.length - 1) {
                    a += ","
                } else {
                    a += ")"
                }
            }
            return a
        }
    };
    MindFusion.registerClass(MindFusion.Drawing.Matrix, "MindFusion.Drawing.Matrix");
    (function(b) {
        var a = b.Path = function(c) {
            this.shapeImpl = null;
            this.builder = null;
            this.path = null;
            this.brush = null;
            this.pen = null;
            this.text = null;
            this.positionX = null;
            this.positionY = null;
            this.minX = Number.MAX_VALUE;
            this.minY = Number.MAX_VALUE;
            this.maxX = 0;
            this.maxY = 0;
            this.strokeThickness = 0;
            this.lineJoin = "miter";
            this.transform = new b.Matrix();
            this.svgPath = c;
            this.init();
            if (c != null) {
                var f = ["M", "L", "B", "Q", "A", "Z", "C", "E", "R", "U"];
                var e = 0;
                while (e < f.length) {
                    var d = f[e];
                    c = c.replace(new RegExp(d, "g"), ":" + d);
                    e++
                }
                var g = c.split(":");
                this.commands = g.filter(String);
                this.parse();
                this.done()
            }
        };
        a.prototype = {
            setBounds: function(c) {
                this.bounds = c;
                this.updatePosition()
            },
            init: function() {
                this.builder = []
            },
            clone: function() {
                var c = new a();
                c.minX = this.minX;
                c.minY = this.minY;
                c.maxX = this.maxX;
                c.maxY = this.maxY;
                c.builder = this.builder;
                c.pen = this.pen;
                c.brush = this.brush;
                c.transform = new b.Matrix();
                return c
            },
            getType: function() {
                return this.constructor.__typeName
            },
            empty: function() {
                if (this.builder.length === 0) {
                    return true
                }
                return false
            },
            parse: function() {
                b.PathParser.parse(this.commands, this)
            },
            addToContext: function(f, d) {
                if (d == false) {
                    f.save()
                }
                if (this.transform) {
                    f.transform.apply(f, this.transform.matrix())
                }
                f.beginPath();
                var g = this.builder;
                var c = g.length;
                if (c > 0) {
                    var e = 0;
                    while (e < c) {
                        switch (g[e]) {
                            case "M":
                                f.moveTo(g[e + 1], g[e + 3]);
                                e += 4;
                                break;
                            case "L":
                                f.lineTo(g[e + 1], g[e + 3]);
                                e += 4;
                                break;
                            case "C":
                                f.bezierCurveTo(g[e + 1], g[e + 3], g[e + 5], g[e + 7], g[e + 9], g[e + 11]);
                                e += 12;
                                break;
                            case "Q":
                                f.quadraticCurveTo(g[e + 1], g[e + 3], g[e + 5], g[e + 7]);
                                e += 8;
                                break;
                            case "A":
                                f.arc(g[e + 1], g[e + 3], g[e + 5], g[e + 7], g[e + 9], g[e + 11]);
                                e += 12;
                                break;
                            case "R":
                                f.rect(g[e + 1], g[e + 3], g[e + 5], g[e + 7]);
                                e += 8;
                                break;
                            case "E":
                                f.moveTo(g[e + 1], g[e + 3] - g[e + 7] / 2);
                                f.bezierCurveTo(g[e + 1] + g[e + 5] / 2, g[e + 3] - g[e + 7] / 2, g[e + 1] + g[e + 5] / 2, g[e + 3] + g[e + 7] / 2, g[e + 1], g[e + 3] + g[e + 7] / 2);
                                f.bezierCurveTo(g[e + 1] - g[e + 5] / 2, g[e + 3] + g[e + 7] / 2, g[e + 1] - g[e + 5] / 2, g[e + 3] - g[e + 7] / 2, g[e + 1], g[e + 3] - g[e + 7] / 2);
                                e += 8;
                                break;
                            case "U":
                                f.roundRect(g[e + 1], g[e + 3], g[e + 5], g[e + 7], g[e + 9]);
                                e += 10;
                                break;
                            case "Z":
                                if (f.closePath) {
                                    f.closePath()
                                }
                                default:
                                    e += 1
                        }
                    }
                }
                if (d == false) {
                    f.restore()
                }
            },
            draw: function(d, c) {
                d.save();
                this.addToContext(d);
                if (this.shadow && c != false) {
                    this.shadow.apply(d)
                }
                if (this.brush) {
                    d.fillStyle = MindFusion.Diagramming.Utils.getBrush(d, this.brush, this.getBounds());
                    d.fill()
                }
                d.restore();
                if (this.pen) {
                    d.strokeStyle = MindFusion.Diagramming.Utils.getBrush(d, this.pen, this.getBounds(), true);
                    d.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / d._mf_scale;
                    b.DashStyle.apply(d, this.strokeDashStyle);
                    d.lineJoin = this.lineJoin;
                    d.stroke()
                }
            },
            drawShadow: function(c) {
                if (this.shadow) {
                    c.save();
                    this.addToContext(c);
                    this.shadow.apply(c);
                    if (this.brush) {
                        c.fillStyle = this.shadow.color;
                        c.fill()
                    } else {
                        if (this.pen) {
                            c.strokeStyle = this.shadow.color;
                            c.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / c._mf_scale;
                            c.lineJoin = this.lineJoin;
                            c.stroke()
                        }
                    }
                    c.restore()
                }
            },
            done: function() {
                if (this.builder) {
                    this.path = this.builder.join("")
                }
                this.updatePathDefinition()
            },
            moveTo: function(c, d) {
                this.builder.push("M");
                this.builder.push(c);
                this.builder.push(",");
                this.builder.push(d);
                this.positionX = c;
                this.positionY = d;
                this.expandRect(c, d)
            },
            lineTo: function(c, d) {
                this.builder.push("L");
                this.builder.push(c);
                this.builder.push(",");
                this.builder.push(d);
                this.positionX = c;
                this.positionY = d;
                this.expandRect(c, d)
            },
            bezierTo: function(f, h, d, g, c, e) {
                this.builder.push("C");
                this.builder.push(f);
                this.builder.push(",");
                this.builder.push(h);
                this.builder.push(",");
                this.builder.push(d);
                this.builder.push(",");
                this.builder.push(g);
                this.builder.push(",");
                this.builder.push(c);
                this.builder.push(",");
                this.builder.push(e);
                this.positionX = c;
                this.positionY = e;
                this.expandRect(f, h);
                this.expandRect(d, g);
                this.expandRect(c, e)
            },
            arcTo: function(d, i, c, f, e, h) {
                this.builder.push("A");
                this.builder.push(d);
                this.builder.push(",");
                this.builder.push(i);
                this.builder.push(",");
                this.builder.push(c);
                this.builder.push(",");
                this.builder.push(f);
                this.builder.push(",");
                this.builder.push(e);
                this.builder.push(",");
                this.builder.push(h);
                this.positionX = d;
                this.positionY = i;
                var g = +c;
                this.expandRect(+d - g, +i - g);
                this.expandRect(+d + g, +i + g)
            },
            quadraticCurveTo: function(d, e, c, f) {
                this.builder.push("Q");
                this.builder.push(d);
                this.builder.push(",");
                this.builder.push(e);
                this.builder.push(",");
                this.builder.push(c);
                this.builder.push(",");
                this.builder.push(f);
                this.positionX = c;
                this.positionY = f;
                this.expandRect(d, e);
                this.expandRect(c, f)
            },
            addRect: function(d, f, e, c) {
                this.builder.push("R");
                this.builder.push(d);
                this.builder.push(",");
                this.builder.push(f);
                this.builder.push(",");
                this.builder.push(e);
                this.builder.push(",");
                this.builder.push(c);
                this.positionX = d + e;
                this.positionY = f + c;
                this.expandRect(d, f);
                this.expandRect(d + e, f + c)
            },
            addRoundRect: function(d, c) {
                this.moveTo(d.x, d.y + c);
                this.lineTo(d.x, d.y + d.height - c);
                this.quadraticCurveTo(d.x, d.y + d.height, d.x + c, d.y + d.height);
                this.lineTo(d.x + d.width - c, d.y + d.height);
                this.quadraticCurveTo(d.x + d.width, d.y + d.height, d.x + d.width, d.y + d.height - c);
                this.lineTo(d.x + d.width, d.y + c);
                this.quadraticCurveTo(d.x + d.width, d.y, d.x + d.width - c, d.y);
                this.lineTo(d.x + c, d.y);
                this.quadraticCurveTo(d.x, d.y, d.x, d.y + c)
            },
            roundRect: function(e, g, d, f, c) {
                var h = MindFusion.Drawing.Rect.fromPoints(new MindFusion.Drawing.Point(e, g), new MindFusion.Drawing.Point(d, f));
                this.addRoundRect(h, c)
            },
            addEllipse: function(d, f, e, c) {
                this.builder.push("E");
                this.builder.push(d);
                this.builder.push(",");
                this.builder.push(f);
                this.builder.push(",");
                this.builder.push(e);
                this.builder.push(",");
                this.builder.push(c);
                this.positionX = d;
                this.positionY = f;
                this.expandRect(d - e, f - c);
                this.expandRect(d + e, f + c)
            },
            close: function() {
                this.builder.push("Z")
            },
            setBrush: function(c) {
                this.brush = c;
                this.updatePathDefinition()
            },
            setPen: function(c) {
                this.pen = c;
                this.updatePathDefinition()
            },
            setText: function(c) {
                this.text = c;
                this.updatePathDefinition()
            },
            create: function(c) {},
            getBounds: function() {
                return new b.Rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY)
            },
            expandRect: function(c, d) {
                this.minX = Math.min(this.minX, c);
                this.minY = Math.min(this.minY, d);
                this.maxX = Math.max(this.maxX, c);
                this.maxY = Math.max(this.maxY, d)
            },
            updatePosition: function() {},
            updatePathDefinition: function() {},
            createSvgElement: function(d) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "path");
                if (this.transform) {
                    c.setAttribute("transform", this.transform.svgMatrix())
                }
                if (this.svgPath) {
                    c.setAttribute("d", this.svgPath || this.path)
                } else {
                    if (!this.path) {
                        this.done()
                    }
                    c.setAttribute("d", this.path)
                }
                if (this.brush) {
                    c.setAttribute("fill", MindFusion.Diagramming.Utils.getBrush(null, this.brush, this.getBounds()))
                } else {
                    c.setAttribute("fill", "none")
                }
                if (this.pen) {
                    c.setAttribute("stroke", this.pen)
                }
                c.setAttribute("stroke-width", this.strokeThickness ? this.strokeThickness / 4 : 1 / 4);
                return c
            },
            transform: null
        };
        a.fromPoints = function(d) {
            var e = new a(null);
            for (var c = 0; c < d.length; c++) {
                e.moveTo(d[c].x, d[c].y)
            }
            return e
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.Path")
    })(MindFusion.Drawing);
    (function(b) {
        var a = b.PathParser = function() {};
        a.parse = function(p, D) {
            var F = 0;
            var E = 0;
            for (var G = 0; G < p.length; G++) {
                var m = p[G];
                var L = p[G][0];
                switch (L) {
                    case "M":
                        m = m.substring(1, m.length);
                        var A = +m.split(",")[0];
                        var z = +m.split(",")[1];
                        D.moveTo(A, z);
                        F = A;
                        E = z;
                        break;
                    case "L":
                        m = m.substring(1, m.length);
                        var A = +m.split(",")[0];
                        var z = +m.split(",")[1];
                        D.lineTo(A, z);
                        F = A;
                        E = z;
                        break;
                    case "B":
                        m = m.substring(1, m.length);
                        var J = +m.split(",")[0];
                        var k = +m.split(",")[1];
                        var I = +m.split(",")[2];
                        var j = +m.split(",")[3];
                        var H = +m.split(",")[4];
                        var f = +m.split(",")[5];
                        D.bezierTo(I, j, H, f, J, k);
                        F = J;
                        E = k;
                        break;
                    case "C":
                        m = m.substring(1, m.length);
                        var J = +m.split(",")[0];
                        var k = +m.split(",")[1];
                        var I = +m.split(",")[2];
                        var j = +m.split(",")[3];
                        var H = +m.split(",")[4];
                        var f = +m.split(",")[5];
                        D.bezierTo(J, k, I, j, H, f);
                        F = H;
                        E = f;
                        break;
                    case "Q":
                        m = m.substring(1, m.length);
                        var J = +m.split(",")[0];
                        var k = +m.split(",")[1];
                        var A = +m.split(",")[2];
                        var z = +m.split(",")[3];
                        D.quadraticCurveTo(J, k, A, z);
                        F = A;
                        E = z;
                        break;
                    case "A":
                        m = m.substring(1, m.length);
                        var s = +m.split(",")[0];
                        var q = +m.split(",")[1];
                        var u = +m.split(",")[2];
                        var o = +m.split(",")[3];
                        var h = +m.split(",")[4];
                        h = h == 0 ? 1 : 0;
                        var A = +m.split(",")[5];
                        var z = +m.split(",")[6];
                        var w = new MindFusion.Drawing.Point(F, E);
                        var v = new MindFusion.Drawing.Point(A, z);
                        var K = new MindFusion.Drawing.Matrix();
                        K.rotate(-u);
                        K.scale(q / s, 1);
                        K.transformPoint(w);
                        K.transformPoint(v);
                        var r = new MindFusion.Drawing.Point((w.x + v.x) / 2, (w.y + v.y) / 2);
                        var C = new MindFusion.Drawing.Vector(v.x - w.x, v.y - w.y);
                        var t = C.length() / 2;
                        var l;
                        if (o == h) {
                            l = new MindFusion.Drawing.Vector(-C.y, C.x)
                        } else {
                            l = new MindFusion.Drawing.Vector(C.y, -C.x)
                        }
                        if (l.x != 0 || l.y != 0) {
                            l = l.normalize()
                        }
                        var N = q * q - t * t;
                        var d = N > 0 ? Math.sqrt(N) : 0;
                        var M = new MindFusion.Drawing.Point(r.x + d * l.x, r.y + d * l.y);
                        var g = Math.atan2(w.y - M.y, w.x - M.x);
                        var e = Math.atan2(v.y - M.y, v.x - M.x);
                        if (o == (Math.abs(e - g) < Math.PI)) {
                            if (g < e) {
                                g += 2 * Math.PI
                            } else {
                                e += 2 * Math.PI
                            }
                        }
                        startAngle = (g * 180 / Math.PI) % 360;
                        if (h) {
                            g = (g < 0) ? 2 * Math.PI - Math.abs(g) : g;
                            e = (e < 0) ? 2 * Math.PI - Math.abs(e) : e
                        }
                        var B = (e * 180 / Math.PI) % 360;
                        sweepAngle = ((e - g) * 180 / Math.PI) % 360;
                        startAngle = (startAngle < 0) ? (360 - Math.abs(startAngle)) : startAngle;
                        if (!h) {
                            sweepAngle = (sweepAngle < 0) ? (360 - Math.abs(sweepAngle)) : sweepAngle
                        }
                        K = K.invert();
                        K.transformPoint(M);
                        startAngle = startAngle * Math.PI / 180;
                        B = B * Math.PI / 180;
                        if (startAngle == B) {
                            B += 2 * Math.PI
                        }
                        D.arcTo(M.x, M.y, s, startAngle, B, h);
                        F = A;
                        E = z;
                        break;
                    case "U":
                        m = m.substring(1, m.length);
                        var J = +m.split(",")[0];
                        var k = +m.split(",")[1];
                        var I = +m.split(",")[2];
                        var j = +m.split(",")[3];
                        var n = +m.split(",")[4];
                        D.roundRect(J, k, I, j, n);
                        F = J;
                        E = k;
                        break;
                    case "Z":
                        D.close();
                        break
                }
            }
        };
        MindFusion.registerClass(a, "MindFusion.Drawing.PathParser")
    })(MindFusion.Drawing);
    MindFusion.Drawing.Point = function(a, b) {
        this.x = a;
        this.y = b;
        this.type = this.constructor.__typeName
    };
    MindFusion.Drawing.Point.distance = function(b, a) {
        return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
    };
    MindFusion.Drawing.Point.angleBetween = function(d, c) {
        var a = c.y - d.y;
        var b = c.x - d.x;
        return Math.atan2(a, b) / Math.PI * 180
    };
    MindFusion.Drawing.Point.addVector = function(a, b) {
        var c = a.clone();
        c.addVector(b);
        return c
    };
    MindFusion.Drawing.Point.prototype = {
        getType: function() {
            return this.type
        },
        empty: function() {
            return (this.x === 0 && this.y === 0)
        },
        distance: function(a) {
            return Math.sqrt(Math.pow((this.x - a.x), 2) + Math.pow((this.y - a.y), 2))
        },
        angleBetween: function(a) {
            var b = a.y - this.y;
            var c = a.x - this.x;
            return Math.atan2(b, c) / Math.PI * 180
        },
        addVector: function(a) {
            this.x += a.x;
            this.y += a.y;
            return this
        },
        newWithOffset: function(b, a) {
            var c = this.clone();
            c.x += b;
            c.y += a;
            return c
        },
        equals: function(a) {
            if (!a) {
                return false
            }
            return (this.x === a.x && this.y === a.y)
        },
        clone: function() {
            var a = new MindFusion.Drawing.Point(this.x, this.y);
            return a
        }
    };
    MindFusion.registerClass(MindFusion.Drawing.Point, "MindFusion.Drawing.Point");
    (function(c) {
        var a = MindFusion.Collections.ArrayList;
        var b = c.Rect = function(e, g, f, d) {
            if (g instanceof MindFusion.Drawing.Size) {
                f = g.width;
                d = g.height
            }
            if (e instanceof MindFusion.Drawing.Point) {
                g = e.y;
                e = e.x
            }
            this.x = e;
            this.y = g;
            this.width = f;
            this.height = d;
            this.transform = new c.Matrix();
            this.type = this.constructor.__typeName
        };
        b.fromLTRB = function(e, f, g, d) {
            return new b(Math.min(e, g), Math.min(f, d), Math.abs(g - e), Math.abs(d - f))
        };
        b.fromArgs = function(d) {
            return new b(d[0], d[1], d[2], d[3])
        };
        b.fromPoints = function(e, d) {
            return b.fromLTRB(e.x, e.y, d.x, d.y)
        };
        b.fromCenterAndSize = function(d, f) {
            var e = f.width;
            var g = f.height;
            return new b(d.x - e / 2, d.y - g / 2, e, g)
        };
        b.fromPositionAndSize = function(d, e) {
            return new b(d.x, d.y, e.width, e.height)
        };
        b.fromVertex = function(e) {
            var d = e.width;
            var f = e.height;
            return new b(e.x - d / 2, e.y - f / 2, d, f)
        };
        b.boundingRect = function(g) {
            var e = Number.MAX_VALUE;
            var f = Number.MAX_VALUE;
            var h = Number.MIN_VALUE;
            var d = Number.MIN_VALUE;
            a.forEach(g, function(i) {
                e = Math.min(e, i.x);
                f = Math.min(f, i.y);
                h = Math.max(h, i.x);
                d = Math.max(d, i.y)
            });
            return b.fromLTRB(e, f, h, d)
        };
        b.prototype = {
            getType: function() {
                return this.type
            },
            isEmpty: function() {
                return (this.width === 0 && this.height === 0)
            },
            right: function() {
                return Math.max(this.x, this.x + this.width)
            },
            left: function() {
                return Math.min(this.x, this.x + this.width)
            },
            bottom: function() {
                return Math.max(this.y, this.y + this.height)
            },
            top: function() {
                return Math.min(this.y, this.y + this.height)
            },
            center: function() {
                return new c.Point(this.left() + this.width / 2, this.top() + this.height / 2)
            },
            centerX: function() {
                return this.left() + this.width / 2
            },
            centerY: function() {
                return this.top() + this.height / 2
            },
            topLeft: function() {
                return new c.Point(this.left(), this.top())
            },
            topRight: function() {
                return new c.Point(this.right(), this.top())
            },
            topMiddle: function() {
                return new c.Point(this.x + this.width / 2, this.top())
            },
            bottomLeft: function() {
                return new c.Point(this.left(), this.bottom())
            },
            bottomRight: function() {
                return new c.Point(this.right(), this.bottom())
            },
            adjusted: function(e, f, g, d) {
                return b.fromLTRB(this.left() + e, this.top() + f, this.right() + g, this.bottom() + d)
            },
            intersectsWith: function(d) {
                return !(this.intersect(d) === b.empty)
            },
            intersectsInc: function(d) {
                if (this.bottom() <= d.top()) {
                    return false
                }
                if (this.top() >= d.bottom()) {
                    return false
                }
                if (this.left() >= d.right()) {
                    return false
                }
                if (this.right() <= d.left()) {
                    return false
                }
                return true
            },
            contains: function(d) {
                if (d) {
                    if (d instanceof MindFusion.Drawing.Rect) {
                        if (this.containsPoint(d.bottomLeft()) && this.containsPoint(d.bottomRight()) && this.containsPoint(d.topLeft()) && this.containsPoint(d.topRight())) {
                            return true
                        }
                    } else {
                        if (d instanceof MindFusion.Drawing.Point) {
                            if (this.containsPoint(d)) {
                                return true
                            }
                        }
                    }
                }
                return false
            },
            containsPoint: function(d) {
                return this.left() <= d.x && this.right() >= d.x && this.top() <= d.y && this.bottom() >= d.y
            },
            union: function(f) {
                if (!f) {
                    return this
                }
                var h = Math.min(this.left(), f.left());
                var e = Math.max(this.right(), f.right());
                var g = Math.min(this.top(), f.top());
                var d = Math.max(this.bottom(), f.bottom());
                return new b(h, g, e - h, d - g)
            },
            intersect: function(f) {
                if (this.bottom() < f.top()) {
                    return b.empty
                }
                if (this.top() > f.bottom()) {
                    return b.empty
                }
                if (this.left() > f.right()) {
                    return b.empty
                }
                if (this.right() < f.left()) {
                    return b.empty
                }
                var h = Math.max(this.left(), f.left());
                var e = Math.min(this.right(), f.right());
                var d = Math.min(this.bottom(), f.bottom());
                var g = Math.max(this.top(), f.top());
                return new b(h, g, e - h, d - g)
            },
            clone: function() {
                return new b(this.x, this.y, this.width, this.height)
            },
            draw: function(e, d) {
                e.save();
                e.transform.apply(e, this.transform.matrix());
                e.beginPath();
                e.rect(this.x, this.y, this.width, this.height);
                e.save();
                if (this.shadow && d != false) {
                    this.shadow.apply(e)
                }
                if (this.brush) {
                    e.fillStyle = MindFusion.Diagramming.Utils.getBrush(e, this.brush, this.getBounds());
                    e.fill()
                }
                e.restore();
                if (this.pen) {
                    e.strokeStyle = this.pen;
                    e.lineWidth = (this.strokeThickness ? this.strokeThickness : 1) / e._mf_scale;
                    c.DashStyle.apply(e, this.strokeDashStyle);
                    e.stroke()
                }
                e.restore()
            },
            drawShadow: function(d) {
                if (this.shadow) {
                    d.save();
                    this.shadow.apply(d);
                    d.transform.apply(d, this.transform.matrix());
                    d.beginPath();
                    d.rect(this.x, this.y, this.width, this.height);
                    d.fillStyle = this.shadow.color;
                    d.fill();
                    d.restore()
                }
            },
            drawPath: function(d) {
                d.rect(this.x, this.y, this.width, this.height)
            },
            setClip: function(d) {
                d.beginPath();
                d.rect(this.x, this.y, this.width, this.height);
                d.clip()
            },
            getBounds: function() {
                return new MindFusion.Drawing.Rect(this.x, this.y, this.width, this.height)
            },
            setBounds: function(d) {
                this.x = d.x;
                this.y = d.y;
                this.width = d.width;
                this.height = d.height
            },
            setLocation: function(d) {
                this.x = d.x;
                this.y = d.y
            },
            setCenter: function(d) {
                this.x = d.x - this.width / 2;
                this.y = d.y - this.height / 2
            },
            inflate: function(d) {
                if (!d) {
                    return this
                }
                var e = b.fromLTRB(this.x - d, this.y - d, this.right() + d, this.bottom() + d);
                return e
            },
            offset: function(d, e) {
                this.x += d;
                this.y += e
            },
            getCornerPoints: function() {
                return [this.topLeft(), this.topRight(), this.bottomRight(), this.bottomLeft()]
            },
            getSizeRect: function() {
                return new b(0, 0, this.width, this.height)
            },
            equals: function(d) {
                if (!d) {
                    return false
                }
                return (this.x === d.x && this.y === d.y && this.width === d.width && this.height === d.height)
            },
            sameSize: function(d) {
                return this.width == d.width && this.height == d.height
            },
            toString: function() {
                return this.x + ", " + this.y + ", " + this.width + ", " + this.height
            },
            getSize: function() {
                return new c.Size(this.width, this.height)
            },
            createSvgElement: function(f) {
                var e = f.createElementNS("http://www.w3.org/2000/svg", "rect");
                e.setAttribute("x", this.x);
                e.setAttribute("y", this.y);
                e.setAttribute("width", this.width);
                e.setAttribute("height", this.height);
                e.setAttribute("rx", 0);
                e.setAttribute("ry", 0);
                var d = this.brush;
                var g = this.pen;
                if (d) {
                    e.setAttribute("fill", MindFusion.Diagramming.Utils.getBrush(null, d, this.getBounds()))
                } else {
                    e.setAttribute("fill", "none")
                }
                if (g) {
                    e.setAttribute("stroke", g)
                }
                e.setAttribute("stroke-width", this.strokeThickness ? this.strokeThickness / 4 : 1 / 4);
                if (this.transform) {
                    e.setAttribute("transform", this.transform.svgMatrix())
                }
                return e
            },
            expandToInt: function() {
                var e = Math.floor(this.left());
                var f = Math.floor(this.top());
                var g = Math.ceil(this.right());
                var d = Math.ceil(this.bottom());
                this.x = e;
                this.y = f;
                this.width = g - e;
                this.height = d - f
            },
            transform: null,
            pen: "black",
            strokeThickness: 0,
            brush: "transparent"
        };
        MindFusion.registerClass(b, "MindFusion.Drawing.Rect");
        b.empty = new b(0, 0, 0, 0)
    })(MindFusion.Drawing);
    (function(a) {
        var b = a.Shadow = function(d, c, e) {
            this.color = d;
            this.offsetX = c;
            this.offsetY = e
        };
        b.prototype = {
            apply: function(c) {
                c.shadowOffsetX = this.offsetX;
                c.shadowOffsetY = this.offsetY;
                c.shadowBlur = 4;
                c.shadowColor = this.color
            },
            createSvgElement: function(c) {
                return null
            }
        };
        MindFusion.registerClass(b, "MindFusion.Drawing.Shadow")
    })(MindFusion.Drawing);
    (function(c) {
        var b = MindFusion.Collections.ArrayList;
        var a = {};
        var d = c.Text = function(g, f) {
            this.text = g;
            if (typeof this.text == "undefined") {
                this.text = ""
            }
            if (!f) {
                f = new c.Rect(0, 0, null, null)
            }
            this.bounds = f;
            this.x = f.x;
            this.y = f.y;
            this.width = f.width;
            this.height = f.height;
            this.clipPath = new c.Path();
            this.textAlignment = e.Near;
            this.lineAlignment = e.Near;
            this.baseline = "middle";
            this.padding = new c.Thickness(1, 1, 1, 1);
            this.type = this.constructor.__typeName
        };
        d.prototype = {
            getType: function() {
                return this.type
            },
            clone: function() {
                var f = new d(this.text, this.bounds);
                f.rotationAngle = this.rotationAngle;
                f.clipPath = this.clipPath.clone();
                f.textAlignment = this.textAlignment;
                f.lineAlignment = this.lineAlignment;
                f.padding = this.padding;
                f.fitInBounds = this.fitInBounds;
                f.enableStyledText = this.enableStyledText;
                if (this.stroke) {
                    f.stroke = this.stroke
                }
                if (this.strokeThickness) {
                    f.strokeThickness = this.strokeThickness
                }
                return f
            },
            getLines: function(f, g) {
                this.lines = d.wrapText(f, this.text, g.width);
                return this.lines
            },
            draw: function(g, f) {
                if (this.text === "") {
                    return
                }
                var i = this.ignoreTransform ? 1 : g._mf_scale;
                if (g._mf_minVisibleFontSize != undefined && this.font.size * i < g._mf_minVisibleFontSize) {
                    return
                }
                this.scale = i;
                g.save();
                if (!this.clipPath.empty()) {
                    this.clipPath.addToContext(g);
                    g.clip()
                }
                g.textBaseline = this.baseline;
                g.fillStyle = this.pen;
                if (this.stroke) {
                    if (this.strokeThickness !== undefined) {
                        g.lineWidth = this.strokeThickness * i
                    }
                    g.strokeStyle = MindFusion.Diagramming.Utils.getBrush(g, this.stroke, this.bounds, true)
                }
                this.lineHeight = this.font.size * i;
                var h = this.bounds.clone();
                this.padding.applyTo(h);
                if (!this.ignoreTransform) {
                    if (g._mf_transform) {
                        h = g._mf_transform.transformRect(h)
                    }
                    g.setTransform(1, 0, 0, 1, 0, 0);
                    g.lineWidth = g.lineWidth * i
                }
                if (this.rotationAngle) {
                    g.transform.apply(g, this.rotationTransform(h).matrix())
                }
                if (this.enableStyledText) {
                    var j = this.parseStyledText(this.text);
                    this.drawStyledText(g, j, h, this.textAlignment, this.lineAlignment)
                } else {
                    g.font = this.font.toString(i);
                    if (this.fitInBounds) {
                        this.getLines(g, h);
                        this.drawLines(g, h)
                    } else {
                        if (this.textAlignment == e.Near) {
                            g.textAlign = "left"
                        } else {
                            if (this.textAlignment == e.Center) {
                                g.textAlign = "center"
                            } else {
                                if (this.textAlignment == e.Far) {
                                    g.textAlign = "right"
                                }
                            }
                        }
                        if (this.stroke) {
                            if (this.strokeThickness !== undefined) {
                                g.lineWidth = this.strokeThickness * i
                            }
                            g.strokeText(this.text, h.x, h.y)
                        }
                        g.fillText(this.text, h.x, h.y)
                    }
                }
                this.layoutRect = h;
                g.restore()
            },
            drawLines: function(h, m) {
                if (this.lines.length === 0) {
                    return
                }
                var p = (m.height > 0) ? m.height : this.lineHeight;
                var n = Math.floor(p / (this.lineHeight) + 0.00001);
                if (n == 0 && p > this.lineHeight * 0.9) {
                    n = 1
                }
                n = Math.min(n, this.lines.length);
                var l = n * this.lineHeight;
                var k = m.y;
                switch (this.lineAlignment) {
                    case e.Center:
                        k += m.height / 2 - l / 2;
                        break;
                    case e.Far:
                        k += m.height - l;
                        break
                }
                var o = m.x;
                switch (this.textAlignment) {
                    case e.Near:
                        h.textAlign = "left";
                        break;
                    case e.Center:
                        o += m.width / 2;
                        h.textAlign = "center";
                        break;
                    case e.Far:
                        o += m.width;
                        h.textAlign = "right";
                        break
                }
                if (h.textBaseline == "middle") {
                    k += this.lineHeight / 2
                }
                for (var j = 0; j < n; j++) {
                    var q = this.lines[j];
                    if (!q) {
                        continue
                    }
                    var g = k + this.lineHeight * j;
                    if (this.stroke) {
                        if (this.strokeThickness !== undefined) {
                            h.lineWidth = this.strokeThickness * h._mf_scale
                        }
                        h.strokeText(q, o, g)
                    }
                    h.fillText(q, o, g);
                    if (this.font.underline) {
                        g += this.lineHeight / 2;
                        var f = h.measureText(q);
                        switch (this.textAlignment) {
                            case e.Near:
                                this.drawUnderline(h, o, g, f.width);
                                break;
                            case e.Center:
                                this.drawUnderline(h, o - f.width / 2, g, f.width);
                                break;
                            case e.Far:
                                this.drawUnderline(h, o - f.width, g, f.width);
                                break
                        }
                    }
                }
            },
            getRotatedBounds: function() {
                var f = new c.Point(this.x, this.y);
                var i = new c.Point(this.x + this.width, this.y + this.height);
                var h = [f, i];
                var g = this.rotationTransform(this.bounds);
                g.transformPoints(h);
                return c.Rect.fromLTRB(h[0].x, h[0].y, h[1].x, h[1].y)
            },
            setBounds: function(f, g) {
                this.bounds = f;
                this.x = f.x;
                this.y = f.y;
                this.width = f.width;
                this.height = f.height;
                this.rotationAngle = g || 0
            },
            getBounds: function() {
                return this.bounds
            },
            getRotationAngle: function() {
                return this.rotationAngle
            },
            getFont: function() {
                return this.font
            },
            setFont: function(f) {
                if (this.font == f) {
                    return
                }
                this.font = f
            },
            getText: function() {
                return this.text
            },
            setText: function(f) {
                if (this.text == f) {
                    return
                }
                this.text = f;
                if (typeof this.text == "undefined") {
                    this.text = ""
                }
            },
            rotationTransform: function(g) {
                var f = new c.Matrix();
                if (this.rotationAngle && this.rotationAngle !== 0) {
                    f.rotateAt(this.rotationAngle, g.x + g.width / 2, g.y + g.height / 2)
                }
                return f
            },
            drawStyledText: function(m, o, H, w, p) {
                var u = H.x;
                var s = H.y;
                var B = H.width;
                var z = H.height;
                var g = this.getStyledLines(m, o, B);
                var f = null;
                var q = this.lineHeight;
                var G = q;
                if (m.textBaseline == "middle") {
                    G /= 2
                }
                if (p == e.Center) {
                    G += z / 2 - q * g.length / 2
                }
                if (p == e.Far) {
                    G += z - q * g.length
                }
                G += s;
                m.textAlign = "left";
                var I = this.clipToBounds && g.length > 1;
                if (I) {
                    m.save();
                    m.beginPath();
                    m.rect(H.x, H.y, H.width, H.height);
                    m.clip()
                }
                for (var E = 0; E < g.length; E++) {
                    var v = g[E];
                    var n = 0;
                    if (w == e.Center) {
                        n = B / 2 - v.width / 2
                    }
                    if (w == e.Far) {
                        n = B - v.width
                    }
                    for (var D = 0; D < v.length; D++) {
                        var t = null;
                        var C = v[D];
                        if (C.format != f) {
                            this.applyFormat(m, C.format);
                            f = C.format;
                            if (m._mf_links && C.format.link) {
                                t = {
                                    link: C.format.link,
                                    item: m._mf_itemRef
                                };
                                m._mf_links.push(t)
                            }
                        }
                        var l = C.format.scriptOffset;
                        var r = l === 0 ? 0 : this.font.size * m._mf_scale * (l > 0 ? -1 : 1) / 3;
                        for (var F = 1; F < Math.abs(l); F++) {
                            r += r / 3
                        }
                        var A = G + C.dy + r;
                        if (!I && (A < s + q / 4 || A > s + z - q / 4)) {
                            continue
                        }
                        var J = u + n + C.dx;
                        if (this.stroke) {
                            if (this.strokeThickness !== undefined) {
                                m.lineWidth = this.strokeThickness * m._mf_scale
                            }
                            m.strokeText(C.text, J, A)
                        }
                        m.fillText(C.text, J, A);
                        if (t) {
                            var k = new c.Rect(J, A, C.advance, q);
                            if (this.ignoreTransform) {
                                k = _mf_transform.transformRect(k)
                            }
                            t.rect = k
                        }
                        if (C.format.underline) {
                            this.drawUnderline(m, J, A + q / 2, C.advance)
                        }
                    }
                }
                if (I) {
                    m.restore()
                }
            },
            parseStyledText: function(f) {
                if (this.cachedText == f && this.cachedSequences) {
                    return this.cachedSequences
                }
                this.cachedText = f;
                f = f.replace(/\r\n/g, "<br />").replace(/[\r\n]/g, "<br />");
                f = f.replace(/<color=/g, "<color value=");
                f = f.replace(/<a=/g, "<a href=");
                if (!d.parser) {
                    d.parser = document.createElement("div")
                }
                var h = d.parser;
                h.innerHTML = f;
                var g = [];
                this.collectSequences(h, g, {});
                this.cachedSequences = g;
                return g
            },
            collectSequences: function(j, n, h) {
                var m = j.nodeName.toLowerCase();
                if (m == "#text") {
                    var k = j.nodeValue;
                    var l = this.createSequence(k, h);
                    n.push(l)
                } else {
                    if (m == "br") {
                        n.push(a)
                    } else {
                        if (m == "color") {
                            m += "=" + j.getAttribute("value")
                        }
                        if (m == "a") {
                            m += "=" + j.getAttribute("href")
                        }
                        this.addToFormat(m, h);
                        for (var g = 0; g < j.childNodes.length; g++) {
                            var f = j.childNodes[g];
                            this.collectSequences(f, n, h)
                        }
                        this.removeFromFormat(m, h)
                    }
                }
            },
            createSequence: function(g, f) {
                return {
                    text: g,
                    italic: f.i > 0,
                    bold: f.b > 0,
                    underline: f.u > 0 || f.a,
                    scriptOffset: f.sup ? f.sup : 0 - (f.sub ? f.sub : 0),
                    link: f.a ? f.a : null,
                    color: f.colors ? f.colors[f.colors.length - 1] : null
                }
            },
            addToFormat: function(h, j) {
                if (h.indexOf("color") == 0) {
                    if (!j.colors) {
                        j.colors = []
                    }
                    var g = h.split("=")[1];
                    j.colors.push(g);
                    return
                }
                if (h.indexOf("a=") == 0) {
                    if (!j.colors) {
                        j.colors = []
                    }
                    j.colors.push("blue");
                    var f = h.split("=")[1];
                    j.a = f;
                    return
                }
                var i = j[h];
                if (!i) {
                    i = 0
                }
                i++;
                j[h] = i
            },
            removeFromFormat: function(f, g) {
                if (f.indexOf("color") == 0) {
                    g.colors.pop();
                    return
                }
                if (f.indexOf("a") == 0) {
                    g.colors.pop();
                    g.a = null;
                    return
                }
                g[f]--
            },
            drawUnderline: function(g, f, i, h) {
                if (!this.stroke) {
                    if (this.strokeThickness !== undefined) {
                        g.lineWidth = this.strokeThickness * g._mf_scale
                    }
                    g.strokeStyle = g.fillStyle
                }
                if (g.setLineDash) {
                    g.setLineDash([])
                }
                g.beginPath();
                g.moveTo(f, i);
                g.lineTo(f + h, i);
                g.stroke()
            },
            getStyledLines: function(h, q, g) {
                var s = [];
                var t = [];
                t.width = 0;
                var o = true;
                var m = 0;
                var j = 0;
                var r = this.lineHeight;

                function p() {
                    s.push(t);
                    t = [];
                    t.width = 0;
                    j += r;
                    m = 0;
                    o = true
                }
                for (var n = 0; n < q.length; n++) {
                    var l = q[n];
                    if (l === a) {
                        p();
                        continue
                    }
                    this.applyFormat(h, l);
                    var k = l.text;
                    while (k.length > 0) {
                        var f = this.fitInLine(h, k, m, j, g, o);
                        f.format = l;
                        t.push(f);
                        t.width += f.advance;
                        k = f.remaining;
                        if (k.length > 0) {
                            p()
                        } else {
                            m += f.advance;
                            o = false
                        }
                    }
                }
                if (t.length > 0) {
                    s.push(t)
                }
                return s
            },
            findWhitespace: function(g, h) {
                var f = g.substring(h).search(/\s+/);
                return f > -1 ? f + h : g.length
            },
            fitInLine: function(j, r, o, n, f, m) {
                if (m) {
                    while (r.length > 0 && /\s/.test(r.charAt(0))) {
                        r = r.substring(1)
                    }
                }
                var g = j.measureText(r);
                if (o + g.width > f) {
                    var h = 0;
                    var q = 0;
                    for (var l = 0; l <= r.length;) {
                        var k = this.findWhitespace(r, l);
                        g = j.measureText(r.substring(0, k));
                        if (o + g.width > f) {
                            var p = r.substring(0, h);
                            if (p.length == 0 && m) {
                                return this.fitInLineWrapByChar(j, r, o, n, f, m)
                            }
                            return {
                                remaining: r.substring(p.length),
                                advance: q,
                                text: p,
                                dx: o,
                                dy: n
                            }
                        }
                        h = k;
                        q = g.width;
                        l = k + 1
                    }
                }
                return {
                    remaining: "",
                    advance: g.width,
                    text: r,
                    dx: o,
                    dy: n
                }
            },
            fitInLineWrapByChar: function(h, p, m, l, f, k) {
                if (k) {
                    while (p.length > 0 && /\s/.test(p.charAt(0))) {
                        p = p.substring(1)
                    }
                }
                var g = h.measureText(p);
                if (m + g.width > f) {
                    var o = 0;
                    for (var j = 1; j <= p.length; j++) {
                        g = h.measureText(p.substring(0, j));
                        if (m + g.width > f) {
                            var n = p.substring(0, j - 1);
                            if (n.length == 0 && k) {
                                n = p.substring(0, 1);
                                o = g.width
                            }
                            return {
                                remaining: p.substring(n.length),
                                advance: o,
                                text: n,
                                dx: m,
                                dy: l
                            }
                        }
                        o = g.width
                    }
                }
                return {
                    remaining: "",
                    advance: g.width,
                    text: p,
                    dx: m,
                    dy: l
                }
            },
            applyFormat: function(h, k) {
                var f = "";
                var j = h._mf_scale;
                for (var g = 0; g < Math.abs(k.scriptOffset); g++) {
                    j *= 66 / 100
                }
                if (k.bold) {
                    f = "bold " + f
                }
                if (k.italic) {
                    f = "italic " + f
                }
                f += this.font.toString(j);
                h.font = f;
                if (k.color) {
                    h.fillStyle = k.color
                } else {
                    h.fillStyle = this.pen
                }
                h._mf_currentLink = k.link
            },
            measureStyledText: function(g, n) {
                var h = this.padding;
                if (this.text === "") {
                    return new c.Size(h.left + h.right, h.top + h.bottom)
                }
                var j = this.ignoreTransform ? 1 : g._mf_scale;
                g.save();
                this.lineHeight = this.font.size * j;
                if (n != Number.MAX_VALUE) {
                    n *= j
                }
                if (!this.ignoreTransform) {
                    g.setTransform(1, 0, 0, 1, 0, 0)
                }
                var l = this.parseStyledText(this.text);
                var p = this.getStyledLines(g, l, n);
                g.restore();
                var o = this.lineHeight * p.length;
                var f = 0;
                for (var k = 0; k < p.length; k++) {
                    f = Math.max(f, p[k].width)
                }
                if (!this.ignoreTransform) {
                    f += 1
                }
                return new c.Size(f / j + h.left + h.right, o / j + h.top + h.bottom)
            },
            getDefaultProperty: function() {
                return this.text
            },
            setDefaultProperty: function(f) {
                this.text = f
            },
            getDefaultValue: function() {
                return ""
            },
            measure: function(k, j) {
                var f = c.Component.context;
                if (!this.text) {
                    return new c.Size(this.padding.width(), this.padding.height())
                }
                if (k) {
                    k -= this.padding.width()
                }
                var h = f.measureString(this.text, this.font, null, this.enableStyledText);
                if (k && h.width > k) {
                    var g = k ? k : Number.MAX_VALUE;
                    var i = new c.Rect(0, 0, g, Number.MAX_VALUE);
                    h = f.measureString(this.text, this.font, i, this.enableStyledText)
                }
                this.desiredWidth = h.width + this.padding.width();
                this.desiredHeight = h.height + this.padding.height()
            },
            effectiveMeasuredWidth: function() {
                return this.desiredWidth
            },
            effectiveMeasuredHeight: function() {
                return this.desiredHeight
            },
            createSvgElement: function(p) {
                if (this.text == "") {
                    return null
                }
                var h = p._mf_context;
                var o = h.fillText;
                var j = h._mf_scale;
                var l = 8;
                var k = 4;
                if (this.ignoreTransform || this.enableStyledText) {
                    l = 0;
                    k = -1;
                    if (this.ignoreTransform) {
                        j = 1
                    }
                }
                var m = p.createElementNS("http://www.w3.org/2000/svg", "g");
                var f = this.bounds.center();
                var i = "";
                if (this.rotationAngle) {
                    i += "rotate(" + this.rotationAngle + " " + f.x + " " + f.y + ")"
                }
                i += "scale(" + (1 / j) + ")";
                m.setAttribute("transform", i);
                try {
                    h.fillText = function(r, g, s) {
                        var q = p.createElementNS("http://www.w3.org/2000/svg", "text");
                        q.textContent = r;
                        q.setAttribute("stroke", "none");
                        q.setAttribute("fill", h.fillStyle);
                        q.setAttribute("style", "font: " + h.font);
                        q.setAttribute("x", g - l);
                        q.setAttribute("y", s - k);
                        switch (h.textAlign) {
                            case "left":
                                q.setAttribute("text-anchor", "start");
                                break;
                            case "center":
                                q.setAttribute("text-anchor", "middle");
                                break;
                            case "right":
                                q.setAttribute("text-anchor", "end");
                                break
                        }
                        m.appendChild(q)
                    };
                    this.draw(h, false)
                } catch (n) {}
                h.fillText = o;
                return m
            },
            pen: "black",
            bounds: null,
            lines: null,
            font: new c.Font("sans-serif", 4)
        };
        d.wrapText = function(h, j, i) {
            var g = j.split("\n");
            if (i == Number.MAX_VALUE) {
                return g
            }
            var f = [];
            b.forEach(g, function(k) {
                d.wrapLine(h, k, i, f)
            });
            return f
        };
        d.wrapLine = function(g, n, l, p) {
            var k = n.split(" ");
            var o = "";
            for (var j = 0; j < k.length; j++) {
                var f = k[j];
                var h = g.measureText(o + f).width;
                if (h < l) {
                    if (j == 0) {
                        o += (f)
                    } else {
                        o += (" " + f)
                    }
                } else {
                    if (o != "") {
                        p.push(o)
                    }
                    o = f
                }
                if (j == k.length - 1) {
                    p.push(o);
                    break
                }
            }
        };
        d.getMinWidth = function(n, g, j, m) {
            j.save();
            j.scale(m, m);
            j.font = g;
            var l = n.split(/\s{1,}/);
            var f = 0;
            var k = 0;
            for (var h = 0; h < l.length; h++) {
                f = j.measureText(l[h]).width;
                if (f > k) {
                    k = f
                }
            }
            j.restore();
            return k
        };
        MindFusion.registerClass(d, "MindFusion.Drawing.Text");
        var e = {
            Near: 0,
            Center: 1,
            Far: 2
        }
    })(MindFusion.Drawing);
    MindFusion.Drawing.Vector = function(a, b) {
        this.x = a;
        this.y = b;
        this.type = this.constructor.__typeName
    };
    MindFusion.Drawing.Vector.prototype = {
        getType: function() {
            return this.type
        },
        clone: function() {
            return new MindFusion.Drawing.Vector(this.x, this.y)
        },
        length: function() {
            return Math.sqrt(MindFusion.Drawing.Vector.dot(this, this))
        },
        lengthSquared: function() {
            return MindFusion.Drawing.Vector.dot(this, this)
        },
        negate: function() {
            return new MindFusion.Drawing.Vector(-this.x, -this.y)
        },
        normalize: function() {
            return new MindFusion.Drawing.Vector(this.x / this.length(), this.y / this.length())
        },
        toPoint: function() {
            return new MindFusion.Drawing.Point(this.x, this.y)
        }
    };
    MindFusion.Drawing.Vector.fromPoints = function(b, a) {
        return new MindFusion.Drawing.Vector(a.x - b.x, a.y - b.y)
    };
    MindFusion.Drawing.Vector.dot = function(b, a) {
        return (b.x * a.x) + (b.y * a.y)
    };
    MindFusion.Drawing.Vector.multiplyScalar = function(a, b) {
        return new MindFusion.Drawing.Vector(a.x * b, a.y * b)
    };
    MindFusion.Drawing.Vector.divideScalar = function(a, b) {
        return new MindFusion.Drawing.Vector(a.x * (1 / b), a.y * (1 / b))
    };
    MindFusion.Drawing.Vector.add = function(b, a) {
        return new MindFusion.Drawing.Vector(b.x + a.x, b.y + a.y)
    };
    MindFusion.Drawing.Vector.sub = function(b, a) {
        return new MindFusion.Drawing.Vector(b.x - a.x, b.y - a.y)
    };
    MindFusion.registerClass(MindFusion.Drawing.Vector, "MindFusion.Drawing.Vector");
    MindFusion.registerNamespace("MindFusion.Diagramming");
    (function(a) {
        var b = MindFusion.Drawing.Rect;
        var c = MindFusion.Drawing.Point;
        var d = a.Utils = function() {};
        d.getRectPtPercent = function(e, f) {
            var g = new c(50, 50);
            if (f.width > 0 && f.height > 0) {
                g.x = (e.x - f.x) * 100 / f.width;
                g.y = (e.y - f.y) * 100 / f.height
            }
            return g
        };
        d.unionRects = function(f, e) {
            if (f.width === 0 || f.height === 0) {
                return e
            }
            return f.union(e)
        };
        d.normalizeRect = function(f) {
            var e = new b(0, 0, 0, 0);
            e.x = Math.min(f.x, f.right());
            e.width = Math.abs(f.width);
            e.y = Math.min(f.y, f.bottom());
            e.height = Math.abs(f.height);
            return e
        };
        d.inflate = function(f, e, g) {
            if (f.width + 2 * e < 0) {
                e = -f.width / 2
            }
            if (f.height + 2 * g < 0) {
                g = -f.height / 2
            }
            return new b(f.x - e, f.y - g, f.width + 2 * e, f.height + 2 * g)
        };
        d.distToPolyline = function(k, g, j, h) {
            var f = Number.MAX_VALUE;
            if (h) {
                h.value = 0
            }
            for (var n = 0; n < j - 1; ++n) {
                var m = g[n];
                var l = g[n + 1];
                var i = new MindFusion.Drawing.DistanceToSegment(k, m, l);
                var e = i.distanceToSegmentSquared();
                if (e < f) {
                    f = e;
                    if (h) {
                        h.value = n
                    }
                }
            }
            return Math.sqrt(f)
        };
        d.intersect = function(h, g, f, e) {
            return (this.ccw(h, g, f) * this.ccw(h, g, e) <= 0) && (this.ccw(f, e, h) * this.ccw(f, e, g) <= 0)
        };
        d.ccw = function(k, i, g) {
            var j, h;
            var f, e;
            j = i.x - k.x;
            h = g.x - k.x;
            f = i.y - k.y;
            e = g.y - k.y;
            return ((j * e > f * h) ? 1 : -1)
        };
        d.getIntersectionPoint = function(o, n, h, g) {
            if (o.x == n.x && h.x == g.x) {
                return undefined
            }
            if (o.x == n.x) {
                var m = (h.y - g.y) / (h.x - g.x);
                var k = (h.x * g.y - g.x * h.y) / (h.x - g.x);
                return new c(o.x, m * o.x + k)
            }
            if (h.x == g.x) {
                if (o.y == n.y) {
                    return new c(h.x, o.y)
                }
                var m = (o.y - n.y) / (o.x - n.x);
                var k = (o.x * n.y - n.x * o.y) / (o.x - n.x);
                return new c(h.x, m * h.x + k)
            }
            var f = (o.y - n.y) / (o.x - n.x);
            var l = (o.x * n.y - n.x * o.y) / (o.x - n.x);
            var e = (h.y - g.y) / (h.x - g.x);
            var j = (h.x * g.y - g.x * h.y) / (h.x - g.x);
            if (f == e) {
                return undefined
            }
            var i = new c((j - l) / (f - e), f * (j - l) / (f - e) + l);
            if (o.y == n.y) {
                i.y = o.y
            }
            return i
        };
        d.getSegmentIntersection = function(k, i, f, e) {
            var m = d.getIntersectionPoint(k, i, f, e);
            if (!m) {
                return m
            }
            var l = (m.x - k.x) * (m.x - i.x);
            var j = (m.y - k.y) * (m.y - i.y);
            if (l > 0.0001 || j > 0.0001) {
                return undefined
            }
            var h = (m.x - f.x) * (m.x - e.x);
            var g = (m.y - f.y) * (m.y - e.y);
            if (h > 0.0001 || g > 0.0001) {
                return undefined
            }
            return m
        };
        d.pointInPolygon = function(f, k) {
            var l = 0;
            k = k.slice(0);
            for (var h = 0; h < k.length; ++h) {
                k[h].x -= f.x;
                k[h].y -= f.y
            }
            for (var h = 0; h < k.length; ++h) {
                var g = (h + 1) % k.length;
                if (k[h].y > 0 && k[g].y <= 0 || k[g].y > 0 && k[h].y <= 0) {
                    var e = (k[h].x * k[g].y - k[g].x * k[h].y) / (k[g].y - k[h].y);
                    if (e > 0) {
                        l++
                    }
                }
            }
            return l % 2 == 1
        };
        d.getPolygonIntersection = function(l, m, h, f) {
            var j, e, g = Number.MAX_VALUE;
            for (var k = 0; k < l.length; k++) {
                e = d.getSegmentIntersection(l[k], l[(k + 1) % l.length], m, h);
                if (e) {
                    j = d.DistanceSq(e, h);
                    if (j < g) {
                        g = j;
                        f.x = e.x;
                        f.y = e.y
                    }
                }
            }
            return g < Number.MAX_VALUE
        };
        d.getClosestSegmentPoint = function(k, h, e) {
            if (h.equals(e)) {
                return h
            }
            var i = e.x - h.x;
            var g = e.y - h.y;
            var f = (k.x - h.x) * i + (k.y - h.y) * g;
            if (f < 0) {
                return h
            }
            f = (e.x - k.x) * i + (e.y - k.y) * g;
            if (f < 0) {
                return e
            }
            var j = d.getLeftVector({
                x: h.x - e.x,
                y: h.y - e.y
            });
            var l = new c(k.x + j.x, k.y + j.y);
            return d.getIntersectionPoint(h, e, k, l)
        };
        d.getLeftVector = function(e) {
            return {
                x: e.y,
                y: -e.x
            }
        };
        d.symmetricPoint = function(e, g) {
            var h = new c(g.x - e.x, g.y - e.y);
            var f = new c(h.x + g.x, h.y + g.y);
            return f
        };
        d.checkIntersect = function(f, k, e) {
            var j = k.x - f.x;
            var h = k.right() - f.x;
            var g = k.y - f.y;
            var i = k.bottom() - f.y;
            if (h < 0) {
                if (g > 0) {
                    return (h * h + g * g < e * e)
                } else {
                    if (i < 0) {
                        return (h * h + i * i < e * e)
                    } else {
                        return (Math.abs(h) < e)
                    }
                }
            } else {
                if (j > 0) {
                    if (g > 0) {
                        return (j * j + g * g < e * e)
                    } else {
                        if (i < 0) {
                            return (j * j + i * i < e * e)
                        } else {
                            return (Math.abs(j) < e)
                        }
                    }
                } else {
                    if (g > 0) {
                        return (Math.abs(g) < e)
                    } else {
                        if (i < 0) {
                            return (Math.abs(i) < e)
                        } else {
                            return true
                        }
                    }
                }
            }
        };
        d.minDistToRect = function(e, g) {
            var f = d.distToRectPoint(e, g);
            return c.distance(e, f)
        };
        d.distToRectPoint = function(e, f) {
            return new c(d.distToRectSelect(e.x, f.x, f.right()), d.distToRectSelect(e.y, f.y, f.bottom()))
        };
        d.distToRectSelect = function(j, g, e) {
            var i, f;
            var h = d.closer(j, g, e, i, f);
            i = h.a;
            f = h.b;
            if (d.betweenOrEqual(j, i, f)) {
                return j
            } else {
                return i
            }
        };
        d.equalEpsilon = function(e, f) {
            return Math.abs(e - f) < 0.00001
        };
        d.pointEqualEpsilon = function(f, e) {
            return d.equalEpsilon(f.x, e.x) && d.equalEpsilon(f.y, e.y)
        };
        d.mid = function(f, e) {
            return new c((f.x + e.x) / 2, (f.y + e.y) / 2)
        };
        d.closer = function(e, k, i, j, f) {
            var g = d.sort(k, i);
            k = g.a;
            i = g.b;
            var h;
            if (e < k) {
                h = true
            } else {
                if (e > i) {
                    h = false
                } else {
                    h = e - k < i - e
                }
            }
            if (h) {
                j = k;
                f = i
            } else {
                j = i;
                f = k
            }
            return {
                a: j,
                b: f
            }
        };
        d.swap = function(f, e) {
            var g = f;
            f = e;
            e = g;
            return {
                a: f,
                b: e
            }
        };
        d.sort = function(f, e) {
            if (e < f) {
                var g = d.swap(f, e);
                f = g.a;
                e = g.b
            }
            return {
                a: f,
                b: e
            }
        };
        d.betweenOrEqual = function(h, f, e) {
            var g = d.sort(f, e);
            f = g.a;
            e = g.b;
            return d.betweenOrEqualSorted(h, f, e)
        };
        d.betweenOrEqualSorted = function(g, f, e) {
            return f <= g && g <= e
        };
        d.subtract = function(f, e) {
            return {
                x: f.x - e.x,
                y: f.y - e.y
            }
        };
        d.offsetPointCollection = function(g, e, j) {
            if (g.length !== e.length) {
                return
            }
            for (var f = 0; f < g.length; ++f) {
                var h = e[f].clone();
                g[f] = h.addVector(j)
            }
        };
        d.rectPtFromPercent = function(e, f) {
            return new c(f.x + e.x / 100 * f.width, f.y + e.y / 100 * f.height)
        };
        d.setRect = function(f, e) {
            f.width = e.width;
            f.height = e.height;
            f.setLocation(e.topLeft())
        };
        d.betweenOrEqualSorted = function(g, f, e) {
            return f <= g && g <= e
        };
        d.getLineHitTest = function(e) {
            return 5 * MindFusion.Drawing.GraphicsUnit.getMillimeter(e)
        };
        d.DistanceSq = function(f, e) {
            return (f.x - e.x) * (f.x - e.x) + (f.y - e.y) * (f.y - e.y)
        };
        d.radians = function(e) {
            return e / 180 * Math.PI
        };
        d.degrees = function(e) {
            return e / Math.PI * 180
        };
        d.rotatePointAt = function(e, f, h) {
            var g = new MindFusion.Drawing.Matrix();
            g.rotateAt(h, f.x, f.y);
            e = e.clone();
            g.transformPoint(e);
            return e
        };
        d.rotatePointsAt = function(j, f, k) {
            var g = new MindFusion.Drawing.Matrix();
            g.rotateAt(k, f.x, f.y);
            for (var h = 0, e = j.length; h < e; ++h) {
                g.transformPoint(j[h])
            }
        };
        d.getCenter = function(e) {
            return new c(e.x + e.width / 2, e.y + e.height / 2)
        };
        d.rotateRect = function(g, e, h) {
            if (h == 0) {
                return g
            }
            var f = new MindFusion.Drawing.Matrix();
            f.rotateAt(h, e.x, e.y);
            return f.transformRect(g)
        };
        d.getBounds = function(f) {
            var e = d.getPageScroll();
            var h = mflayer.getBounds(f);
            if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
                if (e.scrollLeft != 0 || e.scrollTop != 0) {
                    var g = f.getBoundingClientRect();
                    if ((h.x - g.left) < 1 && (h.y - g.top) < 1) {
                        h.x += e.scrollLeft;
                        h.y += e.scrollTop
                    }
                }
            }
            return h
        };
        d.getPageScroll = function() {
            var f = 0;
            var e = 0;
            if (window.pageXOffset != undefined) {
                f = window.pageXOffset
            } else {
                if (document.body.scrollTop !== 0) {
                    f = document.body.scrollLeft
                } else {
                    f = document.documentElement.scrollLeft
                }
            }
            if (window.pageYOffset != undefined) {
                e = window.pageYOffset
            } else {
                if (document.body.scrollTop !== 0) {
                    e = document.body.scrollTop
                } else {
                    e = document.documentElement.scrollTop
                }
            }
            return {
                scrollLeft: f,
                scrollTop: e
            }
        };
        d.getCursorPos = function(k, h) {
            var g = d.getPageScroll();
            var j = mflayer.getBounds(h);
            var f = k.clientX - j.x + g.scrollLeft;
            var l = k.clientY - j.y + g.scrollTop;
            if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
                if (g.scrollLeft != 0 || g.scrollTop != 0) {
                    var i = h.getBoundingClientRect();
                    if ((j.x - i.left) < 1 && (j.y - i.top) < 1) {
                        f -= g.scrollLeft;
                        l -= g.scrollTop
                    }
                }
            }
            return new c(f, l)
        };
        d.getClientPos = function(h) {
            var g = d.getPageScroll();
            var f = h.clientX + g.scrollLeft;
            var i = h.clientY + g.scrollTop;
            return new c(f, i)
        };
        d.getChildrenByTagName = function(j, h) {
            var e = [];
            if (h == undefined) {
                h = document
            }
            if (h.tagName.toUpperCase() == j.toUpperCase()) {
                e.push(h)
            }
            var g = h.childNodes;
            for (var f = 0; f < g.length; f++) {
                if (g[f].tagName) {
                    if (g[f].tagName.toUpperCase() == j.toUpperCase()) {
                        e.push(g[f])
                    }
                }
            }
            return e
        };
        d.getBrush = function(h, e, p, n) {
            if (!e) {
                return (n) ? "#000000" : "#FFFFFF"
            }
            if (e.type == "SolidBrush") {
                if (typeof e.color == "string") {
                    return e.color
                } else {
                    if (e.color.value) {
                        return e.color.value
                    }
                }
            } else {
                if (e.type == "LinearGradientBrush") {
                    if (!h) {
                        return "#FFFFFF"
                    }
                    var w = e.x1 ? e.x1 : p.x;
                    var k = e.y1 ? e.y1 : p.y + p.height / 2;
                    var v = e.x2 ? e.x2 : p.x + p.width;
                    var g = e.y2 ? e.y2 : p.y + p.height / 2;
                    if (e.angle) {
                        if (e.angle === 180) {
                            w = p.x + p.width / 2;
                            k = p.y + p.height / 2;
                            v = p.x;
                            g = p.y + p.height / 2
                        } else {
                            if (e.angle === 90) {
                                w = p.x + p.width / 2;
                                k = p.y;
                                v = p.x + p.width / 2;
                                g = p.y + p.height
                            } else {
                                if (e.angle === 270) {
                                    w = p.x + p.width / 2;
                                    k = p.y + p.height;
                                    v = p.x + p.width / 2;
                                    g = p.y
                                } else {
                                    var z = new c(p.x + p.width / 2, p.y + p.height / 2);
                                    var x = e.angle;
                                    var q;
                                    x = ((x % 360) + 360) % 360;
                                    if (x >= 0 && x < 90) {
                                        var A = MindFusion.Geometry.cartesianToPolarDegrees(z, p.topRight()).a;
                                        q = x - A
                                    } else {
                                        if (x >= 90 && x < 180) {
                                            var A = MindFusion.Geometry.cartesianToPolarDegrees(z, p.topLeft()).a;
                                            q = x - A
                                        } else {
                                            if (x >= 180 && x < 270) {
                                                var A = MindFusion.Geometry.cartesianToPolarDegrees(z, p.bottomLeft()).a;
                                                q = x - A
                                            } else {
                                                var A = MindFusion.Geometry.cartesianToPolarDegrees(z, p.bottomRight()).a;
                                                q = x - A
                                            }
                                        }
                                    }
                                    var s = Math.sqrt(p.width * p.width / 4 + p.height * p.height / 4);
                                    if (q !== 0) {
                                        s = s * Math.sin(MindFusion.Geometry.degreeToRadian(90 - Math.abs(q)))
                                    }
                                    var o = MindFusion.Geometry.polarToCartesianDegrees(z, {
                                        a: x,
                                        r: s
                                    });
                                    var m = MindFusion.Geometry.polarToCartesianDegrees(z, {
                                        a: x - 180,
                                        r: s
                                    });
                                    w = o.x;
                                    k = o.y;
                                    v = m.x;
                                    g = m.y
                                }
                            }
                        }
                    }
                    var y = h.createLinearGradient(w, k, v, g);
                    if (e.colorStops) {
                        for (var u = 0, t = e.colorStops.length; u < t; u++) {
                            y.addColorStop(e.colorStops[u].position, e.colorStops[u].color)
                        }
                    } else {
                        y.addColorStop(0, e.color1);
                        y.addColorStop(1, e.color2)
                    }
                    return y
                } else {
                    if (e.type == "RadialGradientBrush") {
                        if (!h) {
                            return "#FFFFFF"
                        }
                        var w = (e.x1 != undefined) ? e.x1 : p.center().x;
                        var k = (e.y1 != undefined) ? e.y1 : p.center().y;
                        var v = (e.x2 != undefined) ? e.x2 : p.center().x;
                        var g = (e.y2 != undefined) ? e.y2 : p.center().y;
                        var j = (e.radius1 != undefined) ? e.radius1 : 0;
                        var f = (e.radius2 != undefined) ? e.radius2 : Math.max(p.width, p.height) / 2;
                        var y = h.createRadialGradient(w, k, j, v, g, f);
                        if (e.colorStops) {
                            for (var u = 0, t = e.colorStops.length; u < t; u++) {
                                y.addColorStop(e.colorStops[u].position, e.colorStops[u].color)
                            }
                        } else {
                            y.addColorStop(0, e.color1);
                            y.addColorStop(1, e.color2)
                        }
                        return y
                    } else {
                        return e
                    }
                }
            }
        };
        d.getBezierPt = function(r, f, p) {
            var w = r[f * 3 + 0].x;
            var j = r[f * 3 + 0].y;
            var v = r[f * 3 + 1].x;
            var i = r[f * 3 + 1].y;
            var u = r[f * 3 + 2].x;
            var h = r[f * 3 + 2].y;
            var s = r[f * 3 + 3].x;
            var g = r[f * 3 + 3].y;
            var e = p;
            var o = (1 - e) * (1 - e) * (1 - e);
            var n = 3 * e * (1 - e) * (1 - e);
            var m = 3 * e * e * (1 - e);
            var k = e * e * e;
            var l = o * w + n * v + m * u + k * s;
            var q = o * j + n * i + m * h + k * g;
            return new c(l, q)
        };
        d.approximateBezier = function(l, j, e) {
            if (e == undefined) {
                e = 0
            }
            var f = [];
            for (var g = e; g < l.length - 3; g += 3) {
                var n = l[g];
                var m = l[g + 1];
                var k = l[g + 2];
                var h = l[g + 3];
                d.addCubicBezierPoints(f, j, n.x, n.y, m.x, m.y, k.x, k.y, h.x, h.y)
            }
            return f
        };
        d.addCubicBezierPoints = function(s, q, f, e, w, v, h, g, n, k) {
            var u = 1 / q;
            for (var r = 0; r <= 1; r += u) {
                var o = Math.pow(1 - r, 3);
                var l = 3 * Math.pow(1 - r, 2) * r;
                var j = 3 * (1 - r) * r * r;
                var i = r * r * r;
                var p = o * f + l * w + j * h + i * n;
                var m = o * e + l * v + j * g + i * k;
                s.push(new c(p, m))
            }
        };
        d.addQuadraticBezierPoints = function(r, q, f, e, h, g, o, m) {
            var l = 1 / q;
            for (var s = l; s <= 1; s += l) {
                var k = (1 - s) * (1 - s);
                var j = 2 * (1 - s) * s;
                var i = s * s;
                var p = k * f + j * h + i * o;
                var n = k * e + j * g + i * m;
                r.push(new c(p, n))
            }
        };
        d.addArcPoints = function(r, q, h, g, k, l, e, f) {
            if (!f) {
                while (e < l) {
                    e += 2 * Math.PI
                }
            } else {
                while (e > l) {
                    e -= 2 * Math.PI
                }
            }
            var m = (e - l) / q;
            var p = l;
            for (var j = 0; j <= q; j++) {
                var o = h + k * Math.cos(p);
                var n = g + k * Math.sin(p);
                r.push(new c(o, n));
                p += m
            }
        };
        d.getApproximatingContext = function() {
            return {
                points: [],
                beginPath: function() {},
                moveTo: function(e, f) {
                    this.points.push(new c(e, f))
                },
                lineTo: function(e, f) {
                    this.ensureStart();
                    this.points.push(new c(e, f))
                },
                bezierCurveTo: function(g, f, i, h, e, k) {
                    this.ensureStart();
                    var j = this.lastPoint();
                    d.addCubicBezierPoints(this.points, 20, j.x, j.y, g, f, i, h, e, k)
                },
                quadraticCurveTo: function(g, f, e, i) {
                    this.ensureStart();
                    var h = this.lastPoint();
                    d.addQuadraticBezierPoints(this.points, 20, h.x, h.y, g, f, e, i)
                },
                arc: function(f, j, e, h, g, i) {
                    d.addArcPoints(this.points, 20, f, j, e, h, g, i)
                },
                ensureStart: function() {
                    if (this.points.length == 0) {
                        this.points.push(new c(0, 0))
                    }
                },
                lastPoint: function() {
                    return this.points[this.points.length - 1]
                },
                transform: {
                    apply: function(f, e) {
                        this.matrix = MindFusion.Drawing.Matrix.fromValues(e)
                    }
                },
                transformAndGetPoints: function() {
                    if (this.transform.matrix) {
                        this.transform.matrix.transformPoints(this.points)
                    }
                    return this.points
                }
            }
        };
        d.arcToBezierCurves = function(s, q, t, n, r, u) {
            var v = [];
            var k, p, o;
            var f = u > 0;
            o = r + u;
            r = this.radians(r);
            o = this.radians(o);
            p = r;
            for (var m = 0; m < 4; m++) {
                if (f) {
                    if (p >= o) {
                        break
                    }
                    k = Math.min(p + Math.PI / 2, o)
                } else {
                    if (p <= o) {
                        break
                    }
                    k = Math.max(p - Math.PI / 2, o)
                }
                var g = this.arcSegmentToBezier(s, q, t, n, p, k);
                for (var l = 0; l < g.length; l++) {
                    v.push(g[l])
                }
                p += Math.PI / 2 * (f ? 1 : -1)
            }
            return v
        };
        d.arcSegmentToBezier = function(u, t, v, n, B, p) {
            var g = v / 2,
                f = n / 2;
            var k = u + g,
                j = t + f;
            var A = Math.cos(B),
                r = Math.sin(B);
            var o = Math.cos(p),
                l = Math.sin(p);
            var q = 4 / 3 * (1 - Math.cos((p - B) / 2)) / Math.sin((p - B) / 2);
            var z = [new c(A, r), new c(A - q * r, r + q * A), new c(o + q * l, l - q * o), new c(o, l)];
            for (var m = 0; m < z.length; m++) {
                z[m].x *= g;
                z[m].x += k;
                z[m].y *= f;
                z[m].y += j
            }
            return z
        };
        d.newRect = function(e, f) {
            var g = f / 2;
            return new b(e.x - g, e.y - g, f, f)
        };
        d.stringFormat = function() {
            var g = (typeof(String) == "function") ? arguments[0] : this;
            for (var e = 0; e < arguments.length; e++) {
                var f = new RegExp("\\{" + e + "\\}", "gi");
                g = g.replace(f, arguments[e + 1])
            }
            return g
        };
        d.escapeNewLine = function(e) {
            if (e != null && e != "") {
                return e.replace(/\n/g, "\\n")
            } else {
                return e
            }
        };
        d.offset1 = function(f, e, g) {
            return new b(f.x + e, f.y + g, f.width, f.height)
        };
        d.offset = function(f, e) {
            return d.offset1(f, e.x, e.y)
        };
        d.isNumber = function(e) {
            return !isNaN(e - 0)
        };
        d.isFloat = function(e) {
            return !/^-?\d+$/.test(String(e))
        };
        d.sign = function(e) {
            if (+e === e) {
                return (e === 0) ? e : (e > 0) ? 1 : -1
            }
            return NaN
        };
        d.getFitTextStep = function(e) {
            return MindFusion.Drawing.GraphicsUnit.convert(0.4, e, MindFusion.Drawing.GraphicsUnit.Millimeter)
        };
        d.formatString = function() {
            var g = arguments[0];
            for (var e = 1; e < arguments.length; e++) {
                var f = new RegExp("\\{" + (e - 1) + "\\}", "gi");
                g = g.replace(f, arguments[e])
            }
            return g
        };
        d.colorStringToHex = function(f) {
            var e = d.parseColor(f);
            if (e) {
                var g = "FF";
                if (typeof e.alpha !== "undefined") {
                    g = ("00" + parseInt(e.alpha * 256).toString(16)).slice(-2)
                }
                return "#" + g + ("00" + e.red.toString(16)).slice(-2) + ("00" + e.green.toString(16)).slice(-2) + ("00" + e.blue.toString(16)).slice(-2)
            }
            return "#FFFFFFFF"
        };
        d.parseColor = function(i) {
            var h = "^#{0,1}?[A-Fa-f0-9]{3,6}$";
            var e = i;
            var j = d.checkKnownColor(e);
            if (j) {
                e = j
            }
            if (e.match(h)) {
                var g = d.hexToRgb(e);
                if (g) {
                    return g
                }
            } else {
                var k = document.createElement("div");
                k.style.backgroundColor = e;
                var f = k.style.backgroundColor;
                var g = d.stringToRgb(f);
                if (g) {
                    return g
                }
            }
            throw new Error("Unknown color code: " + i)
        };
        d.hexToRgb = function(k) {
            if (!k || k.length < 3 || k.length > 7) {
                return
            }
            k = k.replace("#", "");
            var j, i, e;
            var h = 2;
            if (k.length == 3) {
                k = k[0] + k[0] + k[1] + k[1] + k[2] + k[2]
            }
            var f = k.substring(k.length - h);
            e = parseInt(f, 16);
            k = k.substring(0, k.length - h);
            h = k.length == 1 ? 1 : 2;
            f = k.substring(k.length - h);
            k = k.substring(0, k.length - h);
            i = parseInt(f, 16);
            if (k.length == 0) {
                j = 0
            } else {
                j = parseInt(k, 16)
            }
            return {
                red: j,
                green: i,
                blue: e
            }
        };
        d.stringToRgb = function(i) {
            if (i.length == 0) {
                return null
            }
            if (i == "transparent") {
                return {
                    red: 255,
                    green: 255,
                    blue: 255,
                    alpha: 0
                }
            }
            if (i.match(/[0-9,\s]+/g) == null) {
                return null
            }
            var f = i.match(/(rgba?)|(\d+(\.\d+)?%?)|(\.\d+)/g);
            if (f.length != 4 && f.length != 5) {
                return null
            }
            var k = +f[1];
            var j = +f[2];
            var e = +f[3];
            var h = (f.length == 5) ? +f[4] : 1;
            if ((k >= 0 && k <= 255) && (j >= 0 && j <= 255) && (e >= 0 && e <= 255) && (h >= 0 && h <= 1)) {
                return {
                    red: k,
                    green: j,
                    blue: e,
                    alpha: h
                }
            }
            return null
        };
        d.rgbToString = function(i, h, e, f) {
            if (i != undefined && h != undefined && e != undefined) {
                if (f == undefined) {
                    f = 1
                }
                return d.formatString("rgba({0},{1},{2},{3})", i, h, e, f)
            }
            return "rgba(0,0,0,1)"
        };
        d.checkKnownColor = function(h) {
            var e = d.knownColors;
            var f = h.toLowerCase();
            for (var g in e) {
                if (f == g) {
                    return e[g]
                }
            }
            return null
        };
        d.knownColors = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkslategrey: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            feldspar: "#d19275",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslateblue: "#8470ff",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            violetred: "#d02090",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        d.Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function(g) {
                var e = "";
                var o, m, k, n, l, j, h;
                var f = 0;
                g = d.Base64._utf8_encode(g);
                while (f < g.length) {
                    o = g.charCodeAt(f++);
                    m = g.charCodeAt(f++);
                    k = g.charCodeAt(f++);
                    n = o >> 2;
                    l = ((o & 3) << 4) | (m >> 4);
                    j = ((m & 15) << 2) | (k >> 6);
                    h = k & 63;
                    if (isNaN(m)) {
                        j = h = 64
                    } else {
                        if (isNaN(k)) {
                            h = 64
                        }
                    }
                    e = e + d.Base64._keyStr.charAt(n) + d.Base64._keyStr.charAt(l) + d.Base64._keyStr.charAt(j) + d.Base64._keyStr.charAt(h)
                }
                return e
            },
            decode: function(g) {
                var e = "";
                var o, m, k;
                var n, l, j, h;
                var f = 0;
                g = g.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (f < g.length) {
                    n = d.Base64._keyStr.indexOf(g.charAt(f++));
                    l = d.Base64._keyStr.indexOf(g.charAt(f++));
                    j = d.Base64._keyStr.indexOf(g.charAt(f++));
                    h = d.Base64._keyStr.indexOf(g.charAt(f++));
                    o = (n << 2) | (l >> 4);
                    m = ((l & 15) << 4) | (j >> 2);
                    k = ((j & 3) << 6) | h;
                    e = e + String.fromCharCode(o);
                    if (j != 64) {
                        e = e + String.fromCharCode(m)
                    }
                    if (h != 64) {
                        e = e + String.fromCharCode(k)
                    }
                }
                e = d.Base64._utf8_decode(e);
                return e
            },
            _utf8_encode: function(f) {
                f = f.replace(/\r\n/g, "\n");
                var e = "";
                for (var h = 0; h < f.length; h++) {
                    var g = f.charCodeAt(h);
                    if (g < 128) {
                        e += String.fromCharCode(g)
                    } else {
                        if ((g > 127) && (g < 2048)) {
                            e += String.fromCharCode((g >> 6) | 192);
                            e += String.fromCharCode((g & 63) | 128)
                        } else {
                            e += String.fromCharCode((g >> 12) | 224);
                            e += String.fromCharCode(((g >> 6) & 63) | 128);
                            e += String.fromCharCode((g & 63) | 128)
                        }
                    }
                }
                return e
            },
            _utf8_decode: function(e) {
                var f = "";
                var g = 0;
                var h = c1 = c2 = 0;
                while (g < e.length) {
                    h = e.charCodeAt(g);
                    if (h < 128) {
                        f += String.fromCharCode(h);
                        g++
                    } else {
                        if ((h > 191) && (h < 224)) {
                            c2 = e.charCodeAt(g + 1);
                            f += String.fromCharCode(((h & 31) << 6) | (c2 & 63));
                            g += 2
                        } else {
                            c2 = e.charCodeAt(g + 1);
                            c3 = e.charCodeAt(g + 2);
                            f += String.fromCharCode(((h & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            g += 3
                        }
                    }
                }
                return f
            }
        };
        d.escapeHtml = function(e) {
            var f = document.createElement("div");
            f.appendChild(document.createTextNode(e));
            return f.innerHTML
        };
        d.unescapeHtml = function(e) {
            var g = document.createElement("div");
            g.innerHTML = e;
            var f = g.childNodes[0];
            return f ? f.nodeValue : ""
        };
        MindFusion.registerClass(d, "MindFusion.Diagramming.Utils")
    })(MindFusion.Diagramming);
    MindFusion.registerNamespace("MindFusion.Controls");
    MindFusion.Controls.MouseCursors = {
        Auto: "auto",
        Crosshair: "crosshair",
        Default: "default",
        Pointer: "pointer",
        Move: "move",
        HorizontalResize: "ew-resize",
        CounterDiagonalResize: "nesw-resize",
        DiagonalResize: "nwse-resize",
        VerticalResize: "ns-resize",
        Text: "text",
        Wait: "wait",
        Help: "help",
        Progress: "progress",
        Inherit: "inherit",
        Rotate: "all-scroll",
        Nothing: "null",
        NotAllowed: "not-allowed",
        Pan: "all-scroll"
    };
    MindFusion.Controls.ButtonType = {
        ScrollLeft: 0,
        ScrollUp: 1,
        ScrollRight: 2,
        ScrollDown: 3,
        ZoomIn: 4,
        ZoomOut: 5,
        ZoomScale: 6,
        ZoomSlider: 7
    };
    MindFusion.Controls.Orientation = {
        Horizontal: 0,
        Vertical: 1
    };
    MindFusion.Controls.TickPosition = {
        None: 0,
        Left: 1,
        Right: 2,
        Both: 3
    };
    MindFusion.Controls.Alignment = {
        Near: 0,
        Center: 1,
        Far: 2
    };
    (function(b) {
        var c = MindFusion.Diagramming.Utils;
        var a = b.Button = function(e, d) {
            this.parent = e;
            this.type = d;
            this.pen = "#000000";
            this.brush = "transparent";
            this.decorationPen = "#000000";
            this.decorationBrush = "transparent";
            this.hotPen = "#000000";
            this.hotBrush = "orange";
            this.hotDecorationPen = "#000000";
            this.hotDecorationBrush = "transparent"
        };
        a.prototype = {
            draw: function(e) {
                e.save();
                var d = this == this.parent.currentManipulator;
                if (this.shape) {
                    this.shape.pen = d ? this.hotPen : this.pen;
                    this.shape.brush = c.getBrush(e, d ? this.hotBrush : this.brush, this.shape.getBounds());
                    e.save();
                    e.shadowOffsetX = 1;
                    e.shadowOffsetY = 1;
                    e.shadowBlur = 2;
                    e.shadowColor = this.parent.shadowColor;
                    this.shape.draw(e);
                    e.closePath();
                    e.restore()
                }
                if (this.decoration) {
                    this.decoration.pen = d ? this.hotDecorationPen : this.decorationPen;
                    this.decoration.brush = c.getBrush(e, d ? this.hotDecorationBrush : this.decorationBrush, this.decoration.getBounds());
                    this.decoration.draw(e)
                }
                e.restore()
            },
            hitTest: function(d) {
                if (this.bounds.containsPoint(d)) {
                    return this
                }
                return null
            },
            setBounds: function(d) {
                if (this.bounds != d) {
                    this.bounds = d
                }
            },
            setShape: function(d) {
                if (this.shape != d) {
                    this.shape = d
                }
            },
            setDecoration: function(d) {
                if (this.decoration != d) {
                    this.decoration = d
                }
            }
        };
        MindFusion.registerClass(a, "MindFusion.Controls.Button")
    })(MindFusion.Controls);
    (function(a) {
        var c = MindFusion.Drawing.Rect;
        var d = MindFusion.Drawing.Path;
        var e = MindFusion.Drawing.Text;
        var f = MindFusion.Diagramming.Utils;
        var g = MindFusion.Controls.Alignment;
        var b = a.ZoomControl = function(h) {
            mflayer.initializeBase(b, this, [h]);
            this.controls = {};
            this.manipulators = [];
            this.padding = 5;
            this.minZoomFactor = 0;
            this.maxZoomFactor = 200;
            this.zoomStep = 10;
            this.snapToZoomStep = true;
            this.zoomFactor = 100;
            this.scrollStep = 10;
            this.showLabel = true;
            this.cornerRadius = 4;
            this.padding = 2;
            this.tickPosition = a.TickPosition.Left;
            this.cornerRadius = 2;
            this.fill = "#FFFFFF";
            this.backColor = "#FFFFFF";
            this.activeColor = "skyBlue";
            this.borderColor = "rgba(77,83,94,1)";
            this.innerColor = "rgba(91,91,91,1)";
            this.shadowColor = "gray";
            this.textColor = "rgba(77,83,94,1)";
            this.enabled = true;
            this.init()
        };
        b.prototype = {
            initialize: function() {
                mflayer.callBaseMethod(b, this, "initialize");
                this.postDataField = document.getElementById(this.get_element().id + "_PostData");
                var h = f.getChildrenByTagName("canvas", this.get_element())[0];
                if (typeof h.getContext !== "undefined") {
                    this.canvas = h;
                    this.context = h.getContext("2d")
                }
                mflayer.addHandlers(this._element, {
                    mousedown: mflayer.createDelegate(this, this.onMouseDown)
                });
                mflayer.addHandlers(this._element, {
                    mousemove: mflayer.createDelegate(this, this.onMouseMove)
                });
                this.mouseUpDelegate = mflayer.createDelegate(this, this.onMouseUp);
                mflayer.addHandlers(document, {
                    mouseup: this.mouseUpDelegate
                })
            },
            dispose: function() {
                mflayer.removeHandler(document, "mouseup", this.mouseUpDelegate);
                mflayer.callBaseMethod(b, this, "dispose")
            },
            registerForSubmit: function(j) {
                var i = document.getElementById(j);
                if (i) {
                    var h = i.form;
                    if (h) {
                        h.addEventListener("submit", mflayer.createDelegate(this, mflayer.createCallback(this.preparePostback, {
                            id: j
                        })))
                    }
                }
            },
            preparePostback: function(i, h) {
                var j = document.getElementById(h.id);
                if (j) {
                    j.value = this.toJson()
                }
            },
            postback: function() {
                if (this.get_element()) {
                    window.__doPostBack(this.get_element().id, this.postDataField)
                }
            },
            init: function() {
                var j = mflayer.getBounds(this.get_element());
                var i = j.width;
                var h = j.height;
                this.bounds = new c(0, 0, i, h);
                this.orientation = i > h ? a.Orientation.Horizontal : a.Orientation.Vertical;
                this.minDim = (this.orientation == a.Orientation.Vertical) ? this.bounds.width : this.bounds.height;
                this.maxDim = (this.orientation == a.Orientation.Vertical) ? this.bounds.height : this.bounds.width;
                this.radius = (this.minDim - 2 * this.padding) / 2;
                this.center = this.minDim / 2;
                this.spacing = this.buttonSize = this.minDim / 5;
                this.decorationSize = this.minDim / 10
            },
            createControls: function() {
                var q = new a.Button(this, a.ButtonType.None);
                var x = new d();
                x.arcTo(this.minDim / 2, this.minDim / 2, (this.minDim - this.padding * 2) / 2, 0, 2 * Math.PI, false);
                q.shape = x;
                q.pen = this.borderColor;
                q.brush = this.fill;
                var p = new a.Button(this, a.ButtonType.ScrollUp);
                p.bounds = new c(this.center - this.radius / 4, this.center - this.radius, this.radius / 2, this.radius);
                x = new d();
                x.arcTo(this.minDim / 2, this.minDim / 2, (this.minDim - this.padding * 2) / 2, (5 * Math.PI) / 4, (7 * Math.PI) / 4, false);
                x.lineTo(this.center, this.minDim / 2);
                x.close();
                p.shape = x;
                x = new d();
                x.moveTo(this.center - this.decorationSize, this.decorationSize * 3);
                x.lineTo(this.center, this.decorationSize * 2);
                x.lineTo(this.center + this.decorationSize, this.decorationSize * 3);
                p.decoration = x;
                var l = new a.Button(this, a.ButtonType.ScrollLeft);
                l.bounds = new c(this.center - this.radius, this.center - this.radius / 4, this.radius, this.radius / 2);
                x = new d();
                x.arcTo(this.minDim / 2, this.minDim / 2, (this.minDim - this.padding * 2) / 2, (3 * Math.PI) / 4, (5 * Math.PI) / 4, false);
                x.lineTo(this.center, this.minDim / 2);
                x.close();
                l.shape = x;
                x = new d();
                x.moveTo(this.decorationSize * 3, this.center - this.decorationSize);
                x.lineTo(this.decorationSize * 2, this.center);
                x.lineTo(this.decorationSize * 3, this.center + this.decorationSize);
                l.decoration = x;
                var h = new a.Button(this, a.ButtonType.ScrollDown);
                h.bounds = new c(this.center - this.radius / 4, this.center, this.radius / 2, this.radius);
                x = new d();
                x.arcTo(this.minDim / 2, this.minDim / 2, (this.minDim - this.padding * 2) / 2, Math.PI / 4, (3 * Math.PI) / 4, false);
                x.lineTo(this.center, this.minDim / 2);
                x.close();
                x.quadraticCurveTo(this.center, this.minDim, this.spacing, this.minDim - this.spacing);
                h.shape = x;
                x = new d();
                x.moveTo(this.center - this.decorationSize, this.minDim - this.decorationSize * 3);
                x.lineTo(this.center, this.minDim - this.decorationSize * 2);
                x.lineTo(this.center + this.decorationSize, this.minDim - this.decorationSize * 3);
                h.decoration = x;
                var t = new a.Button(this, a.ButtonType.ScrollRight);
                t.bounds = new c(this.center, this.center - this.radius / 4, this.radius, this.radius / 2);
                x = new d();
                x.arcTo(this.minDim / 2, this.minDim / 2, (this.minDim - this.padding * 2) / 2, (7 * Math.PI) / 4, Math.PI / 4, false);
                x.lineTo(this.center, this.minDim / 2);
                x.close();
                t.shape = x;
                x = new d();
                x.moveTo(this.minDim - this.decorationSize * 3, this.center - this.decorationSize);
                x.lineTo(this.minDim - this.decorationSize * 2, this.center);
                x.lineTo(this.minDim - this.decorationSize * 3, this.center + this.decorationSize);
                t.decoration = x;
                p.pen = p.hotPen = h.pen = h.hotPen = l.pen = l.hotPen = t.pen = t.hotPen = "transparent";
                p.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 270
                };
                t.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 0
                };
                l.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 180
                };
                h.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 90
                };
                p.decorationBrush = p.hotDecorationBrush = l.decorationBrush = l.hotDecorationBrush = h.decorationBrush = h.hotDecorationBrush = t.decorationBrush = t.hotDecorationBrush = "transparent";
                p.decorationPen = p.hotDecorationPen = l.decorationPen = l.hotDecorationPen = h.decorationPen = h.hotDecorationPen = t.decorationPen = t.hotDecorationPen = this.innerColor;
                var w = new a.Button(this, a.ButtonType.ZoomIn);
                var j = new c(this.maxDim - this.minDim - this.spacing, this.center - this.spacing, this.spacing * 2, this.spacing * 2);
                if (this.orientation == a.Orientation.Vertical) {
                    j = new c(this.center - this.spacing, this.minDim + this.spacing, this.spacing * 2, this.spacing * 2)
                }
                w.bounds = j;
                x = new d();
                x.addRoundRect(j, this.cornerRadius);
                w.shape = x;
                x = new d();
                if (this.orientation == a.Orientation.Vertical) {
                    x.moveTo(this.center - this.buttonSize / 2, this.minDim + this.buttonSize * 2);
                    x.lineTo(this.center + this.buttonSize / 2, this.minDim + this.buttonSize * 2);
                    x.moveTo(this.center, this.minDim + this.buttonSize * 2 - this.buttonSize / 2);
                    x.lineTo(this.center, this.minDim + this.buttonSize * 2 + this.buttonSize / 2)
                } else {
                    x.moveTo(this.maxDim - this.minDim, this.center + this.buttonSize / 2);
                    x.lineTo(this.maxDim - this.minDim, this.center - this.buttonSize / 2);
                    x.moveTo(this.maxDim - this.minDim - this.buttonSize / 2, this.center);
                    x.lineTo(this.maxDim - this.minDim + this.buttonSize / 2, this.center)
                }
                w.decoration = x;
                w.pen = w.hotPen = this.borderColor;
                w.brush = this.fill;
                w.decorationPen = w.hotDecorationPen = this.innerColor;
                w.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 30
                };
                var s = new a.Button(this, a.ButtonType.ZoomOut);
                j = new c(this.minDim + this.spacing, this.center - this.spacing, this.spacing * 2, this.spacing * 2);
                if (this.orientation == a.Orientation.Vertical) {
                    j = new c(this.center - this.spacing, this.maxDim - this.minDim - this.spacing, this.spacing * 2, this.spacing * 2)
                }
                s.bounds = j;
                x = new d();
                x.addRoundRect(j, this.cornerRadius);
                s.shape = x;
                x = new d();
                if (this.orientation == a.Orientation.Vertical) {
                    x.moveTo(this.center - this.buttonSize / 2, this.maxDim - this.minDim);
                    x.lineTo(this.center + this.buttonSize / 2, this.maxDim - this.minDim)
                } else {
                    x.moveTo(this.minDim + this.buttonSize * 2 - this.buttonSize / 2, this.center);
                    x.lineTo(this.minDim + this.buttonSize * 2 + this.buttonSize / 2, this.center)
                }
                s.decoration = x;
                s.pen = s.hotPen = this.borderColor;
                s.brush = this.fill;
                s.decorationPen = s.hotDecorationPen = this.innerColor;
                s.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 30
                };
                var n = new a.Button(this, a.ButtonType.ZoomScale);
                var v = Math.round((this.maxZoomFactor - this.minZoomFactor) / this.zoomStep) + 2;
                var r = this.maxDim - this.minDim * 2 - this.spacing * 4;
                var m = (r - this.spacing) / (v - 2);
                j = new c(this.minDim + this.spacing * 3, this.center - this.spacing, r, this.spacing * 2);
                if (this.orientation == a.Orientation.Vertical) {
                    j = new c(this.center - this.spacing, this.minDim + this.spacing * 3, this.spacing * 2, r)
                }
                n.bounds = j;
                x = new d();
                if (this.orientation == a.Orientation.Vertical) {
                    x.addRect(this.center - this.spacing / 4, this.minDim + this.spacing * 3, this.spacing / 2, r);
                    if (this.tickPosition == a.TickPosition.Left || this.tickPosition == a.TickPosition.Both) {
                        for (var o = 0; o < v - 1; o++) {
                            x.moveTo(this.center - this.spacing / 2, this.minDim + this.spacing * 3 + this.spacing / 2 + m * o);
                            x.lineTo(this.center - this.spacing, this.minDim + this.spacing * 3 + this.spacing / 2 + m * o)
                        }
                    }
                    if (this.tickPosition == a.TickPosition.Right || this.tickPosition == a.TickPosition.Both) {
                        for (var o = 0; o < v - 1; o++) {
                            x.moveTo(this.center + this.spacing / 2, this.minDim + this.spacing * 3 + this.spacing / 2 + m * o);
                            x.lineTo(this.center + this.spacing, this.minDim + this.spacing * 3 + this.spacing / 2 + m * o)
                        }
                    }
                } else {
                    x.addRect(this.minDim + this.spacing * 3, this.center - this.spacing / 4, r, this.spacing / 2);
                    if (this.tickPosition == a.TickPosition.Left || this.tickPosition == a.TickPosition.Both) {
                        for (var o = 0; o < v - 1; o++) {
                            x.moveTo(this.minDim + this.spacing * 3 + this.spacing / 2 + m * o, this.center - this.spacing / 2);
                            x.lineTo(this.minDim + this.spacing * 3 + this.spacing / 2 + m * o, this.center - this.spacing)
                        }
                    }
                    if (this.tickPosition == a.TickPosition.Right || this.tickPosition == a.TickPosition.Both) {
                        for (var o = 0; o < v - 1; o++) {
                            x.moveTo(this.minDim + this.spacing * 3 + this.spacing / 2 + m * o, this.center + this.spacing / 2);
                            x.lineTo(this.minDim + this.spacing * 3 + this.spacing / 2 + m * o, this.center + this.spacing)
                        }
                    }
                }
                n.decoration = x;
                n.pen = n.hotPen = n.hotBrush = "transparent";
                n.decorationBrush = n.hotDecorationBrush = this.fill;
                n.decorationPen = n.hotDecorationPen = this.innerColor;
                var k = new a.Button(this, a.ButtonType.ZoomSlider);
                k.pen = k.hotPen = this.borderColor;
                k.brush = this.fill;
                k.hotBrush = {
                    type: "LinearGradientBrush",
                    color1: this.activeColor,
                    color2: "white",
                    angle: 30
                };
                var u;
                if (this.showLabel) {
                    var j = new c(this.maxDim - this.minDim / 2 + this.spacing / 2, this.center, this.minDim, this.minDim);
                    if (this.orientation == a.Orientation.Vertical) {
                        j = new c(this.center, this.maxDim - this.minDim / 2 + this.spacing / 2, this.minDim, this.minDim)
                    }
                    u = new e(this.zoomFactor + "%", j);
                    u.font = new MindFusion.Drawing.Font("sans-serif", 10);
                    u.textAlignment = g.Center;
                    u.lineAlignment = g.Center;
                    u.pen = this.textColor
                }
                this.controls = {
                    scroller: q,
                    upButton: p,
                    leftButton: l,
                    downButton: h,
                    rightButton: t,
                    zoomInButton: w,
                    zoomOutButton: s,
                    scale: n,
                    slider: k
                };
                if (this.showLabel) {
                    this.controls.label = u
                }
                this.manipulators = [p, l, h, t, w, s, k, n]
            },
            repaint: function() {
                if (!this.context) {
                    return
                }
                this.canvas.width = this.canvas.width;
                this.context.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
                this.context.fillStyle = this.backColor;
                this.context.fill();
                for (var h in this.controls) {
                    if (this.controls[h].draw) {
                        this.controls[h].draw(this.context)
                    }
                }
            },
            fromJson: function(h) {
                if (h > "") {
                    var i = mflayer.fromJson(h);
                    this.targetId = i.targetId;
                    this.padding = i.padding;
                    this.minZoomFactor = i.minZoomFactor;
                    this.maxZoomFactor = i.maxZoomFactor;
                    this.zoomStep = i.zoomStep;
                    this.scrollStep = i.scrollStep;
                    this.snapToZoomStep = i.snapToZoomStep;
                    this.showLabel = i.showLabel;
                    this.tickPosition = i.tickPosition;
                    this.cornerRadius = i.cornerRadius;
                    this.fill = i.fill;
                    this.backColor = i.backColor;
                    this.activeColor = i.activeColor;
                    this.borderColor = i.borderColor;
                    this.innerColor = i.innerColor;
                    this.shadowColor = i.shadowColor;
                    this.textColor = i.textColor;
                    this.createControls();
                    this.setZoomFactorInternal(i.zoomFactor, true, false);
                    this.setEnabled(i.enabled);
                    this.setAutoPostBack(i.autoPostBack);
                    var j = this;
                    setTimeout(function() {
                        return j.prepare()
                    }, 100)
                }
            },
            prepare: function() {
                var h = mflayer.findControl(this.targetId);
                if (h) {
                    this.target = h;
                    if (h.addEventListener) {
                        h.addEventListener("zoomChanged", mflayer.createDelegate(this, this.onZoomChanged))
                    }
                    this.repaint()
                }
            },
            toJson: function() {
                var h = {
                    id: this.get_element().id,
                    targetId: this.targetId,
                    padding: this.padding,
                    minZoomFactor: this.minZoomFactor,
                    maxZoomFactor: this.maxZoomFactor,
                    zoomFactor: this.zoomFactor,
                    zoomStep: this.zoomStep,
                    scrollStep: this.scrollStep,
                    snapToZoomStep: this.snapToZoomStep,
                    showLabel: this.showLabel,
                    tickPosition: this.tickPosition,
                    cornerRadius: this.cornerRadius,
                    fill: this.fill,
                    backColor: this.backColor,
                    activeColor: this.activeColor,
                    borderColor: this.borderColor,
                    innerColor: this.innerColor,
                    shadowColor: this.shadowColor,
                    textColor: this.textColor,
                    enabled: this.enabled,
                    autoPostBack: this.autoPostBack
                };
                return mflayer.toJson(h)
            },
            setTarget: function(h) {
                this.createControls();
                this.setZoomFactorInternal(this.zoomFactor, true, false);
                this.target = h;
                if (h) {
                    h.addEventListener("zoomChanged", mflayer.createDelegate(this, this.onZoomChanged))
                }
                this.repaint()
            },
            onZoomChanged: function() {
                this.setZoomFactorInternal(this.target.zoomFactor, true, false)
            },
            onMouseDown: function(i) {
                if (!this.enabled) {
                    return
                }
                this.mouseDownPoint = f.getCursorPos(i, this.get_element());
                var h = this.hitTestManipulators(this.mouseDownPoint);
                if (h) {
                    this.onButtonMouseDown(i, h)
                }
                this.currentManipulator = h;
                this.repaint()
            },
            onMouseMove: function(h) {
                if (!this.enabled) {
                    return
                }
                if (this.mouseDownPoint) {
                    if (this.currentManipulator) {
                        if (this.currentManipulator.type == a.ButtonType.ZoomSlider) {
                            this.onSliderMove(h)
                        }
                    }
                }
            },
            onMouseUp: function(i) {
                if (!this.enabled) {
                    return
                }
                var j = f.getCursorPos(i, this.get_element());
                clearInterval(this.timer);
                if (this.mouseDownPoint != null) {
                    if (j.distance(this.mouseDownPoint) < 2) {
                        var h = this.hitTestManipulators(this.mouseDownPoint);
                        if (h) {
                            this.onButtonClick(i, h)
                        }
                    }
                }
                this.mouseDownPoint = null;
                this.currentManipulator = null;
                this.repaint()
            },
            onSliderMove: function(l) {
                var n = f.getCursorPos(l, this.get_element());
                var i = this.minDim + this.spacing * 3;
                var m = this.maxDim - this.minDim * 2 - this.spacing * 5;
                var h = n;
                h.x -= this.spacing / 2;
                h.y -= this.spacing / 2;
                if (this.orientation == a.Orientation.Vertical) {
                    var o = Math.min(m, Math.max(h.y - i, 0));
                    var j = o / m;
                    var k = Math.round((this.maxZoomFactor - this.minZoomFactor) - (this.maxZoomFactor - this.minZoomFactor) * j)
                } else {
                    var o = Math.min(m, Math.max(h.x - i, 0));
                    var j = o / m;
                    var k = Math.round((this.maxZoomFactor - this.minZoomFactor) * j)
                }
                this.setZoomFactorInternal(this.minZoomFactor + k, true)
            },
            hitTestManipulators: function(k) {
                if (!this.manipulators) {
                    return false
                }
                for (var j = 0; j < this.manipulators.length; j++) {
                    var h = this.manipulators[j];
                    if (h.hitTest(k)) {
                        return h
                    }
                }
                return null
            },
            setZoomFactorInternal: function(k, i, j) {
                if (!i) {
                    this.zoomFactor = k
                } else {
                    if (this.snapToZoomStep && k > this.minZoomFactor && k < this.maxZoomFactor) {
                        var h = this.minZoomFactor + (Math.round((k - this.minZoomFactor) / this.zoomStep) * this.zoomStep);
                        this.zoomFactor = Math.min(this.maxZoomFactor, Math.max(this.minZoomFactor, h))
                    } else {
                        this.zoomFactor = Math.min(this.maxZoomFactor, Math.max(this.minZoomFactor, k))
                    }
                }
                this.updateControls();
                this.repaint();
                if (j != false) {
                    if (this.target != null) {
                        this.target.setZoomLevel(this.zoomFactor)
                    }
                }
            },
            updateControls: function() {
                var l = this.maxDim - this.minDim * 2 - this.spacing * 5;
                var j = (this.zoomFactor - this.minZoomFactor) / (this.maxZoomFactor - this.minZoomFactor);
                var h = (l * j) + this.spacing / 2;
                var i = new c(this.minDim + this.spacing * 2 + this.spacing / 2 + h, this.center - this.spacing, this.spacing, this.spacing * 2);
                if (this.orientation == a.Orientation.Vertical) {
                    h = l - (l * j) + this.spacing / 2;
                    i = new c(this.center - this.spacing, this.minDim + this.spacing * 2 + this.spacing / 2 + h, this.spacing * 2, this.spacing)
                }
                this.controls.slider.setBounds(i);
                var k = new d();
                k.addRoundRect(i, this.cornerRadius);
                this.controls.slider.shape = k;
                if (this.showLabel) {
                    this.controls.label.text = this.zoomFactor + "%"
                }
                this.repaint()
            },
            onButtonMouseDown: function(i, h) {
                if (!this.target) {
                    return
                }
                thisObj = this;
                switch (h.type) {
                    case a.ButtonType.ScrollLeft:
                        this.timer = setInterval(function() {
                            thisObj.target.setScroll(thisObj.target.getScrollX() - thisObj.scrollStep, thisObj.target.getScrollY())
                        }, 100);
                        break;
                    case a.ButtonType.ScrollUp:
                        this.timer = setInterval(function() {
                            thisObj.target.setScroll(thisObj.target.getScrollX(), thisObj.target.getScrollY() - thisObj.scrollStep)
                        }, 100);
                        break;
                    case a.ButtonType.ScrollRight:
                        this.timer = setInterval(function() {
                            thisObj.target.setScroll(thisObj.target.getScrollX() + thisObj.scrollStep, thisObj.target.getScrollY())
                        }, 100);
                        break;
                    case a.ButtonType.ScrollDown:
                        this.timer = setInterval(function() {
                            thisObj.target.setScroll(thisObj.target.getScrollX(), thisObj.target.getScrollY() + thisObj.scrollStep)
                        }, 100);
                        break
                }
            },
            onButtonClick: function(i, h) {
                switch (h.type) {
                    case a.ButtonType.ZoomIn:
                        this.setZoomFactorInternal(this.zoomFactor + this.zoomStep, true);
                        break;
                    case a.ButtonType.ZoomOut:
                        this.setZoomFactorInternal(this.zoomFactor - this.zoomStep, true);
                        break;
                    case a.ButtonType.ZoomScale:
                        this.onSliderMove(i);
                        break;
                    case a.ButtonType.ScrollLeft:
                        if (this.target) {
                            this.target.setScroll(this.target.getScrollX() - this.scrollStep, this.target.getScrollY())
                        }
                        break;
                    case a.ButtonType.ScrollUp:
                        if (this.target) {
                            this.target.setScroll(this.target.getScrollX(), this.target.getScrollY() - this.scrollStep)
                        }
                        break;
                    case a.ButtonType.ScrollRight:
                        if (this.target) {
                            this.target.setScroll(this.target.getScrollX() + this.scrollStep, this.target.getScrollY())
                        }
                        break;
                    case a.ButtonType.ScrollDown:
                        if (this.target) {
                            this.target.setScroll(this.target.getScrollX(), this.target.getScrollY() + this.scrollStep)
                        }
                        break
                }
                if (this.postDataField) {
                    this.preparePostback(this, this.postDataField.id);
                    if (this.autoPostBack) {
                        this.postback()
                    }
                }
            },
            setEnabled: function(h) {
                this.enabled = h
            },
            getEnabled: function() {
                return this.enabled
            },
            getAutoPostBack: function() {
                return this.autoPostBack
            },
            setAutoPostBack: function(h) {
                this.autoPostBack = h
            },
            setZoomFactor: function(h) {
                if (this.zoomFactor !== h) {
                    this.setZoomFactorInternal(h)
                }
            },
            getZoomFactor: function() {
                return this.zoomFactor
            },
            setMinZoomFactor: function(h) {
                if (this.minZoomFactor !== h) {
                    this.minZoomFactor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getMinZoomFactor: function() {
                return this.minZoomFactor
            },
            setMaxZoomFactor: function(h) {
                if (this.maxZoomFactor !== h) {
                    this.maxZoomFactor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getMaxZoomFactor: function() {
                return this.maxZoomFactor
            },
            setZoomStep: function(h) {
                if (this.zoomStep !== h) {
                    this.zoomStep = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getZoomStep: function() {
                return this.zoomStep
            },
            setScrollStep: function(h) {
                if (this.scrollStep !== h) {
                    this.scrollStep = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getScrollStep: function() {
                return this.scrollStep
            },
            setBackColor: function(h) {
                if (this.backColor !== h) {
                    this.backColor = h;
                    this.repaint()
                }
            },
            getBackColor: function() {
                return this.backColor
            },
            setFill: function(h) {
                if (this.fill !== h) {
                    this.fill = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getFill: function() {
                return this.fill
            },
            setActiveColor: function(h) {
                if (this.activeColor !== h) {
                    this.activeColor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getActiveColor: function() {
                return this.activeColor
            },
            setBorderColor: function(h) {
                if (this.borderColor !== h) {
                    this.borderColor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getBorderColor: function() {
                return this.borderColor
            },
            setInnerColor: function(h) {
                if (this.innerColor !== h) {
                    this.innerColor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getInnerColor: function() {
                return this.innerColor
            },
            setShadowColor: function(h) {
                if (this.shadowColor !== h) {
                    this.shadowColor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getShadowColor: function() {
                return this.shadowColor
            },
            setTextColor: function(h) {
                if (this.textColor !== h) {
                    this.textColor = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getTextColor: function() {
                return this.textColor
            },
            setShowLabel: function(h) {
                if (this.showLabel !== h) {
                    this.showLabel = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getShowLabel: function() {
                return this.showLabel
            },
            setTickPosition: function(h) {
                if (this.tickPosition !== h) {
                    this.tickPosition = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getTickPosition: function() {
                return this.tickPosition
            },
            setSnapToZoomStep: function(h) {
                if (this.snapToZoomStep !== h) {
                    this.snapToZoomStep = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getSnapToZoomStep: function() {
                return this.snapToZoomStep
            },
            setPadding: function(h) {
                if (this.padding !== h) {
                    this.padding = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getPadding: function() {
                return this.padding
            },
            setCornerRadius: function(h) {
                if (this.cornerRadius !== h) {
                    this.cornerRadius = h;
                    this.createControls();
                    this.updateControls();
                    this.repaint()
                }
            },
            getCornerRadius: function() {
                return this.cornerRadius
            }
        };
        MindFusion.Controls.ZoomControl.create = function(h) {
            return mflayer.createControl(MindFusion.Controls.ZoomControl, null, null, null, h)
        };
        MindFusion.Controls.ZoomControl.find = function(h, i) {
            return mflayer.findControl(h, i)
        };
        MindFusion.registerClass(b, "MindFusion.Controls.ZoomControl", "Control")
    })(MindFusion.Controls);

    return MindFusion;
}));