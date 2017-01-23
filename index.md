---
layout: default
title: UniFlow for Polymer - Main Page
---
## History & Overview

When you start working on a new Polymer application, it's easy to start and build the first few elements, and make them communicate via events and data binding, so everything looks nice and rosy. However, as the number and complexity of elements grows, it becomes increasingly difficult to manage relationships between them, trace where/when the data changes happened, and debug the problems. So this project started as an attempt by our team at Google to find a good way to architect large Polymer application.

[more...](overview.html)

## Applicability

This library implements the architectural pattern called 'unidirectional data flow'. It works best if application logic involves complicated data management, when multiple elements need to have access to or modify the same data. Even though the pattern can be implemented just using built-in Polymer concepts, such as custom events and data binding, the UniFlow library provides a useful set of tools and abstractions, and helps to structure application code.

## Implementation

UniFlow is implemented as a set of behaviors that developers assign to their elements. It is assumed that each application has a singleton application element that maintains state of entire application. Each element that needs access to the data is bound, directly or indirectly, to sub-tree of application state tree. Two way data binding is never used to send data up, from child to parent, so only parent elements send data to children using one way data binding. Child elements, in turn, send the events (emit actions) responding to user actions, indicating that the data may need to be modified. Special non-visual elements called action dispatchers mutate the data, then all elements listening to the data changes render new data.

## API Documentation

[Application State](components/uniflow-polymer/#UniFlow.ApplicationState)

[State-Aware](components/uniflow-polymer/#UniFlow.StateAware)

[Action Emitter](components/uniflow-polymer/#UniFlow.ActionEmitter)

[State Mutator](components/uniflow-polymer/#UniFlow.StateMutator)

[Action Dispatcher](components/uniflow-polymer/#UniFlow.ActionDispatcher)

[Model View](components/uniflow-polymer/#UniFlow.ModelView)

[List View](components/uniflow-polymer/#UniFlow.ListView)
