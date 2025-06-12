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
    <el-card class="fade-item" shadow="hover" :class="{ 'fade-in': show }" style="margin-top: 20px; background-color: #f5f7fa;">
      <h3>🧑‍💻 系统开发者</h3>
      <p>
        本系统由 <strong>张俊豪（学号23190202）欧阳志云（学号23190215）</strong> 独立设计与开发完成，基于若依快速开发平台改造。<br />
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
import { ref, onMounted } from 'vue'
const version = ref('3.9.0')


const cards = ref([
  { title: '预订管理', icon: '📅', desc: '支持客户自主预订、取消与预定历史追踪。' },
  { title: '入住安排', icon: '🛏️', desc: '登记入住信息，自动分配房间，支持客户类型区分。' },
  { title: '房态维护', icon: '🧹', desc: '实时查看房间状态，支持清扫、维修、暂停使用等。' },
  { title: '运营报表', icon: '📊', desc: '提供入住率、收益、客户来源等多维度统计。' },
  { title: '公网部署', icon: '🌐', desc: '支持通过 Cloudflare 隧道实现安全稳定的公网访问。' },
  { title: '权限管理', icon: '🔒', desc: '基于角色的细粒度权限控制，保证系统安全。' },
  { title: '易扩展', icon: '⚙️', desc: '模块化设计，方便未来功能快速迭代和扩展。' },
  { title: '数据备份', icon: '💾', desc: '支持定期自动备份，确保数据安全无忧。' },
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
