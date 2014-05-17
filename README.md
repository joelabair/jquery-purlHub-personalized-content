jquery-purlHub-personalized-content
===================================

Personalizes markup based on standard purlHub class flagging semantics. Ref: http://support.purlhub.com/customer/portal/articles/567040-personalizing-in-your-pages-integration-basics-

	
####Usage:
```jaascript
$('div.selector').phRender([ dataObj | method | callback ]);
```

####Example(s):
```javascript
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
}, function(ele){
  // ele = the html DOM node
  alert ('done');
});
```

####Arguments: (may be given in any order)
dataObj :: (object) An object containing personalization data structures in the following format.
```javascript
{
	code: 	"JoeSomebodyX1",
	profile:	{
		firstName:	"Joe",
		lastName:	"Somebody",
		email:		"joe@somewhere.org",
		// any shallow key: value pairs
		// ... 
	},
	records: {
		someRecordName: {
			keyName: "value",
			// any shallow {key: value} pairs
		  // ...
		}
	},
	attributes: {
		attrib1: "val1",
		// any shallow {key: value} pairs
	  // ...
	},
	links: {
		link1: "url1",
		// any shallow {key: value} pairs
	  // ...
	},
	association: {
		code: "",
		profile: {
			// any shallow {key: value} pairs
		  // ...
		}
	},
	referer: {
		code: "",
		profile: {
			// any shallow {key: value} pairs
		  // ...
		}
	}
}
```

####method :: (string) A plugin method to call
[ personalize, templatize ] default = personalize

* personalize = render text values by class name in standard purlHub fashion 
(i.e. phProfileData-firstName)
* templatize = strip rendered text and return the elements to their original 
ph class named state.

####callback :: (function) a callback function to call after method invocation
```javascript
function(ele) {
	alert('done');
}
```
