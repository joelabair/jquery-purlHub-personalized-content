/*
	jQuery purlHub personalized content Plugin
	Personalizes markup based on standard purlHub tagging

	Documentation: http://support.purlhub.com/customer/portal/articles/567040-personalizing-in-your-pages-integration-basics-

	Author:
	Joel Bair / joel@thirdsocial.com

Usage:
$('div.selector').phRender([ dataObj | method | callback ]);

Example(s):
// just personalize this block

$('div.selector').phRender({
code: 	"JoeSomebodyX1",
profile:	{
	firstName:	"Joe",
	lastName:	"Somebody",
	email:		"joe@somewhere.org"
}
});

// with a callback
$('div.selector').phRender({
code: 	"JoeSomebodyX1",
profile:	{
	firstName:	"Joe",
	lastName:	"Somebody",
	email:		"joe@somewhere.org"
}
}, function(node){
// node = the html DOM node
alert ('done');
});

Arguments: (may be given in any order)

data :: (object) An object containing personalization data structures in key = value pairs
{
	code: 	"JoeSomebodyX1",
	profile:	{
		firstName:	"Joe",
		lastName:	"Somebody",
		email:		"joe@somewhere.org"
	},
	records: {
		some_Name: {
			field1: "val1",
			...
		}
	},
	attributes: {
		attrib1: "val1",
		...
	},
	links: {
		link1: "url1",
		...
	},
	association: {
		code: "",
		profile: {
			...
		}
	},
	referer: {
		code: "",
		profile: {
			...
		}
	}
}

method :: (string) A plugin method to call
	possible = [ personalize | templatize ]
	default = personalize

	personalize = render text values by class name in standard purlHub fashion (i.e. phProfileData-firstName)
	templatize = strip rendered text and return the elements to their original ph class named state.

callback :: (function) a callback function to call after method invocation
	function(thisNode) {
		alert('done');
	}

*/
(function( $ ){

    $.fn.phRender = function() {

        var dataObj = {}, accntObj = {};
        if($.isPlainObject(pObject)) {
            dataObj = pObject;
        }
		if($.isPlainObject(aObject)) {
            accntObj = aObject;
			if (accntObj['companyWebsite']) {
				// exists and is not falsy (len > 0)
				if(!accntObj['companyWebsite'].match(new RegExp("^http[s]?:\\/\\/"))) {
					accntObj['companyWebsite'] = accntObj['companyWebsite'].replace(/^/, "http://");
				}
			}
        }

        var action = 'personalize';
        var callbacks = [];

        var stringIsEmail = function(email) {
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
        };

        var methods = {
            personalize: function() {

                if('code' in dataObj) {
                    applyData(this, ixes.profileDataClassPrefix, {purlCode: dataObj.code});
                }
                if('profile' in dataObj) {
                    applyData(this, ixes.profileDataClassPrefix, dataObj.profile);
                }

                if('records' in dataObj) {
                    for(var recordName in dataObj.records) {
                        if(dataObj.records.hasOwnProperty(recordName)) {
                            applyData(this, ixes.recordDataClassPrefix+'-'+recordName, dataObj.records[recordName]);
                            applyData(this, ixes.recordDataClassPrefix+'_'+recordName, dataObj.records[recordName]);
                        }
                    }
                }

                if('attributes' in dataObj) {
                    applyData(this, ixes.attributeDataClassPrefix, dataObj.attributes);
                }

                if('links' in dataObj) {
                    applyData(this, ixes.profileDataClassPrefix+"-links", dataObj.links);
                }

                if('association' in dataObj) {
                    if('code' in dataObj.association) {
                        applyData(this, ixes.associationDataClassPrefix, {purlCode: dataObj.association.code});
                    }
                    if('profile' in dataObj.association) {
                        applyData(this, ixes.associationDataClassPrefix, dataObj.association.profile);
                    }
                }

                if('referrer' in dataObj) {
                    if('code' in dataObj.referrer) {
                        applyData(this, ixes.referrerDataClassPrefix, {purlCode: dataObj.referrer.code});
                    }
                    if('profile' in dataObj.referrer) {
                        applyData(this, ixes.referrerDataClassPrefix, dataObj.referrer.profile);
                    }
                }

				applyData(this, ixes.companyDataClassPrefix, accntObj, true);

                callbacks.forEach(function(cb) {
                    cb.call(this);
                });
            },
            templatize: function() {

                unapplyData(this);

                callbacks.forEach(function(cb) {
                    cb.call(this);
                });
            }
        };

        for(x=0;x<arguments.length;x++) {
            if(typeof arguments[x] == 'function' && $.isFunction(arguments[x])) {
                callbacks[x] = arguments[x];
            }
            if(typeof arguments[x] == 'string' && $.isString(arguments[x])) {
                if(methods.hasOwnProperty(arguments[x])) {
                    action = arguments[x];
                }
            }
            if(typeof arguments[x] == 'object' && $.isPlainObject(arguments[x])) {
                dataObj = arguments[x];
            }
        }

        var ixes = {
            profileDataClassPrefix:			'phProfileData',
            recordDataClassPrefix:		'phRecordData',
            attributeDataClassPrefix:		'phAttributeData',
            referralDataClassPrefix:		'phReferralData',
            associationDataClassPrefix:	'phAssociatedData',
            referrerDataClassPrefix:		'phReferrerData',
			companyDataClassPrefix:		'tsCompanyData'
        };

        var applyData = function(node, prefix, data, noUnApply) {
            var DOM = $(node);
            var querySelector = '';
            if($.isString(prefix) && $.isPlainObject(data)) {
                for(var p in data) {
                    if(data.hasOwnProperty(p) && (data[p]+'').length) {
                        querySelector = '.'+prefix+'-'+p+', .'+prefix+'_'+p;
                        $(querySelector, DOM).each(function(idx, ele){
                            var tag = ele.tagName.toLowerCase();
                            switch(tag) {
                                case 'input':
                                    var type = $(this).attr('type');
                                    switch(type.toLowerCase()) {
                                        case 'button':
                                        case 'file':
                                        case 'image':
                                        case 'submit':
                                            break;
                                        case 'radio':
                                            if($(this).attr('value') === data[p]) {
												if (!noUnApply) {
													$(this).attr('data-ph-default', $(this).attr('checked'));
												}
                                                $(this).attr('checked', true);
                                            }
                                            break;
                                        case 'checkbox':
                                            var items = data[p].split(",");
                                            for(var i in items) {
                                                if(items.hasOwnProperty(i) && (items[i])) {
                                                    if($(this).attr('value') === items[i]) {
														if (!noUnApply) {
															$(this).attr('data-ph-default', $(this).attr('checked'));
														}
                                                        $(this).attr('checked', true);
                                                    }
                                                }
                                            }
                                            break;
                                        default:
											if (!noUnApply) {
												$(this).attr('data-ph-default', $(this).attr('value'));
											}
                                            $(this).attr('value', data[p]);
                                    }
                                    break;
                                case 'select':
									if (!noUnApply) {
										$(this).attr('data-ph-default', $(this).attr('selected'));
									}
                                    $('OPTION', this).attr('selected', false);
                                    $('OPTION[value="'+data[p]+'"]', this).attr('selected', true);
                                  break;
                                case 'textarea':
									if (!noUnApply) {
										$(this).attr('data-ph-default', $(this).attr('value'));
									}
                                    $(this).attr('value', data[p]);
                                    break;
                                case 'img':
									if (!noUnApply) {
										$(this).attr('data-ph-default', $(this).attr('src'));
									}
                                    $(this).attr('src', data[p]);
                                    break;
                                case 'a':
									if (!noUnApply) {
										$(this).attr('data-ph-default', $(this).attr('href'));
									}
                                    if(stringIsEmail(data[p])) {
                                        $(this).attr('href', 'mailto:'+data[p]);
                                    } else {
                                        $(this).attr('href', data[p]);
                                    }
                                    break;
                                default:
									if (!noUnApply) {
										$(this).attr('data-ph-default', $(this).text());
									}
                                    $(this).text(data[p]);
                            }
							$(this).addClass('phRendered');
                        });
                    }
                }
            }
        };

        var unapplyData = function(node) {
            var DOM = $(node);
            var querySelector = '';
            for(classNamePrefix in ixes) {
                if(ixes.hasOwnProperty(classNamePrefix)) {
                    querySelector += '[class^='+ixes[classNamePrefix]+'][data-ph-default], ';
                }
            }
            querySelector = querySelector.replace(/, $/, "");
            $(querySelector, DOM).each(function(idx, ele){
                var tag = ele.tagName.toLowerCase();
                switch(tag) {
                    case 'input':
                        var type = $(this).attr('type');
                        switch(type.toLowerCase()) {
                            case 'radio':
                            case 'checkbox':
                                $(this).attr('checked', $(this).attr('data-ph-default'));
                                $(this).removeAttr('data-ph-default');
                                break;
                            default:
                                $(this).attr('value', $(this).attr('data-ph-default'));
                                $(this).removeAttr('data-ph-default');
                        }
                        break;
                    case 'option':
                        $(this).attr('selected', $(this).attr('data-ph-default'));
                        $(this).removeAttr('data-ph-default');
                      break;
                    case 'textarea':
                        $(this).attr('value', $(this).attr('data-ph-default'));
                        $(this).removeAttr('data-ph-default');
                        break;
                    case 'img':
                        $(this).attr('src', $(this).attr('data-ph-default'));
                        $(this).removeAttr('data-ph-default');
                        break;
                    case 'a':
                        $(this).attr('href', $(this).attr('data-ph-default'));
                        $(this).removeAttr('data-ph-default');
                        break;
                    default:
                        $(this).text($(this).attr('data-ph-default'));
                        $(this).removeAttr('data-ph-default');
                }
				$(this).removeClass('phRendered');
            });
        };

        // maintain chainability
        return this.each(function(){
            methods[action].call(this);
        });

    };

})( jQuery );


(function( $ ){
    $.isString = function(o) {
        return typeof o == "string" || (typeof o == "object" && o.constructor === String);
    };
})( jQuery );
