Polymer({

  is: 'todo-footer',

  behaviors: [
    UniFlow.ActionEmitter,
    UniFlow.StateAware
  ],

  properties: {
    filterBy: String,
    completedCount: {
      type: Number,
      computed: 'getCompletedCount(state.todoList.length, state.activeCount)'
    }
  },

  isEqual(val1, val2) {
    return val1 == val2;
  },

  getCompletedCount(totalCount, activeCount) {
    return totalCount - activeCount;
  },

  onClearCompletedButtonTap() {
    this.emitAction({
      type: todo.actions.CLEAR_COMPLETED
    })
  },

});