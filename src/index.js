import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectSubreddit, fetchPostsIfNeeded } from './actions';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

function render(state) {
  new Promise((resolve, reject) => {
    if (document.readyState == 'complete') {
      return resolve();
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve());
    }
  }).then(() => {
      const subreddit = state.postsBySubreddit[state.selectSubreddit];
      if (!subreddit) return;

      const appElem = document.getElementById('app');
      const titleElem = document.createElement('h2');
      titleElem.innerHTML = `reddit@${state.selectSubreddit}`;

      const ulElem = document.createElement('ul');
      for (let post of subreddit.items) {
        const itemElem = document.createElement('li');
        const anchorElem = document.createElement('a');
        anchorElem.href = post.url;
        anchorElem.innerHTML = post.title;
        itemElem.appendChild(anchorElem);
        ulElem.appendChild(itemElem);
      }

      appElem.innerHTML = '';
      appElem.appendChild(titleElem);
      appElem.appendChild(ulElem);
    });
}

store.subscribe(() => render(store.getState()));
store.dispatch(selectSubreddit('reactjs'));
store.dispatch(fetchPostsIfNeeded('reactjs'));  
