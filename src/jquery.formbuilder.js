/**
 * jQuery Form Builder
 * Written by Jack Franklin and Ben Everard
 * requires jQuery
 *
 * https://github.com/jackfranklin/jquery-form-builder
 **/


/**
 * sample JSON structure
 * var json = {
 *  "fields" : [
 *    {
 *      "name": "username",
 *      "type": "text",
 *      "validations": "min_length(5)"
 *    }
 *  ]
 *}
 *
 **/




(function(window) {
  var jFB = (function() {

    //store the form's JSON
    var formJson;

    //store each field in this array - quicker to store them all rather than keep grabbing JSON
    var formFields = {};

    var init = function(json) {
      try {
        formJson = JSON.parse(json)
      } catch (e) {
        throw new Error("JSON is not valid");
        return false;
      }
      return this;
    }

    var generate = function() {
      jsonItems = formJson.fields;
      //loop through all the fields
      for(var i = 0; i < jsonItems.length; i++) {
        var value = jsonItems[i];
        //now we have all the attributes, we can make an element out of this
        //store the element type (as in the HTML element)
        var fieldElement = value.element;
        //then delete it so the attributes object doesn't contain the HTML element
        delete value.element;
        //set up the formField object
        formFields[value.name] = {
          //give them a reference to the actual HTML
          html: $(document.createElement(fieldElement)).attr(value),
          //and all the attributes
          attributes: value
        };
      };
    }

    //returns the object for a form element, based off its name attribute
    //(not sure I like it being called fields - maybe "element" or "formField"
    var fields = function(name) {
      return formFields[name];
    };


    //TODO: only manages validations with just one parameter
    var validate = function(name, validations) {
      var field = formFields[name];
      console.log(field);
      if (!field) return false //if we dont have a field then just exist out of this one
      var vals = splitValidations(validations);
      //only one validation, no need to loop
      if(vals.length === 1) {
        //grab the validation which will be the first one
        var validation = vals[0];
        //to grab the method, split at a bracket and grab the bit before it
        var validationMethod = validations.split("(")[0];
        return validationMethods[validationMethod](field.html, extractParams(validation));


      } else { //multiple validations so need to loop or something
        //TODO implement
      }

    };


    var splitValidations = function(validations) {
      if(validations.indexOf("|") > -1) {
        return validations.split("|");
      } else {
        return [validations];
      }
    };

    var extractParams = function(validation) {
      //TODO must be a better way - regex to extract every thing within a bracket separated by a , - eg from (5, 4, 2) pull out [5,4,2]
      //this hacky solution only works for one parameter
      var params = validation.split("(");
      var param = params[1].split(")");
      return param[0];
    };

    //object that we store all the validations in - these are not passed to the API
    //TODO write some more of these and TEST (steal from CodeIgniter?)
    var validationMethods = {
      min_length: function(obj, x) {
        return $(obj).val().length > x;
      }
    }

    //TODO write method to let user write own validation methods


    //what we want to expose as the API
    return {
      init: init,
      generate: generate,
      fields: fields,
      validate: validate
    };
  })();

  window.FormBuilder = function(json) {
    return jFB.init(json);
  };

})(window);
