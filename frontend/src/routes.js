/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from 'views/Index.js';
import Profile from 'views/examples/Profile.js';
import Maps from 'views/examples/Maps.js';
import Register from 'views/examples/Register.js';
import Login from 'views/examples/Login.js';
import Tables from 'views/examples/Tables.js';
import ChatBot from 'views/examples/chatbot.js';
import Icons from 'views/examples/Icons.js';
import Logout from 'views/examples/Logout.js'; // Import du composant Logout (à créer)

var routes = [
  {
    path: '/index',
    name: 'Tableau de bord',
    icon: 'ni ni-tv-2 text-primary',
    component: <Index />,
    layout: '/admin',
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  {
    path: '/user-profile',
    name: 'Profil utilisateur',
    icon: 'ni ni-single-02 text-yellow',
    component: <Profile />,
    layout: '/admin',
  },
  {
    path: '/tables',
    name: 'Tableaux',
    icon: 'ni ni-bullet-list-67 text-red',
    component: <Tables />,
    layout: '/admin',
  },
  {
    path: '/chatbot',
    name: 'Assistant IA',
    icon: 'ni ni-chat-round text-info',
    component: <ChatBot />,
    layout: '/admin',
  },
  // {
  //   path: '/login',
  //   name: 'Connexion',
  //   icon: 'ni ni-key-25 text-info',
  //   component: <Login />,
  //   layout: '/auth',
  // },
  // {
  //   path: '/register',
  //   name: 'Inscription',
  //   icon: 'ni ni-circle-08 text-pink',
  //   component: <Register />,
  //   layout: '/auth',
  // },
  {
    path: '/logout',
    name: 'Déconnexion',
    icon: 'ni ni-button-power text-danger',
    component: <Logout />,
    layout: '/auth',
  },
];

export default routes;
