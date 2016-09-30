//modules
import { v4 } from 'node-uuid';
//templates
import template from './Todo.hbs';

//vendor styles
import 'foundation/scss/normalize.scss';
import 'foundation/scss/foundation.scss';

//local styles
import './Todo.scss';

class Todo {
  template = template;

  constructor(el) {
    this.el = el;
  }

  data() {
    return {
      newTodo: '',
      todoEntities: {
        first: {label: 'Refactor shitty legacy', isDone: true}
      }

    }
  }

  /*
   *
   * Caveats!
   * We do not have any reference to the ractive object! Hmm lets try and dig deep
   * within the events object.... found it! events.node._ractive.root *whew*
   * /Caveats!
   *
   */

  handleInputChange = ({context: {newTodo}, node: {_ractive: {root:ractive}}}) =>  {
    ractive.set({
      todoEntities: Object.assign(ractive.get('todoEntities'), {
        [v4()]: {label: newTodo, isDone: false}
      }),
      newTodo: ''
    });
  }

  handleToggleTodo = ({ node: {id, _ractive: {root:ractive}}}) => {
    ractive.set(`todoEntities.${id}.isDone`, !ractive.get(`todoEntities.${id}.isDone`));
  }
}

export {
  Todo as default
}