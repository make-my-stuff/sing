/*
 * 1. Single Immutable State Tree : Whole state of application is represented as a javascript object (Data + UI state). State tree is minimal representation of application.
 * 2. State change is described by Action : State Tree is Read-only. Changes are made by dispatching actions. Action is minimal representation of change to data/state.
 * 3. 
 * 
 * UI (view layer) is most predictable when described as pure function of application state. State mutation should be described as pure function as well [ prev state + action = new state]
 * action : { 'type' : 'ACTION_TYPE' }. Actions can be initiated/triggered by "network request", "browser event", "user action" etc.
 * 
 * UI = f(state)
 * state = g(state, action/trigger) [Function g is called a reducer]
*/

const StateManager = ((context) => {
    let state;
    let subscribers = [];
    let stateModifier;

    function StateManager(stateModifier, initialState = {}) {
        if(typeof StateManager.instance === 'object') {
            return StateManager.instance;
        }

        state = initialState;
        StateManager.instance = this;
    }

    StateManager.prototype.getState = () => {
        return state;
    }

    StateManager.prototype.subscribe = (subscriber) => {
        if(typeof subscriber === 'function') {
            subscribers.push(subscriber);
            return () => {
                subscribers = subscribers.filter(sub => sub !== subscriber);
            }
        } else {
            return false;
        }
    }

    StateManager.prototype.dispach = (action) => {
        state = stateModifier(state, action);
        subscribers.forEach(subscriber => {
            subscriber(state);
        });
    }

    return StateManager
})(this)