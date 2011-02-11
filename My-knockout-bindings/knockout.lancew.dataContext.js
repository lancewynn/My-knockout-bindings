//dataContext handler originally created by brian beck http://brianbeck.com as the bind handler.

ko.bindingHandlers.dataContext = {
	init: function (element, valueAccessor) {
		element = $(element);
		var config = {
			element: element,
			template: element.html()
		};
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
			if (value) {
				this.element.html(this.template);
				// Only bind the new model to child elements, not the current
				// element, so that other binding handlers on the current
				// element continue to work.
				var children = this.element.children();
				for (var i = 0; i < children.length; i++) {
					ko.applyBindings(value, children[i]);
				}
				this.element.show();
			}
			else {
				this.element.hide().empty();
			}
		} .bind(config);

		var value = valueAccessor();
		if (value && ko.isSubscribable(value)) {
			value.subscribe(update);
			update(value());
		}
		else {
			update(value);
		}
	}
};

ko.bindingHandlers.each = {
	init: function (element, valueAccessor) {
		element = $(element);


		var value = valueAccessor();
		var config = {
			element: element,
			template: element.html()
		};

		if (value.templateId) {
			var templateHtml = $("#" + value.templateId).html();
			config.template = templateHtml;
			value = value.data;
		} else {

			// Why reset data-bind attributes? Because the point of this
			// binding is so that nested bindings apply to the value, not
			// to the current model. This prevents Knockout from continuing
			// to apply the current model to nested elements. Remember, the
			// nested bindings are still captured by `config.template` above.
			element.find('[data-bind]').attr('data-bind', '');
		}
		// Why define and subscribe to update here instead of defining update
		// on the binding handler? For some reason, the latter doesn't get
		// along with the current testing environment, making it untestable.
		var update = function (value) {
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
					var listItemContainer = $(this.template);
					//this.element.html(this.template);
					// Only bind the new model to child elements, not the current
					// element, so that other binding handlers on the current
					// element continue to work.

					for (var i = 0; i < listItemContainer.length; i++) {
						element.append($(listItemContainer[i]));
						ko.applyBindings(item, listItemContainer[i]);
					}
				}
				this.element.show();
			}
			else {
				this.element.hide().empty();
			}
		} .bind(config);


		if (value && ko.isSubscribable(value)) {
			value.subscribe(update);
			update(value());
		}
		else {
			update(value);
		}
	}
};

ko.bindingHandlers.foreach = {
	init: function (element, valueAccessor) {
		element = $(element);


		var value = valueAccessor();
		var config = {
			element: element,
			template: element.html()
		};

		if (value.templateId) {
			var templateHtml = $("#" + value.templateId).html();
			config.template = templateHtml;
			value = value.data;
		} else {

			// Why reset data-bind attributes? Because the point of this
			// binding is so that nested bindings apply to the value, not
			// to the current model. This prevents Knockout from continuing
			// to apply the current model to nested elements. Remember, the
			// nested bindings are still captured by `config.template` above.
			element.find('[data-bind]').attr('data-bind', '');
		}
		// Why define and subscribe to update here instead of defining update
		// on the binding handler? For some reason, the latter doesn't get
		// along with the current testing environment, making it untestable.
		var update = function (value) {
			element.html(''); //clear out the element html so we can replace it with the template list.
			if (value) {
				value = ko.utils.unwrapObservable(value);
				for (idx in value) {
					var item = {
						value: value[idx],
						data: value,
						index: idx
					}

					var listItemContainer = $(this.template);
					//this.element.html(this.template);
					// Only bind the new model to child elements, not the current
					// element, so that other binding handlers on the current
					// element continue to work.

					for (var i = 0; i < listItemContainer.length; i++) {
						element.append($(listItemContainer[i]));
						ko.applyBindings(item, listItemContainer[i]);
					}
				}
				this.element.show();
			}
			else {
				this.element.hide().empty();
			}
		} .bind(config);


		if (value && ko.isSubscribable(value)) {
			value.subscribe(update);
			update(value());
		}
		else {
			update(value);
		}
	}
};

ko.bindingHandlers.dynamicDataContext = {
	init: function (element, valueAccessor, allBindingHandlers, viewModel) {
		element = $(element);
		var config = {
			element: element,
			template: element.html()
		};
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
			if (value) {
				this.element.html(this.template);
				// Only bind the new model to child elements, not the current
				// element, so that other binding handlers on the current
				// element continue to work.
				var children = this.element.children();
				for (var i = 0; i < children.length; i++) {
					ko.applyBindings(value, children[i]);
				}
				this.element.show();
			}
			else {
				this.element.hide().empty();
			}
		} .bind(config);

		var propertyName = valueAccessor();
		//value will be a string representing the property of the viewmodel to dynamically bind to.
		//if the property is undefined, then we create it as an observable, this way if later on the model becomes 
		//available, we can handle it.
		if (!viewModel[propertyName]) {
			viewModel[propertyName] = ko.observable();
		}

		var value = viewModel[propertyName];

		if (value && ko.isSubscribable(value)) {
			value.subscribe(update);
			update(value());
		}
		else {
			update(value);
		}
	}
};
