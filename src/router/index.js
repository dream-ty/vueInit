import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
const User = {
  template: '<div>User1 {{ $route.params.id }} <div><router-view></router-view></div></div>'
}
const User2 = {
  template: '<div>User2</div>'
}
const Profile = {
  template: '<div>Profile</div>'
}
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/abc",
    name: "ABC",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Abc"),
  },
  {
    path: "/users/:id",
    name: "Users",
    component: User,
    // children: [
    //   {
    //     path: "profile",
    //     component: User2,
    //   }
    //
    // ],
    children: [
      // UserHome will be rendered inside User's <router-view>
      // when /user/:id is matched
      { path: '', component: User2 },

      // UserProfile will be rendered inside User's <router-view>
      // when /user/:id/profile is matched
      { path: 'profile', component: Profile },

      // UserPosts will be rendered inside User's <router-view>
      // when /user/:id/posts is matched
      { path: 'posts', component: User2 }
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
console.log(1111);
export default router;
