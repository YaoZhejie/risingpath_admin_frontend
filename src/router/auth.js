// auth.js

export default function (to, from, next) {
    const isLoggedIn = localStorage.getItem('username');
  
    if (!isLoggedIn) {
      next({ name: 'login-in' }); // 如果未登录，则重定向到登录页或其他指定的页面
      alert('请先登录！');
    } else {
      next(); // 如果已登录，则继续导航到目标路由
    }
  }