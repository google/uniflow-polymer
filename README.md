# UniFlow for Polymer

Set of behaviors to enable uni-directional data flow in Polymer application.

**Important!**

*This library was developed as part of internal project at Google and isn't directly affiliated with the Polymer project (although Polymer team has provided some good feedback on UniFlow implementation).*

## History & Overview

When you start working on a new Polymer application, it's easy to start and build the first few elements, and make them communicate via events and data binding, so everything looks nice and rosy. However, as the number and complexity of elements grows, it becomes increasingly difficult to manage relationships between them, trace where/when the data changes happened, and debug the problems. So this project started as an attempt by our team at Google to find a good way to architect large Polymer application. 

Inspired by React's community Flux (and, later, Redux) architecture, we implemented a unidirectional data flow pattern (data down, events up) for Polymer. We found that when using UniFlow application code becomes more streamlined (e.g. it is clear what the responsibilities of each element are) and much easier to manage; the code has fewer bugs, and debugging is a lot more efficient. Adding new functionality no longer exponentially increases complexity.

This project was also inspired by Backbone Marionette. Backbone.js back in the days of its glory was a great library that provided a nice set of building blocks for building JavaScript applications. However, it left much of the application design, architecture and scalability to the developer, including memory management, view management, and more. Marionette brought an application architecture to Backbone, along with built in view management and memory management. It was designed to be a lightweight and flexible library of tools that sits on top of Backbone, providing the framework for building a scalable application. Uniflow strives to achieve similar goal for Polymer. 

We feel that Polymer, and web components in general, is a great concept that takes interoperability and encapsulation in Web development to the next level. But it lacked the patterns for building large and complex applications, and this is the void we expect UniFlow to fill. It is still in beta, so breaking changes may be happening before the first release. However, we believe that abstractions implemented in the library can be useful for Polymer community, so we encourage people to try, fork, ask questions, send  comments, and submit pull requests.

## Applicability

This library implements the architectural pattern called 'unidirectional data flow'. It works best if application logic involves complicated data management, when multiple elements need to have access to or modify the same data. Even though the pattern can be implemented just using built-in Polymer concepts, such as custom events and data binding, the UniFlow library provides a useful set of tools and abstractions, and helps to structure application code.

## Implementation

UniFlow is implemented as a set of behaviors that developers assign to their elements. It is assumed that each application has a singleton application element that maintains state of entire application. Each element that needs access to the data is bound, directly or indirectly, to sub-tree of application state tree. Two way data binding is never used to send data up, from child to parent, so only parent elements send data to children using one way data binding. Child elements, in turn, send the events (emit actions) responding to user actions, indicating that the data may need to be modified. Special non-visual elements called action dispatchers mutate the data, then all elements listening to the data changes render new data. 

# API Documentation

## Action Dispatcher

Use UniFlow.ActionDispatcher for non-visual elements that process actions emitted by visual
elements. Action dispatchers usually placed at the application level. Each action dispatcher
element gets a chance to process the action in the order the elements are present in the
DOM tree. It is important that action dispatcher elements get two-way data binding to
application state as follows:

   <action-dispatcher state="{{state}}"></action-dispatcher>

Action dispatcher elements can include nested action dispatchers, so you can have a
hierarchical organization of action dispatchers.

### Example:

#### HTML:
```html
<dom-module id="parent-dispatcher">
<template>
  <child-dispatcher-a state="{{state}}"></child-dispatcher-a>
  <child-dispatcher-b state="{{state}}"></child-dispatcher-b>
</template>
</dom-module>
```

#### JavaScript:

```javascript
Polymer({
  is: 'parent-dispatcher',
  
  behaviors: [
   UniFlow.ActionDispatcher
  ],
  
  MY_ACTION(detail) {
   // do MY_ACTION processing here
   // return false if you want to prevent other action dispatchers from
   // further processing of this action
  };
});
```

## Action Emitter

Whenever element needs to emit an action, this behavior should be used. Action object must always include type property.

## Application State

Assign this behavior to your main application element. It provides global
state and functionality to maintain individual elements states. This behavior
is responsible for notifying all state-aware elements about their state
changes (provided those elements have `statePath` property defined).
Only one element in the application is supposed to have this behavior.

### Example:

#### HTML:
```html
<template>
  <!-- action dispatchers in the order of action processing -->
  <action-dispatcher-a state="{{state}}"></action-dispatcher-a>
  <action-dispatcher-b state="{{state}}"></action-dispatcher-b>
  
  <!-- state-aware elements -->
  <some-element state-path="state.someElement"></some-element>
</template>
```
#### JavaScript:

```javascript
Polymer({
  is: 'my-app',

  behaviors: [
    UniFlow.ApplicationState
  ],

  attached() {
    this.state = {
      someElement: {}
    }
  }
});
```

In the example above, `<some-element>` will receive notification of any changes to the state,
as if it was declared as follows:

```html
<some-element state="[[state]]"></some-element>
```

Also, if `<some-element>` has `propertyA`, on element attach this property will be assigned
the value of `state.someElement.propertyA`, and receive all notification of the property change
whenever the corresponding data in state tree changes. This essentially translates to following
declaration:

```html
<some-element state="[[state]]"
              propertyA="[[state.someElement.propertyA]]">
</some-element>
```

Note that data binding is one-way in both cases. Although state-aware elements can modify their
own state, it is considered their private state and no other elements will be notified of those
changes.

## List View

This behavior used by elements that need to render multiple models backed
by 'list' array. You may want to use ModelView to render individual
models in the list. The behavior supports element selection by setting predefined
$selected property on list elements.

### Example:

#### HTML:

```html
<ul>
  <template id="list-template" is="dom-repeat" items="[[list]]">
    <li id="[[item.id]]">
      <paper-checkbox checked="{{item.$selected}}">
      <model-view state-path="[[statePath]].list.#[[index]]"></model-view>
    </li>
  </template>
</ul>
Selected: [[selectedCount]] items
<paper-button on-tap="onDeleteTap">Delete</paper-button>
```

#### JavaScript:

```javascript
Polymer({

  is: "list-element",

  behaviors: [
    UniFlow.ListView,
    UniFlow.StateAware
  ],

  onDeleteTap() {
    this.deleteSelected();
  }

});
```

In the example above list view element is also state-aware, meaning it has its own place
in the application state tree. Assuming it has been declared as follows:

```html
<list-element state-path="state.listElement"></list-element>
```

it will be rendering `state.listElement.list` and observing changes to it. Each `model-view`
within dom-repeat template will have `state-path` property  set to
`state.listElement.list.#<index>`  where `index` is the element's index in the array.

## Model View

Element rendering data represented by a single object (model) in the
application state should use ModelView behavior. Model View is a powerful
concept that encapsulates model data (likely the data received from the
server and to be persisted to the server if modified as a result of user
actions), status (validity of the data, flag that data was modified,
notifications for the user, etc.). Auxiliary data supplied by action
dispatchers and needed for display purposes or element's logic
should be defined as element’s properties. Same applies to data
created/modified by the element but not intended to be persisted.
If `StateAware` behavior is used along with `ModelView`, you can take advantage
of statePath property that indicates path to the element's state in the
application state tree. Whenever any data is mutated by action dispatchers
at statePath or below, the element will receive notification of its
properties' change (even if there is no explicit binding for those
properties). See `UniFlow.StateAware` for more details and example.
ModelView behavior defines some properties that are intended to be overridden
in the elements:

+ `validation` property allows to specify validation rules
that will be applied when validateModel() method is called. As a result of
this method validation status will be updated to indicate result for each
model field that has validation rule associated with it.
+ `saveAction` property indicates which action should be emitted when
saveModel method is called to perform save of the model.
+ `getMessage` should be overridden with the function returning message
string for given error code (to translate validation error code to message)


### Example:

#### HTML:

```html
<template>
 Model: [[model.id]]
 <paper-input value="{{model.name}}"
              label="Name"
              invalid="[[status.validation.name.invalid]]"
              error-message="[[status.validation.name.errorMessage]]">
 </paper-input>
 <paper-button on-tap="onSaveTap">Save</paper-button>
</template>
```

#### JavaScript:

```javascript
Polymer({
  is: "my-model",
  saveAction: 'MY_SAVE',
  behaviors: [
   UniFlow.ModelView
  ],
  
  validation: {
   name: (value) => {
     if (!value || !value.trim()) {
       return 'Name is not specified';
     }
   }
  },
  
  attached() {
   this.fetchData();
  },
  
  fetchData() {
   this.emitAction({
     type: 'MY_FETCH',
     path: 'model'
   });
  },
  
  onSaveTap() {
   this.validateAndSave();
  }
});
```

In the example above model view has input field for `name` property and Save button. On
element attach the action is emitted to fetch the model's data. Note that in `emitAction()` method
the path is specified as `'model'`. ActionEmitter behavior is responsible of expanding the path
with element's state path, ensuring that when action dispatcher gets to process the action, the
path contains full path in the state tree. So assuming that `my-model` is declared as follows:

```html
<my-model state-path="state.myModel"></my-model>
```

the path in `MY_FETCH` action gets expanded to `state.myModel.model`.

`validation` property is an object that contains methods for fields validation. The keys in
this object should match model field names, the values are validation methods. Method receives
current value of the field and should return non-falsy value (string or error code) if the value
of the field didn't pass validation. `status.validation` object will be populated with the results
of validation with the keys matching field names and values being objects containing two fields:
- `invalid`: true when the value is not valid
- `errorMessage`: the message to show to user


So in the example above if user clicks on Save button with name not entered, they will get
'Name is not specified' error message on the input element. When the name is non-empty, validation
will pass and `MY_SAVE` action will be emitted with model passed as a parameter and `'model'` as
path.

## State Aware

 Key behavior that must be assigned to all elements that need to access
 application state and/or have access to the application element. The element is
 notified of any changes to application's state, as well as all its properties
 when they're modified by state mutator elements. `state-path` property must
 be used to identify path to element's state in application state tree. 


### Example:

#### HTML:

```html
<template>
 <div>Value A: [[state.valueA]]</div>
 <div>Value B: [[valueB]]</div>
</template>
```

#### JavaScript:

```javascript
Polymer({
  is: 'my-element',
  
  properties: {
    valueB: String
  },
  
  behaviors: [
    UniFlow.StateAware
  ]
});
```

When above element is declared as follows:

```html
<my-element state-path="state.myElement"></my-element>
```

it will be notified about changes (and render those) to `state.valueA` or
`state.myElement.valueB` in action dispatchers or other state mutating
elements.

## State Mutator

Some non-visual elements, like action dispatchers, need to modify application
state, in which case they should have this behavior assigned. Implements state-
aware and re-declares state property with notify attribute. State mutator elements
are only supposed to exist at the application level.

