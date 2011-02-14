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

ko.bindingHandlers.pagedArray = {
	init: function (element, valueAccessor, allBindingAccessors) {

		element = $(element);
		var value = valueAccessor();
		
		var options;
		if (allBindingAccessors().pagedArrayOptions) {
			options = ko.utils.unwrapObservable(allBindingAccessors().pagedArrayOptions);
		}
		
		attachPagedArrayBehavior(value, element, options);

		var itemTemplate = element.find("[data-template=itemTemplate]").html();
		element.find("[data-template=itemTemplate] [data-bind]").attr('data-bind', '');
		element.find("[data-template=itemTemplate]").html('');

		var config = {
			template: element.html(),
			itemTemplate: itemTemplate

		};

		element.data('each.config', config);

		// Why reset data-bind attributes? Because the point of this
		// binding is so that nested bindings apply to the value, not
		// to the current model. This prevents Knockout from continuing
		// to apply the current model to nested elements. Remember, the
		// nested bindings are still captured by `config.template` above.
		element.find('[data-bind]').attr('data-bind', '');
	},
	update: function (element, valueAccessor, allbindingAccessor, viewModel) {
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
			var pagedArray = element.data('pagedArray');
			//wireup the overall element to bind to the view model, the iterated items, and pager will bind later.
			element.hide();
			element.html(config.template);
			for (var i = 0; i < element.children().length; i++) {
				ko.applyBindings(pagedArray, element.children()[i]);
			}

			//Create the container paged list, and bind it up. we will populate the children in the loop below
			for (idx in pagedArray.currentPageItems()) {
				var item = pagedArray.currentPageItems()[idx];
				if (item) {
					if (typeof (item) != "object") {
						//if the values in the array are simple types, not objects then we need to 
						//set it as an object to allow us to bind to it.
						item = { value: item };
					}
					var listContainer = element.find("[data-template=itemTemplate]");

					var listItemTemplate = $(config.itemTemplate);
					//this.element.html(this.template);
					// Only bind the new model to child elements, not the current
					// element, so that other binding handlers on the current
					// element continue to work.
					for (var i = 0; i < listItemTemplate.length; i++) {
						ko.applyBindings(item, listItemTemplate[i]);
						listContainer.append($(listItemTemplate[i]));
					}
				}
			}

			element.show();
		}
		else {
			element.hide().empty();
		}
	}
};


function attachPagedArrayBehavior(array, element, options) {
	model = ko.utils.unwrapObservable(array);
	var pagedArrayViewModel = {
		actualPage: ko.observable(),
		itemsPerPage: ko.observable(),
		nearbyPageRange: ko.observable(),
		array: array
	}

	defaultOptions = {
		itemsPerPage:10,
		startPage:1,
		nearbyPageRange:5
	}

	$.extend(defaultOptions, options)

	if (defaultOptions.itemsPerPage) {
		pagedArrayViewModel.itemsPerPage(ko.utils.unwrapObservable(defaultOptions.itemsPerPage));
	};

	if (defaultOptions.startPage) {
		pagedArrayViewModel.actualPage(ko.utils.unwrapObservable(defaultOptions.startPage));
	};

	if (defaultOptions.nearbyPageRange) {
		pagedArrayViewModel.nearbyPageRange(ko.utils.unwrapObservable(defaultOptions.nearbyPageRange));
	}

	pagedArrayViewModel.pageCount = ko.dependentObservable(function () {
		var length = ko.utils.unwrapObservable(array).length;
		var pageCount = length / this.itemsPerPage();
		if (parseInt(pageCount) != pageCount) {
			pageCount = parseInt(pageCount) + 1;
		}
		return pageCount;
	}, pagedArrayViewModel);

	pagedArrayViewModel.page = ko.dependentObservable({
		read: function () {
			return pagedArrayViewModel.actualPage();
		},
		write: function (value) {
			if (value <= pagedArrayViewModel.pageCount()) {
				pagedArrayViewModel.actualPage(value);
			}
		}
	}, pagedArrayViewModel);

	pagedArrayViewModel.getPageItems = function (pageNumber) {
		var currentItemsPerPage = this.itemsPerPage();
		//if the requested page > the page count, set page to the last page.
		if (pageNumber > this.pageCount()) {
			this.page(this.pageCount());
		}

		var currentPage = pageNumber;
		var length = ko.utils.unwrapObservable(array).length;

		var currentStartingIdx = (parseInt(currentPage) - 1) * (parseInt(currentItemsPerPage));

		var currentEndIdx = currentStartingIdx + parseInt(currentItemsPerPage) <= length ? currentStartingIdx + parseInt(currentItemsPerPage) : length

		return array.slice(currentStartingIdx, currentEndIdx);
	};

	pagedArrayViewModel.nearbyPages = ko.dependentObservable(function () {
		var pagesArray = []
		var minPage = parseInt(this.page()) - parseInt(this.nearbyPageRange());
		var maxPage = parseInt(this.page()) + parseInt(this.nearbyPageRange());

		if (minPage < 1) minPage = 1;
		if (maxPage > this.pageCount()) maxPage = this.pageCount();

		for (var i = minPage; i <= maxPage; i++) {
			pagesArray.push({
				pageNumber: i,
				currentPage: pagedArrayViewModel.page(),
				isCurrentPage: pagedArrayViewModel.page() == i,
				show: function () {
					pagedArrayViewModel.page(this.pageNumber);
				}
			});
		}
		return pagesArray;
	}, pagedArrayViewModel);

	

	pagedArrayViewModel.currentPageItems = ko.dependentObservable(function () {
		return this.getPageItems(this.page());
	}, pagedArrayViewModel);

	pagedArrayViewModel.hasNextPage = ko.dependentObservable(function () {
		return this.page() < this.pageCount();
	}, pagedArrayViewModel);

	pagedArrayViewModel.nextPage = function () {
		if (this.hasNextPage()) {
			this.page(this.page() + 1);
		}
	}

	pagedArrayViewModel.hasPreviousPage = ko.dependentObservable(function () {
		return this.page() > 1;
	}, pagedArrayViewModel);

	pagedArrayViewModel.previousPage = function () {
		if (this.hasPreviousPage()) {
			this.page(this.page() - 1);
		}
	};

	pagedArrayViewModel.lastPage = function () {
		this.page(this.pageCount());
	};

	pagedArrayViewModel.firstPage = function () {
		this.page(1);
	}

	element.data('pagedArray', pagedArrayViewModel);
};