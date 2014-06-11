if (typeof _pptm === 'undefined' || !_pptm) {
    var _pptm = {};
}

_pptm.apps = _pptm.apps || {};

(function (document) {
    var app = {},
        _pptmURL = '/* @echo URL */core/button/start-transaction/',
        _btnCode = 'JavaScriptButton_{type}',
        _pptmButtonURL = 'https://paywith.paytm.com/assets/images/paywithpaytm.png',
        _prettyParams = {
            name: 'item_name',
            number: 'item_number',
            locale: 'lc',
            currency: 'currency_code',
            recurrence: 'p3',
            period: 't3',
            callback: 'notify_url'
        },
        locales = {

            en_US: {
                buynow: 'Buy Now',
                cart: 'Add to Cart',
                donate: 'Donate',
                subscribe: 'Subscribe',
                item_name: 'Item',
                number: 'Number',
                amount: 'Amount',
                quantity: 'Quantity'
            }

        };


    if (!_pptm.apps.ButtonFactory) {

        /**
         * Initial config for the app. These values can be overridden by the page.
         */
        app.config = {
            labels: {}
        };

        /**
         * A count of each type of button on the page
         */
        app.buttons = {
            buynow: 0,
            cart: 0,
            donate: 0,
            qr: 0,
            subscribe: 0
        };

        /**
         * Renders a button in place of the given element
         *
         * @param buttonId {Object} The ID or email address of the merchant to create the button for
         * @param raw {Object} An object of key/value data to set as button params
         * @param type (String) The type of the button to render
         * @param parent {HTMLElement} The element to add the button to (Optional)
         * @return {HTMLElement}
         */
        app.create = function (buttonId, raw, type, parent) {
            var data = new DataStore(),
                button, key, env;

            if (!buttonId) {
                if (type === 'paywithdg') {
                    //do nothing
                } else {
                    return false;
                }

            }

            // Normalize the data's keys and add to a data store
            for (key in raw) {

                data.add(_prettyParams[key] || key, raw[key].value || raw[key], raw[key].isEditable);
            }

            // Defaults
            type = type || 'buynow';
            env = "production";

            if (data.items.env && data.items.env.value) {
                env += "." + data.items.env.value;
            }

            // Cart buttons
            if (type === 'cart') {
                data.add('cmd', '_cart');
                data.add('add', true);
                // Donation buttons
            } else if (type === 'donate') {
                data.add('cmd', '_donations');
                // Subscribe buttons
            } else if (type === 'subscribe') {
                data.add('cmd', '_xclick-subscriptions');

                // TODO: "amount" cannot be used in _prettyParams since it's overloaded
                // Find a better way to do this
                if (data.items.amount && !data.items.a3) {
                    data.add('a3', data.items.amount.value);
                }
                // Buy Now buttons
            } else {
                data.add('cmd', '_xclick');
            }

            var device_type = getDeviceType();

            data.add('device_type', device_type);


            // Add common data
            data.add('button_id', buttonId);
            data.add('bn', _btnCode.replace(/\{type\}/, type));
            data.add('env', env);

            // Build the UI components
            if (type === 'qr') {
                button = buildQR(data, data.items.size);
                data.remove('size');
            } else {
                if (type === 'paywithdg') {
                    button = buildButton(data, type);
                } else {
                    button = buildForm(data, type);
                }

            }

            // Inject CSS
            injectCSS();

            // Register it
            this.buttons[type] += 1;

            // Add it to the DOM
            if (parent) {
                parent.appendChild(button);
            }

            return button;
        };


        _pptm.apps.ButtonFactory = app;
    }


    /**
     * Injects button CSS in the <head>
     *
     * @return {void}
     */
    function injectCSS() {

        var css, styleEl, _pptmButton, _pptmInput;

        if (document.getElementById('pptm-button')) {
            return;
        }

        css = '';
        styleEl = document.createElement('style');
        _pptmButton = '.pptm-button';
        _pptmInput = _pptmButton + ' button';

        css += _pptmButton + ' { white-space: nowrap; }';
        css += _pptmInput + ' { white-space: nowrap; overflow: hidden; font-family: "Arial", bold, italic; font-weight: bold; font-style: italic;color: #0E3168; background: url(' + _pptmButtonURL + '); position: relative; text-shadow: 0 1px 0 rgba(255,255,255,.5); cursor: pointer; z-index: 0; }';

        css += _pptmInput + '.small { padding: 3px 15px; font-size: 12px; }';
        css += _pptmInput + '.large {  width:238px; height:65px; border:none;}';
        css += '.tbox { position: absolute;display: none;padding: 14px 17px;z-index: 999999 !important}';
        css += '.tinner {padding: 15px;-moz-border-radius: 5px;border-radius: 5px;background: #fff url(assets/images/preload.gif) no-repeat 50% 50%;border-right: 1px solid #333;border-bottom: 1px solid #333}';
        css += '.tmask {position: absolute;display: none;top: 0px;left: 0px;height: 100%;width: 100%;background: #000;z-index: 800}';
        css += '.tclose {position: absolute;top: 0px;right: 0px;width: 30px;height: 30px;cursor: pointer;background: url(assets/images/close.png) no-repeat}';
        css += '.tclose:hover {background-position: 0 -30px}';
        css += '#blackmask {background: #333}';
        css += '#frameless {padding: 0px}';
        css += '#frameless .tclose {left: 6px}';

        styleEl.type = 'text/css';
        styleEl.id = 'pptm-button';

        if (styleEl.styleSheet) {
            styleEl.styleSheet.cssText = css;
        } else {
            styleEl.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(styleEl);
    }


    // Init the buttons
    if (typeof document !== 'undefined') {
        var ButtonFactory = _pptm.apps.ButtonFactory,
            nodes = document.getElementsByTagName('script'),
            node, data, type, buttonId, i, len;

        for (i = 0, len = nodes.length; i < len; i++) {
            node = nodes[i];

            if (!node || !node.src) {
                continue;
            }

            data = node && getDataSet(node);
            type = data && data.button && data.button.value;

            //console.log(type);

            buttonId = node.src.split('?button_id=')[1];



            if (buttonId) {
                ButtonFactory.create(buttonId, data, type, node.parentNode);

                // Clean up
                node.parentNode.removeChild(node);
            } else {
                if (type === 'paywithdg') {
                    ButtonFactory.create("", data, type, node.parentNode);

                    // Clean up
                    node.parentNode.removeChild(node);
                } else {
                    // do nothing
                }
            }
        }
    }





    /**
     * A storage object to create structured methods around a button's data
     */
    function DataStore() {
        this.items = {};

        this.add = function (key, value, isEditable) {
            this.items[key] = {
                key: key,
                value: value,
                isEditable: isEditable
            };
        };

        this.remove = function (key) {
            delete this.items[key];
        };
    }

    /*
     *function to get all the data sets from the
     */
    function getDataSet(el) {
        var dataset = {}, attrs, attr, matches, len, i;

        if ((attrs = el.attributes)) {
            for (i = 0, len = attrs.length; i < len; i++) {
                attr = attrs[i];

                if ((matches = attr.name.match(/^pptmdata-([a-z0-9_]+)(-editable)?/i))) {
                    if (attr.value != "") {
                        dataset[matches[1]] = {
                            value: attr.value,
                            isEditable: !! matches[2]
                        };
                    }
                }
            }
        }

        return dataset;
    }





    function buildForm(data, type) {

        var form = document.createElement('form'),
            btn = document.createElement('button'),
            hidden = document.createElement('input'),
            items = data.items,
            item, child, label, input, key, size, locale, localeText, btnText;

        form.method = 'post';
        form.action = _pptmURL;
        form.className = 'pptm-button';
        form.target = '_top';

        hidden.type = 'hidden';

        size = items.size && items.size.value || 'large';
        locale = items.lc && items.lc.value || 'en_US';
        localeText = locales[locale] || locales.en_US;
        btnText = ""; //localeText[type];

        if (data.items.text) {
            btnText = data.items.text.value;
            data.remove('text');
        }

        for (key in items) {
            item = items[key];

            if (item.isEditable) {
                input = document.createElement('input');
                input.type = 'text';
                input.className = 'pptm-input';
                input.name = item.key;
                input.value = item.value;

                label = document.createElement('label');
                label.className = 'pptm-label';
                label.appendChild(document.createTextNode(app.config.labels[item.key] || localeText[item.key]));
                label.appendChild(input);

                child = document.createElement('p');
                child.className = 'pptm-group';
                child.appendChild(label);
            } else {
                input = child = hidden.cloneNode(true);
                input.name = item.key;
                input.value = item.value;
            }

            form.appendChild(child);
        }

        // Safari won't let you set read-only attributes on buttons.
        try {
            btn.type = 'submit';
        } catch (e) {
            btn.setAttribute('type', 'submit');
        }
        btn.className = 'pptm-button ' + size;
        btn.appendChild(document.createTextNode(btnText));

        form.appendChild(btn);

        return form;
    }


    function buildButton(data, type) {

        var _pptmInputTag = document.createElement("button"),
            btn = document.createElement('button'),
            _pptmDiv = document.createElement("div"),
            items = data.items,
            item, child, label, input, key, size, locale, localeText, btnText;

        _pptmDiv.className = 'pptm-button';

        _pptmInputTag.className = 'pptm-button';

        size = items.size && items.size.value || 'large';
        locale = items.lc && items.lc.value || 'en_US';
        localeText = locales[locale] || locales.en_US;
        btnText = "";





        // Safari won't let you set read-only attributes on buttons.
        try {
            _pptmInputTag.type = 'submit';
        } catch (e) {
            _pptmInputTag.setAttribute('type', 'submit');
        }

        _pptmInputTag.className = 'pptm-button ' + size;


        var height = 450;
        var width = 350;

        _pptmInputTag.onclick = function () {
            var device_type = getDeviceType();
            if (device_type === 'mobile-browser') {
                var windowSize = "width=" + window.innerWidth + ",height=" + window.innerHeight + ",scrollbars=no";
                // var url = data.items.url.value + 'payment_details.html?pbid=' + data.items.pbid.value + "&return_url=" + document.location.href;
                var url = 'file:///home/pradeep/Projects/paywith/payment_details.html?pbid=' + data.items.pbid.value + "&return_url=" + document.location.href;
                window.open(url, 'popup', windowSize);

            } else {
                TINY.box.show({
                    iframe: 'file:///home/pradeep/Projects/paywith/payment_details.html?pbid=' + data.items.pbid.value,
                    boxid: 'frameless',
                    width: width,
                    height: height,
                    fixed: false,
                    maskid: 'blackmask',
                    maskopacity: 40,
                    closejs: function () {
                        closeJS()
                    }
                });
            }
        };


        _pptmDiv.appendChild(_pptmInputTag);

        return _pptmDiv;
    }


    function getDeviceType() {
        var _user_agent = window.navigator.userAgent.toLowerCase();

        var device = {};

        _find = function (needle) {
            return _user_agent.indexOf(needle) !== -1;
        };
        device.iphone = function () {
            return _find('iphone');
        };
        device.android = function () {
            return _find('android');
        };
        device.ipod = function () {
            return _find('ipod');
        };
        device.androidPhone = function () {
            return device.android() && _find('mobile');
        };
        device.blackberry = function () {
            return _find('blackberry') || _find('bb10') || _find('rim');
        };
        device.blackberryPhone = function () {
            return device.blackberry() && !_find('tablet');
        };
        device.windows = function () {
            return _find('windows');
        };
        device.windowsPhone = function () {
            return device.windows() && _find('phone');
        };
        device.fxos = function () {
            return (_find('(mobile;') || _find('(tablet;')) && _find('; rv:');
        };
        device.fxosPhone = function () {
            return device.fxos() && _find('mobile');
        };
        device.meego = function () {
            return _find('meego');
        };

        device.mobile = function () {
            return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
        };

        if (device.mobile()) {
            return 'mobile-browser';
        } else {
            return 'desktop-browser';
        }
    }

}(document));









function openJS() {
    alert('loaded');

}

function closeJS() {
    console.log('closed')
}

TINY = {};

TINY.box = function () {
    var j, m, b, g, v, p = 0;
    return {
        show: function (o) {
            v = {
                opacity: 70,
                close: 1,
                animate: 1,
                fixed: 1,
                mask: 1,
                maskid: '',
                boxid: '',
                topsplit: 2,
                url: 0,
                post: 0,
                height: 0,
                width: 0,
                html: 0,
                iframe: 0
            };
            for (s in o) {
                v[s] = o[s]
            }
            if (!p) {
                j = document.createElement('div');
                j.className = 'tbox';
                p = document.createElement('div');
                p.className = 'tinner';
                b = document.createElement('div');
                b.className = 'tcontent';
                m = document.createElement('div');
                m.className = 'tmask';
                g = document.createElement('div');
                g.className = 'tclose';
                g.v = 0;
                document.body.appendChild(m);
                document.body.appendChild(j);
                j.appendChild(p);
                p.appendChild(b);
                m.onclick = g.onclick = TINY.box.hide;
                window.onresize = TINY.box.resize
            } else {
                j.style.display = 'none';
                clearTimeout(p.ah);
                if (g.v) {
                    p.removeChild(g);
                    g.v = 0
                }
            }
            p.id = v.boxid;
            m.id = v.maskid;
            j.style.position = v.fixed ? 'fixed' : 'absolute';
            if (v.html && !v.animate) {
                p.style.backgroundImage = 'none';
                b.innerHTML = v.html;
                b.style.display = '';
                p.style.width = v.width ? v.width + 'px' : 'auto';
                p.style.height = v.height ? v.height + 'px' : 'auto'
            } else {
                b.style.display = 'none';
                if (!v.animate && v.width && v.height) {
                    p.style.width = v.width + 'px';
                    p.style.height = v.height + 'px'
                } else {
                    p.style.width = p.style.height = '100px'
                }
            }
            if (v.mask) {
                this.mask();
                this.alpha(m, 1, v.opacity)
            } else {
                this.alpha(j, 1, 100)
            }
            if (v.autohide) {
                p.ah = setTimeout(TINY.box.hide, 1000 * v.autohide)
            } else {
                document.onkeyup = TINY.box.esc
            }
        },
        fill: function (c, u, k, a, w, h) {
            if (u) {
                if (v.image) {
                    var i = new Image();
                    i.onload = function () {
                        w = w || i.width;
                        h = h || i.height;
                        TINY.box.psh(i, a, w, h)
                    };
                    i.src = v.image
                } else if (v.iframe) {
                    this.psh('<iframe src="' + v.iframe + '" width="' + v.width + '" frameborder="0" height="' + v.height + '"></iframe>', a, w, h)
                } else {
                    var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    x.onreadystatechange = function () {
                        if (x.readyState == 4 && x.status == 200) {
                            p.style.backgroundImage = '';
                            TINY.box.psh(x.responseText, a, w, h)
                        }
                    };
                    if (k) {
                        x.open('POST', c, true);
                        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        x.send(k)
                    } else {
                        x.open('GET', c, true);
                        x.send(null)
                    }
                }
            } else {
                this.psh(c, a, w, h)
            }
        },
        psh: function (c, a, w, h) {
            if (typeof c == 'object') {
                b.appendChild(c)
            } else {
                b.innerHTML = c
            }
            var x = p.style.width,
                y = p.style.height;
            if (!w || !h) {
                p.style.width = w ? w + 'px' : '';
                p.style.height = h ? h + 'px' : '';
                b.style.display = '';
                if (!h) {
                    h = parseInt(b.offsetHeight)
                }
                if (!w) {
                    w = parseInt(b.offsetWidth)
                }
                b.style.display = 'none'
            }
            p.style.width = x;
            p.style.height = y;
            this.size(w, h, a)
        },
        esc: function (e) {
            e = e || window.event;
            if (e.keyCode == 27) {
                TINY.box.hide()
            }
        },
        hide: function () {
            TINY.box.alpha(j, -1, 0, 3);
            document.onkeypress = null;
            if (v.closejs) {
                v.closejs()
            }
        },
        resize: function () {
            TINY.box.pos();
            TINY.box.mask()
        },
        mask: function () {
            m.style.height = this.total(1) + 'px';
            m.style.width = this.total(0) + 'px'
        },
        pos: function () {
            var t;
            if (typeof v.top != 'undefined') {
                t = v.top
            } else {
                t = (this.height() / v.topsplit) - (j.offsetHeight / 2);
                t = t < 20 ? 20 : t
            }
            if (!v.fixed && !v.top) {
                t += this.top()
            }
            j.style.top = t + 'px';
            j.style.left = typeof v.left != 'undefined' ? v.left + 'px' : (this.width() / 2) - (j.offsetWidth / 2) + 'px'
        },
        alpha: function (e, d, a) {
            clearInterval(e.ai);
            if (d) {
                e.style.opacity = 0;
                e.style.filter = 'alpha(opacity=0)';
                e.style.display = 'block';
                TINY.box.pos()
            }
            e.ai = setInterval(function () {
                TINY.box.ta(e, a, d)
            }, 20)
        },
        ta: function (e, a, d) {
            var o = Math.round(e.style.opacity * 100);
            if (o == a) {
                clearInterval(e.ai);
                if (d == -1) {
                    e.style.display = 'none';
                    e == j ? TINY.box.alpha(m, -1, 0, 2) : b.innerHTML = p.style.backgroundImage = ''
                } else {
                    if (e == m) {
                        this.alpha(j, 1, 100)
                    } else {
                        j.style.filter = '';
                        TINY.box.fill(v.html || v.url, v.url || v.iframe || v.image, v.post, v.animate, v.width, v.height)
                    }
                }
            } else {
                var n = a - Math.floor(Math.abs(a - o) * .5) * d;
                e.style.opacity = n / 100;
                e.style.filter = 'alpha(opacity=' + n + ')'
            }
        },
        size: function (w, h, a) {
            if (a) {
                clearInterval(p.si);
                var wd = parseInt(p.style.width) > w ? -1 : 1,
                    hd = parseInt(p.style.height) > h ? -1 : 1;
                p.si = setInterval(function () {
                    TINY.box.ts(w, wd, h, hd)
                }, 20)
            } else {
                p.style.backgroundImage = 'none';
                if (v.close) {
                    p.appendChild(g);
                    g.v = 1
                }
                p.style.width = w + 'px';
                p.style.height = h + 'px';
                b.style.display = '';
                this.pos();
                if (v.openjs) {
                    v.openjs()
                }
            }
        },
        ts: function (w, wd, h, hd) {
            var cw = parseInt(p.style.width),
                ch = parseInt(p.style.height);
            if (cw == w && ch == h) {
                clearInterval(p.si);
                p.style.backgroundImage = 'none';
                b.style.display = 'block';
                if (v.close) {
                    p.appendChild(g);
                    g.v = 1
                }
                if (v.openjs) {
                    v.openjs()
                }
            } else {
                if (cw != w) {
                    p.style.width = (w - Math.floor(Math.abs(w - cw) * .6) * wd) + 'px'
                }
                if (ch != h) {
                    p.style.height = (h - Math.floor(Math.abs(h - ch) * .6) * hd) + 'px'
                }
                this.pos()
            }
        },
        top: function () {
            return document.documentElement.scrollTop || document.body.scrollTop
        },
        width: function () {
            return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        },
        height: function () {
            return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        },
        total: function (d) {
            var b = document.body,
                e = document.documentElement;
            return d ? Math.max(Math.max(b.scrollHeight, e.scrollHeight), Math.max(b.clientHeight, e.clientHeight)) :
                Math.max(Math.max(b.scrollWidth, e.scrollWidth), Math.max(b.clientWidth, e.clientWidth))
        }
    }
}();