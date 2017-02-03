Polymer({

  is: 'todo-app',

  behaviors: [
    UniFlow.ActionEmitter,
    UniFlow.ApplicationState,
  ],

  properties: {
    route: Object,
    routeData: Object
  },

  ready() {
    this.set('state', {
      allCompleted: false,
      activeCount: 0
    });
  },

  onStorageLoadEmpty() {
    this.set('state.todoList', []);
  },

  onStorageLoad() {
    this.emitAction({
      type: todo.actions.INIT_APPLICATION
    });
  }

});