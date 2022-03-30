import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={SignIn} />

      <Route exact path="/dashboard" component={Dashboard} isPrivate />
      <Route exact path="/profile" component={Profile} isPrivate />
    </Switch>
  )
}