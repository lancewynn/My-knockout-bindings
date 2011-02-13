ko.bindingHandlers.dataContext = {
	init: function (element, valueAccessor) {
		element = $(element);
		var config = {
			template: element.html()
		};
		element.data('dataContext.config', config);
		// Why reset data-bind attributes? Because the point of this
		// binding is so that nested bindings apply to the value, not
		// to the current model. This prevents Knockout from continuing
		// to apply the current model to nested elements. Remember, the
		// nested bindings are still captured by `config.template` above.
		element.find('[data-bind]').attr('data-bind', '');

	},
	update: function (element, valueAccessor) {
		element = $(element)
		var config = element.data('dataContext.config');
		var value = ko.utils.unwrapObservable(valueAccessor());
		if (value) {
			element.html(config.template);
			// Only bind the new model to child elements, not the current
			// element, so that other binding handlers on the current
			// element continue to work.
			var children = element.children();
			for (var i = 0; i < children.length; i++) {
				ko.applyBindings(value, children[i]);
			}
			element.show();
		}
		else {
			element.hide().empty();
		}
	}
};

ko.bindingHandlers.each = {
	init: function (element, valueAccessor) {
		element = $(element);

		var value = valueAccessor();
		var config = {
			template: element.html()
		};
 
 		element.data('each.config', config);

		// Why reset data-bind attributes? Because the point of this
		// binding is so that nested bindings apply to the value, not
		// to the current model. This prevents Knockout from continuing
		// to apply the current model to nested elements. Remember, the
		// nested bindings are still captured by `config.template` above.
		element.find('[data-bind]').attr('data-bind', '');
		
		// Why define and subscribe to update here instead of defining update
		// on the binding handler? For some reason, the latter doesn't get
		// along with the current testing environment, making it untestable.
		var update = function (value) {

		} .bind(config);


		if (value && ko.isSubscribable(value)) {
			value.subscribe(update);
			update(value());
		}
		else {
			update(value);
		}
	},
	update: function (element, valueAccessor) {
		element = $(element);
		var config = element.data('each.config');
		value = ko.utils.unwrapObservable(valueAccessor());

		//if the value has a templateId specified, then use it's html...
		if (value.templateId) {
			var templateHtml = $("#" + value.templateId).html();
			config.template = templateHtml;
			value = value.data;
		}

		element.html(''); //clear out the element html so we can replace it with the template list.
		if (value) {
			value = ko.utils.unwrapObservable(value);
			for (idx in value) {
				var item = value[idx];
				if (typeof (item) != "object") {
					//if the values in the array are simple types, not objects then we need to 
					//set it as an object to allow us to bind to it.
					item = { value: item };
				}
				var listItemContainer = $(config.template);
				//this.element.html(this.template);
				// Only bind the new model to child elements, not the current
				// element, so that other binding handlers on the current
				// element continue to work.

				for (var i = 0; i < listItemContainer.length; i++) {
					ko.applyBindings(item, listItemContainer[i]);
					element.append($(listItemContainer[i]));
				}
			}
			element.show();
		}
		else {
			element.hide().empty();
		}
	}
};


ko.bindingHandlers.foreach = {
	init: function (element, valueAccessor) {
		element = $(element);

		var value = valueAccessor();
		var config = {
			template: element.html()
		};

		element.data('foreach.config', config);

		// Why reset data-bind attributes? Because the point of this
		// binding is so that nested bindings apply to the value, not
		// to the current model. This prevents Knockout from continuing
		// to apply the current model to nested elements. Remember, the
		// nested bindings are still captured by `config.template` above.
		element.find('[data-bind]').attr('data-bind', '');

		// Why define and subscribe to update here instead of defining update
		// on the binding handler? For some reason, the latter doesn't get
		// along with the current testing environment, making it untestable.
		var update = function (value) {

		} .bind(config);


		if (value && ko.isSubscribable(value)) {
			value.subscribe(update);
			update(value());
		}
		else {
			update(value);
		}
	},
	update: function (element, valueAccessor) {
		element = $(element);
		var config = element.data('foreach.config');
		value = ko.utils.unwrapObservable(valueAccessor());

		//if the value has a templateId specified, then use it's html...
		if (value.templateId) {
			var templateHtml = $("#" + value.templateId).html();
			config.template = templateHtml;
			value = value.data;
		}

		element.html(''); //clear out the element html so we can replace it with the template list.
		if (value) {
			value = ko.utils.unwrapObservable(value);
			for (idx in value) {
				var item = {
					value: value[idx],
					data: value,
					index: idx
				}

				var listItemContainer = $(config.template);
				//this.element.html(this.template);
				// Only bind the new model to child elements, not the current
				// element, so that other binding handlers on the current
				// element continue to work.

				for (var i = 0; i < listItemContainer.length; i++) {
					ko.applyBindings(item, listItemContainer[i]);
					element.append($(listItemContainer[i]));
				}
			}
			element.show();
		}
		else {
			element.hide().empty();
		}
	}
};

ko.bindingHandlers.dynamicDataContext = {
	init: function (element, valueAccessor, allBindingAccessors, viewModel) {
		element = $(element);
		var config = {
			template: element.html()
		};

		var propertyName = valueAccessor();
		//value will be a string representing the property of the viewmodel to dynamically bind to.
		//if the property is undefined, then we create it as an observable, this way if later on the model becomes 
		//available, we can handle it.
		if (!viewModel[propertyName]) {
			viewModel[propertyName] = ko.observable();
		}

		element.data('dynamicDataContext.config', config);
		// Why reset data-bind attributes? Because the point of this
		// binding is so that nested bindings apply to the value, not
		// to the current model. This prevents Knockout from continuing
		// to apply the current model to nested elements. Remember, the
		// nested bindings are still captured by `config.template` above.
		element.find('[data-bind]').attr('data-bind', '');

	},
	update: function (element, valueAccessor, allBindingAccessors, viewModel) {
		element = $(element)
		var config = element.data('dynamicDataContext.config');
		var propertyName = ko.utils.unwrapObservable(valueAccessor());
		var value = ko.utils.unwrapObservable(viewModel[propertyName]);
		if (value) {
			element.html(config.template);
			// Only bind the new model to child elements, not the current
			// element, so that other binding handlers on the current
			// element continue to work.
			var children = element.children();
			for (var i = 0; i < children.length; i++) {
				ko.applyBindings(value, children[i]);
			}
			element.show();
		}
		else {
			element.hide().empty();
		}
	}
};