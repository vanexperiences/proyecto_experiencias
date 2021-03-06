import './App.css';
import MainHeader from './components/header/Header';
import Footer from './components/footer/Footer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './routes/routes';
import Home from './pages/home/Home';
import { useState } from 'react';
import ScrollToTopRouter from './components/ScrollTopRouter/ScrollTopRouter';
import AutoScrollToTop from './components/AutoScrollToTop/AutoScrollToTop';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ErrorBoundary from './components/errorBoundaries/ErrorBoundaries';

function App() {
  const [home] = useState();
  const [scrollBtn, setScrollBtn] = useState(false);

  function handleScroll() {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 200) {
      setScrollBtn(true);
    } else if (scrolled <= 200) {
      setScrollBtn(false);
    }

    if (scrolled > 90) {
      const header = document.querySelector('header');
      const { body } = document;
      body.style.cssText = `margin-top: 300px;`;
      header.style.cssText = `
        position: fixed;
        top: 0;
        box-shadow: 0 5px 20px rgb(0 0 0 / 10%);
        z-index: 999;
      `;
    } else if (scrolled <= 90) {
      const header = document.querySelector('header');
      const { body } = document;
      body.style.cssText = `margin-top: 0px;`;
      header.style.cssText = `
        position: static;
      `;
    }
  }

  window.addEventListener('scroll', handleScroll);

  return (
    <Router>
      <div className="App posRel">
        <ScrollToTopRouter />
        <MainHeader />
        <ErrorBoundary>
          <Switch>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} exact>
                {route.private ? (
                  <PrivateRoute>
                    <route.Page />
                  </PrivateRoute>
                ) : (
                  <route.Page />
                )}
              </Route>
            ))}
            {home && <Home />}
          </Switch>
        </ErrorBoundary>
        <Footer />
        {scrollBtn && <AutoScrollToTop />}
      </div>
    </Router>
  );
}

export default App;
