Polymer({

  is: 'todo-action-dispatcher',

  behaviors: [
    UniFlow.ActionDispatcher,
    UniFlow.ActionEmitter
  ],

  _updateAllCompleted() {
    if (this.get('state.todoList') && this.get('state.todoList').length) {
      this.set('state.allCompleted',
               this.get('state.todoList').every((item) => item.completed));
    } else {
      this.set('state.allCompleted', false);
    }
  },

  _updateActiveCount() {
    this.set('state.activeCount', this.get('state.todoList').
        reduce((count, todoItem) => count + (todoItem.completed ? 0 : 1), 0));
  },

  [todo.actions.INIT_APPLICATION](details) {
    this._updateAllCompleted();
    this._updateActiveCount();
  },

  [todo.actions.ADD_TODO](details) {
    this.push('state.todoList', {
      text: details.text,
      completed: false
    });
    this._updateAllCompleted();
  },

  [todo.actions.UPDATE_TODO](details) {
    let index = this.get('state.todoList').indexOf(details.model);
    this.set(['state.todoList', index, 'text'], details.text);
  },

  [todo.actions.REMOVE_TODO](details) {
    this.arrayDelete('state.todoList', details.model);
    this._updateAllCompleted();
    this._updateActiveCount();
  },

  [todo.actions.SELECTION_CHANGED](details) {
    if (details.applyToAll) {
      this.set('state.allCompleted', details.value);
      this.get('state.todoList').forEach((item, index) => {
        this.set(['state.todoList', index, 'completed'],
                 details.value);
      });
    } else {
      if (details.model) {
        let index = this.get('state.todoList').indexOf(details.model);
        this.set(['state.todoList', index, 'completed'], details.completed);
      }
      this._updateAllCompleted();
    }
    this._updateActiveCount();
  },

  [todo.actions.CLEAR_COMPLETED](details) {
    let completed = this.get('state.todoList').filter(
        elem => elem.completed);
    completed.forEach(elem => {
      this.arrayDelete('state.todoList', elem);
    });
    this._updateAllCompleted();
  }

});
