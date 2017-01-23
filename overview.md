---
layout: default
title: UniFlow for Polymer - Main Page
---

## Overview

When you start working on a new Polymer application, it's easy to start and build the first few elements, and make them communicate via events and data binding, so everything looks nice and rosy. However, as the number and complexity of elements grows, it becomes increasingly difficult to manage relationships between them, trace where/when the data changes happened, and debug the problems. So this project started as an attempt by our team at Google to find a good way to architect large Polymer application.

Inspired by React's community Flux (and, later, Redux) architecture, we implemented a unidirectional data flow pattern (data down, events up) for Polymer. We found that when using UniFlow application code becomes more streamlined (e.g. it is clear what the responsibilities of each element are) and much easier to manage; the code has fewer bugs, and debugging is a lot more efficient. Adding new functionality no longer exponentially increases complexity.

This project was also inspired by Backbone Marionette. Backbone.js back in the days of its glory was a great library that provided a nice set of building blocks for building JavaScript applications. However, it left much of the application design, architecture and scalability to the developer, including memory management, view management, and more. Marionette brought an application architecture to Backbone, along with built in view management and memory management. It was designed to be a lightweight and flexible library of tools that sits on top of Backbone, providing the framework for building a scalable application. Uniflow strives to achieve similar goal for Polymer.

We feel that Polymer, and web components in general, is a great concept that takes interoperability and encapsulation in Web development to the next level. But it lacked the patterns for building large and complex applications, and this is the void we expect UniFlow to fill. It is still in beta, so breaking changes may be happening before the first release. However, we believe that abstractions implemented in the library can be useful for Polymer community, so we encourage people to try, fork, ask questions, send comments, and submit pull requests.