Polymer({

  is: 'todo-items',

  behaviors: [
    UniFlow.ListView,
  ],

  filterList(filterBy) {
    return function(item) {
      switch (filterBy) {
        case 'active': return !item.completed;
        case 'completed': return item.completed;
        default: return true;
      }
    };
  }

});
