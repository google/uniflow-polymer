Polymer({

  is: 'todo-item',

  behaviors: [
    UniFlow.ModelView
  ],

  properties: {
    filterBy: String,
    isEditing: {
      type: Boolean,
      value: false
    },
  },

  onCompletedChange(e) {
    this.emitAction({
      type: todo.actions.SELECTION_CHANGED,
      model: this.model,
      completed: e.target.checked
    });
  },

  _removeTodo() {
    this.emitAction({
      type: todo.actions.REMOVE_TODO,
      model: this.model
    });
  },

  onDestroyTap(e) {
    this._removeTodo();
  },

  onViewDblClick(e) {
    this.$['text-input'].value = this.model.text;
    this.isEditing = true;
    this.$['text-input'].focus();
  },

  onInputBlur(e) {
    if (this.isEditing) {
      this._confirmEdit();
    }
  },

  _confirmEdit() {
    this.emitAction({
      type: todo.actions.UPDATE_TODO,
      model: this.model,
      text: this.$['text-input'].value
    });
    this.isEditing = false;
    if (!this.model.text.trim()) { this._removeTodo(); }
  },

  onInputKeyDown(e) {
    if (e.keyCode == 13) {
      this.$['text-input'].blur();
    } else if (e.keyCode == 27) {
      this.isEditing = false;
    }
  },

});
