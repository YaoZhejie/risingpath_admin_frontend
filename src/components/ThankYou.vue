<template>
  <div class="thank-you">
    <div class="thank-you-content">
      <div class="thank-you-message">
        <p class="greeting">学弟学妹们，你们好：</p>
        <p>感谢您在未来的某一天来访问我的网站。该网站提供了各种浙江专升本的资料链接，可以免费获取，也可以查询到符合您</p>
        <p>专业条件院校、专业以及近三年的分数线,作者本人也是从专科升到本科，也经历过专升本考试，尤其在最后填报志愿时因</p>
        <p>没有合适的信息而苦恼，而不断在网上寻找近几年符合自己真实实力的院校，希望该网站可以帮助到你们，在这里感谢送自</p>
        <p>己成功进入本科学习的升本机构非凡教育，让自己有能在更高学府深造的机会，在这里强调一下，该网站所有资源服务免费</p>
        <p>并且将会长期开放，学习资料也是以前教过我的老师提供的，并且还会持续更新，该网站由本人全栈开发，还有许多不足的</p>
        <p>地方，希望懂计算机技术的大佬高台贵手，不要恶意攻击我的网站，如有意见或建议，或想交流学习可加页脚微信联系到我</p>
        <p>也可以在网站发送邮件到信箱。</p>
        <br>
        <p class="closing">网站更新动态可关注抖音："emo小姚"</p>
        <p class="closing">乾坤未定，你我皆是黑马，升本加油！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThankYou",
};
</script>

<style scoped>
.thank-you {
  box-sizing: border-box;
  /* max-width: 1000px; */
  margin: 0 auto;

}

.thank-you-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.thank-you-message {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 20px;
  line-height: 1.5;
  color: #333;
  margin-top: 20px;
}

.thank-you-message p {
  margin-bottom: 10px;
}

.thank-you-message .greeting {
  font-size: 24px;
  font-weight: bold;
}

.thank-you-message .closing {
  font-style: italic;
  color: slateblue;
  font-weight: bold;
}
</style>