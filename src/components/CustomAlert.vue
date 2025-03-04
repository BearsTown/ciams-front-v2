<template>
  <transition name="customAlert" appear>
    <div v-if="show" id="customAlert" class="success">
      <img src="../assets/img/ico_alert-success.svg" alt="" /> Success!
    </div>
    <!-- <div v-if="show" id="customAlert" class="error">
      <img src="../assets/img/ico_alert-error.svg" alt=""/> Error!
    </div>
    <div v-if="show" id="customAlert" class="warning">
      <img src="../assets/img/ico_alert-warning.svg" alt=""/> Warning!
    </div>
    <div v-if="show" id="customAlert" class="alert-basic">
      <img src="../assets/img/ico_alert-basic.svg" alt=""/> Info!
    </div> -->
  </transition>
</template>

<script>
  export default {
    name: 'CustomAlert',
    data() {
      return {
        show: true,
      }
    },
    mounted() {
      setTimeout(() => {
        this.show = false
      }, 1000)
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #customAlert {
    position: fixed;
    top: 10px;
    left: 50%;
    width: 325px;
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, 0);
    opacity: 0;
    z-index: 9999;
    animation: alertTransition 0.8s linear;
  }
  #customAlert img {
    margin-right: 14px;
  }
  #customAlert.success {
    background: #d1e7dd;
    color: #0f5133;
  }
  #customAlert.error {
    background: #f8d7da;
    color: #d71920;
  }
  #customAlert.warning {
    background: #fff3cd;
    color: #664d03;
  }
  #customAlert.basic {
    background: #cff4fc;
    color: #075162;
  }
  @keyframes alertTransition {
    0% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    60% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -10%);
    }
  }
</style>
