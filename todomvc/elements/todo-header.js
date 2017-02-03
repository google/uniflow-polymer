
Polymer({

  is: 'todo-header',

  behaviors: [
    UniFlow.ActionEmitter,
    UniFlow.StateAware
  ],

  properties: {
    todoText: String
  },

  onInputKeyDown(e) {
    if (e.keyCode == 13 && this.todoText.trim().length) {
      this.emitAction({
        type: todo.actions.ADD_TODO,
        text: this.todoText
      });
      this.todoText = '';
    }
  },

  onAllCompletedChange(event) {
    this.emitAction({
      type: todo.actions.SELECTION_CHANGED,
      applyToAll: true,
      value: event.target.checked
    })
  },

});