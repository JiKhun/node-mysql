var nodemailer = require('nodemailer');

exports.sendmail = function (req, res, next) {
    var mail = req;
    //邮件发送
    var transporter = nodemailer.createTransport({
        service: '163',
        auth: {
            user: 'KhunHH@163.com',//你的163邮箱账号
            pass: '13075700225q'//你的163邮箱密码
        }
    });
    var mailOptions = {
        from: 'KhunHH@163.com', // sender address
        to:mail, // list of receivers
        subject: '测试邮件', // Subject line
        text: 'Nodejs之邮件发送', // plaintext body
        html:"<h2>欢迎关注我的GitHub，一起学习Nodejs。https://github.com/Chen-xy</h2>"
    };

    transporter.sendMail(mailOptions, function(error, info){
        console.log(mailOptions)
        if(!error){
            console.log("邮件发送成功，请注意查收！");
        }else{
            console.log(error);
            console.log("邮件发送失败，请稍后重试！");
        }
    });
};