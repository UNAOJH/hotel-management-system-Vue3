<template>
  <div class="app-container home">
    <!-- 欢迎标题 -->
    <el-card shadow="hover" style="text-align: center;">
      <h2>🏨 欢迎使用「酒店综合管理系统」</h2>
      <p>为中小型酒店提供集预订、入住、退房、房态、统计于一体的数字化解决方案</p>
      <div style="text-align: center; margin-top: 10px;">
        <el-tag type="info">公网部署</el-tag>
        <el-link type="primary" href="http://hotel.unaojhfnos.top" target="_blank" style="margin-left: 5px;">
          https://hotel.unaojhfnos.top
        </el-link>
      </div>
    </el-card>

    <!-- 系统功能模块 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col v-for="(item, index) in cards" :key="item.title" :span="6" class="col-item fade-item"
              :style="{ animationDelay: (index * 0.1) + 's' }" :class="{ 'fade-in': show }">
        <el-card shadow="hover">
          <h3>{{ item.icon }} {{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </el-card>
      </el-col>
    </el-row>


    <!-- 开发背景与目的 -->
    <el-card class="fade-item" shadow="hover" :class="{ 'fade-in': show }" style="margin-top: 20px;">
      <h3>🔍 开发背景</h3>
      <p>
        当前中小型酒店普遍存在管理效率低、手工记录繁杂、房态更新滞后等问题，
        本系统旨在通过信息化手段，简化管理流程，提升服务质量，实现运营数据可视化，增强管理者对酒店运营的掌控力。
      </p>
    </el-card>

    <!-- 系统作者与致谢 -->
    <el-card class="fade-item" shadow="hover" :class="{ 'fade-in': show }"
             style="margin-top: 20px; background-color: #f5f7fa;">
      <h3>🧑‍💻 系统开发者</h3>
      <p>
        本系统由 <strong>张俊豪（学号23190202）欧阳志云（学号23190215）</strong> 独立设计与开发完成，基于若依快速开发平台改造。<br/>
        如果你觉得本项目对你有帮助，欢迎
        <a href="https://github.com/UNAOJH/hotel-management-system" target="_blank"
           style="color: #409EFF; text-decoration: none;">访问我们的 GitHub 项目 🌟</a>、
        Star 🌟 / Fork 🔧 / 交流 💬。
      </p>
      <p style="color: #999; margin-top: 10px;">
        版权所有 © 2025 张俊豪 & 欧阳志云（23190202 / 23190215） · 本系统仅用于学习和教学目的
      </p>
    </el-card>

  </div>
</template>

<script setup name="Index">
import {ref, onMounted} from 'vue'

const version = ref('3.9.0')


const cards = ref([
  {title: '智能预订', icon: '📅', desc: '客户自主在线预订与取消，完整预订历史记录与状态追踪'},
  {title: '智能入住', icon: '🛏️', desc: '自动化房间分配，支持散客和团队的差异化登记流程'},
  {title: '实时房态', icon: '🔄', desc: '可视化房间状态（清洁/维修/停用），支持扫码报修功能'},

  {title: '数据看板', icon: '📊', desc: '多维度运营分析：入住率趋势、收益对比、客源统计'},
  {title: '安全接入', icon: '🌐', desc: '使用Cloudflare隧道加密通信，保障公网访问安全稳定'},

  {title: '权限管家', icon: '🔐', desc: '基于角色的细粒度权限控制，支持操作日志审计'},
  {title: '扩展框架', icon: '⚙️', desc: '模块化架构设计，方便后续功能插件扩展'},

  {title: '容器化支持', icon: '🐳', desc: '支持Docker容器化部署，兼容1Panel管理平台'},
  {title: 'UI体验', icon: '🎨', desc: 'Element-Plus组件库 + 响应式布局，统一设计规范'},

  {title: '验证码防刷', icon: '🔒', desc: '登录注册支持验证码，防止机器人恶意注册'},
  // {title: '自动备份', icon: '💽', desc: '支持定时自动备份数据库，保障数据安全'},

  {title: '持续进化', icon: '🚀', desc: '定期功能更新，持续优化用户体验'}
])

const show = ref(false)
onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 100) // 延迟给动画加class，触发动画
})

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">

.el-card {
  min-height: 150px;      /* 你根据需要调节 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}


.col-item {
  margin-bottom: 20px;
}

/* 初始状态：透明，下移 */
.fade-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

/* 加了fade-in类后触发动画 */
.fade-item.fade-in {
  opacity: 1;
  transform: translateY(0);
}


.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

h2,
h3 {
  margin-bottom: 10px;
}

p,
li {
  font-size: 14px;
  line-height: 1.6;
}

.features {
  margin: 20px 0;
  padding: 15px;
  background-color: #f7f9fc;
  border-radius: 8px;
}

.features h2 {
  font-weight: 700;
  margin-bottom: 15px;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  margin-bottom: 8px;
  font-size: 16px;
}
</style>
