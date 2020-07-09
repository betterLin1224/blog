// 导入用户集合构造函数
const { User } = require('../../model/user');
// 导入 bcrypt
const bcrypt = require('bcrypt');

const login = async(req, res) => {
    // 接受请求参数
    const { email, password } = req.body;
    // 如果用户没有输入邮箱地址
    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error', { msg: '邮件地址或者密码错误' });
    }
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型 对象中存储的时用户信息
    // 如果没有查询到用户 user变量为空
    let user = await User.findOne({ email });
    // 查询到了用户
    if (user) {
        // 将客户端传递过来的密码和用户信息中的密码进行比对
        // true 比对成功
        // false 比对失败
        let isValid = await bcrypt.compare(password, user.password);
        // 如果密码比对成功
        if (isValid) {
            // 登录成功
            // 将用户名存储在请求对象中
            req.session.username = user.username;
            req.session.role = user.role;
            // res.send('登录成功');
            req.app.locals.userInfo = user;
            // 对用户的角色进行判断
            if (user.role == 'admin') {
                // 重定向到用户列表页面
                res.redirect('/admin/user');
            } else {
                // 重定向到博客首页
                res.redirect('/home/');
            }
        } else {
            // 密码不匹配
            res.status(400).render('admin/error', { msg: '邮箱地址或者密码错误' })
        }
    } else {
        // 没有查询到用户
        res.status(400).render('admin/error', { msg: '邮箱地址或密码错误' })
    }
}

// 暴露出去
module.exports = login;